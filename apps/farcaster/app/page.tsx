"use client"

import { AmountSelector, type ConfirmSwipes, type DonationAmount, type StableCoin } from "@/components/amount-selector"
import { BadgeNotification } from "@/components/badge-notification"
import { Cart } from "@/components/cart"
import { CategoryMenu } from "@/components/category-menu"
import { CategorySection } from "@/components/category-section"
import { CommunityFunds } from "@/components/community-funds"
import { EditProfile } from "@/components/edit-profile"
import { Leaderboard } from "@/components/leaderboard"
import { MobileMockup } from "@/components/mobile-mockup"
import { ProfileQuickView } from "@/components/profile-quick-view"
import { ProjectCard } from "@/components/project-card"
import { ProjectRegistrationForm } from "@/components/project-registration-form"
import { StarryBackground } from "@/components/starry-background"
import { SuccessScreen } from "@/components/success-screen"
import { ToggleMenu } from "@/components/toggle-menu"
import { TrendingSection } from "@/components/trending-section"
import { UserProfile } from "@/components/user-profile"
import { WalletConnect } from "@/components/wallet-connect"
import { WeeklyDrop } from "@/components/weekly-drop"
import { useMobile } from "@/hooks/use-mobile"
import { boostProject, getProjects } from "@/lib/card-manager"
import { categories } from "@/lib/data"
import deployedContracts from "@/lib/deployedContracts"
import { useProfile } from "@farcaster/auth-kit"
import { sdk } from "@farcaster/miniapp-sdk"
import { Trophy } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { erc20Abi, formatEther, parseEther } from "viem"
import { useAccount, useConnect, useReadContract, useWriteContract } from "wagmi"

// ============================================================================
// CHAIN CONFIGURATION: CELO MAINNET (Chain ID: 42220)
// All contracts, tokens, and transactions are on Celo Mainnet
// ============================================================================
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" // Celo cUSD
const CEUR_ADDRESS = "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6CA73" // Celo cEUR
const SWIPE_DONATION_ADDRESS = deployedContracts[42220].SwipeDonation.address // Celo Mainnet


export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black text-white">Loading SwipePad...</div>}>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const { connect, connectors } = useConnect()
  const { profile } = useProfile()
  const [frameUser, setFrameUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"swipe" | "list" | "profile" | "trending" | "leaderboard">("swipe")

  // CRITICAL FIX: Aggressive SDK ready() call at component root
  useEffect(() => {
    console.log("🚀 CRITICAL: Calling sdk.actions.ready() with setTimeout");
    setTimeout(async () => {
      try {
        await sdk.actions.ready();
        console.log("✅ CRITICAL: sdk.actions.ready() SUCCESS");
      } catch (error) {
        console.error("❌ CRITICAL: sdk.actions.ready() FAILED:", error);
      }
    }, 1000);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "See All")
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [projects, setProjects] = useState<any[]>([])

  // Load projects on mount and when category changes
  useEffect(() => {
    const loadedProjects = getProjects(selectedCategory)
    setProjects(loadedProjects)
    setCurrentProjectIndex(0)
  }, [selectedCategory])

  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [cart, setCart] = useState<Array<{ project: any; amount: number; currency: StableCoin; message?: string }>>([])
  const [showCart, setShowCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [donationAmount, setDonationAmount] = useState<DonationAmount | null>(null)
  const [donationCurrency, setDonationCurrency] = useState<StableCoin>("cUSD")
  const [confirmSwipes, setConfirmSwipes] = useState<ConfirmSwipes>(20)

  // URL Params for Verification Callback
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get("status")
  const [isVerifyingCallback, setIsVerifyingCallback] = useState(false)

  // Wagmi Hooks
  const { address, isConnected, chain } = useAccount()
  const { writeContractAsync } = useWriteContract()

  // Use Wagmi's useBalance hook for reliable balance fetching
  const { data: cUSDBalance, isLoading: isLoadingBalance } = useBalance({
    address: address,
    token: CUSD_ADDRESS,
    chainId: 42220, // Celo Mainnet
    query: {
      enabled: !!address,
    }
  })

  // Debug Balance
  useEffect(() => {
    if (address) {
      console.log("💰 Wagmi Balance Check:", {
        address,
        cUSDBalance,
        formatted: cUSDBalance?.formatted,
        value: cUSDBalance?.value,
        isLoadingBalance
      });
    }
  }, [address, cUSDBalance, isLoadingBalance]);

  // Logic: Check if user has any funds (value > 0)
  const hasAnyStablecoin = cUSDBalance ? cUSDBalance.value > 0n : false;

  // Load Farcaster context for profile data
  useEffect(() => {
    const loadContext = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setFrameUser(context.user);
          // Update userProfile with Farcaster data
          setUserProfile(prev => ({
            ...prev,
            name: context.user.displayName || prev.name,
            image: context.user.pfpUrl || prev.image,
            farcaster: context.user.username || prev.farcaster,
          }));
        }
      } catch (error) {
        console.error("Error loading Frame context:", error);
      }
    };
    loadContext();
  }, []);

  useEffect(() => {
    if (status === "verified" && !isVerifyingCallback) {
      handleVerificationCallback()
    }
  }, [status])

  const handleVerificationCallback = async () => {
    setIsVerifyingCallback(true)
    setViewMode("profile")
    setShowEditProfile(true)

    // Clear the query param to prevent re-triggering on refresh
    router.replace("/", { scroll: false })

    if (!isConnected || !address) {
      alert("Please connect your wallet to claim your verification badge.")
      setIsVerifyingCallback(false)
      return
    }

    try {
      console.log("Verifying user on-chain...")
      // Assuming BoostManager is on Celo Sepolia (11142220) or Mainnet (42220)
      // We'll use the chain ID from the connected wallet or default to Celo Mainnet
      const chainId = chain?.id || 42220
      const contractAddress = deployedContracts[chainId as keyof typeof deployedContracts]?.BoostManager?.address || deployedContracts[42220].BoostManager.address

      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: deployedContracts[42220].BoostManager.abi,
        functionName: "setVerificationStatus",
        args: [true],
      })

      console.log("Verification TX:", txHash)
      alert("Verification successful! Your badge is being minted on-chain.")

      // Update local state
      setUserProfile(prev => ({ ...prev, isVerified: true })) // Assuming we add isVerified to userProfile

    } catch (error) {
      console.error("Verification failed:", error)
      alert("Failed to verify on-chain. Please try again.")
    } finally {
      setIsVerifyingCallback(false)
    }
  }

  // Determine token address based on selection
  const tokenAddress = donationCurrency === "cUSD" ? CUSD_ADDRESS :
    donationCurrency === "cEUR" ? CEUR_ADDRESS :
      undefined

  // Read Token Balance
  const { data: tokenBalance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
    }
  })

  // Read Allowance for SwipeDonation
  const { data: allowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && tokenAddress ? [address, SWIPE_DONATION_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
    }
  })

  console.log('🔍 CRITICAL hasAnyStablecoin:', hasAnyStablecoin);

  const [showBalanceAlert, setShowBalanceAlert] = useState(false)

  const [showBadgeNotification, setShowBadgeNotification] = useState(false)
  const [currentBadge, setCurrentBadge] = useState("")
  const [swipeCount, setSwipeCount] = useState(0)
  const [showProfileQuickView, setShowProfileQuickView] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [userStats, setUserStats] = useState({
    totalDonations: 0,
    categoriesSupported: new Set<string>(),
    streak: 0,
    lastDonation: null as Date | null,
  })
  const [userProfile, setUserProfile] = useState({
    name: "User",
    image: "", // Will be populated by Farcaster SDK
    farcaster: "",
    lens: "",
    zora: "",
    twitter: "",
    nounsHeld: 0,
    lilNounsHeld: 0,
    totalSwipes: 0,
    projectsReported: 0,
    totalDonated: 0,
    poaps: 0,
    paragraphs: 0,
    isVerified: false,
  })

  // Sync Farcaster profile to local state
  useEffect(() => {
    if (profile) {
      setUserProfile(prev => ({
        ...prev,
        name: profile.displayName || profile.username || prev.name,
        image: profile.pfpUrl || prev.image,
        farcaster: profile.username || prev.farcaster
      }))
    }
  }, [profile])
  const [userBalance, setUserBalance] = useState({
    cUSD: 0,
    cEUR: 0,
    cGBP: 0,
    cAUD: 0,
    cCHF: 0,
    cCAD: 0,
    cKES: 0,
    cREAL: 0,
    cZAR: 0,
    cCOL: 0,
    cJPY: 0,
    USDC: 0,
    USDT: 0,
    GLO: 0,
    USDD: 0,
  })

  // Update userBalance when on-chain data changes
  useEffect(() => {
    if (stablecoinBalances) {
      const newBalances = { ...userBalance }
      
      if (stablecoinBalances[0]?.status === 'success') {
        newBalances.cUSD = parseFloat(formatEther(stablecoinBalances[0].result as bigint))
      }
      if (stablecoinBalances[1]?.status === 'success') {
        newBalances.cEUR = parseFloat(formatEther(stablecoinBalances[1].result as bigint))
      }
      
      setUserBalance(newBalances)
    }
  }, [stablecoinBalances])

  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [shownBadges, setShownBadges] = useState<Set<string>>(new Set())

  const recentDonations = cart.slice(0, 5).map((item, index) => ({
    project: item.project,
    amount: item.amount,
    currency: item.currency,
    date: new Date(Date.now() - index * 86400000), // Today, yesterday, etc.
  }))

  const savedProjects = projects.slice(0, 3)

  const filteredProjects = projects // Projects are already filtered and shuffled by getProjects

  useEffect(() => {
    let isMounted = true

    const checkStreak = () => {
      if (!isMounted) return 0
      if (userStats.lastDonation) {
        const lastDonationDate = new Date(userStats.lastDonation)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - lastDonationDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 1) {
          return userStats.streak
        } else {
          return 0
        }
      }
      return 0
    }

    const checkBadges = () => {
      if (!isMounted) return

      if (userStats.totalDonations === 1 && !shownBadges.has("First Swipe")) {
        setCurrentBadge("First Swipe")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "First Swipe"]))
      } else if (checkStreak() === 5 && !shownBadges.has("5-Day Streak")) {
        setCurrentBadge("5-Day Streak")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "5-Day Streak"]))
      } else if (userStats.categoriesSupported.size >= 3 && !shownBadges.has("Category Champion")) {
        setCurrentBadge("Category Champion")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "Category Champion"]))
      }
    }

    checkBadges()

    return () => {
      isMounted = false
    }
  }, [userStats, shownBadges])

  const handleSwipeRight = async () => {
    console.log("👉 handleSwipeRight triggered");
    if (donationAmount === null) {
        console.log("❌ donationAmount is null");
        return
    }

    // Global Rule: Check for any stablecoin balance
    // DISABLED per user request
    // if (!hasAnyStablecoin) {
    //   setShowBalanceAlert(true)
    //   return
    // }

    const project = filteredProjects[currentProjectIndex]
    console.log("👉 Swiping on project:", project?.name);

    // 1. Wallet Guard
    if (!isConnected || !address) {
      console.log("❌ Wallet not connected, attempting to connect...");
      const fcConnector = connectors.find(c => c.name === "Farcaster Wallet");
      const targetConnector = fcConnector || connectors[0];

      if (targetConnector) {
          try {
            console.log("Connecting to:", targetConnector.name);
            connect({ connector: targetConnector })
          } catch (e) {
            console.error("Connection failed:", e)
            alert("Please connect your wallet first.")
          }
      } else {
          alert("Please connect your wallet first.")
      }
      return
    }

    if (!project.walletAddress) {
      console.log("❌ Project has no wallet address");
      alert("This project does not have a configured wallet address.")
      return
    }

    if (!tokenAddress) {
      console.log("❌ No token address selected");
      alert("Selected currency is not supported on this network yet.")
      return
    }

    // Parse Amount
    const amountStr = donationAmount.split(" ")[0].replace(/[^0-9.]/g, "")
    const amountNum = parseFloat(amountStr)
    if (isNaN(amountNum)) {
      console.log("❌ Invalid amount:", amountStr);
      alert("Invalid donation amount.")
      return
    }
    const amountWei = parseEther(amountNum.toString())
    console.log("👉 Amount to donate:", amountNum, "Wei:", amountWei.toString());

    // 2. Balance Check
    // We'll log it but NOT block if they want "free swiping" experience, 
    // BUT for real donation we must check.
    // If they have 0 balance, writeContract will fail anyway.
    if (tokenBalance === undefined || tokenBalance < amountWei) {
      console.log("❌ Insufficient balance. TokenBalance:", tokenBalance?.toString(), "Required:", amountWei.toString());
      // alert("You do not have stablecoin on Celo to perform this action. Please deposit stablecoin into your wallet to use SwipePad.")
      // return
      // We allow them to proceed to try the transaction, maybe the wallet handles the error or they have funds we didn't see.
      // Or we just warn them.
    }

    try {
      // 3. Allowance Check & Approve
      if (allowance === undefined || allowance < amountWei) {
        console.log("Requesting approval...")
        const approveHash = await writeContractAsync({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [SWIPE_DONATION_ADDRESS, parseEther("1000000")], // Approve large amount for UX
        })
        console.log("✅ Approval sent:", approveHash);
        alert("Approval transaction sent. Please wait a moment for it to confirm, then swipe again.")
        return
      }

      // 4. Donate Call
      console.log(`Donating ${amountNum} ${donationCurrency} to ${project.name} (${project.walletAddress})`)
      const txHash = await writeContractAsync({
        address: SWIPE_DONATION_ADDRESS,
        abi: deployedContracts[42220].SwipeDonation.abi,
        functionName: "donate",
        args: [tokenAddress, project.walletAddress, amountWei],
      })
      console.log("Donation TX:", txHash)

      // Proceed with UI updates only after successful initiation
      // Update user stats
      setUserStats((prev) => {
        const categoriesSupported = new Set(prev.categoriesSupported)
        categoriesSupported.add(project.category)

        return {
          totalDonations: prev.totalDonations + 1,
          categoriesSupported,
          streak: prev.lastDonation ? prev.streak + 1 : 1,
          lastDonation: new Date(),
        }
      })

      // Update user profile stats
      setUserProfile((prev) => ({
        ...prev,
        totalSwipes: prev.totalSwipes + 1,
        totalDonated: prev.totalDonated + amountNum,
      }))

      // Add to cart (Legacy logic, maybe keep for history?)
      const newCart = [...cart, { project, amount: amountNum, currency: donationCurrency }]
      setCart(newCart)

      // Increment swipe count
      const newSwipeCount = swipeCount + 1
      setSwipeCount(newSwipeCount)

      // Show success screen after reaching confirm swipes threshold
      if (newSwipeCount >= confirmSwipes) {
        setShowSuccess(true)
        setSwipeCount(0)
      }

      // Move to next project
      if (currentProjectIndex < filteredProjects.length - 1) {
        setCurrentProjectIndex(currentProjectIndex + 1)
      } else {
        setCurrentProjectIndex(0)
      }

    } catch (error) {
      console.error("Transaction failed:", error)
      alert("Transaction failed. Please try again.")
      return
    }
  }

  const handleSwipeLeft = () => {
    // Global Rule: Check for any stablecoin balance
    if (!hasAnyStablecoin) {
      setShowBalanceAlert(true)
      return
    }

    // Update swipe count even for skips
    setUserProfile((prev) => ({
      ...prev,
      totalSwipes: prev.totalSwipes + 1,
    }))

    if (currentProjectIndex < filteredProjects.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1)
    } else {
      setCurrentProjectIndex(0)
    }
  }

  const handleRewind = () => {
    if (currentProjectIndex > 0) {
      setCurrentProjectIndex(currentProjectIndex - 1)
    }
  }

  const handleAmountSelect = (amount: DonationAmount, currency: StableCoin, swipes: ConfirmSwipes) => {
    setDonationAmount(amount)
    setDonationCurrency(currency)
    setConfirmSwipes(swipes)
    setSwipeCount(0) // Reset swipe count when starting new session
  }

  const handleCheckout = async () => {
    setShowCart(false)
    setShowSuccess(true)

    const uniqueCategories = new Set<string>()
    cart.forEach((item) => uniqueCategories.add(item.project.category))

    setUserStats((prev) => ({
      totalDonations: prev.totalDonations + cart.length,
      categoriesSupported: new Set([...prev.categoriesSupported, ...uniqueCategories]),
      streak: prev.lastDonation ? prev.streak + 1 : 1,
      lastDonation: new Date(),
    }))

    setCart([])
    setSwipeCount(0)
  }

  const handleCategoryProjectDonate = async (project: any, amount = 5) => {
    // Real Transaction Flow for "View All" / Category List
    if (!isConnected || !address) {
      alert("Please connect your wallet first.")
      return
    }

    if (!project.walletAddress) {
      alert("This project does not have a configured wallet address.")
      return
    }

    const currency = "cUSD"
    const tokenAddr = CUSD_ADDRESS
    const amountWei = parseEther(amount.toString())

    // Balance Check
    // We need to read balance here or rely on global state. 
    // For simplicity, we'll assume userBalance.cUSD is up to date or check hasAnyStablecoin
    if (!hasAnyStablecoin) {
      setShowBalanceAlert(true)
      return
    }

    try {
      // Donate Call (Assuming allowance is handled or we prompt for it)
      // Note: In a real app we should check allowance here too. 
      // For now, let's try to donate, if it fails due to allowance, we catch it.
      // But better to be safe:
      
      // We can't easily check allowance synchronously here without a hook, 
      // so we'll just try to write. If it fails, we might need to prompt approve.
      // Or we can just reuse the writeContractAsync pattern.
      
      console.log(`Donating ${amount} ${currency} to ${project.name}`)
      
      // Check allowance (optimistic or try/catch)
      // Since we don't have the allowance hook for *this specific amount* ready, 
      // we'll proceed to donate. If it fails, user sees error.
      
      const txHash = await writeContractAsync({
        address: SWIPE_DONATION_ADDRESS,
        abi: deployedContracts[42220].SwipeDonation.abi,
        functionName: "donate",
        args: [tokenAddr, project.walletAddress, amountWei],
      })
      
      console.log("Donation TX:", txHash)

      setUserStats((prev) => {
        const categoriesSupported = new Set(prev.categoriesSupported)
        categoriesSupported.add(project.category)

        return {
          totalDonations: prev.totalDonations + 1,
          categoriesSupported,
          streak: prev.lastDonation ? prev.streak + 1 : 1,
          lastDonation: new Date(),
        }
      })

      setCart([...cart, { project, amount, currency: "cUSD" }])
      setShowSuccess(true)

    } catch (error: any) {
      console.error("Transaction failed:", error)
      // Simple heuristic for allowance error
      if (error.message?.includes("allowance") || error.message?.includes("transfer amount exceeds allowance")) {
         alert("Please approve cUSD usage first. (Go to Swipe mode to approve)")
      } else {
         alert("Transaction failed. Please try again.")
      }
    }
  }

  const handleProjectBoost = (project: any, amount: number) => {
    console.log(`Boosting ${project.name} with $${amount}`)
    boostProject(project.id, amount)
    // Re-fetch projects to update order (in a real app this might be more optimized)
    const updatedProjects = getProjects(selectedCategory)
    setProjects(updatedProjects)
    alert(`Successfully boosted ${project.name} with $${amount}!`)
  }

  const handleRegisterProject = () => {
    setShowRegistrationForm(true)
  }

  const handleRegistrationSubmit = (formData: any) => {
    console.log("Project registration submitted:", formData)
    alert("Thank you! Your project registration has been submitted for review.")
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // Continue with current settings, don't reset donation amount
  }

  const handleProfileSave = (profileData: any) => {
    setUserProfile((prev) => ({
      ...prev,
      ...profileData,
    }))
  }

  const projectsByCategory = categories.reduce(
    (acc, category) => {
      // For list view, we might want to fetch fresh random lists or keep them consistent
      // Here we fetch fresh for simplicity
      const categoryProjects = getProjects(category)
      if (categoryProjects.length > 0) {
        acc[category] = categoryProjects
      }
      return acc
    },
    {} as Record<string, any[]>,
  )

  const AppContent = () => (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {!walletConnected ? (
        <WalletConnect onConnect={() => setWalletConnected(true)} />
      ) : (
        <>
          {/* Fixed Header */}
          <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="flex flex-col items-center py-2">
              <div className="flex items-center justify-between w-full mb-1 px-6">
                <div className="w-8"></div>
                <div className="flex-1 flex justify-center">
                  <h1
                    className="text-lg font-bold text-center text-white"
                    style={{ fontFamily: "Pixelify Sans, monospace" }}
                  >
                    SwipePad
                  </h1>
                </div>
                <button
                  onClick={handleRegisterProject}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#677FEB] text-white hover:bg-[#5A6FD3] transition-colors"
                  title="Register Project"
                >
                  <RegisterIcon />
                </button>
              </div>

              {walletConnected && (
                <div className="bg-transparent rounded-full px-4 py-0 mb-2 flex items-center">
                  <span className="text-[#FFD600] font-bold text-sm mr-1">{userBalance[donationCurrency || "cUSD"]}</span>
                  <span className="text-gray-400 text-xs mr-1">{donationCurrency || "cUSD"}</span>
                  {/* Optional: Currency selector could go here */}
                </div>
              )}

              <div className="flex justify-between w-full px-6 space-x-2 mt-4">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full relative"
                  onClick={() => setShowEditProfile(true)}
                >
                  <img
                    src={userProfile.image || "/placeholder.svg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700"
                  onClick={() => setViewMode("leaderboard")}
                >
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700"
                  onClick={() => setViewMode("trending")}
                >
                  <TrendingIcon />
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#677FEB] relative"
                  onClick={() => setShowCart(true)}
                >
                  <CartIcon />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FFD600] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === "profile" ? (
              <UserProfile stats={userStats} onBack={() => setViewMode("swipe")} />
            ) : viewMode === "leaderboard" ? (
              <Leaderboard userStats={userStats} userProfile={userProfile} onBack={() => setViewMode("swipe")} />
            ) : viewMode === "trending" ? (
              <div className="px-6 py-6">
                <TrendingSection onDonate={handleCategoryProjectDonate} />
                <CommunityFunds onDonate={handleCategoryProjectDonate} />
                <WeeklyDrop onDonate={handleCategoryProjectDonate} />
                <button
                  onClick={() => setViewMode("swipe")}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors mt-6"
                >
                  Back to Swipe
                </button>
              </div>
            ) : (
              <div className="py-1">
                <div className={donationAmount === null ? "mt-6 mb-2" : ""}>
                  <ToggleMenu
                    viewMode={viewMode === "swipe" ? "swipe" : "list"}
                    setViewMode={(mode) => setViewMode(mode)}
                    large={donationAmount === null}
                  />
                </div>

                {viewMode === "swipe" ? (
                  <>
                    {donationAmount === null ? (
                      <AmountSelector onSelect={handleAmountSelect} />
                    ) : (
                      <>
                        <CategoryMenu
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          setCurrentProjectIndex={() => setCurrentProjectIndex(0)}
                        />

                        <div className="mb-1 px-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm text-gray-300">Donating: </span>
                              <span className="font-bold text-[#FFD600]">
                                {donationAmount} {donationCurrency}
                              </span>
                            </div>
                            <button
                              onClick={() => setDonationAmount(null)}
                              className="text-sm text-gray-300 hover:text-white underline"
                            >
                              Change
                            </button>
                          </div>
                          <div className="mt-1 bg-gray-800 rounded-lg p-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Swipes until confirmation:</span>
                              <span>{confirmSwipes - swipeCount} more</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-[#FFD600] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(swipeCount / confirmSwipes) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="px-6">
                          {filteredProjects.length > 0 && (
                            <ProjectCard
                              project={filteredProjects[currentProjectIndex]}
                              onSwipeLeft={handleSwipeLeft}
                              onSwipeRight={handleSwipeRight}
                              onRewind={handleRewind}
                              viewMode="swipe"
                              donationAmount={donationAmount}
                              donationCurrency={donationCurrency}
                              onBoost={(amount) => handleProjectBoost(filteredProjects[currentProjectIndex], amount)}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-6">
                    {Object.entries(projectsByCategory)
                      .filter(([category]) => category !== "See All")
                      .map(([category, categoryProjects]) => (
                        <CategorySection
                          key={category}
                          category={category}
                          projects={categoryProjects}
                          onDonate={handleCategoryProjectDonate}
                          onBoost={handleProjectBoost}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {showCart && <Cart items={cart} onClose={() => setShowCart(false)} onCheckout={handleCheckout} />}

      {showSuccess && (
        <SuccessScreen
          onClose={handleSuccessClose}
          categories={[...new Set(cart.map((item) => item.project.category))]}
        />
      )}

      {showBadgeNotification && (
        <BadgeNotification badge={currentBadge} onClose={() => setShowBadgeNotification(false)} />
      )}

      <ProfileQuickView
        isOpen={showProfileQuickView}
        onClose={() => setShowProfileQuickView(false)}
        userStats={userStats}
        recentDonations={recentDonations}
        savedProjects={savedProjects}
      />

      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileSave}
        currentProfile={userProfile}
      />

      <ProjectRegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  )

  return (
    <main className="flex min-h-screen flex-col items-center text-white relative overflow-hidden">
      <StarryBackground />

      {useMobile() ? (
        <div className="relative z-10 w-full h-screen">
          <AppContent />
        </div>
      ) : (
        <MobileMockup>
          <AppContent />
        </MobileMockup>
      )}
      {/* Balance Alert Modal */}
      {/* Balance Alert Modal Removed */}
    </main>
  )
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function RegisterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

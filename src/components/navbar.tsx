"use client";

import Link from "next/link";
import { ConnectButton } from "@/components/connect-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { injected } from "wagmi/connectors";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";

export function Navbar() {
  const pathname = usePathname();
  const [hideConnectBtn, setHideConnectBtn] = useState(false)
  const { connect } = useConnect()

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true)
      connect({ connector: injected({ target: "metaMask" }) })
    }
  }, [connect])

  // Don't show on onboarding screens
  if (pathname.startsWith("/onboarding")) {
    return null
  }
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Create Project", href: "/create" },
    { name: "My Projects", href: "/my-projects" },
    { name: "My Donations", href: "/my-donations" },
  ];
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SwipePad
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-600 hover:text-gray-900 transition-colors",
                  pathname === item.href && "text-blue-600 font-medium"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        {!hideConnectBtn && (
          <div className="flex items-center space-x-4 px-4">
            <ConnectButton />
          </div>
        )}
      </div>
    </header>
  );
} 
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function OnboardingCard({ step }: { step: number }) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Card className="w-full overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Clean Water Initiative"
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-[#22CC88] text-white px-2 py-1 rounded-full text-xs">SocFi</div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">Clean Water Initiative</h3>
          <p className="text-sm text-slate-600 mb-4">
            Providing clean water access to communities in need through sustainable infrastructure projects.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Funding goal</span>
              <span>$5,000</span>
            </div>
            <div className="w-full bg-[#F0F2F5] rounded-full h-2">
              <div className="bg-[#22CC88] h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {step === 1 && (
        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <div className="border-2 border-dashed border-[#22CC88] w-32 h-0"></div>
            <ArrowRight className="text-[#22CC88] ml-2" />
          </div>
          <p className="text-center text-sm font-medium text-[#22CC88]">Swipe to donate</p>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-red-500/80 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl">
            ×
          </div>
          <div className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-[#22CC88]/80 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl">
            ♥
          </div>
        </>
      )}
    </div>
  )
}

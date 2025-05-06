import { Shell, Content } from '@/components/shell'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Shell>
      <Content isOnboarding>
        {children}
      </Content>
    </Shell>
  )
} 
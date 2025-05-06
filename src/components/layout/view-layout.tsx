export default function ViewLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='h-main mt-[var(--height-topbar)] mb-[var(--height-bottombar)] flex flex-col'>{children}</main>
    )
}

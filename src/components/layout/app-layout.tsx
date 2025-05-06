import BottomBar from './bottom-bar'
import TopBar from './top-bar'
import ViewLayout from './view-layout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopBar />
            <ViewLayout>{children}</ViewLayout>
            <BottomBar />
        </>
    )
}

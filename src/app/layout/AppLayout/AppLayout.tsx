import type {ReactNode} from "react";
import {TopNav} from "../TopNav/TopNav.tsx";
import {BottomNav} from "../BottomNav/BottomNav.tsx";

//TODO: нужно ли вынести тип в отдельный файл?
type Props = {
    children: ReactNode;
}

export const AppLayout = ({children}: Props) => {
    return (
        <>
            <TopNav />

            <main className="app-layout__content container py-4 pb-5">
                {children}
            </main>

            <BottomNav />
        </>
    )
}
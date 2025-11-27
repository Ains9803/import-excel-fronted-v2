
import type { ReactNode } from "react";
import { Header } from "../ui/header";
import { Footer } from "../ui/footer";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {


    return (
        <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>
            <Header />
            <main
                id="main-content"
                className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-[1280px]"
            >
                {children}
            </main>
            <Footer />
        </div>
    );
}

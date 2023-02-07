'use client'
import { Inter } from "@next/font/google";
import Login from "./auth/Login";
import Home from "./auth/Home";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function StartPage() {
    const { data: session, status } = useSession();

    if (status === "authenticated") {
        return <Home user={session?.user} />;
    }

    if (status === "unauthenticated") {
        return <Login />;
    }

    return (
        <div className="mx-auto">
            <h1>Loading...</h1>
        </div>
    );
}

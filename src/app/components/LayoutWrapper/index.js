"use client"
import Header from "../Header";


export default function LayoutWrapper({children}) {
    return (
        <main>
            
            <Header />
            {children}
        </main>
    )
}
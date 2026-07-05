'use client'

import { useEffect } from "react"
import Lenis from "lenis"

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.06, // ini buat kecepatan scroll (makin besar makin lambat)
            smoothWheel: true, // kalo true ini buat smooth untuk wheel, kalo false biasanya dimatikan untuk touch/mobile
            wheelMultiplier: 1.2,
        })
        // game loop dari raf bahasa bayinya kayak mesin yang berputar setiap frame 
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // pencegahan memory leak dari lenis nya
        return () => {
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}

// ini buat alur lenis
// dari layout.tsx render LenisProvider mount, useEffect jalan, lenis dibuat, raf loop dimulai, scroll jadi smooth
// saat user tutup tab nanti LenisProvider unmount, cleansup jalan, lenis.destroy() dipanggil, memory bersih dan ga leak
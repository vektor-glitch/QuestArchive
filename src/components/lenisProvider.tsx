'use client'

import { useEffect } from "react"
import Lenis from "lenis"

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2, // ini buat kecepatan scroll (makin besar makin lambat)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential easing untuk scroll cepat di awal lalu melambat di akhir
            smoothWheel: true, // kalo true ini buat smooth untuk wheel, kalo false biasanya dimatikan untuk touch/mobile
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
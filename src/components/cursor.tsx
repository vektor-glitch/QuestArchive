"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
    const dotRef = useRef<HTMLDivElement | null>(null) // ini buat referensi ke elemen dot kursor
    const ringRef = useRef<HTMLDivElement | null>(null) // ini buat referensi ke elemen rin kursor
    let mx = 0, my = 0; // ini posisi mouse sekarang
    let rx = 0, ry = 0; // ini posisi rin sekarang

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        const onMove = (e: MouseEvent) => {
            mx = e.clientX; // ini buat nyimpen posisi mouse X
            my = e.clientY; // ini untuk nyimpen posisis mouse Y
            dot.style.left = mx + "px"; // ini dot nya langsung pindah
            dot.style.top = my + "px";
        };

        const animate = () => {
            rx += (mx - rx) * 0.09; // ini nanti ring bergerak 9% dari jarak ke mouse tiap frame
            ry += (my - ry) * 0.09; // jadi ini nanti semakin deket sama mouse, kursornya semakin lambat
            ring.style.left = rx + "px";
            ring.style.top = ry + "px";
            requestAnimationFrame(animate); // ini buat ngeloop terus tiap frame
        };

        document.addEventListener("mousemove", onMove);
        animate();

        // saat mouse hover ke <a>, <button> atau elemen dengan data-hover, class hovering ditambah ke body.
        const hoverEls = document.querySelectorAll("a, button, [data-hover]");
        hoverEls.forEach((el) => {
            el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
            el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
        });

        // ini pas komponen dihapus dari DOM, biar ga memory leak
        return () => document.removeEventListener("mousemove", onMove);
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" aria-hidden />
            <div ref={ringRef} className="cursor-ring" aria-hidden />
        </>
    );
}
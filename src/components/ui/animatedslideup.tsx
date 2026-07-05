'use client'
import { useEffect, useRef } from "react"

interface AnimatedSlideUpProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function AnimatedSlideUp({ children, delay = 0, className = '' }: AnimatedSlideUpProps) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ animationDelay: `${delay}ms` }}
            className={`opacity-0 ${className}`}
        >
            {children}
        </div>
    );
}
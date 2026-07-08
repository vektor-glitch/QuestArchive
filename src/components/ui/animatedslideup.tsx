'use client'
import { useEffect, useRef, useState } from "react"

interface AnimatedSlideUpProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function AnimatedSlideUp({ children, delay = 0, className = '' }: AnimatedSlideUpProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ animationDelay: `${delay}ms` }}
            className={`opacity-0 ${className} ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    );
}
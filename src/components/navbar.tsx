'use client'
import { useState, useEffect } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadset } from '@fortawesome/free-solid-svg-icons'

type Page = 'Home' | 'Encyclopedia' | 'Rate Arena' | 'Leaderboard';

const navItems = [
    { id: 'Home', icon: 'fa-house', label: 'Home', activeColor: 'text-brand-purple' },
    { id: 'Encyclopedia', icon: 'fa-book-open', label: 'Encyclopedia', activeColor: 'text-brand-cyan' },
    { id: 'Rate Arena', icon: 'fa-star-half-stroke', label: 'Rate Arena', activeColor: 'text-brand-magenta' },
    { id: 'Leaderboard', icon: 'fa-trophy', label: 'Leaderboard', activeColor: 'text-brand-gold' },
]

interface NavbarProps {
    activePage: Page
    onNavigate: (page: Page) => void
    onSearch: (query: string) => void
}

export default function Navbar({ activePage, onNavigate, onSearch }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 300);
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <Disclosure as="header" className={`sticky top-0 z-50 border-b border-space-border transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} ${scrolled ? 'bg-space-glass backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'}`}>
            {/* ini buat main navbar */}
            <div className="max-w-325 mx-auto px-8 py-4 flex items-center justify-between gap-4">

                {/* ini buat logo di navbar */}
                <div className="flex items-center gap-1 shrink-0 cursor-pointer" onClick={() => onNavigate('Home')}>
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00f2fe" />
                                <stop offset="100%" stopColor="#7b61ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <FontAwesomeIcon
                        icon={faHeadset}
                        className="icon-gradient text-2xl animate-logo-pulse mr-2 drop-shadow-[0_0_8px_rgba(123,97,255,0.6)]"
                    />
                    <span className='text-2xl font-extrabold tracking-wider text-slate-100 font-header'>Quest<span className=" text-brand-purple">Archive</span></span>
                </div>

                {/* ini buat desktop nav */}
                <nav className="hidden md:flex gap-2 bg-black/20 p-1.5 rounded-2xl border border-space-border">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as Page)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all select-none ${activePage === item.id ? 'text-slate-100 bg-linear-to-r from-brand-purple/20 to-brand-cyan/10 shadow-[inset_0_0_12px_rgba(123,97,255,0.15)] border border-brand-purple/25 -translate-y-px' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'}`}
                        >
                            <i className={`fa-solid ${item.icon} ${activePage === item.id ? item.activeColor : ''}`} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* ini buat sisi kanan navbar */}
                <div className="relative flex items-center gap-3 shrink-0">

                    {/* buat search bar */}
                    <div className="relative flex items-center">
                        <input type="text" placeholder="Quick Search..." className="bg-black/30 border-space-border rounded-lg py-2 pl-9 pr-4 text-slate-200 text-xs w-36"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSearch(e.currentTarget.value);
                                    e.currentTarget.blur();
                                }
                            }}
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-3 text-slate-500 text-xs" />
                    </div>

                    {/* ini buat CTA */}
                    <button onClick={() => onNavigate('Rate Arena')} className="bg-linear-to-br from-brand-purple to-purple-700 text-white font-header font-semibold px-5 py-2 rounded-lg shadow-lg shadow-brand-purple-glow/30 transition-all hover:-translate-y-0.5 hover:shadow-x1 hover:shadow-brand-purple/50 hover:brightness-110 whitespace-nowrap">
                        Rate Now!
                    </button>

                    {/* ini buat hamburge */}
                    <DisclosureButton className="group md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <i className='fa-solid fa-bars group-data-open:hidden text-x1' />
                    </DisclosureButton>
                </div>
            </div >

            {/* ini untuk dropdown menu pada mobile view */}
            <DisclosurePanel className="md:hidden border-t border-space-border bg-space-card" >
                <div className='px-4 py-3 flex flex-col gap-1'>
                    {navItems.map((item) => (
                        <DisclosureButton
                            key={item.id}
                            as="button"
                            onClick={() => onNavigate(item.id as Page)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left w-full
                            ${activePage === item.id
                                    ? 'bg-brand-purple text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <i className={`fa-solid ${item.icon}`} />
                            <span>{item.label}</span>
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure >
    )
}
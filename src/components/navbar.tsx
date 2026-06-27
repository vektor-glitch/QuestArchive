'use client'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadset } from '@fortawesome/free-solid-svg-icons'

type Page = 'Home' | 'Encyclopedia' | 'Rate Arena' | 'Leaderboard';

const navItems = [
    { id: 'home', icon: 'fa-house', label: 'Home' },
    { id: 'encyclopedia', icon: 'fa-book-open', label: 'Encyclopedia' },
    { id: 'rate', icon: 'fa-star-half-stroke', label: 'Rate Arena' },
    { id: 'leaderboard', icon: 'fa-trophy', label: 'Leaderboard' },
]

interface NavbarProps {
    activePage: Page
    onNavigate: (page: Page) => void
}

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
    return (
        <Disclosure as="header" className="sticky top-0 z-50 bg-space-glass backdrop-blur-1x border-b border-space-border">
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
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all select-none ${activePage === item.id ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
                        >
                            <i className={`fa-solid ${item.icon}`} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* ini buat sisi kanan navbar */}
                <div className="relative flex items-center gap-3 shrink-0">

                    {/* buat search bar */}
                    <div className="relative flex items-center">
                        <input type="text" placeholder="Quick Search..." className="bg-black/30 border-space-border rounded-lg py-2 pl-9 pr-4 text-slate-200 text-xs w-36" />
                        <i className="fa-solid fa-magnifying-glass absolute left-3 text-slate-500 text-xs" />
                    </div>

                    {/* ini buat CTA */}
                    <button className="bg-linear-to-br from-brand-purple to-purple-700 text-white font-header font-semibold px-5 py-2 rounded-lg shadow-lg transition-all hover:translatte-y-[2px] hover:brightness-110 whitespace-nowrap">
                        Join Arena!
                    </button>

                    {/* ini buat hamburge */}
                    <DisclosureButton className="group md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <i className='fa-solid fa-bars group-data-open:hidden text-1x' />
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
            </DisclosurePanel >
        </Disclosure >
    )
}
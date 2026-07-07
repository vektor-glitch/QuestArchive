'use client'
// library from 21st dev
import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { faHeadset } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnimatedSlideUp from "./ui/animatedslideup";

interface FooterProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    sections?: Array<{
        title: string;
        links: Array<{ name: string; href: string }>;
    }>;
    description?: string;
    socialLinks?: Array<{
        icon: React.ReactElement;
        href: string;
        label: string;
    }>;
    copyright?: string;
    legalLinks?: Array<{
        name: string;
        href: string;
    }>;
    onClick?: () => void;
    onNavigate: (page: string) => void;
}

export const Footer = ({ onNavigate, description = "Your ultimate game encyclopedia and rating platform. Discover, rate, and explore the gaming universe.", copyright = "© 2026 QuestArchive. Powered by RAWG API." }: FooterProps) => {
    const handleNavigate = (page: string) => {
        onNavigate(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    type NavLink = {
        name: string; onClick: () => void
    }
    type HrefLink = { name: string; href: string }
    type SectionLink = NavLink | HrefLink

    const defaultSections: Array<{
        title: string
        links: SectionLink[]
    }> = [
            {
                title: "Navigate",
                links: [
                    { name: "Home", onClick: () => handleNavigate('Home') },
                    { name: "Encyclopedia", onClick: () => handleNavigate('Encyclopedia') },
                    { name: "Rate Arena", onClick: () => handleNavigate('Rate Arena') },
                    { name: "Leaderboard", onClick: () => handleNavigate('Leaderboard') },
                ],
            },
            {
                title: "QuestArchive",
                links: [
                    { name: "About Us", href: "#" },
                    { name: "API", href: "https://rawg.io/apidocs" },
                    { name: "Contact", href: "#" },
                ],
            },
            {
                title: "Legal",
                links: [
                    { name: "Privacy Policy", href: "#" },
                    { name: "Terms of Service", href: "#" },
                    { name: "Cookie Policy", href: "#" },
                ],
            },
        ]

    const defaultSocialLinks = [
        { icon: <FaInstagram className="size-5" />, href: "https://www.instagram.com/vctrswrld/", label: "Instagram" },
        { icon: <FaGithub className="size-5" />, href: "https://github.com/vektor-glitch", label: "GitHub" },
        { icon: <FaTwitter className="size-5" />, href: "https://x.com/UGMYogyakarta", label: "Twitter" },
        { icon: <FaLinkedin className="size-5" />, href: "https://www.linkedin.com/in/ananda-vektorino-129294385/", label: "LinkedIn" },
    ]

    const defaultLegalLinks = [
        { name: "Terms and Conditions", href: "#" },
        { name: "Privacy Policy", href: "#" },
    ]
    return (
        <AnimatedSlideUp>
            <section className="bg-[#07070a] border-t border-space-border py-16 mt-20">
                <div className="max-w-325 mx-auto px-8">
                    <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                        <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                            {/* Logo */}
                            <div className="flex items-center gap-2 lg:justify-start">
                                <FontAwesomeIcon
                                    icon={faHeadset}
                                    className="icon-gradient text-2xl animate-logo-pulse mr-2 drop-shadow-[0_0_8px_rgba(123,97,255,0.6)]"
                                />
                                <span className='text-2xl font-extrabold tracking-wider text-slate-100 font-header'>Quest<span className=" text-brand-purple">Archive</span></span>
                            </div>
                            <p className="max-w-[70%] text-sm text-muted-foreground">
                                {description}
                            </p>
                            <ul className="flex items-center space-x-6 text-muted-foreground">
                                {defaultSocialLinks.map((social, idx) => (
                                    <li key={idx} className="font-medium hover:text-primary">
                                        <a href={social.href} aria-label={social.label} className="hover:text-brand-purple transition-all" suppressHydrationWarning>
                                            {social.icon}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
                            {defaultSections.map((section, sectionIdx) => (
                                <div key={sectionIdx}>
                                    <h3 className="mb-4 font-bold">{section.title}</h3>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        {section.links.map((link, linkIdx) => (
                                            <li key={linkIdx} className="font-medium hover:text-primary">
                                                {'onClick' in link ? (
                                                    <button onClick={link.onClick} className="hover:text-brand-purple transition-all">{link.name}</button>
                                                ) : (
                                                    <a href={link.href} className="hover:text-brand-purple transition-all">{link.name}</a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col justify-between gap-4 border-t border-t-brand-purple-glow py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
                        <p className="order-2 lg:order-1">{copyright}</p>
                    </div>
                </div>
            </section>
        </AnimatedSlideUp>
    )
};


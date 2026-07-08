import React from 'react';
import { gamesModel } from "@/src/types/model/games";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faStar } from "@fortawesome/free-solid-svg-icons";
import AnimatedSlideUp from "@/src/components/ui/animatedslideup";
import Image from 'next/image';
import { Footer } from '../footer';

interface EncyclopediaProps {
    games: gamesModel[];
    isLoading: boolean;
    hasMore: boolean;
    lastGameElementRef: (node: HTMLDivElement | null) => void;
    onNavigate: (page: string) => void;
    onOpenDetail: (game: gamesModel) => void;
}

export default function EncyclopediaPage({ games, isLoading, hasMore, lastGameElementRef, onNavigate, onOpenDetail }: EncyclopediaProps) {
    return (
        <section id='Encyclopedia' className='origin-top scale-95 translate-y-5 transition-all duration-500 ease-out'>
            {/* ini bagian judul */}
            <div className='flex flex-col text-center max-w-162.5 mx-auto mb-12 gap-1.5'>
                <span className='text-xs tracking-[2px] uppercase font-semibold text-brand-cyan'>The Encyclopedia</span>
                <h3 className='text-4xl font-extrabold uppercase bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent font-header'>Discover the Gaming Universe</h3>
                <p className='text-sm mt-2 text-slate-400'>Browse through our curated collection of critically acclaimed titles, filter by genres, <br /> and read in-depth details of your favorite digital worlds.</p>
            </div>
            {/* ini buat data game */}
            <AnimatedSlideUp>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
                    {games.map((game) => (
                        <div key={game.id} className='bg-space-card/50 border border-space-border rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2 hover:border-space-glow hover:shadow-[0_15px_30px_rgba(123,97,255,0.12)]'>
                            <div className='h-48 w-full overflow-hidden relative bg-space-border/20 flex items-center justify-center'>
                                {game.background_image ? (
                                    <Image src={game.background_image} alt={game.name} fill sizes='(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw' className='object-cover ' />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-500">
                                        <i className="fa-solid fa-image text-2xl"></i>
                                        <span className="text-xs font-semibold">No Image Available</span>
                                    </div>
                                )}
                                <div className='absolute bottom-4 left-4 bg-space-dark/85 backdrop-blur-md border border-brand-gold text-brand-gold font-header font-bold text-xs px-3 py-1 rounded shadow-md flex items-center gap-1'>
                                    <FontAwesomeIcon icon={faStar} /> {game.rating}
                                </div>
                            </div>
                            <div className='p-5 flex flex-col gap-2'>
                                <p className='text-[10px] font-semibold text-brand-purple uppercase tracking-wider mb-0,5'>
                                    {game.genres?.map(g => g.name).join(' / ')}
                                </p>
                                <h2 className='text-xl font-bold text-white truncate font-header'>{game.name}</h2>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                                    <span className='text-xs text-slate-500 flex items-center gap-1.5'><FontAwesomeIcon icon={faCalendar} />{game.released ? new Date(game.released).getFullYear() : 'TBA'}</span>
                                    <label onClick={() => onOpenDetail(game)} className="bg-transparent border border-brand-purple text-slate-100 font-header font-semibold text-xs px-4 py-1.5 rounded cursor-pointer transition-all hover:bg-brand-purple hover:text-white hover:shadow-[0_0_15px_rgba(123,97,255,0.4)] select-none">Details</label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AnimatedSlideUp>
            <div ref={lastGameElementRef} className='h-10 w-full mt-10'></div>
            {
                isLoading && (
                    <div className='text-center w-full py-9 text-brand-cyan animate-pulse'>Searching for Another Games..</div>
                )
            }
            {!hasMore && <Footer onNavigate={onNavigate} />}
        </section >
    )
}
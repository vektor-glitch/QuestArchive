import React from 'react';
import { gamesModel } from "@/src/types/model/games";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaStar } from 'react-icons/fa';

interface EncyclopediaProps {
    games: gamesModel[];
}

export default function EncyclopediaPage({ games }: EncyclopediaProps) {
    return (
        <section id='Encyclopedia' className='scale-95 translate-y-5 transition-all duration-500 ease-out'>
            {/* ini bagian judul */}
            <div className='text-center max-w-162.5 mx-auto mb-auto flex-col gap-1.5'>
                <span className='text-xs tracking-[2px] uppercase font-semibold text-brand-cyan'>The Encyclopedia</span>
                <h3 className='text-4xl font-extrabold uppercase bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent font-header'>Discover the Gaming Universe</h3>
                <p className='text-sm mt-2 text-slate-400'>Browse through our curated collection of critically acclaimed titles, filter by genres, <br /> and read in-depth details of your favorite digital worlds.</p>
            </div>
            {/* ini buat filter */}
            <div>
            </div>
            {/* ini buat data game */}
            <div>

            </div>
        </section>
    )
}
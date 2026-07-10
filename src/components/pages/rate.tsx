'use client'
import { useState, useEffect } from 'react';
import { gamesModel, mapToGamesModel } from "@/src/types/model/games";
import { mapToGamesResponse } from '@/src/types/api/gamesResponse';
import { supabase } from '@/src/lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircleInfo, faMagnifyingGlass, faGamepad, faUser, faCommentDots, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import BorderGlow from '../ui/borderglow';
import AnimatedSlideUp from '../ui/animatedslideup';

interface RatePageProps {
    games: gamesModel[];
    onOpenDetail: (game: gamesModel) => void;
}

interface recentReview {
    id: string;
    game_id: number;
    game_title: string;
    game_image: string;
    rating_gameplay: number;
    rating_visual: number;
    rating_story: number;
    rating_audio: number;
    rating_optimal: number;
    username: string;
    comment: string;
    create_at: string;
}

export default function RatePage({ games, onOpenDetail }: RatePageProps) {
    const [localGames, setLocalGames] = useState<gamesModel[]>(games);
    const [recentReviews, setRecentReviews] = useState<recentReview[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingGames, setLoadingGames] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // ambil data review baru dari supabase secara global (semua gamenya)
    const fetchRecentReviews = async () => {
        setLoadingReviews(true);
        try {
            const { data, error } = await supabase
                .from("ratings")
                .select("*")
                .order("create_at", { ascending: false })
                .limit(5); // ini kita ambil 5 reviews terbaru

            if (error) throw error;
            setRecentReviews(data || []);
        }
        catch (err) {
            console.log("Failed to Load New Activity", err);
        }
        finally {
            setLoadingReviews(false);
        }
    };

    // pencarian game khusus rate arena
    const handleLocalSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setLocalGames(games); // kalo kosong kembalikan ke default prop games
            return;
        }
        setLoadingGames(true);
        try {
            const url = `https://api.rawg.io/api/games?key=6d5576de850f4374aae7ee1edc070ea3&page_size=12&search=${searchQuery}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to Find Game");
            const data = await res.json();
            const gamesResponse = mapToGamesResponse(data);
            const mapped = mapToGamesModel(gamesResponse);
            setLocalGames(mapped);
        } catch (error) {
            console.error("Error searching games:", error);
        } finally {
            setLoadingGames(false);
        }
    };

    useEffect(() => {
        fetchRecentReviews();
    }, []);

    // update localgames jika default games dari parent berubah
    useEffect(() => {
        setLocalGames(games);
    }, [games]);

    // ui
    return (
        <section className="max-w-325 mx-auto px-8 py-8 origin-top scale-95 translate-y-5 transition-all duration-500 ease-out">
            {/* Header dulu */}
            <div className="flex flex-col text-center max-w-162.5 mx-auto mb-12 gap-1.5">
                <span className='text-xs tracking-[2px] uppercase font-semibold text-brand-magenta flex items-center justify-center gap-1.5'>
                    <FontAwesomeIcon icon={faGamepad} className='animate-bounce' /> The Rate Arena
                </span>
                <h3 className="text-4xl font-extrabold uppercase bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent font-header">
                    Voice Your Gamer Opinion
                </h3>
                <p className="text-sm mt-2 text-slate-400">
                    Review and rate your favorite games, discover community opinions, and shape the ultimate gaming database.
                </p>
            </div>
            {/* main grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* search and choose game column */}
                <div className='lg:col-span-2 flex flex-col gap-6'>
                    <div className="bg-space-card/40 border border-space-border rounded-2xl p-6">
                        <h4 className="font-header font-bold text-lg text-white mb-4 flex items-center gap-2">
                            Select Game to Rate
                        </h4>
                        {/* form local game */}
                        <form onSubmit={handleLocalSearch} className='relative flex items-center mb-6'>
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search game you want to rate...' className='bg-black/30 border border-space-border rounded-xl py-3 pl-11 pr-4 text-slate-200 text-sm w-full focus:outline-none focus:border-brand-magenta transition-colors' />
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute left-4 text-slate-500 text-sm' />
                            <button type='submit' className='absolute right-2.5 bg-brand-magenta hover:bg-red-650 text-white font-header font-bold text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer'>
                                Search
                            </button>
                        </form>
                        {/* ini grid game */}
                        {loadingGames ? (
                            <div className='text-center py-20 text-brand-magenta animate-pulse text-sm'>
                                Searching games in RAWG Database...
                            </div>
                        ) : localGames.length === 0 ? (
                            <div className="text-center py-20 text-slate-550 text-sm">
                                No games found. Try searching for other titles!
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {localGames.slice(0, 12).map((game) => (
                                    <div key={game.id} className='bg-black/20 hover:bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 group'>
                                        <div className='flex items-center gap-3 min-w-0'>
                                            {/* Imange Game */}
                                            <div
                                                style={{
                                                    backgroundImage: game.background_image
                                                        ? `url(${game.background_image})`
                                                        : 'linear-gradient(135deg, #12121e 0%, #0a0a0f 100%)'
                                                }}
                                                className="w-14 h-14 bg-cover bg-center rounded-lg border border-white/10 shrink-0 flex items-center justify-center"
                                            >
                                                {!game.background_image && <FontAwesomeIcon icon={faGamepad} className="text-white/10 text-xl" />}
                                            </div>
                                            {/* Judul & Genre */}
                                            <div className="min-w-0">
                                                <h5 className="font-bold text-white text-sm truncate font-header group-hover:text-brand-magenta transition-colors">
                                                    {game.name}
                                                </h5>
                                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                                    {game.genres.map(g => g.name).join(' / ') || 'General'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Tombol Aksi */}
                                        <button
                                            onClick={() => onOpenDetail(game)}
                                            className="bg-white/5 hover:bg-brand-magenta hover:text-white border border-white/10 text-slate-300 font-header font-semibold text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                                        >
                                            Rate <FontAwesomeIcon icon={faCircleArrowRight} className="text-[10px]" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Kolom Kanan: Aktivitas Ulasan Terbaru (Col-span 1) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <BorderGlow
                        backgroundColor="#120F17"
                        borderRadius={16}
                        colors={['#ff0844', '#ffb800', '#7b61ff']}
                        glowColor="345 100 52"
                        glowIntensity={0.8}
                        className="p-6"
                    >
                        <h4 className="font-header font-bold text-lg text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCommentDots} className="text-brand-magenta" /> Recent Activity
                        </h4>
                        {loadingReviews ? (
                            <div className="text-center py-12 text-slate-450 animate-pulse text-xs">
                                Loading recent activity...
                            </div>
                        ) : recentReviews.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-xs leading-relaxed">
                                Belum ada aktivitas di arena.<br />Jadilah yang pertama menulis rating!
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">
                                {recentReviews.map((rev) => {
                                    const overall = parseFloat(((rev.rating_gameplay + rev.rating_visual + rev.rating_story + rev.rating_audio + rev.rating_optimal) / 5).toFixed(1));
                                    return (
                                        <AnimatedSlideUp key={rev.id}>
                                            <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col gap-2.5">

                                                {/* Judul Game & Rating Bintang */}
                                                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                                                    <span className="font-bold text-white text-xs truncate max-w-[70%]">
                                                        {rev.game_title}
                                                    </span>
                                                    <span className="text-brand-gold text-[10px] font-black flex items-center gap-1 shrink-0">
                                                        <FontAwesomeIcon icon={faStar} /> {overall}
                                                    </span>
                                                </div>
                                                {/* Isi Ulasan */}
                                                <p className="text-slate-350 text-xs line-clamp-2 leading-relaxed italic">
                                                    "{rev.comment || 'Hanya memberikan nilai bintang.'}"
                                                </p>
                                                {/* Pengirim & Waktu */}
                                                <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1 font-semibold text-slate-400">
                                                        <FontAwesomeIcon icon={faUser} className="text-[8px]" /> {rev.username}
                                                    </span>
                                                    <span>
                                                        {new Date(rev.create_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </AnimatedSlideUp>
                                    );
                                })}
                            </div>
                        )}
                    </BorderGlow>
                </div>
            </div>
        </section>
    );
}
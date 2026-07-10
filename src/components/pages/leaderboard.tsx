'use client'
import { gamesModel } from "@/src/types/model/games";
import { useState, useEffect } from "react";
import { mapToGamesModel } from "@/src/types/model/games";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faStar, faRankingStar, faCircleInfo, faGamepad, faTv } from "@fortawesome/free-solid-svg-icons";
import BorderGlow from "../ui/borderglow";
import AnimatedSlideUp from "../ui/animatedslideup";

interface HomePageProps {
    games: gamesModel[];
    onOpenDetail: (game: gamesModel) => void;
}

type SortOption = "Metacritic" | "Rating";

export default function LeaderboardPage({ onOpenDetail }: HomePageProps) {
    const [leaderboardGame, setLeaderboardGame] = useState<gamesModel[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("Metacritic");
    const [loading, setLoading] = useState(true);

    // kita ambil data top game dari RAWG
    const fetchLeaderboard = async (sortType: SortOption) => {
        setLoading(true);
        try {
            // ini buat mengurutkan berdasarkan metacritic atau user rating
            const orderingParam = sortType === "Metacritic" ? "-metacritic" : "-rating";
            const url = `https://api.rawg.io/api/games?key=6d5576de850f4374aae7ee1edc070ea3&ordering=${orderingParam}&page_size=10`;

            const res = await fetch(url);
            if (!res) throw new Error("Failed to Load Leaderboard");
            const data = await res.json();

            const mappedGames = mapToGamesModel(data);
            setLeaderboardGame(mappedGames);
        }
        catch (err) {
            console.error("Error Loading Leaderboard", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard(sortBy);
    }, [sortBy]);

    // ini buat membagi data menjadi 3 teratas dan peringkat 4 - 10 
    const top3 = leaderboardGame.slice(0, 3);
    const remainingGame = leaderboardGame.slice(3);

    // ini buat mengatur urutan render web: #2 kiri, #1 tengah, #3 kanan
    const getPodiuOrder = (items: gamesModel[]) => {
        if (items.length > 3) return items;
        return [items[1], items[0], items[2]]; // index array buat #2 #1 #3
    };

    const podiumOrder = getPodiuOrder(top3);

    // ini yang buat mengatur batch warna pada podium 3 teratas
    const getPodiumStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return {
                    glowColor: ["#ffb700", "#ff8800", "#ffd700"],
                    badgeBg: "bg-amber-500 text-black border-amber-300",
                    glowText: "text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]",
                    cardClass: "h-[45vh] border-amber-500/30 scale-105 z-10 md:translate-y-4"
                };
            case 2:
                return {
                    glowColor: ["#c0c0c0", "#708090", "#e6e6e6"],
                    badgeBg: "bg-slate-400 text-black border-slate-200",
                    glowText: "text-slate-350 drop-shadow-[0_0_10px_rgba(148,163,184,0.5)]",
                    cardClass: "h-[40vh] border-slate-400/20 scale-100"
                };
            case 3:
            default:
                return {
                    glowColor: ["#cd7f32", "#8b4513", "#d2691e"],
                    badgeBg: "bg-amber-700 text-white border-amber-600",
                    glowText: "text-amber-600 drop-shadow-[0_0_10px_rgba(180,83,9,0.4)]",
                    cardClass: "h-[38vh] border-amber-800/20 scale-95"
                };
        }
    };

    // ui
    return (
        <section className="max-w-325 mx-auto px-8 origin-top scale-95 translate-y-5 transition-all duration-500 ease-out">
            {/* kasi header dulu lee */}
            <div className="flex flex-col text-center max-w-162.5 mx-auto mb-12 gap-1.5">
                <span className="text-xs tracking-[2px] uppercase font-semibold text-brand-gold flex items-center justify-center gap-1.5">
                    <FontAwesomeIcon icon={faTrophy} className="animate-bounce" /> The Hall of Fame
                </span>
                <h3 className="text-4xl font-extrabold uppercase bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent font-header">
                    Global Game Leaderboard
                </h3>
                <p className="text-sm mt-2 text-slate-400">
                    A leaderboard of the best games of all time based on aggregated global critical reviews and millions of gamers worldwide.
                </p>

                {/* kasi filter toggle buttons dulu rek */}
                <div className="flex gap-2 bg-black/40 border border-white/10 rounded-xl w-fit mx-auto mt-6">
                    <button onClick={() => setSortBy("Metacritic")} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer flex items-center gap-2 ${sortBy === "Metacritic" ? 'text-white bg-linear-to-r from-brand-purple/20 to-brand-cyan/10 border border-brand-purple/20' : 'text-slate-400 hover:text-white'}`}>
                        <FontAwesomeIcon icon={faTv} /> Metacritic Score
                    </button>
                    <button onClick={() => setSortBy("Rating")} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer flex items-center gap-2 ${sortBy === "Rating" ? 'text-white bg-linear-to-r from-brand-purple/20 to-brand-cyan/10 border border-brand-purple/20' : 'text-slate-400 hover:text-white'}`}>
                        <FontAwesomeIcon icon={faTv} /> Rating Score
                    </button>
                </div>
            </div >

            {/* kalo loading */}
            {loading ? (
                <div className="text-center py-20 text-brandd-gold animate-pulse">
                    Calculating the Leaderboard
                </div>
            ) : (
                <div className="flex flex-col gap-12">
                    {/* ini buat top 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end justify-center max-w-5xl mx-auto w-full pt-6">
                        {podiumOrder.map((game) => {
                            const rank = leaderboardGame.findIndex(g => g.id === game.id) + 1;
                            const style = getPodiumStyle(rank);

                            return (
                                <AnimatedSlideUp key={game.id} delay={rank * 0.1} className="w-full min-w-0">
                                    <BorderGlow backgroundColor="#120F17" borderRadius={16} colors={style.glowColor} glowColor={rank === 1 ? "38 100 50" : "0 0 50"} className={`w-full ${style.cardClass}`}>
                                        <div className="relative h-full w-full rounded-2xl overflow-hidden group flex flex-col justify-end p-6 select-none">
                                            {/* background image lur */}
                                            <div
                                                style={{
                                                    backgroundImage: game.background_image
                                                        ? `url(${game.background_image})`
                                                        : 'linear-gradient(135deg, #1e1145 0%, #0a0a0f 100%)'
                                                }}
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 flex items-center justify-center"
                                            >
                                                {!game.background_image && (
                                                    <FontAwesomeIcon icon={faGamepad} className="text-white/10 text-8xl" />
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent z-10" />

                                            {/* ini rank badge */}
                                            <div className={`absolute top-4 left-4 border ${style.badgeBg} text-xs font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-20`}>
                                                #{rank}
                                            </div>

                                            {/* info gamenya */}
                                            <div className="relative z-20 flex flex-col items-center text-center">
                                                <h4 className="text-lg font-bold text-white font-header mb-1 line-clamp-1 w-full">
                                                    {game.name}
                                                </h4>
                                                <div className="text-xs text-slate-350 mb-4 flex items-center gap-1.5 justify-center">
                                                    {sortBy === "Metacritic" ? (
                                                        < span className="bg-green-550/20 border border-green-500 text-green-400 font-bold px-2.5 py-0.5 rounded text-[10px]">
                                                            Metascore: {dataRawgScore(game, sortBy)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-brand-gold font-bold">
                                                            <FontAwesomeIcon icon={faStar} /> {game.rating.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* CTA */}
                                                <button onClick={() => onOpenDetail(game)} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-header font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 w-fit">
                                                    <FontAwesomeIcon icon={faCircleInfo} /> View Details
                                                </button>
                                            </div>
                                        </div>
                                    </BorderGlow>
                                </AnimatedSlideUp>
                            );
                        })}
                    </div>

                    {/* ini buat list rank 4 - 10 */}
                    <div className="max-w-4xl mx-auto w-full bg-space-card/40 border border-space-border rounded-2xl p-6 flex flex-col gap-2">
                        <h4 className="font-header font-bold text-sm text-slate-400 border-b border-white/10 pb-4 flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faRankingStar} /> Rankings 4 - 10
                        </h4>
                        {remainingGame.map((game, index) => {
                            const rank = index + 4;
                            return (
                                <AnimatedSlideUp key={game.id} delay={0.3 + index * 0.05}>
                                    <div className="bg-black/10 hover:bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Rank Berapanya */}
                                            <span className="font-header font-black text-slate-500 text-sm w-6 text-center">
                                                #{rank}
                                            </span>
                                            {/* ini cover gamenya */}
                                            <div style={{ backgroundImage: `url(${game.background_image})` }} className="w-16 h-10 bg-cover bg-center rounded-lg border border-white/10 shrink-0" />
                                            {/* judul dan genrenya */}
                                            <div className="min-2-0">
                                                <h5 className="font-bold text-white text-sm truncate font-header group-hover:text-brand-purple transition-colors">
                                                    {game.name}
                                                </h5>
                                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                                    {game.genres.map(g => g.name).join(' / ')}
                                                </p>
                                            </div>
                                        </div>
                                        {/* stats & actions */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-right shrink-0">
                                                {sortBy === "Metacritic" ? (
                                                    <span className="bg-green-550/20 border border-green-500 text-green-400 font-bold px-2.5 py-1 rounded text-xs">
                                                        {dataRawgScore(game, sortBy)}
                                                    </span>
                                                ) : (
                                                    <span className="text-brand-gold font-bold text-sm flex items-center gap-1">
                                                        <FontAwesomeIcon icon={faStar} /> {game.rating.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={() => onOpenDetail(game)} className="bg-white/5 hover:bg-brand-purple hover:text-white border border-white/10 text-slate-300 font-header font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                                                <FontAwesomeIcon icon={faCircleInfo} /> Details
                                            </button>
                                        </div>
                                    </div>
                                </AnimatedSlideUp>
                            );
                        })}
                    </div>
                </div >
            )
            }
        </section >
    );
}

// ini adalah helper buat ambil score rating/metacritic yang aman
function dataRawgScore(game: gamesModel, type: SortOption): number {
    if (type === "Metacritic") {
        // RAWG API itu kadang ga mengisi nilai metacritic pada list objectt langsung, kita beri fallback aman jadinya
        return (game as any).metacritic || 0;
    }
    return Math.round(game.rating);
}
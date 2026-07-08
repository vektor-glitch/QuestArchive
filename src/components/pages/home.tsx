import { useState } from "react";
import { gamesModel } from "@/src/types/model/games";
import { faFire, faStar, faTags, faBuilding, faCircleInfo, faGamepad, faUserGroup, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BorderGlow from "../ui/borderglow";
import AnimatedSlideUp from "@/src/components/ui/animatedslideup";
import CountUp from "../ui/countup";


interface HomePageProps {
    games: gamesModel[];
    featuredGame?: gamesModel | null;
    onNavigate: (page: string) => void;
    totalGames: number;
    activeReviewed: number;
    avgScore: string;
    recommendedGames: gamesModel[];
    onOpenDetail: (game: gamesModel) => void;
}

export default function HomePage({ games, featuredGame, onNavigate, totalGames, activeReviewed, avgScore, recommendedGames, onOpenDetail }: HomePageProps) {
    const [heroZoomed, setHeroZoomed] = useState(false);
    return (
        <div className="max-w-325 mx-auto px-8 py-8">
            {/* ini buat hero section */}
            <BorderGlow backgroundColor="transparent" borderRadius={16} colors={['#7b61ff', '#00f2fe', '#ff0844']} glowColor="258 100 71" glowIntensity={1.2} className="h-[80vh]">
                <section
                    style={{ borderRadius: '16px' }}
                    className="h-full w-full relative overflow-hidden"
                    onMouseEnter={() => setHeroZoomed(true)}>
                    <div
                        style={{ backgroundImage: featuredGame ? `url(${featuredGame.background_image})` : 'none' }}
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-5000 ${heroZoomed ? 'scale-105' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-black/65" />
                    <div className="relative z-10 flex flex-col justify-end h-full p-12">
                        {featuredGame ? (
                            <div>
                                <div className="w-fit items-center bg-brand-purple/20 border border-brand-purple px-4 py-1 rounded-full mb-2">
                                    <span
                                        className="text-white tracking-widest text-sm mb-2">
                                        <FontAwesomeIcon icon={faFire} /> Featured Most Rated Game of the Year
                                    </span>
                                </div>
                                <h1
                                    className="text-6xl font-bold text-white mb-2">
                                    {featuredGame.name}
                                </h1>
                                <div className="flex items-center gap-4 flex-wrap mt-1">
                                    <span>
                                        <FontAwesomeIcon icon={faTags} className="mr-1 text-brand-purple" /> {featuredGame.genres.map(g => g.name).join(',')}
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faBuilding} className="mr-1 text-brand-purple" /> {featuredGame.developers.map(d => d.name).join(',')}
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faStar} className="mr-1 text-brand-gold" /> {featuredGame.rating} / 5
                                    </span>
                                </div>
                                <p className="text-gray-300 mt-4 mx-w-x1 line-clamp-3">
                                    {featuredGame.description}
                                </p>
                                <div className="flex gap-4 mt-4">
                                    <label onClick={() => featuredGame && openDetail('Detail')} className="bg-linear-to-br from-brand-purple to-purple-700 text-white px-8 py-3.5 font-header font-bold rounded-lg shadow-lg shadow-brand-purple-glow/30 transition-all hover:-translate-y-0.75 hover:shadow-xl hover:shadow-brand-purple/60  hover:brightness-110 flex items-center gap-2.5 cursor-pointer select-none">
                                        <FontAwesomeIcon icon={faCircleInfo} /> View Details
                                    </label>
                                    <label onClick={() => onNavigate('Rate Arena')} className="bg-white/20 border-space-border text-slate-100 px-8 py-3.5 font-header font-bold rounded-lg transition-all hover:bg-white/10 hover:-translate-y-0.75 hover:border-slate-400 flex items-center gap-2.5 cursor-pointer select-none">
                                        <FontAwesomeIcon icon={faStar} /> Rate This Game
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">Loading featured
                                game...</p>
                        )}
                    </div>
                </section>
            </BorderGlow>
            {/* ini buat statistic section */}
            <section>
                <AnimatedSlideUp delay={0}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 mt-8">
                        <div className="bg-space-card/70 backdrop-blur-md border border-space-border rounded-2xl p-6 flex items-center gap-6 transition-all hover:-translate-y-1.25 hover:border-space-glow hover:shadow-[0_10px_25px_rgba(123,97,255,0.08)]">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-size-xl bg-brand-purple/15 text-brand-purple border border-brand-purple/20 text-xl">
                                <FontAwesomeIcon icon={faGamepad} />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-header text-3xl font-extrabold leading-tight">
                                    <CountUp from={0} to={totalGames} separator="," direction="up" duration={0.3} className="count-up-text" delay={0} />
                                </p>
                                <p className="text-slate-400 text-xs">Total Games</p>
                            </div>
                        </div>
                        <div className="bg-space-card/70 backdrop-blur-md border border-space-border rounded-2xl p-6 flex items-center gap-6 transition-all hover:-translate-y-1.25 hover:border-space-glow hover:shadow-[0_10px_25px_rgba(123,97,255,0.08)]">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-size-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 text-xl">
                                <FontAwesomeIcon icon={faUserGroup} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-3xl font-bold text-brand-cyan">
                                    <CountUp from={0} to={activeReviewed} separator="," direction="up" duration={1} className="count-up-text" delay={0} />
                                </p>
                                <p className="text-gray-400 text-sm mt-1">Active Reviewed</p>
                            </div>
                        </div>
                        <div className="bg-space-card/70 backdrop-blur-md border border-space-border rounded-2xl p-6 flex items-center gap-6 transition-all hover:-translate-y-1.25 hover:border-space-glow hover:shadow-[0_10px_25px_rgba(123,97,255,0.08)]">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-size-xl bg-brand-gold/15 text-brand-gold border border-brand-gold/20 text-xl">
                                <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-3xl font-bold text-brand-gold">
                                    <CountUp from={0} to={parseFloat(avgScore)} separator="," direction="up" duration={1} className="count-up-text" delay={0} />
                                </p>
                                <p className="text-gray-400 text-sm mt-1">Average Score</p>
                            </div>
                        </div>
                    </div>
                </AnimatedSlideUp>
            </section>
            {/* Recomendation Section */}
            <section>
                <AnimatedSlideUp>
                    <div className="flex items-end justify-content-between mb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs tracking-[2px] text-brand-cyan uppercase font-semibold">GAME RECOMENDATIONS</span>
                            <h1 className="text-3xl font-extrabold uppercase bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent font-header">
                                Trending Games Today
                            </h1>
                        </div>
                        <label onClick={() => onNavigate('Encyclopedia')} className="ml-auto text-brand-purple text-sm font-bold cursor-pointer flex items-end justify-between mb-4 gap-1.5 transition-all hover:text-brand-cyan hover:gap-2.5">
                            Explore All Games <FontAwesomeIcon icon={faArrowRight} />
                        </label>
                    </div>
                </AnimatedSlideUp>
                <AnimatedSlideUp>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendedGames.map((game, i) => (
                            <BorderGlow key={game.id} backgroundColor="#120F17" borderRadius={16} colors={['#7b61ff', '#00f2fe', '#ff0844']} glowColor="258 100 71" glowIntensity={1.2} glowRadius={20} coneSpread={35} className="h-[35vh]">
                                <div className="relative h-60 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_30px_rgba(123,97,255,0.15)] group">
                                    <div className="w-100 h-100 absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.08]">
                                        <img src={game.background_image} />
                                    </div>
                                    <div className="absolute inset-0 bg-black/30 z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-space-dark/30 to-transparent z-20 group-hover:from-space-dark/98"></div>
                                    <div className="absolute top-4 right-4 bg-black/60 border border-space-border px-3 py-1 rounded-full text-xs font-semibold z-30">
                                        <p>{game.genres.map(g => g.name).join(', ')}</p>
                                        <p>{game.developers?.map(d => d.name).join(', ')}</p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 left-0 w-full p-6 z-30 translate-y-[15px] transition-transform duration-500 group-hover:translate-y-0">
                                        <h4 className="text-xl font-bold mb-1 truncate font-header">{game.name}</h4>
                                        <div className="text-slate-350 text-xs mb-4"> <FontAwesomeIcon icon={faStar} className="text-brand-gold" />{game.rating}/5</div>
                                        <label onClick={() => onOpenDetail(game)} className="inline-block bg-brand-purple text-white text-xs font-header font-bold px-4 py-1.5 rounded cursor-pointer opacity-0 transition-opacity duration-500 group-hover:opacity-100 hover:bg-purple-600 select-none">Read More</label>
                                    </div>
                                </div>
                            </BorderGlow>
                        ))}
                    </div>
                </AnimatedSlideUp>
            </section>
        </div>
    )
}
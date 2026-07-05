import { gamesModel } from "@/src/types/model/games";
import { faFire, faStar, faTags, faBuilding, faCircleInfo, faGamepad, faUserGroup } from "@fortawesome/free-solid-svg-icons";
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
}

export default function HomePage({ games, featuredGame, onNavigate, totalGames, activeReviewed, avgScore }: HomePageProps) {
    return (
        <div className="max-w-325 mx-auto px-8 py-8">
            {/* ini buat hero section */}
            <BorderGlow backgroundColor="transparent" borderRadius={16} colors={['#7b61ff', '#00f2fe', '#ff0844']} glowColor="258 100 71" glowIntensity={1.2} className="h-[80vh]">
                <section
                    style={{ backgroundImage: featuredGame ? `url(${featuredGame.background_image})` : 'none', borderRadius: '16px' }}
                    className="h-full w-full bg-cover bg-center relative overflow-hidden">
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
                                    <label onClick={() => onNavigate('Detail')} className="bg-linear-to-br from-brand-purple to-purple-700 text-white px-8 py-3.5 font-header font-bold rounded-lg shadow-lg shadow-brand-purple-glow/30 transition-all hover:-translate-y-0,75 hover:shadow-x1 hover:shadow-brand-purple/60  hover:brightness-110 flex items-center gap-2.5 cursor-pointer select-none">
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
            {/*  */}
        </div>
    )
}
import { gamesModel } from "@/src/types/model/games";
import { faFire, faStar, faTags, faBuilding, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HomePageProps {
    games: gamesModel[];
    featuredGame?: gamesModel | null;
    onNavigate: (page: string) => void;
}

export default function HomePage({ games, featuredGame, onNavigate }: HomePageProps) {
    return (
        <div className="max-w-325 mx-auto px-8 py-8">
            {/* ini buat hero section */}
            <section
                style={{ backgroundImage: featuredGame ? `url(${featuredGame.background_image})` : 'none' }}
                className="relative h-[80vh] bg-cover bg-center rounded-2xl overflow-hidden">
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
            </section >
        </div >
    )
}
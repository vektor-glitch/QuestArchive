import { useState, useEffect } from "react";
import { gamesModel } from "@/src/types/model/games";
import { supabase } from "@/src/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faStar, faGamepad, faTv, faBook, faVolumeHigh, faSliders, faUser, faPenToSquare, faCalendarDays, faBuilding, faTags } from "@fortawesome/free-solid-svg-icons";
import BorderGlow from "../ui/borderglow";
import AnimatedSlideUp from "../ui/animatedslideup";

interface DetailPageProps {
    game: gamesModel;
    onNavigate: (page: any) => void;
    previousPage: any;
}

interface ReviewData {
    id: string;
    game_id: number;
    game_title: string;
    rating_gameplay: number;
    rating_visual: number;
    rating_story: number;
    rating_audio: number;
    rating_optimal: number;
    username: string;
    comment: string;
    create_at: string;
}

export default function DetailPage({ game, onNavigate, previousPage }: DetailPageProps) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [detailedGame, setDetailedGame] = useState<gamesModel | null>(null);

    // state Form khusus untuk rating Baru
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [ratingGameplay, setRatingGameplay] = useState(5);
    const [ratingVisual, setRatingVisual] = useState(5);
    const [ratingStory, setRatingStory] = useState(5);
    const [ratingAudio, setRatingAudio] = useState(5);
    const [ratingOptimal, setRatingOptimal] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    // ambil data ulasan dari supabase
    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("ratings")
                .select("*")
                .eq("game_id", game.id)
                .order("create_at", { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchGameDetail = async () => {
            try {
                const res = await fetch(`https://api.rawg.io/api/games/${game.id}?key=6d5576de850f4374aae7ee1edc070ea3`);
                if (!res.ok) throw new Error("Failed to fetch game details from RAWG");
                const data = await res.json();

                // hasil review supabase dan rawg
                setDetailedGame({
                    ...game, // ini mempertahankan data yang sudah ada
                    description: data.description_raw || data.description || "No description available.",
                    developers: data.developers || [],
                    publishers: data.publishers || [],
                    platforms: data.platforms ? data.platforms.map((p: any) => p.platform) : [],
                    esrb_rating: data.esrb_rating || null,
                });
            } catch (err) {
                console.error("Error fetching game details:", err);
            }
        };
        // ini useEffect yang memanggil keduanya // jalanin ulang kalo game yang di buka di detail beda
        fetchGameDetail();
        fetchReviews();
    }, [game.id]);

    // Efek untuk mengunci scroll halaman utama saat modal terbuka (Scroll Lock)
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]); // jalanin ulang kalo game yang di buka di detail beda

    // kirim data ulasan ke supabase
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault(); // ini buat cegah reload halaman 
        if (!username.trim()) {
            alert("Please enter your username!");
            return;
        }
        setSubmitting(true);

        try {
            // insert data baru ke tabelnya
            const { error } = await supabase
                .from("ratings")
                .insert([
                    {
                        game_id: game.id,
                        game_title: game.name,
                        game_image: game.background_image,
                        rating_gameplay: ratingGameplay,
                        rating_visual: ratingVisual,
                        rating_story: ratingStory,
                        rating_audio: ratingAudio,
                        rating_optimal: ratingOptimal,
                        username: username,
                        comment: comment,
                    },
                ]);

            if (error) throw error;

            // ini buat reset form & tutup modal
            setUsername("");
            setComment("");
            setRatingGameplay(5);
            setRatingVisual(5);
            setRatingStory(5);
            setRatingAudio(5);
            setRatingOptimal(5);
            setIsModalOpen(false);

            // refresh ulasan
            fetchReviews();
            alert("Rating successfully submitted to Rate Arena!");
        } catch (err: any) {
            alert("Failed to submit rating: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ini fungsi matematika untuk kalkulasi rata-rata rating komunitas
    const calculateAverages = () => {
        if (reviews.length === 0) return { overall: 0, gp: 0, vs: 0, st: 0, au: 0, op: 0 };

        let totalGp = 0, totalVs = 0, totalSt = 0, totalAu = 0, totalOp = 0;

        // jumlah semua rating per aspek
        reviews.forEach(r => {
            totalGp += r.rating_gameplay;
            totalVs += r.rating_visual;
            totalSt += r.rating_story;
            totalAu += r.rating_audio;
            totalOp += r.rating_optimal;
        });

        // rata rata rating
        const n = reviews.length;
        const gp = totalGp / n;
        const vs = totalVs / n;
        const st = totalSt / n;
        const au = totalAu / n;
        const op = totalOp / n;
        const overall = (gp + vs + st + au + op) / 5; // rata rata semua aspek

        return {
            overall: parseFloat(overall.toFixed(1)),
            gp: parseFloat(gp.toFixed(1)),
            vs: parseFloat(vs.toFixed(1)),
            st: parseFloat(st.toFixed(1)),
            au: parseFloat(au.toFixed(1)),
            op: parseFloat(op.toFixed(1))
        };
    };

    const avgs = calculateAverages();

    // Komponen Helper untuk milih Bintang (1-5)
    const StarInput = ({ value, onChange, label, icon }: { value: number, onChange: (v: number) => void, label: string, icon: any }) => (
        <div className="flex flex-col gap-1 bg-black/30 p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-350">
                <FontAwesomeIcon icon={icon} className="text-brand-purple" />
                <span>{label}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none transition-transform hover:scale-120">
                        <FontAwesomeIcon icon={faStar} className={`text-lg ${star <= value ? 'text-brand-gold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]' : 'text-slate-600'}`} />
                    </button>
                ))}
                <span className="ml-auto font-bold text-sm text-slate-200">{value} / 5</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-325 mx-auto px-8 py-8">
            {/* Tombol Back */}
            <button onClick={() => onNavigate(previousPage)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm select-none focus:outline-none">
                <FontAwesomeIcon icon={faChevronLeft} /> Back to Dashboard
            </button>

            {/* Hero Banner Section */}
            <AnimatedSlideUp>
                <div className="relative rounded-2xl overflow-hidden h-[50vh] border border-space-border mb-8">
                    <div style={{ backgroundImage: `url(${game.background_image})` }} className="absolute inset-0 bg-cover bg-center" />
                    <div className="absolute inset-0 bg-linear-to-t from-space-dark via-space-dark/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white font-header mb-3 drop-shadow-md">
                                {game.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faCalendarDays} className="text-brand-cyan" />
                                    {/* ini buat nentuin apakah gamenya punya tanggalan rilis atau dia to be annouce */}
                                    {game.released ? new Date(game.released).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faBuilding} className="text-brand-purple" />
                                    {(detailedGame || game).developers?.map(d => d.name).join(', ') || 'Unknown Developer'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faTags} className="text-brand-magenta" />
                                    {game.genres?.map(g => g.name).join(', ') || 'No Genres'}
                                </span>
                            </div>
                        </div>
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl flex items-center gap-4 shrink-0">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">RAWG Rating</p>
                                <p className="text-2xl font-black text-brand-gold mt-1">
                                    <FontAwesomeIcon icon={faStar} /> {game.rating} <span className="text-xs text-slate-500">/ 5</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSlideUp>

            {/* Grid Layout Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Kolom Kiri: Rating Komunitas & Kategori */}
                <AnimatedSlideUp>
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <BorderGlow backgroundColor="#120F17" borderRadius={16} colors={['#7b61ff', '#00f2fe', '#ff0844']} glowColor="258 100 71" glowIntensity={0.8} className="p-6">
                            <h3 className="font-header font-bold text-lg mb-4 text-white border-b border-white/10 pb-2">
                                Arena Score
                            </h3>
                            <div className="text-center py-4">
                                <p className="text-5xl font-black text-white">{avgs.overall || 'N/A'}</p>
                                <p className="text-xs text-slate-450 mt-1.5">Average of {reviews.length} gamer reviews</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-6 w-full bg-linear-to-br from-brand-purple to-purple-700 hover:brightness-110 text-white font-header font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2 cursor-pointer select-none">
                                    <FontAwesomeIcon icon={faPenToSquare} /> Rate Now
                                </button>
                            </div>
                            {/* Breakdown Score Aspek */}
                            <div className="flex flex-col gap-4 mt-6 border-t border-white/10 pt-6">
                                {[
                                    { label: 'Gameplay', score: avgs.gp, icon: faGamepad, color: 'bg-brand-purple' },
                                    { label: 'Visuals', score: avgs.vs, icon: faTv, color: 'bg-brand-cyan' },
                                    { label: 'Story', score: avgs.st, icon: faBook, color: 'bg-brand-magenta' },
                                    { label: 'Audio', score: avgs.au, icon: faVolumeHigh, color: 'bg-green-500' },
                                    { label: 'Optimization', score: avgs.op, icon: faSliders, color: 'bg-brand-gold' },
                                ].map((aspect, i) => (
                                    <div key={i} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-350 flex items-center gap-1.5">
                                                <FontAwesomeIcon icon={aspect.icon} className="opacity-80" /> {aspect.label}
                                            </span>
                                            <span className="font-bold text-slate-200">{aspect.score || '0'} / 5</span>
                                        </div>
                                        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                                            <div className={`${aspect.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${(aspect.score / 5) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </BorderGlow>
                    </div>
                </AnimatedSlideUp>

                {/* Kolom Kanan: Detail Game & Ulasan User */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <AnimatedSlideUp>
                        {/* Card Deskripsi & Metadata */}
                        <div className="bg-space-card/40 border border-space-border rounded-2xl p-6">
                            <h3 className="font-header font-bold text-lg mb-4 text-white border-b border-white/10 pb-2">
                                About the Game
                            </h3>
                            <p className="text-slate-350 text-sm leading-relaxed whitespace-pre-wrap">
                                {(detailedGame || game).description || "Loading game details..."}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10 text-xs">
                                <div>
                                    <span className="text-slate-450 block mb-1 font-semibold uppercase tracking-wider">Platforms</span>
                                    <span className="text-slate-200">{(detailedGame || game).platforms?.map(p => p.name).join(', ') || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-450 block mb-1 font-semibold uppercase tracking-wider">Publishers</span>
                                    <span className="text-slate-200">{(detailedGame || game).publishers?.map(p => p.name).join(', ') || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-450 block mb-1 font-semibold uppercase tracking-wider">Age Rating</span>
                                    <span className="text-slate-200">{(detailedGame || game).esrb_rating?.name || 'Not Rated'}</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSlideUp>

                    {/* Reviews Feed */}
                    <AnimatedSlideUp>
                        <div className="bg-space-card/40 border border-space-border rounded-2xl p-6">
                            <h3 className="font-header font-bold text-lg mb-6 text-white flex justify-between items-center border-b border-white/10 pb-4">
                                <span>Reviews Feed</span>
                                <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-400 font-normal">
                                    {reviews.length} Comments
                                </span>
                            </h3>
                            {loading ? (
                                <div className="text-center py-12 text-slate-450 animate-pulse">
                                    Loading reviews from Supabase...
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-16 text-slate-500">
                                    <p className="text-base font-semibold">There are no reviews for this game yet.</p>
                                    <p className="text-xs mt-1">Be the first to leave a rating!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {reviews.map((rev) => {
                                        const overallRevScore = parseFloat(((rev.rating_gameplay + rev.rating_visual + rev.rating_story + rev.rating_audio + rev.rating_optimal) / 5).toFixed(1));
                                        return (
                                            <AnimatedSlideUp key={rev.id}>
                                                <div className="bg-black/20 border border-white/5 p-5 rounded-xl flex gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-brand-purple/15 text-brand-purple border border-brand-purple/20 flex items-center justify-center shrink-0">
                                                        <FontAwesomeIcon icon={faUser} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                            <h4 className="font-bold text-slate-200 text-sm truncate">{rev.username}</h4>
                                                            <span className="text-[10px] text-slate-500">
                                                                {new Date(rev.create_at).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                        {/* Score Breakdown Kecil */}
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 text-[10px] text-slate-400">
                                                            <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-brand-gold font-bold">
                                                                Overall: {overallRevScore} ⭐
                                                            </span>
                                                            <span>GP: {rev.rating_gameplay}</span>
                                                            <span>VS: {rev.rating_visual}</span>
                                                            <span>ST: {rev.rating_story}</span>
                                                            <span>AU: {rev.rating_audio}</span>
                                                            <span>OP: {rev.rating_optimal}</span>
                                                        </div>
                                                        <p className="text-slate-350 text-sm whitespace-pre-wrap leading-relaxed">
                                                            {rev.comment || <em className="text-slate-500">Gave a star rating without a comment.</em>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </AnimatedSlideUp>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </AnimatedSlideUp>
                </div>
            </div>

            {/* MODAL FORM RATING */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-space-card border border-space-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header Modal */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                            <h3 className="font-header font-bold text-xl text-white">Rate: {game.name}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer select-none focus:outline-none">
                                &times;
                            </button>
                        </div>
                        {/* Form Scrollable */}
                        <form onSubmit={handleSubmitReview} data-lenis-prevent='true' className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
                            {/* Input Username */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-300">Your Gamer Tag / Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="e.g. NoobMaster99"
                                    className="bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-slate-100 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                                    required
                                />
                            </div>
                            {/* Slider / Bintang Input Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <StarInput value={ratingGameplay} onChange={setRatingGameplay} label="Gameplay Rating" icon={faGamepad} />
                                <StarInput value={ratingVisual} onChange={setRatingVisual} label="Visual/Graphics Rating" icon={faTv} />
                                <StarInput value={ratingStory} onChange={setRatingStory} label="Story/Lore Rating" icon={faBook} />
                                <StarInput value={ratingAudio} onChange={setRatingAudio} label="Audio/Sfx Rating" icon={faVolumeHigh} />
                                <div className="sm:col-span-2">
                                    <StarInput value={ratingOptimal} onChange={setRatingOptimal} label="Optimization/Performance Rating" icon={faSliders} />
                                </div>
                            </div>
                            {/* Input Komentar */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-300">Your Review Comment (Optional)</label>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts about this game..." rows={4} className="bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-slate-100 text-sm focus:outline-none focus:border-brand-purple transition-colors resize-none" />
                            </div>
                            {/* CTA */}
                            <div className="flex justify-end gap-3 mt-4 border-t border-white/10 pt-4 shrink-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer select-none">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="bg-linear-to-br from-brand-purple to-purple-700 hover:brightness-110 disabled:opacity-50 text-white font-header font-bold px-6 py-2.5 rounded-lg text-sm shadow-lg shadow-brand-purple/20 transition-all flex items-center gap-2 cursor-pointer select-none">
                                    {submitting ? "Submitting..." : "Submit Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
}
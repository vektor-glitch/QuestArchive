"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { gamesModel, mapToGamesModel } from "../types/model/games";
import { mapToGamesResponse } from "../types/api/gamesResponse";
import Navbar from "../components/navbar";
import { Footer } from "../components/footer";
import HomePage from "../components/pages/home";
import EncyclopediaPage from "../components/pages/encyclopedia";
import RatePage from "../components/pages/rate";
import LeaderboardPage from "../components/pages/leaderboard";
import DetailedPage from "../components/pages/detailGame";

type Page = 'Home' | 'Encyclopedia' | 'Rate Arena' | 'Leaderboard' | 'Detail';

export default function MainPage() {
  const [activePage, setActivePage] = useState<Page>('Home');
  const [previousPage, setPreviousPage] = useState<Page>('Home');
  const [games, setGames] = useState<gamesModel[]>([]);
  const [featuredGame, setFeaturedGame] = useState<gamesModel | null>(null);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [activeReviewed, setActiveReviewed] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<string>('0');
  const [recommendedGames, setRecommendedGames] = useState<gamesModel[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<gamesModel | null>(null);

  // ini buat pagination
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null); // observer ref
  const lastGameElementRef = useCallback(
    (node: any) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect(); // reset observer
      observer.current = new IntersectionObserver((entries) => {
        // jika elemen muncul di layar dan masi ada datanya
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // tambah halaman +1
        }
      });
      if (node) observer.current.observe(node); // pantau elemen (node) baru
    },
    [isLoading, hasMore]
  );

  const ambilGame = async (pageNumber: number, query: string = searchQuery) => {
    if (isLoading || (!hasMore && pageNumber !== 1)) return;
    setIsLoading(true);
    try {
      const searchParam = query ? `&search=${query}` : '';
      const responseGames = await fetch(`https://api.rawg.io/api/games?key=6d5576de850f4374aae7ee1edc070ea3&page_size=20&page=${pageNumber}${searchParam}`);
      if (!responseGames.ok) {
        throw new Error("Error! Failed to Connect.");
      }
      const data = await responseGames.json();
      const gamesResponse = mapToGamesResponse(data);
      const newgames = mapToGamesModel(gamesResponse);
      setGames((prevgames) => {
        return pageNumber === 1 ? newgames : [...prevgames, ...newgames];
      });
      setTotalGames(data.count);
      const avg = newgames.length > 0 ? newgames.reduce((sum, g) => sum + g.rating, 0) / newgames.length : 0;
      setAvgScore(avg.toFixed(1));
      console.log(data);
      // ini untuk cek api masi punya halaman selanjutnya apa engga
      if (!data.next) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // ini kalo selesai loaading
    }
  };

  const ambilFeaturedGame = async () => {
    try {
      const now = new Date();
      const firstDay = `${now.getFullYear()}-01-01`;
      const lastDay = `${now.getFullYear()}-12-31`;
      const url = `https://api.rawg.io/api/games?key=6d5576de850f4374aae7ee1edc070ea3&ordering=-rating&dates=${firstDay},${lastDay}&page_size=10`;
      console.log("URL:", url);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch featured game.");
      const data = await res.json();
      setActiveReviewed(data.count);
      console.log("Data featured:", data);
      const games = mapToGamesModel(mapToGamesResponse(data));
      const featured = games.reduce((prev: any, curr: any) => (curr.ratings_count > prev.ratings_count ? curr : prev));
      const top3 = games.filter(g => g.id !== featured.id).slice(0, 3);
      setRecommendedGames(top3);
      const resDetail = await fetch(`https://api.rawg.io/api/games/${featured.slug}?key=6d5576de850f4374aae7ee1edc070ea3`);
      const detail = await resDetail.json();
      const featuredGameDesc = { ...featured, description: detail.description_raw, developers: detail.developers ?? [], };
      console.log("Featured game:", featuredGameDesc);

      setFeaturedGame(featuredGameDesc);
    } catch (error) {
      console.log("Error featured:", error);
    }
  };

  const handleOpenDetail = (game: gamesModel) => {
    setPreviousPage(activePage);
    setSelectedGame(game);
    setActivePage('Detail');
  };

  const handleSearch = (query: string) => {
    if (query === searchQuery) return;
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    setGames([]);
    setActivePage('Encyclopedia');
    ambilGame(1, query);
  };

  // ini buat mendeteksi perubahan page
  useEffect(() => {
    ambilGame(page);
  }, [page]); // teripicu pas setiap nilai page bertambah

  useEffect(() => {
    ambilFeaturedGame();
  }, []);

  return (
    <main className="bg-space-dark text-slate-200 font-body min-h-screen relative">

      {/* ini buat background */}
      <div className="fixed w-[50vw] h-[50vw] rounded-full pointer-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-purple to-transparent top-[-10%] left-[10%] animate-float-glow" />
      <div className="fixed w-[50vw] h-[50vw] rounded-full pointer-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-cyan to-transparent bottom-[-10%] right-[10%] animate-float-glow [animation-delay:5s]" />
      <div className="fixed w-[50vw] h-[50vw] rounded-full pointer-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-magenta to-transparent top-[40%] left-[50%] animate-float-glow [animation-delay:10s]" />

      {/* ini navbarnya */}
      <Navbar activePage={activePage} onNavigate={setActivePage} onSearch={handleSearch} />

      {/* Ini buat isi navbarnya per halaman */}
      {activePage === 'Home' && <HomePage games={games} featuredGame={featuredGame} onNavigate={setActivePage} totalGames={totalGames} activeReviewed={activeReviewed} avgScore={avgScore} recommendedGames={recommendedGames} onOpenDetail={handleOpenDetail} />}
      {activePage === 'Home' && <Footer onNavigate={setActivePage} />}

      {activePage === 'Encyclopedia' && (<EncyclopediaPage games={games} isLoading={isLoading} hasMore={hasMore} lastGameElementRef={lastGameElementRef} onNavigate={setActivePage} onOpenDetail={handleOpenDetail} />)}

      {activePage === 'Rate Arena' && <RatePage games={games} onOpenDetail={handleOpenDetail} />}
      {activePage === 'Rate Arena' && <Footer onNavigate={setActivePage} />}

      {activePage === 'Leaderboard' && <LeaderboardPage games={games} onOpenDetail={handleOpenDetail} />}
      {activePage === 'Leaderboard' && <Footer onNavigate={setActivePage} />}

      {activePage === 'Detail' && (<DetailedPage game={selectedGame} onNavigate={setActivePage} previousPage={previousPage} />)}
    </main>
  )
}

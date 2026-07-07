"use client";
import { useEffect, useState } from "react";
import { gamesModel, mapToGamesModel } from "../types/model/games";
import { mapToGamesResponse } from "../types/api/gamesResponse";
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Navbar from "../components/navbar";
import { Footer } from "../components/footer";
import HomePage from "../components/pages/home";
import EncyclopediaPage from "../components/pages/encyclopedia";
import RatePage from "../components/pages/rate";
import LeaderboardPage from "../components/pages/leaderboard";

type Page = 'Home' | 'Encyclopedia' | 'Rate Arena' | 'Leaderboard';

export default function MainPage() {
  const [activePage, setActivePage] = useState<Page>('Home')
  const [games, setGames] = useState<gamesModel[]>([]);
  const [featuredGame, setFeaturedGame] = useState<gamesModel | null>(null);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [activeReviewed, setActiveReviewed] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<string>(0);
  const [recommendedGames, setRecommendedGames] = useState<gamesModel[]>([]);

  const ambilGame = async () => {
    try {
      const responseGames = await fetch("https://api.rawg.io/api/games?key=6d5576de850f4374aae7ee1edc070ea3")
      if (!responseGames.ok) {
        throw new Error("Error! Failed to Connect.");
      }
      const data = await responseGames.json();
      const gamesResponse = mapToGamesResponse(data);
      const games = mapToGamesModel(gamesResponse);
      setGames(games);
      setTotalGames(data.count);
      const avg = games.reduce((sum, g) => sum + g.rating, 0) / games.length;
      setAvgScore(avg.toFixed(1));
      console.log(data);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    const fetchData = async () => {
      ambilGame()
      ambilFeaturedGame()
    }
    fetchData()
  }, [])

  return (
    <main className="bg-space-dark text-slate-200 font-body min-h-screen relative">

      {/* ini buat background */}
      <div className="fixed w-[50vw] h-[50vw] rounded-full pointer-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-purple to-transparent top-[-10%] left-[10%] animate-float-glow" />
      <div className="fixed w-[50vw] h-[50vw] rounded-full pointer-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-cyan to-transparent bottom-[-10%] right-[10%] animate-float-glow [animation-delay:5s]" />
      <div className="fixed w-[50vw] h-[50vw] rounded-full pointer-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-magenta to-transparent top-[40%] left-[50%] animate-float-glow [animation-delay:10s]" />

      {/* ini navbarnya */}
      <Navbar activePage={activePage} onNavigate={setActivePage} />

      {/* Ini buat isi navbarnya per halaman */}
      {activePage === 'Home' && <HomePage games={games} featuredGame={featuredGame} onNavigate={setActivePage} totalGames={totalGames} activeReviewed={activeReviewed} avgScore={avgScore} recommendedGames={recommendedGames} />}
      {activePage === 'Encyclopedia' && <EncyclopediaPage games={games} />}
      {activePage === 'Rate Arena' && <RatePage games={games} />}
      {activePage === 'Leaderboard' && <LeaderboardPage games={games} />}

      <Footer onNavigate={setActivePage} />

    </main>
  )
}

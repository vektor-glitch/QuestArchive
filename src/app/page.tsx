"use client";
import { useEffect, useState } from "react";
import { gamesModel, mapToGamesModel } from "../types/model/games";
import { mapToGamesResponse } from "../types/api/gamesResponse";
import Navbar from "../components/navbar";
import "./global.css";

type Page = 'Home' | 'Encyclopedia' | 'Rate Arena' | 'Leaderboard';

export default function Home() {
  const [activePage, setActivePage] = useState<Page>('Home')

  return (
    <main className="bg-space-dark text-slate-200 font-body min-h-screen relative overflow-x-hidden">

      {/* ini buat background */}
      <div className="fixed w-[50vw] h-[50vw] rounded-full ponter-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-purple to-transparent top-[-10%] left-[10%] animate-float-glow" />
      <div className="fixed w-[50vw] h-[50vw] rounded-full ponter-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-cyan to-transparent bottom-[-10%] right-[10%] animate-float-glow [animation-delay:5s]" />
      <div className="fixed w-[50vw] h-[50vw] rounded-full ponter-events-none z-[-1] blur-[150px] opacity-15 mix-blend-screen bg-glow-gradient from-brand-magenta to-transparent top-[40%%] left-[50%] animate-float-glow [animation-delay:10s]" />

      {/* ini navbarnya */}
      <Navbar activePage={activePage} onNavigate={setActivePage} />

      {/* Ini buat isi navbarnya per halaman */}
      {activePage === 'Home' && <div></div>}
      {activePage === 'Encyclopedia' && <div>Encylopedia Page</div>}
      {activePage === 'Rate Arena' && <div>Rate Arena Page</div>}
      {activePage === 'Leaderboard' && <div>Leaderboard Page</div>}

    </main>
  )
}

// export default function Page() {

//   const [games, setGames] = useState<gamesModel[]>([]);

//   const ambilGame = async () => {
//     try {
//       const responseGames = await fetch("https://api.rawg.io/api/games?key=6d5576de850f4374aae7ee1edc070ea3")
//       if (!responseGames.ok) {
//         throw new Error("Error! Failed to Connect.");
//       }

//       const data = await responseGames.json();
//       const gamesResponse = mapToGamesResponse(data);
//       const games = mapToGamesModel(gamesResponse);

//       setGames(games);

//       console.log(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await ambilGame();
//     };
//     fetchData();
//   }, []);
// }

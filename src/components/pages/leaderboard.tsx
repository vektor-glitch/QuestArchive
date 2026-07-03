import { gamesModel } from "@/src/types/model/games";

interface HomePageProps {
    games: gamesModel[];
}

export default function HomePage({ games }: HomePageProps) {
    return (
        <h1>halo</h1>
    )
}
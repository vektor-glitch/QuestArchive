import { gamesResponse } from "../api/gamesResponse";

export interface RatingDetail {
    id: number;
    title: string;
    count: number;
    percent: number;
}

export interface platform {
    id: number;
    name: string;
    slug: string;
}
export interface publisher {
    id: number;
    name: string;
    slug: string;
}
export interface ESRBRating {
    id: number;
    name: string;
    slug: string;
}

export interface gamesModel {
    id: number;
    slug: string;
    name: string;
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    ratings: RatingDetail[];
    description?: string;
    ratings_count: number;
    genres: { id: number; name: string; slug: string }[];
    developers: { id: number; name: string }[];
    platforms?: platform[];
    publishers?: publisher[];
    esrb_rating?: ESRBRating | null;
    metacritic?: number;
}

export function mapToGamesModel(data: gamesResponse): gamesModel[] {
    return data.results.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        released: item.released,
        tba: item.tba,
        background_image: item.background_image,
        rating: item.rating,
        ratings: item.ratings,
        ratings_count: item.ratings_count,
        genres: item.genres ?? [],
        developers: item.developers ?? [],
        platforms: item.platforms ? item.platforms.map((p: any) => p.platform) : [],
        publishers: item.publishers ?? [],
        esrb_rating: item.esrb_rating ?? null,
        metacritic: item.metacritic ?? 0,
    }));
}
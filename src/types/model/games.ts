import { gamesResponse } from "../api/gamesResponse";

export interface RatingDetail {
    id: number;
    title: string;
    count: number;
    percent: number;
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
    }));
}
import { gamesModel } from "../model/games";

export interface gamesResponse {
    results: gamesModel[];
}

export function mapToGamesResponse(data: any): gamesResponse {
    return {
        results: data.results,
    };
}
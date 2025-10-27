import axios from "axios";
import type { Movie } from "../types";

const api = axios.create({
    baseURL: "https://cinemaguide.skillbox.cc",
    withCredentials: true,
});

export const getTopMovies = async (): Promise<Movie[]> => {
    const response = await api.get("/movie/top10");
    return response.data;
};

export const getRandomMovie = async (): Promise<Movie> => {
    const response = await api.get("/movie/random");
    return response.data;
};

export const getGenres = async (): Promise<string[]> => {
    const response = await api.get("/movie/genres");
    return response.data;
};

export const getMoviesByGenre = async (genre: string, page = 1, limit = 10): Promise<Movie[]> => {
    const response = await api.get("/movie", {
        params: {
            genre,
            page,
            limit,
        },
    });
    return response.data
};

export const getMovieByID = async (id: string | number): Promise<Movie> => {
    const response = await api.get(`/movie/${id}`);
    return response.data;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    const response = await api.get("/movie", {
        params: {search: query},
    });
    return response.data
};
import axios from "axios";

const api = axios.create({
    baseURL: "https://cinemaguide.skillbox.cc",
    withCredentials: true,
});

export interface AuthInfo {
    email: string;
    password: string;
}

export interface RegisterData extends AuthInfo {
    name: string;
    surname: string;
    repeatPassword: string;
}

export interface User {
    name: string;
    surname: string;
    email: string;
    favorites?: number[];
}

export const login = async (data: AuthInfo): Promise<{ result: boolean }> => {
    const response = await api.post("/auth/login", data);
    return response.data
};

export const register = async (data: RegisterData): Promise<{ result: boolean }> => {
    const response = await api.post("/user", data);
    return response.data
};

export const logout = async (): Promise<{ result: boolean }> => {
    const response = await api.get("/auth/logout");
    return response.data;
};

export const getProfile = async (): Promise<User> => {
    const response = await api.get("/profile");
    return response.data;
};
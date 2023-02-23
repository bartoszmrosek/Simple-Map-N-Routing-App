import { useState } from "react";

type UseFetchReturn<T> = { result: T | Error | null; isLoading: boolean; makeRequest: (payload?: unknown) => Promise<void>; };

/**
 * React custom hook which retuns object with proper state, it`s typing and additional functions regarding requests
 * @param url proper url used to access REST api of backend server
 * @returns object containing results of request,
 *  it`s current status and function to make request, function can take one argument to make it POST request
 */
export const useFetch = <T>(url: string): UseFetchReturn<T> => {
    const [result, setResult] = useState<T | Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const makeRequest = async (payload?: unknown) => {
        const requestOptions: RequestInit = payload ? {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        } : {
            method: "GET",
        };
        setIsLoading(true);
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) { throw new Error(`Respone is invalid, ${response}`); }
            // This is assuming you know what server returns
            const results: T = await response.json() as T;
            setResult(results);
        } catch (error) {
            setResult(new Error(`${error}`));
        } finally {
            setIsLoading(false);
        }
    };

    return { result, isLoading, makeRequest };
};

import { getAirPollution, getCurrentWeather, getForcastWeather, getReverseGeocode, searchLocations } from './../api/weather';
import type { Coordinates } from '@/api/types';
import { useQuery } from '@tanstack/react-query';

export const WEATHER_KEYS = {
    weather: (coords: Coordinates) => ['weather', coords] as const,
    forcast: (coords: Coordinates) => ['forcast', coords] as const,
    location: (coords: Coordinates) => ['location', coords] as const,
    search: (query: string) => ['search', query],
    pollution: (coords: Coordinates) => ['pollution', coords] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => (coordinates ? getCurrentWeather(coordinates) : null),
        enabled: !!coordinates,
    });
}

export function useForcastQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.forcast(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => (coordinates ? getForcastWeather(coordinates) : null),
        enabled: !!coordinates,
    });
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => (coordinates ? getReverseGeocode(coordinates) : null),
        enabled: !!coordinates,
    });
}

export function useLocationSearch(query: string) {
    return useQuery({
        queryKey: WEATHER_KEYS.search(query),
        queryFn: () => searchLocations(query),
        enabled: query.length >= 3,
    });
}

export function usePollutionQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.pollution(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => (coordinates ? getAirPollution(coordinates) : null),
        enabled: !!coordinates,
    });
}
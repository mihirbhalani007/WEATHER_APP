import axios from 'axios';
import { API_CONFIG } from './config';
import type { Coordinates, WeatherData, ForecastData, GeocodingResponse, AirPollutionResponse } from './types';

// weather instance
const weatherClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    params: API_CONFIG.DEFAULT_PARAMS,
});

weatherClient.interceptors.request.use((config) => {
    config.params = {
        ...API_CONFIG.DEFAULT_PARAMS,
        ...config.params,
    };
    return config;
});

//geo location instance
const geoClient = axios.create({
    baseURL: API_CONFIG.GEO,
    params: {
        appid: API_CONFIG.API_KEY,
    },
});

geoClient.interceptors.request.use((config) => {
    config.params = {
        appid: API_CONFIG.API_KEY,
        ...config.params,
    };
    return config;
});

// Api functions
export const getCurrentWeather = async ({ lat, lon }: Coordinates): Promise<WeatherData> => {
    const response = await weatherClient.get<WeatherData>('/weather', {
        params: {
            lat: lat.toString(),
            lon: lon.toString(),
        },
    });
    return response.data;
};

export const getForcastWeather = async ({ lat, lon }: Coordinates): Promise<ForecastData> => {
    const response = await weatherClient.get<ForecastData>('/forecast', {
        params: { lat: lat.toString(), lon: lon.toString() },
    });
    return response.data;
};

export const getReverseGeocode = async ({ lat, lon }: Coordinates): Promise<GeocodingResponse[]> => {
    const response = await geoClient.get<GeocodingResponse[]>('/reverse', {
        params: { lat: lat.toString(), lon: lon.toString() },
    });
    return response.data;
};

export const searchLocations = async (query: string): Promise<GeocodingResponse[]> => {
    const response = await geoClient.get<GeocodingResponse[]>('/direct', {
        params: { q: query, limit: 5 },
    });
    return response.data;
};

export const getAirPollution = async ({ lat, lon }: Coordinates): Promise<AirPollutionResponse> => {
    const response = await weatherClient.get<AirPollutionResponse>('/air_pollution', {
        params: {
            lat: lat.toString(),
            lon: lon.toString(),
        },
    });
    return response.data;
};

import useGeolocation from './useGeolocation';
import { useForcastQuery, usePollutionQuery, useReverseGeocodeQuery, useWeatherQuery } from './useWeather';

// useWeatherDashboardData.ts
export const useWeatherDashboardData = () => {
    const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation();
    const locationQuery = useReverseGeocodeQuery(coordinates);
    const forecastQuery = useForcastQuery(coordinates);
    const weatherQuery = useWeatherQuery(coordinates);
    const pollutionQuery = usePollutionQuery(coordinates);

    const handleRefresh = () => {
        getLocation();
        locationQuery.refetch();
        forecastQuery.refetch();
        weatherQuery.refetch();
        pollutionQuery.refetch();
    };

    return {
        coordinates,
        locationError,
        locationLoading,
        getLocation,
        locationQuery,
        forecastQuery,
        weatherQuery,
        pollutionQuery,
        handleRefresh,
    };
};

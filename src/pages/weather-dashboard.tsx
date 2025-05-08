import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import CurrentWeather from '@/components/CurrentWeather';
import { WeatherDetails } from '@/components/WeatherDetails';
import { WeatherForecast } from '@/components/WeatherForcast';
import WeatherSkeleton from '@/components/LoadingSkeleton';
import { FavoriteCities } from '@/components/FavoriteCities';
// import AirPollutionChart from '@/components/AirPollutionChart';
import { useWeatherDashboardData } from '@/hooks/useWeatherDashboardData';
import ErrorAlert from '@/components/ErrorAlert';
import HourlyTemperature from '@/components/HourlyTemprature';
import React, { Suspense } from 'react';
import AirPollutionSkeleton from '@/components/AirPollutionSkeleton';
const AirPollutionChart = React.lazy(() => import('@/components/AirPollutionChart'));

const WeatherDashboard = () => {
    const {
        coordinates,
        locationError,
        locationLoading,
        getLocation,
        locationQuery,
        forecastQuery,
        weatherQuery,
        pollutionQuery,
        handleRefresh,
    } = useWeatherDashboardData();

    const locationName = locationQuery.data?.[0];

    if (locationError) {
        return <ErrorAlert title="Location Required" description={locationError} onRetry={getLocation} buttonText="Enable Location" />;
    }

    if (!coordinates) {
        return (
            <ErrorAlert
                title="Location Required"
                description="Please enable location access to see your local weather data"
                onRetry={getLocation}
                buttonText="Enable Location"
            />
        );
    }

    if (weatherQuery.error || forecastQuery.error || pollutionQuery.error) {
        return (
            <ErrorAlert
                title="Error"
                description="Failed to fetch weather data! Please try again."
                onRetry={handleRefresh}
                buttonText="Retry"
            />
        );
    }

    const isLoadingAll = [weatherQuery, forecastQuery, locationQuery, pollutionQuery].some((query) => query.isLoading) || locationLoading;

    if (isLoadingAll) {
        return <WeatherSkeleton />;
    }

    return (
        <div className="space-y-4 mx-auto">
            <FavoriteCities />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">My Location</h1>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleRefresh}
                    disabled={weatherQuery.isFetching || forecastQuery.isFetching || pollutionQuery.isFetching}
                >
                    <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching || forecastQuery.isFetching ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            <div className="grid gap-6">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                    <div className="flex-1 flex flex-col">
                        {weatherQuery.data && <CurrentWeather data={weatherQuery.data} locationName={locationName} />}
                    </div>
                    <div className="flex-1 flex flex-col">{forecastQuery.data && <HourlyTemperature data={forecastQuery.data} />}</div>
                </div>
                <div>
                    {pollutionQuery.data?.list?.length ? (
                        <Suspense fallback={<AirPollutionSkeleton />}>
                            <AirPollutionChart data={pollutionQuery.data.list[0]} />
                        </Suspense>
                    ) : null}
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">{forecastQuery.data && <WeatherForecast data={forecastQuery.data} />}</div>
                </div>
                <div className="flex-1">{weatherQuery.data && <WeatherDetails data={weatherQuery.data} />}</div>
            </div>
        </div>
    );
};

export default WeatherDashboard;

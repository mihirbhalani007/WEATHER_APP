import { useForcastQuery, usePollutionQuery, useReverseGeocodeQuery, useWeatherQuery } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyTemprature from '@/components/HourlyTemprature';
import { WeatherDetails } from '@/components/WeatherDetails';
import { WeatherForecast } from '@/components/WeatherForcast';
import WeatherSkeleton from '@/components/LoadingSkeleton';
import useGeolocation from '@/hooks/useGeolocation';
import { FavoriteCities } from '@/components/FavoriteCities';
import AirPollutionChart from '@/components/AirPollutionChart';

const WeatherDashboard = () => {
    const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation();

    // Updated usage of custom query hooks
    const locationQuery = useReverseGeocodeQuery(coordinates);
    const forcastQuery = useForcastQuery(coordinates);
    const weatherQuery = useWeatherQuery(coordinates);
    const pollutionQuery = usePollutionQuery(coordinates);

    const locationName = locationQuery.data?.[0];

    const handleRefresh = () => {
        getLocation();
        locationQuery.refetch();
        forcastQuery.refetch();
        weatherQuery.refetch();
        pollutionQuery.refetch();
    };

    if (locationError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription>
                    <p>{locationError}</p>
                    <Button onClick={getLocation} variant={'outline'} className="w-fit">
                        <MapPin className="mr-2 h-4 w-4" /> Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (!coordinates) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Location Required</AlertTitle>
                <AlertDescription>
                    <p>Please enable location access to see your local weather data</p>
                    <Button onClick={getLocation} variant={'outline'} className="w-fit">
                        <MapPin className="mr-2 h-4 w-4" /> Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (weatherQuery.error || forcastQuery.error || pollutionQuery.error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    <p>Failed to fetch weather data! Please try again.</p>
                    <Button onClick={handleRefresh} variant={'outline'} className="w-fit">
                        <RefreshCw className="mr-2 h-4 w-4" /> Retry
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    const isLoadingAll =
        weatherQuery.isLoading || forcastQuery.isLoading || locationQuery.isLoading || locationLoading || pollutionQuery.isLoading;

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
                    disabled={weatherQuery.isFetching || forcastQuery.isFetching || pollutionQuery.isFetching}
                >
                    <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching || forcastQuery.isFetching ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            <div className="grid gap-6">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                    <div className="flex-1 flex flex-col">
                        {weatherQuery.data && <CurrentWeather data={weatherQuery.data} locationName={locationName} />}
                    </div>
                    <div className="flex-1 flex flex-col">{forcastQuery.data && <HourlyTemprature data={forcastQuery.data} />}</div>
                </div>

                {pollutionQuery.data?.list?.[0] && <AirPollutionChart data={pollutionQuery.data.list[0]} />}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">{forcastQuery.data && <WeatherForecast data={forcastQuery.data} />}</div>
                </div>
                <div className="flex-1">{weatherQuery.data && <WeatherDetails data={weatherQuery.data} />}</div>
            </div>
        </div>
    );
};

export default WeatherDashboard;

import { useParams, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useWeatherQuery, useForcastQuery, usePollutionQuery } from '@/hooks/useWeather';
import WeatherSkeleton from '@/components/LoadingSkeleton';
import CurrentWeather from '@/components/CurrentWeather';
import { WeatherDetails } from '@/components/WeatherDetails';
import { WeatherForecast } from '@/components/WeatherForcast';
import { FavoriteButton } from '@/components/FavoriteButton';
import AirPollutionChart from '@/components/AirPollutionChart';
import HourlyTemperature from '@/components/HourlyTemprature';
import AirPollutionSkeleton from '@/components/AirPollutionSkeleton';

export default function CityPage() {
    const [searchParams] = useSearchParams();
    const params = useParams();
    const coordinates = {
        lat: parseFloat(searchParams.get('lat') || '0'),
        lon: parseFloat(searchParams.get('lon') || '0'),
    };

    const { data: weatherData, error: weatherError, isLoading: weatherLoading } = useWeatherQuery(coordinates);
    const { data: forecastData, error: forecastError, isLoading: forecastLoading } = useForcastQuery(coordinates);
    const { data: pollutionData, isLoading: pollutionLoading } = usePollutionQuery(coordinates);

    if (weatherError || forecastError) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Failed to load weather data. Please try again.</AlertDescription>
            </Alert>
        );
    }

    if (weatherLoading || forecastLoading || !params.cityName || !weatherData || !forecastData) {
        return <WeatherSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {params.cityName}, {weatherData.sys.country}
                </h1>
                <FavoriteButton data={{ ...weatherData, name: params.cityName }} />
            </div>
            <div className="grid gap-6">
                <CurrentWeather data={weatherData} />
                <HourlyTemperature data={forecastData} />
                {pollutionLoading ? (
                    <AirPollutionSkeleton />
                ) : pollutionData?.list?.[0] ? (
                    <AirPollutionChart data={pollutionData.list[0]} />
                ) : null}
                <div className="grid gap-6 md:grid-cols-2 items-start">
                    <WeatherDetails data={weatherData} />
                    <WeatherForecast data={forecastData} />
                </div>
            </div>
        </div>
    );
}

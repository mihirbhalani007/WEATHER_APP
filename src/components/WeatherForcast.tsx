import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowDown, ArrowUp, Droplets, Wind, CloudRain } from 'lucide-react';
import { format } from 'date-fns';
import type { ForecastData } from '@/api/types';

interface WeatherForecastProps {
    data: ForecastData;
}

interface DailyForecast {
    date: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    wind: number;
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    };
    pop: number;
    rain: number;
}

export function WeatherForecast({ data }: WeatherForecastProps) {
    const dailyForecasts = useMemo(() => {
        const grouped: Record<string, DailyForecast> = {};

        data?.list?.forEach((forecast) => {
            const dateKey = format(new Date(forecast.dt * 1000), 'yyyy-MM-dd');

            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: forecast.dt,
                    temp_min: forecast.main.temp_min,
                    temp_max: forecast.main.temp_max,
                    humidity: forecast.main.humidity,
                    wind: forecast.wind.speed,
                    weather: forecast.weather[0],
                    pop: forecast.pop ?? 0,
                    rain: forecast.rain?.['3h'] ?? 0,
                };
            } else {
                grouped[dateKey].temp_min = Math.min(grouped[dateKey].temp_min, forecast.main.temp_min);
                grouped[dateKey].temp_max = Math.max(grouped[dateKey].temp_max, forecast.main.temp_max);
                grouped[dateKey].pop += forecast.pop ?? 0;
                grouped[dateKey].rain += forecast.rain?.['3h'] ?? 0;
            }
        });

        return Object.values(grouped);
    }, [data]);

    const nextDays = dailyForecasts.slice(1, 6);

    const formatTemp = (temp: number) => `${Math.round(temp)}°`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {nextDays.map((day) => (
                        <div
                            key={day.date}
                            className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 rounded-lg border p-4 hover:font-bold"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                                    alt={day.weather.description}
                                    className="h-12 w-12"
                                />
                                <div>
                                    <p className="font-medium">{format(new Date(day.date * 1000), 'EEE, MMM d')}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{day.weather.description}</p>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4">
                                <span className="flex items-center text-blue-500">
                                    <ArrowDown className="mr-1 h-4 w-4" />
                                    {formatTemp(day.temp_min)}
                                </span>
                                <span className="flex items-center text-red-500">
                                    <ArrowUp className="mr-1 h-4 w-4" />
                                    {formatTemp(day.temp_max)}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-end gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    {day.humidity}%
                                </span>
                                <span className="flex items-center gap-1">
                                    <Wind className="h-4 w-4 text-blue-500" />
                                    {day.wind} m/s
                                </span>
                                <span className="flex items-center gap-1">
                                    <CloudRain className="h-4 w-4 text-blue-500" />
                                    {Math.round(day.pop * 100)}% POP
                                </span>
                                {day.rain > 0 && (
                                    <span className="flex items-center gap-1">
                                        <CloudRain className="h-4 w-4 text-blue-500" />
                                        {day.rain.toFixed(1)} mm
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

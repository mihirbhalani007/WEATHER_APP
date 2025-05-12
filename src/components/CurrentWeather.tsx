import type { WeatherData, GeocodingResponse } from '@/api/types';
import { Card, CardContent } from './ui/card';
import { ArrowDown, ArrowUp, Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CurrentWeatherData {
    data: WeatherData;
    locationName?: GeocodingResponse;
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherData) => {
    const [crrLocationName, setCrrLocationName] = useState<GeocodingResponse>();
    useEffect(() => {
        if (locationName) {
            setCrrLocationName(locationName);
        }
    }, [locationName]);
    const {
        weather: [currentWeather],
        main: { temp, feels_like, temp_min, temp_max, humidity },
    } = data;

    const formatTemp = (temp: number) => `${Math.round(temp)}°`;

    const getTempColor = (temp: number) => {
        const minTemp = 10;
        const maxTemp = 45;
        const tempRange = maxTemp - minTemp;

        const tempPercentage = Math.min(Math.max((temp - minTemp) / tempRange, 0), 1);

        const coldColor = { r: 0, g: 0, b: 255 };
        const coolColor = { r: 0, g: 255, b: 255 };
        const warmColor = { r: 255, g: 165, b: 0 };
        const hotColor = { r: 255, g: 0, b: 0 };

        let color;

        if (tempPercentage <= 0.25) {
            color = {
                r: coldColor.r + (coolColor.r - coldColor.r) * (tempPercentage / 0.25),
                g: coldColor.g + (coolColor.g - coldColor.g) * (tempPercentage / 0.25),
                b: coldColor.b + (coolColor.b - coldColor.b) * (tempPercentage / 0.25),
            };
        } else if (tempPercentage <= 0.5) {
            const adjustedPercentage = (tempPercentage - 0.25) / 0.25;
            color = {
                r: coolColor.r + (warmColor.r - coolColor.r) * adjustedPercentage,
                g: coolColor.g + (warmColor.g - coolColor.g) * adjustedPercentage,
                b: coolColor.b + (warmColor.b - coolColor.b) * adjustedPercentage,
            };
        } else if (tempPercentage <= 0.75) {
            const adjustedPercentage = (tempPercentage - 0.5) / 0.25;
            color = {
                r: warmColor.r + (hotColor.r - warmColor.r) * adjustedPercentage,
                g: warmColor.g + (hotColor.g - warmColor.g) * adjustedPercentage,
                b: warmColor.b + (hotColor.b - warmColor.b) * adjustedPercentage,
            };
        } else {
            color = hotColor;
        }

        return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
    };

    return (
        <Card className="h-full overflow-hidden rounded-2xl flex flex-col">
            <CardContent className="flex flex-col justify-between flex-grow p-4 space-y-4 items-center">
                <div className="w-full max-w-xl space-y-6">
                    {/* Location */}
                    <div className="text-center space-y-1">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {crrLocationName?.name}
                            {crrLocationName?.state && (
                                <span className="text-lg text-muted-foreground font-normal">, {crrLocationName.state}</span>
                            )}
                        </h2>
                        <p className="text-base text-muted-foreground">{crrLocationName?.country}</p>
                    </div>

                    {/* Temperature */}
                    <div className="flex justify-center items-start gap-6">
                        <p className="text-7xl font-bold tracking-tighter" style={{ color: getTempColor(temp) }}>
                            {formatTemp(temp)}
                        </p>
                        <div className="space-y-1 pt-2">
                            <p className="text-sm font-medium text-muted-foreground">Feels like {formatTemp(feels_like)}</p>
                            <div className="flex gap-4 text-sm font-medium">
                                <span className="flex items-center gap-1 text-blue-500">
                                    <ArrowDown className="h-4 w-4" />
                                    {formatTemp(temp_min)}
                                </span>
                                <span className="flex items-center gap-1 text-red-500">
                                    <ArrowUp className="h-4 w-4" />
                                    {formatTemp(temp_max)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Humidity & Cloudiness */}
                    <div className="flex justify-center items-start gap-x-32">
                        <div className="flex items-center gap-3">
                            <Droplets className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Humidity</p>
                                <p className="text-sm text-muted-foreground">{humidity}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Droplets className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">Cloudiness</p>
                                <p className="text-sm text-muted-foreground">{data.clouds.all}% Cloudy</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-start gap-x-60">
                            <div className="flex items-center gap-3">
                                <Droplets className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium">Visibility</p>
                                    <p className="text-sm text-muted-foreground">{data.visibility / 1000} km</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weather Icon */}
                <div className="flex flex-col items-center justify-center pt-2">
                    <div className="relative flex aspect-square w-full max-w-[160px] items-center justify-center">
                        <img
                            src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                            alt={currentWeather.description}
                            className="h-full w-full object-contain"
                        />
                        <div className="absolute bottom-2 text-center w-full">
                            <p className="text-sm font-medium capitalize text-muted-foreground">{currentWeather.description}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentWeather;

// src/components/weather/favorite-cities.tsx
import { useNavigate } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useWeatherQuery } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteCityTabletProps {
    id: string;
    name: string;
    lat: number;
    lon: number;
    onRemove: (id: string) => void;
}

function FavoriteCityTablet({ id, name, lat, lon, onRemove }: FavoriteCityTabletProps) {
    const navigate = useNavigate();
    const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

    const handleClick = () => {
        navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    };

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onRemove(id);
        toast.error(`Removed ${name} from Favorites`);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="relative flex min-w-[250px] items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground"
                onClick={handleRemove}
            >
                <X className="h-4 w-4" />
            </Button>

            {isLoading ? (
                <div className="flex h-8 items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            ) : weather && weather.weather?.[0] ? (
                <>
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                            className="h-8 w-8"
                        />
                        <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
                        </div>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-xl font-bold">{Math.round(weather.main.temp)}°</p>
                        <p className="text-xs capitalize text-muted-foreground">{weather.weather[0].description}</p>
                    </div>
                </>
            ) : null}
        </button>
    );
}

export function FavoriteCities() {
    const { favorites, removeFavorite } = useFavorites();

    const handleRemove = (id: string) => {
        removeFavorite.mutate(id);
    };

    if (!favorites.length) {
        return null;
    }

    return (
        <>
            <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
            <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                    {favorites.map((city) => (
                        <FavoriteCityTablet key={city.id} {...city} onRemove={handleRemove} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="mt-2" />
            </ScrollArea>
        </>
    );
}

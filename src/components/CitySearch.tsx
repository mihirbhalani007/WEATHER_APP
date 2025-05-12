import { useLocationSearch } from '@/hooks/useWeather';
import { useState } from 'react';
import { Button } from './ui/button';
import { Clock, Loader2, Search, Star, XCircle } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { useNavigate } from 'react-router-dom';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { format } from 'date-fns';
import { useFavorites } from '@/hooks/useFavorites';

const CitySearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const { data: locations, isLoading } = useLocationSearch(query);
    const { history, clearHistory, addToHistory } = useSearchHistory();

    const { favorites } = useFavorites();

    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split('|');

        navigate(`/city/${name}??lat=${lat}&lon=${lon}`);

        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country,
        });

        setOpen(false);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
            >
                <Search className="h-4 w-4 mr-2" />
                Search Cities
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search Cities..." value={query} onValueChange={setQuery} />
                <CommandList>
                    {query.length > 2 && !isLoading && <CommandEmpty>No results found.</CommandEmpty>}

                    {history.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">Recent Searches</p>
                                    <Button variant="ghost" size="sm" onClick={() => clearHistory.mutate()}>
                                        <XCircle className="h-4 w-4" />
                                        Clear
                                    </Button>
                                </div>

                                {/* Favorites Section */}
                                {favorites.length > 0 && (
                                    <CommandGroup heading="Favorites">
                                        {favorites.map((city) => (
                                            <CommandItem
                                                key={city.id}
                                                value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                                                onSelect={handleSelect}
                                            >
                                                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                                <span>{city.name}</span>
                                                {city.state && <span className="text-sm text-muted-foreground">, {city.state}</span>}
                                                <span className="text-sm text-muted-foreground">, {city.country}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {history.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>{item.name}</span>
                                        {item.state && <span className="text-sm text-muted-foreground">, {item.state}</span>}
                                        <span className="text-sm text-muted-foreground">, {item.country}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {format(item.searchedAt, 'MMM d, h:mm a')}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}

                    <CommandSeparator />
                    {locations && locations.length > 0 && (
                        <CommandGroup heading="Suggestions">
                            {isLoading && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            )}
                            {locations.map((location) => (
                                <CommandItem
                                    key={`${location.lat}-${location.lon}`}
                                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                    onSelect={handleSelect}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    <span>{location.name}</span>
                                    {location.state && <span className="text-sm text-muted-foreground">, {location.state}</span>}
                                    <span className="text-sm text-muted-foreground">, {location.country}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandSeparator />
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default CitySearch;

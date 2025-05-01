import { AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useGeolocation from '@/hooks/useGeolocation';
import WeatherSkeleton from '@/components/LoadingSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useReverseGeocodeQuery } from '@/hooks/useWeather';
const WeatherDashboard = () => {
    const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation();

    const locationQuery = useReverseGeocodeQuery(coordinates);
    console.log(locationQuery);

    const handleRefresh = () => {
        getLocation();
        // if (coordinates) {
        // reload weather data
        // }
    };

    if (locationLoading) {
        return <WeatherSkeleton />;
    }

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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">My Location</h1>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleRefresh}
                    // disabled={}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default WeatherDashboard;

import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function AirPollutionSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-48" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[300px]">
                    <Skeleton className="h-full w-full rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}

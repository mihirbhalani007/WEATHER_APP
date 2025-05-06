import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

type AirPollutionData = {
    main: { aqi: number };
    components: {
        co: number;
        no: number;
        no2: number;
        o3: number;
        so2: number;
        pm2_5: number;
        pm10: number;
        nh3: number;
    };
    dt: number;
};

type Props = {
    data: AirPollutionData;
};

export default function AirPollutionChart({ data }: Props) {
    if (!data || !data.components) return null;

    const chartData = Object.entries(data.components).map(([key, value]) => ({
        pollutant: key,
        value,
    }));

    const chartConfig = {
        co: { label: 'CO', color: 'hsl(var(--chart-1))' },
        no: { label: 'NO', color: 'hsl(var(--chart-2))' },
        no2: { label: 'NO₂', color: 'hsl(var(--chart-3))' },
        o3: { label: 'O₃', color: 'hsl(var(--chart-4))' },
        so2: { label: 'SO₂', color: 'hsl(var(--chart-5))' },
        pm2_5: { label: 'PM2.5', color: 'hsl(var(--chart-6))' },
        pm10: { label: 'PM10', color: 'hsl(var(--chart-7))' },
        nh3: { label: 'NH₃', color: 'hsl(var(--chart-8))' },
    } as const;

    return (
        <Card className="w-full lg:w-1/2">
            <CardHeader>
                <CardTitle>Air Pollution Radar</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto h-full w-full">
                    <RadarChart data={chartData}>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <PolarGrid gridType="circle" />
                        <PolarAngleAxis dataKey="pollutant" />
                        <Radar name="Pollution" dataKey="value" fill="hsl(var(--chart-3))" fillOpacity={0.6} stroke="hsl(var(--chart-3))" />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

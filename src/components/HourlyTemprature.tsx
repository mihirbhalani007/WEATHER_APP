'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { ForecastData } from '@/api/types';

interface HourlyTemperatureProps {
    data: ForecastData;
}

interface ChartData {
    time: string;
    temp: number;
    feels_like: number;
}

// ✅ Config aligned with actual data keys
const chartConfig = {
    temp: {
        label: 'Temperature',
        color: 'hsl(var(--chart-1))',
    },
    feels_like: {
        label: 'Feels Like',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

export default function HourlyTemperature({ data }: HourlyTemperatureProps) {
    const chartData: ChartData[] = data?.list?.slice(0, 8).map((item) => ({
        time: format(new Date(item.dt * 1000), 'ha'),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Temperature</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={100}>
                        <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line dataKey="temp" type="monotone" stroke="var(--color-temp)" strokeWidth={2} dot={false} />
                            <Line
                                dataKey="feels_like"
                                type="monotone"
                                stroke="var(--color-feels_like)"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="4 4"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

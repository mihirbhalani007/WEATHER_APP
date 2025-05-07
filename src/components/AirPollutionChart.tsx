import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { AirPollutionData } from '@/api/types';

type Props = {
    data: AirPollutionData;
};

export default function AirPollutionChart({ data }: Props) {
    if (!data || !data.components) return null;

    const chartData = Object.entries(data.components).map(([key, value]) => ({
        pollutant: key,
        value,
    }));

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Air Pollution Levels</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="pollutant"
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))',
                                fontSize: '0.875rem',
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="hsl(var(--chart-3))"
                            radius={[4, 4, 0, 0]}
                            barSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

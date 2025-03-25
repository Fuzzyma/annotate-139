"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Observation } from "@/lib/types";

interface ObservationChartProps {
  observations: Observation[];
}

export function ObservationChart({ observations }: ObservationChartProps) {
  const [showTotal, setShowTotal] = useState(false);

  // Process data for the chart
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get unique species
  const uniqueSpecies = [...new Set(observations.map((obs) => obs.species))];

  // Initialize data structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monthlyData: Record<string, any>[] = monthNames.map((month) => ({
    name: month,
    total: 0,
    ...Object.fromEntries(uniqueSpecies.map((species) => [species, 0])),
  }));

  // Fill in the data
  observations.forEach((obs) => {
    const date = new Date(obs.date);
    const monthIndex = date.getMonth();
    monthlyData[monthIndex][obs.species] =
      (monthlyData[monthIndex][obs.species] || 0) + 1;
    monthlyData[monthIndex].total += 1;
  });

  // Non-blue color palette
  const colorPalette = [
    "#f44336", // red
    "#e91e63", // pink
    "#9c27b0", // purple
    "#673ab7", // deep purple
    "#4caf50", // green
    "#8bc34a", // light green
    "#cddc39", // lime
    "#ffeb3b", // yellow
    "#ffc107", // amber
    "#ff9800", // orange
    "#ff5722", // deep orange
    "#795548", // brown
    "#607d8b", // blue grey
  ];

  return (
    <Card className="grow flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Seasonal Overview</CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            id="chart-mode"
            checked={showTotal}
            onCheckedChange={setShowTotal}
          />
          <Label htmlFor="chart-mode">Show total</Label>
        </div>
      </CardHeader>
      <CardContent className="grow">
        <div className="w-full min-h-[400px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {showTotal ? (
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#9c27b0"
                  name="Total Sightings"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              ) : (
                uniqueSpecies.map((species, index) => (
                  <Line
                    key={species}
                    type="monotone"
                    dataKey={species}
                    stroke={colorPalette[index % colorPalette.length]}
                    name={species}
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

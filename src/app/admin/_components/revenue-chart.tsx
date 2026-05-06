/**
 * New added file
 */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type RevenueData = {
  date: string;
  revenue: number;
};

export function RevenueChart({ data }: { data: RevenueData[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-87.5 w-full rounded-lg border bg-white p-6 shadow-sm animate-pulse" />
    );
  }

  return (
    <div className="h-87.5 w-full rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-medium text-muted-foreground">
        Revenue (Last 7 Days)
      </h3>
      <div className="w-full min-h-62.5">
        <ResponsiveContainer width="100%" height={250} debounce={50}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              interval={0}
              minTickGap={0}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickMargin={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}\u00A0kr`}
              width={64}
              tick={{ dx: -6, textAnchor: 'end' }}
              aria-label="Revenue in SEK"
            />
            <Tooltip
              cursor={{ fill: '#f5f5f5' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
              formatter={(value) => {
                const numericValue =
                  typeof value === 'number'
                    ? value
                    : typeof value === 'string'
                      ? Number(value) || 0
                      : Array.isArray(value)
                        ? Number(value[0]) || 0
                        : 0;

                return [`${numericValue.toFixed(2)} kr`, 'Revenue'];
              }}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * This file was added today
 */
"use client";

import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
      <div className="h-[350px] w-full rounded-lg border bg-white p-6 shadow-sm animate-pulse" />
    );
  }

  return (
    <div className="h-[350px] w-full rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-medium text-muted-foreground">
        Revenue (Last 7 Days)
      </h3>
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="99%" height="100%" minHeight={0} minWidth={0}>
          <BarChart data={data} margin={{ top: 0, right: 10, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              dy={15}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              width={45}
              tick={{ dx: -5 }}
            />
            <Tooltip
              cursor={{ fill: "#f5f5f5" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
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
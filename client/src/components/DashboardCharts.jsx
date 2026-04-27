"use client";
import React, { useEffect, useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const CHART_H = 220;

const defaultData = [
  { name: "—", clicks: 0 },
];

export function ViewsChart({ data, valueKey = "clicks" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const rows = Array.isArray(data) && data.length > 0 ? data : defaultData;

  if (!mounted) {
    return <div className="w-full min-w-0" style={{ height: CHART_H }} aria-hidden />;
  }

  return (
    <div className="w-full min-w-0" style={{ height: CHART_H }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
            interval={0}
            height={48}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey={valueKey} fill="#c41e3a" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

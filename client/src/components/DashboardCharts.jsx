"use client";
import React, { useEffect, useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

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

export function StatusPieChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-full min-w-0" style={{ height: CHART_H }} aria-hidden />;
  }

  const COLORS = ['#10b981', '#f59e0b', '#64748b'];

  return (
    <div className="w-full min-w-0" style={{ height: CHART_H }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontSize: "12px" }} 
            itemStyle={{ color: '#333' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-full min-w-0" style={{ height: CHART_H }} aria-hidden />;
  }

  return (
    <div className="w-full min-w-0" style={{ height: CHART_H }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} height={48} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
          <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

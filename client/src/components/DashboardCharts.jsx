"use client";
import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', views: 400 },
  { name: 'Tue', views: 300 },
  { name: 'Wed', views: 800 },
  { name: 'Thu', views: 600 },
  { name: 'Fri', views: 900 },
  { name: 'Sat', views: 1100 },
  { name: 'Sun', views: 1500 },
];

const CHART_H = 300;

export function ViewsChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full min-w-0" style={{ height: CHART_H }} aria-hidden />;
  }

  return (
    <div className="w-full min-w-0" style={{ height: CHART_H }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorViews)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

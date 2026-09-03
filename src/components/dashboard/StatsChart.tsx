"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { LinkWithStats } from "@/types/database";

const DEVICE_COLORS: Record<string, string> = {
  mobile: "#6C71E8",
  tablet: "#5FCB93",
  desktop: "#B4B8F8",
  unknown: "#E1E3FD"
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Móvil",
  tablet: "Tablet",
  desktop: "Desktop",
  unknown: "Desconocido"
};

interface StatsChartProps {
  link: LinkWithStats;
}

export function StatsChart({ link }: StatsChartProps) {
  if (link.clicks_count === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        Todavía no hay clics registrados para este enlace.
      </p>
    );
  }

  const countryData = link.clicks_by_country.slice(0, 6).map((c) => ({
    name: c.country,
    clics: c.count
  }));

  const deviceData = link.clicks_by_device.map((d) => ({
    name: DEVICE_LABELS[d.device] ?? d.device,
    key: d.device,
    value: d.count
  }));

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          Por país
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={countryData}>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#94A3B8"
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "#F4F2EE" }}
              contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 8px 30px -10px rgba(30,30,60,0.15)" }}
            />
            <Bar dataKey="clics" fill="#6C71E8" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          Por dispositivo
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={deviceData}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={4}
            >
              {deviceData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={DEVICE_COLORS[entry.key] ?? "#B4B8F8"}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 8px 30px -10px rgba(30,30,60,0.15)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

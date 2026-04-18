"use client";

import { useState } from "react";
import DashboardSelect from "@/components/ui/DashboardSelect";

export default function TrafficRangeFilter() {
  const [v, setV] = useState("7");
  return (
    <DashboardSelect
      aria-label="Chart time range"
      value={v}
      onChange={setV}
      options={[
        { value: "7", label: "Last 7 Days" },
        { value: "30", label: "Last 30 Days" },
      ]}
    />
  );
}

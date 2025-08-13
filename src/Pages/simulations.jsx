// pages/Simulation.jsx
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Card, CardHeader, CardTitle, CardContent } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Simulation() {
  const [formData, setFormData] = useState({
    drivers: 1,
    startTime: "",
    maxHours: 8,
  });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  const runSimulation = async () => {
    try {
      setError("");
      const payload = {
        drivers: formData.drivers,
        startTime: formData.startTime,
        maxHours: formData.maxHours,
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/simulate",
        payload
      );
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.error || "Simulation failed");
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <Label>Drivers</Label>
          <Input
            type="number"
            min={1}
            value={formData.drivers}
            onChange={(e) =>
              setFormData({ ...formData, drivers: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Max Hours</Label>
          <Input
            type="number"
            min={1}
            max={24}
            value={formData.maxHours}
            onChange={(e) =>
              setFormData({ ...formData, maxHours: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex items-end">
          <Button onClick={runSimulation} className="w-full">
            Run Simulation
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {stats && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Profit
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {stats.totalProfit.toFixed(2)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {stats.efficiencyScore}%
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">On Time</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {stats.onTimeDeliveries}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Late</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {stats.lateDeliveries}
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Deliveries</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "On Time", value: stats.onTimeDeliveries },
                        { name: "Late", value: stats.lateDeliveries },
                      ]}
                      dataKey="value"
                      outerRadius={100}
                      label
                    >
                      {[0, 1].map((i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fuel Costs</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.fuelCosts).map(([k, v]) => ({
                        name: k,
                        value: v,
                      }))}
                      dataKey="value"
                      outerRadius={100}
                      label
                    >
                      {Object.keys(stats.fuelCosts).map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

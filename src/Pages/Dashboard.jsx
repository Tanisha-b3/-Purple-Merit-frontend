import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "../Components/ui/card";
import { Skeleton } from "../Components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "../Components/ui/alert";
import { RocketIcon, AlertCircleIcon } from "lucide-react";

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#8884D8', '#82CA9D'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // In a real app:
        const { data } = await axios.get('https://purple-merit-backend-plum.vercel.app/api/stats');
        
        // Mock data with delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = {
          totals: {
            orders: 13,
            drivers: 10,
            routes: 10,
            averageOrderValue: 1585.69,
            totalOrderValue: 20614
          },
          performance: {
            profit: 1733,
            efficiency: 85,
            onTime: 11,
            late: 2
          },
          costs: {
            fuel: {
              Low: 21.5,
              Medium: 12,
              High: 72
            },
            maintenance: 0,
            labor: 0
          },
          timestamp: "2025-08-13T05:42:49.017Z"
        };
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats", err);
        setError("Failed to load dashboard stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Extract nested data safely
  const totals = stats?.totals || {};
  const performance = stats?.performance || {};
  const fuelCosts = stats?.costs?.fuel || { Low: 0, Medium: 0, High: 0 };

  // Chart data
  const deliveryData = [
    { name: 'On Time', value: performance.onTime || 0 },
    { name: 'Late', value: performance.late || 0 }
  ];

  const fuelData = Object.entries(fuelCosts).map(([type, cost]) => ({
    name: type,
    value: cost
  }));

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top Totals */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"> */}
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.orders || 0}</div>
          </CardContent>
        </Card> */}
        
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.drivers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.routes || 0}</div>
          </CardContent>
        </Card>
         */}
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {totals.averageOrderValue?.toFixed(2) || 0}</div>
          </CardContent>
        </Card> */}
        
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {totals.totalOrderValue?.toFixed(2) || 0}</div>
          </CardContent>
        </Card> */}
      {/* </div> */}

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {performance.profit?.toFixed(2) || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.efficiency || 0}%</div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${performance.efficiency || 0}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Time Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.onTime || 0}</div>
            <div className="text-sm text-muted-foreground">
              {((performance.onTime / (performance.onTime + performance.late)) * 100 || 0).toFixed(1)}% success rate
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.late || 0}</div>
            <div className="text-sm text-muted-foreground">
              {((performance.late / (performance.onTime + performance.late)) * 100 || 0).toFixed(1)}% late rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>On-time vs Late Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deliveryData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} deliveries`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuel Cost Breakdown (Rs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {fuelData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`Rs ${value}`, 'Cost']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last updated */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <RocketIcon className="h-4 w-4" />
        Last updated: {new Date(stats?.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Dashboard;
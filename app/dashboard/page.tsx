// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/Card';
import { getDashboardStats } from '@/lib/api-client';
import { DashboardStats } from '@/types';

const COLORS = ['#E30613', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-airtel-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  // Prepare chart data
  const typeChartData = Object.entries(stats.assetsByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const deptChartData = Object.entries(stats.assetsByDepartment).map(
    ([dept, count]) => ({
      name: dept,
      value: count,
    })
  );

  const statusData = [
    { name: 'Assigned', value: stats.assignedAssets },
    { name: 'Available', value: stats.availableAssets },
    { name: 'Damaged', value: stats.damagedAssets },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Asset inventory overview and statistics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Assets
            </p>
            <p className="mt-2 text-3xl font-bold text-airtel-red">
              {stats.totalAssets}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Assigned
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {stats.assignedAssets}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Available
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats.availableAssets}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Damaged
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {stats.damagedAssets}
            </p>
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Employees
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {stats.totalEmployees}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Asset Utilization
            </p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {Math.round((stats.assignedAssets / stats.totalAssets) * 100)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Assets by Type */}
        <Card title="Assets by Device Type">
          {typeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </Card>

        {/* Assets by Department */}
        <Card title="Assets by Department">
          {deptChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#E30613" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </Card>
      </div>

      {/* Status Distribution */}
      <Card title="Asset Status Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#E30613" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

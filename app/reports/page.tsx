// app/reports/page.tsx
'use client';

import { useState } from 'react';
import { Download, BarChart3, FileText, Calendar, Building, Smartphone } from 'lucide-react';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';
import { getReport } from '@/lib/api-client';
import Papa from 'papaparse';

type ReportType = 'department' | 'device-type' | 'status' | 'condition' | 'date';

interface ReportConfig {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  columns: any[];
  csvMapper?: (item: any) => any;
}

const reportConfigs: Record<ReportType, ReportConfig> = {
  department: {
    type: 'department',
    title: 'Assets by Department',
    description: 'View asset distribution across departments',
    icon: Building,
    columns: [
      { key: 'department', label: 'Department' },
      {
        key: 'count',
        label: 'Assets Count',
        render: (value: number) => (
          <span className="font-bold text-airtel-red">{value}</span>
        ),
      },
    ],
    csvMapper: (item) => ({ department: item.department, count: item.count }),
  },
  'device-type': {
    type: 'device-type',
    title: 'Assets by Device Type',
    description: 'View asset distribution by device type',
    icon: Smartphone,
    columns: [
      { key: 'deviceType', label: 'Device Type' },
      {
        key: 'count',
        label: 'Count',
        render: (value: number) => (
          <span className="font-bold text-airtel-red">{value}</span>
        ),
      },
    ],
    csvMapper: (item) => ({ deviceType: item.deviceType, count: item.count }),
  },
  status: {
    type: 'status',
    title: 'Asset Status Distribution',
    description: 'View assets by their current status',
    icon: BarChart3,
    columns: [
      {
        key: 'status',
        label: 'Status',
        render: (value: string) => (
          <span
            className={`badge ${
              value === 'available'
                ? 'badge-success'
                : value === 'assigned'
                ? 'badge-info'
                : 'badge-error'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: 'count',
        label: 'Count',
        render: (value: number) => (
          <span className="font-bold text-airtel-red">{value}</span>
        ),
      },
    ],
    csvMapper: (item) => ({ status: item.status, count: item.count }),
  },
  condition: {
    type: 'condition',
    title: 'Asset Condition Distribution',
    description: 'View assets by their condition',
    icon: FileText,
    columns: [
      { key: 'condition', label: 'Condition' },
      {
        key: 'count',
        label: 'Count',
        render: (value: number) => (
          <span className="font-bold text-airtel-red">{value}</span>
        ),
      },
    ],
    csvMapper: (item) => ({ condition: item.condition, count: item.count }),
  },
  date: {
    type: 'date',
    title: 'Assignment History',
    description: 'View assignment history within date range',
    icon: Calendar,
    columns: [
      {
        key: 'date',
        label: 'Date',
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
      { key: 'assetId', label: 'Asset ID' },
      { key: 'employeeName', label: 'Employee' },
      { key: 'department', label: 'Department' },
      {
        key: 'action',
        label: 'Action',
        render: (value: string) => (
          <span
            className={`badge ${
              value === 'assigned' ? 'badge-info' : 'badge-success'
            }`}
          >
            {value}
          </span>
        ),
      },
    ],
    csvMapper: (item) => ({
      date: new Date(item.date).toLocaleDateString(),
      assetId: item.assetId,
      employeeName: item.employeeName,
      department: item.department,
      action: item.action,
    }),
  },
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('department');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const currentConfig = reportConfigs[reportType];

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: Record<string, any> = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const data = await getReport(reportType, filters);
      setReportData(data);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData?.data || !currentConfig.csvMapper) return;

    const csvData = reportData.data.map(currentConfig.csvMapper);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleReportTypeChange = (newType: ReportType) => {
    setReportType(newType);
    setReportData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate and analyze asset reports
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(reportConfigs).map((config) => {
          const Icon = config.icon;
          const isSelected = config.type === reportType;

          return (
            <Card
              key={config.type}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-airtel-red bg-airtel-red bg-opacity-5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleReportTypeChange(config.type)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-airtel-red text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {config.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {config.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Report Generator */}
      <Card title={`Generate ${currentConfig.title}`}>
        <div className="space-y-4">
          {/* Date Range (for date report) */}
          {reportType === 'date' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field mt-1"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleGenerateReport} loading={loading} className="gap-2">
              <BarChart3 size={18} /> Generate Report
            </Button>
            {reportData && (
              <Button variant="secondary" onClick={handleExportCSV} className="gap-2">
                <Download size={18} /> Export CSV
              </Button>
            )}
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Report Results */}
      {reportData && (
        <Card title={currentConfig.title}>
          <Table
            columns={currentConfig.columns}
            data={reportData.data || []}
            loading={false}
          />
        </Card>
      )}
    </div>
  );
}

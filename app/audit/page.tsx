// app/audit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { getAuditLogs } from '@/lib/api-client';
import { AuditLog } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState('');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Fetch audit logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAuditLogs({
        action: action || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit: 50,
      });

      setLogs(response.data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [action, startDate, endDate, page]);

  const getActionBadgeClass = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'badge-success';
      case 'update':
        return 'badge-info';
      case 'delete':
        return 'badge-error';
      case 'assign':
        return 'badge-info';
      case 'return':
        return 'badge-success';
      default:
        return 'badge-warning';
    }
  };

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value: string) => formatDateTime(value),
      className: 'text-sm',
    },
    {
      key: 'action',
      label: 'Action',
      render: (value: string) => (
        <span className={`badge ${getActionBadgeClass(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate text-sm">{value}</div>
      ),
    },
    {
      key: 'asset',
      label: 'Asset',
      render: (_, row: AuditLog) =>
        row.asset ? (
          <span className="font-mono font-semibold text-airtel-red">
            {row.asset.assetId}
          </span>
        ) : (
          '-'
        ),
    },
    {
      key: 'employee',
      label: 'Employee',
      render: (_, row: AuditLog) =>
        row.employee ? (
          <div>
            <div className="font-semibold">{row.employee.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {row.employee.employeeId}
            </div>
          </div>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Audit Log
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track all asset movements and system changes
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Action
            </label>
            <select
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
              className="select-field mt-1"
            >
              <option value="">All actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="assign">Assign</option>
              <option value="return">Return</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
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
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="Description..."
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <Table columns={columns} data={logs} loading={loading} />
      </Card>
    </div>
  );
}

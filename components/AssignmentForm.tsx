// components/AssignmentForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { Asset, Employee, Assignment } from '@/types';
import { Button } from './Button';

interface AssignmentFormProps {
  assignment?: Assignment;
  onSubmit: (data: Partial<Assignment>) => Promise<void>;
  loading?: boolean;
}

export function AssignmentForm({
  assignment,
  onSubmit,
  loading = false,
}: AssignmentFormProps) {
  const [formData, setFormData] = useState<{
    assetId: string;
    employeeId: string;
    notes: string;
    returnDate?: string;
  }>({
    assetId: assignment?.assetId || '',
    employeeId: assignment?.employeeId || '',
    notes: assignment?.notes || '',
    returnDate: assignment?.returnDate || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, employeesRes] = await Promise.all([
          fetch('/api/assets?status=available&limit=1000'),
          fetch('/api/employees?limit=1000'),
        ]);

        const assetsData = await assetsRes.json();
        const employeesData = await employeesRes.json();

        setAssets(assetsData.data || []);
        setEmployees(employeesData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetId) newErrors.assetId = 'Asset is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (loadingData) {
    return <div className="py-4 text-center">Loading...</div>;
  }

  // Show warning if no employees or assets
  const hasNoEmployees = employees.length === 0;
  const hasNoAssets = assets.length === 0;

  if (hasNoEmployees || hasNoAssets) {
    return (
      <div className="space-y-4">
        {hasNoEmployees && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              📋 No employees found
            </p>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Please create at least one employee before creating assignments.
            </p>
            <a
              href="/employees"
              className="mt-2 inline-block rounded bg-yellow-600 px-4 py-1 text-sm font-medium text-white hover:bg-yellow-700"
            >
              Go to Employees →
            </a>
          </div>
        )}

        {hasNoAssets && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900">
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              📦 No available assets found
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Please create assets or ensure they are in "available" status.
            </p>
            <a
              href="/assets"
              className="mt-2 inline-block rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Assets →
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Asset */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Asset *
        </label>
        <select
          name="assetId"
          value={formData.assetId}
          onChange={handleChange}
          disabled={!!assignment}
          className="select-field mt-1 disabled:opacity-50"
        >
          <option value="">Select asset ({assets.length} available)</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.assetId} - {asset.brand} {asset.model} ({asset.status})
            </option>
          ))}
        </select>
        {errors.assetId && (
          <p className="mt-1 text-sm text-red-600">{errors.assetId}</p>
        )}
      </div>

      {/* Employee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Employee *
        </label>
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          disabled={!!assignment}
          className="select-field mt-1 disabled:opacity-50"
        >
          <option value="">Select employee ({employees.length} available)</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.department})
            </option>
          ))}
        </select>
        {errors.employeeId && (
          <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="input-field mt-1"
          rows={3}
          placeholder="Optional notes about this assignment..."
        />
      </div>

      {/* Return Date (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Expected Return Date <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          className="input-field mt-1"
          min={new Date().toISOString().split('T')[0]}
        />
        <p className="mt-1 text-sm text-gray-500">
          When do you expect this asset to be returned? Leave empty if unknown.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} disabled={loading}>
          {assignment ? 'Update Assignment' : 'Assign Asset'}
        </Button>
      </div>
    </form>
  );
}

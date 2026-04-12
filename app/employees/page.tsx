// app/employees/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/lib/api-client';
import { Employee } from '@/types';

interface EmployeeFormData {
  name: string;
  employeeId: string;
  department: string;
  email?: string;
  phone?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    employeeId: '',
    department: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployees({
        search: search || undefined,
        department: department || undefined,
      });
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department]);

  const handleOpenModal = (emp?: Employee) => {
    if (emp) {
      setSelectedEmployee(emp);
      setFormData({
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department,
        email: emp.email || '',
        phone: emp.phone || '',
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        name: '',
        employeeId: '',
        department: '',
        email: '',
        phone: '',
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
    setFormData({
      name: '',
      employeeId: '',
      department: '',
      email: '',
      phone: '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);

      if (selectedEmployee?.id) {
        await updateEmployee(selectedEmployee.id, formData);
      } else {
        await createEmployee(formData);
      }

      handleCloseModal();
      await fetchEmployees();
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (emp: Employee) => {
    if (!window.confirm(`Delete employee ${emp.name}?`)) return;

    try {
      await deleteEmployee(emp.id);
      await fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to delete employee');
    }
  };

  const columns = [
    {
      key: 'employeeId',
      label: 'Employee ID',
      render: (value: string) => (
        <span className="font-mono font-semibold text-airtel-red">{value}</span>
      ),
    },
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'id',
      label: 'Actions',
      className: 'text-center',
      render: (_, row: Employee) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Edit"
          >
            <Edit2 size={18} className="text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Delete"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employees
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage employee records
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} /> New Employee
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search by Name or ID
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input-field mt-1"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Filter by department..."
              className="input-field mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Employees Table */}
      <Card>
        <Table columns={columns} data={employees} loading={loading} />
      </Card>

      {/* Employee Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedEmployee ? 'Edit Employee' : 'Create New Employee'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee ID *
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => {
                setFormData({ ...formData, employeeId: e.target.value });
                if (formErrors.employeeId) {
                  setFormErrors({ ...formErrors, employeeId: '' });
                }
              }}
              placeholder="EMP001"
              className="input-field mt-1"
            />
            {formErrors.employeeId && (
              <p className="mt-1 text-sm text-red-600">{formErrors.employeeId}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) {
                  setFormErrors({ ...formErrors, name: '' });
                }
              }}
              placeholder="John Doe"
              className="input-field mt-1"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Department *
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => {
                setFormData({ ...formData, department: e.target.value });
                if (formErrors.department) {
                  setFormErrors({ ...formErrors, department: '' });
                }
              }}
              placeholder="IT, HR, Finance, etc."
              className="input-field mt-1"
            />
            {formErrors.department && (
              <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="input-field mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1-555-0000"
              className="input-field mt-1"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : selectedEmployee ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

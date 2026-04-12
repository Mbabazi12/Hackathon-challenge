// app/assignments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Check, Edit2, Eye, Trash2 } from 'lucide-react';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { AssignmentForm } from '@/components/AssignmentForm';
import { getAssignments, createAssignment, returnAsset } from '@/lib/api-client';
import { Assignment } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('assigned');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAssignments({
        status: status || undefined,
      });
      setAssignments(response.data || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [status]);

  const handleCreateAssignment = async (formData: Partial<Assignment>) => {
    try {
      setSubmitting(true);
      await createAssignment(formData);
      setModalOpen(false);
      await fetchAssignments();
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnAsset = async (assignment: Assignment) => {
    if (!window.confirm('Return this asset?')) return;

    try {
      await returnAsset(assignment.id);
      await fetchAssignments();
    } catch (err) {
      console.error('Error returning asset:', err);
      setError('Failed to return asset');
    }
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedAssignment(null);
  };

  const columns = [
    {
      key: 'asset',
      label: 'Asset',
      render: (_, row: Assignment) => (
        <div>
          <div className="font-mono font-semibold text-airtel-red">
            {row.asset?.assetId}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.asset?.brand} {row.asset?.model}
          </div>
        </div>
      ),
    },
    {
      key: 'employee',
      label: 'Employee',
      render: (_, row: Assignment) => (
        <div>
          <div className="font-semibold">{row.employee?.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.employee?.department}
          </div>
        </div>
      ),
    },
    {
      key: 'assignmentDate',
      label: 'Assigned Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'returnDate',
      label: 'Return Date',
      render: (value: string) => (value ? formatDate(value) : '-'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`badge ${
            value === 'assigned' ? 'badge-info' : 'badge-success'
          }`}
        >
          {value === 'assigned' ? 'Assigned' : 'Returned'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      className: 'text-center',
      render: (_, row: Assignment) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleViewAssignment(row)}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="View assignment details"
          >
            <Eye size={18} className="text-blue-600" />
          </button>
          {row.status === 'assigned' && (
            <button
              onClick={() => handleReturnAsset(row)}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Return asset"
            >
              <Check size={18} className="text-green-600" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assignments
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage asset assignments and returns
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} /> New Assignment
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Filter */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select-field mt-1"
            >
              <option value="">All assignments</option>
              <option value="assigned">Currently Assigned</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assignments Table */}
      <Card>
        <Table columns={columns} data={assignments} loading={loading} />
      </Card>

      {/* Assignment Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Assignment"
        size="lg"
      >
        <AssignmentForm
          onSubmit={handleCreateAssignment}
          loading={submitting}
        />
      </Modal>

      {/* View Assignment Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title="Assignment Details"
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            {/* Assignment Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Asset Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Asset ID
                    </label>
                    <p className="font-mono font-semibold text-airtel-red">
                      {selectedAssignment.asset?.assetId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Device
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedAssignment.asset?.brand} {selectedAssignment.asset?.model}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedAssignment.asset?.deviceType}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Employee Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedAssignment.employee?.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Employee ID
                    </label>
                    <p className="font-mono text-gray-900 dark:text-white">
                      {selectedAssignment.employee?.employeeId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Department
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedAssignment.employee?.department}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Assignment Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <span
                    className={`badge mt-1 ${
                      selectedAssignment.status === 'assigned' ? 'badge-info' : 'badge-success'
                    }`}
                  >
                    {selectedAssignment.status === 'assigned' ? 'Assigned' : 'Returned'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assigned Date
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {formatDate(selectedAssignment.assignmentDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Return Date
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {selectedAssignment.returnDate ? formatDate(selectedAssignment.returnDate) : 'Not returned'}
                  </p>
                </div>
              </div>

              {selectedAssignment.notes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {selectedAssignment.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {selectedAssignment.status === 'assigned' && (
                <Button
                  onClick={() => {
                    handleReturnAsset(selectedAssignment);
                    handleCloseViewModal();
                  }}
                  className="gap-2"
                >
                  <Check size={18} /> Return Asset
                </Button>
              )}
              <Button variant="secondary" onClick={handleCloseViewModal}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// app/assets/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { AssetForm } from '@/components/AssetForm';
import { getAssets, createAsset, updateAsset, deleteAsset } from '@/lib/api-client';
import { Asset } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch assets
  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAssets({
        search: search || undefined,
        deviceType: deviceType || undefined,
        status: status || undefined,
      });
      setAssets(response.data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, deviceType, status]);

  const handleCreateOrUpdate = async (formData: Partial<Asset>) => {
    try {
      setSubmitting(true);

      if (selectedAsset?.id) {
        await updateAsset(selectedAsset.id, formData);
      } else {
        await createAsset(formData);
      }

      setModalOpen(false);
      setSelectedAsset(null);
      await fetchAssets();
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to save asset');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (!window.confirm(`Delete asset ${asset.assetId}?`)) return;

    try {
      await deleteAsset(asset.id);
      await fetchAssets();
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError('Failed to delete asset');
    }
  };

  const columns = [
    {
      key: 'assetId',
      label: 'Asset ID',
      render: (value: string) => (
        <span className="font-mono font-semibold text-airtel-red">{value}</span>
      ),
    },
    { key: 'deviceType', label: 'Device Type' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
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
      key: 'condition',
      label: 'Condition',
      render: (value: string) => (
        <span
          className={`badge ${
            value === 'new'
              ? 'badge-success'
              : value === 'good'
              ? 'badge-info'
              : 'badge-error'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'purchaseDate',
      label: 'Purchase Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'id',
      label: 'Actions',
      className: 'text-center',
      render: (_, row: Asset) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setSelectedAsset(row);
              setModalOpen(true);
            }}
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
            Assets
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all company assets
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} /> Add Asset
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                placeholder="Asset ID, Serial #, Model..."
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Device Type
            </label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="select-field mt-1"
            >
              <option value="">All types</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="mobile-phone">Mobile Phone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select-field mt-1"
            >
              <option value="">All statuses</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assets Table */}
      <Card>
        <Table columns={columns} data={assets} loading={loading} />
      </Card>

      {/* Asset Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAsset(null);
        }}
        title={selectedAsset ? 'Edit Asset' : 'Create Asset'}
        size="lg"
      >
        <AssetForm
          asset={selectedAsset || undefined}
          onSubmit={handleCreateOrUpdate}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}

// components/AssetForm.tsx
'use client';

import { useState } from 'react';
import { Asset } from '@/types';
import { Button } from './Button';

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: Partial<Asset>) => Promise<void>;
  loading?: boolean;
}

export function AssetForm({
  asset,
  onSubmit,
  loading = false,
}: AssetFormProps) {
  const [formData, setFormData] = useState<Partial<Asset>>(
    asset || {
      deviceType: '',
      brand: '',
      model: '',
      serialNumber: '',
      specifications: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      condition: 'good',
      location: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    if (!formData.deviceType) newErrors.deviceType = 'Device type is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.serialNumber)
      newErrors.serialNumber = 'Serial number is required';
    if (!formData.purchaseDate)
      newErrors.purchaseDate = 'Purchase date is required';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Device Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Device Type *
        </label>
        <select
          name="deviceType"
          value={formData.deviceType || ''}
          onChange={handleChange}
          className="input-field mt-1"
        >
          <option value="">Select device type</option>
          <option value="laptop">Laptop</option>
          <option value="desktop">Desktop</option>
          <option value="mobile-phone">Mobile Phone</option>
        </select>
        {errors.deviceType && (
          <p className="mt-1 text-sm text-red-600">{errors.deviceType}</p>
        )}
      </div>

      {/* Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Brand *
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand || ''}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="e.g., Dell, Apple, Samsung"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Model *
          </label>
          <input
            type="text"
            name="model"
            value={formData.model || ''}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="e.g., XPS 13, MacBook Pro"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model}</p>
          )}
        </div>
      </div>

      {/* Serial Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Serial Number *
        </label>
        <input
          type="text"
          name="serialNumber"
          value={formData.serialNumber || ''}
          onChange={handleChange}
          className="input-field mt-1"
          placeholder="Unique serial number"
        />
        {errors.serialNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
        )}
      </div>

      {/* Purchase Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Purchase Date *
          </label>
          <input
            type="date"
            name="purchaseDate"
            value={
              formData.purchaseDate
                ? new Date(formData.purchaseDate)
                    .toISOString()
                    .split('T')[0]
                : ''
            }
            onChange={handleChange}
            className="input-field mt-1"
          />
          {errors.purchaseDate && (
            <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Condition
          </label>
          <select
            name="condition"
            value={formData.condition || 'good'}
            onChange={handleChange}
            className="input-field mt-1"
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          className="input-field mt-1"
          placeholder="Physical location"
        />
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Specifications
        </label>
        <textarea
          name="specifications"
          value={formData.specifications || ''}
          onChange={handleChange}
          className="input-field mt-1"
          rows={3}
          placeholder="e.g., RAM: 16GB, SSD: 512GB, Processor: Intel i7"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {asset ? 'Update Asset' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
}

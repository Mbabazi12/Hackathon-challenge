// lib/api-client.ts
/**
 * API client for server-side API calls with offline support
 */
import {
  saveToStore,
  saveMultipleToStore,
  getAllFromStore,
  indexedDBStores,
} from './indexedDB';
import { Asset, Employee, Assignment, AuditLog, DashboardStats } from '@/types';

const API_BASE = '/api';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Generic fetch wrapper with offline support
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const isOnline = navigator.onLine;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...(options.body && { body: JSON.stringify(options.body) }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache successful responses
    if (options.method === 'GET' || !options.method) {
      cacheResponse(endpoint, data);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);

    if (!isOnline) {
      // Return cached data when offline
      const cached = await getCachedResponse(endpoint);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
}

/**
 * Cache API responses
 */
async function cacheResponse(endpoint: string, data: any) {
  try {
    const cacheKey = `cache_${endpoint}`;
    const cached = {
      key: cacheKey,
      endpoint,
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    console.warn('Cache error:', error);
  }
}

/**
 * Get cached response
 */
async function getCachedResponse(endpoint: string): Promise<any> {
  try {
    const cacheKey = `cache_${endpoint}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached).data;
    }
  } catch (error) {
    console.warn('Get cache error:', error);
  }
  return null;
}

// =================== Assets ===================

export async function getAssets(
  filters: Record<string, any> = {}
): Promise<any> {
  const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  const params = new URLSearchParams(cleanFilters);
  return apiRequest(`/assets?${params.toString()}`);
}

export async function getAssetById(id: string): Promise<Asset> {
  return apiRequest(`/assets/${id}`);
}

export async function createAsset(data: Partial<Asset>): Promise<Asset> {
  const result = await apiRequest('/assets', {
    method: 'POST',
    body: data,
  });

  // Save to IndexedDB
  await saveToStore(indexedDBStores.ASSETS, result);

  return result;
}

export async function updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
  const result = await apiRequest(`/assets/${id}`, {
    method: 'PUT',
    body: data,
  });

  // Update in IndexedDB
  await saveToStore(indexedDBStores.ASSETS, result);

  return result;
}

export async function deleteAsset(id: string): Promise<any> {
  return apiRequest(`/assets/${id}`, {
    method: 'DELETE',
  });
}

// =================== Employees ===================

export async function getEmployees(
  filters: Record<string, any> = {}
): Promise<any> {
  const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  const params = new URLSearchParams(cleanFilters);
  return apiRequest(`/employees?${params.toString()}`);
}

export async function getEmployeeById(id: string): Promise<Employee> {
  return apiRequest(`/employees/${id}`);
}

export async function createEmployee(data: Partial<Employee>): Promise<Employee> {
  const result = await apiRequest('/employees', {
    method: 'POST',
    body: data,
  });

  // Save to IndexedDB
  await saveToStore(indexedDBStores.EMPLOYEES, result);

  return result;
}

export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  const result = await apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: data,
  });

  // Update in IndexedDB
  await saveToStore(indexedDBStores.EMPLOYEES, result);

  return result;
}

export async function deleteEmployee(id: string): Promise<any> {
  return apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  });
}

// =================== Assignments ===================

export async function getAssignments(
  filters: Record<string, any> = {}
): Promise<any> {
  const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  const params = new URLSearchParams(cleanFilters);
  return apiRequest(`/assignments?${params.toString()}`);
}

export async function getAssignmentById(id: string): Promise<Assignment> {
  return apiRequest(`/assignments/${id}`);
}

export async function createAssignment(
  data: Partial<Assignment>
): Promise<Assignment> {
  const result = await apiRequest('/assignments', {
    method: 'POST',
    body: data,
  });

  // Save to IndexedDB
  await saveToStore(indexedDBStores.ASSIGNMENTS, result);

  return result;
}

export async function returnAsset(id: string): Promise<Assignment> {
  const result = await apiRequest(`/assignments/${id}`, {
    method: 'DELETE',
  });

  // Update in IndexedDB
  await saveToStore(indexedDBStores.ASSIGNMENTS, result);

  return result;
}

// =================== Dashboard & Reports ===================

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest('/dashboard');
}

export async function getReport(type: string, filters: Record<string, any> = {}) {
  const allFilters = { type, ...filters };
  const cleanFilters = Object.entries(allFilters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  const params = new URLSearchParams(cleanFilters);
  return apiRequest(`/reports?${params.toString()}`);
}

// =================== Audit Logs ===================

export async function getAuditLogs(
  filters: Record<string, any> = {}
): Promise<any> {
  const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  const params = new URLSearchParams(cleanFilters);
  return apiRequest(`/audit-logs?${params.toString()}`);
}

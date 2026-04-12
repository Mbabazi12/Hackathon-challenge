// lib/indexedDB.ts
/**
 * IndexedDB utilities for offline-first support
 */

const DB_NAME = 'AirtelInventoryDB';
const DB_VERSION = 1;

const STORES = {
  ASSETS: 'assets',
  EMPLOYEES: 'employees',
  ASSIGNMENTS: 'assignments',
  AUDIT_LOGS: 'auditLogs',
};

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenRequest).result;

      // Create object stores
      if (!database.objectStoreNames.contains(STORES.ASSETS)) {
        const assetStore = database.createObjectStore(STORES.ASSETS, {
          keyPath: 'id',
        });
        assetStore.createIndex('assetId', 'assetId', { unique: true });
        assetStore.createIndex('status', 'status');
        assetStore.createIndex('deviceType', 'deviceType');
      }

      if (!database.objectStoreNames.contains(STORES.EMPLOYEES)) {
        const employeeStore = database.createObjectStore(STORES.EMPLOYEES, {
          keyPath: 'id',
        });
        employeeStore.createIndex('employeeId', 'employeeId', { unique: true });
        employeeStore.createIndex('department', 'department');
      }

      if (!database.objectStoreNames.contains(STORES.ASSIGNMENTS)) {
        const assignmentStore = database.createObjectStore(STORES.ASSIGNMENTS, {
          keyPath: 'id',
        });
        assignmentStore.createIndex('assetId', 'assetId');
        assignmentStore.createIndex('employeeId', 'employeeId');
        assignmentStore.createIndex('status', 'status');
      }

      if (!database.objectStoreNames.contains(STORES.AUDIT_LOGS)) {
        const auditStore = database.createObjectStore(STORES.AUDIT_LOGS, {
          keyPath: 'id',
        });
        auditStore.createIndex('assetId', 'assetId');
        auditStore.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

/**
 * Get database instance
 */
async function getDB(): Promise<IDBDatabase> {
  if (!db) {
    db = await initDB();
  }
  return db;
}

/**
 * Save data to a store
 */
export async function saveToStore(
  storeName: string,
  data: any
): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Save multiple items to a store
 */
export async function saveMultipleToStore(
  storeName: string,
  dataArray: any[]
): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    dataArray.forEach((data) => {
      store.put(data);
    });

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

/**
 * Get an item from a store
 */
export async function getFromStore(
  storeName: string,
  key: string
): Promise<any> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Get all items from a store
 */
export async function getAllFromStore(storeName: string): Promise<any[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Delete from a store
 */
export async function deleteFromStore(
  storeName: string,
  key: string
): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Clear a store
 */
export async function clearStore(storeName: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export const indexedDBStores = STORES;

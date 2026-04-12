// store/assetStore.ts
import { create } from 'zustand';
import { Asset } from '@/types';

interface AssetStore {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],
  loading: false,
  error: null,

  setAssets: (assets) => set({ assets }),
  addAsset: (asset) =>
    set((state) => ({ assets: [asset, ...state.assets] })),
  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((a) => a.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

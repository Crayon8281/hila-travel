import { useState, useCallback, useMemo } from "react";
import { Asset, SAMPLE_ASSETS, generateId } from "@/services/mockData";

type NewAsset = Omit<Asset, "_id" | "_creationTime">;

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const filteredAssets = useMemo(() => {
    let result = assets;

    if (filterType) {
      result = result.filter((a) => a.type === filterType);
    }
    if (filterCountry) {
      result = result.filter((a) => a.country === filterCountry);
    }
    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.city.toLowerCase().includes(search) ||
          a.description_he.toLowerCase().includes(search) ||
          a.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    return result;
  }, [assets, filterType, filterCountry, searchText]);

  const filterOptions = useMemo(() => {
    const countries = [...new Set(assets.map((a) => a.country))].sort();
    const types = [...new Set(assets.map((a) => a.type))].sort();
    return { countries, types };
  }, [assets]);

  const addAsset = useCallback((data: NewAsset) => {
    const newAsset: Asset = {
      ...data,
      _id: generateId(),
      _creationTime: Date.now(),
    };
    setAssets((prev) => [newAsset, ...prev]);
    return newAsset._id;
  }, []);

  const updateAsset = useCallback(
    (id: string, data: Partial<NewAsset>) => {
      setAssets((prev) =>
        prev.map((a) => (a._id === id ? { ...a, ...data } : a))
      );
    },
    []
  );

  const removeAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a._id !== id));
  }, []);

  const getAsset = useCallback(
    (id: string) => {
      return assets.find((a) => a._id === id) ?? null;
    },
    [assets]
  );

  return {
    assets: filteredAssets,
    allAssets: assets,
    filterType,
    setFilterType,
    filterCountry,
    setFilterCountry,
    searchText,
    setSearchText,
    filterOptions,
    addAsset,
    updateAsset,
    removeAsset,
    getAsset,
  };
}

import { Asset } from "./mockData";

/**
 * Haversine formula to calculate distance between two lat/lng coordinates.
 * Returns distance in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const DISTANCE_WARNING_THRESHOLD_KM = 50;

export interface DistanceWarning {
  fromAssetId: string;
  toAssetId: string;
  fromTitle: string;
  toTitle: string;
  distanceKm: number;
  fromIndex: number;
  toIndex: number;
}

/**
 * Checks consecutive activities for distance > threshold.
 * Returns array of warnings for pairs that exceed 50km.
 */
export function checkDayDistances(
  activities: { assetId: string; sort_order: number }[],
  getAsset: (id: string) => Asset | null
): DistanceWarning[] {
  const warnings: DistanceWarning[] = [];
  const sorted = [...activities].sort((a, b) => a.sort_order - b.sort_order);

  for (let i = 0; i < sorted.length - 1; i++) {
    const assetA = getAsset(sorted[i].assetId);
    const assetB = getAsset(sorted[i + 1].assetId);

    if (
      !assetA?.lat ||
      !assetA?.lng ||
      !assetB?.lat ||
      !assetB?.lng
    ) {
      continue;
    }

    const distance = haversineDistance(
      assetA.lat,
      assetA.lng,
      assetB.lat,
      assetB.lng
    );

    if (distance > DISTANCE_WARNING_THRESHOLD_KM) {
      warnings.push({
        fromAssetId: sorted[i].assetId,
        toAssetId: sorted[i + 1].assetId,
        fromTitle: assetA.title,
        toTitle: assetB.title,
        distanceKm: Math.round(distance),
        fromIndex: i,
        toIndex: i + 1,
      });
    }
  }

  return warnings;
}

/**
 * Format distance for display.
 */
export function formatDistance(km: number): string {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)} אלף ק"מ`;
  }
  return `${km} ק"מ`;
}

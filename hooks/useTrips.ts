import { useState, useCallback, useMemo } from "react";
import {
  Trip,
  TripDay,
  TripActivity,
  DayTemplate,
  generateTripId,
  generateDayId,
  generateActivityId,
  generateTemplateId,
  generateDaysForTrip,
  generateTripToken,
  getTripShareUrl,
  SAMPLE_TRIPS,
} from "@/services/tripData";

type NewTrip = Omit<Trip, "_id" | "_creationTime" | "status">;

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>(SAMPLE_TRIPS);
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [tripActivities, setTripActivities] = useState<TripActivity[]>([]);
  const [dayTemplates, setDayTemplates] = useState<DayTemplate[]>([]);
  const [polishedDescriptions, setPolishedDescriptions] = useState<
    Map<string, string>
  >(new Map());

  // === Trip CRUD ===

  const addTrip = useCallback(
    (data: NewTrip) => {
      const tripId = generateTripId();
      const newTrip: Trip = {
        ...data,
        _id: tripId,
        _creationTime: Date.now(),
        status: "draft",
      };
      setTrips((prev) => [newTrip, ...prev]);

      // Auto-generate days
      const days = generateDaysForTrip(tripId, data.start_date, data.end_date);
      setTripDays((prev) => [...prev, ...days]);

      return tripId;
    },
    []
  );

  const getTrip = useCallback(
    (id: string) => trips.find((t) => t._id === id) ?? null,
    [trips]
  );

  const updateTrip = useCallback(
    (id: string, data: Partial<Omit<Trip, "_id" | "_creationTime">>) => {
      setTrips((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...data } : t))
      );
    },
    []
  );

  const removeTrip = useCallback((id: string) => {
    setTrips((prev) => prev.filter((t) => t._id !== id));
    setTripDays((prev) => {
      const dayIds = prev.filter((d) => d.tripId === id).map((d) => d._id);
      setTripActivities((acts) =>
        acts.filter((a) => !dayIds.includes(a.dayId))
      );
      return prev.filter((d) => d.tripId !== id);
    });
  }, []);

  // === Trip Days ===

  const getDaysForTrip = useCallback(
    (tripId: string) =>
      tripDays
        .filter((d) => d.tripId === tripId)
        .sort((a, b) => a.day_number - b.day_number),
    [tripDays]
  );

  const getDay = useCallback(
    (dayId: string) => tripDays.find((d) => d._id === dayId) ?? null,
    [tripDays]
  );

  // === Trip Activities ===

  const getActivitiesForDay = useCallback(
    (dayId: string) =>
      tripActivities
        .filter((a) => a.dayId === dayId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [tripActivities]
  );

  const addActivity = useCallback(
    (dayId: string, assetId: string, startTime: string, customNote: string) => {
      const existing = tripActivities.filter((a) => a.dayId === dayId);
      const maxOrder = existing.length > 0
        ? Math.max(...existing.map((a) => a.sort_order))
        : 0;

      const newActivity: TripActivity = {
        _id: generateActivityId(),
        dayId,
        assetId,
        start_time: startTime,
        custom_note: customNote,
        sort_order: maxOrder + 1,
      };
      setTripActivities((prev) => [...prev, newActivity]);
      return newActivity._id;
    },
    [tripActivities]
  );

  const removeActivity = useCallback((activityId: string) => {
    setTripActivities((prev) => prev.filter((a) => a._id !== activityId));
  }, []);

  const updateActivityOrder = useCallback(
    (dayId: string, orderedIds: string[]) => {
      setTripActivities((prev) =>
        prev.map((a) => {
          if (a.dayId !== dayId) return a;
          const newOrder = orderedIds.indexOf(a._id);
          if (newOrder === -1) return a;
          return { ...a, sort_order: newOrder + 1 };
        })
      );
    },
    []
  );

  const moveActivity = useCallback(
    (dayId: string, activityId: string, direction: "up" | "down") => {
      const dayActivities = tripActivities
        .filter((a) => a.dayId === dayId)
        .sort((a, b) => a.sort_order - b.sort_order);

      const idx = dayActivities.findIndex((a) => a._id === activityId);
      if (idx === -1) return;
      if (direction === "up" && idx === 0) return;
      if (direction === "down" && idx === dayActivities.length - 1) return;

      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      const newOrder = [...dayActivities];
      [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];

      const orderedIds = newOrder.map((a) => a._id);
      updateActivityOrder(dayId, orderedIds);
    },
    [tripActivities, updateActivityOrder]
  );

  const getActivityCountForDay = useCallback(
    (dayId: string) => tripActivities.filter((a) => a.dayId === dayId).length,
    [tripActivities]
  );

  const getTripTotalCost = useCallback(
    (tripId: string) => {
      const dayIds = tripDays
        .filter((d) => d.tripId === tripId)
        .map((d) => d._id);
      return tripActivities.filter((a) => dayIds.includes(a.dayId));
    },
    [tripDays, tripActivities]
  );

  // === Day Templates ===

  const saveDayAsTemplate = useCallback(
    (dayId: string, name: string, description: string) => {
      const activities = tripActivities
        .filter((a) => a.dayId === dayId)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((a) => ({
          assetId: a.assetId,
          start_time: a.start_time,
          custom_note: a.custom_note,
          sort_order: a.sort_order,
        }));

      if (activities.length === 0) return null;

      const template: DayTemplate = {
        _id: generateTemplateId(),
        name,
        description,
        activities,
        createdAt: Date.now(),
      };

      setDayTemplates((prev) => [template, ...prev]);
      return template._id;
    },
    [tripActivities]
  );

  const loadTemplateToDay = useCallback(
    (templateId: string, dayId: string) => {
      const template = dayTemplates.find((t) => t._id === templateId);
      if (!template) return;

      // Remove existing activities for this day
      setTripActivities((prev) => {
        const withoutDay = prev.filter((a) => a.dayId !== dayId);
        const newActivities = template.activities.map((ta, idx) => ({
          _id: generateActivityId(),
          dayId,
          assetId: ta.assetId,
          start_time: ta.start_time,
          custom_note: ta.custom_note,
          sort_order: idx + 1,
        }));
        return [...withoutDay, ...newActivities];
      });
    },
    [dayTemplates]
  );

  const removeTemplate = useCallback((templateId: string) => {
    setDayTemplates((prev) => prev.filter((t) => t._id !== templateId));
  }, []);

  // === Share Tokens (Deep Linking) ===

  const generateShareToken = useCallback(
    (tripId: string): string => {
      const trip = trips.find((t) => t._id === tripId);
      if (trip?.share_token) {
        return trip.share_token; // Already has a token
      }
      const token = generateTripToken();
      setTrips((prev) =>
        prev.map((t) =>
          t._id === tripId ? { ...t, share_token: token } : t
        )
      );
      return token;
    },
    [trips]
  );

  const getTripByToken = useCallback(
    (token: string): Trip | null => {
      return trips.find((t) => t.share_token === token) ?? null;
    },
    [trips]
  );

  const getShareUrl = useCallback(
    (tripId: string): string | null => {
      const trip = trips.find((t) => t._id === tripId);
      if (!trip?.share_token) return null;
      return getTripShareUrl(trip.share_token);
    },
    [trips]
  );

  const revokeShareToken = useCallback((tripId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t._id === tripId ? { ...t, share_token: undefined } : t
      )
    );
  }, []);

  // === Polished Descriptions ===

  const setPolishedDescription = useCallback(
    (assetId: string, polished: string) => {
      setPolishedDescriptions((prev) => {
        const next = new Map(prev);
        next.set(assetId, polished);
        return next;
      });
    },
    []
  );

  const getPolishedDescription = useCallback(
    (assetId: string) => polishedDescriptions.get(assetId) ?? null,
    [polishedDescriptions]
  );

  const clearPolishedDescription = useCallback(
    (assetId: string) => {
      setPolishedDescriptions((prev) => {
        const next = new Map(prev);
        next.delete(assetId);
        return next;
      });
    },
    []
  );

  return {
    trips,
    addTrip,
    getTrip,
    updateTrip,
    removeTrip,
    getDaysForTrip,
    getDay,
    getActivitiesForDay,
    addActivity,
    removeActivity,
    moveActivity,
    updateActivityOrder,
    getActivityCountForDay,
    getTripTotalCost,
    // Share Tokens (Deep Linking)
    generateShareToken,
    getTripByToken,
    getShareUrl,
    revokeShareToken,
    // Templates
    dayTemplates,
    saveDayAsTemplate,
    loadTemplateToDay,
    removeTemplate,
    // Polished descriptions
    setPolishedDescription,
    getPolishedDescription,
    clearPolishedDescription,
  };
}

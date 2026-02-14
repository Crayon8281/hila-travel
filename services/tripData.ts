import { Asset } from "./mockData";

export interface Trip {
  _id: string;
  _creationTime: number;
  client_name: string;
  start_date: string;
  end_date: string;
  status: "draft" | "proposal" | "confirmed";
  cover_image: string;
}

export interface TripDay {
  _id: string;
  tripId: string;
  day_number: number;
  date: string;
}

export interface TripActivity {
  _id: string;
  dayId: string;
  assetId: string;
  start_time: string;
  custom_note: string;
  sort_order: number;
}

export type TripActivityWithAsset = TripActivity & {
  asset: Asset | null;
};

export const TRIP_STATUSES = [
  { value: "draft" as const, label: "טיוטה" },
  { value: "proposal" as const, label: "הצעה" },
  { value: "confirmed" as const, label: "מאושר" },
];

export function getStatusLabel(status: Trip["status"]): string {
  return TRIP_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getStatusColor(status: Trip["status"]): string {
  switch (status) {
    case "draft":
      return "#8099B3";
    case "proposal":
      return "#D4AF37";
    case "confirmed":
      return "#22C55E";
  }
}

let nextTripId = 100;
let nextDayId = 1000;
let nextActivityId = 5000;

export function generateTripId(): string {
  return String(nextTripId++);
}

export function generateDayId(): string {
  return String(nextDayId++);
}

export function generateActivityId(): string {
  return String(nextActivityId++);
}

export function generateDaysForTrip(
  tripId: string,
  startDate: string,
  endDate: string
): TripDay[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: TripDay[] = [];
  let dayNumber = 1;

  const current = new Date(start);
  while (current <= end) {
    days.push({
      _id: generateDayId(),
      tripId,
      day_number: dayNumber,
      date: current.toISOString().split("T")[0],
    });
    dayNumber++;
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function formatHebrewDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDate();
  const months = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
  ];
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  return `יום ${dayOfWeek}, ${day} ${month}`;
}

export const SAMPLE_TRIPS: Trip[] = [];

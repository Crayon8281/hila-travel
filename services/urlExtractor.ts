export interface ExtractedData {
  title: string;
  type: string;
  country: string;
  city: string;
  description_he: string;
  tags: string[];
  lat: number | null;
  lng: number | null;
}

export type ExtractionStatus = "pending" | "extracting" | "done" | "error";

export interface ExtractionItem {
  id: string;
  url: string;
  status: ExtractionStatus;
  data: ExtractedData | null;
  error: string | null;
}

// Detect URL source type
function detectSource(url: string): "google_maps" | "booking" | "unknown" {
  if (
    url.includes("google.com/maps") ||
    url.includes("goo.gl/maps") ||
    url.includes("maps.app.goo.gl")
  ) {
    return "google_maps";
  }
  if (url.includes("booking.com")) {
    return "booking";
  }
  return "unknown";
}

// Extract coordinates from Google Maps URL
function extractCoordsFromGoogleMaps(
  url: string
): { lat: number; lng: number } | null {
  // Pattern: @lat,lng,zoom
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }
  // Pattern: !3dlat!4dlng
  const bangMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (bangMatch) {
    return { lat: parseFloat(bangMatch[1]), lng: parseFloat(bangMatch[2]) };
  }
  return null;
}

// Extract place name from Google Maps URL
function extractNameFromGoogleMaps(url: string): string | null {
  // /place/Name+Here/
  const placeMatch = url.match(/\/place\/([^/@]+)/);
  if (placeMatch) {
    return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
  }
  // /search/query
  const searchMatch = url.match(/\/search\/([^/@]+)/);
  if (searchMatch) {
    return decodeURIComponent(searchMatch[1]).replace(/\+/g, " ");
  }
  return null;
}

// Extract hotel info from Booking.com URL
function extractFromBookingUrl(url: string): {
  name: string | null;
  city: string | null;
} {
  // Pattern: /hotel/country-code/hotel-name.html
  const hotelMatch = url.match(/\/hotel\/[a-z]{2}\/([^.?]+)/);
  const name = hotelMatch
    ? hotelMatch[1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  // Try to get city from URL params or path
  const cityMatch = url.match(/[?&](?:dest_id|city)=([^&]+)/);
  const city = cityMatch ? decodeURIComponent(cityMatch[1]) : null;
  return { name, city };
}

// Country code to Hebrew name mapping
const COUNTRY_MAP: Record<string, string> = {
  it: "איטליה",
  fr: "צרפת",
  es: "ספרד",
  gr: "יוון",
  jp: "יפן",
  th: "תאילנד",
  mv: "מלדיביים",
  ch: "שוויץ",
  gb: "בריטניה",
  us: "ארצות הברית",
  de: "גרמניה",
  pt: "פורטוגל",
  nl: "הולנד",
  at: "אוסטריה",
  tr: "טורקיה",
  hr: "קרואטיה",
  cz: "צ'כיה",
  il: "ישראל",
  ae: "איחוד האמירויות",
  mx: "מקסיקו",
};

function getCountryFromBookingUrl(url: string): string | null {
  const match = url.match(/\/hotel\/([a-z]{2})\//);
  if (match && COUNTRY_MAP[match[1]]) {
    return COUNTRY_MAP[match[1]];
  }
  return null;
}

// Mock AI extraction: simulates Claude API response with smart URL parsing
// This runs locally for offline development. When Convex is connected,
// use the real `extractFromUrl` action instead.
async function mockExtract(url: string): Promise<ExtractedData> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

  const source = detectSource(url);

  if (source === "google_maps") {
    const coords = extractCoordsFromGoogleMaps(url);
    const name = extractNameFromGoogleMaps(url);

    return {
      title: name || "מקום מ-Google Maps",
      type: "אטרקציה",
      country: "",
      city: "",
      description_he: name
        ? `${name} - מקום שנמצא דרך Google Maps. יש לבדוק פרטים נוספים ולעדכן את התיאור.`
        : "מקום שנמצא דרך Google Maps. יש להשלים פרטים.",
      tags: ["Google Maps", "לעדכן"],
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    };
  }

  if (source === "booking") {
    const { name, city } = extractFromBookingUrl(url);
    const country = getCountryFromBookingUrl(url);

    return {
      title: name || "מלון מ-Booking.com",
      type: "מלון",
      country: country || "",
      city: city || "",
      description_he: name
        ? `${name} - מלון שנמצא דרך Booking.com.${country ? ` ממוקם ב${country}.` : ""} יש לבדוק דירוג ולעדכן תיאור מפורט.`
        : "מלון מ-Booking.com. יש להשלים פרטים.",
      tags: ["Booking.com", "מלון", "לעדכן"],
      lat: null,
      lng: null,
    };
  }

  // Unknown URL - try to extract domain hints
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    // invalid URL
  }

  return {
    title: `קישור מ-${domain || "אתר חיצוני"}`,
    type: "אטרקציה",
    country: "",
    city: "",
    description_he: `נכס שיובא מ-${domain || url}. יש להשלים את כל הפרטים ידנית.`,
    tags: ["יובא", "לעדכן"],
    lat: null,
    lng: null,
  };
}

// Parse a text block into individual URLs
export function parseUrls(text: string): string[] {
  return text
    .split(/[\n\r]+/)
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      try {
        new URL(line);
        return true;
      } catch {
        // Try prefixing with https://
        try {
          new URL("https://" + line);
          return line.includes(".");
        } catch {
          return false;
        }
      }
    })
    .map((line) => {
      try {
        new URL(line);
        return line;
      } catch {
        return "https://" + line;
      }
    });
}

let extractionCounter = 0;

// Extract data from a single URL (uses mock locally, real API when Convex connected)
export async function extractUrl(url: string): Promise<ExtractedData> {
  // TODO: When Convex is deployed, replace with:
  // const result = await convexClient.action(api.extractUrl.extractFromUrl, { url });
  return mockExtract(url);
}

// Create an extraction item for tracking
export function createExtractionItem(url: string): ExtractionItem {
  return {
    id: `extract_${++extractionCounter}`,
    url,
    status: "pending",
    data: null,
    error: null,
  };
}

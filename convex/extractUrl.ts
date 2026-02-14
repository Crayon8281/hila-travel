import { v } from "convex/values";
import { action } from "./_generated/server";

// Convex Action: calls Claude API to extract structured data from a URL.
// Actions can make external HTTP calls (unlike queries/mutations).
export const extractFromUrl = action({
  args: {
    url: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY not configured. Set it in your Convex dashboard under Settings > Environment Variables."
      );
    }

    const prompt = `You are a travel data extraction assistant. Given this URL, extract structured information about the place/business.

URL: ${args.url}

Based on the URL structure and any information you can infer from it (domain, path segments, query parameters, place IDs, etc.), extract the following:

1. **title**: The name of the place/business (in its original language)
2. **type**: One of: "מלון", "מסעדה", "אטרקציה", "טיסה", "העברה", "חוויה"
3. **country**: Country name in Hebrew
4. **city**: City name in Hebrew
5. **description_he**: A short description in Hebrew (2-3 sentences) about what this place is
6. **tags**: 3-5 relevant tags in Hebrew
7. **lat**: Latitude (if extractable from URL, otherwise null)
8. **lng**: Longitude (if extractable from URL, otherwise null)

For Google Maps URLs, extract coordinates from the URL pattern (@lat,lng or !3dlat!4dlng).
For Booking.com URLs, identify the hotel name and city from the URL path.

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "title": "...",
  "type": "...",
  "country": "...",
  "city": "...",
  "description_he": "...",
  "tags": ["...", "..."],
  "lat": number | null,
  "lng": number | null
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data.content[0].text;

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Failed to parse AI response as JSON: ${text}`);
    }
  },
});

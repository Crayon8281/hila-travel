/**
 * AI Copywriter Service
 *
 * Polishes Hebrew descriptions to be more romantic/exciting for luxury travel.
 * Currently uses a mock implementation with curated polishing patterns.
 * Ready to swap with a real Claude API call via Convex action.
 */

// Luxury adjective/phrase banks for mock polishing
const ROMANTIC_OPENERS = [
  "חוויה שלא תשכחו לעולם — ",
  "רגע של קסם טהור — ",
  "היכונו להתאהב מחדש — ",
  "פינוק בלתי נשכח — ",
  "חלום שהפך למציאות — ",
];

const LUXURY_ENHANCERS = [
  "באווירה מרהיבה של יוקרה אמיתית",
  "עם תשומת לב מושלמת לכל פרט",
  "בסטנדרט שמגדיר מחדש את המילה 'מושלם'",
  "בחוויה שתישאר חרוטה בזיכרון לנצח",
  "ברמה שרק מעטים זוכים לחוות",
];

const CLOSING_TOUCHES = [
  " זהו אחד מהרגעים שהופכים טיול ליצירת מופת.",
  " בדיוק מה שמגיע לכם.",
  " כי אתם ראויים רק למיטב.",
  " חוויה שמגדירה את משמעות היוקרה.",
  " ההזדמנות לגלות את הצד הכי מפנק של העולם.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Mock AI polishing: takes a Hebrew description and returns a more
 * romantic/exciting version. Simulates async API call with delay.
 */
export async function polishDescription(
  originalText: string,
  assetType: string,
  assetTitle: string
): Promise<string> {
  // Simulate network delay (500-1200ms)
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 700));

  const opener = pickRandom(ROMANTIC_OPENERS);
  const enhancer = pickRandom(LUXURY_ENHANCERS);
  const closing = pickRandom(CLOSING_TOUCHES);

  // Build a polished version by wrapping the original with luxury language
  const polished = `${opener}${originalText} ${enhancer}.${closing}`;

  return polished;
}

/**
 * Batch polish all activities in a day.
 * Returns a map of assetId -> polished description.
 */
export async function polishDayDescriptions(
  activities: { assetId: string }[],
  getAssetInfo: (id: string) => {
    description_he: string;
    type: string;
    title: string;
  } | null
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  const promises = activities.map(async (act) => {
    const info = getAssetInfo(act.assetId);
    if (!info) return;

    const polished = await polishDescription(
      info.description_he,
      info.type,
      info.title
    );
    results.set(act.assetId, polished);
  });

  await Promise.all(promises);
  return results;
}

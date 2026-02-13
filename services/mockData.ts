export interface Asset {
  _id: string;
  _creationTime: number;
  type: string;
  country: string;
  city: string;
  title: string;
  description_he: string;
  images: string[];
  expert_notes: string;
  tags: string[];
  cost_price: number;
  selling_price: number;
}

export const ASSET_TYPES = [
  "מלון",
  "מסעדה",
  "אטרקציה",
  "טיסה",
  "העברה",
  "חוויה",
] as const;

export const COUNTRIES = [
  "איטליה",
  "צרפת",
  "יוון",
  "ספרד",
  "יפן",
  "תאילנד",
  "מלדיביים",
  "שוויץ",
] as const;

export const SAMPLE_ASSETS: Asset[] = [
  {
    _id: "1",
    _creationTime: Date.now(),
    type: "מלון",
    country: "איטליה",
    city: "רומא",
    title: "Hotel de Russie",
    description_he:
      "מלון יוקרה 5 כוכבים במרכז רומא, ממוקם בין כיכר ספרד לפיאצה דל פופולו. גני מרפסות מרהיבים, ספא מפנק ומסעדה איטלקית מעולה.",
    images: [],
    expert_notes:
      "לבקש חדר עם נוף לגנים. ארוחת בוקר בגן המרפסת היא חובה. מומלץ להזמין 3 חודשים מראש בעונה.",
    tags: ["יוקרה", "מרכז העיר", "ספא", "רומנטי"],
    cost_price: 850,
    selling_price: 1200,
  },
  {
    _id: "2",
    _creationTime: Date.now(),
    type: "מסעדה",
    country: "איטליה",
    city: "פירנצה",
    title: "Enoteca Pinchiorri",
    description_he:
      "מסעדת 3 כוכבי מישלן בלב פירנצה. חוויה קולינרית ברמה הגבוהה ביותר עם מרתף יינות מהיוקרתיים באירופה.",
    images: [],
    expert_notes:
      "הזמנה חובה לפחות חודש מראש. תפריט הטעימות המלא שווה כל שקל. לציין אלרגיות מראש.",
    tags: ["מישלן", "יין", "חוויה קולינרית"],
    cost_price: 350,
    selling_price: 500,
  },
  {
    _id: "3",
    _creationTime: Date.now(),
    type: "חוויה",
    country: "צרפת",
    city: "פריז",
    title: "סיור פרטי בלובר",
    description_he:
      "סיור פרטי עם מדריך מומחה לאמנות במוזיאון הלובר. 3 שעות של גישה VIP כולל כניסה מהירה בלי תורים.",
    images: [],
    expert_notes:
      "המדריך ז'אן-פייר מעולה בעברית. יום שלישי וערבי שישי הם הזמנים הכי שקטים.",
    tags: ["תרבות", "אמנות", "VIP", "פרטי"],
    cost_price: 280,
    selling_price: 420,
  },
  {
    _id: "4",
    _creationTime: Date.now(),
    type: "מלון",
    country: "מלדיביים",
    city: "מאלה אטול",
    title: "Soneva Fushi",
    description_he:
      "ריזורט יוקרתי על אי פרטי במלדיביים. וילות על המים עם בריכה פרטית, חוף לבן ושונית אלמוגים מרהיבה.",
    images: [],
    expert_notes:
      "וילת מים מספר 36 היא הכי מבוקשת. חובה לשלב צלילה בשונית. העונה הטובה: נובמבר-אפריל.",
    tags: ["אי פרטי", "יוקרה", "שונית", "ירח דבש"],
    cost_price: 2200,
    selling_price: 3100,
  },
  {
    _id: "5",
    _creationTime: Date.now(),
    type: "אטרקציה",
    country: "יפן",
    city: "קיוטו",
    title: "טקס תה מסורתי",
    description_he:
      "טקס תה יפני אותנטי בבית תה עתיק בקיוטו. כולל לבישת קימונו מסורתי וסיור בגן יפני.",
    images: [],
    expert_notes:
      "לשריין את אורית כמתרגמת. טקס בוקר (10:00) אינטימי יותר מאשר אחה\"צ.",
    tags: ["תרבות", "מסורת", "אותנטי", "יפן"],
    cost_price: 150,
    selling_price: 250,
  },
  {
    _id: "6",
    _creationTime: Date.now(),
    type: "העברה",
    country: "שוויץ",
    city: "ציריך",
    title: "Glacier Express First Class",
    description_he:
      "נסיעה ברכבת הקרחון המפורסמת במחלקה ראשונה. מציריך לצרמט דרך נופים הכי מרהיבים של האלפים השוויצריים.",
    images: [],
    expert_notes:
      "צד ימין של הרכבת (כיוון נסיעה) = נופים טובים יותר. ארוחת צהריים ברכבת משובחת.",
    tags: ["נופים", "רכבת", "אלפים", "יוקרה"],
    cost_price: 420,
    selling_price: 600,
  },
];

let nextId = 7;

export function generateId(): string {
  return String(nextId++);
}

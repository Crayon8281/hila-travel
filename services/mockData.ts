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
  phone?: string;
  address?: string;
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
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    ],
    expert_notes:
      "לבקש חדר עם נוף לגנים. ארוחת בוקר בגן המרפסת היא חובה. מומלץ להזמין 3 חודשים מראש בעונה.",
    tags: ["יוקרה", "מרכז העיר", "ספא", "רומנטי"],
    cost_price: 850,
    selling_price: 1200,
    phone: "+39-06-328881",
    address: "Via del Babuino, 9, 00187 Roma RM, Italy",
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
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&q=80",
    ],
    expert_notes:
      "הזמנה חובה לפחות חודש מראש. תפריט הטעימות המלא שווה כל שקל. לציין אלרגיות מראש.",
    tags: ["מישלן", "יין", "חוויה קולינרית"],
    cost_price: 350,
    selling_price: 500,
    phone: "+39-055-242757",
    address: "Via Ghibellina, 87, 50122 Firenze FI, Italy",
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
    images: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    ],
    expert_notes:
      "המדריך ז'אן-פייר מעולה בעברית. יום שלישי וערבי שישי הם הזמנים הכי שקטים.",
    tags: ["תרבות", "אמנות", "VIP", "פרטי"],
    cost_price: 280,
    selling_price: 420,
    address: "Rue de Rivoli, 75001 Paris, France",
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
    images: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
    ],
    expert_notes:
      "וילת מים מספר 36 היא הכי מבוקשת. חובה לשלב צלילה בשונית. העונה הטובה: נובמבר-אפריל.",
    tags: ["אי פרטי", "יוקרה", "שונית", "ירח דבש"],
    cost_price: 2200,
    selling_price: 3100,
    phone: "+960-660-0304",
    address: "Kunfunadhoo Island, Baa Atoll, Maldives",
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
    images: [
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&q=80",
    ],
    expert_notes:
      "לשריין את אורית כמתרגמת. טקס בוקר (10:00) אינטימי יותר מאשר אחה\"צ.",
    tags: ["תרבות", "מסורת", "אותנטי", "יפן"],
    cost_price: 150,
    selling_price: 250,
    address: "Gionmachi Minamigawa, Higashiyama Ward, Kyoto, Japan",
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
    images: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    expert_notes:
      "צד ימין של הרכבת (כיוון נסיעה) = נופים טובים יותר. ארוחת צהריים ברכבת משובחת.",
    tags: ["נופים", "רכבת", "אלפים", "יוקרה"],
    cost_price: 420,
    selling_price: 600,
    phone: "+41-81-288-6565",
    address: "Bahnhofplatz 9, 8001 Zürich, Switzerland",
  },
];

let nextId = 7;

export function generateId(): string {
  return String(nextId++);
}

// ── הכנה למבחן — מילות המבחן של קורל ─────────────────────────────────────
// מבוסס על המילים מעמוד 17 ועמוד 20

export const examWords = [
  { en: "collect",     he: "לאסוף" },
  { en: "collection",  he: "אוסף" },
  { en: "communicate", he: "לתקשר" },
  { en: "communication", he: "תקשורת" },
  { en: "direct",      he: "לכוון, להנחות" },
  { en: "directions",  he: "הוראות הגעה" },
  { en: "locate",      he: "לאתר" },
  { en: "location",    he: "מיקום" },
  { en: "adventure",   he: "הרפתקה" },
  { en: "business",    he: "עסק" },
  { en: "century",     he: "מאה" },
  { en: "handbag",     he: "תיק יד" },
  { en: "admire",      he: "להעריץ" },
  { en: "cause",       he: "לגרום" },
  { en: "click",       he: "ללחוץ" },
  { en: "download",    he: "להוריד (מהאינטרנט)" },
  { en: "gather",      he: "לאסוף" },
  { en: "treat",       he: "להתייחס" },
  { en: "annual",      he: "שנתי" },
  { en: "dressed",     he: "לבוש" },
  { en: "entire",      he: "כולו" },
  { en: "kind",        he: "סוג, אדיב" },
  { en: "loud",        he: "קולני, רם" },
  { en: "major",       he: "ראשי, חשוב" },
  { en: "valuable",    he: "יקר ערך" },
  { en: "each other",  he: "זה את זה" },
  { en: "finally",     he: "סוף סוף" },
  { en: "get together", he: "להיפגש, להתאסף" },
  { en: "look around", he: "להסתכל מסביב" },
  { en: "make sure",   he: "לוודא" },
  { en: "possibly",    he: "אולי" },
  { en: "quite",       he: "די, למדי" },
  { en: "right now",   he: "עכשיו" },
  { en: "take care of", he: "לטפל ב..." },
];

// ── השלמת משפטים עם מילות המבחן ─────────────────────────────────────────────
export const examCompletionData = [
  {
    sentence: "She likes to _______ stamps from different countries.",
    correct: "collect",
    options: ["collect", "locate", "download", "treat"],
    he: "היא אוהבת לאסוף בולים ממדינות שונות."
  },
  {
    sentence: "We need to _______ with each other more often.",
    correct: "communicate",
    options: ["communicate", "admire", "gather", "direct"],
    he: "אנחנו צריכים לתקשר אחד עם השני יותר לעתים קרובות."
  },
  {
    sentence: "Can you give me _______ to the nearest bus station?",
    correct: "directions",
    options: ["directions", "location", "collection", "business"],
    he: "תוכל לתת לי הוראות הגעה לתחנת האוטובוס הקרובה?"
  },
  {
    sentence: "The treasure map will help us _______ the hidden chest.",
    correct: "locate",
    options: ["locate", "click", "cause", "treat"],
    he: "מפת האוצר תעזור לנו לאתר את הארגז הנסתר."
  },
  {
    sentence: "Going hiking alone in the forest was quite an _______.",
    correct: "adventure",
    options: ["adventure", "business", "century", "location"],
    he: "טיול רגלי לבד ביער היה ממש הרפתקה."
  },
  {
    sentence: "Please _______ the app before you open it.",
    correct: "download",
    options: ["download", "gather", "admire", "click"],
    he: "בבקשה הורד את האפליקציה לפני שתפתח אותה."
  },
  {
    sentence: "Everyone will _______ at the park at noon.",
    correct: "get together",
    options: ["get together", "look around", "make sure", "take care of"],
    he: "כולם יתאספו בפארק בצהריים."
  },
  {
    sentence: "It's _______ raining outside, so bring an umbrella.",
    correct: "quite",
    options: ["quite", "finally", "possibly", "major"],
    he: "בחוץ יורד גשם ממש, אז קחי מטרייה."
  },
  {
    sentence: "The museum has a _______ collection of ancient coins.",
    correct: "valuable",
    options: ["valuable", "loud", "annual", "entire"],
    he: "למוזיאון יש אוסף יקר ערך של מטבעות עתיקים."
  },
  {
    sentence: "The _______ sale happens every year in July.",
    correct: "annual",
    options: ["annual", "major", "entire", "kind"],
    he: "המכירה השנתית מתרחשת כל שנה ביולי."
  },
  {
    sentence: "She dropped her _______ on the bus and lost everything.",
    correct: "handbag",
    options: ["handbag", "collection", "communication", "adventure"],
    he: "היא הפילה את תיק היד שלה באוטובוס ואיבדה הכל."
  },
  {
    sentence: "Don't talk _______ in the library.",
    correct: "loud",
    options: ["loud", "kind", "major", "entire"],
    he: "אל תדברי בקול רם בספרייה."
  },
  {
    sentence: "We ate the _______ pizza — there's nothing left!",
    correct: "entire",
    options: ["entire", "annual", "dressed", "major"],
    he: "אכלנו את כל הפיצה — לא נשאר כלום!"
  },
  {
    sentence: "She was nicely _______ for the party.",
    correct: "dressed",
    options: ["dressed", "located", "collected", "directed"],
    he: "היא הייתה לבושה יפה למסיבה."
  },
  {
    sentence: "Please _______ that you turned off the lights.",
    correct: "make sure",
    options: ["make sure", "look around", "take care of", "get together"],
    he: "בבקשה ודאי שכיבית את האורות."
  },
  {
    sentence: "I will _______ my little brother while mom is away.",
    correct: "take care of",
    options: ["take care of", "look around", "get together", "make sure"],
    he: "אני אטפל באחי הקטן בזמן שאמא נסעה."
  },
  {
    sentence: "They help _______ by sharing information online.",
    correct: "communicate",
    options: ["communicate", "locate", "gather", "download"],
    he: "הם עוזרים לתקשר על ידי שיתוף מידע באינטרנט."
  },
  {
    sentence: "This painting is from the 18th _______.",
    correct: "century",
    options: ["century", "business", "collection", "adventure"],
    he: "הציור הזה הוא מהמאה ה-18."
  },
  {
    sentence: "We _______ the old photos in an album.",
    correct: "collect",
    options: ["collect", "treat", "admire", "cause"],
    he: "אנחנו אוספים את התמונות הישנות באלבום."
  },
  {
    sentence: "He ran _______ to catch the bus.",
    correct: "right now",
    options: ["right now", "finally", "possibly", "each other"],
    he: "הוא רץ עכשיו לתפוס את האוטובוס."
  },
];

// ── זוגות מילים מהמבחן (לשימוש במשחק ה-match הייעודי) ───────────────────
// examWords כבר מכיל את כל הזוגות האנגלית↔עברית

// ── תרגול ניהול שיחה (דיאלוגים אינטראקטיביים) ──────────────────────
// כל שיחה היא רצף תורות: 'other' = מה שאומרים לקורל, 'you' = קורל בוחרת תגובה מתאימה
export const conversationsData = [
  {
    title: "Making a New Friend 👋",
    turns: [
      { speaker: "other", en: "Hi! I don't think we've met. What's your name?", he: "היי! נדמה לי שלא הכרנו. מה שמך?" },
      { speaker: "you", he: "להציג את עצמך בנימוס", options: [
          { en: "Hi, I'm Koral. Nice to meet you!", correct: true },
          { en: "Why do you want to know?", correct: false },
          { en: "I don't talk to strangers.", correct: false }
        ] },
      { speaker: "other", en: "Nice to meet you too! Where are you from?", he: "גם לי נעים! מאיפה את?" },
      { speaker: "you", he: "לענות מאיפה את", options: [
          { en: "I'm from Israel.", correct: true },
          { en: "That's none of your business.", correct: false },
          { en: "I don't know.", correct: false }
        ] },
      { speaker: "other", en: "Cool! Do you have any hobbies?", he: "מגניב! יש לך תחביבים?" },
      { speaker: "you", he: "לספר על תחביב שאת אוהבת", options: [
          { en: "Yes, I love dancing and figure skating.", correct: true },
          { en: "Hobbies are a waste of time.", correct: false },
          { en: "No, go away.", correct: false }
        ] }
    ]
  },
  {
    title: "Talking About Sports ⚽",
    turns: [
      { speaker: "other", en: "Do you play any sports?", he: "את משחקת באיזשהו ספורט?" },
      { speaker: "you", he: "לספר על ספורט שאת עושה", options: [
          { en: "Yes, I train with my team twice a week.", correct: true },
          { en: "Sports are boring.", correct: false },
          { en: "I don't understand the question.", correct: false }
        ] },
      { speaker: "other", en: "That's great! Who is your toughest opponent?", he: "מעולה! מי היריבה הכי קשה שלך?" },
      { speaker: "you", he: "לענות על שאלה אישית בנימוס", options: [
          { en: "A girl from the other team — she's a real champion.", correct: true },
          { en: "I don't have opponents, I always win.", correct: false },
          { en: "I refuse to answer that.", correct: false }
        ] },
      { speaker: "other", en: "Did your team win the last competition?", he: "הקבוצה שלך ניצחה בתחרות האחרונה?" },
      { speaker: "you", he: "לדווח על תוצאה (ניצחון או הפסד) בנימוס", options: [
          { en: "Yes! It was an amazing victory.", correct: true },
          { en: "Winning doesn't matter at all.", correct: false },
          { en: "I don't remember playing.", correct: false }
        ] }
    ]
  },
  {
    title: "At the Ice Rink ⛸️",
    turns: [
      { speaker: "other", en: "Have you ever been ice skating before?", he: "החלקת פעם על קרח?" },
      { speaker: "you", he: "לענות אם יש לך ניסיון או לא", options: [
          { en: "Yes, a few times. I love it!", correct: true },
          { en: "Ice skating doesn't exist.", correct: false },
          { en: "I don't want to talk about it.", correct: false }
        ] },
      { speaker: "other", en: "Be careful, the ice is very slippery today.", he: "תיזהרי, הקרח מאוד חלקלק היום." },
      { speaker: "you", he: "להגיב בנימוס לאזהרה ולהודות", options: [
          { en: "Thanks for the warning, I'll hold the edge carefully.", correct: true },
          { en: "I don't care about warnings.", correct: false },
          { en: "That's not my problem.", correct: false }
        ] },
      { speaker: "other", en: "Oh no, are you okay? You just fell!", he: "אוי לא, את בסדר? את עתה נפלת!" },
      { speaker: "you", he: "להרגיע שאת בסדר אחרי נפילה", options: [
          { en: "I'm okay, thanks! I just lost my balance for a second.", correct: true },
          { en: "Falling never happens to me.", correct: false },
          { en: "Leave me alone.", correct: false }
        ] }
    ]
  },
  {
    title: "At the Tourist Information Desk 🧭",
    turns: [
      { speaker: "other", en: "Welcome! How can I help you today?", he: "ברוכה הבאה! איך אפשר לעזור לך היום?" },
      { speaker: "you", he: "לבקש עזרה במציאת אתר תיירות", options: [
          { en: "Hi, I'm looking for a famous landmark to visit.", correct: true },
          { en: "I don't need anything, bye.", correct: false },
          { en: "Why are you asking me that?", correct: false }
        ] },
      { speaker: "other", en: "Great choice! Do you also need a place to stay?", he: "בחירה מצוינת! את צריכה גם מקום ללינה?" },
      { speaker: "you", he: "לבקש עזרה בהזמנת לינה", options: [
          { en: "Yes, could you recommend a good accommodation nearby?", correct: true },
          { en: "No one asked you that.", correct: false },
          { en: "I already have a house here.", correct: false }
        ] },
      { speaker: "other", en: "Here's a map. Enjoy your trip!", he: "הנה מפה. שיהיה לך טיול נעים!" },
      { speaker: "you", he: "להודות בנימוס לפני פרידה", options: [
          { en: "Thank you so much for your help!", correct: true },
          { en: "Finally, you stopped talking.", correct: false },
          { en: "I don't need a map.", correct: false }
        ] }
    ]
  },
  {
    title: "Ordering at a Restaurant 🍽️",
    turns: [
      { speaker: "other", en: "Hi there! Are you ready to order?", he: "שלום! מוכנה להזמין?" },
      { speaker: "you", he: "להזמין משהו לאכול בנימוס", options: [
          { en: "Yes, I'd like a pizza and a salad, please.", correct: true },
          { en: "Bring me food now.", correct: false },
          { en: "I don't know what food is.", correct: false }
        ] },
      { speaker: "other", en: "Anything to drink?", he: "משהו לשתות?" },
      { speaker: "you", he: "לבקש שתייה בנימוס", options: [
          { en: "Just water, thank you.", correct: true },
          { en: "Drinks are not important.", correct: false },
          { en: "I already told you everything.", correct: false }
        ] },
      { speaker: "other", en: "Here you go! Enjoy your meal.", he: "בבקשה! שתהנו מהארוחה." },
      { speaker: "you", he: "להגיב בנימוס כשמביאים לך אוכל", options: [
          { en: "Thank you, it looks delicious!", correct: true },
          { en: "Took you long enough.", correct: false },
          { en: "I didn't order this.", correct: false }
        ] }
    ]
  }
];

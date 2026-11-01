// ── בניית משפטים לדיבור — קורל ────────────────────────────────────────────
// כל משפט: en (התשובה), he (רמז בעברית), cat (קטגוריה), extra (מילים מבלבלות)
// המשחק מפרק את en למילים, מוסיף את extra ומערבב.

export const sentenceCategories = [
  { id: 'all',     label: 'הכל',       icon: '🌈' },
  { id: 'me',      label: 'על עצמי',   icon: '🙋‍♀️' },
  { id: 'someone', label: 'על מישהו',  icon: '👫' },
  { id: 'past',    label: 'עבר',       icon: '⏪' },
  { id: 'present', label: 'הווה',      icon: '▶️' },
  { id: 'future',  label: 'עתיד',      icon: '⏩' },
  { id: 'show',    label: 'להציג',     icon: '👀' },
];

export const sentenceBuilderData = [
  // ── על עצמי ──
  { cat: 'me', en: "My name is Koral.", he: "קוראים לי קורל.", extra: ["are", "his"] },
  { cat: 'me', en: "I like to collect stickers.", he: "אני אוהבת לאסוף מדבקות.", extra: ["likes", "collection"] },
  { cat: 'me', en: "I am kind to my friends.", he: "אני אדיבה לחברים שלי.", extra: ["is", "loud"] },
  { cat: 'me', en: "I take care of my little brother.", he: "אני מטפלת באחי הקטן.", extra: ["takes", "big"] },
  { cat: 'me', en: "I really admire my mother.", he: "אני ממש מעריצה את אמא שלי.", extra: ["admires", "father"] },
  { cat: 'me', en: "I love going on an adventure.", he: "אני אוהבת לצאת להרפתקה.", extra: ["loves", "business"] },

  // ── על מישהו ──
  { cat: 'someone', en: "She has a valuable collection of coins.", he: "יש לה אוסף יקר ערך של מטבעות.", extra: ["have", "he"] },
  { cat: 'someone', en: "My father has a small business.", he: "לאבא שלי יש עסק קטן.", extra: ["have", "handbag"] },
  { cat: 'someone', en: "He is quite loud in class.", he: "הוא די קולני בכיתה.", extra: ["are", "kind"] },
  { cat: 'someone', en: "My friends help each other.", he: "החברים שלי עוזרים זה לזה.", extra: ["helps", "other's"] },
  { cat: 'someone', en: "Her handbag is red and big.", he: "תיק היד שלה אדום וגדול.", extra: ["His", "are"] },

  // ── עבר ──
  { cat: 'past', en: "Yesterday I downloaded a new game.", he: "אתמול הורדתי משחק חדש.", extra: ["download", "tomorrow"] },
  { cat: 'past', en: "We finally found the location.", he: "סוף סוף מצאנו את המיקום.", extra: ["find", "will"] },
  { cat: 'past', en: "She was dressed for the party.", he: "היא הייתה לבושה למסיבה.", extra: ["were", "is"] },
  { cat: 'past', en: "Last year we went on an adventure.", he: "בשנה שעברה יצאנו להרפתקה.", extra: ["go", "next"] },
  { cat: 'past', en: "The rain caused a major problem.", he: "הגשם גרם לבעיה גדולה.", extra: ["cause", "will"] },

  // ── הווה ──
  { cat: 'present', en: "I am looking around the room right now.", he: "אני מסתכלת מסביב בחדר עכשיו.", extra: ["was", "yesterday"] },
  { cat: 'present', en: "She clicks on the button.", he: "היא לוחצת על הכפתור.", extra: ["click", "clicked"] },
  { cat: 'present', en: "We gather in the park every Friday.", he: "אנחנו מתאספים בפארק כל יום שישי.", extra: ["gathers", "yesterday"] },
  { cat: 'present', en: "They communicate in English.", he: "הם מתקשרים באנגלית.", extra: ["communicates", "communication"] },
  { cat: 'present', en: "My teacher treats everyone kindly.", he: "המורה שלי מתייחסת לכולם באדיבות.", extra: ["treat", "loud"] },

  // ── עתיד ──
  { cat: 'future', en: "Tomorrow I will get together with my friends.", he: "מחר אני אפגש עם החברים שלי.", extra: ["yesterday", "got"] },
  { cat: 'future', en: "We will go to the annual party.", he: "אנחנו נלך למסיבה השנתית.", extra: ["went", "century"] },
  { cat: 'future', en: "I will make sure the door is closed.", he: "אני אוודא שהדלת סגורה.", extra: ["made", "was"] },
  { cat: 'future', en: "Possibly it will rain next week.", he: "אולי ירד גשם בשבוע הבא.", extra: ["last", "rained"] },
  { cat: 'future', en: "Next year I will collect more stamps.", he: "בשנה הבאה אאסוף עוד בולים.", extra: ["collected", "last"] },

  // ── להציג ──
  { cat: 'show', en: "This is my favorite handbag.", he: "זה תיק היד האהוב עליי.", extra: ["These", "are"] },
  { cat: 'show', en: "Look at my stamp collection.", he: "תסתכלו על אוסף הבולים שלי.", extra: ["collect", "your"] },
  { cat: 'show', en: "These coins are from the last century.", he: "המטבעות האלה מהמאה הקודמת.", extra: ["This", "is"] },
  { cat: 'show', en: "Here are the directions to my house.", he: "הנה הוראות ההגעה לבית שלי.", extra: ["is", "direct"] },
  { cat: 'show', en: "This app is easy to download.", he: "את האפליקציה הזו קל להוריד.", extra: ["are", "click"] },
];

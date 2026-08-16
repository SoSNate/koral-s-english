// ── בנאי מילים (קידומות/סיומות/מילים מורכבות) ──────────────────────────
export const builderData = [
  { type: "prefix", prefix: "Un", root: "Fair", rootMeaning: "הוגן", word: "Unfair", options: ["לא הוגן", "הוגן מאוד", "משפטי"], correct: 0, explanation: "הקידומת Un הופכת את המילה לשלילה. Un+Fair = לא הוגן." },
  { type: "prefix", prefix: "Un", root: "Expected", rootMeaning: "צפוי", word: "Unexpected", options: ["ידוע מראש", "בלתי צפוי", "מתוכנן"], correct: 1, explanation: "Un+Expected = לא צפוי = בלתי צפוי, מפתיע." },
  { type: "prefix", prefix: "Im", root: "Possible", rootMeaning: "אפשרי", word: "Impossible", options: ["בלתי אפשרי", "אפשרי מאוד", "פשוט"], correct: 0, explanation: "לפני P המילה Un הופכת ל-Im. Im+Possible = לא אפשרי." },
  { type: "prefix", prefix: "In", root: "Dependent", rootMeaning: "תלוי", word: "Independent", options: ["תלוי מאוד", "עצמאי", "חלש"], correct: 1, explanation: "In+Dependent = לא תלוי = עצמאי." },
  { type: "prefix", prefix: "Ir", root: "Responsible", rootMeaning: "אחראי", word: "Irresponsible", options: ["אחראי מאוד", "זהיר", "לא אחראי"], correct: 2, explanation: "לפני R המילה Un הופכת ל-Ir. Ir+Responsible = לא אחראי." },
  { type: "prefix", prefix: "Dis", root: "Appointed", rootMeaning: "ממונה", word: "Disappointed", options: ["מאוכזב", "שמח מאוד", "ממונה לתפקיד"], correct: 0, explanation: "הקידומת Dis יוצרת הפך/שלילה. Disappointed = מאוכזב." },
  { type: "suffix", root: "Success", rootMeaning: "הצלחה", suffix: "ful", word: "Successful", options: ["כושל", "מוצלח", "מנסה"], correct: 1, explanation: "הסיומת ful פירושה 'מלא ב'. Success+ful = מלא הצלחה = מוצלח." },
  { type: "suffix", root: "Care", rootMeaning: "זהירות", suffix: "less", word: "Careless", options: ["זהיר מאוד", "חסר זהירות / פזיז", "אכפתי"], correct: 1, explanation: "הסיומת less פירושה 'חסר'. Care+less = חסר זהירות." },
  { type: "suffix", root: "Talent", rootMeaning: "כישרון", suffix: "ed", word: "Talented", options: ["מוכשר", "חסר כישרון", "עייף"], correct: 0, explanation: "Talent+ed = בעל כישרון = מוכשר." },
  { type: "suffix", root: "Reason", rootMeaning: "היגיון", suffix: "able", word: "Reasonable", options: ["לא הגיוני", "סביר / הגיוני", "יקר מאוד"], correct: 1, explanation: "הסיומת able פירושה 'ניתן ל...'. Reason+able = הגיוני, סביר." },
  { type: "compound", part1: "Peer", part1Meaning: "בן גיל", part2: "Pressure", part2Meaning: "לחץ", word: "Peer pressure", options: ["חבר קרוב", "לחץ חברתי מבני הגיל", "תחרות ספורט"], correct: 1, explanation: "לחץ (Pressure) שמפעילים בני הגיל (Peer) = לחץ חברתי." },
  { type: "prefix", prefix: "Ex", root: "Clude", rootMeaning: "לסגור", word: "Exclude", options: ["להוציא / לא לכלול", "לכלול בפנים", "לנעול דלת"], correct: 0, explanation: "Ex (החוצה) + Clude (לסגור) = להוציא מהקבוצה." },
];

// ── אנלוגיות ────────────────────────────────────────────────────────
export const analogiesData = [
  { word1: "Honest", word2: "Trustworthy", relation: "מילים קרובות במשמעות", word3: "Selfish", options: ["Generous", "Self-centered", "Polite", "Curious"], correct: "Self-centered" },
  { word1: "Brave", word2: "Coward", relation: "הפכים (Opposites)", word3: "Generous", options: ["Selfish", "Honest", "Reliable", "Proud"], correct: "Selfish" },
  { word1: "Achieve", word2: "Success", relation: "פעולה ותוצאה", word3: "Struggle", options: ["Difficulty", "Reward", "Patience", "Talent"], correct: "Difficulty" },
  { word1: "Bully", word2: "Victim", relation: "יחסי כוח", word3: "Support", options: ["Someone in need", "Someone strong", "Someone rude", "Someone jealous"], correct: "Someone in need" },
  { word1: "Trust", word2: "Betray", relation: "הפכים (Opposites)", word3: "Include", options: ["Exclude", "Encourage", "Respect", "Admit"], correct: "Exclude" },
  { word1: "Nervous", word2: "Relieved", relation: "מעבר במצב רגשי", word3: "Confused", options: ["Understanding", "Embarrassed", "Jealous", "Bored"], correct: "Understanding" },
  { word1: "Although", word2: "Contrast (ניגוד)", word3: "Because of", options: ["Reason (סיבה)", "Result (תוצאה)", "Addition (הוספה)", "Time (זמן)"], correct: "Reason (סיבה)" },
  { word1: "Cautious", word2: "Reckless", relation: "הפכים (Opposites)", word3: "Strict", options: ["Flexible", "Aware", "Grateful", "Anxious"], correct: "Flexible" },
  { word1: "Complain", word2: "Praise", relation: "הפכים (Opposites)", word3: "Deny", options: ["Admit", "Refuse", "Warn", "Argue"], correct: "Admit" },
  { word1: "Effort", word2: "Achieve", relation: "אמצעי ומטרה", word3: "Patience", options: ["Overcome a struggle", "Give up quickly", "Complain a lot", "Refuse help"], correct: "Overcome a struggle" },
  { word1: "Rumor", word2: "Gossip", relation: "מילים קרובות במשמעות", word3: "Peer", options: ["Someone your age", "A false story", "A strict teacher", "A serious mistake"], correct: "Someone your age" },
  { word1: "Since", word2: "Reason (סיבה)", word3: "Therefore", options: ["Result (תוצאה)", "Contrast (ניגוד)", "Example (דוגמה)", "Time (זמן)"], correct: "Result (תוצאה)" },
  { word1: "Apologize", word2: "Forgive", relation: "פעולה ותגובה", word3: "Ask", options: ["Answer", "Deny", "Avoid", "Judge"], correct: "Answer" },
  { word1: "Determined", word2: "Give up", relation: "הפכים בהתנהגות", word3: "Confident", options: ["Doubt yourself", "Trust yourself", "Complain", "Argue"], correct: "Doubt yourself" },
];

// ── השלמת משפטים ────────────────────────────────────────────────────
export const completionData = [
  { sentence: "Even though she made a mistake, she was brave enough to _______ it instead of denying it.", options: ["Admit", "Avoid", "Judge", "Refuse"], correct: "Admit" },
  { sentence: "He didn't study for the test, so he felt very _______ when he saw the low grade.", options: ["Disappointed", "Proud", "Relieved", "Confident"], correct: "Disappointed" },
  { sentence: "My little brother always _______ my clothes without asking, and it makes me angry.", options: ["Borrows", "Lends", "Deserves", "Suggests"], correct: "Borrows" },
  { sentence: "We will be late for the movie _______ we leave the house right now.", options: ["Unless", "Although", "Therefore", "Besides"], correct: "Unless" },
  { sentence: "She was nervous before the presentation; _______, she spoke clearly and did a great job.", options: ["However", "Therefore", "Since", "Because"], correct: "However" },
  { sentence: "To _______ your English, you need to practice a little bit every single day.", options: ["Improve", "Avoid", "Complain", "Argue"], correct: "Improve" },
  { sentence: "It's not nice to spread a _______ about someone before you know if it's even true.", options: ["Rumor", "Reward", "Habit", "Schedule"], correct: "Rumor" },
  { sentence: "He made a serious mistake, but everyone _______ him because he apologized right away.", options: ["Forgave", "Betrayed", "Excluded", "Warned"], correct: "Forgave" },
  { sentence: "Although the exam was extremely difficult, she felt _______ that she had studied so hard for it.", options: ["Grateful", "Jealous", "Rude", "Selfish"], correct: "Grateful" },
  { sentence: "Some students give in to _______ and do things they don't really want to do.", options: ["Peer pressure", "Allowance", "Patience", "Assignment"], correct: "Peer pressure" },
  { sentence: "He was too _______ to admit that he needed help with his homework.", options: ["Proud", "Honest", "Generous", "Aware"], correct: "Proud" },
  { sentence: "The teacher was very _______ about the deadline, so nobody could hand in the assignment late.", options: ["Strict", "Flexible", "Curious", "Grateful"], correct: "Strict" },
  { sentence: "Instead of arguing about it, they decided to _______ a solution together.", options: ["Suggest", "Deny", "Avoid", "Complain"], correct: "Suggest" },
  { sentence: "She worked hard to _______ her fear of speaking in front of the whole class.", options: ["Overcome", "Notice", "Deserve", "Warn"], correct: "Overcome" },
  { sentence: "He felt left out because his friends decided to _______ him from the group chat.", options: ["Exclude", "Include", "Trust", "Respect"], correct: "Exclude" },
];

// ── משחק חצאי משפטים ────────────────────────────────────────────────
export const halfSentencesData = [
  { id: 1, start: "Although she was exhausted after the long day,", end: "she still helped her younger sibling with his homework." },
  { id: 2, start: "Unless you apologize for what you said,", end: "your friend probably won't forgive you." },
  { id: 3, start: "He worked hard on his assignment for weeks;", end: "consequently, he achieved the highest grade in class." },
  { id: 4, start: "She refused to spread the rumor about her classmate,", end: "because she knew it wasn't fair to judge without facts." },
  { id: 5, start: "My parents are quite strict about my schedule,", end: "however they let me choose my own hobbies." },
  { id: 6, start: "Since he didn't want to disappoint his coach,", end: "he practiced every afternoon with great patience." },
  { id: 7, start: "Instead of complaining about the difficult exam,", end: "she decided to review the material more carefully." },
  { id: 8, start: "He felt embarrassed in front of his peers,", end: "so his best friend tried to encourage him." },
  { id: 9, start: "Although they used to argue a lot,", end: "the two siblings eventually learned to get along." },
  { id: 10, start: "She was determined to overcome her fear of failure,", end: "therefore she volunteered to present first." },
  { id: 11, start: "If you want people to trust you,", end: "you need to be honest, even when it's hard." },
  { id: 12, start: "He was too proud to admit his mistake,", end: "otherwise his friends would have forgiven him immediately." },
  { id: 13, start: "Despite feeling nervous and unprepared,", end: "she managed to convince the judges with her confidence." },
  { id: 14, start: "The new student felt excluded at first,", end: "until a kind classmate invited her to sit with them." },
  { id: 15, start: "Because he was aware of the peer pressure around him,", end: "he felt confident enough to simply say no." },
];

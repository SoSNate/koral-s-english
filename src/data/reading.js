// ── טקסטים לקריאה + שאלות הבנה (יומיום, משפחה, חברה) ──────────────
export const readingData = [
  {
    title: "The New Neighbor",
    text: `A new family moved in next door, and Ron was very [[curious|סקרן|קְיוּרִיאָס]] about them. Before he even met them, a classmate started a [[rumor|שמועה|רוּמֶר]] that the new [[neighbor|שכן|נֵייבֶּר]] boy was [[selfish|אנוכי|סֶלְפִיש]] and refused to talk to anyone.

    The [[gossip|רכילות|גוֹסִיפּ]] spread quickly, and soon most of the kids on the street decided not to [[include|לכלול|אִינְקְלוּד]] him in their games. Ron thought it was [[unfair|לא הוגן|אָנְפֵייר]] to [[judge|לשפוט|גַ'אדְג']] someone before actually meeting him.

    [[However|אולם|הַאוּוֶר]], Ron decided to knock on the door anyway. He was [[generous|נדיב|גֶ'נֶרֶס]] with his time and invited the boy, whose name was Adam, to play basketball. Adam looked surprised — no one else had even said hello.

    [[Eventually|בסופו של דבר|אִיוֶונְצְ'ואָלִי]], Ron [[realized|הבין|רִיאָלַייז]] that Adam was actually shy, not selfish at all. The rumor had been completely wrong, and Ron was glad he trusted his own judgment instead of the gossip.`,
    questions: [
      { q: "What did a classmate say about the new neighbor before Ron met him?", options: ["That he was very friendly", "That he was selfish", "That he loved basketball", "That he was moving away soon"], correct: 1 },
      { q: "What did most of the kids on the street decide to do?", options: ["Invite him to play", "Not include him in their games", "Ask him to move away", "Visit his house"], correct: 1 },
      { q: "What did Ron do instead of believing the rumor?", options: ["He ignored Adam completely", "He knocked on the door and invited Adam to play", "He told the teacher", "He spread the rumor further"], correct: 1 },
      { q: "What did Ron think about judging Adam before meeting him?", type: "text", correctAnswers: ["unfair", "it was unfair", "it wasn't fair"] },
      { q: "What did Ron realize Adam really was, instead of selfish?", type: "text", correctAnswers: ["shy", "he was shy"] }
    ]
  },
  {
    title: "A Promise Kept",
    text: `Yaniv's grandmother was getting older, and she often felt [[lonely|בודדה|לוֹנְלִי]]. [[Despite|למרות|דִיסְפַּייט]] having a busy schedule full of homework and [[chores|מטלות בית|צ'וֹרְס]], Yaniv promised to visit her every Friday afternoon.

    At first, it felt like just another [[assignment|מטלה|אֲסַיינְמֶנְט]] on his list. [[However|אולם|הַאוּוֶר]], he soon began to actually enjoy their conversations. His grandmother would [[describe|לתאר|דִיסְקְרַייב]] her childhood, and Yaniv would listen with growing [[curiosity|סקרנות|קְיוּרִיוֹסִיטִי]].

    One Friday, his friends [[suggested|הציעו|סַגְ'סְט]] going to a movie [[instead|במקום|אינסטד]]. Yaniv was [[tempted|מתפתה|טֶמְפְּטִד]] to say yes, but he remembered his promise. \"[[Unless|אלא אם כן|אָנְלֶס]] it's a real emergency, I don't break a promise,\" he told them politely.

    His grandmother never knew about the movie he missed, but Yaniv felt [[proud|גאה|פְּרַאוּד]] of his [[decision|החלטה|דִיסִיז'ן]]. He [[realized|הבין|רִיאָלַייז]] that being [[reliable|אמין|רִילַייָאבֶּל]] to the people you love matters more than a single afternoon of fun.`,
    questions: [
      { q: "What did Yaniv promise to do?", options: ["Do more chores", "Visit his grandmother every Friday", "Watch a movie every week", "Finish all his homework early"], correct: 1 },
      { q: "What did Yaniv's friends suggest one Friday?", options: ["Visiting his grandmother together", "Doing homework together", "Going to a movie instead", "Helping with chores"], correct: 2 },
      { q: "How did Yaniv feel after keeping his promise?", options: ["Bored", "Embarrassed", "Proud", "Jealous"], correct: 2 },
      { q: "What did Yaniv's grandmother often feel, according to the story?", type: "text", correctAnswers: ["lonely"] },
      { q: "What quality does Yaniv show by keeping his promise?", type: "text", correctAnswers: ["reliable", "reliability", "being reliable"] }
    ]
  },
  {
    title: "Standing Up",
    text: `Every day at lunch, Tamar noticed a group of students [[excluding|מוציאים|אֶקְסְקְלוּדִינְג]] a new kid named Omer from their table. It felt [[unfair|לא הוגן|אָנְפֵייר]], but Tamar was [[afraid|מפחדת|אֶפְרֵייד]] of the [[peer pressure|לחץ חברתי|פִּיר פְּרֶשֶׁר]] that came with standing out.

    [[Although|למרות ש|אוֹלְדוֹאוּ]] she worried what others might think, Tamar decided she couldn't just watch anymore. One day, she walked straight to Omer's table and sat down [[instead|במקום זאת|אינסטד]] of joining her usual friends.

    A few classmates were surprised, and one even started a [[rumor|שמועה|רוּמֶר]] that Tamar was acting strange. [[However|אולם|הַאוּוֶר]], she stayed [[confident|בטוחה בעצמה|קוֹנְפִידֶנְט]] in her choice, [[since|מאחר ש|סינס]] she knew it was the right thing to do.

    Slowly, other students began to [[include|לכלול|אִינְקְלוּד]] Omer too. Tamar [[realized|הבינה|רִיאָלַייז]] that one small, [[brave|אמיץ|בְּרֵייב]] decision could change how an entire group treated someone.`,
    questions: [
      { q: "What was happening to Omer at lunch every day?", options: ["He was being included", "He was being excluded", "He was helping the teacher", "He was eating alone by choice"], correct: 1 },
      { q: "Why was Tamar afraid to sit with Omer at first?", options: ["She didn't like him", "She was worried about peer pressure", "She had no time", "The teacher told her not to"], correct: 1 },
      { q: "What did one classmate start after Tamar sat with Omer?", options: ["A new club", "A rumor", "A group project", "A talent show"], correct: 1 },
      { q: "What eventually happened to how other students treated Omer?", type: "text", correctAnswers: ["they included him", "they started including him", "included him too"] },
      { q: "What kind of decision does Tamar make, according to the last line?", type: "text", correctAnswers: ["a brave decision", "brave", "a small brave decision"] }
    ]
  }
];

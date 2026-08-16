// ── טקסטים לקריאה + שאלות הבנה (יומיום, משפחה, חברה) ──────────────
export const readingData = [
  {
    title: "The Group Project",
    text: `Dana was usually [[confident|בטוחה בעצמה|קוֹנְפִידֶנְט]], but this time she felt [[anxious|חרדה|אֶנְקְשֶׁס]]. Her teacher had put her in a group with Roy, a boy who was known for being [[lazy|עצלן|לֵייזִי]] and never finishing his [[assignments|מטלות|אֲסַיינְמֶנְטְס]] on time.

    [[Although|למרות ש|אוֹלְדוֹאוּ]] Dana wanted to complain to the teacher, she decided to [[avoid|להימנע מ|אֶבּוֹיד]] an argument and try a different approach. She [[suggested|הציעה|סַגְ'סְט]] that they split the project into small parts, so each person would be [[responsible|אחראי|רִיסְפּוֹנְסִיבֶּל]] for one section.

    [[Since|מאחר ש|סִינְס]] Roy finally had a clear task, he surprised everyone. He worked hard and even helped design the poster. [[Consequently|כתוצאה מכך|קוֹנְסִיקְוֶונְטְלִי]], the group finished the project two days early.

    Dana [[realized|הבינה|רִיאָלַייז]] that judging someone before giving them a chance wasn't [[fair|הוגן|פֵייר]]. [[Instead|במקום זאת|אינסטד]] of complaining, she had found a solution — and gained a new friend along the way.`,
    questions: [
      { q: "How did Dana feel at first about working with Roy?", options: ["Confident and calm", "Anxious", "Bored", "Grateful"], correct: 1 },
      { q: "What did Dana suggest to solve the problem?", options: ["Complaining to the teacher", "Splitting the project into parts", "Doing the whole project herself", "Ignoring Roy completely"], correct: 1 },
      { q: "What happened after Roy got his own task?", options: ["He gave up", "He worked hard and helped", "He complained to the teacher", "He asked to change groups"], correct: 1 },
      { q: "What did each group member become, according to Dana's plan?", type: "text", correctAnswers: ["responsible", "responsible for one section", "responsible for a part"] },
      { q: "What did Dana gain by the end of the story, besides a finished project?", type: "text", correctAnswers: ["a new friend", "a friend", "new friend"] }
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

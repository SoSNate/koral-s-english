import { useState, useMemo, useEffect } from 'react';
import { irregularVerbs, verbGroups, verbSpeech } from '../data/irregularVerbs.js';

const shuffleArr = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
const groupOf = id => verbGroups.find(g => g.id === id);
const regularGuess = v1 => (v1.endsWith('e') ? v1 + 'd' : v1.endsWith('y') ? v1.slice(0, -1) + 'ied' : v1 + 'ed');
const ROUND = 10;
const STORE = 'koral_verbs_progress';

const loadProgress = () => {
    try {
        const p = JSON.parse(localStorage.getItem(STORE) || '{}');
        return { v12: p.v12 || [], v3: p.v3 || [] };
    } catch (_) { return { v12: [], v3: [] }; }
};

// ── בניית שאלות ──────────────────────────────────────────────────────────────
const pickDistractors = (correct, candidates, n = 3) => {
    const seen = new Set([correct.toLowerCase()]);
    const out = [];
    for (const c of candidates) {
        const k = c.toLowerCase();
        if (!seen.has(k)) { seen.add(k); out.push(c); }
        if (out.length === n) break;
    }
    return out;
};

const buildV12Question = verb => {
    const type = Math.random() < 0.6 ? 'v1to2' : 'v2to1';
    const sameGroup = shuffleArr(irregularVerbs.filter(v => v.g === verb.g && v.v1 !== verb.v1));
    const others = shuffleArr(irregularVerbs.filter(v => v.v1 !== verb.v1));
    if (type === 'v1to2') {
        const cands = [regularGuess(verb.v1), verb.v3, ...sameGroup.map(v => v.v2), ...others.map(v => v.v2)];
        const options = shuffleArr([verb.v2, ...pickDistractors(verb.v2, cands)]);
        return { verb, kind: 'v12', prompt: verb.v1, sub: verb.he, ask: 'מה צורת העבר (V2)?', options, correct: verb.v2 };
    }
    const cands = [...sameGroup.map(v => v.v1), ...others.map(v => v.v1)];
    const options = shuffleArr([verb.v1, ...pickDistractors(verb.v1, cands)]);
    return { verb, kind: 'v12', prompt: verb.v2, sub: verb.he, ask: 'מה צורת הבסיס (V1)?', options, correct: verb.v1 };
};

const buildV3Question = verb => {
    const sameGroup = shuffleArr(irregularVerbs.filter(v => v.g === verb.g && v.v1 !== verb.v1));
    const others = shuffleArr(irregularVerbs.filter(v => v.v1 !== verb.v1));
    const cands = [verb.v2, verb.v1, regularGuess(verb.v1), ...sameGroup.map(v => v.v3), ...others.map(v => v.v3)];
    const options = shuffleArr([verb.v3, ...pickDistractors(verb.v3, cands)]);
    return { verb, kind: 'v3', prompt: `${verb.v1} – ${verb.v2} – ?`, sub: verb.he, ask: 'מה צורה שלישית (V3)?', options, correct: verb.v3 };
};

// ── תרגול (שאלות אמריקאיות) ─────────────────────────────────────────────────
function VerbQuiz({ mode, group, progress, onMaster, onGoto, speakText, playSound, triggerAnimation }) {
    const [round, setRound] = useState(0);
    const mastered = new Set(progress[mode]);

    const questions = useMemo(() => {
        const pool = irregularVerbs.filter(v => group === 'all' || v.g === group);
        // קודם פעלים שעוד לא נשלטו
        const fresh = shuffleArr(pool.filter(v => !mastered.has(v.v1)));
        const done = shuffleArr(pool.filter(v => mastered.has(v.v1)));
        const picked = [...fresh, ...done].slice(0, ROUND);
        return shuffleArr(picked).map(mode === 'v12' ? buildV12Question : buildV3Question);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, group, round]);

    const [idx, setIdx] = useState(0);
    const [wrongPicks, setWrongPicks] = useState([]);
    const [solved, setSolved] = useState(false);
    const [score, setScore] = useState(0);
    const [firstTry, setFirstTry] = useState(true);

    useEffect(() => { setIdx(0); setWrongPicks([]); setSolved(false); setScore(0); setFirstTry(true); }, [mode, group, round]);

    const finished = idx >= questions.length;
    const q = questions[idx];

    const choose = opt => {
        if (solved || wrongPicks.includes(opt)) return;
        if (opt === q.correct) {
            playSound('success'); triggerAnimation('success-check');
            setSolved(true);
            speakText(verbSpeech(q.verb), 0.8);
            if (firstTry) { setScore(s => s + 1); onMaster(mode, q.verb.v1); }
        } else {
            playSound('error');
            setWrongPicks(w => [...w, opt]);
            setFirstTry(false);
        }
    };
    const next = () => { setIdx(i => i + 1); setWrongPicks([]); setSolved(false); setFirstTry(true); };

    if (!questions.length) return null;

    if (finished) {
        const good = score >= Math.ceil(questions.length * 0.8);
        return (
            <div className="text-center py-8">
                <h3 className="text-4xl font-black text-emerald-500 mb-3">{good ? 'כל הכבוד! 🎉' : 'יפה, ממשיכים! 💪'}</h3>
                <p className="text-6xl font-black text-orange-500 mb-2">{score}/{questions.length}</p>
                <p className="text-slate-500 font-bold mb-6">ענית נכון בניסיון הראשון</p>
                {mode === 'v12' && good && (
                    <p className="text-emerald-600 font-black mb-4">V1 ו-V2 מוכנים! אפשר לעבור ל-V3 👇</p>
                )}
                <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={() => setRound(r => r + 1)} className="px-8 py-3 bg-orange-500 text-white rounded-xl font-black hover:bg-orange-600">סיבוב נוסף 🔄</button>
                    {mode === 'v12' && <button onClick={() => onGoto('learn')} className="px-6 py-3 bg-orange-100 text-orange-700 rounded-xl font-bold hover:bg-orange-200">ללמוד V3 📖</button>}
                    {mode === 'v12' && good && <button onClick={() => onGoto('v3')} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black hover:bg-emerald-600">תרגול V3 🎯</button>}
                </div>
            </div>
        );
    }

    const g = groupOf(q.verb.g);
    return (
        <div className="text-center">
            <p className="text-xs font-bold text-orange-400 mb-3">שאלה {idx + 1} מתוך {questions.length} • ⭐ {score}</p>
            <div className="bg-gradient-to-br from-orange-400 to-amber-400 text-white rounded-3xl p-6 mb-4 shadow-lg">
                <p className="text-sm font-bold opacity-90 mb-2" dir="rtl">{q.ask}</p>
                <p className="text-4xl md:text-5xl font-black" dir="ltr">{q.prompt}</p>
                <p className="text-sm font-bold opacity-90 mt-2" dir="rtl">{q.sub}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {q.options.map(opt => {
                    const isWrong = wrongPicks.includes(opt);
                    const isRight = solved && opt === q.correct;
                    return (
                        <button key={opt} onClick={() => choose(opt)} disabled={isWrong || solved} dir="ltr"
                            className={`p-4 rounded-2xl font-black text-xl border-2 transition-all shadow-sm
                                ${isRight ? 'bg-emerald-500 text-white border-emerald-600 scale-105' :
                                    isWrong ? 'bg-rose-100 text-rose-300 border-rose-200 line-through' :
                                        solved ? 'bg-white border-orange-100 text-slate-300' :
                                            'bg-white border-orange-200 text-orange-900 hover:bg-orange-500 hover:text-white active:scale-95'}`}>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {wrongPicks.length > 0 && !solved && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 mb-4 text-sm font-bold text-amber-800" dir="rtl">
                    {mode === 'v3'
                        ? <>💡 רמז — קבוצת "{g.title}": {g.tip}</>
                        : <>לא בדיוק — נסי שוב 💪</>}
                </div>
            )}
            {solved && (
                <div className="mb-4">
                    <p className="text-2xl font-black text-emerald-600 mb-1" dir="ltr">{q.verb.v1} – {q.verb.v2} – <span className="underline decoration-4 decoration-orange-400">{q.verb.v3}</span></p>
                    <p className="text-xs font-bold text-slate-400" dir="rtl">{g.icon} {g.title}</p>
                    <div className="flex justify-center gap-3 mt-3">
                        <button onClick={() => speakText(verbSpeech(q.verb), 0.7)} className="px-5 py-2.5 bg-sky-100 text-sky-700 rounded-xl font-bold hover:bg-sky-200">שמיעה 🔊</button>
                        <button onClick={next} className="px-8 py-2.5 bg-orange-500 text-white rounded-xl font-black hover:bg-orange-600">
                            {idx === questions.length - 1 ? 'סיום 🏁' : 'הבא ➡️'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── לימוד V3 לפי דפוסים ──────────────────────────────────────────────────────
function VerbLearn({ speakText, playSound }) {
    const [gid, setGid] = useState('v2v3');
    const [revealed, setRevealed] = useState([]);
    const g = groupOf(gid);
    const verbs = irregularVerbs.filter(v => v.g === gid);

    useEffect(() => setRevealed([]), [gid]);

    const reveal = v => {
        if (!revealed.includes(v.v1)) { setRevealed(r => [...r, v.v1]); playSound('success'); }
        speakText(verbSpeech(v), 0.75);
    };

    return (
        <div>
            <p className="text-center text-sm font-bold text-slate-500 mb-4" dir="rtl">
                קודם בוחרים דפוס, אחר כך מנחשים את V3 לפי V1 ו-V2 — ולוחצים כדי לבדוק 👇
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-5">
                {verbGroups.map(x => (
                    <button key={x.id} onClick={() => setGid(x.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black border-2 transition-all ${gid === x.id ? `${x.chip} scale-105 shadow` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                        {x.icon} {x.title}
                    </button>
                ))}
            </div>

            <div className={`rounded-2xl border-2 p-4 mb-4 ${g.chip}`}>
                <p className="text-lg font-black mb-1" dir="ltr">{g.rule}</p>
                <p className="text-sm font-bold" dir="rtl">💡 {g.tip}</p>
                <p className="text-xs font-bold opacity-80 mt-1" dir="rtl">{g.note}</p>
            </div>

            <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-400">
                <span>{revealed.length}/{verbs.length} נחשפו</span>
                <div className="flex gap-2">
                    <button onClick={() => setRevealed(verbs.map(v => v.v1))} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">חשפי הכל</button>
                    <button onClick={() => setRevealed([])} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100">הסתירי</button>
                </div>
            </div>

            <div dir="ltr" className="rounded-2xl border-2 border-orange-100 overflow-hidden">
                <div className="grid grid-cols-3 bg-orange-50 text-xs font-black text-orange-500 py-2 text-center">
                    <span>V1</span><span>V2</span><span>V3</span>
                </div>
                {verbs.map(v => {
                    const open = revealed.includes(v.v1);
                    return (
                        <div key={v.v1} className="grid grid-cols-3 items-center text-center border-t border-orange-50 py-2 px-1">
                            <div>
                                <p className="font-black text-lg text-slate-800">{v.v1}</p>
                                <p className="text-[11px] text-slate-400 font-bold" dir="rtl">{v.he}</p>
                            </div>
                            <p className="font-black text-lg text-slate-700">{v.v2}</p>
                            <button onClick={() => reveal(v)}
                                className={`mx-1 py-2 rounded-xl font-black text-lg transition-all ${open ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-400 hover:bg-orange-200 active:scale-95'}`}>
                                {open ? v.v3 : '❓'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── הרשימה המלאה ─────────────────────────────────────────────────────────────
function VerbList({ speakText }) {
    const [q, setQ] = useState('');
    const list = irregularVerbs.filter(v => !q || v.v1.includes(q.toLowerCase()) || v.he.includes(q));
    return (
        <div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="חיפוש פועל (באנגלית או בעברית)"
                className="w-full mb-3 p-3 rounded-xl border-2 border-orange-200 text-center font-bold focus:outline-none focus:border-orange-400" />
            <p className="text-xs text-slate-400 font-bold text-center mb-2">{list.length} פעלים • לחצי על שורה כדי לשמוע</p>
            <div dir="ltr" className="rounded-2xl border-2 border-orange-100 overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr] bg-orange-50 text-xs font-black text-orange-500 py-2 text-center">
                    <span>V1</span><span>V2</span><span>V3</span><span dir="rtl">עברית</span>
                </div>
                {list.map(v => (
                    <button key={v.v1} onClick={() => speakText(verbSpeech(v), 0.75)}
                        className="w-full grid grid-cols-[1fr_1fr_1fr_1.2fr] items-center text-center border-t border-orange-50 py-2 px-1 hover:bg-orange-50 transition-colors">
                        <span className="font-black text-slate-800 flex items-center justify-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${groupOf(v.g).dot}`} />{v.v1}
                        </span>
                        <span className="font-bold text-slate-600">{v.v2}</span>
                        <span className="font-black text-orange-600">{v.v3}</span>
                        <span className="text-xs text-slate-400 font-bold" dir="rtl">{v.he}</span>
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {verbGroups.map(g => (
                    <span key={g.id} className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${g.chip}`}>{g.icon} {g.title}</span>
                ))}
            </div>
        </div>
    );
}

// ── המסך הראשי ───────────────────────────────────────────────────────────────
export default function IrregularVerbs({ speakText, playSound, triggerAnimation }) {
    const [tab, setTab] = useState('v12');
    const [group, setGroup] = useState('all');
    const [progress, setProgress] = useState(loadProgress);

    useEffect(() => {
        try { localStorage.setItem(STORE, JSON.stringify(progress)); } catch (_) {}
    }, [progress]);

    const onMaster = (mode, v1) =>
        setProgress(p => (p[mode].includes(v1) ? p : { ...p, [mode]: [...p[mode], v1] }));

    const total = irregularVerbs.length;
    const TabBtn = ({ id, icon, label, step }) => (
        <button onClick={() => setTab(id)}
            className={`py-3 px-1 font-black text-xs sm:text-sm rounded-xl transition-all ${tab === id ? 'bg-orange-500 text-white shadow-md' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}>
            {step && <span className="opacity-70">{step} </span>}{icon} {label}
        </button>
    );

    return (
        <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-xl border-t-8 border-orange-400 transition-all">
            <h2 className="text-3xl font-black text-orange-600 mb-1 text-center">פעלים לא סדירים 🔤</h2>
            <p className="text-center text-sm font-bold text-orange-400 mb-4">V1 • V2 • V3 — עמוד 194</p>

            <div className="grid grid-cols-2 gap-2 mb-5 text-center text-xs font-black">
                <div className="bg-orange-50 rounded-xl py-2 text-orange-600">V1 + V2 שנשלטו: {progress.v12.length}/{total}</div>
                <div className="bg-emerald-50 rounded-xl py-2 text-emerald-600">V3 שנשלטו: {progress.v3.length}/{total}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                <TabBtn id="v12" step="1" icon="🧠" label="זוכרת V1+V2?" />
                <TabBtn id="learn" step="2" icon="📖" label="לומדים V3" />
                <TabBtn id="v3" step="3" icon="🎯" label="תרגול V3" />
                <TabBtn id="list" icon="📋" label="הרשימה" />
            </div>

            {(tab === 'v12' || tab === 'v3') && (
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                    <button onClick={() => setGroup('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-black border-2 ${group === 'all' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-slate-200'}`}>
                        🌈 הכל
                    </button>
                    {verbGroups.map(g => (
                        <button key={g.id} onClick={() => setGroup(g.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-black border-2 ${group === g.id ? `${g.chip} shadow` : 'bg-white text-slate-500 border-slate-200'}`}>
                            {g.icon} {g.title}
                        </button>
                    ))}
                </div>
            )}

            {tab === 'v12' && <VerbQuiz key="v12" mode="v12" group={group} progress={progress} onMaster={onMaster} onGoto={setTab} speakText={speakText} playSound={playSound} triggerAnimation={triggerAnimation} />}
            {tab === 'v3' && <VerbQuiz key="v3" mode="v3" group={group} progress={progress} onMaster={onMaster} onGoto={setTab} speakText={speakText} playSound={playSound} triggerAnimation={triggerAnimation} />}
            {tab === 'learn' && <VerbLearn speakText={speakText} playSound={playSound} />}
            {tab === 'list' && <VerbList speakText={speakText} />}

            {tab === 'learn' && (
                <div className="text-center mt-6">
                    <button onClick={() => setTab('v3')} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-black hover:bg-emerald-600">לתרגול V3 🎯</button>
                </div>
            )}
        </div>
    );
}

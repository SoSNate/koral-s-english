import { useState, useMemo, useEffect } from 'react';
import { speakQuestions } from '../data/sentenceBuilder.js';

const shuffleArr = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const tokenize = s => s.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
const norm = s => s.toLowerCase().replace(/[^a-z0-9' ]/g, '').replace(/\s+/g, ' ').trim();
const display = words => {
    if (!words.length) return '';
    const s = words.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
};

// כמה מהמילים במשפט נשמעו (לפי סדר) — סלחני למבטא
const speechScore = (transcript, target) => {
    const t = norm(transcript).split(' ');
    const g = norm(target).split(' ');
    let hit = 0, pos = 0;
    for (const w of g) {
        const idx = t.indexOf(w, pos);
        if (idx !== -1) { hit++; pos = idx + 1; }
    }
    return hit / g.length;
};

const emptySlot = () => ({ words: [], status: 'build', heard: '' });
// status: build | wrong | dup | ok | spoken

export default function SentenceBuilder({ speakText, playSound, triggerAnimation }) {
    const [qIdx, setQIdx] = useState(0);
    const [slots, setSlots] = useState([emptySlot(), emptySlot()]);
    const [active, setActive] = useState(0);
    const [listeningSlot, setListeningSlot] = useState(null);
    const [hint, setHint] = useState('');

    const item = speakQuestions[qIdx];

    // מאגר המילים — כל מילה פעם אחת, אפשר להשתמש שוב ושוב
    const bank = useMemo(() => {
        // מילים שמופיעות באות גדולה באמצע משפט (I, Koral, English) נשארות כך
        const proper = new Set(['I']);
        item.answers.forEach(a => tokenize(a).forEach((w, i) => { if (i > 0 && /^[A-Z]/.test(w)) proper.add(w); }));
        const set = new Map();
        [...item.answers.flatMap(tokenize), ...(item.extra || [])].forEach(w => {
            const key = proper.has(w) ? w : w.toLowerCase();
            if (!set.has(key)) set.set(key, key);
        });
        return shuffleArr([...set.values()]);
    }, [item]);

    const validAnswers = useMemo(() => item.answers.map(norm), [item]);
    const foundCount = slots.filter(s => s.status === 'ok' || s.status === 'spoken').length;
    const spokenCount = slots.filter(s => s.status === 'spoken').length;

    useEffect(() => {
        setSlots([emptySlot(), emptySlot()]); setActive(0); setHint('');
    }, [qIdx]);

    const updateSlot = (i, fn) => setSlots(prev => prev.map((s, j) => (j === i ? fn(s) : s)));
    const locked = s => s.status === 'ok' || s.status === 'spoken';

    const addWord = w => {
        const s = slots[active];
        if (!s || locked(s)) return;
        updateSlot(active, s => ({ ...s, words: [...s.words, w], status: 'build' }));
    };
    const removeWord = (i, wi) => {
        if (locked(slots[i])) return;
        setActive(i);
        updateSlot(i, s => ({ ...s, words: s.words.filter((_, k) => k !== wi), status: 'build' }));
    };

    const check = i => {
        const built = norm(slots[i].words.join(' '));
        const dup = slots.some((s, j) => j !== i && locked(s) && norm(s.words.join(' ')) === built);
        if (dup) { playSound('error'); updateSlot(i, s => ({ ...s, status: 'dup' })); return; }
        if (validAnswers.includes(built)) {
            playSound('success'); triggerAnimation('success-check');
            updateSlot(i, s => ({ ...s, status: 'ok' }));
            speakText(display(slots[i].words));
            // מעבר אוטומטי לשורה הריקה הבאה
            const nextEmpty = slots.findIndex((s, j) => j !== i && !locked(s));
            if (nextEmpty !== -1) setActive(nextEmpty);
        } else {
            playSound('error'); updateSlot(i, s => ({ ...s, status: 'wrong' }));
        }
    };

    const listen = i => {
        if (listeningSlot !== null) return;
        const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Rec) { alert('הדפדפן לא תומך בזיהוי קולי. נסי בכרום 🙂'); return; }
        const target = slots[i].words.join(' ');
        const rec = new Rec();
        rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 3;
        rec.onstart = () => { setListeningSlot(i); updateSlot(i, s => ({ ...s, heard: '' })); };
        rec.onend = () => setListeningSlot(null);
        rec.onerror = () => { setListeningSlot(null); updateSlot(i, s => ({ ...s, heard: '__err' })); };
        rec.onresult = e => {
            const alts = Array.from(e.results[0]).map(a => a.transcript);
            const best = alts.reduce((b, a) => (speechScore(a, target) > speechScore(b, target) ? a : b), alts[0]);
            if (speechScore(best, target) >= 0.75) {
                playSound('success'); triggerAnimation('confetti');
                updateSlot(i, s => ({ ...s, status: 'spoken', heard: best }));
            } else {
                playSound('error');
                updateSlot(i, s => ({ ...s, heard: best }));
            }
        };
        try { rec.start(); } catch (_) { setListeningSlot(null); }
    };

    const addSlot = () => { setSlots(prev => [...prev, emptySlot()]); setActive(slots.length); };

    const showHint = () => {
        const used = slots.filter(locked).map(s => norm(s.words.join(' ')));
        const remaining = item.answers.filter(a => !used.includes(norm(a)));
        if (!remaining.length) { setHint('מצאת את כל התשובות! 🏆'); return; }
        const a = tokenize(remaining[Math.floor(Math.random() * remaining.length)]);
        setHint(`${a.slice(0, 2).join(' ')} ...`);
    };

    return (
        <div className="text-center">
            {/* ניווט בין שאלות */}
            <div className="flex justify-center gap-1.5 mb-5 flex-wrap">
                {speakQuestions.map((q, i) => (
                    <button key={i} onClick={() => setQIdx(i)}
                        className={`w-8 h-8 rounded-full text-xs font-black transition-all ${i === qIdx ? 'bg-violet-500 text-white scale-110 shadow' : 'bg-violet-50 text-violet-500 hover:bg-violet-100'}`}>
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* שאלת הפתיחה */}
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-3xl p-5 mb-5 shadow-lg">
                <p className="text-xs font-bold opacity-80 mb-1">{item.tag}</p>
                <div className="flex items-center justify-center gap-3" dir="ltr">
                    <p className="text-2xl md:text-3xl font-black">{item.q}</p>
                    <button onClick={() => speakText(item.q)} className="text-2xl hover:scale-110 transition-transform" aria-label="שמיעת השאלה">🔊</button>
                </div>
                <p className="text-sm font-bold opacity-90 mt-1" dir="rtl">{item.he}</p>
            </div>

            <p className="text-sm font-bold text-slate-500 mb-4" dir="rtl">
                יש כמה תשובות נכונות! תבני משפטים מהמילים ותגידי אותם בקול 🗣️
                <span className="block text-violet-500 mt-1">✅ {foundCount} משפטים • 🎤 {spokenCount} נאמרו • {item.answers.length} אפשרויות</span>
            </p>

            {/* שורות המשפטים */}
            <div className="space-y-3 mb-5">
                {slots.map((s, i) => {
                    const isActive = i === active && !locked(s);
                    const color =
                        s.status === 'spoken' ? 'border-emerald-400 bg-emerald-50' :
                        s.status === 'ok' ? 'border-emerald-300 bg-emerald-50/60' :
                        s.status === 'wrong' || s.status === 'dup' ? 'border-rose-300 bg-rose-50' :
                        isActive ? 'border-violet-400 bg-violet-50 ring-4 ring-violet-100' : 'border-violet-200 bg-white';
                    return (
                        <div key={i} onClick={() => !locked(s) && setActive(i)}
                            className={`rounded-2xl border-[3px] p-3 transition-all cursor-pointer ${color}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-violet-400 shrink-0 w-6">{s.status === 'spoken' ? '⭐' : s.status === 'ok' ? '✅' : `${i + 1}.`}</span>
                                <div dir="ltr" className="flex-1 flex flex-wrap gap-1.5 min-h-[44px] items-center">
                                    {s.words.length === 0 && (
                                        <span className="text-violet-300 font-bold text-sm w-full text-center" dir="rtl">
                                            {isActive ? 'לחצי על מילים מלמטה 👇' : 'לחצי כאן כדי לבנות משפט'}
                                        </span>
                                    )}
                                    {locked(s) ? (
                                        <span className="text-xl font-black text-emerald-700">{display(s.words)}</span>
                                    ) : s.words.map((w, wi) => (
                                        <button key={wi} onClick={e => { e.stopPropagation(); removeWord(i, wi); }}
                                            className="px-2.5 py-1.5 bg-white border-2 border-violet-300 rounded-lg font-black text-base text-violet-900 hover:bg-rose-50 hover:border-rose-300">
                                            {wi === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* פעולות לשורה */}
                            {!locked(s) && s.words.length > 0 && (
                                <div className="flex justify-center gap-2 mt-2">
                                    <button onClick={e => { e.stopPropagation(); check(i); }}
                                        className="px-5 py-1.5 bg-violet-500 text-white rounded-lg font-black text-sm hover:bg-violet-600">בדיקה ✔️</button>
                                    <button onClick={e => { e.stopPropagation(); setActive(i); updateSlot(i, () => emptySlot()); }}
                                        className="px-4 py-1.5 bg-violet-100 text-violet-700 rounded-lg font-bold text-sm hover:bg-violet-200">ניקוי 🧹</button>
                                </div>
                            )}
                            {s.status === 'wrong' && <p className="text-rose-500 text-sm font-bold mt-2">המשפט הזה עוד לא נכון — לחצי על מילה כדי להוציא אותה ונסי שוב 💪</p>}
                            {s.status === 'dup' && <p className="text-rose-500 text-sm font-bold mt-2">את המשפט הזה כבר בנית! נסי משפט אחר 🙂</p>}

                            {locked(s) && (
                                <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
                                    <button onClick={e => { e.stopPropagation(); speakText(display(s.words), 0.75); }}
                                        className="px-4 py-1.5 bg-sky-100 text-sky-700 rounded-lg font-bold text-sm hover:bg-sky-200">שמיעה 🔊</button>
                                    {s.status === 'ok' && (
                                        <button onClick={e => { e.stopPropagation(); listen(i); }} disabled={listeningSlot !== null}
                                            className={`px-5 py-1.5 rounded-lg font-black text-sm text-white ${listeningSlot === i ? 'bg-rose-500 animate-pulse' : 'bg-violet-500 hover:bg-violet-600'}`}>
                                            {listeningSlot === i ? 'מקשיבה... 👂' : 'עכשיו תגידי בקול 🎤'}
                                        </button>
                                    )}
                                    {s.status === 'spoken' && <span className="text-emerald-600 font-black text-sm">אמרת מושלם! 🎉</span>}
                                </div>
                            )}
                            {s.status === 'ok' && s.heard && s.heard !== '__err' && (
                                <p className="text-rose-500 text-sm font-bold mt-1">שמעתי: <span dir="ltr">"{s.heard}"</span> — נסי שוב</p>
                            )}
                            {s.heard === '__err' && <p className="text-rose-500 text-sm font-bold mt-1">לא שמעתי, נסי שוב 🎤</p>}
                        </div>
                    );
                })}
            </div>

            {/* מאגר המילים — תמיד מול העיניים */}
            <div className="bg-violet-50/60 border-2 border-violet-100 rounded-3xl p-4 mb-4">
                <p className="text-xs font-black text-violet-400 mb-3">מאגר מילים — אפשר להשתמש בכל מילה כמה פעמים</p>
                <div dir="ltr" className="flex flex-wrap gap-2 justify-center">
                    {bank.map(w => (
                        <button key={w} onClick={() => addWord(w)}
                            className="px-3.5 py-2.5 rounded-xl font-black text-base bg-white border-2 border-violet-200 text-violet-900 hover:bg-violet-500 hover:text-white hover:border-violet-500 active:scale-95 transition-all shadow-sm">
                            {w}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                <button onClick={addSlot} className="px-5 py-2.5 bg-violet-100 text-violet-700 rounded-xl font-bold hover:bg-violet-200">+ עוד משפט</button>
                <button onClick={showHint} className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-bold hover:bg-amber-100">רמז 💡</button>
                <button onClick={() => setQIdx(i => (i + 1) % speakQuestions.length)}
                    className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black hover:bg-emerald-600">שאלה הבאה ➡️</button>
            </div>
            {hint && <p className="mt-3 text-amber-700 font-black text-lg" dir="ltr">{hint}</p>}
        </div>
    );
}

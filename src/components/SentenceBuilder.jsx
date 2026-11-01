import { useState, useMemo, useEffect } from 'react';
import { sentenceBuilderData, sentenceCategories } from '../data/sentenceBuilder.js';

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

// כמה מילים מהמשפט הנכון נשמעו (לפי סדר) — סלחני למבטא
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

export default function SentenceBuilder({ speakText, playSound, triggerAnimation }) {
    const [cat, setCat] = useState('all');
    const pool = useMemo(
        () => shuffleArr(sentenceBuilderData.filter(s => cat === 'all' || s.cat === cat)),
        [cat]
    );
    const [idx, setIdx] = useState(0);
    const [tiles, setTiles] = useState([]);     // [{id, text}]
    const [picked, setPicked] = useState([]);   // ids by order
    const [status, setStatus] = useState('build'); // build | wrong | built | spoken
    const [listening, setListening] = useState(false);
    const [heard, setHeard] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);

    const item = pool[idx % pool.length];

    useEffect(() => {
        if (!item) return;
        const words = [...tokenize(item.en), ...(item.extra || [])];
        setTiles(shuffleArr(words.map((text, i) => ({ id: i, text }))));
        setPicked([]); setStatus('build'); setHeard(''); setShowHint(false);
    }, [item]);

    useEffect(() => { setIdx(0); setScore(0); }, [cat]);

    if (!item) return null;

    const targetTokens = tokenize(item.en);
    const builtText = picked.map(id => tiles.find(t => t.id === id)?.text).join(' ');
    const catInfo = sentenceCategories.find(c => c.id === item.cat);

    const pick = id => {
        if (status === 'built' || status === 'spoken') return;
        setPicked(p => [...p, id]);
        if (status === 'wrong') setStatus('build');
    };
    const unpick = id => {
        if (status === 'built' || status === 'spoken') return;
        setPicked(p => p.filter(x => x !== id));
        if (status === 'wrong') setStatus('build');
    };

    const check = () => {
        if (norm(builtText) === norm(targetTokens.join(' '))) {
            playSound('success'); triggerAnimation('success-check');
            setStatus('built');
            speakText(item.en);
        } else {
            playSound('error'); setStatus('wrong');
        }
    };

    const listen = () => {
        if (listening) return;
        const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Rec) { alert('הדפדפן לא תומך בזיהוי קולי. נסי בכרום 🙂'); return; }
        const rec = new Rec();
        rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 3;
        rec.onstart = () => { setListening(true); setHeard(''); };
        rec.onend = () => setListening(false);
        rec.onerror = () => { setListening(false); setHeard('__err'); };
        rec.onresult = e => {
            const alts = Array.from(e.results[0]).map(a => a.transcript);
            const best = alts.reduce((b, a) => speechScore(a, item.en) > speechScore(b, item.en) ? a : b, alts[0]);
            setHeard(best);
            if (speechScore(best, item.en) >= 0.75) {
                playSound('success'); triggerAnimation('confetti');
                setStatus('spoken'); setScore(s => s + 1);
            } else playSound('error');
        };
        try { rec.start(); } catch (_) { setListening(false); }
    };

    const next = () => setIdx(i => i + 1);

    return (
        <div className="text-center">
            {/* קטגוריות */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {sentenceCategories.map(c => (
                    <button key={c.id} onClick={() => setCat(c.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${cat === c.id ? 'bg-violet-500 text-white shadow' : 'bg-violet-50 text-violet-600 hover:bg-violet-100'}`}>
                        {c.icon} {c.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-violet-400 mb-3">
                <span>{catInfo?.icon} {catInfo?.label}</span>
                <span>⭐ {score} משפטים נאמרו</span>
            </div>

            {/* המשימה */}
            <p className="text-lg md:text-xl font-black text-slate-700 mb-1" dir="rtl">תרכיבי ותגידי באנגלית:</p>
            <p className="text-xl md:text-2xl font-black text-violet-700 mb-5" dir="rtl">"{item.he}"</p>

            {/* אזור המשפט שנבנה */}
            <div dir="ltr"
                className={`min-h-[88px] p-4 rounded-2xl border-4 border-dashed mb-5 flex flex-wrap gap-2 items-center justify-center transition-all
                    ${status === 'wrong' ? 'border-rose-300 bg-rose-50' : status === 'built' || status === 'spoken' ? 'border-emerald-300 bg-emerald-50' : 'border-violet-200 bg-violet-50'}`}>
                {picked.length === 0 && <span className="text-violet-300 font-bold text-sm" dir="rtl">לחצי על המילים למטה לפי הסדר 👇</span>}
                {picked.map(id => {
                    const t = tiles.find(x => x.id === id);
                    return (
                        <button key={id} onClick={() => unpick(id)}
                            className="px-3 py-2 bg-white border-2 border-violet-300 rounded-xl font-black text-lg text-violet-900 shadow-sm hover:bg-rose-50">
                            {t?.text}
                        </button>
                    );
                })}
            </div>

            {status === 'wrong' && <p className="text-rose-500 font-bold mb-4">כמעט! לחצי על מילה כדי להחזיר אותה ונסי שוב 💪</p>}

            {/* מאגר המילים */}
            {(status === 'build' || status === 'wrong') && (
                <>
                    <div dir="ltr" className="flex flex-wrap gap-2 justify-center mb-6">
                        {tiles.map(t => {
                            const used = picked.includes(t.id);
                            return (
                                <button key={t.id} onClick={() => !used && pick(t.id)} disabled={used}
                                    className={`px-4 py-3 rounded-xl font-black text-lg border-2 transition-all shadow-sm
                                        ${used ? 'opacity-20 border-slate-200 bg-slate-50' : 'bg-white border-violet-200 text-violet-900 hover:bg-violet-500 hover:text-white active:scale-95'}`}>
                                    {t.text}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={check} disabled={picked.length === 0}
                            className="px-8 py-3 bg-violet-500 text-white rounded-xl font-black hover:bg-violet-600 disabled:opacity-40">
                            בדיקה ✔️
                        </button>
                        <button onClick={() => { setPicked([]); setStatus('build'); }}
                            className="px-5 py-3 bg-violet-100 text-violet-700 rounded-xl font-bold hover:bg-violet-200">
                            ניקוי 🧹
                        </button>
                        <button onClick={() => setShowHint(h => !h)}
                            className="px-5 py-3 bg-amber-50 text-amber-700 rounded-xl font-bold hover:bg-amber-100">
                            רמז 💡
                        </button>
                    </div>
                    {showHint && <p className="mt-3 text-amber-700 font-bold" dir="ltr">{targetTokens[0]} ... ({targetTokens.length} words)</p>}
                </>
            )}

            {/* שלב הדיבור */}
            {(status === 'built' || status === 'spoken') && (
                <div className="mt-2">
                    <p className="text-2xl md:text-3xl font-black text-emerald-600 mb-4" dir="ltr">{item.en}</p>
                    {status === 'built' && <p className="font-bold text-slate-600 mb-4">מעולה! עכשיו תגידי את המשפט בקול 🎤</p>}
                    <div className="flex flex-wrap justify-center gap-3 mb-4">
                        <button onClick={() => speakText(item.en, 0.75)}
                            className="px-5 py-3 bg-sky-100 text-sky-700 rounded-xl font-bold hover:bg-sky-200">
                            שמיעה 🔊
                        </button>
                        <button onClick={listen} disabled={listening}
                            className={`px-8 py-3 rounded-xl font-black text-white transition-all ${listening ? 'bg-rose-500 animate-pulse' : 'bg-violet-500 hover:bg-violet-600'}`}>
                            {listening ? 'מקשיבה... 👂' : 'להגיד בקול 🎤'}
                        </button>
                    </div>
                    {heard && heard !== '__err' && status !== 'spoken' && (
                        <p className="text-rose-500 font-bold mb-3">שמעתי: <span dir="ltr">"{heard}"</span> — נסי שוב 💪</p>
                    )}
                    {heard === '__err' && <p className="text-rose-500 font-bold mb-3">לא שמעתי, נסי שוב 🎤</p>}
                    {status === 'spoken' && <p className="text-emerald-600 font-black text-xl mb-3">אלופה! אמרת את זה מושלם 🎉</p>}
                    <button onClick={next}
                        className={`px-8 py-3 rounded-xl font-black ${status === 'spoken' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {status === 'spoken' ? 'משפט הבא ➡️' : 'דלגי ⏭️'}
                    </button>
                </div>
            )}
        </div>
    );
}

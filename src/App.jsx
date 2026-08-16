import { useState, useEffect, useRef, useMemo } from 'react';
import { wordsData } from './data/words.js';
import { builderData, analogiesData, completionData, halfSentencesData } from './data/exercises.js';
import { storiesData } from './data/stories.js';
import { readingData } from './data/reading.js';

// ── Helpers ───────────────────────────────────────────────────────
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const playSound = type => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        if (type === 'success') {
            osc.frequency.setValueAtTime(523, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        } else {
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        }
        osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}
};

const speakText = (text, rate = 0.85) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate; u.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes("Premium") || v.name.includes("Enhanced") || v.name.includes("Online") || v.name.includes("Natural")) &&
        !v.name.toLowerCase().includes("male")
    ) || voices.find(v => ["Google US English", "Microsoft Samantha", "Samantha", "Microsoft Zira"].some(p => v.name.includes(p)));
    if (pick) u.voice = pick;
    window.speechSynthesis.speak(u);
};

const getNextRandom = (curr, length) => {
    if (length <= 1) return 0;
    let next = curr;
    while (next === curr) next = Math.floor(Math.random() * length);
    return next;
};

// ── בדיקת דיבור מתקדמת מותאמת למבטא עברי (Fuzzy & Accent Matching) ───────────
const isFuzzyMatch = (transcript, target) => {
    const clean = s => s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const tClean = clean(transcript);
    const targetClean = clean(target);
    if (tClean === targetClean) return true;
    if (tClean.includes(targetClean) || targetClean.includes(tClean)) return true;
    const normalizeAccent = s => s.replace(/w/g, 'v').replace(/th/g, 'd').replace(/z/g, 's').replace(/c/g, 'k').replace(/q/g, 'k').replace(/ph/g, 'f');
    if (normalizeAccent(tClean) === normalizeAccent(targetClean)) return true;
    const getEditDistance = (a, b) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
                    ? matrix[i - 1][j - 1]
                    : Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
        return matrix[b.length][a.length];
    };
    const dist = getEditDistance(tClean, targetClean);
    if (targetClean.length <= 4 && dist <= 1) return true;
    if (targetClean.length <= 8 && dist <= 2) return true;
    if (targetClean.length > 8 && dist <= 3) return true;
    return false;
};

// ── App ───────────────────────────────────────────────────────────
export default function App() {
    useEffect(() => {
        if (!customElements.get('dotlottie-wc')) {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js";
            script.type = "module";
            document.head.appendChild(script);
        }
    }, []);

    const [view, setView] = useState('learn');
    const [gradeFilter, setGradeFilter] = useState(() => localStorage.getItem('koral_grade_filter') || 'all');
    const [masteredIndexes, setMasteredIndexes] = useState(() => {
        try { return JSON.parse(localStorage.getItem('koral_mastered_words') || '[]'); }
        catch { return []; }
    });
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [step, setStep] = useState(1);
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [activeAnim, setActiveAnim] = useState(null);

    // Game states
    const [builderIndex, setBuilderIndex] = useState(0);
    const [analogyIndex, setAnalogyIndex] = useState(0);
    const [compIndex, setCompIndex] = useState(0);
    const [storyIndex, setStoryIndex] = useState(0);
    const [quizSet, setQuizSet] = useState([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [matchCards, setMatchCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [halfSentences, setHalfSentences] = useState({ starts: [], ends: [] });
    const [selectedStart, setSelectedStart] = useState(null);
    const [matchedHalfIds, setMatchedHalfIds] = useState([]);
    const [wrongHalfFlash, setWrongHalfFlash] = useState(null);
    const [readingIndex, setReadingIndex] = useState(0);
    const [readingAnswers, setReadingAnswers] = useState({});
    const [readingTextInputs, setReadingTextInputs] = useState({});

    const isProcessingRef = useRef(false);

    const pool = useMemo(() => gradeFilter === 'all' ? wordsData : wordsData.filter(w => w.grade === Number(gradeFilter)), [gradeFilter]);
    const currentWord = pool[activeWordIndex] || pool[0] || wordsData[0];

    useEffect(() => {
        localStorage.setItem('koral_grade_filter', gradeFilter);
        setActiveWordIndex(0);
        setStep(1);
    }, [gradeFilter]);

    const options = useMemo(() => {
        const others = wordsData.filter(w => w.en !== currentWord.en).sort(() => Math.random() - 0.5).slice(0, 3);
        return shuffle([...others, currentWord]);
    }, [activeWordIndex, gradeFilter]);

    const builderOptions = useMemo(() => {
        const item = builderData[builderIndex];
        return shuffle(item.options.map((text, i) => ({ text, isCorrect: i === item.correct })));
    }, [builderIndex]);

    const analogyOptions = useMemo(() => shuffle(analogiesData[analogyIndex].options), [analogyIndex]);
    const compOptions = useMemo(() => shuffle(completionData[compIndex].options), [compIndex]);

    useEffect(() => {
        localStorage.setItem('koral_mastered_words', JSON.stringify(masteredIndexes));
    }, [masteredIndexes]);

    const triggerAnimation = type => {
        setActiveAnim(type);
        setTimeout(() => setActiveAnim(null), 1800);
    };

    const wordKey = w => `${w.en}`;

    const handleSpeech = () => {
        if (isListening) return;
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) return alert("הדפדפן לא תומך בזיהוי קולי.");
        const rec = new Recognition();
        rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 1;
        isProcessingRef.current = false;
        rec.onstart = () => setIsListening(true);
        rec.onend = () => { setIsListening(false); isProcessingRef.current = false; };
        rec.onerror = e => {
            setIsListening(false); isProcessingRef.current = false;
            const msgs = { 'no-speech': 'לא שמעתי כלום, נסי שוב 🎤', 'not-allowed': 'נא לאשר גישה למיקרופון.' };
            setFeedback({ type: 'error', message: msgs[e.error] || 'שגיאת מיקרופון, נסי שוב.' });
            setTimeout(() => setFeedback(null), 2500);
        };
        rec.onresult = e => {
            if (isProcessingRef.current) return;
            const transcript = e.results[0][0].transcript;
            const target = currentWord.en.replace(/^to\s+/i, "").split(' - ')[0];
            if (isFuzzyMatch(transcript, target)) {
                isProcessingRef.current = true;
                setFeedback({ type: 'success', message: `מעולה! זיהיתי "${transcript}"` });
                playSound('success');
                triggerAnimation('success-check');
                setMasteredIndexes(prev => {
                    const key = wordKey(currentWord);
                    const next = prev.includes(key) ? prev : [...prev, key];
                    setTimeout(() => {
                        setActiveWordIndex(i => (i + 1) % pool.length);
                        setStep(1); setFeedback(null); isProcessingRef.current = false;
                    }, 1500);
                    return next;
                });
            } else {
                playSound('error');
                setFeedback({ type: 'error', message: `שמעתי "${transcript}", נסי שוב.` });
            }
        };
        try { rec.start(); } catch (_) { setIsListening(false); }
    };

    const checkTranslation = he => {
        if (he === currentWord.he) { playSound('success'); setStep(3); }
        else { playSound('error'); setFeedback({ type: 'error', message: 'טעות, נסי שוב.' }); setTimeout(() => setFeedback(null), 1500); }
    };

    const resetProgress = () => {
        if (confirm("לאפס את כל ההתקדמות?")) {
            setMasteredIndexes([]); setActiveWordIndex(0);
            localStorage.removeItem('koral_mastered_words');
            setView('learn'); setStep(1);
        }
    };

    const startMatchGame = () => {
        const selected = shuffle(pool.length >= 6 ? pool : wordsData).slice(0, 6);
        let cards = [];
        selected.forEach((w, i) => {
            cards.push({ id: `en-${i}`, text: w.en, type: 'en', pairId: i });
            cards.push({ id: `he-${i}`, text: w.he, type: 'he', pairId: i });
        });
        setMatchCards(shuffle(cards));
        setFlippedCards([]); setMatchedPairs([]);
        setView('match');
    };

    const handleCardClick = card => {
        if (flippedCards.length === 2 || flippedCards.some(c => c.id === card.id) || matchedPairs.includes(card.pairId)) return;
        const newFlipped = [...flippedCards, card];
        setFlippedCards(newFlipped);
        if (newFlipped.length === 2) {
            if (newFlipped[0].pairId === newFlipped[1].pairId) {
                playSound('success');
                setTimeout(() => {
                    const newMatched = [...matchedPairs, newFlipped[0].pairId];
                    setMatchedPairs(newMatched);
                    setFlippedCards([]);
                    if (newMatched.length === 6) triggerAnimation('confetti');
                }, 500);
            } else {
                playSound('error');
                setTimeout(() => setFlippedCards([]), 1000);
            }
        }
    };

    const startHalfSentences = () => {
        const selected = shuffle(halfSentencesData).slice(0, 6);
        setHalfSentences({ starts: shuffle(selected), ends: shuffle(selected) });
        setSelectedStart(null); setMatchedHalfIds([]); setWrongHalfFlash(null);
        setView('halves');
    };

    const handleStartClick = item => {
        if (matchedHalfIds.includes(item.id)) return;
        setSelectedStart(item);
    };

    const handleEndClick = item => {
        if (matchedHalfIds.includes(item.id) || !selectedStart) return;
        if (selectedStart.id === item.id) {
            playSound('success');
            setMatchedHalfIds(prev => {
                const next = [...prev, item.id];
                if (next.length === halfSentences.starts.length) triggerAnimation('confetti');
                return next;
            });
            setSelectedStart(null);
        } else {
            playSound('error');
            setWrongHalfFlash(item.id);
            setTimeout(() => setWrongHalfFlash(null), 500);
            setSelectedStart(null);
        }
    };

    const startQuiz = () => {
        const vocabQ = shuffle(wordsData).slice(0, 4).map(w => {
            const others = wordsData.filter(x => x.he !== w.he).sort(() => 0.5 - Math.random()).slice(0, 3);
            const opts = shuffle([...others.map(x => x.he), w.he]);
            return { type: 'vocab', question: w.en, correct: w.he, options: opts };
        });
        const analogyQ = shuffle(analogiesData).slice(0, 3).map(a => ({
            type: 'analogy', data: a, correct: a.correct, options: shuffle(a.options)
        }));
        const compQ = shuffle(completionData).slice(0, 3).map(c => ({
            type: 'completion', data: c, correct: c.correct, options: shuffle(c.options)
        }));
        setQuizSet(shuffle([...vocabQ, ...analogyQ, ...compQ]));
        setQuizIndex(0); setQuizScore(0);
        setView('quiz'); setFeedback(null);
    };

    const handleQuizAnswer = selected => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        if (selected === quizSet[quizIndex].correct) {
            setQuizScore(prev => prev + 1);
            playSound('success');
            triggerAnimation('success-check');
        } else playSound('error');
        setTimeout(() => {
            if (quizIndex < quizSet.length - 1) setQuizIndex(prev => prev + 1);
            else setView('quiz-result');
            isProcessingRef.current = false;
        }, 1200);
    };

    const renderGlossedText = text => {
        const parts = text.split(/(\[\[.*?\]\])/g);
        const typeStyles = { learned: "text-teal-700 border-teal-300", new: "text-cyan-700 border-cyan-300" };
        return parts.map((part, i) => {
            if (part.startsWith('[[') && part.endsWith(']]')) {
                const inner = part.slice(2, -2).split('|');
                const [word, he, pron, type] = inner;
                const styleClass = typeStyles[type] || typeStyles.learned;
                return (
                    <span key={i} className={`relative group font-bold cursor-help inline-block border-b-2 transition-colors hover:bg-slate-50 rounded-sm px-1 ${styleClass}`}>
                        {word}
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-max max-w-[220px] px-3 py-1.5 bg-slate-800 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl flex flex-col items-center text-center" dir="rtl">
                            <span className="font-black text-sm">{he}</span>
                            {pron && <span className="text-cyan-300 text-xs mt-0.5">{pron}</span>}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
                        </span>
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    const checkReadingMC = (qIdx, chosenIdx) => {
        if (readingAnswers[qIdx] !== undefined) return;
        const q = readingData[readingIndex].questions[qIdx];
        const correct = chosenIdx === q.correct;
        setReadingAnswers(prev => ({ ...prev, [qIdx]: { chosenIdx, correct } }));
        playSound(correct ? 'success' : 'error');
    };

    const checkReadingText = qIdx => {
        const q = readingData[readingIndex].questions[qIdx];
        const value = (readingTextInputs[qIdx] || '').trim();
        if (!value) return;
        const correct = q.correctAnswers.some(ans => isFuzzyMatch(value, ans));
        setReadingAnswers(prev => ({ ...prev, [qIdx]: { value, correct } }));
        playSound(correct ? 'success' : 'error');
    };

    const openReading = idx => {
        setReadingIndex(idx); setReadingAnswers({}); setReadingTextInputs({}); setView('reading-detail');
    };

    const NavBtn = ({ icon, label, id, action }) => (
        <button onClick={() => { if (action) action(); else setView(id); }}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm border border-transparent
                ${view === id || (view.startsWith('quiz') && id === 'quiz') || (view.startsWith('reading') && id === 'reading') ? 'bg-teal-500 text-white shadow-md scale-105 border-teal-600' : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200'}`}>
            <span className="text-sm sm:text-base">{icon}</span><span className="hidden sm:inline">{label}</span>
        </button>
    );

    const GradeFilterBtns = () => (
        <div className="flex justify-center gap-2 mb-4">
            {[{ id: 'all', label: 'הכל' }, { id: '7', label: "חזרה כיתה ז'" }, { id: '8', label: "חדש כיתה ח'" }].map(f => (
                <button key={f.id} onClick={() => setGradeFilter(f.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${gradeFilter === f.id ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-white border-cyan-200 text-cyan-700 hover:border-cyan-400'}`}>
                    {f.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-teal-50 text-slate-800 p-4 md:p-8 font-sans" dir="rtl">
            <div className="max-w-5xl mx-auto">

                {activeAnim === 'success-check' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-white/30 backdrop-blur-sm">
                        <dotlottie-wc src="https://lottie.host/21a44f7a-fb9f-4e6e-8ed5-647aa8455b43/jGVlPat0sl.lottie" style={{ width: '300px', height: '300px' }} autoplay></dotlottie-wc>
                    </div>
                )}
                {activeAnim === 'confetti' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-white/30 backdrop-blur-sm">
                        <dotlottie-wc src="https://lottie.host/4c47d84e-6829-4be0-a686-d7a0817a318d/HgXH5VSCYu.lottie" style={{ width: '100vw', height: '100vh' }} autoplay></dotlottie-wc>
                    </div>
                )}

                <header className="text-center mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={resetProgress} className="text-xs bg-white hover:bg-teal-100 text-teal-600 px-3 py-1 rounded-full font-bold shadow-sm">איפוס 🔄</button>
                        <h1 className="text-4xl md:text-5xl font-black text-teal-600 drop-shadow-sm">העולם של קורל 🌊</h1>
                        <div className="w-16" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        <NavBtn icon="🎓" label="למידה" id="learn" />
                        <NavBtn icon="📖" label="ספריה" id="library" />
                        <NavBtn icon="🧩" label="הרכבה" id="builder" action={() => { setView('builder'); setBuilderIndex(Math.floor(Math.random() * builderData.length)); }} />
                        <NavBtn icon="🔗" label="אנלוגיות" id="analogies" action={() => { setView('analogies'); setAnalogyIndex(Math.floor(Math.random() * analogiesData.length)); }} />
                        <NavBtn icon="✍️" label="משפטים" id="completion" action={() => { setView('completion'); setCompIndex(Math.floor(Math.random() * completionData.length)); }} />
                        <NavBtn icon="🧵" label="חצאי משפט" id="halves" action={startHalfSentences} />
                        <NavBtn icon="📚" label="סיפור" id="story" action={() => { setView('story'); setStoryIndex(Math.floor(Math.random() * storiesData.length)); }} />
                        <NavBtn icon="📰" label="קריאה" id="reading" />
                        <NavBtn icon="🃏" label="זוגות" id="match" action={startMatchGame} />
                        <NavBtn icon="🏆" label="בוחן" id="quiz" action={startQuiz} />
                    </div>
                </header>

                {/* Learn */}
                {view === 'learn' && (
                    <div>
                        <GradeFilterBtns />
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-teal-400 text-center relative min-h-[450px] flex flex-col justify-center transition-all">
                            {feedback && (
                                <div className={`absolute top-0 left-0 w-full p-3 rounded-t-[3rem] text-white font-bold ${feedback.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                    {feedback.message}
                                </div>
                            )}
                            <h2 className="text-5xl md:text-6xl font-black text-teal-900 mb-2" dir="ltr">{currentWord.en}</h2>
                            {currentWord.topic && <p className="text-sm text-teal-400 font-bold mb-8">{currentWord.topic} · כיתה {currentWord.grade}</p>}

                            {step === 1 && (
                                <div className="space-y-6">
                                    <button onClick={() => speakText(currentWord.en)}
                                        className="w-24 h-24 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 active:scale-95 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => setStep(2)}
                                        className="mt-8 px-10 py-5 bg-white border-4 border-teal-400 text-teal-600 font-black text-2xl rounded-2xl shadow-xl hover:bg-teal-500 hover:text-white transition-all transform hover:scale-105 block mx-auto w-full max-w-sm">
                                        אני מכירה, נעבור לתרגום ✨
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {options.map((opt, i) => (
                                        <button key={i} onClick={() => checkTranslation(opt.he)}
                                            className="p-6 bg-teal-50 border-2 border-teal-200 rounded-2xl font-bold text-xl text-teal-900 hover:bg-teal-500 hover:text-white transition-all shadow-sm">
                                            {opt.he}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <p className="text-slate-500 font-bold text-lg">עכשיו תורך! אמרי את המילה באנגלית:</p>
                                    <button onClick={handleSpeech}
                                        className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl transition-all relative ${isListening ? 'bg-rose-400 scale-110' : 'bg-teal-500 hover:bg-teal-600'}`}>
                                        {isListening && <span className="absolute inset-0 rounded-full border-4 border-rose-300 animate-ping" />}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="white">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </button>
                                    <p className="font-bold text-slate-400">{isListening ? "💬 אני מקשיב..." : "לחצי על המיקרופון"}</p>
                                </div>
                            )}

                            <div className="w-full bg-teal-100 h-4 rounded-full mt-10 overflow-hidden">
                                <div className="bg-teal-500 h-full transition-all duration-700" style={{ width: `${(masteredIndexes.length / wordsData.length) * 100}%` }} />
                            </div>
                            <p className="text-slate-400 text-sm mt-2 font-bold">{masteredIndexes.length} מתוך {wordsData.length} מילים נלמדו</p>
                        </div>
                    </div>
                )}

                {/* Library */}
                {view === 'library' && (
                    <div>
                        <GradeFilterBtns />
                        <div className="bg-white rounded-[3rem] p-8 shadow-xl border-t-8 border-cyan-300 transition-all">
                            <h2 className="text-3xl font-black text-teal-600 mb-6 text-center">הספריה הגדולה ({pool.length} מילים) 📚</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                                {pool.map((w, idx) => (
                                    <div key={idx} onClick={() => { setActiveWordIndex(idx); setStep(1); setView('learn'); }}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105
                                            ${masteredIndexes.includes(wordKey(w)) ? 'bg-emerald-50 border-emerald-300' : 'bg-teal-50 border-teal-100 hover:border-teal-400'}`}>
                                        <p className="font-black text-lg text-center text-slate-800" dir="ltr">{w.en}</p>
                                        <p className="text-sm text-center text-slate-500 mt-1">{w.he}</p>
                                        {masteredIndexes.includes(wordKey(w)) && <span className="text-emerald-500 text-center block mt-1 font-bold">✓</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Builder */}
                {view === 'builder' && (
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-cyan-400 text-center transition-all">
                        <h2 className="text-3xl font-black text-cyan-700 mb-4">מילים מורכבות 🧩</h2>
                        <p className="text-slate-600 mb-8 font-bold text-lg">{builderData[builderIndex].explanation}</p>
                        <div className="flex justify-center items-center text-2xl md:text-5xl font-black gap-2 mb-8 bg-cyan-50 p-6 rounded-3xl border-2 border-cyan-100 flex-wrap" dir="ltr">
                            <span className="text-cyan-500">
                                {builderData[builderIndex].type === 'prefix' ? builderData[builderIndex].prefix :
                                    builderData[builderIndex].type === 'suffix' ? builderData[builderIndex].root :
                                        builderData[builderIndex].part1}
                            </span>
                            <span className="text-teal-300">+</span>
                            <span className="text-slate-700">
                                {builderData[builderIndex].type === 'prefix' ? builderData[builderIndex].root :
                                    builderData[builderIndex].type === 'suffix' ? builderData[builderIndex].suffix :
                                        builderData[builderIndex].part2}
                            </span>
                            <span className="text-teal-300 mx-2">=</span>
                            <span className="text-cyan-800 underline decoration-cyan-300">{builderData[builderIndex].word}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {builderOptions.map((opt, i) => (
                                <button key={i} onClick={() => {
                                    if (opt.isCorrect) {
                                        playSound('success'); triggerAnimation('success-check');
                                        setTimeout(() => setBuilderIndex(prev => getNextRandom(prev, builderData.length)), 1500);
                                    } else playSound('error');
                                }} className="p-6 bg-cyan-50 border-2 border-cyan-200 rounded-2xl font-bold text-xl text-cyan-900 hover:bg-cyan-500 hover:text-white transition-all shadow-sm">{opt.text}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analogies */}
                {view === 'analogies' && (
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-teal-500 text-center transition-all">
                        <h2 className="text-3xl font-black text-teal-800 mb-8">אנלוגיות - מה הקשר? 🔗</h2>
                        <div className="bg-teal-50 px-6 py-2 rounded-full inline-block mb-8 font-bold text-teal-800 text-lg">{analogiesData[analogyIndex].relation}</div>
                        <div className="flex justify-center items-center gap-4 text-3xl md:text-4xl font-black bg-cyan-50 p-6 rounded-2xl mb-4 border-2 border-cyan-100 w-full max-w-lg mx-auto flex-wrap" dir="ltr">
                            <span className="text-slate-700">{analogiesData[analogyIndex].word1}</span>
                            <span className="text-teal-400">↔️</span>
                            <span className="text-slate-700">{analogiesData[analogyIndex].word2}</span>
                        </div>
                        <div className="text-xl text-slate-400 font-bold mb-4">בדיוק כמו ש...</div>
                        <div className="flex justify-center items-center gap-4 text-3xl md:text-4xl font-black bg-teal-100 p-6 rounded-2xl mb-10 border-4 border-teal-200 w-full max-w-lg mx-auto flex-wrap" dir="ltr">
                            <span className="text-teal-900">{analogiesData[analogyIndex].word3}</span>
                            <span className="text-teal-400">↔️</span>
                            <span className="border-b-4 border-teal-500 text-teal-500 w-16 text-center">?</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {analogyOptions.map((opt, i) => (
                                <button key={i} onClick={() => {
                                    if (opt === analogiesData[analogyIndex].correct) {
                                        playSound('success'); triggerAnimation('success-check');
                                        setTimeout(() => setAnalogyIndex(prev => getNextRandom(prev, analogiesData.length)), 1500);
                                    } else playSound('error');
                                }} className="p-5 bg-white border-2 border-teal-200 rounded-2xl font-black text-xl text-teal-800 hover:bg-teal-500 hover:text-white transition-all shadow-sm" dir="ltr">{opt}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completion */}
                {view === 'completion' && (
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-cyan-500 text-center transition-all">
                        <h2 className="text-3xl font-black text-cyan-800 mb-8">השלמת משפטים ✍️</h2>
                        <div className="bg-cyan-50 p-8 rounded-2xl border-2 border-cyan-200 mb-10 text-2xl font-bold text-slate-800 leading-loose shadow-inner" dir="ltr">
                            {completionData[compIndex].sentence.split('_______')[0]}
                            <span className="inline-block border-b-4 border-cyan-500 text-cyan-600 px-4">?</span>
                            {completionData[compIndex].sentence.split('_______')[1]}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {compOptions.map((opt, i) => (
                                <button key={i} onClick={() => {
                                    if (opt === completionData[compIndex].correct) {
                                        playSound('success'); triggerAnimation('success-check');
                                        setTimeout(() => setCompIndex(prev => getNextRandom(prev, completionData.length)), 1500);
                                    } else playSound('error');
                                }} className="p-6 bg-white border-2 border-cyan-200 rounded-2xl font-black text-xl text-cyan-800 hover:bg-cyan-500 hover:text-white transition-all shadow-sm" dir="ltr">{opt}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Half Sentences */}
                {view === 'halves' && (
                    <div className="bg-white rounded-[3rem] p-8 shadow-xl border-t-8 border-teal-400 text-center transition-all min-h-[500px]">
                        <h2 className="text-3xl font-black text-teal-700 mb-2">חצאי משפטים 🧵</h2>
                        <p className="text-slate-500 font-bold mb-8">לחצי על תחילת משפט, ואז על הסוף המתאים לו</p>
                        {matchedHalfIds.length === halfSentences.starts.length && halfSentences.starts.length > 0 ? (
                            <div className="py-20">
                                <h3 className="text-5xl font-black text-emerald-500 mb-6">כל הכבוד! 🎉</h3>
                                <button onClick={startHalfSentences} className="px-8 py-4 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600">שחקי שוב</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right" dir="ltr">
                                <div className="space-y-3">
                                    {halfSentences.starts.map(item => (
                                        <button key={item.id} onClick={() => handleStartClick(item)} disabled={matchedHalfIds.includes(item.id)}
                                            className={`w-full text-left p-4 rounded-xl font-bold border-2 transition-all
                                                ${matchedHalfIds.includes(item.id) ? 'opacity-30 bg-emerald-50 border-emerald-300' :
                                                    selectedStart?.id === item.id ? 'bg-teal-500 text-white border-teal-600 scale-[1.02]' :
                                                        'bg-teal-50 border-teal-200 hover:border-teal-400'}`}>
                                            {item.start}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {halfSentences.ends.map(item => (
                                        <button key={item.id} onClick={() => handleEndClick(item)} disabled={matchedHalfIds.includes(item.id)}
                                            className={`w-full text-left p-4 rounded-xl font-bold border-2 transition-all
                                                ${matchedHalfIds.includes(item.id) ? 'opacity-30 bg-emerald-50 border-emerald-300' :
                                                    wrongHalfFlash === item.id ? 'bg-rose-200 border-rose-400' :
                                                        'bg-cyan-50 border-cyan-200 hover:border-cyan-400'}`}>
                                            {item.end}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Story */}
                {view === 'story' && (
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-teal-400 relative transition-all">
                        <h2 className="text-4xl font-black text-teal-700 mb-6 text-center">{storiesData[storyIndex].title}</h2>
                        <div className="flex flex-wrap justify-center gap-2 mb-6 text-sm font-bold">
                            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">מילים שלמדנו</span>
                            <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">חדשות — עברי עם העכבר</span>
                        </div>
                        <div className="text-xl md:text-2xl leading-loose text-slate-800 bg-teal-50 p-6 md:p-8 rounded-2xl border-2 border-teal-200 shadow-inner" dir="ltr">
                            {storiesData[storyIndex].content.map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{renderGlossedText(paragraph)}</p>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-8 flex-wrap">
                            <button onClick={() => speakText(storiesData[storyIndex].audio)} className="px-8 py-4 bg-teal-400 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-teal-500 shadow-md transition-colors">
                                🔊 השמע סיפור
                            </button>
                            <button onClick={() => setStoryIndex(prev => getNextRandom(prev, storiesData.length))} className="px-8 py-4 bg-white border-2 border-teal-400 text-teal-600 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-50 shadow-sm transition-colors">
                                🎲 סיפור אחר
                            </button>
                        </div>
                    </div>
                )}

                {/* Reading List */}
                {view === 'reading' && (
                    <div className="bg-white rounded-[3rem] p-8 shadow-xl border-t-8 border-cyan-400 transition-all">
                        <h2 className="text-3xl font-black text-cyan-700 mb-6 text-center">טקסטים לקריאה והבנה 📰</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {readingData.map((r, idx) => (
                                <button key={idx} onClick={() => openReading(idx)}
                                    className="p-6 bg-cyan-50 border-2 border-cyan-200 rounded-2xl font-bold text-xl text-cyan-900 hover:bg-cyan-500 hover:text-white transition-all shadow-sm text-center">
                                    {r.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reading Detail */}
                {view === 'reading-detail' && (
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-cyan-400 transition-all">
                        <button onClick={() => setView('reading')} className="text-cyan-600 font-bold mb-4">→ חזרה לרשימה</button>
                        <h2 className="text-3xl font-black text-cyan-700 mb-6 text-center">{readingData[readingIndex].title}</h2>
                        <div className="text-lg md:text-xl leading-loose text-slate-800 bg-cyan-50 p-6 md:p-8 rounded-2xl border-2 border-cyan-200 shadow-inner mb-8 whitespace-pre-line" dir="ltr">
                            {renderGlossedText(readingData[readingIndex].text)}
                        </div>
                        <div className="space-y-6">
                            {readingData[readingIndex].questions.map((q, qIdx) => {
                                const answered = readingAnswers[qIdx];
                                return (
                                    <div key={qIdx} className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-5">
                                        <p className="font-bold text-lg mb-4" dir="ltr">{qIdx + 1}. {q.q}</p>
                                        {q.type === 'text' ? (
                                            <div className="flex gap-2 flex-wrap items-center" dir="ltr">
                                                <input type="text" disabled={!!answered}
                                                    value={readingTextInputs[qIdx] || ''}
                                                    onChange={e => setReadingTextInputs(prev => ({ ...prev, [qIdx]: e.target.value }))}
                                                    className="flex-1 min-w-[200px] p-3 rounded-xl border-2 border-teal-300 font-bold"
                                                    placeholder="כתבי תשובה באנגלית..." />
                                                <button onClick={() => checkReadingText(qIdx)} disabled={!!answered}
                                                    className="px-5 py-3 bg-teal-500 text-white rounded-xl font-bold disabled:opacity-50">בדקי</button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
                                                {q.options.map((opt, oIdx) => (
                                                    <button key={oIdx} onClick={() => checkReadingMC(qIdx, oIdx)} disabled={!!answered}
                                                        className={`p-3 rounded-xl font-bold border-2 text-right transition-all
                                                            ${answered && oIdx === q.correct ? 'bg-emerald-100 border-emerald-400' :
                                                                answered && oIdx === answered.chosenIdx ? 'bg-rose-100 border-rose-400' :
                                                                    'bg-white border-teal-200 hover:border-teal-400'}`}>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {answered && (
                                            <p className={`mt-3 font-bold ${answered.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {answered.correct ? '✔️ נכון!' : '✗ לא נכון, בדקי שוב את הטקסט.'}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Match */}
                {view === 'match' && (
                    <div className="bg-white rounded-[3rem] p-8 shadow-xl border-t-8 border-cyan-400 text-center transition-all min-h-[500px]">
                        <h2 className="text-3xl font-black text-cyan-700 mb-2">זוגות - מצאי את ההתאמה 🃏</h2>
                        <p className="text-slate-500 font-bold mb-8">לחצי על קלף אנגלית והפירוש שלו בעברית</p>
                        {matchedPairs.length === 6 ? (
                            <div className="py-20">
                                <h3 className="text-5xl font-black text-emerald-500 mb-6">ניצחון! 🎉</h3>
                                <button onClick={startMatchGame} className="px-8 py-4 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-600">שחקי שוב</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                {matchCards.map((card, i) => {
                                    const isFlipped = flippedCards.some(c => c.id === card.id);
                                    const isMatched = matchedPairs.includes(card.pairId);
                                    return (
                                        <button key={i} onClick={() => handleCardClick(card)} disabled={isFlipped || isMatched}
                                            className={`h-24 md:h-32 rounded-2xl font-black text-lg md:text-xl transition-all shadow-md flex items-center justify-center border-4 ${isMatched ? 'opacity-0 scale-95 cursor-default bg-emerald-100 border-emerald-300' : isFlipped ? 'bg-teal-100 border-teal-400 text-teal-900 scale-105' : 'bg-cyan-50 border-cyan-200 text-cyan-900 hover:bg-cyan-100'}`}
                                            dir={card.type === 'en' ? 'ltr' : 'rtl'}>
                                            {card.text}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Quiz */}
                {view === 'quiz' && quizSet.length > 0 && (
                    <div className="bg-white rounded-[3rem] p-8 shadow-xl border-t-8 border-teal-500 text-center transition-all">
                        <h2 className="text-xl font-bold text-teal-700 mb-8">שאלה {quizIndex + 1} מתוך {quizSet.length}</h2>
                        {quizSet[quizIndex].type === 'vocab' && (
                            <h3 className="text-6xl font-black text-slate-900 mb-10" dir="ltr">{quizSet[quizIndex].question}</h3>
                        )}
                        {quizSet[quizIndex].type === 'analogy' && (
                            <div className="mb-10 flex flex-col items-center gap-4">
                                <div className="text-3xl font-black bg-slate-50 p-4 rounded-xl border-2 border-slate-200 w-full max-w-sm flex justify-center gap-4" dir="ltr">
                                    <span>{quizSet[quizIndex].data.word1}</span> ↔️ <span>{quizSet[quizIndex].data.word2}</span>
                                </div>
                                <div className="text-3xl font-black text-teal-700 bg-teal-50 p-4 rounded-xl border-2 border-teal-200 w-full max-w-sm flex justify-center gap-4" dir="ltr">
                                    <span>{quizSet[quizIndex].data.word3}</span> ↔️ <span className="border-b-4 border-teal-400 min-w-[50px]">?</span>
                                </div>
                            </div>
                        )}
                        {quizSet[quizIndex].type === 'completion' && (
                            <div className="mb-10 text-2xl font-bold bg-teal-50 p-6 rounded-2xl border-2 border-teal-200" dir="ltr">
                                {quizSet[quizIndex].data.sentence.split('_______')[0]}
                                <span className="border-b-4 border-teal-500 px-4">?</span>
                                {quizSet[quizIndex].data.sentence.split('_______')[1]}
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quizSet[quizIndex].options.map((opt, i) => (
                                <button key={i} onClick={() => handleQuizAnswer(opt)}
                                    className="p-5 bg-teal-50 border-2 border-teal-100 rounded-2xl font-bold text-xl text-teal-900 hover:bg-teal-500 hover:text-white transition-all shadow-sm">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'quiz-result' && (
                    <div className="bg-white rounded-[3rem] p-12 shadow-xl border-t-8 border-teal-500 text-center transition-all min-h-[400px] flex flex-col justify-center">
                        <h2 className="text-4xl font-black text-teal-900 mb-4">כל הכבוד! 🏆</h2>
                        <p className="text-2xl mb-4">הציון שלך:</p>
                        <div className="text-8xl font-black text-teal-600 mb-8">{Math.round((quizScore / quizSet.length) * 100)}%</div>
                        <button onClick={() => setView('learn')} className="px-8 py-4 bg-teal-500 text-white rounded-2xl font-bold text-xl hover:bg-teal-600 transition-colors mx-auto">המשך למידה</button>
                    </div>
                )}

            </div>
        </div>
    );
}

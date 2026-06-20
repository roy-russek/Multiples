const { useState, useEffect, useCallback, useRef } = React;

const CONFETTI_COLORS = ['#f87171','#fb923c','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6'];

function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) { setPieces([]); return; }
    const items = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.8,
      size: 8 + Math.random() * 12,
    }));
    setPieces(items);
    const t = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    React.createElement(React.Fragment, null,
      pieces.map(p => (
        React.createElement("div", {
          key: p.id,
          className: "confetti-piece",
          style: {
            left: `${p.left}%`,
            top: '-20px',
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }
        })
      ))
    )
  );
}

function StarBurst() {
  return (
    React.createElement("div", { className: "flex justify-center gap-3 my-2" },
      ['⭐','🌟','⭐'].map((s, i) => (
        React.createElement("span", {
          key: i,
          className: "text-4xl anim-star",
          style: { animationDelay: `${i * 0.15}s`, display: 'inline-block' }
        }, s)
      ))
    )
  );
}

function randomInt() {
  return Math.floor(Math.random() * 11);
}

function MultiplicationGame() {
  const [a, setA]                     = useState(randomInt);
  const [b, setB]                     = useState(randomInt);
  const [phase, setPhase]             = useState('question');
  const [score, setScore]             = useState(0);
  const [totalRounds, setTotal]       = useState(0);
  const [input, setInput]             = useState('');
  const [numAnim, setNumAnim]         = useState('');
  const [confettiKey, setConfettiKey] = useState(0);
  const inputRef                      = useRef(null);

  const correct = a * b;

  useEffect(() => {
    if (phase === 'question' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, a, b]);

  const nextQuestion = useCallback(() => {
    setA(randomInt());
    setB(randomInt());
    setInput('');
    setPhase('question');
    setNumAnim('anim-bounce');
    setTimeout(() => setNumAnim(''), 700);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed === '') return;
    const guess = parseInt(trimmed, 10);
    setTotal(t => t + 1);
    if (guess === correct) {
      setScore(s => s + 1);
      setPhase('correct');
      setConfettiKey(k => k + 1);
    } else {
      setPhase('wrong');
    }
  }, [input, correct]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  return (
    React.createElement("div", {
      className: "min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500",
      style: {
        background: phase === 'correct'
          ? 'linear-gradient(135deg, #d1fae5, #a7f3d0, #6ee7b7)'
          : phase === 'wrong'
          ? 'linear-gradient(135deg, #fff3e0, #ffe0b2, #ffcc80)'
          : 'linear-gradient(135deg, #e0e7ff, #ddd6fe, #fbcfe8)',
      }
    },
      React.createElement(Confetti, { active: phase === 'correct', key: confettiKey }),
      
      React.createElement("div", { className: "w-full max-w-md mb-6 flex items-center justify-between" },
        React.createElement("div", { className: "score-badge text-white px-5 py-2 rounded-2xl text-center" },
          React.createElement("div", { className: "text-xs font-bold opacity-80" }, "נכון"),
          React.createElement("div", { className: "text-2xl font-black" }, score)
        ),
        React.createElement("h1", { className: "text-2xl font-black text-indigo-700 text-center drop-shadow" }, "✖️ לוח הכפל"),
        React.createElement("div", { className: "bg-white/70 text-indigo-500 px-5 py-2 rounded-2xl text-center shadow" },
          React.createElement("div", { className: "text-xs font-bold opacity-70" }, "סה\"כ"),
          React.createElement("div", { className: "text-2xl font-black" }, totalRounds)
        )
      ),

      React.createElement("div", { className: `number-card rounded-3xl w-64 h-40 flex items-center justify-center mb-8 ${numAnim}` },
        React.createElement("span", { className: "text-6xl font-black text-indigo-700 select-none tracking-wide" }, `${a} × ${b}`)
      ),

      phase === 'question' && React.createElement("div", { className: "flex flex-col items-center gap-5 w-full max-w-sm" },
        React.createElement("p", { className: "text-xl font-bold text-indigo-800 text-center" },
          "כמה זה ", React.createElement("span", { className: "text-3xl font-black" }, `${a} כפול ${b}`), "?"
        ),
        React.createElement("input", {
          ref: inputRef,
          type: "number",
          min: "0",
          max: "100",
          value: input,
          onChange: e => setInput(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: "?",
          className: "answer-input w-40 h-24 text-6xl font-black text-indigo-700 rounded-3xl bg-white"
        }),
        React.createElement("button", {
          onClick: handleSubmit,
          disabled: input.trim() === '',
          className: "btn-submit text-white text-2xl font-black py-4 px-12 rounded-3xl disabled:opacity-40 disabled:cursor-not-allowed"
        }, "תשובה ✓")
      ),

      phase === 'correct' && React.createElement("div", { className: "flex flex-col items-center gap-4 anim-bounce w-full max-w-sm" },
        React.createElement(StarBurst, null),
        React.createElement("img", {
          src: "./Happy.png",
          alt: "Happy",
          className: "w-44 h-44 object-contain anim-float drop-shadow-lg"
        }),
        React.createElement("p", { className: "text-3xl font-black text-green-700 text-center drop-shadow" }, "כל הכבוד! צדקת! 🎉"),
        React.createElement("p", { className: "text-lg font-bold text-green-600 text-center" },
          `${a} × ${b} = `, React.createElement("span", { className: "text-2xl font-black" }, correct)
        ),
        React.createElement("button", {
          onClick: nextQuestion,
          className: "btn-next text-white text-2xl font-black py-4 px-10 rounded-3xl mt-2"
        }, "תרגיל הבא ←")
      ),

      phase === 'wrong' && React.createElement("div", { className: "flex flex-col items-center gap-4 anim-shake w-full max-w-sm" },
        React.createElement("img", {
          src: "./Sad.png",
          alt: "Sad",
          className: "w-44 h-44 object-contain drop-shadow-lg"
        }),
        React.createElement("p", { className: "text-3xl font-black text-orange-700 text-center" }, "אופס, לא נורא! 💪"),
        React.createElement("p", { className: "text-lg font-bold text-orange-600 text-center" },
          "התשובה הנכונה היא ", React.createElement("span", { className: "text-2xl font-black" }, `${a} × ${b} = ${correct}`)
        ),
        React.createElement("button", {
          onClick: nextQuestion,
          className: "btn-next text-white text-2xl font-black py-4 px-10 rounded-3xl mt-2"
        }, "תרגיל הבא ←")
      ),

      phase === 'question' && React.createElement("div", { className: "mt-8 bg-white/60 backdrop-blur rounded-2xl px-6 py-3 text-center shadow" },
        React.createElement("p", { className: "text-sm font-bold text-indigo-500" },
          "💡 ", React.createElement("strong", null, "טיפ:"), " הקלד את התשובה ולחץ Enter או על כפתור \"תשובה\""
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(MultiplicationGame, null));
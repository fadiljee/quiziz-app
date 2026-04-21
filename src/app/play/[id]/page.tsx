'use client'

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

export default function PlayQuiz({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const participantId = searchParams.get('participantId');

  const [questions, setQuestions] = useState<any[]>([]);
  const [status, setStatus] = useState('waiting');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      const { data: sess } = await supabase.from('game_sessions').select('*').eq('id', id).single();
      if (sess) {
        setStatus(sess.status);
        const { data: qData } = await supabase.from('questions').select('*').eq('quiz_id', sess.quiz_id);
        if (qData && qData.length > 0) {
          setQuestions(qData);
          const totalSeconds = qData.reduce((sum, q) => sum + (q.time_limit || 20), 0);
          setTimeLeft(totalSeconds);
        }
      }
    };
    fetchInitial();

    const channel = supabase.channel('public:game_sessions')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${id}` }, (payload) => {
        setStatus(payload.new.status);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  useEffect(() => {
    if (status === 'playing' && timeLeft !== null && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(prev => (prev! > 0 ? prev! - 1 : 0)), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      setIsFinished(true);
    }
  }, [status, timeLeft, isFinished]);

  const handleAnswer = (option: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedOption(option);

    const currentQ = questions[currentIndex];
    const correct = option === currentQ.correct_answer;
    setIsCorrect(correct);

    let currentScore = score;
    if (correct) {
      currentScore += (currentQ.points || 10);
      setScore(currentScore);
      if (participantId) {
        supabase.from('participants').update({ score: currentScore }).eq('id', participantId).then();
      }
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      } else {
        setIsFinished(true);
      }
    }, 600);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionColors = [
    { bg: 'rgba(227,0,27,.12)', border: 'rgba(227,0,27,.35)', text: '#FF4D5E', badgeBg: '#E3001B' },
    { bg: 'rgba(59,130,246,.12)', border: 'rgba(59,130,246,.35)', text: '#93C5FD', badgeBg: '#3B82F6' },
    { bg: 'rgba(245,158,11,.12)', border: 'rgba(245,158,11,.35)', text: '#FCD34D', badgeBg: '#F59E0B' },
    { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.35)', text: '#34D399', badgeBg: '#10B981' },
  ];


  if (status === 'waiting') {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800;900&family=DM+Sans:wght@400;500&display=swap');
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          .wait-page{
            min-height:100vh;background:#0B0B14;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            padding:24px;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;
            position:relative;overflow:hidden;
          }
          .wait-glow{
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            width:600px;height:600px;
            background:radial-gradient(circle,rgba(227,0,27,.08) 0%,transparent 65%);
            pointer-events:none;
          }
          .wait-grid{
            position:fixed;inset:0;
            background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
            background-size:48px 48px;pointer-events:none;
          }
          .wait-inner{position:relative;z-index:5;animation:fadeIn .5s ease both;}
          .wait-spinner-wrap{
            width:72px;height:72px;margin:0 auto 32px;
            position:relative;
          }
          .wait-ring{
            width:72px;height:72px;
            border:4px solid rgba(227,0,27,.2);
            border-top-color:#E3001B;
            border-radius:50%;
            animation:spin 1s linear infinite;
            position:absolute;top:0;left:0;
          }
          .wait-ring-2{
            width:56px;height:56px;
            border:3px solid rgba(255,255,255,.06);
            border-bottom-color:rgba(255,255,255,.2);
            border-radius:50%;
            animation:spin .7s linear infinite reverse;
            position:absolute;top:8px;left:8px;
          }
          .wait-icon{
            position:absolute;top:50%;left:50%;
            transform:translate(-50%,-50%);
            font-size:22px;
            animation:floatUp 2s ease-in-out infinite;
          }
          .wait-title{font-size:clamp(28px,6vw,48px);font-weight:900;color:#fff;letter-spacing:-.03em;margin-bottom:12px;}
          .wait-subtitle{font-family:'DM Sans',sans-serif;font-size:16px;color:rgba(255,255,255,.4);margin-bottom:32px;}
          .wait-badge{
            display:inline-flex;align-items:center;gap:8px;
            background:rgba(227,0,27,.1);border:1px solid rgba(227,0,27,.25);
            color:#FF4D5E;font-size:12px;font-weight:700;
            padding:8px 18px;border-radius:100px;letter-spacing:.06em;text-transform:uppercase;
          }
          .wait-badge-dot{width:7px;height:7px;background:#E3001B;border-radius:50%;animation:pulse 2s ease-in-out infinite;}
          @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        `}</style>
        <div className="wait-page">
          <div className="wait-glow"/><div className="wait-grid"/>
          <div className="wait-inner">
            <div className="wait-spinner-wrap">
              <div className="wait-ring"/><div className="wait-ring-2"/>
              <div className="wait-icon">🎯</div>
            </div>
            <h1 className="wait-title">Bersiaplah!</h1>
            <p className="wait-subtitle">Menunggu pengawas memulai sesi tes…</p>
            <div className="wait-badge">
              <span className="wait-badge-dot"/>
              Sesi Telkom Akses
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isFinished) {
    const pct = questions.length > 0
      ? Math.round((score / questions.reduce((s, q) => s + (q.points || 10), 0)) * 100)
      : 0;

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800;900&family=DM+Sans:wght@400;500&display=swap');
          @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
          @keyframes scaleIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          .fin-page{
            min-height:100vh;background:#0B0B14;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            padding:24px;font-family:'Plus Jakarta Sans',sans-serif;position:relative;overflow:hidden;
          }
          .fin-glow{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%);pointer-events:none;}
          .fin-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}
          .fin-inner{position:relative;z-index:5;text-align:center;max-width:400px;width:100%;}
          .fin-emoji{font-size:56px;margin-bottom:20px;animation:scaleIn .5s cubic-bezier(.34,1.56,.64,1) both;}
          .fin-title{font-size:clamp(28px,6vw,44px);font-weight:900;color:#fff;letter-spacing:-.03em;margin-bottom:8px;animation:fadeUp .4s .1s ease both;}
          .fin-sub{font-family:'DM Sans',sans-serif;font-size:15px;color:rgba(255,255,255,.4);margin-bottom:32px;animation:fadeUp .4s .15s ease both;}
          .fin-card{
            background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);
            border-radius:20px;padding:28px;margin-bottom:16px;
            position:relative;overflow:hidden;
            animation:fadeUp .4s .2s ease both;
          }
          .fin-card::before{
            content:'';position:absolute;top:0;left:0;right:0;height:3px;
            background:linear-gradient(90deg,#10B981,#34D399,#10B981);
            background-size:200% 100%;animation:shimmer 2.5s linear infinite;
          }
          .fin-score-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;}
          .fin-score{font-size:64px;font-weight:900;color:#34D399;letter-spacing:-.04em;line-height:1;}
          .fin-pct{
            margin-top:16px;display:flex;align-items:center;justify-content:center;gap:8px;
            font-size:13px;font-weight:700;color:rgba(255,255,255,.4);
          }
          .fin-pct-bar{
            flex:1;height:6px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden;
          }
          .fin-pct-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#10B981,#34D399);transition:width 1s ease;}
          .fin-note{font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,.2);animation:fadeUp .4s .3s ease both;}
        `}</style>
        <div className="fin-page">
          <div className="fin-glow"/><div className="fin-grid"/>
          <div className="fin-inner">
            <div className="fin-emoji">{timeLeft === 0 ? '⏰' : '🏁'}</div>
            <h1 className="fin-title">{timeLeft === 0 ? 'Waktu Habis!' : 'Tes Selesai!'}</h1>
            <p className="fin-sub">Kerja bagus! Kamu telah menyelesaikan semua soal.</p>
            <div className="fin-card">
              <p className="fin-score-label">Skor Akhir</p>
              <div className="fin-score">{score}</div>
              <div className="fin-pct">
                <span>{pct}%</span>
                <div className="fin-pct-bar">
                  <div className="fin-pct-fill" style={{width:`${pct}%`}}/>
                </div>
              </div>
            </div>
            <p className="fin-note">Lihat layar proyektor untuk melihat klasemen peringkat.</p>
          </div>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════
     VIEW 3: PLAYING
  ═══════════════════════════════ */
  if (status === 'playing' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const optionsList = Array.isArray(currentQ.options) ? currentQ.options : JSON.parse(currentQ.options || "[]");
    const progress = ((currentIndex) / questions.length) * 100;
    const isLow = timeLeft !== null && timeLeft < 30;

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=DM+Sans:wght@400;500&display=swap');
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
          @keyframes optIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
          @keyframes correctPop{0%{transform:scale(1)}40%{transform:scale(1.04)}100%{transform:scale(1)}}
          @keyframes wrongShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

          *{box-sizing:border-box;}

          .play-page{
            min-height:100vh;
            background:#0B0B14;
            display:flex;flex-direction:column;
            font-family:'Plus Jakarta Sans',sans-serif;
            position:relative;overflow:hidden;
          }
          .play-glow{
            position:fixed;top:-200px;right:-200px;width:500px;height:500px;
            background:radial-gradient(circle,rgba(227,0,27,.07) 0%,transparent 65%);
            pointer-events:none;
          }

          /* ─── Top Bar ─── */
          .play-topbar{
            position:relative;z-index:10;
            display:flex;align-items:center;justify-content:space-between;
            padding:14px 18px;
            background:rgba(11,11,20,.85);backdrop-filter:blur(16px);
            border-bottom:1px solid rgba(255,255,255,.06);
            gap:12px;
          }
          @media(min-width:640px){.play-topbar{padding:16px 28px;}}

          .play-logo{display:flex;align-items:center;gap:10px;}
          .play-logo svg{height:24px;width:auto;}
          @media(min-width:640px){.play-logo svg{height:28px;}}
          .play-logo-div{width:1px;height:18px;background:rgba(255,255,255,.1);}
          .play-logo-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;}

          .play-progress-row{display:flex;align-items:center;gap:10px;flex:1;justify-content:center;}
          .play-q-counter{
            font-size:12px;font-weight:800;color:rgba(255,255,255,.55);
            white-space:nowrap;
          }
          .play-progress-bar{
            width:80px;height:5px;background:rgba(255,255,255,.08);border-radius:100px;overflow:hidden;
          }
          @media(min-width:480px){.play-progress-bar{width:120px;}}
          @media(min-width:640px){.play-progress-bar{width:160px;}}
          .play-progress-fill{
            height:100%;border-radius:100px;
            background:linear-gradient(90deg,#E3001B,#FF6B35);
            transition:width .4s ease;
          }

          .play-timer{
            display:inline-flex;align-items:center;gap:6px;
            font-size:14px;font-weight:900;
            padding:6px 14px;border-radius:100px;
            transition:all .3s;white-space:nowrap;letter-spacing:.02em;
          }
          .play-timer.normal{
            background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
            color:rgba(255,255,255,.7);
          }
          .play-timer.low{
            background:rgba(227,0,27,.15);border:1px solid rgba(227,0,27,.35);
            color:#FF4D5E;animation:pulse 1s ease-in-out infinite;
          }

          /* ─── Main Content ─── */
          .play-content{
            position:relative;z-index:5;
            flex:1;display:flex;flex-direction:column;
            padding:20px 18px 24px;
            gap:18px;
            max-width:800px;width:100%;margin:0 auto;
          }
          @media(min-width:640px){.play-content{padding:28px 28px 32px;gap:22px;}}

          /* Question card */
          .play-question-card{
            background:rgba(255,255,255,.04);
            border:1px solid rgba(255,255,255,.08);
            border-radius:20px;
            padding:24px 22px;
            text-align:center;
            display:flex;align-items:center;justify-content:center;
            min-height:140px;
            animation:slideUp .35s ease both;
          }
          @media(min-width:640px){.play-question-card{padding:32px 36px;min-height:180px;border-radius:24px;}}

          .play-question-text{
            font-size:clamp(18px,3.5vw,26px);
            font-weight:800;color:#fff;
            line-height:1.4;letter-spacing:-.02em;
          }

          /* Options grid */
          .play-options{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
          }
          @media(min-width:640px){.play-options{gap:14px;}}

          .play-option{
            display:flex;align-items:center;gap:12px;
            padding:14px 16px;
            border-radius:16px;
            border:1.5px solid;
            cursor:pointer;
            transition:all .2s ease;
            text-align:left;
            animation:optIn .35s ease both;
            -webkit-tap-highlight-color:transparent;
            position:relative;overflow:hidden;
          }
          .play-option::after{
            content:'';position:absolute;inset:0;
            background:linear-gradient(135deg,rgba(255,255,255,.06),transparent);
            pointer-events:none;
          }
          @media(min-width:640px){.play-option{padding:18px 20px;border-radius:18px;}}

          .play-option:hover:not(:disabled){
            transform:translateY(-3px);
            box-shadow:0 8px 24px rgba(0,0,0,.3);
            filter:brightness(1.1);
          }
          .play-option:active:not(:disabled){transform:translateY(0);}
          .play-option:disabled{cursor:not-allowed;}

          .play-option.selected-correct{animation:correctPop .4s ease both;}
          .play-option.selected-wrong{animation:wrongShake .3s ease both;}

          .play-option-letter{
            width:32px;height:32px;
            border-radius:9px;
            display:flex;align-items:center;justify-content:center;
            font-size:13px;font-weight:900;color:#fff;
            flex-shrink:0;
          }
          @media(min-width:640px){.play-option-letter{width:36px;height:36px;font-size:14px;}}

          .play-option-text{
            font-size:14px;font-weight:700;color:#fff;
            line-height:1.35;word-break:break-word;
          }
          @media(min-width:640px){.play-option-text{font-size:16px;}}

          /* Stagger */
          .play-option:nth-child(1){animation-delay:.05s;}
          .play-option:nth-child(2){animation-delay:.10s;}
          .play-option:nth-child(3){animation-delay:.15s;}
          .play-option:nth-child(4){animation-delay:.20s;}

          /* Score pill */
          .play-score{
            text-align:center;
            display:flex;align-items:center;justify-content:center;gap:8px;
          }
          .score-pill{
            display:inline-flex;align-items:center;gap:6px;
            background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);
            color:#34D399;font-size:12px;font-weight:800;
            padding:6px 16px;border-radius:100px;letter-spacing:.01em;
          }
        `}</style>

        <div className="play-page">
          <div className="play-glow"/>

          {/* Top Bar */}
          <div className="play-topbar">
            <div className="play-logo">
              <svg viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C29.5 44 34.5 41.8 38.1 38.1L32.3 32.3C30.1 34.5 27.2 36 24 36C17.4 36 12 30.6 12 24C12 17.4 17.4 12 24 12C30.6 12 36 17.4 36 24C36 25.5 35.7 26.9 35.2 28.2L43 28.2C43.6 26.9 44 25.5 44 24C44 13 35 4 24 4Z" fill="#E3001B"/>
                <path d="M36 24C36 30.6 30.6 36 24 36L24 44C35 44 44 35 44 24L36 24Z" fill="#CC0017" opacity="0.7"/>
                <text x="52" y="31" fontFamily="Arial" fontSize="18" fontWeight="900" fill="#FFFFFF" letterSpacing="0.5">TELKOM</text>
                <text x="53" y="42" fontFamily="Arial" fontSize="9" fontWeight="500" fill="rgba(255,255,255,0.5)" letterSpacing="2">INDONESIA</text>
              </svg>
              <div className="play-logo-div"/>
              <span className="play-logo-label">Tes Akses</span>
            </div>

            <div className="play-progress-row">
              <span className="play-q-counter">{currentIndex + 1}/{questions.length}</span>
              <div className="play-progress-bar">
                <div className="play-progress-fill" style={{width:`${progress}%`}}/>
              </div>
            </div>

            <div className={`play-timer ${isLow ? 'low' : 'normal'}`}>
              {isLow ? '⚠️' : '⏱'} {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
            </div>
          </div>

          {/* Content */}
          <div className="play-content">

            {/* Question */}
            <div className="play-question-card" key={currentIndex}>
              <p className="play-question-text">{currentQ.question_text}</p>
            </div>

            {/* Options */}
            <div className="play-options" key={`opts-${currentIndex}`}>
              {optionsList.map((opt: string, i: number) => {
                const col = optionColors[i % 4];
                const isSelected = selectedOption === opt;
                const isAnswerCorrect = isSelected && isCorrect === true;
                const isAnswerWrong = isSelected && isCorrect === false;

                let borderColor = col.border;
                let bgColor = col.bg;
                if (isAnswerCorrect) { borderColor = 'rgba(16,185,129,.6)'; bgColor = 'rgba(16,185,129,.2)'; }
                if (isAnswerWrong)   { borderColor = 'rgba(227,0,27,.6)';   bgColor = 'rgba(227,0,27,.2)'; }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={isTransitioning}
                    className={`play-option ${isAnswerCorrect ? 'selected-correct' : ''} ${isAnswerWrong ? 'selected-wrong' : ''}`}
                    style={{background: bgColor, borderColor}}
                  >
                    <span
                      className="play-option-letter"
                      style={{background: isAnswerCorrect ? '#10B981' : isAnswerWrong ? '#E3001B' : col.badgeBg}}
                    >
                      {isAnswerCorrect ? '✓' : isAnswerWrong ? '✕' : optionLabels[i]}
                    </span>
                    <span className="play-option-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Score */}
            <div className="play-score">
              <div className="score-pill">
                🏆 Skor: {score}
              </div>
            </div>

          </div>
        </div>
      </>
    );
  }

  return null;
}
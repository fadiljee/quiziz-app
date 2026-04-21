import { supabase } from "@/lib/supabase";
import Link from "next/link";
import QuestionActions from "./QuestionActions";

export const dynamic = 'force-dynamic';

export default async function QuizDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: quiz, error: quizError } = await supabase.from('quizzes').select('*').eq('id', id).single();
  const { data: questions, error: qError } = await supabase.from('questions').select('*').eq('quiz_id', id);

  if (qError) console.error("Error narik soal:", qError);

  if (quizError || !quiz) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;900&display=swap');
          .error-screen {
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            min-height:60vh;gap:12px;font-family:'Plus Jakarta Sans',sans-serif;
            padding: 24px;
          }
          .error-icon{font-size:40px;opacity:.4;}
          .error-title{font-size:20px;font-weight:900;color:#fff;letter-spacing:-.02em;text-align:center;}
          .error-sub{font-size:14px;color:rgba(255,255,255,.3);text-align:center;}
        `}</style>
        <div className="error-screen">
          <div className="error-icon">❌</div>
          <h2 className="error-title">Kuis tidak ditemukan.</h2>
          <p className="error-sub">Pastikan ID kuis benar.</p>
          <Link href="/dashboard" style={{marginTop:8,fontSize:13,fontWeight:700,color:'#FF4D5E',textDecoration:'none'}}>← Kembali ke Dashboard</Link>
        </div>
      </>
    );
  }

  const totalPoints = questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        /* ─── Page entrance animations ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes slideInCard {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .qd-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeIn .4s ease both;
        }

        /* ─── Quiz Header Card ─── */
        .quiz-header-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 24px 20px 20px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          animation: fadeUp .4s ease both;
        }
        @media (min-width: 640px) {
          .quiz-header-card { padding: 28px 28px 24px; }
        }
        .quiz-header-card::before {
          content:'';
          position:absolute;top:0;left:0;right:0;height:3px;
          background: linear-gradient(90deg, #E3001B, #FF6B35, #E3001B);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        .quiz-header-top {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 18px;
        }
        @media (min-width: 640px) {
          .quiz-header-top {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 20px;
          }
        }

        .quiz-header-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quiz-title {
          font-size: 20px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.025em;
          margin-bottom: 6px;
          line-height: 1.2;
        }
        @media (min-width: 640px) { .quiz-title { font-size: 22px; } }

        .quiz-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,.38);
          line-height: 1.6;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.5);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 9px;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
          letter-spacing: .01em;
          flex-shrink: 0;
        }
        .back-btn:hover {
          color: rgba(255,255,255,.8);
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.15);
          transform: translateX(-2px);
        }

        .edit-quiz-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(59,130,246,.1);
          border: 1px solid rgba(59,130,246,.25);
          color: #93C5FD;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 9px;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
          letter-spacing: .01em;
          flex-shrink: 0;
        }
        .edit-quiz-btn:hover {
          background: rgba(59,130,246,.18);
          border-color: rgba(59,130,246,.4);
          transform: translateY(-1px);
        }

        .quiz-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .qbadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 9px;
          letter-spacing: .01em;
        }
        @media (min-width: 640px) {
          .qbadge { font-size: 12px; padding: 7px 14px; }
        }
        .qbadge-purple {
          background: rgba(139,92,246,.1);
          border: 1px solid rgba(139,92,246,.25);
          color: #A78BFA;
        }
        .qbadge-green {
          background: rgba(16,185,129,.1);
          border: 1px solid rgba(16,185,129,.25);
          color: #34D399;
        }

        /* ─── Section header ─── */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          gap: 12px;
          flex-wrap: wrap;
          animation: fadeUp .4s .1s ease both;
        }
        .section-title {
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -.015em;
        }
        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #E3001B, #CC0017);
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 800;
          padding: 8px 16px;
          border-radius: 9px;
          text-decoration: none;
          transition: all 0.25s ease;
          letter-spacing: .01em;
          position: relative;
          overflow: hidden;
        }
        .add-btn::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent);
          pointer-events:none;
        }
        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(227,0,27,.38);
        }
        .add-btn:active { transform: translateY(0); }

        /* ─── Question cards ─── */
        .question-list { display: flex; flex-direction: column; gap: 12px; }

        .question-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 18px 16px;
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          animation: slideInCard .4s ease both;
        }
        @media (min-width: 640px) { .question-card { padding: 20px 22px; } }

        .question-card:hover {
          border-color: rgba(255,255,255,0.13);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
        }

        .question-top {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }
        @media (min-width: 480px) {
          .question-top {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
          }
        }

        .question-top-left {
          display: flex;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .question-top-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .question-num {
          width: 26px; height: 26px;
          background: rgba(227,0,27,.12);
          border: 1px solid rgba(227,0,27,.25);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #FF4D5E;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .question-text {
          flex: 1;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          line-height: 1.55;
          letter-spacing: -.01em;
          min-width: 0;
          word-break: break-word;
        }
        @media (min-width: 640px) { .question-text { font-size: 15px; } }

        .question-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .points-badge {
          background: rgba(234,179,8,.1);
          border: 1px solid rgba(234,179,8,.25);
          color: #FCD34D;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 9px;
          border-radius: 7px;
          white-space: nowrap;
          letter-spacing: .01em;
        }
        .time-badge {
          background: rgba(99,102,241,.1);
          border: 1px solid rgba(99,102,241,.22);
          color: #A5B4FC;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 7px;
          white-space: nowrap;
          letter-spacing: .01em;
        }

        /* Options */
        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 7px;
        }
        @media (min-width: 520px) { .options-grid { grid-template-columns: 1fr 1fr; } }

        .option-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          transition: border-color .2s, background .2s;
        }
        .option-item.correct {
          border-color: rgba(16,185,129,.4);
          background: rgba(16,185,129,.07);
        }
        .option-item:not(.correct):hover {
          border-color: rgba(255,255,255,.12);
          background: rgba(255,255,255,.04);
        }

        .option-letter {
          width: 24px; height: 24px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
        }
        .option-letter.normal { background: rgba(255,255,255,0.06); color: rgba(255,255,255,.4); }
        .option-letter.correct-letter { background: #10B981; color: #fff; }
        .option-text {
          font-size: 12px;
          font-weight: 500;
          flex: 1;
          line-height: 1.4;
          min-width: 0;
          word-break: break-word;
        }
        @media (min-width: 640px) { .option-text { font-size: 13px; } }
        .option-text.correct-text { font-weight: 700; color: #34D399; }
        .option-text.normal-text { color: rgba(255,255,255,.5); }
        .correct-check {
          margin-left: auto;
          font-size: 10px;
          font-weight: 800;
          color: #34D399;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 48px 20px;
          background: rgba(255,255,255,0.02);
          border: 1.5px dashed rgba(255,255,255,0.08);
          border-radius: 16px;
          animation: fadeUp .4s .15s ease both;
        }
        .empty-icon { font-size: 38px; margin-bottom: 12px; opacity: .35; }
        .empty-title {
          font-size: 16px;
          font-weight: 800;
          color: rgba(255,255,255,.5);
          margin-bottom: 6px;
          letter-spacing: -.01em;
        }
        .empty-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,.23);
          margin-bottom: 22px;
        }
        .empty-cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #E3001B, #CC0017);
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          padding: 10px 22px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .empty-cta::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent);
          pointer-events:none;
        }
        .empty-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(227,0,27,.4);
        }

        /* Stagger animation for question cards */
        .question-card:nth-child(1)  { animation-delay: .10s; }
        .question-card:nth-child(2)  { animation-delay: .15s; }
        .question-card:nth-child(3)  { animation-delay: .20s; }
        .question-card:nth-child(4)  { animation-delay: .25s; }
        .question-card:nth-child(5)  { animation-delay: .30s; }
        .question-card:nth-child(6)  { animation-delay: .35s; }
        .question-card:nth-child(7)  { animation-delay: .38s; }
        .question-card:nth-child(8)  { animation-delay: .40s; }
        .question-card:nth-child(n+9){ animation-delay: .42s; }
      `}</style>

      <div className="qd-page">

        {/* Quiz Header */}
        <div className="quiz-header-card">
          <div className="quiz-header-top">
            <div style={{flex:1,minWidth:0}}>
              <h1 className="quiz-title">{quiz.title}</h1>
              <p className="quiz-desc">{quiz.description || "Tidak ada deskripsi."}</p>
            </div>
            <div className="quiz-header-actions">
              <Link href={`/dashboard/quiz/${id}/edit`} className="edit-quiz-btn">
                ✎ Edit
              </Link>
              <Link href="/dashboard" className="back-btn">
                ← Kembali
              </Link>
            </div>
          </div>
          <div className="quiz-badges">
            <span className="qbadge qbadge-purple">
              📋 {questions?.length || 0} Pertanyaan
            </span>
            <span className="qbadge qbadge-green">
              🏆 {totalPoints} Poin Maks
            </span>
          </div>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Daftar Soal</h2>
          <Link href={`/dashboard/quiz/${id}/add`} className="add-btn">
            <span>+</span> Tambah Soal
          </Link>
        </div>

        {/* Questions */}
        <div className="question-list">
          {questions && questions.length > 0 ? (
            questions.map((q, index) => {
              const optionsList = Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]");
              return (
                <div key={q.id} className="question-card">
                  <div className="question-top">
                    <div className="question-top-left">
                      <span className="question-num">{index + 1}</span>
                      <span className="question-text">{q.question_text}</span>
                    </div>
                    <div className="question-top-right">
                      <div className="question-meta">
                        <span className="points-badge">{q.points} Poin</span>
                        {q.time_limit && (
                          <span className="time-badge">⏱ {q.time_limit}s</span>
                        )}
                      </div>
                      <QuestionActions quizId={id} questionId={q.id} />
                    </div>
                  </div>

                  <div className="options-grid">
                    {optionsList.map((opt: string, i: number) => {
                      const isCorrect = opt === q.correct_answer;
                      return (
                        <div key={i} className={`option-item ${isCorrect ? 'correct' : ''}`}>
                          <span className={`option-letter ${isCorrect ? 'correct-letter' : 'normal'}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={`option-text ${isCorrect ? 'correct-text' : 'normal-text'}`}>
                            {opt}
                          </span>
                          {isCorrect && <span className="correct-check">✓ Kunci</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">Kuis Ini Masih Kosong!</h3>
              <p className="empty-sub">Belum ada pertanyaan pilihan ganda dalam kuis ini.</p>
              <Link href={`/dashboard/quiz/${id}/add`} className="empty-cta">
                + Buat Soal Pertamamu Sekarang
              </Link>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
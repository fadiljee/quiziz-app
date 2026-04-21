'use client'

import { useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddQuestion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [points, setPoints] = useState(10);
  const [timeLimit, setTimeLimit] = useState(20);

  const handleSimpanSoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const optionsArray = [optA, optB, optC, optD];
    let correctAnswerText = "";
    if (correctOption === "A") correctAnswerText = optA;
    if (correctOption === "B") correctAnswerText = optB;
    if (correctOption === "C") correctAnswerText = optC;
    if (correctOption === "D") correctAnswerText = optD;

    const { error } = await supabase.from('questions').insert([{
      quiz_id: id,
      question_text: questionText,
      options: optionsArray,
      correct_answer: correctAnswerText,
      points,
      time_limit: timeLimit,
    }]);

    if (error) {
      alert("Gagal menyimpan soal: " + error.message);
    } else {
      alert("Soal berhasil ditambahkan!");
      router.push(`/dashboard/quiz/${id}`);
      router.refresh();
    }
    setLoading(false);
  };

  const optionColors: Record<string, string> = {
    A: '#E3001B', B: '#3B82F6', C: '#10B981', D: '#F59E0B',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .aq-page { font-family: 'Plus Jakarta Sans', sans-serif; max-width: 720px; margin: 0 auto; }

        /* Page header */
        .aq-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .aq-page-title {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -.025em;
        }
        .aq-page-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,.3);
          margin-top: 3px;
        }
        .cancel-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.45);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 9px;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .cancel-btn:hover {
          color: rgba(255,255,255,.7);
          background: rgba(255,255,255,0.08);
        }

        /* Main form card */
        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          overflow: hidden;
        }

        /* Section blocks */
        .form-section {
          padding: 24px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .form-section:last-child { border-bottom: none; }

        .section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,.3);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 14px;
        }
        .section-label-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #E3001B;
        }

        /* Textarea */
        .question-textarea {
          width: 100%;
          background: rgba(255,255,255,.05);
          border: 1.5px solid rgba(255,255,255,.09);
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          resize: vertical;
          outline: none;
          transition: all 0.2s;
          min-height: 100px;
          line-height: 1.6;
        }
        .question-textarea::placeholder { color: rgba(255,255,255,.18); font-weight:400; }
        .question-textarea:focus {
          border-color: rgba(227,0,27,.55);
          background: rgba(255,255,255,.07);
          box-shadow: 0 0 0 4px rgba(227,0,27,.08);
        }

        /* Options grid */
        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 560px) { .options-grid { grid-template-columns: 1fr 1fr; } }

        .option-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,.04);
          border: 1.5px solid rgba(255,255,255,.08);
          border-radius: 12px;
          padding: 10px 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .option-input-wrapper:focus-within {
          border-color: rgba(255,255,255,.2);
          box-shadow: 0 0 0 3px rgba(255,255,255,.04);
        }
        .option-letter-badge {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          font-weight: 900;
          color: #fff;
          flex-shrink: 0;
        }
        .option-text-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,.75);
        }
        .option-text-input::placeholder { color: rgba(255,255,255,.2); font-weight:400; }

        /* Config section */
        .config-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 560px) { .config-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .config-field { display: flex; flex-direction: column; gap: 8px; }
        .config-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,.35);
          text-transform: uppercase;
          letter-spacing: .07em;
        }
        .config-select, .config-number {
          background: rgba(255,255,255,.05);
          border: 1.5px solid rgba(255,255,255,.09);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .config-select:focus, .config-number:focus {
          border-color: rgba(227,0,27,.5);
          box-shadow: 0 0 0 3px rgba(227,0,27,.07);
        }
        .config-select option { background: #1a1a2e; color: #fff; }

        /* Key answer preview */
        .key-preview {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16,185,129,.08);
          border: 1px solid rgba(16,185,129,.2);
          color: #34D399;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 7px;
        }

        /* Submit section */
        .submit-section {
          padding: 20px 28px;
          background: rgba(255,255,255,.02);
          border-top: 1px solid rgba(255,255,255,.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .submit-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,.2);
        }
        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #E3001B, #CC0017);
          border: none;
          border-radius: 11px;
          padding: 12px 28px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: .01em;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .submit-btn::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);
          pointer-events:none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(227,0,27,.4);
        }
        .submit-btn:disabled {
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.25);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="aq-page">
        {/* Header */}
        <div className="aq-page-header">
          <div>
            <h1 className="aq-page-title">Tambah Soal Baru</h1>
            <p className="aq-page-sub">Isi form di bawah untuk menambahkan soal pilihan ganda</p>
          </div>
          <Link href={`/dashboard/quiz/${id}`} className="cancel-btn">
            ✕ Batal
          </Link>
        </div>

        <form onSubmit={handleSimpanSoal}>
          <div className="form-card">

            {/* Question text */}
            <div className="form-section">
              <div className="section-label">
                <span className="section-label-dot" />
                Teks Pertanyaan
              </div>
              <textarea
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ketik pertanyaan di sini…"
                rows={3}
                className="question-textarea"
              />
            </div>

            {/* Options */}
            <div className="form-section">
              <div className="section-label">
                <span className="section-label-dot" style={{background:'#3B82F6'}} />
                Pilihan Jawaban
              </div>
              <div className="options-grid">
                {[
                  { key: 'A', val: optA, set: setOptA },
                  { key: 'B', val: optB, set: setOptB },
                  { key: 'C', val: optC, set: setOptC },
                  { key: 'D', val: optD, set: setOptD },
                ].map(({ key, val, set }) => (
                  <div key={key} className="option-input-wrapper">
                    <span
                      className="option-letter-badge"
                      style={{ background: optionColors[key] + '22', color: optionColors[key], border: `1px solid ${optionColors[key]}44` }}
                    >
                      {key}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={`Pilihan ${key}…`}
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      className="option-text-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Config */}
            <div className="form-section">
              <div className="section-label">
                <span className="section-label-dot" style={{background:'#F59E0B'}} />
                Konfigurasi Soal
              </div>
              <div className="config-grid">
                <div className="config-field">
                  <label className="config-label">Kunci Jawaban</label>
                  <select
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                    className="config-select"
                  >
                    {['A','B','C','D'].map(o => (
                      <option key={o} value={o}>Pilihan {o}</option>
                    ))}
                  </select>
                  <div className="key-preview">
                    ✓ Jawaban benar: Pilihan {correctOption}
                  </div>
                </div>
                <div className="config-field">
                  <label className="config-label">Poin</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="config-number"
                  />
                </div>
                <div className="config-field">
                  <label className="config-label">Waktu (Detik)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="config-number"
                  />
                </div>
              </div>
            </div>

            {/* Submit row */}
            <div className="submit-section">
              <span className="submit-hint">Soal akan langsung tersimpan ke kuis ini</span>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <><div className="spinner" /> Menyimpan…</>
                ) : (
                  <>💾 Simpan Soal</>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}
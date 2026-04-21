'use client'

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditQuestionPage({ params }: { params: Promise<{ id: string, questionId: string }> }) {
  const { id: quizId, questionId } = use(params);
  const router = useRouter();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [points, setPoints] = useState(10);
  const [timeLimit, setTimeLimit] = useState(20);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (data) {
        setQuestionText(data.question_text);
        
        // Parse options dengan aman
        const parsedOptions = Array.isArray(data.options) ? data.options : JSON.parse(data.options || '["","","",""]');
        setOptions(parsedOptions);
        
        setCorrectAnswer(data.correct_answer);
        setPoints(data.points || 10);
        setTimeLimit(data.time_limit || 20);
      }
      if (error) {
        console.error("Gagal menarik data:", error);
        alert("Soal tidak ditemukan!");
      }
      setLoading(false);
    };

    fetchQuestion();
  }, [questionId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctAnswer) return alert("Pilih kunci jawaban yang benar!");
    if (options.some(opt => opt.trim() === "")) return alert("Semua pilihan ganda (A, B, C, D) harus diisi!");

    setSaving(true);
    const { error } = await supabase
      .from('questions')
      .update({
        question_text: questionText,
        options: options,
        correct_answer: correctAnswer,
        points: points,
        time_limit: timeLimit
      })
      .eq('id', questionId);

    if (error) {
      alert("Gagal mengupdate soal: " + error.message);
      setSaving(false);
    } else {
      // Kembali ke halaman daftar soal
      router.push(`/dashboard/quiz/${quizId}`);
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0B0B14', color:'rgba(255,255,255,0.5)'}}>
        Memuat data soal...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .eq-page {
          min-height: 100vh;
          background: #0B0B14;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 40px 24px;
          display: flex;
          justify-content: center;
        }

        .eq-container {
          width: 100%;
          max-width: 800px;
        }

        .eq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .eq-title {
          font-size: 24px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          border-radius: 9px;
          text-decoration: none;
          transition: all 0.15s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
        }

        .form-group { margin-bottom: 24px; }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          padding: 14px 18px;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #3B82F6; background: rgba(255,255,255,0.06); }

        .options-grid {
          display: flex; flex-direction: column; gap: 12px;
        }

        .option-row {
          display: flex; align-items: center; gap: 12px;
        }

        .option-letter {
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; color: rgba(255,255,255,0.4);
          flex-shrink: 0;
        }

        .check-btn {
          width: 44px; height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          flex-shrink: 0; font-size: 18px;
        }
        .check-btn.is-correct {
          background: rgba(16,185,129,0.15);
          border-color: rgba(16,185,129,0.4);
          color: #10B981;
        }

        .grid-2 {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          color: #fff;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 10px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59,130,246,0.3);
        }
        .submit-btn:disabled {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.3);
          cursor: not-allowed;
        }
      `}</style>

      <div className="eq-page">
        <div className="eq-container">
          
          <div className="eq-header">
            <h1 className="eq-title">✏️ Edit Soal</h1>
            <Link href={`/dashboard/quiz/${quizId}`} className="back-btn">
              Batal & Kembali
            </Link>
          </div>

          <div className="form-card">
            <form onSubmit={handleUpdate}>
              
              <div className="form-group">
                <label className="form-label">Teks Pertanyaan</label>
                <textarea
                  required
                  rows={4}
                  className="form-input"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Masukkan pertanyaan di sini..."
                  style={{resize: 'vertical'}}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pilihan Ganda (Klik ✔️ untuk Kunci Jawaban)</label>
                <div className="options-grid">
                  {['A', 'B', 'C', 'D'].map((letter, index) => (
                    <div className="option-row" key={index}>
                      <div className="option-letter">{letter}</div>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={options[index]}
                        onChange={(e) => {
                          const newOpts = [...options];
                          newOpts[index] = e.target.value;
                          setOptions(newOpts);
                        }}
                        placeholder={`Masukkan pilihan ${letter}`}
                      />
                      <button
                        type="button"
                        className={`check-btn ${correctAnswer === options[index] && options[index] !== "" ? 'is-correct' : ''}`}
                        onClick={() => setCorrectAnswer(options[index])}
                        title="Jadikan Kunci Jawaban"
                      >
                        ✔️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Poin Benar</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Batas Waktu (Detik)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                  />
                </div>
              </div>

              <button type="submit" disabled={saving} className="submit-btn">
                {saving ? "Menyimpan Perubahan..." : "Simpan Perubahan Soal"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </>
  );
}
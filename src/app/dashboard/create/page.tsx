'use client'

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('quizzes')
      .insert([{ title, description }]);

    if (error) {
      alert("Gagal menyimpan kuis: " + error.message);
    } else {
      alert("Kuis berhasil dibuat!");
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .cq-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Page header */
        .cq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cq-title {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -.025em;
        }
        .cq-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,.3);
          margin-top: 3px;
        }
        .cq-cancel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.09);
          color: rgba(255,255,255,.45);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 9px;
          text-decoration: none;
          transition: all .15s;
          white-space: nowrap;
        }
        .cq-cancel:hover {
          color: rgba(255,255,255,.7);
          background: rgba(255,255,255,.08);
        }

        /* Card */
        .cq-card {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }
        .cq-card::before {
          content:'';
          position:absolute;top:0;left:0;right:0;height:3px;
          background: linear-gradient(90deg, #E3001B, #FF6B35, #E3001B);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Sections */
        .cq-section {
          padding: 24px 28px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .cq-section:last-child { border-bottom: none; }

        .field-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,.35);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 10px;
        }
        .field-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
        }

        /* Inputs */
        .cq-input {
          width: 100%;
          background: rgba(255,255,255,.05);
          border: 1.5px solid rgba(255,255,255,.09);
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          outline: none;
          transition: all .2s;
        }
        .cq-input::placeholder { color: rgba(255,255,255,.18); font-weight:400; }
        .cq-input:focus {
          border-color: rgba(227,0,27,.55);
          background: rgba(255,255,255,.07);
          box-shadow: 0 0 0 4px rgba(227,0,27,.08);
        }

        .cq-textarea {
          width: 100%;
          background: rgba(255,255,255,.05);
          border: 1.5px solid rgba(255,255,255,.09);
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          outline: none;
          transition: all .2s;
          resize: vertical;
          min-height: 110px;
          line-height: 1.6;
        }
        .cq-textarea::placeholder { color: rgba(255,255,255,.18); font-weight:400; }
        .cq-textarea:focus {
          border-color: rgba(227,0,27,.55);
          background: rgba(255,255,255,.07);
          box-shadow: 0 0 0 4px rgba(227,0,27,.08);
        }
        .optional-tag {
          margin-left: 6px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.25);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 5px;
          text-transform: uppercase;
          letter-spacing: .06em;
          vertical-align: middle;
        }

        /* Submit footer */
        .cq-footer {
          padding: 20px 28px;
          background: rgba(255,255,255,.02);
          border-top: 1px solid rgba(255,255,255,.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cq-footer-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,.2);
        }
        .cq-submit {
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
          transition: all .2s;
          letter-spacing: .01em;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .cq-submit::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);
          pointer-events:none;
        }
        .cq-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(227,0,27,.4);
        }
        .cq-submit:disabled {
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.25);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .cq-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="cq-page">
        {/* Header */}
        <div className="cq-header">
          <div>
            <h1 className="cq-title">Buat Kuis Baru</h1>
            <p className="cq-sub">Isi detail kuis sebelum menambahkan soal</p>
          </div>
          <Link href="/dashboard" className="cq-cancel">✕ Batal</Link>
        </div>

        <form onSubmit={handleSimpan}>
          <div className="cq-card">

            {/* Title */}
            <div className="cq-section">
              <label className="field-label">
                <span className="field-dot" style={{background:'#E3001B'}} />
                Judul Kuis
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tes Seleksi Teknik Jaringan…"
                className="cq-input"
              />
            </div>

            {/* Description */}
            <div className="cq-section">
              <label className="field-label">
                <span className="field-dot" style={{background:'#3B82F6'}} />
                Deskripsi
                <span className="optional-tag">Opsional</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tambahkan keterangan tentang kuis ini…"
                rows={4}
                className="cq-textarea"
              />
            </div>

            {/* Footer */}
            <div className="cq-footer">
              <span className="cq-footer-hint">Soal dapat ditambahkan setelah kuis disimpan</span>
              <button type="submit" disabled={loading} className="cq-submit">
                {loading ? (
                  <><div className="cq-spinner" /> Menyimpan…</>
                ) : (
                  <>✚ Simpan Kuis</>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}
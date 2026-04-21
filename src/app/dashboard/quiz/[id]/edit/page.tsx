'use client'

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditQuiz({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
      if (data) { setTitle(data.title); setDescription(data.description || ""); }
      if (error) { alert("Kuis tidak ditemukan!"); }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('quizzes').update({ title, description }).eq('id', id);
    if (error) { alert("Gagal mengupdate kuis: " + error.message); }
    else { alert("Kuis berhasil diupdate!"); router.push('/dashboard'); router.refresh(); }
    setSaving(false);
  };

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&display=swap');
        .eq-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:40vh;gap:16px;font-family:'Plus Jakarta Sans',sans-serif;}
        .eq-spinner{width:36px;height:36px;border:3px solid rgba(227,0,27,.2);border-top-color:#E3001B;border-radius:50%;animation:spin .8s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .eq-loading-text{font-size:13px;font-weight:700;color:rgba(255,255,255,.25);letter-spacing:.06em;text-transform:uppercase;}
      `}</style>
      <div className="eq-loading">
        <div className="eq-spinner"/>
        <span className="eq-loading-text">Memuat data kuis…</span>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .eq-page{font-family:'Plus Jakarta Sans',sans-serif;max-width:600px;margin:0 auto;}

        .eq-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:12px;flex-wrap:wrap;}
        .eq-title{font-size:22px;font-weight:900;color:#fff;letter-spacing:-.025em;}
        .eq-sub{font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,.3);margin-top:3px;}
        .eq-cancel{
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
          color:rgba(255,255,255,.45);font-family:'Plus Jakarta Sans',sans-serif;
          font-size:12px;font-weight:700;padding:8px 16px;border-radius:9px;
          text-decoration:none;transition:all .15s;white-space:nowrap;
        }
        .eq-cancel:hover{color:rgba(255,255,255,.7);background:rgba(255,255,255,.08);}

        /* Card */
        .eq-card{
          background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
          border-radius:18px;overflow:hidden;position:relative;
        }
        .eq-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,#E3001B,#FF6B35,#E3001B);
          background-size:200% 100%;animation:shimmer 3s linear infinite;
        }
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

        .eq-section{padding:24px 28px;border-bottom:1px solid rgba(255,255,255,.06);}
        .eq-section:last-child{border-bottom:none;}

        .eq-field-label{
          display:flex;align-items:center;gap:7px;
          font-size:11px;font-weight:700;color:rgba(255,255,255,.35);
          text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;
        }
        .eq-field-dot{width:6px;height:6px;border-radius:50%;}

        .eq-input{
          width:100%;background:rgba(255,255,255,.05);
          border:1.5px solid rgba(255,255,255,.09);border-radius:12px;
          padding:13px 16px;font-family:'Plus Jakarta Sans',sans-serif;
          font-size:15px;font-weight:600;color:#fff;outline:none;transition:all .2s;
        }
        .eq-input:focus{border-color:rgba(227,0,27,.55);background:rgba(255,255,255,.07);box-shadow:0 0 0 4px rgba(227,0,27,.08);}

        .eq-textarea{
          width:100%;background:rgba(255,255,255,.05);
          border:1.5px solid rgba(255,255,255,.09);border-radius:12px;
          padding:13px 16px;font-family:'Plus Jakarta Sans',sans-serif;
          font-size:14px;font-weight:500;color:#fff;outline:none;
          transition:all .2s;resize:vertical;min-height:110px;line-height:1.6;
        }
        .eq-textarea:focus{border-color:rgba(227,0,27,.55);background:rgba(255,255,255,.07);box-shadow:0 0 0 4px rgba(227,0,27,.08);}
        .eq-input::placeholder,.eq-textarea::placeholder{color:rgba(255,255,255,.18);font-weight:400;}

        .optional-tag{
          margin-left:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.25);font-size:10px;font-weight:700;padding:2px 8px;
          border-radius:5px;text-transform:uppercase;letter-spacing:.06em;vertical-align:middle;
        }

        /* Footer */
        .eq-footer{
          padding:20px 28px;background:rgba(255,255,255,.02);
          border-top:1px solid rgba(255,255,255,.06);
          display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
        }
        .eq-footer-hint{font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(255,255,255,.2);}

        .eq-submit{
          display:inline-flex;align-items:center;gap:8px;
          background:linear-gradient(135deg,#E3001B,#CC0017);
          border:none;border-radius:11px;padding:12px 28px;
          font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:800;
          color:#fff;cursor:pointer;transition:all .2s;letter-spacing:.01em;
          position:relative;overflow:hidden;white-space:nowrap;
        }
        .eq-submit::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);pointer-events:none;}
        .eq-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(227,0,27,.4);}
        .eq-submit:disabled{background:rgba(255,255,255,.08);color:rgba(255,255,255,.25);cursor:not-allowed;transform:none;box-shadow:none;}

        .eq-spinner-sm{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="eq-page">
        <div className="eq-header">
          <div>
            <h1 className="eq-title">Edit Detail Kuis</h1>
            <p className="eq-sub">Ubah judul atau deskripsi kuis ini</p>
          </div>
          <Link href="/dashboard" className="eq-cancel">✕ Batal</Link>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="eq-card">

            <div className="eq-section">
              <label className="eq-field-label">
                <span className="eq-field-dot" style={{background:'#E3001B'}}/>
                Judul Kuis
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="eq-input"
                placeholder="Judul kuis…"
              />
            </div>

            <div className="eq-section">
              <label className="eq-field-label">
                <span className="eq-field-dot" style={{background:'#3B82F6'}}/>
                Deskripsi
                <span className="optional-tag">Opsional</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="eq-textarea"
                placeholder="Tambahkan keterangan tentang kuis ini…"
              />
            </div>

            <div className="eq-footer">
              <span className="eq-footer-hint">Perubahan akan langsung tersimpan ke database</span>
              <button type="submit" disabled={saving} className="eq-submit">
                {saving
                  ? <><div className="eq-spinner-sm"/> Menyimpan…</>
                  : <>✎ Simpan Perubahan</>
                }
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}
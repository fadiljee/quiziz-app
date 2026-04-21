'use client'

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus kuis ini beserta semua soal di dalamnya?");
    if (!confirmDelete) return;
    setIsDeleting(true);

    await supabase.from('questions').delete().eq('quiz_id', id);
    const { error } = await supabase.from('quizzes').delete().eq('id', id);

    if (error) {
      alert("Gagal menghapus kuis: " + error.message);
    } else {
      router.refresh();
    }
    setIsDeleting(false);
  };

  return (
    <>
      <style>{`
        .delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(227,0,27,0.07);
          border: 1px solid rgba(227,0,27,0.18);
          color: #FF4D5E;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 11px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .delete-btn:hover:not(:disabled) {
          background: rgba(227,0,27,0.14);
          border-color: rgba(227,0,27,0.35);
        }
        .delete-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .del-spinner {
          width: 11px; height: 11px;
          border: 1.5px solid rgba(255,77,94,0.3);
          border-top-color: #FF4D5E;
          border-radius: 50%;
          animation: dspin 0.7s linear infinite;
        }
        @keyframes dspin { to { transform: rotate(360deg); } }
      `}</style>
      <button onClick={handleDelete} disabled={isDeleting} className="delete-btn">
        {isDeleting ? (
          <><div className="del-spinner" /> Menghapus…</>
        ) : (
          <>🗑 Hapus</>
        )}
      </button>
    </>
  );
}
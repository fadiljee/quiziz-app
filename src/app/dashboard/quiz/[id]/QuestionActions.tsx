'use client'

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function QuestionActions({ quizId, questionId }: { quizId: string, questionId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus soal ini?")) return;
    setIsDeleting(true);

    const { error } = await supabase.from('questions').delete().eq('id', questionId);

    if (error) {
      alert("Gagal menghapus soal: " + error.message);
      setIsDeleting(false);
    } else {
      router.refresh(); // Refresh halaman otomatis agar soal yang dihapus hilang
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {/* Tombol Edit - Mengarahkan ke halaman edit soal (nantinya) */}
      <Link 
        href={`/dashboard/quiz/${quizId}/question/${questionId}/edit`}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', borderRadius: '8px', textDecoration: 'none',
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3B82F6',
          transition: 'all 0.2s', fontSize: '14px'
        }}
        title="Edit Soal"
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
      >
        ✏️
      </Link>

      {/* Tombol Hapus */}
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
          background: 'rgba(227,0,27,0.1)', border: '1px solid rgba(227,0,27,0.2)', color: '#FF4D5E',
          transition: 'all 0.2s', fontSize: '14px', opacity: isDeleting ? 0.5 : 1
        }}
        title="Hapus Soal"
        onMouseOver={(e) => !isDeleting && (e.currentTarget.style.background = 'rgba(227,0,27,0.2)')}
        onMouseOut={(e) => !isDeleting && (e.currentTarget.style.background = 'rgba(227,0,27,0.1)')}
      >
        {isDeleting ? "⏳" : "🗑️"}
      </button>
    </div>
  );
}
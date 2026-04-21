'use client'

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HostButton({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleHostLive = async () => {
    setIsLoading(true);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    const { data, error } = await supabase
      .from('game_sessions')
      .insert([{ quiz_id: quizId, pin, status: 'waiting' }])
      .select()
      .single();

    if (error) {
      alert("Gagal membuat sesi kuis: " + error.message);
      setIsLoading(false);
      return;
    }
    router.push(`/host/${data.id}`);
  };

  return (
    <>
      <style>{`
        .host-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.25);
          color: #34D399;
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
        .host-btn:hover:not(:disabled) {
          background: rgba(16,185,129,0.18);
          border-color: rgba(16,185,129,0.4);
        }
        .host-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .host-spinner {
          width: 11px; height: 11px;
          border: 1.5px solid rgba(52,211,153,0.3);
          border-top-color: #34D399;
          border-radius: 50%;
          animation: hspin 0.7s linear infinite;
        }
        @keyframes hspin { to { transform: rotate(360deg); } }
      `}</style>
      <button onClick={handleHostLive} disabled={isLoading} className="host-btn">
        {isLoading ? (
          <><div className="host-spinner" /> Menyiapkan…</>
        ) : (
          <>▶ Host Live</>
        )}
      </button>
    </>
  );
}
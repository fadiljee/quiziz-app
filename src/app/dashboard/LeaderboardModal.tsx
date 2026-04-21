'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LeaderboardModal({ sessionId, onClose }: { sessionId: string, onClose: () => void }) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data skor peserta
  const fetchScores = async () => {
    const { data } = await supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('score', { ascending: false });
    
    if (data) setParticipants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();

    // Dengerin kalau ada perubahan skor secara real-time
    const channel = supabase.channel('realtime-scores-modal')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` }, () => {
        fetchScores(); // Ambil ulang data terbaru
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      
      {/* Kotak Modal Utama (klik di luar kotak akan menutup modal karena onClick di atas) */}
      <div 
        className="bg-[#1A1A2E] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Supaya kalau ngeklik dalam kotak, modalnya nggak ketutup
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-black text-white">🏆 Live Leaderboard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold">
            X
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-10 animate-pulse">Memuat skor...</div>
          ) : participants.length > 0 ? (
            <div className="flex flex-col gap-3">
              {participants.map((p, index) => {
                let rankStyle = "bg-white/5 text-gray-300 border-white/10";
                if (index === 0) rankStyle = "bg-yellow-500/20 border-yellow-500/50 text-yellow-400 font-black scale-[1.02] shadow-[0_0_15px_rgba(234,179,8,0.2)]";
                else if (index === 1) rankStyle = "bg-gray-400/20 border-gray-400/50 text-gray-300 font-bold";
                else if (index === 2) rankStyle = "bg-amber-700/20 border-amber-700/50 text-amber-500 font-bold";

                return (
                  <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${rankStyle}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 font-bold text-sm">
                        #{index + 1}
                      </div>
                      <span className="text-lg">{p.nickname}</span>
                    </div>
                    <div className="text-2xl font-black tracking-wider">
                      {p.score} <span className="text-sm font-medium opacity-50">pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 font-medium">Belum ada skor tercatat di sesi ini.</div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-white/5 text-center">
          <button onClick={onClose} className="text-sm font-bold text-gray-400 hover:text-white px-6 py-2 rounded-full hover:bg-white/10 transition">
            Tutup Layar
          </button>
        </div>
      </div>
    </div>
  );
}
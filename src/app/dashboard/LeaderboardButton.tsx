'use client'

import { useState } from "react";
import LeaderboardModal from "./LeaderboardModal";

export default function LeaderboardButton({ sessionId }: { sessionId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-[11px] px-[14px] py-[6px] rounded-[10px] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all"
      >
        📊 Lihat Leaderboard
      </button>

      {/* Kalau tombol diklik, isOpen jadi true, dan pop-up muncul */}
      {isOpen && (
        <LeaderboardModal 
          sessionId={sessionId} 
          onClose={() => setIsOpen(false)} // Kalau tombol silang diklik, tutup pop-upnya
        />
      )}
    </>
  );
}
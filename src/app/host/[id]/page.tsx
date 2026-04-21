'use client'

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HostLobby({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessData } = await supabase.from('game_sessions').select('*, quizzes(title)').eq('id', id).single();
      if (sessData) setSession(sessData);

      const { data: partData } = await supabase.from('participants').select('*').eq('session_id', id);
      if (partData) setParticipants(partData);
      
      setLoading(false);
    };
    fetchData();

    // SENSOR: Dengerin peserta baru join
    const channel = supabase.channel('public:participants')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participants', filter: `session_id=eq.${id}` }, (payload) => {
        setParticipants((current) => [...current, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleMulaiKuis = async () => {
    // Ubah status jadi playing, lalu LEMPAR PENGAWAS KE LEADERBOARD!
    await supabase.from('game_sessions').update({ status: 'playing' }).eq('id', id);
    router.push(`/leaderboard/${id}`);
  };

  if (loading) return <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center text-white">Memuat...</div>;
  if (!session) return <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center text-red-500">Sesi tidak ditemukan.</div>;

  const quizTitle = session.quizzes?.title || "Kuis";
  const avatarColors = ['#E3001B','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899','#06B6D4','#F97316'];

  return (
    <div className="min-h-screen bg-[#0B0B14] font-sans text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="z-10 text-center w-full max-w-4xl">
        <p className="text-gray-400 font-bold tracking-widest uppercase mb-2">Sesi Aktif</p>
        <h1 className="text-4xl md:text-5xl font-black mb-8">{quizTitle}</h1>

        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl mb-12 shadow-2xl backdrop-blur-md">
          <p className="text-gray-400 font-bold uppercase tracking-widest mb-4">🔑 PIN Sesi</p>
          <div className="text-7xl md:text-9xl font-black tracking-widest text-white drop-shadow-[0_0_30px_rgba(227,0,27,0.5)]">
            {session.pin.substring(0,3)}<span className="text-[#E3001B]">{session.pin.substring(3)}</span>
          </div>
          <p className="mt-6 text-gray-400">Minta peserta masuk ke web dan masukkan PIN ini</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Peserta Bergabung <span className="bg-[#E3001B] text-white px-3 py-1 rounded-full ml-2 text-sm">{participants.length}</span></h3>
            <button onClick={handleMulaiKuis} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-transform px-8 py-3 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Mulai Kuis!
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {participants.length > 0 ? participants.map((p, i) => (
              <div key={p.id} className="bg-white/10 border border-white/10 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{backgroundColor: avatarColors[i % 8]}}>{p.nickname.charAt(0).toUpperCase()}</div>
                {p.nickname}
              </div>
            )) : <div className="w-full py-8 text-gray-500 italic">Menunggu peserta...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import DeleteButton from "@/app/dashboard/DeleteButton";
import HostButton from "@/app/dashboard/HostButton";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // 1. Ambil Data Kuis
  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error("Gagal mengambil data kuis:", error);

  // 2. Ambil Data Sesi (Biar Host bisa balik ke Leaderboard kapan aja)
  const { data: sessions } = await supabase
    .from('game_sessions')
    .select('*, quizzes(title)')
    .order('created_at', { ascending: false });

  const totalKuis = quizzes ? quizzes.length : 0;
  const totalSesi = sessions ? sessions.length : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .dash-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .dash-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 28px; gap: 16px; flex-wrap: wrap;
        }
        .dash-heading {
          font-size: 24px; font-weight: 900; color: #fff;
          letter-spacing: -0.025em; margin-bottom: 4px;
        }
        .dash-subheading {
          font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.35);
        }
        .create-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #E3001B, #CC0017); color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800;
          padding: 10px 20px; border-radius: 10px; text-decoration: none;
          transition: all 0.2s ease; letter-spacing: 0.01em; white-space: nowrap;
          position: relative; overflow: hidden;
        }
        .create-btn::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent);
          pointer-events:none;
        }
        .create-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(227,0,27,0.4); }

        /* Stats grid */
        .stats-grid {
          display: grid; grid-template-columns: repeat(1, 1fr); gap: 14px; margin-bottom: 28px;
        }
        @media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }

        .stat-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 20px 24px; position: relative;
          overflow: hidden; transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.12); }
        .stat-card::before {
          content:''; position:absolute; top:0;left:0;right:0; height:2px;
        }
        .stat-card.red::before { background: linear-gradient(90deg, #E3001B, #FF6B35); }
        .stat-card.blue::before { background: linear-gradient(90deg, #3B82F6, #6366F1); }
        .stat-card.green::before { background: linear-gradient(90deg, #10B981, #34D399); }

        .stat-label {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35);
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
        }
        .stat-value-row { display: flex; align-items: flex-end; gap: 8px; }
        .stat-num {
          font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -0.03em; line-height: 1;
        }
        .stat-num.red { color: #FF4D5E; }
        .stat-icon { font-size: 18px; margin-bottom: 3px; opacity: 0.6; }

        /* Table card */
        .table-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden; margin-bottom: 32px;
        }
        .table-card-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .table-card-title { font-size: 15px; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
        .table-count {
          background: rgba(227,0,27,0.12); border: 1px solid rgba(227,0,27,0.2);
          color: #FF4D5E; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px;
        }

        .quiz-table { width: 100%; border-collapse: collapse; }
        .quiz-table thead tr { background: rgba(255,255,255,0.02); }
        .quiz-table th {
          padding: 11px 20px; text-align: left; font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.07em; white-space: nowrap;
        }
        .quiz-table tbody tr { border-top: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
        .quiz-table tbody tr:hover { background: rgba(255,255,255,0.03); }
        .quiz-table td {
          padding: 14px 20px; font-size: 13px; color: rgba(255,255,255,0.65); vertical-align: middle;
        }
        .quiz-title-cell { font-weight: 700; color: #fff !important; display: flex; align-items: center; gap: 10px; }
        .quiz-dot { width: 7px; height: 7px; background: #E3001B; border-radius: 50%; flex-shrink: 0; }
        
        /* Badges */
        .date-badge {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45); font-size: 11px; font-weight: 600; padding: 4px 10px;
          border-radius: 6px; white-space: nowrap;
        }
        .status-badge {
          font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
          padding: 5px 10px; border-radius: 6px; display: inline-block; white-space: nowrap;
        }
        .status-waiting { background: rgba(245,158,11,0.15); color: #F59E0B; border: 1px solid rgba(245,158,11,0.3); }
        .status-playing { background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
        .status-completed { background: rgba(59,130,246,0.15); color: #3B82F6; border: 1px solid rgba(59,130,246,0.3); }
        
        .action-cell { display: flex; align-items: center; gap: 6px; }
        .empty-state { padding: 48px 24px; text-align: center; }
        .empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.4; }
        .empty-text { font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.25); }
      `}</style>

      <div className="dash-page">
        <div className="dash-header">
          <div>
            <h1 className="dash-heading">Ringkasan Dashboard</h1>
            <p className="dash-subheading">Kelola seluruh sesi tes Telkom Akses dari sini</p>
          </div>
          <Link href="/dashboard/create" className="create-btn">
            <span style={{fontSize:'16px'}}>+</span>
            Buat Kuis Baru
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card red">
            <p className="stat-label">Total Kuis</p>
            <div className="stat-value-row">
              <span className="stat-num red">{totalKuis}</span>
              <span className="stat-icon">📋</span>
            </div>
          </div>
          <div className="stat-card blue">
            <p className="stat-label">Total Sesi Dibuat</p>
            <div className="stat-value-row">
              <span className="stat-num">{totalSesi}</span>
              <span className="stat-icon">🎮</span>
            </div>
          </div>
          <div className="stat-card green">
            <p className="stat-label">Keandalan Sistem</p>
            <div className="stat-value-row">
              <span className="stat-num">100<span style={{fontSize: '18px'}}>%</span></span>
              <span className="stat-icon">⚡</span>
            </div>
          </div>
        </div>

        {/* =========================================
            TABEL 1: DAFTAR KUIS (Bank Soal)
            ========================================= */}
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">Bank Soal (Daftar Kuis)</span>
            <span className="table-count">{totalKuis} kuis</span>
          </div>

          <table className="quiz-table">
            <thead>
              <tr>
                <th>Nama Kuis</th>
                <th>Deskripsi</th>
                <th>Dibuat Pada</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <div className="quiz-title-cell">
                        <span className="quiz-dot" />
                        {quiz.title}
                      </div>
                    </td>
                    <td style={{maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                      {quiz.description || <span style={{opacity:0.3}}>—</span>}
                    </td>
                    <td>
                      <span className="date-badge">{formatDate(quiz.created_at)}</span>
                    </td>
                    <td>
                      <div className="action-cell">
                        <Link href={`/dashboard/quiz/${quiz.id}/edit`} style={{
                          fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.55)',
                          textDecoration:'none', padding:'5px 11px',
                          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                          borderRadius:'7px', transition:'all 0.15s', whiteSpace:'nowrap'
                        }}>
                          ⚙️ Edit Info
                        </Link>
                        <Link href={`/dashboard/quiz/${quiz.id}`} style={{
                          fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.55)',
                          textDecoration:'none', padding:'5px 11px',
                          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                          borderRadius:'7px', transition:'all 0.15s', whiteSpace:'nowrap'
                        }}>
                          ✏️ Soal
                        </Link>
                        <HostButton quizId={quiz.id} />
                        <DeleteButton id={quiz.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p className="empty-text">Belum ada kuis. Buat kuis pertama Anda!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================
            TABEL 2: RIWAYAT & SESI LIVE (Fallback Leaderboard)
            ========================================= */}
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">Pemantauan Sesi Live & Riwayat</span>
            <span className="table-count" style={{background: 'rgba(59,130,246,0.12)', color: '#3B82F6', borderColor: 'rgba(59,130,246,0.2)'}}>
              {totalSesi} sesi
            </span>
          </div>

          <table className="quiz-table">
            <thead>
              <tr>
                <th>PIN Sesi</th>
                <th>Nama Kuis</th>
                <th>Status</th>
                <th>Waktu Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sessions && sessions.length > 0 ? (
                sessions.map((sess: any) => (
                  <tr key={sess.id}>
                    <td>
                      <div className="quiz-title-cell" style={{fontFamily: 'monospace', fontSize: '16px', letterSpacing: '2px'}}>
                        {sess.pin}
                      </div>
                    </td>
                    <td>{sess.quizzes?.title || "Kuis Dihapus"}</td>
                    <td>
                      {sess.status === 'waiting' && <span className="status-badge status-waiting">Menunggu Peserta</span>}
                      {sess.status === 'playing' && <span className="status-badge status-playing">🟢 Sedang Live</span>}
                      {sess.status === 'completed' && <span className="status-badge status-completed">Selesai</span>}
                    </td>
                    <td>
                      <span className="date-badge">{formatDate(sess.created_at)}</span>
                    </td>
                    <td>
                      <div className="action-cell">
                        {/* Kalau masih 'waiting', arahkan balik ke Ruang Tunggu Host. Kalau 'playing'/'completed', arahkan ke Leaderboard */}
                        <Link 
                          href={sess.status === 'waiting' ? `/host/${sess.id}` : `/leaderboard/${sess.id}`} 
                          className="create-btn" 
                          style={{padding: '6px 14px', fontSize: '11px', background: sess.status === 'waiting' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #3B82F6, #2563EB)'}}
                        >
                          {sess.status === 'waiting' ? 'Kembali ke Lobby' : '📊 Lihat Leaderboard'}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-icon">📡</div>
                      <p className="empty-text">Belum ada sesi yang dijalankan. Klik "Host Live" pada kuis di atas untuk memulai!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
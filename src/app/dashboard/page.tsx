import { supabase } from "@/lib/supabase";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import LeaderboardButton from "./LeaderboardButton";
import HostButton from "./HostButton";

export const dynamic = 'force-dynamic';

// Tambahkan searchParams untuk menangkap URL ?page=X
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const itemsPerPage = 5; // Silakan ubah angka ini kalau mau nampilin 10 atau lebih per halaman

  // 1. Ambil Data Kuis (Bank Soal - Tetap tampil semua)
  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error("Gagal mengambil data kuis:", error);

  // 2. Ambil Data Sesi (DENGAN PAGINATION & HITUNG TOTAL)
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data: sessions, count: totalSesiCount } = await supabase
    .from('game_sessions')
    .select('*, quizzes(title)', { count: 'exact' }) // Hitung total baris di database
    .order('created_at', { ascending: false })
    .range(from, to); // Batasi data yang ditarik

  const totalKuis = quizzes ? quizzes.length : 0;
  const totalSesi = totalSesiCount || 0;
  const totalPages = Math.ceil(totalSesi / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        /* ─── Animations ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .dash-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeIn .35s ease both;
        }

        /* ─── Header ─── */
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 14px;
          flex-wrap: wrap;
          animation: fadeUp .4s ease both;
        }
        .dash-heading {
          font-size: 20px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.025em;
          margin-bottom: 4px;
        }
        @media (min-width: 640px) { .dash-heading { font-size: 24px; } }
        .dash-subheading {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }

        .create-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #E3001B, #CC0017);
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 800;
          padding: 10px 18px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .create-btn::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent);
          pointer-events:none;
        }
        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(227,0,27,0.4);
        }
        .create-btn:active { transform: translateY(0); }

        /* ─── Stats ─── */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
          animation: fadeUp .4s .08s ease both;
        }
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 18px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        @media (min-width: 640px) { .stat-card { padding: 20px 24px; border-radius: 16px; } }
        .stat-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .stat-card::before {
          content:''; position:absolute; top:0;left:0;right:0; height:2px;
        }
        .stat-card.red::before   { background: linear-gradient(90deg, #E3001B, #FF6B35); }
        .stat-card.blue::before  { background: linear-gradient(90deg, #3B82F6, #6366F1); }
        .stat-card.green::before { background: linear-gradient(90deg, #10B981, #34D399); }
        .stat-card.full-mobile { grid-column: 1 / -1; }
        @media (min-width: 640px) { .stat-card.full-mobile { grid-column: auto; } }

        .stat-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        @media (min-width: 640px) { .stat-label { font-size: 11px; margin-bottom: 10px; } }
        .stat-value-row { display: flex; align-items: flex-end; gap: 6px; }
        .stat-num {
          font-size: 26px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        @media (min-width: 640px) { .stat-num { font-size: 32px; } }
        .stat-num.red { color: #FF4D5E; }
        .stat-icon { font-size: 16px; margin-bottom: 2px; opacity: 0.6; }
        @media (min-width: 640px) { .stat-icon { font-size: 18px; margin-bottom: 3px; } }

        /* ─── Table Cards ─── */
        .table-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
          animation: fadeUp .4s .14s ease both;
        }
        .table-card + .table-card { animation-delay: .2s; }

        .table-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 10px;
        }
        @media (min-width: 640px) { .table-card-header { padding: 18px 24px; } }
        .table-card-title {
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.01em;
        }
        @media (min-width: 640px) { .table-card-title { font-size: 15px; } }
        .table-count {
          background: rgba(227,0,27,0.12);
          border: 1px solid rgba(227,0,27,0.2);
          color: #FF4D5E;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ─── Desktop Table ─── */
        .quiz-table { width: 100%; border-collapse: collapse; display: none; }
        @media (min-width: 768px) { .quiz-table { display: table; } }

        .quiz-table thead tr { background: rgba(255,255,255,0.02); }
        .quiz-table th {
          padding: 11px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          white-space: nowrap;
        }
        .quiz-table tbody tr {
          border-top: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .quiz-table tbody tr:hover { background: rgba(255,255,255,0.03); }
        .quiz-table td {
          padding: 13px 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          vertical-align: middle;
        }
        .quiz-title-cell {
          font-weight: 700;
          color: #fff !important;
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .quiz-dot {
          width: 7px; height: 7px;
          background: #E3001B;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .date-badge {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 9px;
          border-radius: 6px;
          white-space: nowrap;
        }
        .action-cell { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }

        /* ─── Mobile Cards ─── */
        .mobile-list { display: flex; flex-direction: column; gap: 0; }
        @media (min-width: 768px) { .mobile-list { display: none; } }

        .mobile-row {
          padding: 16px 18px;
          border-top: 1px solid rgba(255,255,255,0.05);
          transition: background .15s;
        }
        .mobile-row:first-child { border-top: none; }
        .mobile-row:hover { background: rgba(255,255,255,.025); }

        .mobile-row-top {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px;
        }
        .mobile-row-title {
          display: flex; align-items: flex-start; gap: 8px; flex: 1; min-width: 0;
        }
        .mobile-title-text {
          font-size: 14px; font-weight: 700; color: #fff; line-height: 1.3; word-break: break-word;
        }
        .mobile-desc {
          font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,.3);
          margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px;
        }
        .mobile-row-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
        .mobile-row-actions { display: flex; gap: 6px; flex-wrap: wrap; }

        /* ─── Action Buttons ─── */
        .btn-action {
          display: inline-flex; align-items: center; gap: 5px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 7px; text-decoration: none;
          transition: all .15s; white-space: nowrap; letter-spacing: .01em; cursor: pointer; border: none;
        }
        .btn-edit-quiz { background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.22) !important; color: #93C5FD; }
        .btn-edit-quiz:hover { background: rgba(59,130,246,.18); }
        .btn-edit-soal { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,.1) !important; color: rgba(255,255,255,.6); }
        .btn-edit-soal:hover { background: rgba(255,255,255,.1); color: #fff; }
        .btn-lobby { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.25) !important; color: #FCD34D; }
        .btn-lobby:hover { background: rgba(245,158,11,.18); }

        /* ─── Status Badges ─── */
        .status-badge {
          font-size: 10px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.05em; padding: 4px 9px; border-radius: 6px; display: inline-block; white-space: nowrap;
        }
        .status-waiting  { background: rgba(245,158,11,0.12); color: #F59E0B; border: 1px solid rgba(245,158,11,0.25); }
        .status-playing  { background: rgba(16,185,129,0.12); color: #10B981; border: 1px solid rgba(16,185,129,0.25); }
        .status-completed{ background: rgba(59,130,246,0.12); color: #3B82F6; border: 1px solid rgba(59,130,246,0.25); }

        .pin-mono { font-family: monospace; font-size: 15px; font-weight: 900; color: #fff; letter-spacing: 3px; display: flex; align-items: center; gap: 8px; }

        /* Empty state */
        .empty-state { padding: 40px 20px; text-align: center; }
        @media (min-width: 640px) { .empty-state { padding: 48px 24px; } }
        .empty-icon { font-size: 34px; margin-bottom: 10px; opacity: 0.35; }
        .empty-text { font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.25); }

        /* ─── PAGINATION STYLES ─── */
        .pagination-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.01);
          flex-wrap: wrap;
          gap: 12px;
        }
        .page-info {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
        }
        .page-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .btn-page {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
          color: #fff; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          text-decoration: none; transition: all 0.2s;
        }
        .btn-page:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .btn-page.disabled { opacity: 0.3; pointer-events: none; }
      `}</style>

      <div className="dash-page">

        {/* ─── Header ─── */}
        <div className="dash-header">
          <div>
            <h1 className="dash-heading">Ringkasan Dashboard</h1>
            <p className="dash-subheading">Kelola seluruh sesi tes Telkom Akses dari sini</p>
          </div>
          <Link href="/dashboard/create" className="create-btn">
            <span style={{fontSize:'15px'}}>+</span> Buat Kuis Baru
          </Link>
        </div>

        {/* ─── Stats ─── */}
        <div className="stats-grid">
          <div className="stat-card red">
            <p className="stat-label">Total Kuis</p>
            <div className="stat-value-row">
              <span className="stat-num red">{totalKuis}</span>
              <span className="stat-icon">📋</span>
            </div>
          </div>
          <div className="stat-card blue">
            <p className="stat-label">Total Sesi</p>
            <div className="stat-value-row">
              <span className="stat-num">{totalSesi}</span>
              <span className="stat-icon">🎮</span>
            </div>
          </div>
          <div className="stat-card green full-mobile">
            <p className="stat-label">Keandalan Sistem</p>
            <div className="stat-value-row">
              <span className="stat-num">100<span style={{fontSize:'16px'}}>%</span></span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            TABEL 1: BANK SOAL
        ══════════════════════════════ */}
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">📚 Bank Soal</span>
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
                        <span className="quiz-dot"/>
                        {quiz.title}
                      </div>
                    </td>
                    <td style={{maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {quiz.description || <span style={{opacity:.3}}>—</span>}
                    </td>
                    <td><span className="date-badge">{formatDate(quiz.created_at)}</span></td>
                    <td>
                      <div className="action-cell">
                        <Link href={`/dashboard/quiz/${quiz.id}/edit`} className="btn-action btn-edit-quiz">⚙️ Edit Kuis</Link>
                        <Link href={`/dashboard/quiz/${quiz.id}`} className="btn-action btn-edit-soal">✏️ Edit Soal</Link>
                        <HostButton quizId={quiz.id} />
                        <DeleteButton id={quiz.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">📭</div><p className="empty-text">Belum ada kuis. Buat kuis pertama Anda!</p></div></td></tr>
              )}
            </tbody>
          </table>

          {/* Mobile List untuk Bank Soal... */}
          <div className="mobile-list">
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="mobile-row">
                  <div className="mobile-row-top">
                    <div className="mobile-row-title">
                      <span className="quiz-dot" style={{marginTop:'5px'}}/>
                      <div>
                        <div className="mobile-title-text">{quiz.title}</div>
                        {quiz.description && <div className="mobile-desc">{quiz.description}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="mobile-row-meta">
                    <span className="date-badge">{formatDate(quiz.created_at)}</span>
                  </div>
                  <div className="mobile-row-actions">
                    <Link href={`/dashboard/quiz/${quiz.id}/edit`} className="btn-action btn-edit-quiz">⚙️ Edit</Link>
                    <Link href={`/dashboard/quiz/${quiz.id}`} className="btn-action btn-edit-soal">✏️ Soal</Link>
                    <HostButton quizId={quiz.id} />
                    <DeleteButton id={quiz.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state"><div className="empty-icon">📭</div><p className="empty-text">Belum ada kuis.</p></div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════
            TABEL 2: PEMANTAUAN SESI
        ══════════════════════════════ */}
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">📡 Pemantauan Sesi</span>
            <span className="table-count" style={{background:'rgba(59,130,246,.12)',color:'#3B82F6',borderColor:'rgba(59,130,246,.2)'}}>
              {totalSesi} sesi
            </span>
          </div>

          {/* Desktop Table */}
          <table className="quiz-table">
            <thead>
              <tr>
                <th>PIN</th>
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
                      <div className="pin-mono">
                        <span className="quiz-dot" style={{background:'#3B82F6'}}/>
                        {sess.pin}
                      </div>
                    </td>
                    <td style={{maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {sess.quizzes?.title || <span style={{opacity:.4}}>Kuis Dihapus</span>}
                    </td>
                    <td>
                      {sess.status === 'waiting'   && <span className="status-badge status-waiting">⏳ Menunggu</span>}
                      {sess.status === 'playing'   && <span className="status-badge status-playing">🟢 Live</span>}
                      {sess.status === 'completed' && <span className="status-badge status-completed">✓ Selesai</span>}
                    </td>
                    <td><span className="date-badge">{formatDate(sess.created_at)}</span></td>
                    <td>
                      <div className="action-cell">
                        {sess.status === 'waiting' ? (
                          <Link href={`/host/${sess.id}`} className="btn-action btn-lobby">🚀 Masuk Lobby</Link>
                        ) : (
                          <LeaderboardButton sessionId={sess.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">📡</div><p className="empty-text">Belum ada sesi. Klik "▶ Host Live" untuk memulai!</p></div></td></tr>
              )}
            </tbody>
          </table>

          {/* Mobile Card List */}
          <div className="mobile-list">
            {sessions && sessions.length > 0 ? (
              sessions.map((sess: any) => (
                <div key={sess.id} className="mobile-row">
                  <div className="mobile-row-top">
                    <div style={{flex:1}}>
                      <div className="pin-mono" style={{marginBottom:'6px'}}>
                        <span className="quiz-dot" style={{background:'#3B82F6'}}/>
                        {sess.pin}
                      </div>
                      <div style={{fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,.6)'}}>
                        {sess.quizzes?.title || <span style={{opacity:.5}}>Kuis Dihapus</span>}
                      </div>
                    </div>
                    <div>
                      {sess.status === 'waiting'   && <span className="status-badge status-waiting">⏳ Menunggu</span>}
                      {sess.status === 'playing'   && <span className="status-badge status-playing">🟢 Live</span>}
                      {sess.status === 'completed' && <span className="status-badge status-completed">✓ Selesai</span>}
                    </div>
                  </div>
                  <div className="mobile-row-meta">
                    <span className="date-badge">{formatDate(sess.created_at)}</span>
                  </div>
                  <div className="mobile-row-actions">
                    {sess.status === 'waiting' ? (
                      <Link href={`/host/${sess.id}`} className="btn-action btn-lobby">🚀 Masuk Lobby</Link>
                    ) : (
                      <LeaderboardButton sessionId={sess.id} />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state"><div className="empty-icon">📡</div><p className="empty-text">Belum ada sesi.</p></div>
            )}
          </div>

          {/* KONTROL PAGINATION MUNCUL DI SINI! */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="page-info">
                Menampilkan {from + 1}-{Math.min(to + 1, totalSesi)} dari {totalSesi} sesi
              </div>
              <div className="page-buttons">
                <Link 
                  href={`/dashboard?page=${page - 1}`} 
                  className={`btn-page ${page <= 1 ? 'disabled' : ''}`}
                  scroll={false} 
                >
                  &larr; Prev
                </Link>
                <div style={{fontSize:'11px', fontWeight:800, color:'rgba(255,255,255,0.4)', padding:'0 10px'}}>
                  HAL {page} / {totalPages}
                </div>
                <Link 
                  href={`/dashboard?page=${page + 1}`} 
                  className={`btn-page ${page >= totalPages ? 'disabled' : ''}`}
                  scroll={false} 
                >
                  Next &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
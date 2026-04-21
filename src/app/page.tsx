'use client'

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('id')
      .eq('pin', pin)
      .eq('status', 'waiting')
      .single();

    if (sessionError || !session) {
      alert("PIN tidak valid, atau game sudah dimulai/selesai!");
      setLoading(false);
      return;
    }

    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert([{ session_id: session.id, nickname: nickname, score: 0 }])
      .select()
      .single();

    if (participantError) {
      alert("Gagal bergabung: " + participantError.message);
      setLoading(false);
      return;
    }

    router.push(`/play/${session.id}?participantId=${participant.id}`);
  };

  return (
    <>
      <style>{`
        /* Import Google Fonts & Bootstrap Icons */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --telkom-red: #E3001B;
          --telkom-red-dark: #B8001A;
          --telkom-red-light: #FF1A35;
          --telkom-dark: #1A1A2E;
          --telkom-navy: #0D0D1A;
          --accent-gray: #F4F4F6;
          --text-muted: #6B7280;
          --white: #FFFFFF;
        }

        .page-wrapper {
          min-height: 100vh;
          background: #0B0B14;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background glow */
        .bg-glow-red {
          position: fixed;
          top: -200px;
          right: -200px;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(227, 0, 27, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .bg-glow-blue {
          position: fixed;
          bottom: -300px;
          left: -200px;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Grid texture overlay */
        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* ─── NAVBAR ─── */
        .navbar {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          height: 80px;
          background: rgba(11, 11, 20, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navbar-logo {
          height: 36px; /* Tinggi logo di pojok kiri atas */
          width: auto;
          object-fit: contain;
        }

        .app-name {
          font-size: 22px;
          font-weight: 900;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.02em;
        }
        .app-name span {
          color: var(--telkom-red);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-login-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 10px 20px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .nav-login-btn:hover {
          color: var(--white);
          border-color: rgba(227, 0, 27, 0.5);
          background: rgba(227, 0, 27, 0.08);
        }

        /* Logo kanan atas (Tetap dipertahankan kalau kamu butuh) */
        .header-logo {
          height: 40px; 
          width: auto;
          object-fit: contain;
        }

        /* ─── MAIN LAYOUT ─── */
        .main-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: 48px 24px;
          gap: 64px;
        }

        @media (min-width: 1024px) {
          .main-content {
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 80px;
            padding: 48px 80px;
          }
        }

        /* ─── LEFT: HERO TEXT ─── */
        .hero-section {
          flex: 1;
          max-width: 560px;
          text-align: center;
        }
        @media (min-width: 1024px) {
          .hero-section { text-align: left; }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(227, 0, 27, 0.12);
          border: 1px solid rgba(227, 0, 27, 0.3);
          color: #FF4D5E;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 24px;
        }
        
        .badge i {
          font-size: 14px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 900;
          line-height: 1.05;
          color: var(--white);
          margin-bottom: 20px;
          letter-spacing: -0.03em;
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, #FF1A35, #FF6B35);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
          margin-bottom: 36px;
          max-width: 460px;
        }
        @media (min-width: 1024px) {
          .hero-desc { margin-left: 0; margin-right: 0; }
        }

        .feature-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .feature-pills { justify-content: flex-start; }
        }
        .pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 100px;
        }
        .pill-icon { color: #4ADE80; font-size: 16px; }

        /* ─── RIGHT: FORM CARD ─── */
        .card-wrapper {
          width: 100%;
          max-width: 420px;
          flex-shrink: 0;
        }

        .join-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px 32px;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }
        /* Card top accent line */
        .join-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--telkom-red), #FF6B35, var(--telkom-red));
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .card-header {
          text-align: center;
          margin-bottom: 28px;
        }
        
        .card-logo {
          height: 52px; /* Tinggi logo di dalam form */
          width: auto;
          object-fit: contain;
          margin: 0 auto 16px;
          display: block;
        }

        .card-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .card-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.4);
        }

        .form-group {
          margin-bottom: 18px;
        }
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: rgba(255,255,255,0.4);
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 14px 16px 14px 50px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--white);
          outline: none;
          transition: all 0.2s ease;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; }
        .form-input:focus {
          border-color: rgba(227, 0, 27, 0.6);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 4px rgba(227, 0, 27, 0.08);
        }
        .pin-input {
          text-align: center;
          font-size: 24px;
          letter-spacing: 0.25em;
          padding-left: 50px;
        }

        .submit-btn {
          width: 100%;
          margin-top: 8px;
          padding: 15px;
          background: linear-gradient(135deg, var(--telkom-red), #CC0017);
          border: none;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: var(--white);
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(227, 0, 27, 0.4);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.3);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn-arrow { font-size: 18px; transition: transform 0.2s; }
        .submit-btn:hover:not(:disabled) .btn-arrow { transform: translateX(6px); }

        /* Loading spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── FOOTER ─── */
        .footer {
          position: relative;
          z-index: 5;
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          border-top: 1px solid rgba(255,255,255,0.04);
          font-family: 'DM Sans', sans-serif;
        }

        /* Stats strip */
        .stats-strip {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 900;
          color: var(--white);
          letter-spacing: -0.02em;
        }
        .stat-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }
        .stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.08);
          align-self: center;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="bg-glow-red" />
        <div className="bg-glow-blue" />
        <div className="bg-grid" />

        {/* ─── NAVBAR ─── */}
        <header className="navbar">
          {/* Kiri: Logo Asset & Judul Aplikasi */}
          <div className="nav-left">
            <img src="/assets/telkom.png" alt="Logo Telkom" className="navbar-logo" />
            <div className="app-name">Quiz <span>Telkom</span></div>
          </div>

          {/* Kanan: Tombol Login Guru & Logo (kalau butuh 2 logo) */}
          <div className="nav-right">
            <Link href="/login" className="nav-login-btn">
              <i className="bi bi-person-workspace"></i>
              Masuk Pengawas
            </Link>
            {/* <img src="/assets/telkom.png" alt="Logo Telkom" className="header-logo" /> */}
          </div>
        </header>

        {/* ─── MAIN ─── */}
        <main className="main-content">

          {/* LEFT: Hero */}
          <div className="hero-section">
            <div className="badge">
              <i className="bi bi-record-circle"></i>
              Telkom Akses
            </div>

            <h1 className="hero-title">
              Uji Kemampuan<br />
              <span className="highlight">Terbaikmu</span> Di Sini
            </h1>

            <p className="hero-desc">
              Platform kuis interaktif resmi untuk seleksi Telkom Akses. Masukkan PIN dari pengawas, jawab setiap soal dengan cepat dan tepat, dan buktikan kompetensimu.
            </p>

            <div className="stats-strip" style={{marginBottom: '28px'}}>
              <div className="stat-item">
                <span className="stat-value">Real-time</span>
                <span className="stat-label">Penilaian</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">Aman</span>
                <span className="stat-label">Terenkripsi</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">Resmi</span>
                <span className="stat-label">Telkom Group</span>
              </div>
            </div>

            <div className="feature-pills">
              <span className="pill"><i className="bi bi-check-circle-fill pill-icon"></i> Tanpa Registrasi</span>
              <span className="pill"><i className="bi bi-rocket-takeoff-fill pill-icon"></i> Langsung Mulai</span>
              <span className="pill"><i className="bi bi-bar-chart-fill pill-icon"></i> Skor Otomatis</span>
            </div>
          </div>

          {/* RIGHT: Form Card */}
          <div className="card-wrapper">
            <div className="join-card">
              <div className="card-header">
                {/* Logo ditambahkan di atas Mulai Tes */}
                <img src="/assets/telkom.png" alt="Logo Telkom" className="card-logo" />
                <h2 className="card-title">Mulai Tes</h2>
                <p className="card-subtitle">Masukkan PIN dan nama lengkap Anda</p>
              </div>

              <form onSubmit={handleJoin}>
                <div className="form-group">
                  <label className="form-label">PIN Sesi Tes</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <i className="bi bi-key-fill"></i>
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="••••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="form-input pin-input"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda..."
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? (
                    <div className="btn-inner">
                      <div className="spinner" />
                      Memverifikasi...
                    </div>
                  ) : (
                    <div className="btn-inner">
                      Masuk ke Ruang Tes
                      <span className="btn-arrow"><i className="bi bi-arrow-right"></i></span>
                    </div>
                  )}
                </button>
              </form>
            </div>

            <p style={{textAlign:'center', marginTop:'16px', fontSize:'12px', color:'rgba(255,255,255,0.25)', fontFamily:"'DM Sans', sans-serif"}}>
              Butuh bantuan? Hubungi pengawas ruangan Anda
            </p>
          </div>

        </main>

        {/* FOOTER */}
        <footer className="footer">
          © {new Date().getFullYear()} PT Telkom Akses — Seluruh hak dilindungi. Platform Tes Internal.
        </footer>
      </div>
    </>
  );
}
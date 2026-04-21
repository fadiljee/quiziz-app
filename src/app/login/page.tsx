'use client'

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Gagal Login: Email atau password salah!");
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --red: #E3001B; }

        .login-page {
          min-height: 100vh;
          background: #0B0B14;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .bg-glow-center {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(227,0,27,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Side panel - desktop only */
        .side-panel {
          display: none;
        }
        @media (min-width: 1024px) {
          .side-panel {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 64px 56px;
            flex: 1;
            position: relative;
            z-index: 5;
          }
        }

        .side-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(227,0,27,0.1);
          border: 1px solid rgba(227,0,27,0.25);
          color: #FF4D5E;
          font-size: 11px; font-weight: 700;
          padding: 6px 14px;
          border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 28px;
          width: fit-content;
        }
        .side-dot {
          width: 6px; height: 6px;
          background: var(--red); border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.5;transform:scale(.8)}
        }

        .side-title {
          font-size: clamp(32px, 3vw, 52px);
          font-weight: 900; line-height: 1.08;
          color: #fff; letter-spacing: -0.03em;
          margin-bottom: 18px;
        }
        .side-title .red { color: var(--red); }

        .side-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.7;
          color: rgba(255,255,255,0.4);
          max-width: 380px; margin-bottom: 40px;
        }

        .feature-list { display: flex; flex-direction: column; gap: 14px; }
        .feature-item {
          display: flex; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.55); font-size: 14px; font-weight: 500;
        }
        .feature-check {
          width: 28px; height: 28px;
          background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
        }

        .page-divider { display: none; }
        @media (min-width: 1024px) {
          .page-divider {
            display: block; width: 1px;
            background: rgba(255,255,255,0.06);
            align-self: stretch; margin: 48px 0;
            position: relative; z-index: 5;
          }
        }

        /* Auth panel */
        .auth-panel {
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 32px 24px; flex: 1;
          position: relative; z-index: 5;
          min-height: 100vh;
        }
        @media (min-width: 1024px) {
          .auth-panel { padding: 64px 56px; min-height: unset; max-width: 520px; }
        }

        .auth-inner { width: 100%; max-width: 400px; }

        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-decoration: none; margin-bottom: 36px;
          transition: color 0.2s; letter-spacing: 0.01em;
        }
        .back-link:hover { color: rgba(255,255,255,0.7); }
        .back-arrow {
          width: 28px; height: 28px;
          background: rgba(255,255,255,0.06); border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; transition: background 0.2s;
        }
        .back-link:hover .back-arrow { background: rgba(255,255,255,0.1); }

        .auth-header { margin-bottom: 32px; }

        .auth-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 24px;
        }
        .auth-logo-svg { height: 28px; width: auto; }
        .auth-logo-divider { width: 1px; height: 22px; background: rgba(255,255,255,0.12); }
        .auth-logo-label {
          font-size: 13px; font-weight: 700;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        .auth-title {
          font-size: 28px; font-weight: 900;
          color: #fff; letter-spacing: -0.025em; margin-bottom: 6px;
        }
        .auth-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: rgba(255,255,255,0.38);
        }

        /* Form */
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block; font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;
        }
        .input-wrapper { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 15px; color: rgba(255,255,255,0.25); pointer-events: none;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 13px 14px 13px 44px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 500; color: #fff;
          outline: none; transition: all 0.2s ease;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.18); }
        .form-input:focus {
          border-color: rgba(227,0,27,0.55);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 4px rgba(227,0,27,0.08);
        }

        .pw-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); font-size: 16px; padding: 0;
          transition: color 0.2s;
        }
        .pw-toggle:hover { color: rgba(255,255,255,0.6); }

        .submit-btn {
          width: 100%; margin-top: 8px; padding: 14px;
          background: linear-gradient(135deg, var(--red), #CC0017);
          border: none; border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 800; color: #fff;
          cursor: pointer; transition: all 0.2s ease;
          letter-spacing: 0.02em; position: relative; overflow: hidden;
        }
        .submit-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent);
          pointer-events:none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(227,0,27,0.4);
        }
        .submit-btn:disabled {
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.25);
          cursor: not-allowed; transform: none; box-shadow: none;
        }
        .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-arrow { font-size: 16px; transition: transform 0.2s; }
        .submit-btn:hover:not(:disabled) .btn-arrow { transform: translateX(4px); }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .security-note {
          margin-top: 24px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="login-page">
        <div className="bg-glow-center"/>
        <div className="bg-grid"/>

        <div style={{display:'flex', flex:1, position:'relative', zIndex:5}}>

          {/* Left panel */}
          <div className="side-panel">
            <div className="side-badge">
              <span className="side-dot"/>
              Portal Admin
            </div>
            <h1 className="side-title">
              Kelola Tes<br/>dengan <span className="red">Mudah</span>
            </h1>
            <p className="side-desc">
              Dashboard pengawas untuk membuat sesi tes, memantau peserta secara real-time, dan menganalisis hasil seleksi Telkom Akses.
            </p>
            <div className="feature-list">
              {[
                "Buat & kelola sesi kuis dengan PIN",
                "Pantau peserta secara real-time",
                "Lihat hasil & skor otomatis",
                "Analisis performa per peserta",
              ].map((f, i) => (
                <div className="feature-item" key={i}>
                  <span className="feature-check">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="page-divider"/>

          {/* Auth form */}
          <div className="auth-panel">
            <div className="auth-inner">

              <Link href="/" className="back-link">
                <span className="back-arrow">←</span>
                Kembali ke Beranda
              </Link>

              <div className="auth-header">
                <div className="auth-logo">
                  <svg className="auth-logo-svg" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C29.5 44 34.5 41.8 38.1 38.1L32.3 32.3C30.1 34.5 27.2 36 24 36C17.4 36 12 30.6 12 24C12 17.4 17.4 12 24 12C30.6 12 36 17.4 36 24C36 25.5 35.7 26.9 35.2 28.2L43 28.2C43.6 26.9 44 25.5 44 24C44 13 35 4 24 4Z" fill="#E3001B"/>
                    <path d="M36 24C36 30.6 30.6 36 24 36L24 44C35 44 44 35 44 24L36 24Z" fill="#CC0017" opacity="0.7"/>
                    <text x="52" y="31" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900" fill="#FFFFFF" letterSpacing="0.5">TELKOM</text>
                    <text x="53" y="42" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="500" fill="rgba(255,255,255,0.5)" letterSpacing="2">INDONESIA</text>
                  </svg>
                  <div className="auth-logo-divider"/>
                  <span className="auth-logo-label">Quiz Akses</span>
                </div>
                <h1 className="auth-title">Selamat Datang</h1>
                <p className="auth-subtitle">Masuk untuk mengelola sesi tes Anda</p>
              </div>

              <form onSubmit={handleAuth}>
                <div className="form-group">
                  <label className="form-label">Alamat Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉️</span>
                    <input
                      type="email" required
                      placeholder="nama@telkom.co.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      style={{paddingRight:'44px'}}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? (
                    <div className="btn-inner"><div className="spinner"/>Memproses...</div>
                  ) : (
                    <div className="btn-inner">Masuk ke Dashboard<span className="btn-arrow">→</span></div>
                  )}
                </button>
              </form>

              <div className="security-note">
                <span>🔐</span>
                Akses dibatasi untuk pengawas & admin resmi
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
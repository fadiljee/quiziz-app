'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setEmail(session.user.email || "");
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isChecking) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;900&display=swap');
          .checking-screen {
            min-height: 100vh;
            background: #0B0B14;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .checking-spinner {
            width: 36px; height: 36px;
            border: 3px solid rgba(227,0,27,0.2);
            border-top-color: #E3001B;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .checking-text {
            font-size: 14px;
            font-weight: 700;
            color: rgba(255,255,255,0.3);
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
        `}</style>
        <div className="checking-screen">
          <div className="checking-spinner" />
          <span className="checking-text">Memeriksa Keamanan…</span>
        </div>
      </>
    );
  }

  const shortEmail = email.length > 24 ? email.slice(0, 24) + '…' : email;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .dash-wrapper {
          min-height: 100vh;
          background: #0B0B14;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
        }
        /* Subtle background grid */
        .dash-wrapper::before {
          content:'';
          position:fixed;inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events:none;
          z-index:0;
        }
        /* Red corner glow */
        .dash-wrapper::after {
          content:'';
          position:fixed;
          top:-200px;right:-200px;
          width:600px;height:600px;
          background:radial-gradient(circle, rgba(227,0,27,0.08) 0%, transparent 70%);
          pointer-events:none;
          z-index:0;
        }

        /* ─── NAVBAR ─── */
        .dash-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          height: 64px;
          background: rgba(11,11,20,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nav-left { display: flex; align-items: center; gap: 16px; }

        .nav-logo-svg { height: 30px; width: auto; }
        .nav-divider { width:1px; height:22px; background:rgba(255,255,255,0.1); }
        .nav-section {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .nav-section-dot {
          width:6px;height:6px;
          background:#E3001B;
          border-radius:50%;
        }

        .nav-right { display: flex; align-items: center; gap: 10px; }

        .nav-email {
          display: none;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px;
          padding: 6px 14px 6px 8px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
        }
        @media (min-width: 640px) { .nav-email { display: flex; } }
        .nav-avatar {
          width: 24px; height: 24px;
          background: rgba(227,0,27,0.15);
          border: 1px solid rgba(227,0,27,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(227,0,27,0.08);
          border: 1px solid rgba(227,0,27,0.2);
          color: #FF4D5E;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 7px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .logout-btn:hover {
          background: rgba(227,0,27,0.15);
          border-color: rgba(227,0,27,0.4);
          color: #FF2D44;
        }

        /* Breadcrumb bar */
        .dash-breadcrumb {
          position: relative;
          z-index: 5;
          padding: 10px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
        }
        .crumb-link {
          color: rgba(255,255,255,0.25);
          text-decoration: none;
          transition: color 0.15s;
        }
        .crumb-link:hover { color: rgba(255,255,255,0.5); }
        .crumb-active { color: rgba(255,255,255,0.55); font-weight: 600; }

        /* Main content */
        .dash-main {
          position: relative;
          z-index: 5;
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }
      `}</style>

      <div className="dash-wrapper">
        {/* ─── NAVBAR ─── */}
        <nav className="dash-nav">
          <div className="nav-left">
            {/* Telkom Logo */}
            <svg className="nav-logo-svg" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C29.5 44 34.5 41.8 38.1 38.1L32.3 32.3C30.1 34.5 27.2 36 24 36C17.4 36 12 30.6 12 24C12 17.4 17.4 12 24 12C30.6 12 36 17.4 36 24C36 25.5 35.7 26.9 35.2 28.2L43 28.2C43.6 26.9 44 25.5 44 24C44 13 35 4 24 4Z" fill="#E3001B"/>
              <path d="M36 24C36 30.6 30.6 36 24 36L24 44C35 44 44 35 44 24L36 24Z" fill="#CC0017" opacity="0.7"/>
              <text x="52" y="31" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900" fill="#FFFFFF" letterSpacing="0.5">TELKOM</text>
              <text x="53" y="42" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="500" fill="rgba(255,255,255,0.5)" letterSpacing="2">INDONESIA</text>
            </svg>
            <div className="nav-divider" />
            <div className="nav-section">
              <span className="nav-section-dot" />
              Admin Dashboard
            </div>
          </div>

          <div className="nav-right">
            <div className="nav-email">
              <div className="nav-avatar">👤</div>
              {shortEmail}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span>⎋</span>
              Keluar
            </button>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="dash-breadcrumb">
          <Link href="/" className="crumb-link">Beranda</Link>
          <span>›</span>
          <span className="crumb-active">Dashboard</span>
        </div>

        {/* Page content */}
        <main className="dash-main">
          {children}
        </main>
      </div>
    </>
  );
}
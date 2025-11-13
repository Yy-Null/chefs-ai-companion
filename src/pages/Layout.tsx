// src/pages/Layout.tsx (更新后)

import React from 'react';
import { Outlet, Link } from 'react-router-dom';

interface LayoutProps {
    onOpenPreferences: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onOpenPreferences }) => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1>スマートレシピ帳</h1>
                </Link>
                <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>ホーム</Link>
                    <Link to="/new" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>作成</Link>
                    <button onClick={onOpenPreferences}>⚙️ 好み設定</button>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer style={{ marginTop: '40px', textAlign: 'center', color: '#888', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <p>© 2024 Chefs AI Companion</p>
            </footer>
        </div>
    );
};

export default Layout;
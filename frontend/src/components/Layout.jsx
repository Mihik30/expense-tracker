// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
// import './Layout.css'; // CSS should be imported in App.jsx or here

const Layout = ({ children, handleLogout }) => {
    return (
        <div className="app-layout">
            <Sidebar onLogout={handleLogout} />
            <main className="main-content-area">
                {children}
            </main>
        </div>
    );
};

export default Layout;
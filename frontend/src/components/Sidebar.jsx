// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
// import './Sidebar.css'; // CSS should be imported in App.jsx or here

const Sidebar = ({ onLogout }) => {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h3>Budget App</h3> {/* Updated Name */}
            </div>
            <ul className="sidebar-nav">
                <li>
                    <NavLink to="/" end>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/transactions">
                        Transactions
                    </NavLink>
                </li>
            </ul>
            <div className="sidebar-footer">
                <button onClick={onLogout} className="logout-button-sidebar">Logout</button>
            </div>
        </nav>
    );
};

export default Sidebar;
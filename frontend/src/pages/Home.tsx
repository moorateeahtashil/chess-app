import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Chess Master 2026</h1>
                <p>The next generation of chess analysis and gameplay.</p>
            </header>

            <main className="home-menu">
                <div className="menu-card" onClick={() => navigate('/play/human-vs-ai')}>
                    <h2>Play vs AI</h2>
                    <p>Challenge our advanced engine.</p>
                </div>

                <div className="menu-card" onClick={() => navigate('/play/ai-vs-ai')}>
                    <h2>AI vs AI</h2>
                    <p>Watch engines battle it out.</p>
                </div>

                <div className="menu-card" onClick={() => navigate('/study')}>
                    <h2>Study Center</h2>
                    <p>Analyze openings and master strategy.</p>
                </div>
            </main>
        </div>
    );
};

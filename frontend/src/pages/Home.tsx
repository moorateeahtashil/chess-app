import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <header className="home-header animate-fade-in">
                    <div className="logo-glow"></div>
                    <h1 className="title-gradient">Chess Master 2026</h1>
                    <p className="subtitle">The next generation of chess analysis and gameplay.</p>
                </header>

                <main className="home-menu">
                    <div className="menu-card glass-card stagger-1" onClick={() => navigate('/play/human-vs-ai')}>
                        <div className="card-icon">👑</div>
                        <div className="card-content">
                            <h2>Play vs AI</h2>
                            <p>Challenge our advanced engine with adaptive difficulty.</p>
                        </div>
                        <div className="card-action">
                            <span className="btn btn--primary">Start Game</span>
                        </div>
                    </div>

                    <div className="menu-card glass-card stagger-2" onClick={() => navigate('/play/ai-vs-ai')}>
                        <div className="card-icon">🤖</div>
                        <div className="card-content">
                            <h2>AI vs AI</h2>
                            <p>Watch engines battle it out in high-speed matches.</p>
                        </div>
                        <div className="card-action">
                            <span className="btn btn--secondary">Watch</span>
                        </div>
                    </div>

                    <div className="menu-card glass-card stagger-3" onClick={() => navigate('/study')}>
                        <div className="card-icon">📚</div>
                        <div className="card-content">
                            <h2>Study Center</h2>
                            <p>Master openings with interactive analysis and statistics.</p>
                        </div>
                        <div className="card-action">
                            <span className="btn btn--gold">Start Learning</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

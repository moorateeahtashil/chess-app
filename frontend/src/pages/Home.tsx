import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Importing hero image if it exists, otherwise it will be handled by CSS or a placeholder
// In a real build, we'd use a try/catch or a conditional require if the file might be missing
import heroImage from '../assets/hero-chess.png';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                {/* Modern Hero Section */}
                <section className="hero-section animate-fade-in shadow-glow">
                    <div className="hero-text">
                        <div className="badge">VERSION 2.0.26</div>
                        <h1 className="title-gradient">Master the Art of Chess</h1>
                        <p className="subtitle">
                            Experience the next generation of chess. Powered by an advanced
                            asynchronous engine, deep analysis, and a structured learning academy.
                        </p>
                        <div className="hero-cta">
                            <button className="btn btn--primary btn--large" onClick={() => navigate('/play/human-vs-ai')}>
                                Play Now
                            </button>
                            <button className="btn btn--glass btn--large" onClick={() => navigate('/study')}>
                                Browse Openings
                            </button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-image-wrapper">
                            <img src={heroImage} alt="Chess Master Hero" className="hero-img floating" onError={(e) => {
                                // Fallback if image doesn't exist yet
                                (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/images/piece/chesscom/wN.png';
                            }} />
                            <div className="hero-reflection"></div>
                        </div>
                    </div>
                </section>

                {/* Primary Game Modes - Horizontal Menu */}
                <main className="home-menu-horizontal">
                    <div className="menu-item glass-card stagger-1" onClick={() => navigate('/play/human-vs-ai')}>
                        <div className="item-icon">👑</div>
                        <div className="item-content">
                            <h3>Play Engine</h3>
                            <p>Adaptive AI difficulty</p>
                        </div>
                    </div>

                    <div className="menu-item glass-card stagger-2" onClick={() => navigate('/play/ai-vs-ai')}>
                        <div className="item-icon">🤖</div>
                        <div className="item-content">
                            <h3>Auto Battle</h3>
                            <p>Watch engines clash</p>
                        </div>
                    </div>

                    <div className="menu-item glass-card stagger-3" onClick={() => navigate('/study')}>
                        <div className="item-icon">📚</div>
                        <div className="item-content">
                            <h3>Academy</h3>
                            <p>Beginner to Master</p>
                        </div>
                    </div>
                </main>

                {/* Feature Highlights Section */}
                <section className="features-highlight stagger-4">
                    <div className="feature-stat glass-card--elevated">
                        <span className="stat-value">Async</span>
                        <span className="stat-label">AI Engine</span>
                    </div>
                    <div className="feature-stat glass-card--elevated">
                        <span className="stat-value">3,000+</span>
                        <span className="stat-label">Openings</span>
                    </div>
                    <div className="feature-stat glass-card--elevated">
                        <span className="stat-value">2.0</span>
                        <span className="stat-label">Stockfish Core</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

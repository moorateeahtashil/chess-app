import React, { useState, useEffect } from 'react';
import { ChessBoard2D } from '../chess/ChessBoard2D';
import { GameState } from '../../store/gameStore';
import './Academy.css';

interface Lesson {
    id: string;
    title: string;
    difficulty: string;
    category: string;
    description: string;
    content: string;
    fen: string;
    estimatedTime: number;
}

const API_BASE = 'http://localhost:8000';

export const Academy: React.FC = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [difficulty, setDifficulty] = useState<string>('Beginner');
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLessons();
    }, [difficulty]);

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/lessons?difficulty=${difficulty}`);
            const data = await response.json();
            setLessons(data.lessons || []);
        } catch (error) {
            console.error('Failed to fetch lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    const difficulties = ['Beginner', 'Intermediate', 'Master'];

    // Helper to create a dummy GameState for the preview board
    const createPreviewState = (fen: string): GameState => ({
        id: 'preview',
        mode: 'human_vs_ai',
        fen: fen,
        status: 'active',
        whiteDifficulty: 'MEDIUM',
        blackDifficulty: 'MEDIUM',
        moveHistory: [],
        evaluation: 0,
        opening: { name: null, eco: null },
        turn: fen.split(' ')[1] === 'w' ? 'white' : 'black',
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
        isDraw: false,
        legalMoves: [],
        isWhiteHuman: true,
        selectedSquare: null,
        highlightedMoves: [],
        lastMove: null,
    });

    return (
        <div className="academy-container">
            <header className="academy-header">
                <h2>Chess Academy</h2>
                <p>Master the game from basics to expert strategies</p>
            </header>

            <div className="difficulty-tabs">
                {difficulties.map((diff) => (
                    <button
                        key={diff}
                        className={`difficulty-tab ${difficulty === diff ? 'active' : ''}`}
                        onClick={() => setDifficulty(diff)}
                    >
                        {diff}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-state">Loading lessons...</div>
            ) : (
                <div className="lessons-grid">
                    {lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className="lesson-card"
                            onClick={() => setSelectedLesson(lesson)}
                        >
                            <span className="lesson-badge">{lesson.category}</span>
                            <h3>{lesson.title}</h3>
                            <p>{lesson.description}</p>
                            <div className="lesson-footer">
                                <div className="lesson-meta">
                                    <span>⏱️ {lesson.estimatedTime}m</span>
                                </div>
                                <button className="lesson-start-btn">Start Lesson</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedLesson && (
                <div className="lesson-modal-overlay" onClick={() => setSelectedLesson(null)}>
                    <div className="lesson-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span className="lesson-badge">{selectedLesson.category}</span>
                                <h2>{selectedLesson.title}</h2>
                            </div>
                            <button className="close-modal" onClick={() => setSelectedLesson(null)}>&times;</button>
                        </div>
                        <div className="modal-content">
                            <div className="lesson-text">
                                <p>{selectedLesson.description}</p>
                                <hr style={{ opacity: 0.1, margin: '20px 0' }} />
                                <p>{selectedLesson.content}</p>
                            </div>
                            <div className="lesson-board-preview">
                                <h4 style={{ marginBottom: '15px' }}>Position Insight</h4>
                                <div style={{ width: '350px', height: '350px' }}>
                                    <ChessBoard2D
                                        gameState={createPreviewState(selectedLesson.fen)}
                                        flipped={selectedLesson.fen.split(' ')[1] === 'b'}
                                    />
                                </div>
                                <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#64748b' }}>
                                    FEN: {selectedLesson.fen}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

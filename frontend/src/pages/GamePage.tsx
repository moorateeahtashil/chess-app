import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChessBoard2D } from '../components/chess/ChessBoard2D';
import { MoveHistory } from '../components/ui/MoveHistory';
import { EvaluationBar } from '../components/ui/EvaluationBar';
import { DifficultySelector } from '../components/ui/DifficultySelector';
import { useChessWebSocket } from '../hooks/useChessWebSocket';
import { useGameStore, Difficulty } from '../store/gameStore';
import './GamePage.css';

export const GamePage: React.FC = () => {
    const { mode } = useParams<{ mode: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isHumanVsAI = mode === 'human-vs-ai';
    const isAIvsAI = mode === 'ai-vs-ai';

    // Parse query params for opening
    const searchParams = new URLSearchParams(location.search);
    const openingEco = searchParams.get('opening');

    const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
    const [whiteDifficulty, setWhiteDifficulty] = useState<Difficulty>('MEDIUM');
    const [blackDifficulty, setBlackDifficulty] = useState<Difficulty>('MEDIUM');
    const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
    const [showSetup, setShowSetup] = useState(true);

    // Get game state from store
    const { game } = useGameStore();

    // Get actions from hook
    const {
        createGame,
        pauseAIGame,
        resumeAIGame,
        stepAIGame
    } = useChessWebSocket();

    const handleStartGame = async () => {
        const config = {
            mode: isHumanVsAI ? 'human_vs_ai' : 'ai_vs_ai',
            difficulty: isHumanVsAI ? difficulty : undefined,
            playerColor: isHumanVsAI ? playerColor : undefined,
            whiteDifficulty: isAIvsAI ? whiteDifficulty : undefined,
            blackDifficulty: isAIvsAI ? blackDifficulty : undefined,
            openingEco: openingEco || undefined
        };

        const newGame = await createGame(config);
        if (newGame) {
            setShowSetup(false);
        }
    };

    const handleNewGame = () => {
        // We can simply show setup again, the store will update when we create a new game
        setShowSetup(true);
    };

    const showEvaluation = true; // Could be a setting

    return (
        <div className="game-page">
            <div className="game-layout">
                {/* Left Panel: Controls & Status */}
                <div className="game-sidebar left">
                    <div className="glass-card sidebar-panel">
                        <div className="panel-header">
                            <button className="btn btn--secondary btn--icon" onClick={() => navigate('/')} title="Back to Home">
                                ←
                            </button>
                            <h3>Menu</h3>
                        </div>

                        {showSetup ? (
                            <div className="setup-content animate-fade-in">
                                <h4 className="section-title">Game Setup</h4>

                                {isHumanVsAI && (
                                    <>
                                        <div className="form-group">
                                            <label>Difficulty</label>
                                            <DifficultySelector value={difficulty} onChange={setDifficulty} />
                                        </div>
                                        <div className="form-group">
                                            <label>Side</label>
                                            <div className="color-selector glass-card">
                                                <button
                                                    className={`selection-btn ${playerColor === 'white' ? 'active' : ''}`}
                                                    onClick={() => setPlayerColor('white')}
                                                >
                                                    White
                                                </button>
                                                <button
                                                    className={`selection-btn ${playerColor === 'black' ? 'active' : ''}`}
                                                    onClick={() => setPlayerColor('black')}
                                                >
                                                    Black
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {isAIvsAI && (
                                    <>
                                        <div className="form-group">
                                            <label>White AI</label>
                                            <DifficultySelector value={whiteDifficulty} onChange={setWhiteDifficulty} />
                                        </div>
                                        <div className="form-group">
                                            <label>Black AI</label>
                                            <DifficultySelector value={blackDifficulty} onChange={setBlackDifficulty} />
                                        </div>
                                    </>
                                )}

                                <button className="btn btn--primary btn--large w-full" onClick={handleStartGame}>
                                    Start Game
                                </button>
                            </div>
                        ) : (
                            <div className="game-status animate-fade-in">
                                <div className={`status-badge ${game.turn === 'white' ? 'white-turn' : 'black-turn'}`}>
                                    {game.turn === 'white' ? "White's Turn" : "Black's Turn"}
                                </div>

                                <div className="status-indicators">
                                    {game.isCheck && <div className="indicator warning animate-pulse">CHECK</div>}
                                    {game.isCheckmate && <div className="indicator danger animate-pulse">CHECKMATE</div>}
                                    {game.isDraw && <div className="indicator info">DRAW</div>}
                                </div>

                                <button className="btn btn--secondary w-full mt-4" onClick={handleNewGame}>
                                    New Game
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center: Board */}
                <div className="game-board-area">
                    {showEvaluation && !showSetup && (
                        <div className="evaluation-wrapper">
                            <EvaluationBar evaluation={game.evaluation} isWhiteToMove={game.turn === 'white'} />
                        </div>
                    )}
                    <div className="board-wrapper glass-card--elevated">
                        {!showSetup ? <ChessBoard2D gameState={game} /> : (
                            <div className="board-placeholder">
                                <div className="placeholder-content">
                                    <span className="placeholder-icon">♟️</span>
                                    <p>Configure game to start</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: History & Analysis */}
                <div className="game-sidebar right">
                    <div className="glass-card sidebar-panel h-full">
                        <div className="panel-header">
                            <h3>History</h3>
                        </div>
                        {!showSetup && <MoveHistory history={game.moveHistory} />}

                        {isAIvsAI && !showSetup && (
                            <div className="ai-controls glass-card--elevated">
                                <button className="btn btn--secondary btn--sm" onClick={pauseAIGame} title="Pause">⏸</button>
                                <button className="btn btn--secondary btn--sm" onClick={resumeAIGame} title="Resume">▶</button>
                                <button className="btn btn--secondary btn--sm" onClick={stepAIGame} title="Step">⏯</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

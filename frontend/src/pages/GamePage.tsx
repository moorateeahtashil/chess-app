import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChessBoard2D } from '../components/chess/ChessBoard2D';
import { MoveHistory } from '../components/ui/MoveHistory';
import { EvaluationBar } from '../components/ui/EvaluationBar';
import { DifficultySelector } from '../components/ui/DifficultySelector';
import { useGameStore, Difficulty } from '../store/gameStore';
import { useChessWebSocket } from '../hooks/useChessWebSocket';
import { useSettingsStore } from '../store/settingsStore';
import './GamePage.css';

export const GamePage: React.FC = () => {
    const { mode } = useParams<{ mode: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { game, isLoading, error, resetGame } = useGameStore();
    const { createGame, pauseAIGame, resumeAIGame, stepAIGame, setAIGameSpeed } = useChessWebSocket();
    const { showEvaluation } = useSettingsStore();

    const [showSetup, setShowSetup] = useState(true);
    const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
    const [whiteDifficulty, setWhiteDifficulty] = useState<Difficulty>('MEDIUM');
    const [blackDifficulty, setBlackDifficulty] = useState<Difficulty>('MEDIUM');
    const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
    const [gameSpeed, setGameSpeed] = useState(1.5);

    const isAIvsAI = mode === 'ai-vs-ai';
    const isHumanVsAI = mode === 'human-vs-ai';

    // Initialize/Reset
    useEffect(() => {
        // Check for opening param
        const params = new URLSearchParams(location.search);
        const openingEco = params.get('opening');

        if (openingEco) {
            // Auto-start if opening provided
            setShowSetup(false);
            if (!game.id && !isLoading) {
                createGame({
                    mode: 'human_vs_ai',
                    difficulty: difficulty,
                    playerColor: 'white',
                    openingEco: openingEco
                });
            }
        } else {
            // Normal flow: show setup if no game
            if (!game.id) {
                setShowSetup(true);
                resetGame();
            }
        }
    }, [location.search, mode, resetGame, createGame, game.id, isLoading, difficulty]);

    const handleStartGame = async () => {
        if (isAIvsAI) {
            await createGame({
                mode: 'ai_vs_ai',
                whiteDifficulty,
                blackDifficulty,
            });
        } else {
            await createGame({
                mode: 'human_vs_ai',
                difficulty,
                playerColor,
            });
        }
        setShowSetup(false);
    };

    const handleNewGame = () => {
        resetGame();
        setShowSetup(true);
        navigate('/');
    };

    return (
        <div className="game-page">
            <div className="game-layout">
                <div className="game-sidebar left">
                    <button className="btn btn-secondary" onClick={handleNewGame}>Back to Menu</button>
                    {showSetup ? (
                        <div className="setup-panel">
                            <h3>Game Setup</h3>
                            {isHumanVsAI && (
                                <>
                                    <label>Difficulty</label>
                                    <DifficultySelector value={difficulty} onChange={setDifficulty} />
                                    <label>Color</label>
                                    <div className="color-selector">
                                        <button className={playerColor === 'white' ? 'active' : ''} onClick={() => setPlayerColor('white')}>White</button>
                                        <button className={playerColor === 'black' ? 'active' : ''} onClick={() => setPlayerColor('black')}>Black</button>
                                    </div>
                                </>
                            )}
                            {isAIvsAI && (
                                <>
                                    <label>White AI</label>
                                    <DifficultySelector value={whiteDifficulty} onChange={setWhiteDifficulty} />
                                    <label>Black AI</label>
                                    <DifficultySelector value={blackDifficulty} onChange={setBlackDifficulty} />
                                </>
                            )}
                            <button className="btn btn-primary" onClick={handleStartGame} disabled={isLoading}>
                                {isLoading ? 'Starting...' : 'Start Game'}
                            </button>
                        </div>
                    ) : (
                        <div className="game-info">
                            <div className="status-badge">{game.status}</div>
                            <div className="turn-indicator">{game.turn}'s Turn</div>
                            {game.isCheck && <div className="warning">CHECK</div>}
                            {game.isCheckmate && <div className="danger">CHECKMATE - {game.turn === 'white' ? 'Black' : 'White'} Wins!</div>}
                        </div>
                    )}
                </div>

                <div className="game-board-area">
                    {showEvaluation && <EvaluationBar evaluation={game.evaluation} isWhiteToMove={game.turn === 'white'} />}
                    <ChessBoard2D />
                </div>

                <div className="game-sidebar right">
                    <MoveHistory history={game.moveHistory} />
                    {isAIvsAI && !showSetup && (
                        <div className="ai-controls">
                            <button onClick={pauseAIGame}>Pause</button>
                            <button onClick={resumeAIGame}>Resume</button>
                            <button onClick={stepAIGame}>Step</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

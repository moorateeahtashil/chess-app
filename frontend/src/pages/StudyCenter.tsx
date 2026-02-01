import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { fetchOpenings, fetchOpeningCategories, fetchAnalysis, useChessWebSocket } from '../hooks/useChessWebSocket';
import { Opening, GameState } from '../store/gameStore';
import { ChessBoard2D } from '../components/chess/ChessBoard2D';
import { EvaluationBar } from '../components/ui/EvaluationBar';
import { MoveHistory } from '../components/ui/MoveHistory';
import './StudyCenter.css';

interface OpeningCategory {
    name: string;
    count: number;
}

interface AnalysisResult {
    fen: string;
    evaluation: number;
    bestMove: string | null;
    depth: number;
}

export const StudyCenter: React.FC = () => {
    const navigate = useNavigate();
    const [openings, setOpenings] = useState<Opening[]>([]);
    const [categories, setCategories] = useState<OpeningCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Analysis State
    const [chess] = useState(() => new Chess());
    const [fen, setFen] = useState(chess.fen());
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Board interaction state override
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [highlightedMoves, setHighlightedMoves] = useState<string[]>([]);
    const [lastMove, setLastMove] = useState<{ from: string, to: string } | null>(null);

    // Hooks
    const { createGame: createGameAction } = useChessWebSocket();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [openingsData, categoriesData] = await Promise.all([
                    fetchOpenings(),
                    fetchOpeningCategories(),
                ]);
                setOpenings(openingsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to load openings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // When opening is selected, reset board
    useEffect(() => {
        if (selectedOpening && selectedOpening.fen) {
            try {
                chess.load(selectedOpening.fen);
                setFen(chess.fen());
                setLastMove(null);
                setHighlightedMoves([]);
                setSelectedSquare(null);
                runAnalysis(selectedOpening.fen);
            } catch (e) {
                console.error("Invalid FEN:", selectedOpening.fen);
            }
        }
    }, [selectedOpening, chess]);

    const runAnalysis = async (currentFen: string) => {
        setIsAnalyzing(true);
        try {
            const result = await fetchAnalysis(currentFen);
            setAnalysis(result);
        } catch (e) {
            console.error("Analysis failed:", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSquareClick = (square: string) => {
        // Simple move logic
        if (selectedSquare) {
            // Try to move
            try {
                const move = chess.move({
                    from: selectedSquare,
                    to: square,
                    promotion: 'q' // Always promote to queen for simplicity in analysis
                });

                if (move) {
                    setFen(chess.fen());
                    setLastMove({ from: move.from, to: move.to });
                    setSelectedSquare(null);
                    setHighlightedMoves([]);

                    // Run analysis on new position
                    runAnalysis(chess.fen());
                    return;
                }
            } catch (e) {
                // Invalid move
            }
        }

        // Select piece
        const piece = chess.get(square as any);
        if (piece) {
            // If clicking same square, deselect
            if (selectedSquare === square) {
                setSelectedSquare(null);
                setHighlightedMoves([]);
            } else {
                setSelectedSquare(square);
                const moves = chess.moves({ square: square as any, verbose: true });
                setHighlightedMoves(moves.map((m: { from: string; to: string }) => m.from + m.to));
            }
        } else {
            setSelectedSquare(null);
            setHighlightedMoves([]);
        }
    };

    const handlePractice = async () => {
        if (!selectedOpening) return;
        // Use createGameAction if we want to create it, or just navigate to generic play with query
        // Actually, navigate to human-vs-ai with param is better pattern for now
        navigate(`/play/human-vs-ai?opening=${selectedOpening.eco}`);
    };

    // Construct override game state for board
    const studyGameState: GameState = {
        id: 'study',
        mode: 'human_vs_ai',
        fen: fen,
        status: 'active',
        whiteDifficulty: 'MEDIUM',
        blackDifficulty: 'MEDIUM',
        moveHistory: [], // complicated to sync with chess.js history, keeping empty for now
        evaluation: analysis ? analysis.evaluation : 0,
        opening: {
            name: selectedOpening?.name || "Custom",
            eco: selectedOpening?.eco || null
        },
        turn: chess.turn() === 'w' ? 'white' : 'black',
        isCheck: chess.isCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
        isDraw: chess.isDraw(),
        legalMoves: [],
        isWhiteHuman: true,
        selectedSquare: selectedSquare,
        highlightedMoves: highlightedMoves,
        lastMove: lastMove,
    };

    // Filter openings
    const filteredOpenings = openings.filter((opening) => {
        const matchesCategory = !selectedCategory || opening.category === selectedCategory;
        const matchesSearch = !searchQuery ||
            opening.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opening.eco.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const sortedOpenings = [...filteredOpenings].sort((a, b) => b.popularity - a.popularity);

    return (
        <div className="study-center">
            {/* Sidebar - preserved */}
            <aside className="study-center__sidebar">
                <button className="study-center__back-btn" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
                <h3>Categories</h3>
                <nav className="study-center__categories">
                    <button
                        className={`study-center__category ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        <span className="study-center__category-icon">📚</span>
                        <span className="study-center__category-name">All Openings</span>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            className={`study-center__category ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            <span className="study-center__category-name">{cat.name}</span>
                            <span className="study-center__category-count">{cat.count}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="study-center__main">
                {/* Search */}
                <div className="study-center__header-bar">
                    <div className="study-center__search">
                        <input
                            type="text"
                            placeholder="Search openings by name or ECO (e.g. B20)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="study-center__workspace">
                    {!selectedOpening ? (
                        <div className="study-center__grid">
                            {isLoading ? <div className="spinner">Loading...</div> :
                                sortedOpenings.map(opening => (
                                    <button key={opening.eco} className="study-center__card" onClick={() => setSelectedOpening(opening)}>
                                        <div className="card-header">
                                            <span className="eco-tag">{opening.eco}</span>
                                            <span className="popularity">Pop: {Math.round(opening.popularity)}%</span>
                                        </div>
                                        <h3>{opening.name}</h3>
                                        <p>{opening.category}</p>
                                    </button>
                                ))}
                        </div>
                    ) : (
                        <div className="study-center__analysis-view">
                            <div className="analysis-board-container">
                                <div className="analysis-eval-bar">
                                    <EvaluationBar evaluation={studyGameState.evaluation} isWhiteToMove={studyGameState.turn === 'white'} />
                                </div>
                                <div className="analysis-board">
                                    <ChessBoard2D
                                        gameState={studyGameState}
                                        onSquareClick={handleSquareClick}
                                    />
                                </div>
                            </div>

                            <div className="analysis-panel">
                                <div className="panel-header">
                                    <button className="btn-close" onClick={() => setSelectedOpening(null)}>Close Analysis</button>
                                    <h2>{selectedOpening.name} ({selectedOpening.eco})</h2>
                                </div>

                                <div className="panel-content">
                                    <section className="engine-eval">
                                        <h4>Engine Analysis</h4>
                                        {isAnalyzing ? <p>Thinking...</p> : (
                                            <div className="eval-stats">
                                                <div className="eval-score">
                                                    Score: <strong>{analysis?.evaluation.toFixed(2)}</strong>
                                                </div>
                                                <div className="eval-best-move">
                                                    Best: <strong>{analysis?.bestMove}</strong>
                                                </div>
                                            </div>
                                        )}
                                    </section>

                                    <section className="opening-info">
                                        <h4>Details</h4>
                                        <p>{selectedOpening.description}</p>
                                        <div className="opening-stats-bars">
                                            <div className="stat-row">White Wins: {selectedOpening.statistics.whiteWins}%</div>
                                            <div className="stat-row">Draws: {selectedOpening.statistics.draws}%</div>
                                            <div className="stat-row">Black Wins: {selectedOpening.statistics.blackWins}%</div>
                                        </div>
                                    </section>

                                    <div className="practice-action">
                                        <button className="btn btn--primary btn--full" onClick={handlePractice}>
                                            Practice This Opening
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudyCenter;

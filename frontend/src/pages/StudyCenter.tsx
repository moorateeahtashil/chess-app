import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { fetchOpenings, fetchOpeningCategories, fetchAnalysis } from '../hooks/useChessWebSocket';
import { Opening, GameState } from '../store/gameStore';
import { ChessBoard2D } from '../components/chess/ChessBoard2D';
import { EvaluationBar } from '../components/ui/EvaluationBar';
import { Academy } from '../components/ui/Academy';
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

type StudyMode = 'explorer' | 'academy';

export const StudyCenter: React.FC = () => {
    const navigate = useNavigate();
    const [studyMode, setStudyMode] = useState<StudyMode>('academy');
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
        if (selectedSquare) {
            try {
                const move = chess.move({
                    from: selectedSquare,
                    to: square,
                    promotion: 'q'
                });

                if (move) {
                    setFen(chess.fen());
                    setLastMove({ from: move.from, to: move.to });
                    setSelectedSquare(null);
                    setHighlightedMoves([]);
                    runAnalysis(chess.fen());
                    return;
                }
            } catch (e) { }
        }

        const piece = chess.get(square as any);
        if (piece) {
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
        navigate(`/play/human-vs-ai?opening=${selectedOpening.eco}`);
    };

    const studyGameState: GameState = {
        id: 'study',
        mode: 'human_vs_ai',
        fen: fen,
        status: 'active',
        whiteDifficulty: 'MEDIUM',
        blackDifficulty: 'MEDIUM',
        moveHistory: [],
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
            <aside className="study-center__sidebar glass-card">
                <button className="study-center__back-btn" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>

                <div className="study-center__mode-tabs">
                    <button
                        className={`study-mode-tab ${studyMode === 'academy' ? 'active' : ''}`}
                        onClick={() => setStudyMode('academy')}
                    >
                        🎓 Academy
                    </button>
                    <button
                        className={`study-mode-tab ${studyMode === 'explorer' ? 'active' : ''}`}
                        onClick={() => setStudyMode('explorer')}
                    >
                        🧭 Explorer
                    </button>
                </div>

                {studyMode === 'explorer' && (
                    <>
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
                    </>
                )}
            </aside>

            <main className="study-center__main">
                {studyMode === 'academy' ? (
                    <Academy />
                ) : (
                    <>
                        <div className="study-center__header-bar">
                            <div className="study-center__search glass-card">
                                <span className="search-icon">🔍</span>
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
                                <div className="study-center__grid animate-fade-in">
                                    {isLoading ? <div className="spinner">Loading...</div> :
                                        sortedOpenings.map((opening, idx) => (
                                            <button
                                                key={opening.eco}
                                                className="study-center__card glass-card"
                                                onClick={() => setSelectedOpening(opening)}
                                                style={{ animationDelay: `${idx * 0.05}s` }}
                                            >
                                                <div className="card-header">
                                                    <span className="eco-tag">{opening.eco}</span>
                                                    <span className={`popularity-badge ${opening.popularity > 80 ? 'high' : 'normal'}`}>
                                                        Pop: {Math.round(opening.popularity)}%
                                                    </span>
                                                </div>
                                                <h3>{opening.name}</h3>
                                                <p>{opening.category}</p>
                                            </button>
                                        ))}
                                </div>
                            ) : (
                                <div className="study-center__analysis-view animate-fade-in">
                                    <div className="analysis-board-container">
                                        <div className="analysis-eval-bar">
                                            <EvaluationBar evaluation={studyGameState.evaluation} isWhiteToMove={studyGameState.turn === 'white'} />
                                        </div>
                                        <div className="analysis-board board-wrapper">
                                            <ChessBoard2D
                                                gameState={studyGameState}
                                                onSquareClick={handleSquareClick}
                                            />
                                        </div>
                                    </div>

                                    <div className="analysis-panel glass-card">
                                        <div className="panel-header">
                                            <h2>{selectedOpening.eco}</h2>
                                            <button className="btn-close" onClick={() => setSelectedOpening(null)}>✕</button>
                                        </div>
                                        <h3 className="opening-title">{selectedOpening.name}</h3>

                                        <div className="panel-content">
                                            <section className="engine-eval glass-card--elevated">
                                                <h4>Engine Analysis</h4>
                                                {isAnalyzing ? <p className="animate-pulse">Thinking...</p> : (
                                                    <div className="eval-stats">
                                                        <div className="eval-row">
                                                            <span>Evaluation</span>
                                                            <strong className={analysis && analysis.evaluation > 0 ? 'text-green' : 'text-red'}>
                                                                {analysis?.evaluation.toFixed(2)}
                                                            </strong>
                                                        </div>
                                                        <div className="eval-row">
                                                            <span>Best Move</span>
                                                            <strong>{analysis?.bestMove}</strong>
                                                        </div>
                                                    </div>
                                                )}
                                            </section>

                                            <section className="opening-info">
                                                <h4>Strategic Description</h4>
                                                <p>{selectedOpening.description}</p>

                                                <div className="win-rates">
                                                    <div className="rate-bar white" style={{ width: `${selectedOpening.statistics.whiteWins}%` }}></div>
                                                    <div className="rate-bar draw" style={{ width: `${selectedOpening.statistics.draws}%` }}></div>
                                                    <div className="rate-bar black" style={{ width: `${selectedOpening.statistics.blackWins}%` }}></div>
                                                </div>
                                                <div className="win-rates-legend">
                                                    <span>⚪ {selectedOpening.statistics.whiteWins}%</span>
                                                    <span>Draw {selectedOpening.statistics.draws}%</span>
                                                    <span>⚫ {selectedOpening.statistics.blackWins}%</span>
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
                    </>
                )}
            </main>
        </div>
    );
};

export default StudyCenter;

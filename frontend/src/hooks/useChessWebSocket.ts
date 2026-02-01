import { useCallback, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

export function useChessWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const aiWsRef = useRef<WebSocket | null>(null);
    const {
        game,
        setGame,
        setIsConnected,
        setIsLoading,
        setIsThinking,
        setError,
        updateFromServer,
        setLastMove
    } = useGameStore();

    // Connect to game WebSocket
    const connectToGame = useCallback((gameId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        const ws = new WebSocket(`${WS_BASE}/ws/game/${gameId}`);

        ws.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'connected' && data.game) {
                updateFromServer(data.game);
                setIsThinking(false);
            }

            if (data.type === 'move' && data.data) {
                updateFromServer(data.data.game);
                setIsThinking(false);
                if (data.data.aiMove) {
                    const from = data.data.aiMove.uci.substring(0, 2);
                    const to = data.data.aiMove.uci.substring(2, 4);
                    setLastMove({ from, to });
                }
            }

            if (data.type === 'state' && data.game) {
                updateFromServer(data.game);
                setIsThinking(false);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Connection error');
        };

        wsRef.current = ws;
    }, [setIsConnected, setError, updateFromServer, setLastMove, setIsThinking]);

    // Connect to AI vs AI game WebSocket
    const connectToAIGame = useCallback((gameId: string) => {
        if (aiWsRef.current?.readyState === WebSocket.OPEN) {
            aiWsRef.current.close();
        }

        const ws = new WebSocket(`${WS_BASE}/ws/ai-game/${gameId}`);

        ws.onopen = () => {
            setIsConnected(true);
            console.log('AI Game WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'connected' && data.game) {
                updateFromServer(data.game);
            }

            if (data.type === 'move' && data.data) {
                updateFromServer(data.data.game);
                const move = data.data.move;
                if (move) {
                    const from = move.uci.substring(0, 2);
                    const to = move.uci.substring(2, 4);
                    setLastMove({ from, to });
                }
            }

            if (data.type === 'game_over' && data.game) {
                updateFromServer(data.game);
                setIsThinking(false);
            }

            if (data.type === 'paused') {
                setGame({ status: 'paused' });
            }

            if (data.type === 'resumed') {
                setGame({ status: 'active' });
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('AI WebSocket error:', error);
            setError('Connection error');
        };

        aiWsRef.current = ws;
    }, [setIsConnected, setError, updateFromServer, setLastMove, setGame, setIsThinking]);

    // Create a new game
    const createGame = useCallback(async (options: {
        mode: string;
        difficulty?: string;
        playerColor?: string;
        whiteDifficulty?: string;
        blackDifficulty?: string;
        openingEco?: string;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/api/games`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: options.mode,
                    difficulty: options.difficulty || 'MEDIUM',
                    playerColor: options.playerColor || 'white',
                    whiteDifficulty: options.whiteDifficulty || 'MEDIUM',
                    blackDifficulty: options.blackDifficulty || 'MEDIUM',
                    openingEco: options.openingEco,
                }),
            });

            const data = await response.json();

            if (data.success && data.game) {
                updateFromServer(data.game);

                // Connect to appropriate WebSocket
                if (options.mode === 'ai_vs_ai') {
                    connectToAIGame(data.game.id);
                } else {
                    connectToGame(data.game.id);
                }

                return data.game;
            } else {
                throw new Error('Failed to create game');
            }
        } catch (error: any) {
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setError, updateFromServer, connectToGame, connectToAIGame]);

    // Make a move
    const makeMove = useCallback(async (move: string) => {
        if (!game.id) return;

        try {
            const response = await fetch(`${API_BASE}/api/games/${game.id}/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ move }),
            });

            const data = await response.json();

            if (data.success && data.game) {
                updateFromServer(data.game);

                // Set last move for highlighting
                const from = move.substring(0, 2);
                const to = move.substring(2, 4);
                setLastMove({ from, to });

                return data;
            }
        } catch (error: any) {
            setError(error.message);
        }
    }, [game.id, updateFromServer, setLastMove, setError]);

    // Get legal moves for a square
    const getLegalMovesForSquare = useCallback(async (square: string): Promise<string[]> => {
        if (!game.id) return [];

        try {
            const response = await fetch(`${API_BASE}/api/games/${game.id}/legal-moves/${square}`);
            const data = await response.json();
            return data.moves || [];
        } catch (error) {
            return [];
        }
    }, [game.id]);

    // AI game controls
    const pauseAIGame = useCallback(() => {
        if (aiWsRef.current?.readyState === WebSocket.OPEN) {
            aiWsRef.current.send(JSON.stringify({ type: 'pause' }));
        }
    }, []);

    const resumeAIGame = useCallback(() => {
        if (aiWsRef.current?.readyState === WebSocket.OPEN) {
            aiWsRef.current.send(JSON.stringify({ type: 'resume' }));
        }
    }, []);

    const stepAIGame = useCallback(() => {
        if (aiWsRef.current?.readyState === WebSocket.OPEN) {
            aiWsRef.current.send(JSON.stringify({ type: 'step' }));
        }
    }, []);

    const setAIGameSpeed = useCallback((speed: number) => {
        if (aiWsRef.current?.readyState === WebSocket.OPEN) {
            aiWsRef.current.send(JSON.stringify({ type: 'speed', value: speed }));
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            wsRef.current?.close();
            aiWsRef.current?.close();
        };
    }, []);

    return {
        createGame,
        makeMove,
        getLegalMovesForSquare,
        connectToGame,
        connectToAIGame,
        pauseAIGame,
        resumeAIGame,
        stepAIGame,
        setAIGameSpeed,
    };
}

// API functions for openings and other data
export async function fetchOpenings() {
    const response = await fetch(`${API_BASE}/api/openings`);
    const data = await response.json();
    return data.openings;
}

export async function fetchOpeningCategories() {
    const response = await fetch(`${API_BASE}/api/openings/categories`);
    const data = await response.json();
    return data.categories;
}

export async function fetchPopularOpenings(limit = 10) {
    const response = await fetch(`${API_BASE}/api/openings/popular?limit=${limit}`);
    const data = await response.json();
    return data.openings;
}

export async function fetchDifficulties() {
    const response = await fetch(`${API_BASE}/api/difficulties`);
    const data = await response.json();
    return data.difficulties;
}

export async function fetchAnalysis(fen: string) {
    const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen }),
    });
    return await response.json();
}

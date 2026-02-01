import { create } from 'zustand';

// Types
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';
export type GameMode = 'human_vs_ai' | 'ai_vs_ai';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'MASTER';
export type GameStatus = 'waiting' | 'active' | 'paused' | 'completed';

export interface Opening {
    eco: string;
    name: string;
    moves: string;
    fen: string;
    description: string;
    category: string;
    statistics: {
        whiteWins: number;
        blackWins: number;
        draws: number;
    };
    popularity: number;
}

export interface Move {
    uci: string;
    san: string;
    color?: 'white' | 'black';
}

export interface GameState {
    id: string | null;
    mode: GameMode;
    fen: string;
    status: GameStatus;
    whiteDifficulty: Difficulty;
    blackDifficulty: Difficulty;
    moveHistory: string[];
    evaluation: number;
    opening: {
        name: string | null;
        eco: string | null;
    };
    turn: 'white' | 'black';
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    isDraw: boolean;
    legalMoves: string[];
    isWhiteHuman: boolean;
    selectedSquare: string | null;
    highlightedMoves: string[];
    lastMove: { from: string; to: string } | null;
}

interface GameStore {
    // State
    game: GameState;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setGame: (game: Partial<GameState>) => void;
    setSelectedSquare: (square: string | null) => void;
    setHighlightedMoves: (moves: string[]) => void;
    setLastMove: (move: { from: string; to: string } | null) => void;
    setIsConnected: (connected: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetGame: () => void;

    // Game actions
    updateFromServer: (serverGame: any) => void;
}

const initialGameState: GameState = {
    id: null,
    mode: 'human_vs_ai',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    status: 'waiting',
    whiteDifficulty: 'MEDIUM',
    blackDifficulty: 'MEDIUM',
    moveHistory: [],
    evaluation: 0,
    opening: { name: null, eco: null },
    turn: 'white',
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    legalMoves: [],
    isWhiteHuman: true,
    selectedSquare: null,
    highlightedMoves: [],
    lastMove: null,
};

export const useGameStore = create<GameStore>((set) => ({
    game: initialGameState,
    isConnected: false,
    isLoading: false,
    error: null,

    setGame: (gameUpdate) => set((state) => ({
        game: { ...state.game, ...gameUpdate }
    })),

    setSelectedSquare: (square) => set((state) => ({
        game: { ...state.game, selectedSquare: square }
    })),

    setHighlightedMoves: (moves) => set((state) => ({
        game: { ...state.game, highlightedMoves: moves }
    })),

    setLastMove: (move) => set((state) => ({
        game: { ...state.game, lastMove: move }
    })),

    setIsConnected: (connected) => set({ isConnected: connected }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    resetGame: () => set({ game: initialGameState, error: null }),

    updateFromServer: (serverGame) => set((state) => ({
        game: {
            ...state.game,
            id: serverGame.id,
            mode: serverGame.mode,
            fen: serverGame.fen,
            status: serverGame.status,
            whiteDifficulty: serverGame.whiteDifficulty,
            blackDifficulty: serverGame.blackDifficulty,
            moveHistory: serverGame.moveHistory || [],
            evaluation: serverGame.evaluation || 0,
            opening: serverGame.opening || { name: null, eco: null },
            turn: serverGame.turn,
            isCheck: serverGame.isCheck,
            isCheckmate: serverGame.isCheckmate,
            isStalemate: serverGame.isStalemate,
            isDraw: serverGame.isDraw,
            legalMoves: serverGame.legalMoves || [],
            isWhiteHuman: serverGame.isWhiteHuman,
        }
    })),
}));

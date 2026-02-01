import React, { useMemo, useCallback, useRef } from 'react';
import { useGameStore, GameState } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useChessWebSocket } from '../../hooks/useChessWebSocket';
import { ChessPieceIcon } from './ChessPieceIcon';
import './ChessBoard2D.css';

interface ChessBoard2DProps {
    flipped?: boolean;
    // Optional overrides for "Study Mode" or "Analysis Mode"
    gameState?: GameState;
    onSquareClick?: (square: string) => void;
}

export const ChessBoard2D: React.FC<ChessBoard2DProps> = ({
    flipped = false,
    gameState: overrideGameState,
    onSquareClick: overrideOnSquareClick
}) => {
    const { game: storeGame, setSelectedSquare, setHighlightedMoves } = useGameStore();
    const { showLegalMoves, showLastMove, showCoordinates } = useSettingsStore();
    const { makeMove, getLegalMovesForSquare } = useChessWebSocket();

    // Use override state if provided, otherwise Use store state
    const game = overrideGameState || storeGame;
    const isInteractive = !overrideGameState; // Use internal logic only if using store state

    // Parse FEN string to get piece positions
    const boardState = useMemo(() => {
        const pieces = new Map<string, { type: string, color: 'white' | 'black' }>();
        if (!game.fen) return pieces;

        const fenParts = game.fen.split(' ');
        const boardFen = fenParts[0];

        let rank = 7;
        let file = 0;

        for (const char of boardFen) {
            if (char === '/') {
                rank--;
                file = 0;
            } else if (/\d/.test(char)) {
                file += parseInt(char);
            } else {
                const square = `${String.fromCharCode(97 + file)}${rank + 1}`;
                const color = char === char.toUpperCase() ? 'white' : 'black';
                pieces.set(square, { type: char, color });
                file++;
            }
        }
        return pieces;
    }, [game.fen]);

    const lastSelectedSquare = useRef<string | null>(null);

    const handleSquareClick = useCallback(async (square: string) => {
        // If override provided, use it
        if (overrideOnSquareClick) {
            overrideOnSquareClick(square);
            return;
        }

        // Internal Logic (Game Mode)
        // If selecting a move
        if (game.selectedSquare) {
            const move = `${game.selectedSquare}${square}`;
            // Check if it's a legal move (simplified check against highlighted)
            if (game.highlightedMoves.includes(move)) {
                // Instant feedback - clear selection
                setSelectedSquare(null);
                setHighlightedMoves([]);

                // Execute move
                await makeMove(move);
                return;
            }
        }

        // Selecting a piece
        const piece = boardState.get(square);
        if (piece) {
            // Allow selection if it's the player's turn and piece
            const isPlayerPiece =
                (game.isWhiteHuman && piece.color === 'white' && game.turn === 'white') ||
                (!game.isWhiteHuman && piece.color === 'black' && game.turn === 'black') ||
                (game.mode === 'ai_vs_ai');

            if (isPlayerPiece || game.mode === 'ai_vs_ai') {
                if (game.selectedSquare === square) {
                    // Deselect
                    setSelectedSquare(null);
                    setHighlightedMoves([]);
                    lastSelectedSquare.current = null;
                } else {
                    // Select immediately
                    setSelectedSquare(square);
                    setHighlightedMoves([]); // Clear until fetched
                    lastSelectedSquare.current = square;

                    if (game.mode !== 'ai_vs_ai') {
                        // Fetch moves in background
                        getLegalMovesForSquare(square).then(moves => {
                            // Only update if still selected
                            if (lastSelectedSquare.current === square) {
                                setHighlightedMoves(moves);
                            }
                        }).catch(console.error);
                    }
                }
            } else if (game.selectedSquare) {
                // Clicked opponent piece (not capture, or would have been handled above)
                // Deselect if not a valid capture move
                setSelectedSquare(null);
                setHighlightedMoves([]);
                lastSelectedSquare.current = null;
            }
        } else {
            // Clicked empty square (not a move)
            setSelectedSquare(null);
            setHighlightedMoves([]);
            lastSelectedSquare.current = null;
        }
    }, [game, boardState, makeMove, setSelectedSquare, setHighlightedMoves, getLegalMovesForSquare, overrideOnSquareClick]);

    const renderSquare = (rank: number, file: number) => {
        // Board orientation
        const visualRank = flipped ? rank : 7 - rank;
        const visualFile = flipped ? 7 - file : file;

        const squareName = `${String.fromCharCode(97 + visualFile)}${visualRank + 1}`;
        const isDark = (visualRank + visualFile) % 2 === 0;

        const piece = boardState.get(squareName);
        const isSelected = game.selectedSquare === squareName;
        const isLastMoveFrom = game.lastMove?.from === squareName;
        const isLastMoveTo = game.lastMove?.to === squareName;
        const isLegalMove = game.highlightedMoves.some(m => m.endsWith(squareName));
        const isCapture = isLegalMove && piece;

        return (
            <div
                key={squareName}
                className={`
          board-square 
          ${isDark ? 'dark' : 'light'}
          ${isSelected ? 'selected' : ''}
          ${(isLastMoveFrom || isLastMoveTo) && showLastMove ? 'last-move' : ''}
        `}
                onClick={() => handleSquareClick(squareName)}
                data-square={squareName}
            >
                {/* Coordinates */}
                {showCoordinates && visualFile === (flipped ? 7 : 0) && (
                    <span className={`coordinate rank ${isDark ? 'light-text' : 'dark-text'}`}>
                        {visualRank + 1}
                    </span>
                )}
                {showCoordinates && visualRank === (flipped ? 7 : 0) && (
                    <span className={`coordinate file ${isDark ? 'light-text' : 'dark-text'}`}>
                        {String.fromCharCode(97 + visualFile)}
                    </span>
                )}

                {/* Legal Move Indicators */}
                {showLegalMoves && isLegalMove && !isCapture && (
                    <div className="legal-move-dot" />
                )}
                {showLegalMoves && isCapture && (
                    <div className="legal-capture-ring" />
                )}

                {/* Piece */}
                {piece && (
                    <div className={`chess-piece ${isSelected ? 'piece-selected' : ''}`}>
                        <ChessPieceIcon type={piece.type} color={piece.color} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="chess-board-2d-container">
            <div className="chess-board-2d">
                {Array.from({ length: 8 }).map((_, rank) => (
                    <div key={rank} className="board-rank">
                        {Array.from({ length: 8 }).map((_, file) => renderSquare(rank, file))}
                    </div>
                ))}
            </div>
        </div>
    );
};

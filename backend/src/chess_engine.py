"""
Chess AI Engine with Minimax Algorithm and Alpha-Beta Pruning
Supports multiple difficulty levels with configurable search depth
"""

import chess
import random
from typing import Optional, Tuple, List
from enum import Enum

class Difficulty(Enum):
    EASY = 2      # 2 ply depth
    MEDIUM = 4    # 4 ply depth
    HARD = 6      # 6 ply depth
    MASTER = 8    # 8 ply depth

# Piece-Square Tables for positional evaluation
# Values encourage central control and piece development

PAWN_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0
]

KNIGHT_TABLE = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
]

BISHOP_TABLE = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20
]

ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
]

QUEEN_TABLE = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20
]

KING_MIDDLE_TABLE = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20
]

KING_END_TABLE = [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50
]

# Piece values in centipawns
PIECE_VALUES = {
    chess.PAWN: 100,
    chess.KNIGHT: 320,
    chess.BISHOP: 330,
    chess.ROOK: 500,
    chess.QUEEN: 900,
    chess.KING: 20000
}

class ChessAI:
    """
    Chess AI Engine using Minimax with Alpha-Beta Pruning
    """
    
    def __init__(self, difficulty: Difficulty = Difficulty.MEDIUM):
        self.difficulty = difficulty
        self.depth = difficulty.value
        self.nodes_evaluated = 0
        self.transposition_table = {}
        
    def set_difficulty(self, difficulty: Difficulty):
        """Change AI difficulty level"""
        self.difficulty = difficulty
        self.depth = difficulty.value
        
    def get_best_move(self, board: chess.Board) -> Optional[chess.Move]:
        """
        Find the best move for the current position
        Returns None if no legal moves available
        """
        self.nodes_evaluated = 0
        self.transposition_table.clear()
        
        legal_moves = list(board.legal_moves)
        if not legal_moves:
            return None
            
        # Add some randomness for easier difficulties
        if self.difficulty == Difficulty.EASY:
            # 30% chance of making a random move
            if random.random() < 0.3:
                return random.choice(legal_moves)
        elif self.difficulty == Difficulty.MEDIUM:
            # 10% chance of making a random move
            if random.random() < 0.1:
                return random.choice(legal_moves)
        
        best_move = None
        best_value = float('-inf') if board.turn else float('inf')
        alpha = float('-inf')
        beta = float('inf')
        
        # Sort moves for better alpha-beta pruning
        sorted_moves = self._order_moves(board, legal_moves)
        
        for move in sorted_moves:
            board.push(move)
            value = self._minimax(board, self.depth - 1, alpha, beta, not board.turn)
            board.pop()
            
            if board.turn:  # Maximizing (White)
                if value > best_value:
                    best_value = value
                    best_move = move
                alpha = max(alpha, value)
            else:  # Minimizing (Black)
                if value < best_value:
                    best_value = value
                    best_move = move
                beta = min(beta, value)
                
        return best_move
    
    def _minimax(self, board: chess.Board, depth: int, alpha: float, beta: float, 
                 maximizing: bool) -> float:
        """
        Minimax algorithm with alpha-beta pruning
        """
        self.nodes_evaluated += 1
        
        # Check transposition table
        board_hash = board.fen()
        if board_hash in self.transposition_table:
            stored_depth, stored_value = self.transposition_table[board_hash]
            if stored_depth >= depth:
                return stored_value
        
        # Terminal conditions
        if depth == 0 or board.is_game_over():
            value = self._evaluate(board)
            self.transposition_table[board_hash] = (depth, value)
            return value
        
        legal_moves = list(board.legal_moves)
        sorted_moves = self._order_moves(board, legal_moves)
        
        if maximizing:
            max_eval = float('-inf')
            for move in sorted_moves:
                board.push(move)
                eval_score = self._minimax(board, depth - 1, alpha, beta, False)
                board.pop()
                max_eval = max(max_eval, eval_score)
                alpha = max(alpha, eval_score)
                if beta <= alpha:
                    break  # Beta cutoff
            self.transposition_table[board_hash] = (depth, max_eval)
            return max_eval
        else:
            min_eval = float('inf')
            for move in sorted_moves:
                board.push(move)
                eval_score = self._minimax(board, depth - 1, alpha, beta, True)
                board.pop()
                min_eval = min(min_eval, eval_score)
                beta = min(beta, eval_score)
                if beta <= alpha:
                    break  # Alpha cutoff
            self.transposition_table[board_hash] = (depth, min_eval)
            return min_eval
    
    def _order_moves(self, board: chess.Board, moves: List[chess.Move]) -> List[chess.Move]:
        """
        Order moves to improve alpha-beta pruning efficiency
        Prioritize: captures, checks, then other moves
        """
        def move_score(move: chess.Move) -> int:
            score = 0
            # Captures are valuable
            if board.is_capture(move):
                # MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
                victim = board.piece_at(move.to_square)
                attacker = board.piece_at(move.from_square)
                if victim and attacker:
                    score += PIECE_VALUES.get(victim.piece_type, 0) * 10
                    score -= PIECE_VALUES.get(attacker.piece_type, 0)
            # Promotions
            if move.promotion:
                score += PIECE_VALUES.get(move.promotion, 0)
            # Check if move gives check
            board.push(move)
            if board.is_check():
                score += 50
            board.pop()
            return score
        
        return sorted(moves, key=move_score, reverse=True)
    
    def _evaluate(self, board: chess.Board) -> float:
        """
        Evaluate the board position
        Positive values favor White, negative favor Black
        """
        if board.is_checkmate():
            return -20000 if board.turn else 20000
        if board.is_stalemate() or board.is_insufficient_material():
            return 0
        if board.is_fifty_moves() or board.is_repetition():
            return 0
            
        score = 0.0
        
        # Material and positional evaluation
        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece is None:
                continue
                
            # Get base piece value
            value = PIECE_VALUES[piece.piece_type]
            
            # Add positional bonus
            value += self._get_piece_position_value(piece, square, board)
            
            # Add to score (positive for white, negative for black)
            if piece.color == chess.WHITE:
                score += value
            else:
                score -= value
        
        # Mobility bonus
        mobility = len(list(board.legal_moves))
        board.turn = not board.turn
        opponent_mobility = len(list(board.legal_moves))
        board.turn = not board.turn
        
        mobility_score = (mobility - opponent_mobility) * 10
        if board.turn == chess.WHITE:
            score += mobility_score
        else:
            score -= mobility_score
        
        # King safety
        score += self._evaluate_king_safety(board)
        
        return score
    
    def _get_piece_position_value(self, piece: chess.Piece, square: int, 
                                   board: chess.Board) -> float:
        """Get positional value for a piece on a given square"""
        # Mirror the table for black pieces
        if piece.color == chess.WHITE:
            table_square = square
        else:
            table_square = chess.square_mirror(square)
        
        piece_tables = {
            chess.PAWN: PAWN_TABLE,
            chess.KNIGHT: KNIGHT_TABLE,
            chess.BISHOP: BISHOP_TABLE,
            chess.ROOK: ROOK_TABLE,
            chess.QUEEN: QUEEN_TABLE,
        }
        
        if piece.piece_type == chess.KING:
            # Use different king table based on game phase
            if self._is_endgame(board):
                return KING_END_TABLE[table_square]
            else:
                return KING_MIDDLE_TABLE[table_square]
        
        table = piece_tables.get(piece.piece_type)
        if table:
            return table[table_square]
        return 0
    
    def _is_endgame(self, board: chess.Board) -> bool:
        """Determine if the position is in endgame phase"""
        # Simple endgame detection based on material
        queens = len(board.pieces(chess.QUEEN, chess.WHITE)) + \
                 len(board.pieces(chess.QUEEN, chess.BLACK))
        minor_pieces = len(board.pieces(chess.KNIGHT, chess.WHITE)) + \
                       len(board.pieces(chess.KNIGHT, chess.BLACK)) + \
                       len(board.pieces(chess.BISHOP, chess.WHITE)) + \
                       len(board.pieces(chess.BISHOP, chess.BLACK))
        rooks = len(board.pieces(chess.ROOK, chess.WHITE)) + \
                len(board.pieces(chess.ROOK, chess.BLACK))
        
        return queens == 0 or (queens <= 2 and minor_pieces <= 2 and rooks <= 2)
    
    def _evaluate_king_safety(self, board: chess.Board) -> float:
        """Evaluate king safety for both sides"""
        score = 0.0
        
        for color in [chess.WHITE, chess.BLACK]:
            king_square = board.king(color)
            if king_square is None:
                continue
                
            # Penalty for open files near king
            king_file = chess.square_file(king_square)
            for f in range(max(0, king_file - 1), min(8, king_file + 2)):
                # Check for pawns shielding the king
                pawn_shield = False
                for rank in range(8):
                    sq = chess.square(f, rank)
                    piece = board.piece_at(sq)
                    if piece and piece.piece_type == chess.PAWN and piece.color == color:
                        pawn_shield = True
                        break
                
                if not pawn_shield:
                    penalty = 20
                    if color == chess.WHITE:
                        score -= penalty
                    else:
                        score += penalty
        
        return score
    
    def get_evaluation(self, board: chess.Board) -> float:
        """Get evaluation score for current position (for display)"""
        return self._evaluate(board) / 100  # Convert to pawns
    
    def get_nodes_evaluated(self) -> int:
        """Return number of nodes evaluated in last search"""
        return self.nodes_evaluated

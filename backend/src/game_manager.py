"""
Game Manager - Handles game sessions and AI vs AI orchestration
"""

import chess
import asyncio
from typing import Dict, Optional, List, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
import uuid

from chess_engine import ChessAI, Difficulty
from openings import Opening, opening_explorer

class GameMode(Enum):
    HUMAN_VS_AI = "human_vs_ai"
    AI_VS_AI = "ai_vs_ai"

class GameStatus(Enum):
    WAITING = "waiting"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"

@dataclass
class GameState:
    """Represents the current state of a chess game"""
    id: str
    mode: GameMode
    board: chess.Board
    status: GameStatus
    white_difficulty: Difficulty
    black_difficulty: Difficulty
    move_history: List[str] = field(default_factory=list)
    current_evaluation: float = 0.0
    opening_name: Optional[str] = None
    opening_eco: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    is_white_human: bool = True  # For HumanVsAI games
    
    def to_dict(self) -> Dict:
        """Convert game state to dictionary for API response"""
        return {
            "id": self.id,
            "mode": self.mode.value,
            "fen": self.board.fen(),
            "status": self.status.value,
            "whiteDifficulty": self.white_difficulty.name,
            "blackDifficulty": self.black_difficulty.name,
            "moveHistory": self.move_history,
            "evaluation": self.current_evaluation,
            "opening": {
                "name": self.opening_name,
                "eco": self.opening_eco
            },
            "turn": "white" if self.board.turn else "black",
            "isCheck": self.board.is_check(),
            "isCheckmate": self.board.is_checkmate(),
            "isStalemate": self.board.is_stalemate(),
            "isDraw": self.board.is_insufficient_material() or 
                      self.board.is_fifty_moves() or 
                      self.board.is_repetition(),
            "legalMoves": [move.uci() for move in self.board.legal_moves],
            "isWhiteHuman": self.is_white_human
        }


class GameManager:
    """
    Manages active chess games and AI interactions
    """
    
    def __init__(self):
        self.games: Dict[str, GameState] = {}
        self.ai_engines: Dict[str, Dict[str, ChessAI]] = {}  # game_id -> {white: AI, black: AI}
    
    def create_human_vs_ai_game(
        self, 
        difficulty: str = "MEDIUM",
        player_color: str = "white",
        opening_eco: Optional[str] = None
    ) -> GameState:
        """Create a new Human vs AI game"""
        game_id = str(uuid.uuid4())
        diff = Difficulty[difficulty.upper()]
        
        # Set up opening if specified
        board = chess.Board()
        opening_name = None
        if opening_eco:
            opening = opening_explorer.get_opening_by_eco(opening_eco)
            if opening:
                board = chess.Board(opening["fen"])
                opening_name = opening["name"]
        
        game = GameState(
            id=game_id,
            mode=GameMode.HUMAN_VS_AI,
            board=board,
            status=GameStatus.ACTIVE,
            white_difficulty=diff if player_color == "black" else Difficulty.EASY,
            black_difficulty=diff if player_color == "white" else Difficulty.EASY,
            is_white_human=(player_color == "white"),
            opening_name=opening_name,
            opening_eco=opening_eco
        )
        
        self.games[game_id] = game
        
        # Create AI engine for the computer side
        ai = ChessAI(diff)
        self.ai_engines[game_id] = {
            "white" if player_color == "black" else "black": ai
        }
        
        # If AI is white and it is their turn, don't trigger here (WS will handle)
        # but ensure starting FEN evaluation is set
        game.current_evaluation = ai.get_evaluation(board)
        
        return game
    
    def create_ai_vs_ai_game(
        self,
        white_difficulty: str = "MEDIUM",
        black_difficulty: str = "MEDIUM",
        opening_eco: Optional[str] = None
    ) -> GameState:
        """Create a new AI vs AI game"""
        game_id = str(uuid.uuid4())
        white_diff = Difficulty[white_difficulty.upper()]
        black_diff = Difficulty[black_difficulty.upper()]
        
        # Set up opening if specified
        board = chess.Board()
        opening_name = None
        if opening_eco:
            opening = opening_explorer.get_opening_by_eco(opening_eco)
            if opening:
                board = chess.Board(opening["fen"])
                opening_name = opening["name"]
        
        game = GameState(
            id=game_id,
            mode=GameMode.AI_VS_AI,
            board=board,
            status=GameStatus.ACTIVE,
            white_difficulty=white_diff,
            black_difficulty=black_diff,
            opening_name=opening_name,
            opening_eco=opening_eco,
            is_white_human=False
        )
        
        self.games[game_id] = game
        
        # Create AI engines for both sides
        self.ai_engines[game_id] = {
            "white": ChessAI(white_diff),
            "black": ChessAI(black_diff)
        }
        
        return game
    
    def get_game(self, game_id: str) -> Optional[GameState]:
        """Get a game by ID"""
        return self.games.get(game_id)
    
    async def make_human_move(self, game_id: str, move_uci: str) -> Dict:
        """
        Process a human player's move
        Returns: Updated game state and AI response move (if applicable)
        """
        game = self.games.get(game_id)
        if not game:
            return {"error": "Game not found"}
        
        if game.status != GameStatus.ACTIVE:
            return {"error": "Game is not active"}
        
        # Validate the move
        try:
            move = chess.Move.from_uci(move_uci)
            if move not in game.board.legal_moves:
                return {"error": "Illegal move"}
        except ValueError:
            return {"error": "Invalid move format"}
        
        # Make the move
        san = game.board.san(move)
        game.board.push(move)
        game.move_history.append(san)
        
        # Check for game end
        if game.board.is_game_over():
            game.status = GameStatus.COMPLETED
            return {
                "success": True,
                "game": game.to_dict(),
                "aiMove": None
            }
        
        # Get AI response
        ai_color = "black" if game.is_white_human else "white"
        ai = self.ai_engines.get(game_id, {}).get(ai_color)
        
        if ai and ((game.is_white_human and not game.board.turn) or 
                   (not game.is_white_human and game.board.turn)):
            # Offload AI calculation to a thread to avoid blocking the event loop
            ai_move = await asyncio.to_thread(ai.get_best_move, game.board)
            if ai_move:
                ai_san = game.board.san(ai_move)
                game.board.push(ai_move)
                game.move_history.append(ai_san)
                # Offload evaluation too
                game.current_evaluation = await asyncio.to_thread(ai.get_evaluation, game.board)
                
                if game.board.is_game_over():
                    game.status = GameStatus.COMPLETED
                
                return {
                    "success": True,
                    "game": game.to_dict(),
                    "aiMove": {
                        "uci": ai_move.uci(),
                        "san": ai_san
                    }
                }
        
        return {
            "success": True,
            "game": game.to_dict(),
            "aiMove": None
        }
    
    async def get_ai_move(self, game_id: str) -> Optional[Dict]:
        """
        Get the next AI move for AI vs AI games
        Returns the move details or None if game ended
        """
        game = self.games.get(game_id)
        if not game or game.status != GameStatus.ACTIVE:
            return None
        
        if game.mode != GameMode.AI_VS_AI:
            return None
        
        if game.board.is_game_over():
            game.status = GameStatus.COMPLETED
            return None
        
        # Get the appropriate AI
        color = "white" if game.board.turn else "black"
        ai = self.ai_engines.get(game_id, {}).get(color)
        
        if not ai:
            return None
        
        # Offload AI calculation to a thread to avoid blocking the event loop
        move = await asyncio.to_thread(ai.get_best_move, game.board)
        if not move:
            return None
        
        san = game.board.san(move)
        game.board.push(move)
        game.move_history.append(san)
        # Offload evaluation too
        game.current_evaluation = await asyncio.to_thread(ai.get_evaluation, game.board)
        
        if game.board.is_game_over():
            game.status = GameStatus.COMPLETED
        
        return {
            "move": {
                "uci": move.uci(),
                "san": san,
                "color": color
            },
            "evaluation": game.current_evaluation,
            "nodesEvaluated": ai.get_nodes_evaluated(),
            "game": game.to_dict()
        }
    
    def pause_game(self, game_id: str) -> bool:
        """Pause an active game"""
        game = self.games.get(game_id)
        if game and game.status == GameStatus.ACTIVE:
            game.status = GameStatus.PAUSED
            return True
        return False
    
    def resume_game(self, game_id: str) -> bool:
        """Resume a paused game"""
        game = self.games.get(game_id)
        if game and game.status == GameStatus.PAUSED:
            game.status = GameStatus.ACTIVE
            return True
        return False
    
    def get_legal_moves(self, game_id: str) -> List[str]:
        """Get all legal moves for current position"""
        game = self.games.get(game_id)
        if not game:
            return []
        return [move.uci() for move in game.board.legal_moves]
    
    def get_piece_at(self, game_id: str, square: str) -> Optional[Dict]:
        """Get piece at a specific square"""
        game = self.games.get(game_id)
        if not game:
            return None
        
        try:
            sq = chess.parse_square(square)
            piece = game.board.piece_at(sq)
            if piece:
                return {
                    "type": chess.piece_name(piece.piece_type),
                    "color": "white" if piece.color else "black",
                    "symbol": piece.symbol()
                }
        except ValueError:
            pass
        return None
    
    def get_moves_for_square(self, game_id: str, square: str) -> List[str]:
        """Get all legal moves for a piece at a specific square"""
        game = self.games.get(game_id)
        if not game:
            return []
        
        try:
            sq = chess.parse_square(square)
            moves = [
                move.uci() 
                for move in game.board.legal_moves 
                if move.from_square == sq
            ]
            return moves
        except ValueError:
            return []
    
    def delete_game(self, game_id: str) -> bool:
        """Delete a game and clean up resources"""
        if game_id in self.games:
            del self.games[game_id]
            if game_id in self.ai_engines:
                del self.ai_engines[game_id]
            return True
        return False
    
    def get_active_games(self) -> List[Dict]:
        """Get list of all active games"""
        return [
            game.to_dict() 
            for game in self.games.values() 
            if game.status in [GameStatus.ACTIVE, GameStatus.PAUSED]
        ]

# Global game manager instance
game_manager = GameManager()

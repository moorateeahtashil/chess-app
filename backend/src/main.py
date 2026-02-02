"""
Chess Master API - FastAPI Backend
WebSocket and REST API for chess game management
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import asyncio
import json

from game_manager import game_manager, GameMode
from openings import opening_explorer
from chess_engine import Difficulty

app = FastAPI(
    title="Chess Master API",
    description="Backend API for Chess Master - A modern 3D chess application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, game_id: str):
        await websocket.accept()
        if game_id not in self.active_connections:
            self.active_connections[game_id] = []
        self.active_connections[game_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, game_id: str):
        if game_id in self.active_connections:
            if websocket in self.active_connections[game_id]:
                self.active_connections[game_id].remove(websocket)
    
    async def broadcast(self, game_id: str, message: dict):
        if game_id in self.active_connections:
            for connection in self.active_connections[game_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()


# Pydantic models for API requests
class CreateGameRequest(BaseModel):
    mode: str  # "human_vs_ai" or "ai_vs_ai"
    difficulty: str = "MEDIUM"
    playerColor: str = "white"
    whiteDifficulty: str = "MEDIUM"
    blackDifficulty: str = "MEDIUM"
    openingEco: Optional[str] = None

class AnalyzeRequest(BaseModel):
    fen: str
    depth: int = 10

class MakeMoveRequest(BaseModel):
    move: str  # UCI format e.g., "e2e4"

class AIGameSettings(BaseModel):
    speed: float = 1.0  # Seconds between moves
    whiteDifficulty: str = "MEDIUM"
    blackDifficulty: str = "MEDIUM"
    openingEco: Optional[str] = None


# REST API Endpoints

@app.get("/")
async def root():
    return {
        "name": "Chess Master API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


# Game Management Endpoints

@app.post("/api/games")
async def create_game(request: CreateGameRequest):
    """Create a new chess game"""
    if request.mode == "human_vs_ai":
        game = game_manager.create_human_vs_ai_game(
            difficulty=request.difficulty,
            player_color=request.playerColor,
            opening_eco=request.openingEco
        )
    elif request.mode == "ai_vs_ai":
        game = game_manager.create_ai_vs_ai_game(
            white_difficulty=request.whiteDifficulty,
            black_difficulty=request.blackDifficulty,
            opening_eco=request.openingEco
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid game mode")
    
    return {"success": True, "game": game.to_dict()}

@app.get("/api/games/{game_id}")
async def get_game(game_id: str):
    """Get game state by ID"""
    game = game_manager.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"game": game.to_dict()}

@app.post("/api/games/{game_id}/move")
async def make_move(game_id: str, request: MakeMoveRequest):
    """Make a move in the game"""
    result = await game_manager.make_human_move(game_id, request.move)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    # Broadcast update to WebSocket clients
    await manager.broadcast(game_id, {
        "type": "move",
        "data": result
    })
    
    return result

@app.get("/api/games/{game_id}/legal-moves")
async def get_legal_moves(game_id: str):
    """Get all legal moves for current position"""
    moves = game_manager.get_legal_moves(game_id)
    return {"moves": moves}

@app.get("/api/games/{game_id}/legal-moves/{square}")
async def get_moves_for_square(game_id: str, square: str):
    """Get legal moves for a specific square"""
    moves = game_manager.get_moves_for_square(game_id, square)
    piece = game_manager.get_piece_at(game_id, square)
    return {"square": square, "piece": piece, "moves": moves}

@app.post("/api/games/{game_id}/pause")
async def pause_game(game_id: str):
    """Pause an active game"""
    success = game_manager.pause_game(game_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot pause game")
    
    await manager.broadcast(game_id, {"type": "paused"})
    return {"success": True}

@app.post("/api/games/{game_id}/resume")
async def resume_game(game_id: str):
    """Resume a paused game"""
    success = game_manager.resume_game(game_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot resume game")
    
    await manager.broadcast(game_id, {"type": "resumed"})
    return {"success": True}

@app.delete("/api/games/{game_id}")
async def delete_game(game_id: str):
    """Delete a game"""
    success = game_manager.delete_game(game_id)
    if not success:
        raise HTTPException(status_code=404, detail="Game not found")
    
    await manager.broadcast(game_id, {"type": "deleted"})
    return {"success": True}

@app.get("/api/games")
async def list_games():
    """List all active games"""
    games = game_manager.get_active_games()
    return {"games": games}


# Opening Explorer Endpoints

@app.get("/api/openings")
async def get_openings():
    """Get all chess openings"""
    return {"openings": opening_explorer.get_all_openings()}

@app.get("/api/openings/categories")
async def get_opening_categories():
    """Get opening categories with counts"""
    return {"categories": opening_explorer.get_categories()}

@app.get("/api/openings/popular")
async def get_popular_openings(limit: int = 10):
    """Get most popular openings"""
    return {"openings": opening_explorer.get_popular_openings(limit)}

@app.get("/api/openings/category/{category}")
async def get_openings_by_category(category: str):
    """Get openings by category"""
    openings = opening_explorer.get_openings_by_category(category)
    return {"openings": openings}

@app.get("/api/openings/eco/{eco}")
async def get_opening_by_eco(eco: str):
    """Get opening by ECO code"""
    opening = opening_explorer.get_opening_by_eco(eco)
    if not opening:
        raise HTTPException(status_code=404, detail="Opening not found")
    return {"opening": opening}

@app.get("/api/openings/search")
async def search_opening(name: str):
    """Search opening by name"""
    opening = opening_explorer.get_opening_by_name(name)
    if not opening:
        raise HTTPException(status_code=404, detail="Opening not found")
    return {"opening": opening}


# Analysis Endpoints

@app.post("/api/analyze")
async def analyze_position(request: AnalyzeRequest):
    """Analyze a specific position"""
    import chess
    from chess_engine import ChessAI, Difficulty
    
    try:
        board = chess.Board(request.fen)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid FEN string")
    
    # Use valid difficulty mapped to requested depth or just default to Hard/Master for analysis
    # Depth 10 is quite deep for python-chess engine without native code, maybe cap it?
    # Our Difficulty enum maps to depths: EASY=2, MEDIUM=4, HARD=6, MASTER=8
    # Let's use MASTER for analysis by default
    
    ai = ChessAI(Difficulty.MASTER)
    
    # Evaluate and search for best move in a background thread
    eval_score = await asyncio.to_thread(ai.get_evaluation, board)
    best_move = await asyncio.to_thread(ai.get_best_move, board)
    
    return {
        "fen": request.fen,
        "evaluation": eval_score,
        "bestMove": best_move.uci() if best_move else None,
        "depth": 8  # Fixed to Master depth for now
    }


# AI Difficulty Endpoints

@app.get("/api/difficulties")
async def get_difficulties():
    """Get available AI difficulty levels"""
    return {
        "difficulties": [
            {
                "name": "EASY",
                "depth": 2,
                "description": "Perfect for beginners, makes occasional mistakes"
            },
            {
                "name": "MEDIUM",
                "depth": 4,
                "description": "Balanced gameplay, suitable for casual players"
            },
            {
                "name": "HARD",
                "depth": 6,
                "description": "Strong tactical play, challenges experienced players"
            },
            {
                "name": "MASTER",
                "depth": 8,
                "description": "Near-optimal play with deep positional understanding"
            }
        ]
    }


# WebSocket Endpoints

@app.websocket("/ws/game/{game_id}")
async def websocket_game(websocket: WebSocket, game_id: str):
    """WebSocket endpoint for real-time game updates"""
    await manager.connect(websocket, game_id)
    
    try:
        # Send initial game state
        game = game_manager.get_game(game_id)
        if game:
            await websocket.send_json({
                "type": "connected",
                "game": game.to_dict()
            })
            
            # TRIGGER AI MOVE IF IT'S AI TURN ON CONNECT
            ai_color = "black" if game.is_white_human else "white"
            is_ai_turn = (ai_color == "white" and game.board.turn) or (ai_color == "black" and not game.board.turn)
            
            if is_ai_turn and game.status == GameStatus.ACTIVE:
                # Give a small delay so client can render
                await asyncio.sleep(0.5)
                # We reuse make_human_move but we need a way to trigger AI without a human move
                # Let's add a helper or just push the move manually and broadcast
                ai_engine = game_manager.ai_engines.get(game_id, {}).get(ai_color)
                if ai_engine:
                    # Offload AI calculation to a thread
                    move = await asyncio.to_thread(ai_engine.get_best_move, game.board)
                    if move:
                        san = game.board.san(move)
                        game.board.push(move)
                        game.move_history.append(san)
                        # Offload evaluation too
                        game.current_evaluation = await asyncio.to_thread(ai_engine.get_evaluation, game.board)
                        await manager.broadcast(game_id, {
                            "type": "move",
                            "data": {
                                "success": True,
                                "game": game.to_dict(),
                                "aiMove": {"uci": move.uci(), "san": san}
                            }
                        })
        
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "move":
                result = await game_manager.make_human_move(game_id, data.get("move"))
                await manager.broadcast(game_id, {
                    "type": "move",
                    "data": result
                })
            
            elif data.get("type") == "get_state":
                game = game_manager.get_game(game_id)
                if game:
                    await websocket.send_json({
                        "type": "state",
                        "game": game.to_dict()
                    })
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, game_id)


@app.websocket("/ws/ai-game/{game_id}")
async def websocket_ai_game(websocket: WebSocket, game_id: str):
    """WebSocket endpoint for AI vs AI games with streaming moves"""
    await manager.connect(websocket, game_id)
    
    try:
        game = game_manager.get_game(game_id)
        if not game:
            await websocket.send_json({"type": "error", "message": "Game not found"})
            return
        
        # Send initial state
        await websocket.send_json({
            "type": "connected",
            "game": game.to_dict()
        })
        
        # Default speed (seconds between moves)
        move_speed = 1.5
        is_playing = True
        
        while True:
            try:
                # Check for control messages with timeout
                data = await asyncio.wait_for(
                    websocket.receive_json(),
                    timeout=0.1
                )
                
                if data.get("type") == "pause":
                    is_playing = False
                    game_manager.pause_game(game_id)
                    await websocket.send_json({"type": "paused"})
                    
                elif data.get("type") == "resume":
                    is_playing = True
                    game_manager.resume_game(game_id)
                    await websocket.send_json({"type": "resumed"})
                    
                elif data.get("type") == "speed":
                    move_speed = max(0.3, min(5.0, float(data.get("value", 1.5))))
                    await websocket.send_json({"type": "speed_set", "value": move_speed})
                    
                elif data.get("type") == "step":
                    # Make single move when paused
                    result = await game_manager.get_ai_move(game_id)
                    if result:
                        await websocket.send_json({
                            "type": "move",
                            "data": result
                        })
                    
            except asyncio.TimeoutError:
                pass
            
            # Make AI move if playing
            if is_playing:
                game = game_manager.get_game(game_id)
                if game and game.status.value == "active":
                    result = await game_manager.get_ai_move(game_id)
                    if result:
                        await websocket.send_json({
                            "type": "move",
                            "data": result
                        })
                        await asyncio.sleep(move_speed)
                    else:
                        # Game ended
                        await websocket.send_json({
                            "type": "game_over",
                            "game": game.to_dict()
                        })
                        is_playing = False
                else:
                    await asyncio.sleep(0.5)
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, game_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

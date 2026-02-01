"""
Chess Openings Database
Contains ECO classified openings for the strategy study center
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

@dataclass
class Opening:
    eco: str
    name: str
    moves: str  # PGN format
    fen: str  # Position after opening moves
    description: str
    category: str
    win_rate_white: float
    win_rate_black: float
    draw_rate: float
    popularity: int  # 1-100

# ECO Classification Categories
class OpeningCategory(Enum):
    OPEN_GAMES = "Open Games (1.e4 e5)"
    SEMI_OPEN = "Semi-Open Games (1.e4, other)"
    CLOSED = "Closed Games (1.d4 d5)"
    INDIAN = "Indian Defenses (1.d4 Nf6)"
    FLANK = "Flank Openings"

# Opening Database
OPENINGS_DATABASE: List[Opening] = [
    # === OPEN GAMES (E4 E5) ===
    Opening(
        eco="C50",
        name="Italian Game",
        moves="1. e4 e5 2. Nf3 Nc6 3. Bc4",
        fen="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        description="One of the oldest openings, aiming to control the center and develop pieces rapidly.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=38.5,
        win_rate_black=28.2,
        draw_rate=33.3,
        popularity=92
    ),
    Opening(
        eco="C51",
        name="Italian Game: Evans Gambit",
        moves="1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4",
        fen="r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq b3 0 4",
        description="An aggressive gambit sacrificing a pawn for rapid development and attack.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=42.1,
        win_rate_black=31.5,
        draw_rate=26.4,
        popularity=68
    ),
    Opening(
        eco="C60",
        name="Ruy Lopez",
        moves="1. e4 e5 2. Nf3 Nc6 3. Bb5",
        fen="r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        description="The Spanish Game - one of the most popular and deeply analyzed openings.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=36.8,
        win_rate_black=27.9,
        draw_rate=35.3,
        popularity=95
    ),
    Opening(
        eco="C65",
        name="Ruy Lopez: Berlin Defense",
        moves="1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6",
        fen="r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        description="A solid defense leading to endgames, famously used to great effect.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=32.4,
        win_rate_black=25.1,
        draw_rate=42.5,
        popularity=88
    ),
    Opening(
        eco="C42",
        name="Petrov's Defense",
        moves="1. e4 e5 2. Nf3 Nf6",
        fen="rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        description="A symmetrical and solid defense, often leading to drawish positions.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=33.1,
        win_rate_black=24.8,
        draw_rate=42.1,
        popularity=75
    ),
    Opening(
        eco="C21",
        name="King's Gambit",
        moves="1. e4 e5 2. f4",
        fen="rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2",
        description="An aggressive romantic-era gambit sacrificing a pawn for quick attack.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=40.2,
        win_rate_black=34.8,
        draw_rate=25.0,
        popularity=62
    ),
    Opening(
        eco="C55",
        name="Two Knights Defense",
        moves="1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6",
        fen="r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        description="An active defense inviting sharp tactical play.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=37.5,
        win_rate_black=29.8,
        draw_rate=32.7,
        popularity=78
    ),
    Opening(
        eco="C44",
        name="Scotch Game",
        moves="1. e4 e5 2. Nf3 Nc6 3. d4",
        fen="r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description="An open game leading to active piece play for both sides.",
        category=OpeningCategory.OPEN_GAMES.value,
        win_rate_white=38.9,
        win_rate_black=30.2,
        draw_rate=30.9,
        popularity=72
    ),
    
    # === SEMI-OPEN GAMES ===
    Opening(
        eco="B20",
        name="Sicilian Defense",
        moves="1. e4 c5",
        fen="rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
        description="The most popular response to 1.e4, leading to asymmetrical positions.",
        category=OpeningCategory.SEMI_OPEN.value,
        win_rate_white=35.2,
        win_rate_black=31.8,
        draw_rate=33.0,
        popularity=98
    ),
    Opening(
        eco="B90",
        name="Sicilian: Najdorf Variation",
        moves="1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6",
        fen="rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        description="One of the sharpest and most theoretically demanding openings.",
        category=OpeningCategory.SEMI_OPEN.value,
        win_rate_white=34.8,
        win_rate_black=32.5,
        draw_rate=32.7,
        popularity=94
    ),
    Opening(
        eco="B33",
        name="Sicilian: Sveshnikov Variation",
        moves="1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5",
        fen="r1bqkb1r/pp1p1ppp/2n2n2/4p3/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        description="A dynamic variation with the characteristic backward d6-pawn.",
        category=OpeningCategory.SEMI_OPEN.value,
        win_rate_white=35.1,
        win_rate_black=31.2,
        draw_rate=33.7,
        popularity=82
    ),
    Opening(
        eco="B10",
        name="Caro-Kann Defense",
        moves="1. e4 c6",
        fen="rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        description="A solid defense aiming for a strong pawn structure.",
        category=OpeningCategory.SEMI_OPEN.value,
        win_rate_white=35.8,
        win_rate_black=28.4,
        draw_rate=35.8,
        popularity=85
    ),
    Opening(
        eco="C00",
        name="French Defense",
        moves="1. e4 e6",
        fen="rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        description="A solid but somewhat cramped defense with counterattacking potential.",
        category=OpeningCategory.SEMI_OPEN.value,
        win_rate_white=36.2,
        win_rate_black=29.1,
        draw_rate=34.7,
        popularity=83
    ),
    Opening(
        eco="B01",
        name="Scandinavian Defense",
        moves="1. e4 d5",
        fen="rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
        description="An early queen sortie defense, leading to open positions.",
        category=OpeningCategory.SEMI_OPEN.value,
        win_rate_white=39.2,
        win_rate_black=28.5,
        draw_rate=32.3,
        popularity=58
    ),
    Opening(
        eco="B06",
        name="Modern Defense",
        moves="1. e4 g6",
        fen="rnbqkbnr/pppppp1p/6p1/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        description="A hypermodern defense allowing White to build a big center.",
        category=OpeningCategory.SEMI_OPEN.value,
        win_rate_white=42.1,
        win_rate_black=27.8,
        draw_rate=30.1,
        popularity=45
    ),
    
    # === CLOSED GAMES ===
    Opening(
        eco="D00",
        name="Queen's Pawn Game",
        moves="1. d4 d5",
        fen="rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2",
        description="The starting point for many classical openings.",
        category=OpeningCategory.CLOSED.value,
        win_rate_white=37.5,
        win_rate_black=28.2,
        draw_rate=34.3,
        popularity=90
    ),
    Opening(
        eco="D30",
        name="Queen's Gambit",
        moves="1. d4 d5 2. c4",
        fen="rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
        description="One of the oldest and most respected openings in chess.",
        category=OpeningCategory.CLOSED.value,
        win_rate_white=38.2,
        win_rate_black=27.5,
        draw_rate=34.3,
        popularity=93
    ),
    Opening(
        eco="D35",
        name="Queen's Gambit Declined",
        moves="1. d4 d5 2. c4 e6",
        fen="rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        description="A solid classical response to the Queen's Gambit.",
        category=OpeningCategory.CLOSED.value,
        win_rate_white=36.8,
        win_rate_black=26.9,
        draw_rate=36.3,
        popularity=88
    ),
    Opening(
        eco="D20",
        name="Queen's Gambit Accepted",
        moves="1. d4 d5 2. c4 dxc4",
        fen="rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        description="Black accepts the pawn but must work to keep it.",
        category=OpeningCategory.CLOSED.value,
        win_rate_white=38.5,
        win_rate_black=28.2,
        draw_rate=33.3,
        popularity=72
    ),
    Opening(
        eco="D10",
        name="Slav Defense",
        moves="1. d4 d5 2. c4 c6",
        fen="rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        description="A solid defense supporting the d5 pawn with c6.",
        category=OpeningCategory.CLOSED.value,
        win_rate_white=36.4,
        win_rate_black=27.8,
        draw_rate=35.8,
        popularity=85
    ),
    Opening(
        eco="A45",
        name="Trompowsky Attack",
        moves="1. d4 Nf6 2. Bg5",
        fen="rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 2 2",
        description="A surprise weapon avoiding main theory with early bishop sortie.",
        category=OpeningCategory.CLOSED.value,
        win_rate_white=39.8,
        win_rate_black=28.5,
        draw_rate=31.7,
        popularity=52
    ),
    Opening(
        eco="D80",
        name="Grünfeld Defense",
        moves="1. d4 Nf6 2. c4 g6 3. Nc3 d5",
        fen="rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6 0 4",
        description="A dynamic hypermodern defense challenging the center immediately.",
        category=OpeningCategory.CLOSED.value,
        win_rate_white=37.2,
        win_rate_black=30.1,
        draw_rate=32.7,
        popularity=78
    ),
    
    # === INDIAN DEFENSES ===
    Opening(
        eco="E60",
        name="King's Indian Defense",
        moves="1. d4 Nf6 2. c4 g6",
        fen="rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        description="A fighting defense leading to complex middlegame positions.",
        category=OpeningCategory.INDIAN.value,
        win_rate_white=37.8,
        win_rate_black=30.5,
        draw_rate=31.7,
        popularity=88
    ),
    Opening(
        eco="E70",
        name="King's Indian: Classical Variation",
        moves="1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3",
        fen="rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 5",
        description="The main line of the King's Indian, featuring classic pawn structures.",
        category=OpeningCategory.INDIAN.value,
        win_rate_white=36.9,
        win_rate_black=31.2,
        draw_rate=31.9,
        popularity=82
    ),
    Opening(
        eco="E20",
        name="Nimzo-Indian Defense",
        moves="1. d4 Nf6 2. c4 e6 3. Nc3 Bb4",
        fen="rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        description="A highly respected defense exerting pressure on e4.",
        category=OpeningCategory.INDIAN.value,
        win_rate_white=35.2,
        win_rate_black=28.8,
        draw_rate=36.0,
        popularity=91
    ),
    Opening(
        eco="E10",
        name="Queen's Indian Defense",
        moves="1. d4 Nf6 2. c4 e6 3. Nf3 b6",
        fen="rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
        description="A solid flexible defense controlling the e4 square.",
        category=OpeningCategory.INDIAN.value,
        win_rate_white=36.1,
        win_rate_black=27.2,
        draw_rate=36.7,
        popularity=75
    ),
    Opening(
        eco="A50",
        name="Benoni Defense",
        moves="1. d4 Nf6 2. c4 c5",
        fen="rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNR w KQkq c6 0 3",
        description="An aggressive defense creating imbalanced pawn structures.",
        category=OpeningCategory.INDIAN.value,
        win_rate_white=40.2,
        win_rate_black=29.8,
        draw_rate=30.0,
        popularity=62
    ),
    Opening(
        eco="A56",
        name="Modern Benoni",
        moves="1. d4 Nf6 2. c4 c5 3. d5 e6 4. Nc3 exd5 5. cxd5 d6",
        fen="rnbqkb1r/pp3ppp/3p1n2/2pP4/8/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 6",
        description="A sharp variation with asymmetric pawn structure.",
        category=OpeningCategory.INDIAN.value,
        win_rate_white=39.5,
        win_rate_black=30.2,
        draw_rate=30.3,
        popularity=58
    ),
    Opening(
        eco="A80",
        name="Dutch Defense",
        moves="1. d4 f5",
        fen="rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6 0 2",
        description="An ambitious defense seizing kingside space.",
        category=OpeningCategory.INDIAN.value,
        win_rate_white=39.8,
        win_rate_black=28.2,
        draw_rate=32.0,
        popularity=48
    ),
    
    # === FLANK OPENINGS ===
    Opening(
        eco="A00",
        name="English Opening",
        moves="1. c4",
        fen="rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
        description="A flexible flank opening that can transpose to many systems.",
        category=OpeningCategory.FLANK.value,
        win_rate_white=36.5,
        win_rate_black=27.8,
        draw_rate=35.7,
        popularity=82
    ),
    Opening(
        eco="A04",
        name="Réti Opening",
        moves="1. Nf3",
        fen="rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
        description="A hypermodern opening delaying pawn center commitment.",
        category=OpeningCategory.FLANK.value,
        win_rate_white=37.2,
        win_rate_black=28.1,
        draw_rate=34.7,
        popularity=78
    ),
    Opening(
        eco="A01",
        name="Larsen's Opening",
        moves="1. b3",
        fen="rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq - 0 1",
        description="A quiet fianchetto opening popularized by Bent Larsen.",
        category=OpeningCategory.FLANK.value,
        win_rate_white=38.5,
        win_rate_black=29.2,
        draw_rate=32.3,
        popularity=35
    ),
    Opening(
        eco="A02",
        name="Bird's Opening",
        moves="1. f4",
        fen="rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1",
        description="An aggressive flank opening seizing kingside space.",
        category=OpeningCategory.FLANK.value,
        win_rate_white=37.8,
        win_rate_black=30.5,
        draw_rate=31.7,
        popularity=32
    ),
    Opening(
        eco="B00",
        name="King's Fianchetto Opening",
        moves="1. g3",
        fen="rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1",
        description="A flexible setup preparing to fianchetto the king's bishop.",
        category=OpeningCategory.FLANK.value,
        win_rate_white=36.9,
        win_rate_black=28.4,
        draw_rate=34.7,
        popularity=42
    ),
]

class OpeningExplorer:
    """
    Opening Explorer for studying chess openings
    """
    
    def __init__(self):
        self.openings = OPENINGS_DATABASE
        self._build_opening_tree()
    
    def _build_opening_tree(self):
        """Build a tree structure from openings for navigation"""
        self.opening_tree: Dict[str, List[Opening]] = {}
        for opening in self.openings:
            first_move = opening.moves.split()[0] + " " + opening.moves.split()[1]
            if first_move not in self.opening_tree:
                self.opening_tree[first_move] = []
            self.opening_tree[first_move].append(opening)
    
    def get_all_openings(self) -> List[Dict]:
        """Get all openings as dictionaries"""
        return [self._opening_to_dict(o) for o in self.openings]
    
    def get_openings_by_category(self, category: str) -> List[Dict]:
        """Get openings filtered by category"""
        return [
            self._opening_to_dict(o) 
            for o in self.openings 
            if o.category == category
        ]
    
    def get_opening_by_eco(self, eco: str) -> Optional[Dict]:
        """Get a specific opening by ECO code"""
        for opening in self.openings:
            if opening.eco == eco:
                return self._opening_to_dict(opening)
        return None
    
    def get_opening_by_name(self, name: str) -> Optional[Dict]:
        """Search opening by name (partial match)"""
        name_lower = name.lower()
        for opening in self.openings:
            if name_lower in opening.name.lower():
                return self._opening_to_dict(opening)
        return None
    
    def get_openings_for_position(self, fen: str) -> List[Dict]:
        """Get openings that lead through a given position"""
        # Simplified matching - in production would use move tree
        return [
            self._opening_to_dict(o) 
            for o in self.openings 
            if o.fen == fen
        ]
    
    def get_popular_openings(self, limit: int = 10) -> List[Dict]:
        """Get most popular openings"""
        sorted_openings = sorted(self.openings, key=lambda x: x.popularity, reverse=True)
        return [self._opening_to_dict(o) for o in sorted_openings[:limit]]
    
    def get_random_opening_for_ai(self, category: Optional[str] = None) -> Opening:
        """Get a random opening for AI vs AI games"""
        if category:
            filtered = [o for o in self.openings if o.category == category]
            return filtered[__import__('random').randint(0, len(filtered) - 1)] if filtered else self.openings[0]
        return self.openings[__import__('random').randint(0, len(self.openings) - 1)]
    
    def get_categories(self) -> List[Dict]:
        """Get all opening categories with counts"""
        categories = {}
        for opening in self.openings:
            cat = opening.category
            if cat not in categories:
                categories[cat] = {"name": cat, "count": 0, "avg_popularity": 0}
            categories[cat]["count"] += 1
            categories[cat]["avg_popularity"] += opening.popularity
        
        for cat in categories:
            categories[cat]["avg_popularity"] /= categories[cat]["count"]
        
        return list(categories.values())
    
    def _opening_to_dict(self, opening: Opening) -> Dict:
        """Convert Opening dataclass to dictionary"""
        return {
            "eco": opening.eco,
            "name": opening.name,
            "moves": opening.moves,
            "fen": opening.fen,
            "description": opening.description,
            "category": opening.category,
            "statistics": {
                "whiteWins": opening.win_rate_white,
                "blackWins": opening.win_rate_black,
                "draws": opening.draw_rate
            },
            "popularity": opening.popularity
        }

# Global instance
opening_explorer = OpeningExplorer()

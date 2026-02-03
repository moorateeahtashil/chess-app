"""
Chess Academy Lessons Database
Structured learning content from Beginner to Master
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class Difficulty(Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    MASTER = "Master"

@dataclass
class Lesson:
    id: str
    title: str
    difficulty: Difficulty
    category: str
    description: str
    content: str
    fen: Optional[str] = None
    estimated_time: int = 5  # minutes

LESSONS_DATABASE: List[Lesson] = [
    # === BEGINNER ===
    Lesson(
        id="beg-1",
        title="Introduction to Pieces",
        difficulty=Difficulty.BEGINNER,
        category="Fundamentals",
        description="Learn how each piece moves on the board.",
        content="Chess pieces have unique movement rules. The Rook moves straight, the Bishop diagonally, and the Queen does both. The Knight has a special 'L' shape movement, allowing it to jump over other pieces.",
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        estimated_time=5
    ),
    Lesson(
        id="beg-2",
        title="The King & Checkmate",
        difficulty=Difficulty.BEGINNER,
        category="Fundamentals",
        description="The ultimate goal: trapping the opponent's King.",
        content="The game ends when a King is in 'Checkmate'—under attack with no legal way to escape. Learning to deliver mate with a Queen and King is the first step to becoming a master.",
        fen="4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1",
        estimated_time=5
    ),
    Lesson(
        id="beg-3",
        title="Opening Principles",
        difficulty=Difficulty.BEGINNER,
        category="Strategy",
        description="Control the center and develop your pieces.",
        content="In the first few moves, aim to control the central squares (e4, d4, e5, d5). Develop your Knights and Bishops early to prepare for the middle game.",
        fen="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        estimated_time=7
    ),
    Lesson(
        id="beg-4",
        title="Special Moves: Castling",
        difficulty=Difficulty.BEGINNER,
        category="Fundamentals",
        description="Protect your King and activate your Rooks.",
        content="Castling is a special move involving the King and a Rook. It helps get the King to safety behind a wall of pawns while bringing the Rook toward the center.",
        fen="rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        estimated_time=6
    ),
    Lesson(
        id="beg-5",
        title="Piece Values",
        difficulty=Difficulty.BEGINNER,
        category="Fundamentals",
        description="Understand the relative strength of your army.",
        content="Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9. Knowing these values helps you decide which trades are beneficial.",
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        estimated_time=4
    ),
    Lesson(
        id="beg-6",
        title="The En Passant Capture",
        difficulty=Difficulty.BEGINNER,
        category="Fundamentals",
        description="A unique pawn-capturing rule.",
        content="If a pawn moves two squares and lands next to an enemy pawn, that enemy pawn can capture it 'in passing' as if it had only moved one square.",
        fen="rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
        estimated_time=6
    ),

    # === INTERMEDIATE ===
    Lesson(
        id="int-1",
        title="The Deadly Fork",
        difficulty=Difficulty.INTERMEDIATE,
        category="Tactics",
        description="Attacking two pieces at once.",
        content="A fork occurs when one piece (often a Knight) attacks two valuable enemy targets simultaneously, forcing the opponent to lose material.",
        fen="4k3/1p4p1/2n5/3q4/3N4/8/PP3PPP/4R1K1 w - - 0 1",
        estimated_time=10
    ),
    Lesson(
        id="int-2",
        title="The Power of the Pin",
        difficulty=Difficulty.INTERMEDIATE,
        category="Tactics",
        description="Stopping pieces from moving.",
        content="A pin happens when an attacking piece threatens a more valuable piece behind a less valuable one. Moving the pinned piece would lead to the loss of the higher-value piece.",
        fen="4k3/4r3/8/8/4B3/8/8/4K3 w - - 0 1",
        estimated_time=8
    ),
    Lesson(
        id="int-3",
        title="Discovered Attacks",
        difficulty=Difficulty.INTERMEDIATE,
        category="Tactics",
        description="Hidden threats revealed by movement.",
        content="By moving one piece, you clear a line for another piece to attack. This is one of the most dangerous tactical weapons in chess.",
        fen="r1bqk2r/pp2bppp/2n1pn2/3p4/3P4/1PNBP3/P4PPP/R1BQK1NR w KQkq - 0 1",
        estimated_time=12
    ),
    Lesson(
        id="int-4",
        title="The Skewer",
        difficulty=Difficulty.INTERMEDIATE,
        category="Tactics",
        description="The opposite of a pin.",
        content="A skewer is when a valuable piece is attacked and must move, leaving a less valuable piece behind it to be captured.",
        fen="4k3/8/8/8/q3B3/8/8/R3K3 w - - 0 1",
        estimated_time=10
    ),
    Lesson(
        id="int-5",
        title="Removing the Guard",
        difficulty=Difficulty.INTERMEDIATE,
        category="Tactics",
        description="Destroying the defense.",
        content="If an enemy piece is well-defended, look for ways to capture or distract its defender before delivering the final blow.",
        fen="r1b1k2r/pp2bppp/2n1pn2/2pp2B1/3P4/2N1PN2/PPP1BPPP/R2QK2R w KQkq - 0 1",
        estimated_time=12
    ),
    Lesson(
        id="int-6",
        title="Rook & King Endgames",
        difficulty=Difficulty.INTERMEDIATE,
        category="Endgame",
        description="Fundamental checkmating patterns.",
        content="Mastering the technique of checkmating with a single Rook and King is essential. It requires 'boxing in' the enemy King using the edge of the board.",
        fen="4k3/8/4K3/8/8/2R5/8/8 w - - 0 1",
        estimated_time=15
    ),

    # === MASTER ===
    Lesson(
        id="mas-1",
        title="Prophylaxis Strategy",
        difficulty=Difficulty.MASTER,
        category="Strategy",
        description="Preventing the opponent's ideas.",
        content="Master-level play involves predicting and neutralizing your opponent's plans before they can even start them. This 'preventive thinking' is called prophylaxis.",
        fen="rnbqk2r/pp2bppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 6",
        estimated_time=15
    ),
    Lesson(
        id="mas-2",
        title="The Minority Attack",
        difficulty=Difficulty.MASTER,
        category="Strategy",
        description="Positional pawn pressure.",
        content="In certain structures, attacking with fewer pawns on a flank can create permanent weaknesses in the opponent's pawn chain, particularly the 'backward pawn'.",
        fen="r1bq1rk1/pp2bppp/2n1pn2/2pp4/2PP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 8",
        estimated_time=20
    ),
    Lesson(
        id="mas-3",
        title="Lucena Position",
        difficulty=Difficulty.MASTER,
        category="Endgame",
        description="The winning rook endgame.",
        content="The Lucena position is the blueprint for winning Rook and Pawn vs Rook endgames. It involves building a 'bridge' with your Rook to protect your King from checks.",
        fen="1R6/2P5/3K4/3k4/8/8/8/6r1 w - - 0 1",
        estimated_time=25
    ),
    Lesson(
        id="mas-4",
        title="Positional Sacrifice",
        difficulty=Difficulty.MASTER,
        category="Strategy",
        description="Material for dynamic compensation.",
        content="Sometimes, giving up a small amount of material (like an exchange) can grant such a long-term strategic advantage that it's worth more than the points lost.",
        fen="r1bq1rk1/1pp2ppp/p1np1n2/4p3/2B1P3/2NPPN2/PPP3PP/R2Q1RK1 b - - 0 1",
        estimated_time=20
    ),
    Lesson(
        id="mas-5",
        title="Space Advantage",
        difficulty=Difficulty.MASTER,
        category="Strategy",
        description="Dominating the board.",
        content="Controlling more squares than your opponent limits their piece mobility, leading to cramped positions and eventual tactical collapses.",
        fen="r1bqk2r/pp2bppp/2n1pn2/2pp4/2PP4/2N1PN2/PP1B1PPP/R2QKB1R w KQkq - 0 1",
        estimated_time=18
    ),
    Lesson(
        id="mas-6",
        title="Weak Square Complexes",
        difficulty=Difficulty.MASTER,
        category="Strategy",
        description="Exploiting color weaknesses.",
        content="If a player loses their 'good' Bishop, squares of that color can become permanent weaknesses that the opponent can occupy and exploit.",
        fen="1rbq1rk1/pp2bppp/2n1pn2/2pp4/2PP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 1",
        estimated_time=22
    )
]

class LessonsManager:
    def __init__(self):
        self.lessons = LESSONS_DATABASE

    def get_all_lessons(self) -> List[Dict]:
        return [self._lesson_to_dict(l) for l in self.lessons]

    def get_lessons_by_difficulty(self, difficulty: str) -> List[Dict]:
        return [
            self._lesson_to_dict(l) 
            for l in self.lessons 
            if l.difficulty.value == difficulty
        ]

    def get_lesson_by_id(self, lesson_id: str) -> Optional[Dict]:
        for lesson in self.lessons:
            if lesson.id == lesson_id:
                return self._lesson_to_dict(lesson)
        return None

    def _lesson_to_dict(self, lesson: Lesson) -> Dict:
        return {
            "id": lesson.id,
            "title": lesson.title,
            "difficulty": lesson.difficulty.value,
            "category": lesson.category,
            "description": lesson.description,
            "content": lesson.content,
            "fen": lesson.fen,
            "estimatedTime": lesson.estimated_time
        }

lessons_manager = LessonsManager()

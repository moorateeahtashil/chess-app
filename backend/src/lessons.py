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
        title="The Chessboard & Piece Movement",
        difficulty=Difficulty.BEGINNER,
        category="Fundamentals",
        description="Learn how to set up the board and how each piece moves.",
        content="Chess is played on an 8x8 grid. The Rook moves in straight lines, the Bishop on diagonals, the Queen combines both, and the Knight moves in an 'L' shape. The King moves one square in any direction.",
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        estimated_time=5
    ),
    Lesson(
        id="beg-2",
        title="Objective: Checkmate",
        difficulty=Difficulty.BEGINNER,
        category="Fundamentals",
        description="Understand the primary goal of the game.",
        content="Checkmate occurs when the King is under attack and has no legal moves to escape. This wins the game immediately.",
        fen="4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1",
        estimated_time=3
    ),
    Lesson(
        id="beg-3",
        title="Opening Principles",
        difficulty=Difficulty.BEGINNER,
        category="Strategy",
        description="What to do in your first 10 moves.",
        content="1. Control the center. 2. Develop your minor pieces (Knights and Bishops). 3. Get your King to safety by castling.",
        fen="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        estimated_time=7
    ),

    # === INTERMEDIATE ===
    Lesson(
        id="int-1",
        title="Tactical Patterns: The Fork",
        difficulty=Difficulty.INTERMEDIATE,
        category="Tactics",
        description="One piece attacking two or more targets simultaneously.",
        content="A fork is a common tactical motif. Knights and Queens are particularly good at creating them.",
        fen="4k3/1p4p1/2n5/3q4/3N4/8/PP3PPP/4R1K1 w - - 0 1",
        estimated_time=10
    ),
    Lesson(
        id="int-2",
        title="The Power of the Pin",
        difficulty=Difficulty.INTERMEDIATE,
        category="Tactics",
        description="Immobilizing an opponent's piece.",
        content="A pin occurs when an attacking piece threatens a valuable piece behind a less valuable one. The pinned piece cannot move without losing the material behind it.",
        fen="4k3/4r3/8/8/4B3/8/8/4K3 w - - 0 1",
        estimated_time=8
    ),
    Lesson(
        id="int-3",
        title="Basic Endgames: King + Pawn",
        difficulty=Difficulty.INTERMEDIATE,
        category="Endgame",
        description="Learn the concept of 'Opposition'.",
        content="In King and Pawn endings, the King must lead the way for the pawn. Understanding the opposition is key to promotion.",
        fen="4k3/4p3/4K3/8/8/8/8/8 w - - 0 1",
        estimated_time=12
    ),

    # === MASTER ===
    Lesson(
        id="mas-1",
        title="Prophylaxis: Preventive Thinking",
        difficulty=Difficulty.MASTER,
        category="Strategy",
        description="Stopping your opponent's plans before they happen.",
        content="Prophylaxis (famously advocated by Nimzowitsch) involves identifying what your opponent wants to do and preventing it, even if it doesn't immediately improve your position.",
        fen="rnbqk2r/pp2bppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 6",
        estimated_time=15
    ),
    Lesson(
        id="mas-2",
        title="The Minority Attack",
        difficulty=Difficulty.MASTER,
        category="Strategy",
        description="Using fewer pawns to attack more.",
        content="Common in the Queen's Gambit Declined, the minority attack (a- and b-pawns against c-, d-, and e-pawns) aims to create a weakness on the c6 square.",
        fen="r1bq1rk1/pp2bppp/2n1pn2/2pp4/2PP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 8",
        estimated_time=20
    ),
    Lesson(
        id="mas-3",
        title="Complex Rook Endgames",
        difficulty=Difficulty.MASTER,
        category="Endgame",
        description="Philidor and Lucena positions.",
        content="In high-level chess, most games end in Rook endgames. Mastering the Lucena position (for winning) and the Philidor position (for drawing) is essential.",
        fen="1R6/8/8/3k4/8/3K4/2P5/6r1 w - - 0 1",
        estimated_time=25
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

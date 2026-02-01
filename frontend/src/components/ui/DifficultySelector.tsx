import React from 'react';
import { Difficulty } from '../../store/gameStore';
import './DifficultySelector.css';

interface DifficultySelectorProps {
    value: Difficulty;
    onChange: (value: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ value, onChange }) => {
    const difficulties: { id: Difficulty; label: string; icon: string }[] = [
        { id: 'EASY', label: 'Easy', icon: '🌱' },
        { id: 'MEDIUM', label: 'Medium', icon: '⚖️' },
        { id: 'HARD', label: 'Hard', icon: '🔥' },
        { id: 'MASTER', label: 'Master', icon: '👑' },
    ];

    return (
        <div className="difficulty-grid">
            {difficulties.map((diff) => (
                <button
                    key={diff.id}
                    onClick={() => onChange(diff.id)}
                    className={`difficulty-btn glass-card ${value === diff.id ? 'active' : ''}`}
                >
                    <span className="diff-icon">{diff.icon}</span>
                    <span className="diff-label">{diff.label}</span>
                </button>
            ))}
        </div>
    );
};

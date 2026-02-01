import React from 'react';
import { Difficulty } from '../../store/gameStore';

interface DifficultySelectorProps {
    value: Difficulty;
    onChange: (value: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ value, onChange }) => {
    const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'MASTER'];

    return (
        <div className="difficulty-selector" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {difficulties.map((diff) => (
                <button
                    key={diff}
                    onClick={() => onChange(diff)}
                    className={`btn ${value === diff ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                >
                    {diff}
                </button>
            ))}
        </div>
    );
};

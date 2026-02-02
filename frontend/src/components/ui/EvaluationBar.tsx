import React from 'react';
import './EvaluationBar.css';

interface EvaluationBarProps {
    evaluation: number;
    isWhiteToMove: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({ evaluation, isWhiteToMove }: EvaluationBarProps) => {
    // Clamp evaluation between -10 and 10 for display
    const clampedEval: number = Math.max(-10, Math.min(10, evaluation));
    // Percentage for white bar (50% is 0.0)
    // +10 -> 100%, -10 -> 0%
    const heightPercent: number = 50 + (clampedEval * 5);
    const isWhiteAdvantage: boolean = heightPercent > 50;

    return (
        <div className="evaluation-bar-container">
            <div
                className="evaluation-fill"
                style={{ height: `${heightPercent}%` }}
            />
            <div className={`evaluation-text ${isWhiteAdvantage ? 'dark' : 'light'}`} style={{
                top: isWhiteAdvantage ? 'auto' : '5px',
                bottom: isWhiteAdvantage ? '5px' : 'auto'
            }}>
                {Math.abs(evaluation).toFixed(1)}
            </div>
        </div>
    );
};

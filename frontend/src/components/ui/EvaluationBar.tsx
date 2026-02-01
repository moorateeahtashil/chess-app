import React from 'react';

interface EvaluationBarProps {
    evaluation: number;
    isWhiteToMove: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({ evaluation, isWhiteToMove }) => {
    // Clamp evaluation between -10 and 10 for display
    const clampedEval = Math.max(-10, Math.min(10, evaluation));
    // Percentage for white bar (50% is 0.0)
    // +10 -> 100%, -10 -> 0%
    const heightPercent = 50 + (clampedEval * 5);

    return (
        <div className="evaluation-bar-container" style={{ width: '20px', height: '100%', background: '#333', borderRadius: '4px', overflow: 'hidden', border: '1px solid #444' }}>
            <div
                className="evaluation-fill"
                style={{
                    height: `${heightPercent}%`,
                    width: '100%',
                    background: '#fff',
                    transition: 'height 0.5s ease',
                    position: 'absolute',
                    bottom: 0
                }}
            />
            <div style={{
                position: 'absolute',
                top: heightPercent > 50 ? 'calc(100% - 20px)' : '5px',
                width: '100%',
                textAlign: 'center',
                fontSize: '10px',
                color: heightPercent > 50 ? '#000' : '#fff',
                fontWeight: 'bold'
            }}>
                {Math.abs(evaluation).toFixed(1)}
            </div>
        </div>
    );
};

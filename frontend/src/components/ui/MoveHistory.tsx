import React, { useRef, useEffect } from 'react';

interface MoveHistoryProps {
    history: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const moves: string[][] = [];
    for (let i = 0; i < history.length; i += 2) {
        moves.push([history[i], history[i + 1] || '']);
    }

    return (
        <div className="move-history" style={{
            background: 'var(--color-bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            height: '300px',
            overflowY: 'auto'
        }} ref={scrollRef}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: 'var(--text-lg)', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>History</h3>
            <div className="moves-list">
                {moves.map((movePair, index) => (
                    <div key={index} className="move-row" style={{ display: 'flex', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ width: '30px', color: '#666' }}>{index + 1}.</span>
                        <span style={{ width: '80px', fontWeight: 'bold' }}>{movePair[0]}</span>
                        <span style={{ width: '80px', fontWeight: 'bold' }}>{movePair[1]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

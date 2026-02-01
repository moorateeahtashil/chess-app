import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';

interface ChessPieceIconProps {
    type: string;
    color: 'white' | 'black';
    className?: string;
}

type FitOpts = {
    padding?: number;
    flipY?: boolean;
};

function useAutoFitTransform(ref: React.RefObject<SVGGElement>, opts: FitOpts) {
    const { padding = 3, flipY = false } = opts;
    const [transform, setTransform] = useState('');

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const bbox = el.getBBox();
        if (!isFinite(bbox.width) || !isFinite(bbox.height) || bbox.width <= 0 || bbox.height <= 0) {
            setTransform('');
            return;
        }

        const view = 45;
        const inner = view - padding * 2;
        const s = Math.min(inner / bbox.width, inner / bbox.height);
        const tx = (view - bbox.width * s) / 2;
        const ty = (view - bbox.height * s) / 2;

        if (flipY) {
            setTransform(
                `translate(${tx} ${ty}) scale(${s} ${-s}) translate(${-bbox.x} ${-(bbox.y + bbox.height)})`
            );
        } else {
            setTransform(`translate(${tx} ${ty}) scale(${s}) translate(${-bbox.x} ${-bbox.y})`);
        }
    }, [padding, flipY]);

    return transform;
}

const AutoFit: React.FC<{
    children: React.ReactNode;
    flipY?: boolean;
    padding?: number;
}> = ({ children, flipY = false, padding = 3 }) => {
    const rawRef = useRef<SVGGElement>(null);
    const transform = useAutoFitTransform(rawRef, { padding, flipY });

    return (
        <>
            {/* hidden measurement copy */}
            <g ref={rawRef} visibility="hidden">
                {children}
            </g>
            {/* fitted visible copy */}
            <g transform={transform}>{children}</g>
        </>
    );
};

export const ChessPieceIcon: React.FC<ChessPieceIconProps> = ({ type, color, className }) => {
    const isWhite = color === 'white';
    const strokeColor = isWhite ? '#000000' : '#ffffff';
    const fillColor = isWhite ? '#ffffff' : '#000000';
    const strokeWidth = 1.6;

    // Paint wrapper: forces correct fill/stroke for ALL pieces
    const Paint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <g fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}>
            {children}
        </g>
    );

    const piece = useMemo(() => {
        switch (type.toLowerCase()) {
            case 'p':
            case 'pawn':
                return (
                    <Paint>
                        <path
                            d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                        />
                    </Paint>
                );

            case 'r':
            case 'rook':
                return (
                    <Paint>
                        <path
                            d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z"
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="butt"
                        />
                        <path
                            d="M14 29.5v-13h17v13H14z"
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                        />
                        <path
                            d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="butt"
                        />
                        <path
                            d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23"
                            className="no-fill"
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="miter"
                        />
                    </Paint>
                );

            case 'n':
            case 'knight':
                return (
                    <Paint>
                        <path
                            d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                        />
                        <path
                            d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                        />
                        <path
                            d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z"
                            fill={strokeColor}
                            stroke="none"
                        />
                        <path
                            d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z"
                            fill={strokeColor}
                            stroke="none"
                        />
                    </Paint>
                );

            case 'b':
            case 'bishop':
                return (
                    <Paint>
                        <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                            <path
                                d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                            <path
                                d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                            <path
                                d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                        </g>
                        <path
                            d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="miter"
                            fill="none"
                        />
                    </Paint>
                );

            case 'q':
            case 'queen':
                return (
                    <Paint>
                        <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                            <path
                                d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                            <path
                                d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeLinecap="butt"
                            />
                            <path
                                d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                            <path
                                d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                        </g>
                    </Paint>
                );

            case 'k':
            case 'king':
                return (
                    <Paint>
                        <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                            <path
                                d="M22.5 11.63V6"
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeLinejoin="miter"
                            />
                            <path
                                d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeLinecap="butt"
                                strokeLinejoin="miter"
                            />
                            <path
                                d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                            <path
                                d="M20 8h5"
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeLinejoin="miter"
                            />
                            <path
                                d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9"
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                            <path
                                d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                        </g>
                    </Paint>
                );

            default:
                return null;
        }
    }, [type, fillColor, strokeColor, strokeWidth]);

    return (
        <svg
            viewBox="0 0 45 45"
            className={`chess-piece-icon ${className || ''}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <AutoFit>{piece}</AutoFit>
        </svg>
    );
};
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';
export type BoardTheme = 'classic' | 'modern' | 'neon' | 'wood';
export type PieceStyle = 'standard' | 'neo' | 'glass';

interface SettingsState {
    // Theme
    theme: Theme;
    boardTheme: BoardTheme;
    pieceStyle: PieceStyle;

    // Sound
    soundEnabled: boolean;
    moveSound: boolean;
    captureSound: boolean;
    checkSound: boolean;

    // Display
    showCoordinates: boolean;
    showLegalMoves: boolean;
    showLastMove: boolean;
    showEvaluation: boolean;
    animationSpeed: 'slow' | 'normal' | 'fast';

    // 3D Settings
    cameraAngle: 'top' | 'player' | 'free';
    shadowsEnabled: boolean;
    reflectionsEnabled: boolean;

    // AI vs AI settings
    aiGameSpeed: number; // seconds between moves

    // Actions
    setTheme: (theme: Theme) => void;
    setBoardTheme: (theme: BoardTheme) => void;
    setPieceStyle: (style: PieceStyle) => void;
    toggleSound: () => void;
    setShowCoordinates: (show: boolean) => void;
    setShowLegalMoves: (show: boolean) => void;
    setShowLastMove: (show: boolean) => void;
    setShowEvaluation: (show: boolean) => void;
    setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
    setCameraAngle: (angle: 'top' | 'player' | 'free') => void;
    setShadowsEnabled: (enabled: boolean) => void;
    setReflectionsEnabled: (enabled: boolean) => void;
    setAiGameSpeed: (speed: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // Initial state
            theme: 'dark',
            boardTheme: 'modern',
            pieceStyle: 'neo',
            soundEnabled: true,
            moveSound: true,
            captureSound: true,
            checkSound: true,
            showCoordinates: true,
            showLegalMoves: true,
            showLastMove: true,
            showEvaluation: true,
            animationSpeed: 'normal',
            cameraAngle: 'player',
            shadowsEnabled: true,
            reflectionsEnabled: true,
            aiGameSpeed: 1.5,

            // Actions
            setTheme: (theme) => set({ theme }),
            setBoardTheme: (boardTheme) => set({ boardTheme }),
            setPieceStyle: (pieceStyle) => set({ pieceStyle }),
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            setShowCoordinates: (showCoordinates) => set({ showCoordinates }),
            setShowLegalMoves: (showLegalMoves) => set({ showLegalMoves }),
            setShowLastMove: (showLastMove) => set({ showLastMove }),
            setShowEvaluation: (showEvaluation) => set({ showEvaluation }),
            setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
            setCameraAngle: (cameraAngle) => set({ cameraAngle }),
            setShadowsEnabled: (shadowsEnabled) => set({ shadowsEnabled }),
            setReflectionsEnabled: (reflectionsEnabled) => set({ reflectionsEnabled }),
            setAiGameSpeed: (aiGameSpeed) => set({ aiGameSpeed }),
        }),
        {
            name: 'chess-master-settings',
        }
    )
);

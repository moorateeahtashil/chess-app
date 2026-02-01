import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { GamePage } from './pages/GamePage';
import { StudyCenter } from './pages/StudyCenter';

function App() {
    return (
        <BrowserRouter>
            {/* Container removed to allow pages to control full layout and show global background */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play/:mode" element={<GamePage />} />
                <Route path="/study" element={<StudyCenter />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

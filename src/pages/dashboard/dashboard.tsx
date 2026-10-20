import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import './dashboard.scss';

type TMobileIconGuide = {
    handleTabChange: (active_number: number) => void;
};

const PHRASES = [
    "One workspace. More possibilities.",
    "Build. Automate. Explore.",
    "Turn your ideas into strategies.",
    "Tools for your next move."
];

const DashboardComponent = observer(({ handleTabChange }: TMobileIconGuide) => {
    const store = useStore();
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Typewriter effect logic
    useEffect(() => {
        const currentPhrase = PHRASES[phraseIndex];
        const typingSpeed = isDeleting ? 30 : 60;

        const timer = setTimeout(() => {
            if (!isDeleting && typedText === currentPhrase) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && typedText === '') {
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
            } else {
                setTypedText(
                    isDeleting
                        ? currentPhrase.substring(0, typedText.length - 1)
                        : currentPhrase.substring(0, typedText.length + 1)
                );
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [typedText, isDeleting, phraseIndex]);

    const handleNavigate = (tabIndex: number) => {
        if (typeof handleTabChange === 'function') {
            handleTabChange(tabIndex);
        }
    };

    return (
        <div className="sp-dashboard-container">
            {/* Hero Typewriter Section */}
            <div className="sp-hero">
                <div className="sp-badge">
                    <span className="sp-badge__dot"></span>
                    <span className="sp-badge__text">SYNTHETICPIPS ENGINE</span>
                    <span className="sp-badge__divider">|</span>
                    <span className="sp-badge__sub">YOUR TRADING WORKSPACE</span>
                </div>

                <h1 className="sp-hero__title">
                    {typedText}
                    <span className="sp-cursor">|</span>
                </h1>

                <p className="sp-hero__subtitle">
                    &ldquo;Good decisions matter more than a single outcome.&rdquo;
                </p>
            </div>

            {/* Launcher Grid Cards */}
            <div className="sp-grid">
                {/* Card 01: Load Bot */}
                <div className="sp-card" onClick={() => handleNavigate(1)}>
                    <div className="sp-card__header">
                        <span className="sp-card__num">01</span>
                        <div className="sp-card__icon">📥</div>
                    </div>
                    <div className="sp-card__body">
                        <h3>Load Bot</h3>
                        <p>Open your trading strategy or import XML files.</p>
                    </div>
                    <div className="sp-card__footer">
                        <span>Choose a bot</span>
                        <span className="sp-arrow">&rarr;</span>
                    </div>
                </div>

                {/* Card 02: Premium Bots */}
                <div className="sp-card sp-card--featured" onClick={() => handleNavigate(2)}>
                    <div className="sp-card__header">
                        <span className="sp-card__num">02</span>
                        <div className="sp-card__icon sp-icon--gold">💎</div>
                    </div>
                    <div className="sp-card__body">
                        <h3>Premium Bots</h3>
                        <p>Exclusive automated signal and AI reversal strategies.</p>
                    </div>
                    <div className="sp-card__footer">
                        <span>Explore premium bots</span>
                        <span className="sp-arrow">&rarr;</span>
                    </div>
                </div>

                {/* Card 03: Speed Bot */}
                <div className="sp-card" onClick={() => handleNavigate(3)}>
                    <div className="sp-card__header">
                        <span className="sp-card__num">03</span>
                        <div className="sp-card__icon">⚡</div>
                    </div>
                    <div className="sp-card__body">
                        <h3>Speed Bot</h3>
                        <p>Ultra-fast automated tick trading engine.</p>
                    </div>
                    <div className="sp-card__footer">
                        <span>Launch Speed Bot</span>
                        <span className="sp-arrow">&rarr;</span>
                    </div>
                </div>

                {/* Card 04: Manual Trading */}
                <div className="sp-card" onClick={() => handleNavigate(4)}>
                    <div className="sp-card__header">
                        <span className="sp-card__num">04</span>
                        <div className="sp-card__icon sp-icon--purple">📊</div>
                    </div>
                    <div className="sp-card__body">
                        <h3>Manual Trading</h3>
                        <p>Full manual execution control with live tick charts.</p>
                    </div>
                    <div className="sp-card__footer">
                        <span>Start manual trading</span>
                        <span className="sp-arrow">&rarr;</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default DashboardComponent;

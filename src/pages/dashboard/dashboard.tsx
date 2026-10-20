// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import './dashboard.scss';

const Dashboard = observer(() => {
    const { dashboard } = useStore();
    const { setActiveTab } = dashboard;

    // Typewriter effect for the hero banner
    const fullText = "Welcome to TraderScheme — High-Performance Synthetic Index Analytics & Automated Execution Hub.";
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setDisplayedText(prev => prev + fullText.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30);
        return () => clearInterval(typingInterval);
    }, []);

    return (
        <div className="traderscheme-dashboard" style={{ padding: '24px', color: '#f1f5f9', minHeight: '90vh' }}>
            {/* Hero Banner with Typewriter */}
            <div className="glass-hero" style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        color: '#fff',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                    }}>
                        SP
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            SyntheticPips | TraderScheme
                        </h1>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Live WebSocket Trading & Analytics Engine</span>
                    </div>
                </div>
                <p style={{ fontSize: '15px', color: '#cbd5e1', minHeight: '44px', fontFamily: 'monospace', margin: 0 }}>
                    {displayedText}
                    <span style={{ animation: 'blink 1s infinite' }}>_</span>
                </p>
            </div>

            {/* Interactive Launcher Cards */}
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#e2e8f0' }}>Workspace Launchers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                
                {/* Card 1: Bot Builder */}
                <div onClick={() => setActiveTab(1)} style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                >
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>🧩</div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#fff' }}>Bot Builder</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Configure and execute custom visual strategies & blockly blocks.</p>
                </div>

                {/* Card 2: Apex Bot */}
                <div onClick={() => setActiveTab(1)} style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                >
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚡</div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#fff' }}>Apex Engine</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>High-frequency tick execution & synthetic digit stream analysis.</p>
                </div>

                {/* Card 3: Quick Strategy */}
                <div onClick={() => setActiveTab(1)} style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                >
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>📈</div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#fff' }}>Quick Strategies</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Deploy pre-built Martingale, D'Alembert, and Oscar's Grind setups.</p>
                </div>

            </div>
        </div>
    );
});

export default Dashboard;

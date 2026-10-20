import React from 'react';
import { observer } from 'mobx-react-lite';
import './app-logo.scss';

export const AppLogo = observer(() => {
    return (
        <div className="app-logo">
            <a href="/" className="app-logo__link" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <img 
                    src="/1792477715797.jpg" 
                    alt="SyntheticPips" 
                    style={{ 
                        height: '34px', 
                        width: 'auto', 
                        objectFit: 'contain',
                        borderRadius: '6px'
                    }} 
                />
            </a>
        </div>
    );
});

export default AppLogo;

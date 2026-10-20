import React from 'react';
import { observer } from 'mobx-react-lite';
import './app-logo.scss';

export const AppLogo = observer(() => {
    return (
        <div className="app-logo">
            <a href="/" className="app-logo__link">
                <img 
                    src="/1792477715797.jpg" 
                    alt="SyntheticPips" 
                    style={{ 
                        height: '36px', 
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

import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/dashboard/dashboard';
import StoreProvider from './store/store';

import './styles/styles.scss';

ReactDOM.render(
    <div className="bitfinex">
        <StoreProvider>
            <Dashboard />
        </StoreProvider>
    </div>,
    document.getElementById('root'),
);

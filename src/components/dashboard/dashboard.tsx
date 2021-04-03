import React, { useEffect, useContext } from 'react';
import BitFinexSocket from '../../api/bitfinex-socket/bitfinex-socket';
import { ConnectionState, StoreContext } from '../../store/store';
import Books from '../books/books';
import Ticker from '../ticker/ticker';
import Trades from '../trades/trades';
import { useObserver } from 'mobx-react';

const Dashboard = () => {
    const store = useContext(StoreContext);

    useEffect(() => {
        BitFinexSocket.connect(store);
        return () => {
            BitFinexSocket.disconnect();
        }
    }, []);

    const toggleClick = () => {
        if (store.connectionState === ConnectionState.CONNECTED) {
            BitFinexSocket.disconnect();
        } else {
            BitFinexSocket.connect(store);
        }
    }

    return useObserver(() => {
        const isConnected = store.connectionState === ConnectionState.CONNECTED;
        return <div className="dashboard">
            <div className="action-btns">
                <div
                    className={isConnected ? "toggle-btn" : "toggle-btn disconnect"}
                    onClick={toggleClick}>
                    {isConnected ? 'Disconnect' : 'Connect'}
                </div>
            </div>
            <div className="spacer-ten"></div>
            <Ticker />
            <div className="spacer-ten"></div>
            <Books />
            <div className="spacer-ten"></div>
            <Trades />
        </div>;
    });
};

export default Dashboard;

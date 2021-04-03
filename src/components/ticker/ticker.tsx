import { useObserver } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { StoreContext } from '../../store/store';

const Ticker = () => {
    const store = useContext(StoreContext);

    return useObserver(() =>
        <div className="ticker">
            <div className="logo">
                <span className="bitfinex-logo"></span>
            </div>
            <div className="btc-usd">
                <div>BTC/USD</div>
                <div>{(store.btcUsdTick.lastPrice || 0).toFixed(2)}</div>
            </div>
            <div className="volume">
                <div>Volume: {(store.btcUsdTick.volume || 0).toFixed()} USD</div>
                <div className={store.btcUsdTick.dailyChange > 0 ? 'increase' : 'decrease'}>
                    {(store.btcUsdTick.dailyChange || 0).toFixed(2)} ({((store.btcUsdTick.dailyChangeRelative || 0) * 100).toFixed(2)}%)
                </div>
            </div>
            <div className="low-high">
                <div>LOW: {store.btcUsdTick.low || 0}</div>
                <div>HIGH: {store.btcUsdTick.high || 0}</div>
            </div>
        </div>
    );
}

export default Ticker;

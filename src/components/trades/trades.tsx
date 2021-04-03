import { useObserver } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { StoreContext } from '../../store/store';
import moment from 'moment';

const Trades = () => {
    const store = useContext(StoreContext);

    return useObserver(() => {

        return <div className="trades">
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {store.trades.map( (trade, index) =>
                        <tr key={index} className={trade.trType === 'te' ? 'buy' : 'sell'}>
                            <td>{moment(trade.mts).format('hh:mm:ss')}</td>
                            <td>{trade.price.toFixed(2)}</td>
                            <td>{trade.amount}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>;
    });
}

export default Trades;

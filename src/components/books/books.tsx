import { useObserver } from 'mobx-react-lite';
import React, { useContext } from 'react';
import Configuration from '../../configuration/configuration';
import { StoreContext } from '../../store/store';

const Books = () => {
    const store = useContext(StoreContext);

    return useObserver(() => {

        const bookBids = [...store.bookBids];
        const bookAsks = [...store.bookAsks];

        const compound = [];

        for (let i = 0; i < Configuration.maximumRowsInBooksTable; i++) {
            let bidBook = bookBids[i] ? { ...bookBids[i] } : null;
            let askBook = bookAsks[i] ? { ...bookAsks[i] } : null;

            if (bidBook || askBook) {
                compound.push(
                    <tr key={bidBook ? bidBook.price : i}>
                        <td>{bidBook && bidBook.count}</td>
                        <td>{bidBook && bidBook.amount.toFixed(2)}</td>
                        <td>{bidBook && (bidBook.amount * bidBook.count).toFixed(2)}</td>
                        <td>{bidBook && bidBook.price}</td>
                        <td>{askBook && askBook.price}</td>
                        <td>{askBook && (askBook.amount * -1 * askBook.count).toFixed(2)}</td>
                        <td>{askBook && (askBook.amount * -1).toFixed(2)}</td>
                        <td>{askBook && askBook.count}</td>
                    </tr>
                );
            } else {
                compound.push(
                    <tr key={i}>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                );
            }            
        }

        return <div className="books">
            <table>
                <thead>
                    <tr>
                        <th>Count</th>
                        <th>Amount</th>
                        <th>Total</th>
                        <th>Price</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Amount</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    { compound }
                </tbody>
            </table>
        </div>;
    });
}

export default Books;

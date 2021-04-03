import React, { createContext } from 'react';
import { useLocalStore } from 'mobx-react';
import TradeTick from '../models/trade-tick.model';
import TradeBook from '../models/trade-book.model';
import Trade from '../models/trade.model';
import Configuration from '../configuration/configuration';

export const StoreContext = createContext({} as BitFinexStore);

export enum ConnectionState {
  CONNECTED,
  DISCONNECTED
}

export interface BitFinexStore {
  connectionState: ConnectionState;
  btcUsdTick: TradeTick;
  bookBids: TradeBook[];
  bookAsks: TradeBook[];
  trades: Trade[];
  setConnectionState: (state: ConnectionState) => void;
  setBtcUsdTick: (tick: TradeTick | null) => void;
  addTradeBook: (book: TradeBook | null) => void;
  addTrade: (trade: Trade | null) => void;
  addTrades: (trades: Trade[]) => void;
};

const StoreProvider = ({ children }) => {
  const store = useLocalStore<BitFinexStore>(() => ({
    connectionState: ConnectionState.DISCONNECTED,
    btcUsdTick: {} as TradeTick,
    bookBids: [],
    bookAsks: [],
    trades: [],
    setConnectionState: state => {
      store.connectionState = state;
    },
    setBtcUsdTick: tick => {
      if (tick !== null) {
        store.btcUsdTick = tick;
      }
    },
    // TODO refactor this using Engine
    addTradeBook: book => {
      if (book !== null) {
        if (book.amount > 0) {

          if (book.count === 0) {
            store.bookBids.forEach(function (item: TradeBook, index: number, arr: TradeBook[]) {
              if (item.price === book.price) {
                arr.splice(index, 1);
              }
            });
          } else {
            let updated = false;
            store.bookBids.forEach(function (item: TradeBook, index: number, arr: TradeBook[]) {
              if (item.price === book.price) {
                item = book;
                updated = true;
              }
            });

            if (!updated) {
              store.bookBids.push(book);

              store.bookBids.sort((a: TradeBook, b: TradeBook) => b.price - a.price);

              if (store.bookBids.length > Configuration.maximumRowsInBooksTable) {
                store.bookBids.length = Configuration.maximumRowsInBooksTable;
              }
            }
            
            
          }
        } else {
          if (book.count === 0) {
            store.bookAsks.forEach(function (item: TradeBook, index: number, arr: TradeBook[]) {
              if (item.price === book.price) {
                arr.splice(index, 1);
              }
            });
          } else {
            let updated = false;
            store.bookAsks.forEach(function (item: TradeBook, index: number, arr: TradeBook[]) {
              if (item.price === book.price) {
                item = book;
                updated = true;
              }
            });

            if (!updated) {
              store.bookAsks.push(book);

              store.bookAsks.sort((a: TradeBook, b: TradeBook) => a.price - b.price);

              if (store.bookAsks.length > Configuration.maximumRowsInBooksTable) {
                store.bookAsks.length = Configuration.maximumRowsInBooksTable;
              }
            }
          }
        }
      }
    },
    addTrade: trade => {

      if (trade !== null) {
        store.trades.unshift(trade);

        if (store.trades.length > Configuration.maximumRowsInTradesTable) {
          store.trades.length = Configuration.maximumRowsInTradesTable;
        }
      }
    },
    addTrades: trades => {

      trades.forEach((trade) => {
        store.addTrade(trade);
      });
    }
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;

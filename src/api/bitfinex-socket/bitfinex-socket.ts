import { multipleTradesMapper } from './../mappers/trade-mapper';
import arrayToTradeBookMapper from '../mappers/trade-book-mapper.ts';
import arrayToTradeMapper from '../mappers/trade-mapper';
import arrayToTradeTickMapper from '../mappers/trade-tick.mapper';
import { BitFinexStore, ConnectionState } from './../../store/store';
import Configuration from '../../configuration/configuration';

interface BitFinexSocketAPI {
    client?: WebSocket;
    store?: BitFinexStore;
    tickerChannelId?: string;
    bookChannelId?: string;
    tradeChannelId?: string;
    connect: (store: any) => void;
    connectToChannels: () => void;
    disconnect: () => void;
};

const BitFinexSocket: BitFinexSocketAPI = {
    client: null,
    store: null,
    tickerChannelId: null,
    bookChannelId: null,
    tradeChannelId: null,
    connect: (store) => {
        if (BitFinexSocket.client === null) {
            BitFinexSocket.store = store;
            BitFinexSocket.client = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

            BitFinexSocket.client.onopen = function (_event) {
                BitFinexSocket.store.setConnectionState(ConnectionState.CONNECTED);
                BitFinexSocket.connectToChannels();
            };

            BitFinexSocket.client.addEventListener('message', function (event) {
                // TODO move this logic to another function
                const messageObj = JSON.parse(event.data);

                if (Array.isArray(messageObj)) {
                    // TODO refactor this
                    if (messageObj[0] === BitFinexSocket.tickerChannelId) {
                        
                        if (messageObj[1] !== Configuration.messageToSkipTick) {
                            BitFinexSocket.store.setBtcUsdTick(arrayToTradeTickMapper(messageObj[1]));
                        }
                    } else if (messageObj[0] === BitFinexSocket.bookChannelId) {
                        BitFinexSocket.store.addTradeBook(arrayToTradeBookMapper(messageObj[1]));
                    } else if (messageObj[0] === BitFinexSocket.tradeChannelId) {
                        if (Array.isArray(messageObj[1])) {
                            BitFinexSocket.store.addTrades(multipleTradesMapper(messageObj[1]));
                        }
                        BitFinexSocket.store.addTrade(arrayToTradeMapper(messageObj[1], messageObj[2]));
                    } else {
                        // TODO: Log this messages correctly
                    }
                } else {
                    if (messageObj && messageObj.event && messageObj.event === 'subscribed') {
                        // TODO refactor this code
                        if (messageObj.channel && messageObj.channel === 'ticker') {
                            BitFinexSocket.tickerChannelId = messageObj.chanId;
                        } else if (messageObj.channel && messageObj.channel === 'book') {
                            BitFinexSocket.bookChannelId = messageObj.chanId;
                        } else if (messageObj.channel && messageObj.channel === 'trades') {
                            BitFinexSocket.tradeChannelId = messageObj.chanId;
                        }
                    } else {
                        // TODO: Log this messages correctly
                    }
                }
            });
        }
    },
    connectToChannels: () => {
        // TODO Refactor this with better Data structure (Dynamic)
        if (BitFinexSocket.client !== null) {
            const pingStr = JSON.stringify({
                "event": "ping",
                "cid": 1234
            });
    
            BitFinexSocket.client.send(pingStr);
    
            const TickerChannelSubscribe = JSON.stringify({
                event: 'subscribe',
                channel: 'ticker',
                symbol: 'tBTCUSD'
            });
    
            BitFinexSocket.client.send(TickerChannelSubscribe);
    
    
            const BookChannelSubscribe = JSON.stringify({
                event: 'subscribe',
                channel: 'book',
                symbol: 'tBTCUSD'
            });
    
            BitFinexSocket.client.send(BookChannelSubscribe);
    
            let TradeChannelSubscribe = JSON.stringify({
                event: 'subscribe',
                channel: 'trades',
                symbol: 'tBTCUSD'
            });
    
            BitFinexSocket.client.send(TradeChannelSubscribe);
        }
    },
    disconnect: () => {
        if(BitFinexSocket.client) {
            BitFinexSocket.client.close();
            BitFinexSocket.client = null;
            BitFinexSocket.store.setConnectionState(ConnectionState.DISCONNECTED);
        }
    }
};

export default BitFinexSocket;
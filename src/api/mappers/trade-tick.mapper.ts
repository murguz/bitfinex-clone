import TradeTick from "../../models/trade-tick.model"

const arrayToTradeTickMapper = (arr: Array<number>): TradeTick | null => {
    if (arr.length !== 10) {
        return null;
    }

    return  {
        bid: arr[0],
        bidSize: arr[1],
        ask: arr[2],
        askSize: arr[3],
        dailyChange: arr[4],
        dailyChangeRelative: arr[5],
        lastPrice: arr[6],
        volume: arr[7],
        high: arr[8],
        low: arr[9]
    }
}

export default arrayToTradeTickMapper;

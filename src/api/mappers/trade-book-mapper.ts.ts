import TradeBook from "../../models/trade-book.model";

const arrayToTradeBookMapper = (arr: Array<number>): TradeBook | null => {
    if (arr.length !== 3) {
        return null;
    }

    return  {
        price: arr[0],
        count: arr[1],
        amount: arr[2]
    }
}

export default arrayToTradeBookMapper;

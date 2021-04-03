import Trade from "../../models/trade.model";

const arrayToTradeMapper = (trType: 'te' | 'tu', arr: Array<number>): Trade | null => {
    if (!arr || arr.length !== 4) {
        return null;
    }

    return  {
        trType: trType,
        id: arr[0],
        mts: arr[1],
        amount: arr[2],
        price: arr[3]
    }
}

export const multipleTradesMapper = (arr: Array<Array<number>>): Trade[] => {

    return arr.map((trArr) => {
        return  {
            trType: 'te',
            id: trArr[0],
            mts: trArr[1],
            amount: trArr[2],
            price: trArr[3]
        }
    });
}

export default arrayToTradeMapper;

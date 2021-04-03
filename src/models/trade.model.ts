export default interface Trade {
    trType: "te" | "tu",
    id: number;
    mts: number;
    amount: number;
    price: number;
}

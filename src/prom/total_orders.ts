import * as client from "prom-client";
import OrderModel from "../db/models/Order";

const total_orders = new client.Gauge({
    name: 'total_orders',
    help: 'All orders placed with BagelBot',
    registers: [],

    async collect() {
        console.log('COLLECTED!');
        this.set((await OrderModel.find({})).length);
    }
});

export default total_orders;
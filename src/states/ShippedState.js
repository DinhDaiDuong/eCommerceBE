const OrderState = require('./OrderState');

class ShippedState extends OrderState {
    complete() {
        console.log("Order completed!");
        this.order.setState(this.order.completedState);
    }

    cancel() {
        console.log("Order cancelled!");
        this.order.setState(this.order.cancelledState);
    }

    getStatusId() {
        return 'S5'; // Shipped
    }
}

module.exports = ShippedState;
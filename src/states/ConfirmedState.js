const OrderState = require('./OrderState');

class ConfirmedState extends OrderState {
    ship() {
        console.log("Order shipped!");
        this.order.setState(this.order.shippedState);
    }

    cancel() {
        console.log("Order cancelled!");
        this.order.setState(this.order.cancelledState);
    }

    getStatusId() {
        return 'S4'; // Confirmed
    }
}

module.exports = ConfirmedState;
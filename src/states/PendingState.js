// src/states/PendingState.js
const OrderState = require('./OrderState');

class PendingState extends OrderState {
    confirm() {
        console.log("Order confirmed!");
        this.order.setState(this.order.confirmedState);
    }

    cancel() {
        console.log("Order cancelled!");
        this.order.setState(this.order.cancelledState);
    }

    getStatusId() {
        return 'S3'; // Pending
    }
}

module.exports = PendingState;


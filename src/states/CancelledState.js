const OrderState = require('./OrderState');

class CancelledState extends OrderState {
    getStatusId() {
        return 'S7'; // Cancelled
    }
}

module.exports = CancelledState;
const OrderState = require('./OrderState');

class CompletedState extends OrderState {
    getStatusId() {
        return 'S6'; // Completed
    }
}

module.exports = CompletedState;
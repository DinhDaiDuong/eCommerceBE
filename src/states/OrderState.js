// src/states/OrderState.js
class OrderState {
    constructor(order) {
        this.order = order;
    }

    confirm() {
        throw new Error("Action not allowed in the current state.");
    }

    ship() {
        throw new Error("Action not allowed in the current state.");
    }

    complete() {
        throw new Error("Action not allowed in the current state.");
    }

    cancel() {
        throw new Error("Action not allowed in the current state.");
    }

    getStatusId() {
        throw new Error("This method should return the status ID.");
    }
}

module.exports = OrderState;

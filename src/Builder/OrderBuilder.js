const IOrderBuilder = require('./IOrderBuilder');
const Order = require('./Order');

class OrderBuilder extends IOrderBuilder {
    constructor() {
        super();
        this.order = new Order();
    }

    setAddressUser(addressUserId) {
        this.order.addressUserId = addressUserId;
        return this;
    }

    setPaymentMethod(isOnline) {
        this.order.isPaymentOnlien = isOnline;
        return this;
    }

    setStatus(statusId) {
        this.order.statusId = statusId;
        return this;
    }

    setShipType(typeShipId) {
        this.order.typeShipId = typeShipId;
        return this;
    }

    setVoucher(voucherId) {
        this.order.voucherId = voucherId;
        return this;
    }

    setNote(note) {
        this.order.note = note;
        return this;
    }

    setShipper(shipperId) {
        this.order.shipperId = shipperId;
        return this;
    }

    setImage(image) {
        this.order.image = image;
        return this;
    }

    addOrderDetail(detail) {
        this.order.orderDetails.push(detail);
        return this;
    }

    build() {
        return this.order;
    }
}

module.exports = OrderBuilder;
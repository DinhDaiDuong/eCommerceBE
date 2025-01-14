class Order {
        constructor() {
            this.addressUserId = null;
            this.isPaymentOnlien = false;
            this.statusId = 'S3';
            this.typeShipId = null;
            this.voucherId = null;
            this.note = '';
            this.shipperId = null;
            this.image = null;
            this.orderDetails = [];
        }
    }
    
    module.exports = Order;
class OrderBuilder extends IOrderBuilder {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.order = {
            addressUserId: null,
            isPaymentOnlien: false,
            statusId: 'S3',
            typeShipId: null,
            voucherId: null,
            note: null,
            arrDataShopCart: []
        };
    }

    setAddress(addressUserId) {
        this.order.addressUserId = addressUserId;
        return this;
    }

    setPaymentOnline(isOnline) {
        this.order.isPaymentOnlien = isOnline;
        return this;
    }

    setTypeShip(typeShipId) {
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

    setCartItems(items) {
        this.order.arrDataShopCart = items;
        return this;
    }

    async build() {
        if (!this.validateOrder()) {
            throw new Error('Missing required parameters!');
        }

        try {
            const product = await this.createOrderProduct();
            await this.createOrderDetails(product.dataValues.id);
            return product;
        } catch (error) {
            throw error;
        }
    }

    validateOrder() {
        return this.order.addressUserId && this.order.typeShipId;
    }

    async createOrderProduct() {
        return await db.OrderProduct.create({
            addressUserId: this.order.addressUserId,
            isPaymentOnlien: this.order.isPaymentOnlien,
            statusId: this.order.statusId,
            typeShipId: this.order.typeShipId,
            voucherId: this.order.voucherId,
            note: this.order.note
        });
    }

    async createOrderDetails(orderId) {
        const orderDetails = this.order.arrDataShopCart.map(item => ({
            ...item,
            orderId: orderId
        }));
        await db.OrderDetail.bulkCreate(orderDetails);
    }
}

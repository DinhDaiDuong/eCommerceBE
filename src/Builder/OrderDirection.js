class OrderDirector {
    constructor() {
        this.builder = null;
    }

    setBuilder(builder) {
        this.builder = builder;
        return this;
    }

    async constructOrder(orderData) {
        try {
            const order = await this.builder
                .setAddress(orderData.addressUserId)
                .setTypeShip(orderData.typeShipId)
                .setVoucher(orderData.voucherId)
                .setNote(orderData.note)
                .setCartItems(orderData.arrDataShopCart)
                .build();

            await this.handlePostOrderProcessing(orderData);

            return {
                errCode: 0,
                errMessage: 'ok',
                order
            };
        } catch (error) {
            return {
                errCode: 1,
                errMessage: error.message
            };
        }
    }

    async handlePostOrderProcessing(orderData) {
        await this.clearShoppingCart(orderData);
        await this.updateVoucherStatus(orderData);
    }

    async clearShoppingCart(orderData) {
        const cart = await db.ShopCart.findOne({
            where: { userId: orderData.userId, statusId: 0 }
        });

        if (cart) {
            await db.ShopCart.destroy({
                where: { userId: orderData.userId }
            });
            await this.updateProductStock(orderData.arrDataShopCart);
        }
    }

    async updateProductStock(cartItems) {
        for (const item of cartItems) {
            const productDetailSize = await db.ProductDetailSize.findOne({
                where: { id: item.productId },
                raw: false
            });
            productDetailSize.stock = productDetailSize.stock - item.quantity;
            await productDetailSize.save();
        }
    }

    async updateVoucherStatus(orderData) {
        if (orderData.voucherId && orderData.userId) {
            const voucherUses = await db.VoucherUsed.findOne({
                where: {
                    voucherId: orderData.voucherId,
                    userId: orderData.userId
                },
                raw: false
            });
            voucherUses.status = 1;
            await voucherUses.save();
        }
    }
}
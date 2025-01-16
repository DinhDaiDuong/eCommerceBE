import db from "../models/index";

class AddShopCartManager {
    constructor() {
        this.observers = []; 
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    // Inform for observers
    notifyObservers(data) {
        for (let observer of this.observers) {
            observer.update(data);
        }
    }

    // Service causes trigger for notification
    async addShopCart(data) {
        if (!data.userId || !data.productdetailsizeId || !data.quantity) {
            return({
                errCode: 1,
                errMessage: 'Missing required parameter !'
            })
            } else {
                let cart = await db.ShopCart.findOne({ where: { userId: data.userId, productdetailsizeId: data.productdetailsizeId, statusId: 0 }, raw: false })
                if (cart) {
                    let res = await db.ProductDetailSize.findOne({ where: { id: data.productdetailsizeId } })
                    if (res) {
                        let receiptDetail = await db.ReceiptDetail.findAll({ where: { productDetailSizeId: res.id } })
                        let orderDetail = await db.OrderDetail.findAll({ where: { productId: res.id } })
                        let quantity = 0
                        for (let j = 0; j < receiptDetail.length; j++) {
                            quantity = quantity + receiptDetail[j].quantity
                        }
                        for (let k = 0; k < orderDetail.length; k++) {
                            let order = await db.OrderProduct.findOne({ where: { id: orderDetail[k].orderId } })
                            if (order.statusId != 'S7') {

                                quantity = quantity - orderDetail[k].quantity
                            }
                        }
                        res.stock = quantity
                    }



                    if (data.type === "UPDATE_QUANTITY") {

                        if (+data.quantity > res.stock) {
                            return({
                                errCode: 2,
                                errMessage: `Chỉ còn ${res.stock} sản phẩm`,
                                quantity: res.stock
                            })
                        } else {
                            cart.quantity = +data.quantity
                            await cart.save()
                        }
                    } else {

                        if ((+cart.quantity + (+data.quantity)) > res.stock) {
                            return({
                                errCode: 2,
                                errMessage: `Chỉ còn ${res.stock} sản phẩm`,
                                quantity: res.stock
                            })
                        } else {
                            cart.quantity = +cart.quantity + (+data.quantity)
                            await cart.save()
                        }
                    }

                }
                else {
                    let res = await db.ProductDetailSize.findOne({ where: { id: data.productdetailsizeId } })
                    if (res) {
                        let receiptDetail = await db.ReceiptDetail.findAll({ where: { productDetailSizeId: res.id } })
                        let orderDetail = await db.OrderDetail.findAll({ where: { productId: res.id } })
                        let quantity = 0
                        for (let j = 0; j < receiptDetail.length; j++) {
                            quantity = quantity + receiptDetail[j].quantity
                        }
                        for (let k = 0; k < orderDetail.length; k++) {
                            let order = await db.OrderProduct.findOne({ where: { id: orderDetail[k].orderId } })
                            if (order.statusId != 'S7') {

                                quantity = quantity - orderDetail[k].quantity
                            }
                        }
                        res.stock = quantity
                    }

                    if (data.quantity > res.stock) {
                        return({
                            errCode: 2,
                            errMessage: `Chỉ còn ${res.stock} sản phẩm`,
                            quantity: res.stock
                        })
                    } else {
                        await db.ShopCart.create({
                            userId: data.userId,
                            productdetailsizeId: data.productdetailsizeId,
                            quantity: data.quantity,
                            statusId: 0
                        })
                    }

                }
            // Trigger notification
            this.notifyObservers({ userId: data.userId, productId: data.productdetailsizeId }); 
        }
    }
}
export default AddShopCartManager;
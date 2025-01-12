// services/ShoppingCartSingleton.js
import db from "../models/index";

class ShoppingCartService {
    constructor() {
        this.cartCache = new Map();
    }

    static getInstance() {
        if (!ShoppingCartService.instance) {
            ShoppingCartService.instance = new ShoppingCartService();
        }
        return ShoppingCartService.instance;
    }

    async calculateStock(productDetailSizeId) {
        const productSize = await db.ProductDetailSize.findOne({ 
            where: { id: productDetailSizeId } 
        });
        if (!productSize) return 0;

        const receiptDetails = await db.ReceiptDetail.findAll({ 
            where: { productDetailSizeId: productSize.id } 
        });
        const orderDetails = await db.OrderDetail.findAll({ 
            where: { productId: productSize.id } 
        });

        let quantity = receiptDetails.reduce((sum, item) => sum + item.quantity, 0);

        for (const orderDetail of orderDetails) {
            const order = await db.OrderProduct.findOne({ 
                where: { id: orderDetail.orderId } 
            });
            if (order.statusId !== 'S7') {
                quantity -= orderDetail.quantity;
            }
        }

        return quantity;
    }

    async addToCart(data) {
        try {
            if (!data.userId || !data.productdetailsizeId || !data.quantity) {
                return {
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                };
            }

            const currentStock = await this.calculateStock(data.productdetailsizeId);

            const existingCart = await db.ShopCart.findOne({ 
                where: { 
                    userId: data.userId, 
                    productdetailsizeId: data.productdetailsizeId, 
                    statusId: 0 
                }, 
                raw: false 
            });

            if (existingCart) {
                const newQuantity = data.type === "UPDATE_QUANTITY" 
                    ? +data.quantity 
                    : +existingCart.quantity + (+data.quantity);

                if (newQuantity > currentStock) {
                    return {
                        errCode: 2,
                        errMessage: `Chỉ còn ${currentStock} sản phẩm`,
                        quantity: currentStock
                    };
                }

                existingCart.quantity = newQuantity;
                await existingCart.save();
            } else {
                if (+data.quantity > currentStock) {
                    return {
                        errCode: 2,
                        errMessage: `Chỉ còn ${currentStock} sản phẩm`,
                        quantity: currentStock
                    };
                }

                await db.ShopCart.create({
                    userId: data.userId,
                    productdetailsizeId: data.productdetailsizeId,
                    quantity: data.quantity,
                    statusId: 0
                });
            }

            this.cartCache.delete(data.userId);

            return {
                errCode: 0,
                errMessage: 'ok'
            };
        } catch (error) {
            throw error;
        }
    }

    async getCartByUserId(userId) {
        try {
            if (!userId) {
                return {
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                };
            }

            // Check cache first
            if (this.cartCache.has(userId)) {
                return {
                    errCode: 0,
                    data: this.cartCache.get(userId)
                };
            }

            const cartItems = await db.ShopCart.findAll({
                where: { userId, statusId: 0 }
            });

            const enrichedItems = await Promise.all(cartItems.map(async (item) => {
                const productSize = await db.ProductDetailSize.findOne({
                    where: { id: item.productdetailsizeId },
                    include: [
                        { 
                            model: db.Allcode, 
                            as: 'sizeData', 
                            attributes: ['value', 'code'] 
                        }
                    ],
                    raw: true,
                    nest: true
                });

                const productDetail = await db.ProductDetail.findOne({ 
                    where: { id: productSize.productdetailId } 
                });

                const images = await db.ProductImage.findAll({ 
                    where: { productdetailId: productDetail.id } 
                });

                const processedImages = images.map(img => ({
                    ...img.dataValues,
                    image: Buffer.from(img.image, 'base64').toString('binary')
                }));

                const product = await db.Product.findOne({ 
                    where: { id: productDetail.productId } 
                });

                return {
                    ...item.dataValues,
                    productdetailsizeData: productSize,
                    productDetail,
                    productDetailImage: processedImages,
                    productData: product
                };
            }));

            this.cartCache.set(userId, enrichedItems);

            return {
                errCode: 0,
                data: enrichedItems
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteCartItem(data) {
        try {
            if (!data.id) {
                return {
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                };
            }

            const cartItem = await db.ShopCart.findOne({ 
                where: { id: data.id, statusId: 0 } 
            });

            if (cartItem) {
                await db.ShopCart.destroy({
                    where: { id: data.id }
                });

                this.cartCache.delete(cartItem.userId);

                return {
                    errCode: 0,
                    errMessage: 'ok'
                };
            }

            return {
                errCode: 2,
                errMessage: 'Cart item not found'
            };
        } catch (error) {
            throw error;
        }
    }
}

export default ShoppingCartService.getInstance();
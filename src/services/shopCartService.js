import db from "../models/index";
import IShopCartObserver from "../ObserverPattern/IShopCartObserver";
import AddShopCartManager from "../ObserverPattern/AddShopCartManager";

let addShopCart = (data) => {
    let cartManager = new AddShopCartManager();
    let observer = new IShopCartObserver();
    cartManager.addObserver(observer);
    return new Promise(async (resolve, reject) => {
        try {
            cartManager.addShopCart(data);
            resolve({
                errCode: 0,
                errMessage: 'ok'
            });
        }
        catch (error) {
            reject(error);
        }
    })
}

let getAllShopCartByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.ShopCart.findAll({
                    where: { userId: id, statusId: 0 }
                })
                for (let i = 0; i < res.length; i++) {
                    res[i].productdetailsizeData = await db.ProductDetailSize.findOne({
                        where: { id: res[i].productdetailsizeId },
                        include: [
                            { model: db.Allcode, as: 'sizeData', attributes: ['value', 'code'] },

                        ],
                        raw: true,
                        nest: true
                    })
                    res[i].productDetail = await db.ProductDetail.findOne({ where: { id: res[i].productdetailsizeData.productdetailId } })
                    res[i].productDetailImage = await db.ProductImage.findAll({ where: { productdetailId: res[i].productDetail.id } })
                    if (res[i].productDetailImage && res[i].productDetailImage.length > 0) {
                        for (let j = 0; j < res[i].productDetailImage.length; j++) {
                            res[i].productDetailImage[j].image = new Buffer(res[i].productDetailImage[j].image, 'base64').toString('binary');
                        }
                    }
                    res[i].productData = await db.Product.findOne({ where: { id: res[i].productDetail.productId } })
                }
                if (res) {
                    resolve({
                        errCode: 0,
                        data: res
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteItemShopCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.ShopCart.findOne({ where: { id: data.id, statusId: 0 } })
                if (res) {
                    await db.ShopCart.destroy({
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    addShopCart: addShopCart,
    getAllShopCartByUserId: getAllShopCartByUserId,
    deleteItemShopCart: deleteItemShopCart
}
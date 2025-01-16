import shopCartService from '../services/shopCartService';
import ShopCartManager from '../ObserverPattern/ShopCartManager';

let addShopCart = async (req, res) => {
    try {
        // let data = await shopCartService.addShopCart(req.body);
        let data = await new ShopCartManager().addShopCart(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllShopCartByUserId = async (req, res) => {
    try {
        // let data = await shopCartService.getAllShopCartByUserId(req.query.id);
        let data = await new ShopCartManager().getAllShopCartByUserId(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let deleteItemShopCart = async (req, res) => {
    try {
        // let data = await shopCartService.deleteItemShopCart(req.body);
        let data = await new ShopCartManager().deleteItemShopCart(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    addShopCart: addShopCart,
    getAllShopCartByUserId: getAllShopCartByUserId,
    deleteItemShopCart: deleteItemShopCart
}
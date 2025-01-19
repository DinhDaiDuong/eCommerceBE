import shopCartService from '../services/shopCartService';
import ShopCartPublisher from '../ObserverPattern/ShopCartPublisher';
import VoucherAdapter from '../AdapterPattern/VoucherAdapter';

let addShopCart = async (req, res) => {
    try {
        // let data = await shopCartService.addShopCart(req.body);
        let shopCartPublisher = new ShopCartPublisher();
        shopCartPublisher.addObserver(new VoucherAdapter());
        let data = await shopCartPublisher.addShopCart(req.body);
        
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
        let data = await new ShopCartPublisher().getAllShopCartByUserId(req.query.id);
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
        let data = await new ShopCartPublisher().deleteItemShopCart(req.body);
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
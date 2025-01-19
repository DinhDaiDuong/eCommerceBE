import IShopCartObserver from '../ObserverPattern/IShopCartObserver';
import voucherService from '../services/voucherService';

class VoucherAdapter extends IShopCartObserver{
    constructor(){
        super();
        this.adaptee = voucherService
    }
    
    update = (userId) =>{
        let voucherId = "6"
        let data = {
            userId : userId,
            voucherId : voucherId
        }
        this.adaptee.saveUserVoucher(data);
    }
}
export default VoucherAdapter;
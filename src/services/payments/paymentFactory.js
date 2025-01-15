import PayPalPayment from './payPalPayment';
import VNPayPayment from './VNPayPayment';

class PaymentFactory {
    static createPayment(type, data) {
        switch (type) {
            case 'VNPay':
                return new VNPayPayment(data);
            case 'PayPal':
                return new PayPalPayment(data);
            default:
                throw new Error("Invalid payment type.");
        }
    }
}
export default PaymentFactory;


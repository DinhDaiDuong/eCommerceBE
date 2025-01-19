import paypal from 'paypal-rest-sdk';
import db from '../../models';
import { EXCHANGE_RATES } from '../../utils/constants'
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AaeuRt8WCq9SBliEVfEyXXQMosfJD-U9emlCflqe8Blz_KWZ3lnXh1piEMcXuo78MvWj0hBKgLN-FamT',
    'client_secret': 'ENWZDMzk17X3mHFJli7sFlS9RT1Vi_aocaLsrftWZ2tjHtBVFMzr4kPf5_9iIcsbFWsHf95vXVi6EADv'
});

class PayPalPayment {
    constructor(data) {
        if (!data || !data.result || !Array.isArray(data.result) || data.result.length === 0) {
            throw new Error('Invalid payment data');
        }
        this.data = data;
    }

    async createPaymentUrl() {
        const { result, total } = this.data;
        let listItem = [];
        let totalPriceProduct = 0;

        for (const item of result) {
            const productDetailSize = await db.ProductDetailSize.findOne({
                where: { id: item.productId },
                include: [{ model: db.Allcode, as: 'sizeData' }],
                raw: true,
                nest: true,
            });

            const productDetail = await db.ProductDetail.findOne({
                where: { id: productDetailSize.productdetailId },
            });

            const product = await db.Product.findOne({
                where: { id: productDetail.productId },
            });

            const realPrice = parseFloat((item.realPrice / EXCHANGE_RATES.USD).toFixed(2));

            listItem.push({
                name: `${product.name} | ${productDetail.nameDetail} | ${productDetailSize.sizeData.value}`,
                sku: `${item.productId}`,
                price: `${realPrice}`,
                currency: 'USD',
                quantity: item.quantity,
            });

            totalPriceProduct += realPrice * item.quantity;
        }

        listItem.push({
            name: 'Phi ship + Voucher',
            sku: '1',
            price: parseFloat(total - totalPriceProduct).toFixed(2) + '',
            currency: 'USD',
            quantity: 1,
        });

        const createPaymentJson = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `http://localhost:5000/payment/success`,
                cancel_url: `http://localhost:5000/payment/cancel`,
            },
            transactions: [
                {
                    item_list: { items: listItem },
                    amount: {
                        currency: 'USD',
                        total: total.toString(),
                    },
                    description: 'This is the payment description.',
                },
            ],
        };

        return new Promise((resolve, reject) => {
            paypal.payment.create(createPaymentJson, (error, payment) => {
                if (error) {
                    console.error('Error creating payment:', error);
                    reject(error);
                } else {
                    const approvalUrl = payment.links.find((link) => link.rel === 'approval_url');
                    if (approvalUrl) {
                        resolve(approvalUrl.href);
                    } else {
                        reject(new Error('Approval URL not found in PayPal response.'));
                    }
                }
            });
        });
    }

    async processPayment() {
        return await this.createPaymentUrl();
    }
}

export default PayPalPayment;


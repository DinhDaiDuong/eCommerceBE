import querystring from 'qs';
import crypto from 'crypto';
import Payment from './Payment';

class VNPayPayment extends Payment {
    createPaymentUrl() {
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: process.env.VNP_TMNCODE,
            vnp_Amount: data.amount * 100, // Đảm bảo nhân với 100
            vnp_OrderInfo: data.description,
            vnp_ReturnUrl: process.env.VNP_RETURNURL,
            vnp_IpAddr: req.connection.remoteAddress.replace('::ffff:', ''), // Chuyển IPv6 thành IPv4 nếu cần
            vnp_CreateDate: moment().format('YYYYMMDDHHmmss'), // Đảm bảo định dạng đúng
        };


        const signData = querystring.stringify(vnpParams);
        const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
        vnpParams.vnp_SecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return `${process.env.VNP_URL}?${querystring.stringify(vnpParams)}`;
    }

    confirmPayment(data) {
        const secureHash = data['vnp_SecureHash'];
        delete data['vnp_SecureHash'];
        delete data['vnp_SecureHashType'];

        const sortedParams = Object.keys(data).sort().reduce((result, key) => {
            result[key] = data[key];
            return result;
        }, {});

        const signData = querystring.stringify(sortedParams);
        const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            return { success: true, message: 'Payment confirmed' };
        } else {
            return { success: false, message: 'Invalid payment signature' };
        }
    }
}

export default VNPayPayment;

class FixedVoucherStrategy extends VoucherStrategy {
        async calculate(amount, voucherData) {
            if (!this.validate(voucherData.minValue, voucherData.maxValue, amount)) {
                return {
                    errCode: 1,
                    errMessage: 'Amount must be between min and max values'
                };
            }
            return {
                errCode: 0,
                discount: voucherData.value,
                finalAmount: amount - voucherData.value
            };
        }
    }
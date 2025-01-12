class PercentageVoucherStrategy extends VoucherStrategy {
        async calculate(amount, voucherData) {
            if (!this.validate(voucherData.minValue, voucherData.maxValue, amount)) {
                return {
                    errCode: 1,
                    errMessage: 'Amount must be between min and max values'
                };
            }
            const discount = (amount * voucherData.value) / 100;
            return {
                errCode: 0,
                discount,
                finalAmount: amount - discount
            };
        }
    }
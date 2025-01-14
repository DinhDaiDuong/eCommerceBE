class VoucherStrategy {
        validate(minValue, maxValue, amount) {
            return amount >= minValue && amount <= maxValue;
        }
        async calculate(amount, voucherData) {
            throw new Error('calculate() method must be implemented');
        }
    }
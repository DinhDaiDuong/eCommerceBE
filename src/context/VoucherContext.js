class VoucherContext {
        constructor() {
            this.strategies = {
                'PERCENTAGE': new PercentageVoucherStrategy(),
                'FIXED': new FixedVoucherStrategy()
            };
        }
    
        async calculateDiscount(voucherId, amount) {
            try {
                const voucher = await db.Voucher.findOne({
                    where: { id: voucherId },
                    include: [{
                        model: db.TypeVoucher,
                        as: 'typeVoucherOfVoucherData',
                        include: [{
                            model: db.Allcode,
                            as: 'typeVoucherData',
                            attributes: ['value', 'code']
                        }]
                    }],
                    raw: true,
                    nest: true
                });
    
                if (!voucher) {
                    return {
                        errCode: 1,
                        errMessage: 'Voucher not found'
                    };
                }
    
                const strategy = this.strategies[voucher.typeVoucherOfVoucherData.typeVoucherData.code];
                if (!strategy) {
                    return {
                        errCode: 1,
                        errMessage: 'Invalid voucher type'
                    };
                }
    
                return strategy.calculate(amount, voucher.typeVoucherOfVoucherData);
            } catch (error) {
                console.error(error);
                return {
                    errCode: -1,
                    errMessage: 'Error from server'
                };
            }
        }
    }
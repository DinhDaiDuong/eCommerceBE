class OrderDirector {
        constructor(builder) {
            this.builder = builder;
        }
    
        constructOnlineOrder(data) {
            return this.builder
                .setAddressUser(data.addressUserId)
                .setPaymentMethod(true)
                .setShipType(data.typeShipId)
                .setVoucher(data.voucherId)
                .setNote(data.note)
                .build();
        }
    
        constructOfflineOrder(data) {
            return this.builder
                .setAddressUser(data.addressUserId)
                .setPaymentMethod(false)
                .setShipType(data.typeShipId)
                .setNote(data.note)
                .build();
        }
    
        constructShipperOrder(data) {
            return this.builder
                .setAddressUser(data.addressUserId)
                .setShipType(data.typeShipId)
                .setShipper(data.shipperId)
                .setStatus('S5')
                .build();
        }
    }
    
    module.exports = OrderDirector;
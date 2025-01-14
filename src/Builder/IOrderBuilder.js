// Interface for OrderBuilder
class IOrderBuilder {
        setAddressUser(addressUserId) {}
        setPaymentMethod(isOnline) {}
        setStatus(statusId) {}
        setShipType(typeShipId) {}
        setVoucher(voucherId) {}
        setNote(note) {}
        setShipper(shipperId) {}
        setImage(image) {}
        addOrderDetail(detail) {}
        build() {}
    }
    
    module.exports = IOrderBuilder;
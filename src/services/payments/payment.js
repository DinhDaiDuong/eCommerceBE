class Payment {
    process(data) {
        this.validateData(data);
        return this.createPaymentUrl(data);
    }

    createPaymentUrl(data) {
        throw new Error("createPaymentUrl() must be implemented.");
    }
}
export default Payment;
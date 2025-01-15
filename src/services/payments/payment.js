class Payment {
    process(data) {
        this.validateData(data);
        return this.createPaymentUrl(data);
    }

    validateData(data) {
        throw new Error("validateData() must be implemented.");
    }

    createPaymentUrl(data) {
        throw new Error("createPaymentUrl() must be implemented.");
    }
}
export default Payment;
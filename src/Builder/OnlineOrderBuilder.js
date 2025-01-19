class OnlineOrderBuilder extends OrderBuilder {
        constructor() {
            super();
            this.order.isPaymentOnlien = true;
        }
    
        async build() {
            const product = await super.build();
            // Additional online-specific processing
            return product;
        }
    }
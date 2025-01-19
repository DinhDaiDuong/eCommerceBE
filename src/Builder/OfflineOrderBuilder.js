class OfflineOrderBuilder extends OrderBuilder {
        constructor() {
            super();
            this.order.isPaymentOnlien = false;
        }
    
        async build() {
            const product = await super.build();
            // Additional offline-specific processing
            return product;
        }
    }
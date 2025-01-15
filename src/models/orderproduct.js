// models/OrderProduct.js
const { Model } = require('sequelize');
const PendingState = require('../states/PendingState');
const ConfirmedState = require('../states/ConfirmedState');
const ShippedState = require('../states/ShippedState');
const CompletedState = require('../states/CompletedState');
const CancelledState = require('../states/CancelledState');

module.exports = (sequelize, DataTypes) => {
    class OrderProduct extends Model {
        static associate(models) {
            OrderProduct.belongsTo(models.TypeShip, { foreignKey: 'typeShipId', targetKey: 'id', as: 'typeShipData' });
            OrderProduct.belongsTo(models.Voucher, { foreignKey: 'voucherId', targetKey: 'id', as: 'voucherData' });
            OrderProduct.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'code', as: 'statusOrderData' });
        }

        // Khởi tạo các trạng thái
        initStates() {
            this.pendingState = new PendingState(this);
            this.confirmedState = new ConfirmedState(this);
            this.shippedState = new ShippedState(this);
            this.completedState = new CompletedState(this);
            this.cancelledState = new CancelledState(this);

            this.setStateById(this.statusId);
        }

        // Đặt trạng thái hiện tại
        setState(state) {
            this.currentState = state;
        }

        setStateById(statusId) {
            switch (statusId) {
                case 'S3':
                    this.setState(this.pendingState);
                    break;
                case 'S4':
                    this.setState(this.confirmedState);
                    break;
                case 'S5':
                    this.setState(this.shippedState);
                    break;
                case 'S6':
                    this.setState(this.completedState);
                    break;
                case 'S7':
                    this.setState(this.cancelledState);
                    break;
                default:
                    throw new Error(`Invalid statusId: ${statusId}`);
            }
        }

        // Thực hiện hành động
        confirm() {
            this.currentState.confirm();
            this.statusId = this.currentState.getStatusId();
        }

        ship() {
            this.currentState.ship();
            this.statusId = this.currentState.getStatusId();
        }

        complete() {
            this.currentState.complete();
            this.statusId = this.currentState.getStatusId();
        }

        cancel() {
            this.currentState.cancel();
            this.statusId = this.currentState.getStatusId();
        }
    }

    OrderProduct.init(
        {
            addressUserId: DataTypes.INTEGER,
            statusId: DataTypes.STRING,
            typeShipId: DataTypes.INTEGER,
            voucherId: DataTypes.INTEGER,
            note: DataTypes.STRING,
            isPaymentOnlien: DataTypes.INTEGER,
            shipperId: DataTypes.INTEGER,
            image: DataTypes.BLOB('long'),
        },
        {
            sequelize,
            modelName: 'OrderProduct',
        }
    );

    return OrderProduct;
};

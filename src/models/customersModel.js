module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('customer', {
        customerNumber: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customerName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        contactLastName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        contactFirstName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        addressLine1: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        addressLine2: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        salesRepEmployeeNumber: {
            type: DataTypes.INTEGER,
        },
        creditLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    return Customer;
}
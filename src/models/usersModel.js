module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING(45),
            primaryKey: true,
            // unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        employeeNumber: {
            type: DataTypes.INTEGER,
            unique: true
        }
    }, {
        timestamps: false,
    });

    return User;
}
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING(45),
            primaryKey: true,
            // unique: true
        },
        password: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        employeeNumber: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false,
    });

    return User;
}
module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('employee', {
        employeeNumber: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lastName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        extension: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        officeCode: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        reportsTo: {
            type: DataTypes.INTEGER,
        },
        jobTitle: {
            type: DataTypes.STRING(45),
            allowNull: false,
        }
    }, {
        timestamps: false,
    });

    return Employee;
}
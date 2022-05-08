import  { Sequelize, DataTypes } from 'sequelize';

import dbConfig from '../config/dbConfig';

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        }
    }
);

sequelize.authenticate()
.then(() => {
    console.log('connected');
})
.catch(err => {
    console.log(`Error: ${err}`);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import models
import customers from './customersModel';
import employees from './employeesModel';
import users from './usersModel';
db.customers = customers(sequelize, DataTypes);
db.employees = employees(sequelize, DataTypes);
db.users = users(sequelize, DataTypes);

db.sequelize.sync({ force: false })
.then(() => {
    console.log('Yes re-sync!');
})
.catch(err => {
    console.log(`Error: ${err}`);
});

// Associations
// user[employeeNumber] 1 --- 1 employees[employeeNumber]
db.employees.hasOne(db.users, {
    foreignKey: 'employeeNumber',
    as: 'account'
});
db.users.belongsTo(db.employees, {
    foreignKey: 'employeeNumber',
    as: 'info'    
});

// employees[employeeNumber] 1 --- n customers[salesRepEmployeeNumber]
db.employees.hasMany(db.customers, {
    foreignKey: 'salesRepEmployeeNumber',
    as: 'customers'
});
db.customers.belongsTo(db.employees, {
    foreignKey: 'salesRepEmployeeNumber',
    as: 'seller'
});

// employees[employeeNumber] 1 --- n employees[reportsTo]
db.employees.hasMany(db.employees, {
    foreignKey: 'reportsTo',
    as: 'staff'
});
db.employees.belongsTo(db.employees, {
    foreignKey: 'reportsTo',
    as: 'boss'
});

module.exports = db;
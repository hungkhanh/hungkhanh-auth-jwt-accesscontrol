import { AccessControl } from "accesscontrol";

const accesscontrol = new AccessControl();

accesscontrol
    .grant('President')
        .createAny('employees').readAny('employees').updateAny('employees').deleteAny('employees')
        .createAny('customers').readAny('customers').updateAny('customers').deleteAny('customers')
    .grant('Manager')
        .createAny('employees').readAny('employees').updateAny('employees')
        .createAny('customers').readAny('customers').updateAny('customers').deleteAny('customers')
    .grant('Leader')
        .readAny('employees')
        .create('customers').read('customers').update('customers').delete('customers')
    .grant('Staff')
        .createOwn('customers').readOwn('customers')

module.exports = accesscontrol;        


const bcrypt = require('bcryptjs');
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await prisma.Company.findAll();
}

async function getById(id) {
    return await getCompany(id);
}

async function create(params) {
    // validate
    if (await prisma.Company.findOne({ where: { companyname: params.companyname } })) {
        throw 'typecode "' + params.typecode + '" is already registered';
    }

    const company = new prisma.Company(params);
    
    
    // save company
    await company.save();
}

async function update(id, params) {
    const company = await getCompany(id);

    // validate
    const typeChanged = params.typecode && company.typecode !== params.typecode;
    if (typeChanged && await prisma.Company.findOne({ where: { typecode: params.typecode } })) {
        throw 'typecode "' + params.typecode + '" is already registered';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to company and save
    Object.assign(company, params);
    await company.save();
}

async function _delete(id) {
    const company = await getCompany(id);
    await company.destroy();
}

// helper functions

async function getCompany(id) {
    const company = await prisma.Company.finprismayPk(id);
    if (!company) throw 'Company not found';
    return company;
}

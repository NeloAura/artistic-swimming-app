const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('../Service/company.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    userService.getAll()
        .then(companies => res.json(companies))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(company => res.json(company))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Company created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Company updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'Company deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        companyname: Joi.string().required(),
        typecode: Joi.string().required(),
        svgSrc: Joi.string()

        
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        companyname: Joi.string(),
        typecode: Joi.string().required(),
        svgSrc: Joi.string()
        
        
    })
    validateRequest(req, next, schema);
}

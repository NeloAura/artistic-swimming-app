const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('../Service/type.service');

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
        .then(types => res.json(types))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(type => res.json(type))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'type created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Type updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'Type deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        typecode: Joi.string().required(),
        description: Joi.string().required(),
        svgSrc: Joi.string(),
        color: Joi.string().required()

    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        typecode:Joi.string(),
        description: Joi.string(),
        svgSrc: Joi.string(),
        color: Joi.string()
    })
    validateRequest(req, next, schema);
}

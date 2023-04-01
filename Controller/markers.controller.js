const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('../Service/marker.service');

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
        .then(markers => res.json(markers))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(marker => res.json(marker))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Marker created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Marker updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'Marker deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        location: Joi.string().required(),
        media: Joi.string().required(),
        description: Joi.string().required(),
        typecode: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        location: Joi.string().empty(''),
        media: Joi.string().empty(''),
        description: Joi.string().empty(''),
        status: Joi.boolean().empty(''),
        
    });
    validateRequest(req, next, schema);
}

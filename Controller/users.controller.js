//imports
import { Router } from 'express';

import { object, string, ref, number } from 'joi';
import validateRequest from '_middleware/validate-request';
import authorize from '_middleware/authorize';
import { Admin, User } from '_helpers/role';
import { authenticate as _authenticate, refreshToken as _refreshToken, revokeToken as _revokeToken, register as _register, verifyEmail as _verifyEmail, forgotPassword as _forgotPassword, validateResetToken as _validateResetToken, resetPassword as _resetPassword, getAll as _getAll, getById as _getById, create as _create, update as _update, _delete } from '../Service/user.service';

//constants
const router = Router();


// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
router.post('/reset-password', resetPasswordSchema, resetPassword);
router.get('/', authorize(Admin), getAll);
router.get('/:id', getById);
router.post('/', authorize(Admin), createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', authorize(), _delete);

export default router;

//functions

function authenticateSchema(req, res, next) {
    const schema = object({
        email: string().required(),
        password: string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    _authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    _refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = object({
        token: string().empty('')
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    _revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = object({
        firstname: string().required(),
        lastname: string().required(),
        email: string().email().required(),
        password: string().min(6).required(),
        confirmPassword: string().valid(ref('password')).required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    _register(req.body, req.get('origin'))
        .then(() => res.json({ message: ' Please check your email for verification instructions' }))
        .catch(next);
}

function verifyEmailSchema(req, res, next) {
    const schema = object({
        token: string().required()
    });
    validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
    _verifyEmail(req.body)
        .then(() => res.json({ message: 'Verification successful, you can now login' }))
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = object({
        email: string().email().required()
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    _forgotPassword(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
        .catch(next);
}

function validateResetTokenSchema(req, res, next) {
    const schema = object({
        token: string().required()
    });
    validateRequest(req, next, schema);
}

function validateResetToken(req, res, next) {
    _validateResetToken(req.body)
        .then(() => res.json({ message: 'Token is valid' }))
        .catch(next);
}

function resetPasswordSchema(req, res, next) {
    const schema = object({
        token: string().required(),
        password: string().min(6).required(),
        confirmPassword: string().valid(ref('password')).required()
    });
    validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
    _resetPassword(req.body)
        .then(() => res.json({ message: 'Password reset successful, you can now login' }))
        .catch(next);
}

function getAll(req, res, next) {
    _getAll()
        .then(user => res.json(user))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own user and admins can get any user
    // if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    _getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = object({
        username: string().required(),
        firstName: string().required(),
        lastName: string().required(),
        email: string().email().required(),
        mobile:number().integer(11).required(),
        password: string().min(6).required(),
        confirmPassword: string().valid(ref('password')).required(),
        role: string().valid(Admin, User).required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    _create(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema= object({ 
        username: string(),
        firstName: string(),
        lastName: string(),
        email: string(),
        mobile:number(),
        password: string(),
        confirmPassword: string()
    });

    // only admins can update role
    // if (req.user.role === Role.Admin) {
    //     schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    // }

    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own user and admins can update any user
    if (Number(req.params.id) !== req.user.id && req.user.role !== Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    _update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own user and admins can delete any user
    if (Number(req.params.id) !== req.user.id && req.user.role !== Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

// helper functions

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}
import { Router } from 'express';
const router = Router();
import { serve, setup } from 'swagger-ui-express';
import { load } from 'yamljs';
const swaggerDocument = load('./swagger.yaml');

router.use('/', serve, setup(swaggerDocument));

export default router;
import { crudRoutes } from './crudRoutes.js';
import { validateId } from '../utils/helpers.js';
import ticketController from '../controllers/ticketController.js';

const router = crudRoutes(ticketController);

router.post('/:id/responses', validateId, ticketController.addResponse);

export default router;

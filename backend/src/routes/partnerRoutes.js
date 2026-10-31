import { crudRoutes } from './crudRoutes.js';
import { validateId } from '../utils/helpers.js';
import partnerController from '../controllers/partnerController.js';

const router = crudRoutes(partnerController);

router.post('/:id/connections', validateId, partnerController.addConnection);
router.delete('/:id/connections/:connectionId', validateId, partnerController.removeConnection);

export default router;

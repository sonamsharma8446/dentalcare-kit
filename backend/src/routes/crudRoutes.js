import { Router } from 'express';
import { protect, requireRole } from '../middleware/auth.js';
import { validateId } from '../utils/helpers.js';

// The same set of routes for every module. Everything needs a login;
// only the "admin" role may delete.
export function crudRoutes(crud) {
  const router = Router();
  router.use(protect);

  router.route('/').get(crud.list).post(crud.create);
  router.patch('/:id/status', validateId, crud.setStatus);
  router
    .route('/:id')
    .all(validateId)
    .get(crud.get)
    .put(crud.update)
    .delete(requireRole('admin'), crud.remove);

  return router;
}

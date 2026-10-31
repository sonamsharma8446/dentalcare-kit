import { User } from '../models/User.js';
import { makeCrud } from './crudFactory.js';

export default makeCrud({
  Model: User,
  entity: 'user',
  nameOf: (user) => user.name,
  searchFields: ['name', 'email', 'phone', 'city'],
  filterFields: ['status'],
  editableFields: ['name', 'email', 'phone', 'city', 'status', 'notes'],
  sortable: ['createdAt', 'name', 'status'],
});

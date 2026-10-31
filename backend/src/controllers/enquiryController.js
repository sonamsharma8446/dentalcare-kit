import { Enquiry } from '../models/Enquiry.js';
import { makeCrud } from './crudFactory.js';

export default makeCrud({
  Model: Enquiry,
  entity: 'enquiry',
  nameOf: (enquiry) => `${enquiry.subject} (${enquiry.name})`,
  searchFields: ['name', 'email', 'subject', 'message'],
  filterFields: ['status', 'type'],
  editableFields: ['name', 'email', 'phone', 'type', 'subject', 'message', 'status'],
  sortable: ['createdAt', 'status'],
});

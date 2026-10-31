import { Vendor } from '../models/Vendor.js';
import { makeCrud } from './crudFactory.js';

export default makeCrud({
  Model: Vendor,
  entity: 'vendor',
  nameOf: (vendor) => vendor.businessName,
  searchFields: ['businessName', 'contactName', 'email', 'city'],
  filterFields: ['status', 'productCategory'],
  editableFields: ['businessName', 'contactName', 'email', 'phone', 'city', 'productCategory', 'status', 'rejectionReason', 'notes'],
  statusFields: ['status', 'rejectionReason'],
  sortable: ['createdAt', 'businessName', 'status'],
  statusActions: { approved: 'approve', rejected: 'reject' },
});

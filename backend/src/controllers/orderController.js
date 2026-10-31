import { Order } from '../models/Order.js';
import { makeCrud } from './crudFactory.js';

export default makeCrud({
  Model: Order,
  entity: 'order',
  nameOf: (order) => `${order.orderNumber} (${order.customerName})`,
  searchFields: ['orderNumber', 'customerName', 'customerEmail', 'customerPhone'],
  filterFields: ['status', 'channel'],
  editableFields: ['customerName', 'customerEmail', 'customerPhone', 'items', 'status', 'channel', 'notes'],
  sortable: ['createdAt', 'total', 'status'],
});

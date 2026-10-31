import { Partner } from '../models/Partner.js';
import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../utils/logActivity.js';
import { pick } from '../utils/helpers.js';
import { makeCrud } from './crudFactory.js';

const crud = makeCrud({
  Model: Partner,
  entity: 'partner',
  nameOf: (partner) => partner.name,
  searchFields: ['name', 'contactName', 'email'],
  filterFields: ['status', 'partnerType'],
  editableFields: ['name', 'contactName', 'email', 'phone', 'partnerType', 'status', 'startDate', 'details'],
  sortable: ['createdAt', 'name', 'status', 'startDate'],
});

// POST /api/partners/:id/connections
async function addConnection(req, res) {
  const partner = await crud.findOrFail(req.params.id);
  partner.connections.push(pick(req.body, ['label', 'note', 'date']));
  await partner.save();
  await logActivity(req.admin, 'update', 'partner', `Added a connection to partner: ${partner.name}`, partner._id);
  res.status(201).json({ data: partner });
}

// DELETE /api/partners/:id/connections/:connectionId
async function removeConnection(req, res) {
  const partner = await crud.findOrFail(req.params.id);
  const connection = partner.connections.id(req.params.connectionId);
  if (!connection) throw new ApiError(404, 'Connection not found');
  // Save the list without that item (a plain "set"; it works the same on every MongoDB-compatible server)
  partner.connections = partner.connections.filter((item) => item.id !== connection.id);
  await partner.save();
  await logActivity(req.admin, 'update', 'partner', `Removed a connection from partner: ${partner.name}`, partner._id);
  res.json({ data: partner });
}

export default { ...crud, addConnection, removeConnection };

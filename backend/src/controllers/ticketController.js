import { Ticket } from '../models/Ticket.js';
import { logActivity } from '../utils/logActivity.js';
import { pick } from '../utils/helpers.js';
import { makeCrud } from './crudFactory.js';

const crud = makeCrud({
  Model: Ticket,
  entity: 'ticket',
  nameOf: (ticket) => `${ticket.subject} (${ticket.customerName})`,
  searchFields: ['customerName', 'customerEmail', 'subject', 'message'],
  filterFields: ['status', 'type', 'priority'],
  editableFields: ['customerName', 'customerEmail', 'type', 'subject', 'message', 'priority', 'status'],
  sortable: ['createdAt', 'priority', 'status'],
});

// POST /api/tickets/:id/responses  { text, isInternal }
async function addResponse(req, res) {
  const ticket = await crud.findOrFail(req.params.id);
  const reply = pick(req.body, ['text']);
  reply.isInternal = req.body.isInternal === true; // only a real "true" makes it a private note
  reply.author = req.admin.name;
  ticket.responses.push(reply);
  await ticket.save();

  const kind = reply.isInternal ? 'internal note' : 'response';
  await logActivity(req.admin, 'note', 'ticket', `Added ${kind} on ticket: ${ticket.subject}`, ticket._id);
  res.status(201).json({ data: ticket });
}

export default { ...crud, addResponse };

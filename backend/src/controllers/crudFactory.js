import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../utils/logActivity.js';
import { pick, str, searchRegex, recordFilter } from '../utils/helpers.js';

// Builds list / get / create / update / status / delete handlers for one model,
// so every module behaves the same way. Options:
//   Model          the Mongoose model
//   entity         short name used in the activity log, e.g. "vendor"
//   nameOf(doc)    text that identifies a record in the log, e.g. its name
//   searchFields   fields searched by ?q=
//   filterFields   fields that can be filtered exactly, e.g. ?status=active
//   editableFields fields the browser is allowed to set on create/update
//   statusFields   fields the status endpoint may change
//   sortable       fields allowed in ?sort=field or ?sort=-field
//   statusActions  optional { statusValue: 'approve' | 'reject' } for the activity log
export function makeCrud(options) {
  const {
    Model,
    entity,
    nameOf,
    searchFields = [],
    filterFields = [],
    editableFields,
    statusFields = ['status'],
    sortable = ['createdAt'],
    statusActions = {},
  } = options;

  async function findOrFail(id) {
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, `${entity} not found`);
    return doc;
  }

  // GET /  -> { data, pagination }
  async function list(req, res) {
    const filter = recordFilter(req.query);

    for (const field of filterFields) {
      const value = str(req.query[field]);
      if (value) filter[field] = value;
    }

    const q = str(req.query.q);
    if (q && searchFields.length > 0) {
      const regex = searchRegex(q);
      filter.$or = searchFields.map((field) => ({ [field]: regex }));
    }

    const page = Math.max(1, parseInt(str(req.query.page), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(str(req.query.limit), 10) || 10));

    let sort = { createdAt: -1 };
    const sortParam = str(req.query.sort);
    const sortField = sortParam.replace(/^-/, '');
    if (sortParam && sortable.includes(sortField)) {
      sort = { [sortField]: sortParam.startsWith('-') ? -1 : 1 };
    }

    const [data, total] = await Promise.all([
      Model.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Model.countDocuments(filter),
    ]);

    res.json({ data, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
  }

  // GET /:id
  async function get(req, res) {
    res.json({ data: await findOrFail(req.params.id) });
  }

  // POST /
  async function create(req, res) {
    const doc = new Model(pick(req.body, editableFields)); // isDemo is never accepted from the browser
    await doc.save();
    await logActivity(req.admin, 'create', entity, `Created ${entity}: ${nameOf(doc)}`, doc._id);
    res.status(201).json({ data: doc });
  }

  // PUT /:id
  async function update(req, res) {
    const doc = await findOrFail(req.params.id);
    doc.set(pick(req.body, editableFields));
    await doc.save();
    await logActivity(req.admin, 'update', entity, `Updated ${entity}: ${nameOf(doc)}`, doc._id);
    res.json({ data: doc });
  }

  // PATCH /:id/status
  async function setStatus(req, res) {
    const doc = await findOrFail(req.params.id);
    const before = doc.status;
    doc.set(pick(req.body, statusFields));
    await doc.save();
    const action = statusActions[doc.status] || 'status';
    await logActivity(
      req.admin,
      action,
      entity,
      `${entity[0].toUpperCase()}${entity.slice(1)} "${nameOf(doc)}": ${before} -> ${doc.status}`,
      doc._id,
    );
    res.json({ data: doc });
  }

  // DELETE /:id  (the route limits this to admins)
  async function remove(req, res) {
    const doc = await findOrFail(req.params.id);
    await doc.deleteOne();
    await logActivity(req.admin, 'delete', entity, `Deleted ${entity}: ${nameOf(doc)}`, doc._id);
    res.json({ message: `${entity} deleted` });
  }

  return { list, get, create, update, setStatus, remove, findOrFail };
}

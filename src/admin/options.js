// Dropdown choices shared by several pages. They must match the values the backend accepts.
export const PRODUCT_CATEGORIES = [
  { value: 'cement', label: 'Temporary filling repair cement' },
  { value: 'clove', label: 'Pure clove oil' },
  { value: 'rinse', label: 'Chlorhexidine mouth rinse' },
  { value: 'wax', label: 'Orthodontic wax' },
  { value: 'guard', label: 'Boil-and-bite mouthguards' },
  { value: 'other', label: 'Other' },
];

export const PARTNER_TYPES = ['clinic', 'pharmacy', 'distributor', 'sports_club', 'school', 'other'];
export const ORDER_CHANNELS = ['phone', 'email', 'whatsapp', 'walk_in', 'other'];
export const ORDER_STATUSES = ['pending', 'ongoing', 'completed', 'cancelled'];
export const ENQUIRY_TYPES = ['product', 'partnership', 'general'];
export const ENQUIRY_STATUSES = ['pending', 'ongoing', 'completed'];
export const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export function categoryLabel(value) {
  return PRODUCT_CATEGORIES.find((item) => item.value === value)?.label || value;
}

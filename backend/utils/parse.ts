export const toBoolean = (val: unknown): boolean => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.toLowerCase() === 'true';
  return false; // varsayılan
};
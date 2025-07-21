export const DateFilters = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type DateFilter = typeof DateFilters[keyof typeof DateFilters];

export const generateRows = (prefix, factory) =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    ...factory(i + 1, prefix)
  }))

export const generateRows = (count = 20, prefix = 'DOC') =>
  Array.from({ length: count }).map((_, idx) => ({
    id: `${prefix}-${(idx + 1).toString().padStart(3, '0')}`,
    company: `企业${idx + 1}`,
    type: ['报关单', '发票', '装箱单', '提单'][idx % 4],
    date: `2026-02-${((idx % 28) + 1).toString().padStart(2, '0')}`,
    status: ['待审', '已通过', '需补充'][idx % 3]
  }))

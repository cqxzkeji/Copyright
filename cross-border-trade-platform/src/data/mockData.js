export const tradeRows = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  market: ['北美', '欧盟', '东盟', '中东', '拉美'][i % 5],
  product: ['电子产品', '智能家居', '新能源配件', '美妆个护', '服饰箱包'][i % 5],
  demand: `${68 + (i % 9) * 3}%`,
  risk: ['低', '中', '高'][i % 3],
  exchange: (6.7 + (i % 5) * 0.06).toFixed(2),
  logisticsCost: 4000 + i * 120,
  compliance: ['通过', '待补件', '复核中'][i % 3]
}));

export const trendSeries = [82, 90, 95, 88, 104, 110, 120, 116, 128, 133, 140, 148];

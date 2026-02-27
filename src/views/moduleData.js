const regions = ['东南亚', '欧盟', '中东', '北美', '南美']
const statuses = ['进行中', '待处理', '已完成', '已预警']

export const createRows = (topicPrefix) =>
  Array.from({ length: 24 }, (_, i) => ({
    id: `${topicPrefix.slice(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
    topic: `${topicPrefix}事项 ${i + 1}`,
    region: regions[i % regions.length],
    status: statuses[i % statuses.length],
    updatedAt: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, '0')} 10:${String(i % 60).padStart(2, '0')}`,
  }))

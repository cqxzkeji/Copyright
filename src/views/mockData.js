export const heritageItems = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  name: `非遗项目-${index + 1}`,
  category: ['手工艺', '戏曲', '民俗', '传统舞蹈', '传统技艺'][index % 5],
  region: ['贵州', '云南', '浙江', '福建', '陕西'][index % 5],
  score: 70 + (index % 25),
  status: ['已采集', '处理中', '已发布'][index % 3]
}))

export const chartData = [
  { name: '视频', value: 42 },
  { name: '音频', value: 35 },
  { name: '图像', value: 51 },
  { name: '文本', value: 47 },
  { name: '三维', value: 29 }
]

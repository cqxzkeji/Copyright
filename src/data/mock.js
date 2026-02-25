export const categories = ['生活', '科技', '娱乐', '美食', '教育']

export const videoList = Array.from({ length: 24 }).map((_, index) => ({
  id: index + 1,
  title: `MgoShort 视频 ${index + 1}`,
  uploader: `创作者${(index % 8) + 1}`,
  category: categories[index % categories.length],
  tags: ['推荐', '短视频', `标签${(index % 6) + 1}`],
  cover: `https://picsum.photos/seed/mgo${index + 1}/320/180`,
  duration: `${String((index % 4) + 1).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
  views: 1500 + index * 237,
  likes: 200 + index * 31,
  comments: 40 + index * 9,
  score: ((index % 5) + 6) / 10,
  status: index % 3 === 0 ? '待审核' : '已发布',
  createdAt: `2026-01-${String((index % 28) + 1).padStart(2, '0')}`
}))

export const commentsList = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  videoTitle: `MgoShort 视频 ${(i % 12) + 1}`,
  user: `用户${i + 1}`,
  content: `这是一条评论内容示例 ${i + 1}，讨论视频亮点与建议。`,
  likes: Math.floor(Math.random() * 120),
  status: i % 5 === 0 ? '待过滤' : '正常',
  date: `2026-02-${String((i % 28) + 1).padStart(2, '0')}`
}))

export const activityStats = Array.from({ length: 24 }).map((_, i) => ({
  date: `2026-02-${String(i + 1).padStart(2, '0')}`,
  activeUsers: 3200 + i * 95,
  playCount: 12500 + i * 430,
  avgStay: `${(2.8 + i * 0.03).toFixed(2)} min`,
  conversionRate: `${(12 + i * 0.2).toFixed(1)}%`
}))

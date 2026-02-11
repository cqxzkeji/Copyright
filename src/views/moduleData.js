const owners = ['算法组', '平台组', '运维组', '数据组']
const statuses = ['进行中', '待处理', '完成']

export const buildRows = (prefix) =>
  Array.from({ length: 22 }, (_, index) => ({
    id: index + 1,
    task: `${prefix}任务-${String(index + 1).padStart(2, '0')}`,
    owner: owners[index % owners.length],
    status: statuses[index % statuses.length],
    progress: Math.min(100, 15 + index * 4)
  }))

export const sampleGallery = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
]

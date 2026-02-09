export const projectRows = Array.from({ length: 22 }, (_, i) => ({
  id: `P-${1000 + i}`,
  name: `创新项目-${i + 1}`,
  owner: ['张华', '李明', '王芳', '赵强'][i % 4],
  target: `${70 + (i % 25)}%`,
  deadline: `2026-${String((i % 12) + 1).padStart(2, '0')}-15`
}))

export const resourceRows = Array.from({ length: 22 }, (_, i) => ({
  id: `R-${2000 + i}`,
  type: ['资金', '人力', '设备'][i % 3],
  detail: `资源批次-${i + 1}`,
  used: 45 + (i % 50),
  remain: 100 - (45 + (i % 50))
}))

export const progressRows = Array.from({ length: 24 }, (_, i) => ({
  id: `T-${3000 + i}`,
  milestone: `里程碑-${i + 1}`,
  progress: 35 + (i * 2) % 60,
  risk: ['低', '中', '高'][i % 3],
  status: ['正常', '预警', '需关注'][i % 3]
}))

export const teamRows = Array.from({ length: 20 }, (_, i) => ({
  id: `M-${4000 + i}`,
  name: `成员${i + 1}`,
  role: ['产品经理', '开发工程师', '运营专员', '财务专员'][i % 4],
  task: `任务包-${i + 1}`,
  completion: `${50 + (i * 3) % 45}%`
}))

export const financialRows = Array.from({ length: 21 }, (_, i) => ({
  id: `F-${5000 + i}`,
  item: `预算科目-${i + 1}`,
  budget: 8 + i,
  expense: 5 + (i % 11),
  variance: (8 + i) - (5 + (i % 11))
}))

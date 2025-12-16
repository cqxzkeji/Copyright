export const trafficSamples = Array.from({ length: 12 }).map((_, idx) => ({
  id: idx + 1,
  source: `10.0.0.${idx + 11}`,
  dest: `172.16.0.${(idx + 3) * 2}`,
  protocol: idx % 2 === 0 ? 'TCP' : 'UDP',
  bytes: Math.round(300 + Math.random() * 900),
  status: idx % 3 === 0 ? '已接入' : '待审核'
}));

export const featureVectors = Array.from({ length: 10 }).map((_, idx) => ({
  id: idx + 1,
  name: `特征向量-${idx + 1}`,
  entropy: (2 + Math.random() * 2).toFixed(2),
  flowCount: 2000 + idx * 150,
  anomalyScore: (30 + Math.random() * 50).toFixed(1)
}));

export const threatEvents = Array.from({ length: 12 }).map((_, idx) => ({
  id: idx + 1,
  scene: ['C2 回连', '数据渗透', '横向移动', '暴力破解'][idx % 4],
  target: `server-${idx + 1}`,
  confidence: 70 + idx * 2,
  risk: ['高', '中', '低'][idx % 3],
  status: ['待处置', '阻断中', '已关闭'][idx % 3]
}));

export const visualizationStats = {
  trafficTrend: [42, 55, 68, 80, 76, 92, 110],
  attackSplit: [
    { label: '僵尸网络', value: 36 },
    { label: '恶意扫描', value: 22 },
    { label: '数据泄露', value: 18 },
    { label: '挖矿行为', value: 12 },
    { label: '其他', value: 12 }
  ]
};

export const systemUsers = [
  { id: 1, name: '管理员', role: 'admin', status: '启用', lastActive: '2024-06-01' },
  { id: 2, name: '分析员A', role: 'analyst', status: '启用', lastActive: '2024-06-03' },
  { id: 3, name: '分析员B', role: 'analyst', status: '禁用', lastActive: '2024-05-26' },
  { id: 4, name: '运营工程师', role: 'ops', status: '启用', lastActive: '2024-06-04' },
  { id: 5, name: '值班人员', role: 'viewer', status: '启用', lastActive: '2024-06-05' }
];

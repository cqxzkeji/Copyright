<template>
  <div class="dashboard">
    <section class="hero">
      <div>
        <h2>项目总览</h2>
        <p>集中展示地下室与裙楼公区的验收进度、整改跟踪与质量趋势。</p>
        <div class="hero-actions">
          <button class="primary" @click="openModal('weekly')">生成周报</button>
          <button class="ghost" @click="openModal('notice')">查看提醒</button>
          <button class="ghost" @click="openModal('refresh')">刷新数据</button>
        </div>
      </div>
      <img :src="heroImage" alt="项目概览图" />
    </section>

    <section class="card-grid">
      <article v-for="card in cards" :key="card.title" class="stat-card">
        <div>
          <p class="stat-title">{{ card.title }}</p>
          <h3>{{ card.value }}</h3>
          <p class="stat-desc">{{ card.desc }}</p>
        </div>
        <button class="ghost" @click="openModal('detail', card)">查看详情</button>
      </article>
    </section>

    <section class="table-section">
      <header>
        <h3>近期验收任务列表</h3>
        <button class="primary" @click="openModal('export')">导出清单</button>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>区域</th>
              <th>专业</th>
              <th>责任人</th>
              <th>状态</th>
              <th>计划日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tasks" :key="row.code">
              <td>{{ row.code }}</td>
              <td>{{ row.area }}</td>
              <td>{{ row.major }}</td>
              <td>{{ row.owner }}</td>
              <td>
                <span :class="['status', row.statusClass]">{{ row.status }}</span>
              </td>
              <td>{{ row.date }}</td>
              <td>
                <button class="link-button" @click="openModal('task', row)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="modal.visible" class="modal-overlay">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="icon-button" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <p v-if="modal.type === 'notice'">今日共有 {{ tasks.length }} 个验收节点待跟进，请优先处理高风险区域。</p>
          <p v-else-if="modal.type === 'refresh'">系统已同步最新数据，已刷新至 {{ new Date().toLocaleTimeString() }}。</p>
          <p v-else-if="modal.type === 'export'">导出包含地下室与裙楼公区的全部验收任务清单。</p>
          <div v-else-if="modal.type === 'weekly'" class="form-grid">
            <label>
              报告周期
              <input type="text" value="本周" />
            </label>
            <label>
              重点区域
              <input type="text" value="地下室B1、裙楼北侧" />
            </label>
            <label>
              备注
              <textarea rows="3">需重点关注防水收口与踢脚线。</textarea>
            </label>
          </div>
          <div v-else-if="modal.type === 'detail'">
            <p>指标：{{ modal.payload.title }}</p>
            <ul>
              <li>目标值：{{ modal.payload.target }}</li>
              <li>当前值：{{ modal.payload.value }}</li>
              <li>趋势：{{ modal.payload.desc }}</li>
            </ul>
          </div>
          <div v-else-if="modal.type === 'task'">
            <p>任务编号：{{ modal.payload.code }}</p>
            <p>位置：{{ modal.payload.area }} · {{ modal.payload.major }}</p>
            <p>当前状态：{{ modal.payload.status }}</p>
            <p>整改重点：{{ modal.payload.focus }}</p>
          </div>
        </div>
        <footer class="modal-footer">
          <button class="ghost" @click="closeModal">关闭</button>
          <button class="primary" @click="closeModal">确认</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const heroImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#93c5fd" />
          <stop offset="1" stop-color="#f8fafc" />
        </linearGradient>
      </defs>
      <rect width="420" height="280" rx="24" fill="url(#g)" />
      <circle cx="110" cy="110" r="60" fill="#2563eb" opacity="0.2" />
      <circle cx="300" cy="160" r="80" fill="#38bdf8" opacity="0.2" />
      <rect x="70" y="190" width="280" height="12" rx="6" fill="#1d4ed8" opacity="0.4" />
      <rect x="70" y="214" width="220" height="12" rx="6" fill="#1d4ed8" opacity="0.25" />
      <text x="60" y="70" font-size="20" fill="#1e3a8a">验收概览</text>
    </svg>`
  )

const cards = [
  {
    title: '总体完成率',
    value: '86%',
    desc: '较上周提升 4%',
    target: '90%'
  },
  {
    title: '待整改项',
    value: '28 项',
    desc: '高风险 6 项',
    target: '0 项'
  },
  {
    title: '本周验收',
    value: '42 次',
    desc: '地下室 18 次',
    target: '40 次'
  },
  {
    title: '常见问题',
    value: '防水收口',
    desc: '出现频次 12 次',
    target: '下降趋势'
  }
]

const tasks = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1
  const zones = ['地下室B1', '地下室B2', '裙楼一层', '裙楼二层']
  const majors = ['土建', '机电', '装饰', '消防']
  const owners = ['张工', '李工', '王工', '陈工']
  const statuses = [
    { text: '待验收', class: 'pending' },
    { text: '进行中', class: 'active' },
    { text: '已完成', class: 'done' }
  ]
  const status = statuses[index % statuses.length]
  return {
    code: `TASK-${String(id).padStart(3, '0')}`,
    area: zones[index % zones.length],
    major: majors[index % majors.length],
    owner: owners[index % owners.length],
    status: status.text,
    statusClass: status.class,
    date: `2024-10-${String((id % 28) + 1).padStart(2, '0')}`,
    focus: '墙面平整度、踢脚线收口'
  }
})

const modal = reactive({
  visible: false,
  title: '',
  type: '',
  payload: null
})

const openModal = (type, payload = null) => {
  modal.visible = true
  modal.type = type
  modal.payload = payload
  const titleMap = {
    weekly: '生成周报',
    notice: '提醒中心',
    refresh: '刷新完成',
    export: '导出清单',
    detail: '指标详情',
    task: '任务详情'
  }
  modal.title = titleMap[type]
}

const closeModal = () => {
  modal.visible = false
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  box-shadow: 0 20px 40px rgba(148, 163, 184, 0.2);
}

.hero img {
  width: min(420px, 100%);
  border-radius: 18px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #edf2ff;
}

.stat-title {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 6px;
}

.stat-desc {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.table-section {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-section header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.table-wrap {
  overflow-x: auto;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #edf2ff;
  text-align: left;
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.status.done {
  background: #dcfce7;
  color: #166534;
}

.primary,
.ghost,
.link-button {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.ghost {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #1f2a44;
}

.link-button {
  background: #eef2ff;
  color: #1d4ed8;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 10;
}

.modal-card {
  width: min(520px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.modal-header,
.modal-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  border-bottom: none;
  justify-content: flex-end;
  gap: 12px;
}

.modal-body {
  padding: 20px;
  font-size: 14px;
  color: #334155;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}
</style>

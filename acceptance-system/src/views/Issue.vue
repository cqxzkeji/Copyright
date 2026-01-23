<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>整改跟踪与统计</h2>
        <p>跟踪问题整改进度，统计完成率与常见质量问题。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">登记整改</button>
        <button class="ghost" @click="openModal('progress')">查看进度</button>
        <button class="ghost" @click="openModal('analysis')">质量分析</button>
      </div>
    </section>

    <section class="summary">
      <article v-for="item in summary" :key="item.title" class="summary-card">
        <div>
          <p>{{ item.title }}</p>
          <h3>{{ item.value }}</h3>
          <p class="note">{{ item.note }}</p>
        </div>
        <button class="ghost" @click="openModal('stat', item)">提示</button>
      </article>
    </section>

    <section class="table-section">
      <header>
        <h3>整改清单（20条）</h3>
        <button class="primary" @click="openModal('export')">导出统计</button>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>整改编号</th>
              <th>问题描述</th>
              <th>责任单位</th>
              <th>计划完成</th>
              <th>进度</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issue in issues" :key="issue.code">
              <td>{{ issue.code }}</td>
              <td>{{ issue.desc }}</td>
              <td>{{ issue.owner }}</td>
              <td>{{ issue.date }}</td>
              <td>
                <div class="progress">
                  <div class="bar" :style="{ width: issue.progress + '%' }"></div>
                </div>
                <span>{{ issue.progress }}%</span>
              </td>
              <td><span :class="['status', issue.statusClass]">{{ issue.status }}</span></td>
              <td>
                <button class="link" @click="openModal('detail', issue)">详情</button>
                <button class="link" @click="openModal('update', issue)">更新</button>
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
          <div v-if="modal.type === 'create'" class="form-grid">
            <label>
              问题描述
              <input type="text" placeholder="防水收口渗漏" />
            </label>
            <label>
              责任单位
              <input type="text" placeholder="施工班组A" />
            </label>
            <label>
              计划完成
              <input type="date" />
            </label>
            <label>
              整改措施
              <textarea rows="3">重新封闭并复检渗漏点。</textarea>
            </label>
          </div>
          <div v-else-if="modal.type === 'progress'">
            <p>整改总体进度</p>
            <div class="modal-progress">
              <div class="bar" style="width: 72%"></div>
            </div>
            <p>已完成 72%，预计 3 天内收尾。</p>
          </div>
          <div v-else-if="modal.type === 'analysis'">
            <p>常见问题 Top3：防水收口、墙面空鼓、设备标识不清。</p>
            <p>建议：加强隐蔽工程复检与成品保护。</p>
          </div>
          <div v-else-if="modal.type === 'stat'">
            <p>{{ modal.payload.title }}：{{ modal.payload.value }}</p>
            <p>{{ modal.payload.note }}</p>
          </div>
          <div v-else-if="modal.type === 'detail'">
            <p>整改编号：{{ modal.payload.code }}</p>
            <p>问题描述：{{ modal.payload.desc }}</p>
            <p>责任单位：{{ modal.payload.owner }}</p>
            <p>整改措施：{{ modal.payload.action }}</p>
          </div>
          <div v-else-if="modal.type === 'update'" class="form-grid">
            <label>
              当前进度
              <input type="text" :value="modal.payload.progress + '%'" />
            </label>
            <label>
              更新说明
              <textarea rows="3">材料已进场，准备二次封闭。</textarea>
            </label>
          </div>
          <p v-else>整改统计报告已生成。</p>
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

const summary = [
  { title: '整改完成率', value: '72%', note: '本周提升 6%' },
  { title: '待整改问题', value: '18 项', note: '高风险 5 项' },
  { title: '平均闭环时长', value: '4.2 天', note: '低于目标 0.6 天' }
]

const issues = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1
  const descs = ['防水收口渗漏', '墙面空鼓', '设备标识缺失', '地砖空鼓']
  const owners = ['施工班组A', '施工班组B', '机电班组', '装饰班组']
  const progress = (index * 7) % 100
  const statuses = [
    { text: '整改中', class: 'active' },
    { text: '待复检', class: 'pending' },
    { text: '已完成', class: 'done' }
  ]
  const status = statuses[index % statuses.length]
  return {
    code: `RECT-${String(id).padStart(3, '0')}`,
    desc: descs[index % descs.length],
    owner: owners[index % owners.length],
    date: `2024-10-${String((id % 28) + 1).padStart(2, '0')}`,
    progress: progress,
    status: status.text,
    statusClass: status.class,
    action: '复检后封闭处理，附带照片。'
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
  const titles = {
    create: '登记整改',
    progress: '整改进度',
    analysis: '质量分析',
    stat: '指标提示',
    detail: '整改详情',
    update: '更新整改',
    export: '导出统计'
  }
  modal.title = titles[type] || '整改操作'
}

const closeModal = () => {
  modal.visible = false
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border: 1px solid #edf2ff;
}

.summary-card p {
  margin: 0 0 6px;
}

.note {
  font-size: 12px;
  color: #94a3b8;
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
  gap: 12px;
}

.table-wrap {
  overflow-x: auto;
}

table {
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

.progress {
  width: 80px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress .bar {
  height: 100%;
  background: #38bdf8;
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.done {
  background: #dcfce7;
  color: #166534;
}

.primary,
.ghost,
.link {
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

.link {
  background: #eef2ff;
  color: #1d4ed8;
  margin-right: 6px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 24px;
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

.modal-progress {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin: 10px 0;
}

.modal-progress .bar {
  height: 100%;
  background: #38bdf8;
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

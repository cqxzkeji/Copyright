<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>验收任务管理</h2>
        <p>统一创建地下室与裙楼公区装修验收任务，明确区域、专业、责任人与状态。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">新建任务</button>
        <button class="ghost" @click="openModal('assign')">批量指派</button>
        <button class="ghost" @click="openModal('filter')">筛选条件</button>
      </div>
    </section>

    <section class="card-grid">
      <article class="info-card" v-for="item in stats" :key="item.title">
        <div>
          <p>{{ item.title }}</p>
          <h3>{{ item.value }}</h3>
        </div>
        <button class="ghost" @click="openModal('stat', item)">指标提示</button>
      </article>
    </section>

    <section class="table-section">
      <header>
        <h3>任务清单（20条）</h3>
        <button class="primary" @click="openModal('export')">导出任务</button>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>区域</th>
              <th>专业</th>
              <th>责任人</th>
              <th>计划验收</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.code">
              <td>{{ task.code }}</td>
              <td>{{ task.area }}</td>
              <td>{{ task.major }}</td>
              <td>{{ task.owner }}</td>
              <td>{{ task.date }}</td>
              <td><span :class="['status', task.statusClass]">{{ task.status }}</span></td>
              <td>
                <button class="link" @click="openModal('detail', task)">详情</button>
                <button class="link" @click="openModal('update', task)">更新状态</button>
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
              区域
              <input type="text" placeholder="地下室B2" />
            </label>
            <label>
              专业
              <input type="text" placeholder="装饰" />
            </label>
            <label>
              责任人
              <input type="text" placeholder="张工" />
            </label>
            <label>
              计划日期
              <input type="date" />
            </label>
          </div>
          <div v-else-if="modal.type === 'assign'" class="form-grid">
            <label>
              批量选择任务
              <input type="text" value="TASK-001 至 TASK-010" />
            </label>
            <label>
              指派负责人
              <input type="text" value="李工" />
            </label>
          </div>
          <div v-else-if="modal.type === 'filter'">
            <p>请选择需要展示的区域与专业，系统将实时更新表格。</p>
            <div class="badge-group">
              <span v-for="tag in filters" :key="tag" class="badge">{{ tag }}</span>
            </div>
          </div>
          <div v-else-if="modal.type === 'stat'">
            <p>指标：{{ modal.payload.title }}</p>
            <p>解释：{{ modal.payload.desc }}</p>
          </div>
          <div v-else-if="modal.type === 'detail'">
            <p>任务编号：{{ modal.payload.code }}</p>
            <p>验收范围：{{ modal.payload.area }} · {{ modal.payload.major }}</p>
            <p>当前状态：{{ modal.payload.status }}</p>
            <p>备注：{{ modal.payload.note }}</p>
          </div>
          <div v-else-if="modal.type === 'update'" class="form-grid">
            <label>
              更新状态
              <input type="text" :value="modal.payload.status" />
            </label>
            <label>
              更新说明
              <textarea rows="3">已安排现场验收班组，预计两日内完成。</textarea>
            </label>
          </div>
          <div v-else>
            <p>已准备导出任务清单，包含地下室与裙楼全部任务。</p>
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

const stats = [
  { title: '待验收任务', value: '12 项', desc: '包含防水、装饰与机电' },
  { title: '进行中任务', value: '18 项', desc: '现场排期中' },
  { title: '已完成任务', value: '48 项', desc: '本月累计完成' }
]

const filters = ['地下室B1', '地下室B2', '裙楼一层', '装饰', '机电']

const tasks = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1
  const zones = ['地下室B1', '地下室B2', '裙楼一层', '裙楼二层']
  const majors = ['装饰', '机电', '土建', '消防']
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
    date: `2024-10-${String((id % 28) + 1).padStart(2, '0')}`,
    status: status.text,
    statusClass: status.class,
    note: '墙面空鼓、管线遮挡需复核。'
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
    create: '新建验收任务',
    assign: '批量指派任务',
    filter: '筛选条件',
    stat: '指标提示',
    detail: '任务详情',
    update: '更新任务状态',
    export: '导出任务'
  }
  modal.title = titleMap[type] || '任务操作'
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

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.info-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #edf2ff;
  gap: 12px;
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

.badge-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
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

<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>现场验收记录</h2>
        <p>现场填写验收结果，支持拍照取证，不合格项自动生成整改记录。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('record')">新增验收记录</button>
        <button class="ghost" @click="openModal('photo')">拍照取证</button>
        <button class="ghost" @click="openModal('batch')">批量录入</button>
      </div>
    </section>

    <section class="evidence">
      <div>
        <h3>现场影像墙</h3>
        <p>集中展示关键部位拍照取证，支持关联任务与整改。</p>
        <button class="ghost" @click="openModal('gallery')">查看相册</button>
      </div>
      <div class="photo-grid">
        <div v-for="n in 4" :key="n" class="photo-card">
          <img :src="photoImage" alt="现场照片" />
          <div>
            <p>地下室B{{ n }}</p>
            <button class="link" @click="openModal('photoDetail', n)">查看说明</button>
          </div>
        </div>
      </div>
    </section>

    <section class="table-section">
      <header>
        <h3>验收记录（20条）</h3>
        <button class="primary" @click="openModal('export')">导出记录</button>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>记录编号</th>
              <th>区域</th>
              <th>检查项</th>
              <th>结果</th>
              <th>验收人</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.code">
              <td>{{ record.code }}</td>
              <td>{{ record.area }}</td>
              <td>{{ record.item }}</td>
              <td><span :class="['status', record.statusClass]">{{ record.result }}</span></td>
              <td>{{ record.inspector }}</td>
              <td>{{ record.date }}</td>
              <td>
                <button class="link" @click="openModal('detail', record)">详情</button>
                <button class="link" @click="openModal('issue', record)">生成整改</button>
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
          <div v-if="modal.type === 'record'" class="form-grid">
            <label>
              任务编号
              <input type="text" placeholder="TASK-018" />
            </label>
            <label>
              检查项
              <input type="text" placeholder="踢脚线收口" />
            </label>
            <label>
              结果
              <input type="text" placeholder="合格" />
            </label>
            <label>
              现场说明
              <textarea rows="3">墙面平整度符合标准，收口整齐。</textarea>
            </label>
          </div>
          <div v-else-if="modal.type === 'photo'" class="form-grid">
            <label>
              拍照区域
              <input type="text" value="地下室B1" />
            </label>
            <label>
              关联任务
              <input type="text" value="TASK-007" />
            </label>
            <label>
              备注
              <textarea rows="3">需重点关注防水层收口。</textarea>
            </label>
          </div>
          <div v-else-if="modal.type === 'batch'">
            <p>已选择模板录入模式，可快速填充相同检查项。</p>
          </div>
          <div v-else-if="modal.type === 'gallery'">
            <p>当前相册包含 16 张现场照片，支持导出与分享。</p>
          </div>
          <div v-else-if="modal.type === 'photoDetail'">
            <p>照片编号：IMG-{{ modal.payload }}</p>
            <p>说明：墙面空鼓修补完成，拍摄于上午 10:30。</p>
          </div>
          <div v-else-if="modal.type === 'detail'">
            <p>记录编号：{{ modal.payload.code }}</p>
            <p>检查项：{{ modal.payload.item }}</p>
            <p>结论：{{ modal.payload.result }}</p>
            <p>现场记录：{{ modal.payload.note }}</p>
          </div>
          <div v-else-if="modal.type === 'issue'">
            <p>已生成整改记录，编号：RECT-{{ modal.payload.code }}</p>
            <p>整改建议：{{ modal.payload.suggestion }}</p>
          </div>
          <p v-else>验收记录已准备导出，包含照片索引。</p>
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

const photoImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140">
      <rect width="200" height="140" rx="12" fill="#e2e8f0" />
      <rect x="20" y="20" width="160" height="80" rx="10" fill="#bfdbfe" />
      <circle cx="70" cy="55" r="18" fill="#60a5fa" />
      <rect x="20" y="110" width="120" height="10" rx="5" fill="#94a3b8" />
    </svg>`
  )

const records = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1
  const areas = ['地下室B1', '地下室B2', '裙楼一层', '裙楼二层']
  const items = ['踢脚线收口', '地砖平整度', '防水闭水', '照明安装']
  const inspectors = ['张工', '李工', '王工', '陈工']
  const results = [
    { text: '合格', class: 'done' },
    { text: '待整改', class: 'pending' }
  ]
  const result = results[index % results.length]
  return {
    code: `REC-${String(id).padStart(3, '0')}`,
    area: areas[index % areas.length],
    item: items[index % items.length],
    result: result.text,
    statusClass: result.class,
    inspector: inspectors[index % inspectors.length],
    date: `2024-10-${String((id % 28) + 1).padStart(2, '0')}`,
    note: '现场记录已同步影像资料。',
    suggestion: '建议二次复检前完成封闭处理。'
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
    record: '新增验收记录',
    photo: '拍照取证',
    batch: '批量录入',
    gallery: '现场相册',
    photoDetail: '照片说明',
    detail: '验收详情',
    issue: '生成整改',
    export: '导出记录'
  }
  modal.title = titles[type] || '验收操作'
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

.evidence {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  align-items: center;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.photo-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.photo-card img {
  width: 100%;
  border-radius: 12px;
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

.status.done {
  background: #dcfce7;
  color: #166534;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
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

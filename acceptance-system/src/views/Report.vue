<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>验收报告归档</h2>
        <p>自动生成验收报告，统一存档验收资料，便于查询和交付。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('generate')">生成报告</button>
        <button class="ghost" @click="openModal('archive')">批量归档</button>
        <button class="ghost" @click="openModal('share')">共享设置</button>
      </div>
    </section>

    <section class="report-hero">
      <div>
        <h3>电子归档仓</h3>
        <p>自动归集地下室与裙楼公区验收资料，支持关键字检索。</p>
        <button class="ghost" @click="openModal('search')">查询条件</button>
      </div>
      <div class="report-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </section>

    <section class="table-section">
      <header>
        <h3>归档报告（20条）</h3>
        <button class="primary" @click="openModal('export')">导出归档</button>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>报告编号</th>
              <th>区域</th>
              <th>生成时间</th>
              <th>负责人</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.code">
              <td>{{ report.code }}</td>
              <td>{{ report.area }}</td>
              <td>{{ report.date }}</td>
              <td>{{ report.owner }}</td>
              <td><span :class="['status', report.statusClass]">{{ report.status }}</span></td>
              <td>
                <button class="link" @click="openModal('preview', report)">预览</button>
                <button class="link" @click="openModal('download', report)">下载</button>
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
          <div v-if="modal.type === 'generate'" class="form-grid">
            <label>
              报告范围
              <input type="text" placeholder="地下室B1-B2" />
            </label>
            <label>
              负责人
              <input type="text" placeholder="项目经理" />
            </label>
            <label>
              备注
              <textarea rows="3">需附带现场照片与整改闭环记录。</textarea>
            </label>
          </div>
          <div v-else-if="modal.type === 'archive'">
            <p>已选择 8 份报告归档至项目总库。</p>
          </div>
          <div v-else-if="modal.type === 'share'">
            <p>当前共享对象：业主代表、监理单位、施工单位。</p>
          </div>
          <div v-else-if="modal.type === 'search'">
            <p>支持按区域、时间、问题类型筛选报告。</p>
          </div>
          <div v-else-if="modal.type === 'preview'">
            <p>报告编号：{{ modal.payload.code }}</p>
            <p>涵盖区域：{{ modal.payload.area }}</p>
            <p>主要结论：{{ modal.payload.summary }}</p>
          </div>
          <div v-else-if="modal.type === 'download'">
            <p>报告 {{ modal.payload.code }} 已加入下载队列。</p>
          </div>
          <p v-else>归档报告已准备导出。</p>
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

const tags = ['地下室验收', '裙楼公区', '整改闭环', '照片索引', '竣工交付']

const reports = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1
  const areas = ['地下室B1', '地下室B2', '裙楼一层', '裙楼二层']
  const owners = ['张工', '李工', '王工', '陈工']
  const statuses = [
    { text: '已归档', class: 'done' },
    { text: '待归档', class: 'pending' }
  ]
  const status = statuses[index % statuses.length]
  return {
    code: `REP-${String(id).padStart(3, '0')}`,
    area: areas[index % areas.length],
    date: `2024-10-${String((id % 28) + 1).padStart(2, '0')}`,
    owner: owners[index % owners.length],
    status: status.text,
    statusClass: status.class,
    summary: '整体验收合格，需跟踪细节整改。'
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
    generate: '生成报告',
    archive: '批量归档',
    share: '共享设置',
    search: '查询条件',
    preview: '报告预览',
    download: '下载报告',
    export: '导出归档'
  }
  modal.title = titles[type] || '报告操作'
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

.report-hero {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.report-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
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

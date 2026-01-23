<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>验收标准管理</h2>
        <p>维护各部位装修验收标准与检查项，形成固定验收清单。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">新增标准</button>
        <button class="ghost" @click="openModal('sync')">同步模板</button>
        <button class="ghost" @click="openModal('guide')">使用指南</button>
      </div>
    </section>

    <section class="preview">
      <img :src="standardImage" alt="标准清单示意图" />
      <div>
        <h3>固定验收清单</h3>
        <p>针对地下室、裙楼公共区域的关键部位预设检查项，避免漏检。</p>
        <button class="ghost" @click="openModal('preview')">查看模板</button>
      </div>
    </section>

    <section class="table-section">
      <header>
        <h3>标准库（20条）</h3>
        <button class="primary" @click="openModal('export')">导出标准</button>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>部位</th>
              <th>检查项</th>
              <th>允许偏差</th>
              <th>频次</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in standards" :key="item.code">
              <td>{{ item.code }}</td>
              <td>{{ item.area }}</td>
              <td>{{ item.item }}</td>
              <td>{{ item.tolerance }}</td>
              <td>{{ item.frequency }}</td>
              <td>
                <button class="link" @click="openModal('detail', item)">详情</button>
                <button class="link" @click="openModal('edit', item)">编辑</button>
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
              部位
              <input type="text" placeholder="地下室墙面" />
            </label>
            <label>
              检查项
              <input type="text" placeholder="墙面平整度" />
            </label>
            <label>
              允许偏差
              <input type="text" placeholder="≤3mm" />
            </label>
          </div>
          <div v-else-if="modal.type === 'edit'" class="form-grid">
            <label>
              标准名称
              <input type="text" :value="modal.payload.item" />
            </label>
            <label>
              频次
              <input type="text" :value="modal.payload.frequency" />
            </label>
            <label>
              说明
              <textarea rows="3">需在验收前完成照度与洁净度检查。</textarea>
            </label>
          </div>
          <div v-else-if="modal.type === 'detail'">
            <p>部位：{{ modal.payload.area }}</p>
            <p>检查项：{{ modal.payload.item }}</p>
            <p>允许偏差：{{ modal.payload.tolerance }}</p>
            <p>参考规范：住宅装饰工程质量验收规范。</p>
          </div>
          <p v-else-if="modal.type === 'sync'">已从总部标准库同步 12 条模板。</p>
          <p v-else-if="modal.type === 'guide'">建议按部位建立标准包，现场验收时可快速调用。</p>
          <p v-else-if="modal.type === 'preview'">模板包含防水、天花、地砖与机电收口等关键条目。</p>
          <p v-else>标准库已准备导出，包含地下室与裙楼公区全部条目。</p>
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

const standardImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
      <rect width="360" height="220" rx="18" fill="#f8fafc" />
      <rect x="24" y="30" width="312" height="14" rx="7" fill="#2563eb" opacity="0.2" />
      <rect x="24" y="60" width="240" height="12" rx="6" fill="#94a3b8" opacity="0.3" />
      <rect x="24" y="86" width="270" height="12" rx="6" fill="#94a3b8" opacity="0.3" />
      <rect x="24" y="112" width="200" height="12" rx="6" fill="#94a3b8" opacity="0.3" />
      <circle cx="290" cy="160" r="34" fill="#bfdbfe" />
      <rect x="24" y="150" width="170" height="12" rx="6" fill="#94a3b8" opacity="0.3" />
      <text x="24" y="190" font-size="14" fill="#1e3a8a">验收标准模板</text>
    </svg>`
  )

const standards = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1
  const areas = ['地下室墙面', '地下室地坪', '裙楼天花', '裙楼地砖', '公共走廊']
  const items = ['平整度', '接缝密实', '空鼓率', '色差', '防水收口']
  const tolerances = ['≤3mm', '≤2mm', '≤5%', '色差均匀', '无渗漏']
  return {
    code: `STD-${String(id).padStart(3, '0')}`,
    area: areas[index % areas.length],
    item: items[index % items.length],
    tolerance: tolerances[index % tolerances.length],
    frequency: `${(index % 3) + 1}次/周`
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
    create: '新增验收标准',
    sync: '同步模板',
    guide: '使用指南',
    preview: '模板预览',
    export: '导出标准库',
    detail: '标准详情',
    edit: '编辑标准'
  }
  modal.title = titles[type] || '标准库操作'
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

.preview {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  align-items: center;
}

.preview img {
  width: 100%;
  border-radius: 16px;
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

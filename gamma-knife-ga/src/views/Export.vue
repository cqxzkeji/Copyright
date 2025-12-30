<template>
  <div class="grid">
    <div class="flex-between">
      <h2>计划导出与存档</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; min-width: 420px;">
        <button @click="openModal('export')">导出计划</button>
        <button @click="openModal('report')">生成报告</button>
        <button @click="openModal('archive')">历史归档</button>
      </div>
    </div>

    <div class="card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
      <div>
        <p style="margin:0; color:#5f6a7a;">可导出 DICOM、PDF、Excel 方案摘要，并自动推送到院内存档。</p>
        <ul>
          <li>包含等剂量面截图与靶区覆盖指标</li>
          <li>自动生成医生签名位与审批状态</li>
          <li>历史版本可回溯并快速恢复</li>
        </ul>
      </div>
      <div style="background:#e3f2fd; border-radius:12px; padding:16px;">
        <p style="margin:0 0 8px; font-weight:700; color:#0d47a1;">最近导出</p>
        <div class="grid" style="gap:8px;">
          <div class="flex-between" v-for="item in recent" :key="item.name">
            <span>{{ item.name }}</span>
            <span>{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <h3>归档记录</h3>
      <table>
        <thead>
          <tr>
            <th>文件名</th>
            <th>格式</th>
            <th>创建时间</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in archive" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="modal" :title="titleMap[modal]" @close="modal=null">
      <template #body>
        <div class="grid">
          <label>
            <span>导出格式</span>
            <select v-model="form.type">
              <option>DICOM-RT</option>
              <option>PDF 报告</option>
              <option>Excel 摘要</option>
            </select>
          </label>
          <label>
            <span>签名医生</span>
            <input v-model="form.doctor" placeholder="输入签名" />
          </label>
          <label>
            <span>推送目标</span>
            <input v-model="form.target" placeholder="PACS / HIS" />
          </label>
          <div>
            <p style="margin:0 0 6px">导出进度</p>
            <div style="background:#e6f2ff; border-radius:10px; height:14px; overflow:hidden;">
              <div :style="{width: progress+'%', background:'linear-gradient(120deg,#29b6f6,#0288d1)', height:'100%'}"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button @click="progress=Math.min(100, progress+20)">推进</button>
        <button @click="exportPlan">执行</button>
        <button @click="modal=null" style="background:#90a4ae">关闭</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const Modal = {
  props: ['title'],
  emits: ['close'],
  template: `
    <div class="modal-mask">
      <div class="modal-container" role="dialog" aria-modal="true">
        <div class="modal-header">{{ title }}</div>
        <div class="modal-body"><slot name="body" /></div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>`
}

const recent = ref([
  { name: 'GA-01 报告', time: '2024-04-05 15:12' },
  { name: 'GA-02 PDF', time: '2024-04-05 15:26' },
  { name: 'GA-03 DICOM', time: '2024-04-05 16:01' }
])
const archive = ref([
  { name: 'GA-01.dcm', type: 'DICOM', time: '2024-04-03', status: '已存档', note: '含 DVH' },
  { name: 'GA-01.pdf', type: 'PDF', time: '2024-04-03', status: '已存档', note: '签名完毕' },
  { name: 'GA-02.dcm', type: 'DICOM', time: '2024-04-04', status: '推送中', note: '等待 PACS' },
  { name: 'GA-02.xlsx', type: 'Excel', time: '2024-04-04', status: '已存档', note: '剂量摘要' },
  { name: 'GA-03.pdf', type: 'PDF', time: '2024-04-05', status: '生成中', note: '待审批' }
])
const modal = ref(null)
const progress = ref(25)
const form = reactive({ type: 'DICOM-RT', doctor: '李主任', target: 'PACS' })
const titleMap = { export: '导出计划', report: '生成报告', archive: '归档操作' }

function openModal(type) {
  modal.value = type
  progress.value = 25
  form.type = 'DICOM-RT'
  form.doctor = '李主任'
  form.target = 'PACS'
}

function exportPlan() {
  const name = `${form.target || 'PACS'}-${form.type}`
  recent.value.unshift({ name: `${form.type} 导出`, time: new Date().toISOString().slice(0, 16).replace('T', ' ') })
  archive.value.unshift({
    name: `${name}.${form.type.includes('PDF') ? 'pdf' : form.type.includes('Excel') ? 'xlsx' : 'dcm'}`,
    type: form.type.replace(' 摘要', ''),
    time: new Date().toISOString().slice(0, 10),
    status: '已存档',
    note: `${form.doctor} 已签名，推送到 ${form.target}`
  })
  progress.value = 100
  modal.value = null
}
</script>

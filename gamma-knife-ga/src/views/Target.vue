<template>
  <div class="grid">
    <div class="flex-between">
      <h2>靶点勾画与显示</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; min-width: 420px;">
        <button @click="openModal('draw')">勾画靶区</button>
        <button @click="openModal('contour')">轮廓管理</button>
        <button @click="openModal('overlay')">影像叠加</button>
      </div>
    </div>

    <div class="card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px; align-items:center;">
      <div style="background:#0d47a1;border-radius:16px; padding:16px; color:#fff; position:relative; min-height:240px;">
        <div style="position:absolute; inset:16px; border:1px dashed rgba(255,255,255,0.4); border-radius:12px;"></div>
        <div style="height:100%; display:grid; place-items:center;">
          <svg viewBox="0 0 200 200" width="100%" height="200">
            <defs>
              <radialGradient id="heat" fx="30%" fy="30%">
                <stop offset="0%" stop-color="#ffeb3b" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#ff7043" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#0d47a1" stop-opacity="0" />
              </radialGradient>
            </defs>
            <rect width="200" height="200" fill="#0d47a1" />
            <circle cx="90" cy="90" r="80" fill="url(#heat)" />
            <circle cx="140" cy="120" r="60" fill="rgba(120,170,255,0.25)" />
          </svg>
        </div>
      </div>
      <div class="grid" style="gap:8px;">
        <div class="flex-between">
          <strong>靶区体积</strong>
          <span>{{ metrics.volume }} cc</span>
        </div>
        <div class="flex-between">
          <strong>平均剂量</strong>
          <span>{{ metrics.dose }} Gy</span>
        </div>
        <div class="flex-between">
          <strong>边界光滑度</strong>
          <span>{{ metrics.smoothness }} %</span>
        </div>
        <div class="flex-between">
          <strong>叠加序列</strong>
          <span>{{ overlayLabel }}</span>
        </div>
        <div style="background:#e3f2fd; border-radius:10px; padding:12px;">
          <p style="margin:0 0 6px; font-weight:700; color:#0d47a1;">当前轮廓</p>
          <p style="margin:0; color:#5f6a7a;">已完成 3 层轮廓；可切换 MRI/CT 对齐状态并导出 DICOM-RT。</p>
        </div>
      </div>
    </div>

    <div class="table-card">
      <h3>轮廓版本</h3>
      <table>
        <thead>
          <tr>
            <th>版本</th>
            <th>作者</th>
            <th>时间</th>
            <th>标签</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contours" :key="item.version">
            <td>{{ item.version }}</td>
            <td>{{ item.doctor }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.tag }}</td>
            <td>
              <button @click="openModal('review')">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="modal" :title="titleMap[modal]" @close="modal=null">
      <template #body>
        <div class="grid">
          <label>
            <span>层厚 / mm</span>
            <input v-model.number="form.thickness" type="number" min="0.5" step="0.5" />
          </label>
          <label>
            <span>重建方式</span>
            <select v-model="form.method">
              <option value="等体素重采样">等体素重采样</option>
              <option value="基于分水岭">基于分水岭</option>
              <option value="区域增长">区域增长</option>
            </select>
          </label>
          <label>
            <span>叠加序列</span>
            <input v-model="form.overlay" placeholder="例如 T1+C / CTA" />
          </label>
          <label>
            <span>版本标签</span>
            <input v-model="form.tag" placeholder="平滑/扩展等" />
          </label>
          <div>
            <p style="margin:0 0 6px">计算进度</p>
            <div style="background:#e6f2ff; border-radius:10px; height:14px; overflow:hidden;">
              <div :style="{width: progress+'%', background:'linear-gradient(120deg,#42a5f5,#7e57c2)', height:'100%'}"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button @click="progress=Math.min(100, progress+20)">推进</button>
        <button @click="applyAction">保存更新</button>
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

const metrics = ref({ volume: 4.6, dose: 15.2, smoothness: 92 })
const overlayLabel = ref('MRI+CT')
const contours = ref([
  { version: 'v1.0', doctor: '李主任', time: '2024-03-12 09:18', tag: '初版' },
  { version: 'v1.1', doctor: '张医生', time: '2024-03-13 10:40', tag: '平滑更新' },
  { version: 'v1.2', doctor: '刘医生', time: '2024-03-14 15:02', tag: '合并囊肿' }
])
const modal = ref(null)
const progress = ref(45)
const form = reactive({ thickness: 1, method: '等体素重采样', overlay: 'T1+C', tag: '新版本' })
const titleMap = {
  draw: '靶区勾画',
  contour: '轮廓管理',
  overlay: '影像叠加',
  review: '版本查看'
}

function openModal(type) {
  modal.value = type
  progress.value = 45
  form.thickness = 1
  form.method = '等体素重采样'
  form.overlay = 'T1+C'
  form.tag = '新版本'
}

function applyAction() {
  if (modal.value === 'draw') {
    metrics.value = {
      volume: +(metrics.value.volume + form.thickness * 0.1).toFixed(1),
      dose: +(metrics.value.dose + 0.3).toFixed(1),
      smoothness: Math.min(100, metrics.value.smoothness + 2)
    }
    progress.value = 100
  }
  if (modal.value === 'contour') {
    const version = `v1.${contours.value.length}`
    contours.value.push({
      version,
      doctor: '系统生成',
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      tag: form.tag || '更新'
    })
    progress.value = Math.min(100, progress.value + 30)
  }
  if (modal.value === 'overlay') {
    overlayLabel.value = form.overlay || 'MRI+CT'
    progress.value = Math.min(100, progress.value + 20)
  }
  if (modal.value === 'review') {
    progress.value = 100
  }
  modal.value = null
}
</script>

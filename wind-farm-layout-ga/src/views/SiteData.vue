<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom: 12px;">
      <div>
        <h3 style="margin:0">项目与场址数据管理</h3>
        <p style="margin: 4px 0 0 0; color: #4b5563;">场址边界、禁布区、地形粗糙度、风资源与机型参数导入及版本留存</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap: wrap;">
        <button class="button-secondary" @click="openModal('导入边界/禁布区', boundaryForm)">导入边界</button>
        <button class="button-secondary" @click="openModal('导入风资源玫瑰图', resourceForm)">导入资源</button>
        <button class="button-secondary" @click="openModal('机型版本管理', turbineForm)">机型版本</button>
        <button class="button-primary" @click="openModal('生成候选机位', candidateForm)">生成候选点</button>
      </div>
    </div>
    <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 12px;">
      <div class="chart-box">
        <div class="flex-between" style="margin-bottom: 8px;">
          <strong>风向玫瑰图（示意）</strong>
          <span class="badge">频率分布</span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(8,1fr); gap: 6px; align-items:end; height: 160px;">
          <div v-for="(dir, idx) in windRose" :key="dir.name" style="text-align:center;">
            <div :style="{height: dir.value * 1.6 + 'px', background:'linear-gradient(180deg,#93c5fd,#2563eb)', borderRadius:'8px'}"></div>
            <small style="color:#1d4ed8;">{{ dir.name }}</small>
          </div>
        </div>
      </div>
      <div class="chart-box" style="background:#fff7ed; border-color:#fdba74;">
        <div class="flex-between" style="margin-bottom:8px;">
          <strong>机型参数</strong>
          <span class="badge" style="background:#fef3c7; color:#d97706;">版本 {{ turbineVersion }}</span>
        </div>
        <ul style="margin:0; padding-left: 16px; color: #92400e;">
          <li>功率曲线：2.5MW 级低风速</li>
          <li>轮毂高度：{{ turbineData.hubHeight }} m</li>
          <li>叶轮直径：{{ turbineData.rotorDiameter }} m</li>
          <li>粗糙度分区：平原/低丘陵</li>
          <li>资源文件：2024Q1 风速频率表</li>
        </ul>
      </div>
    </div>
    <div style="margin-top: 14px;">
      <div class="flex-between" style="margin-bottom: 8px;">
        <strong>候选机位列表（{{ candidates.length }}个）</strong>
        <span class="badge">含高程与分区信息</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>坐标X</th>
            <th>坐标Y</th>
            <th>分区</th>
            <th>地形粗糙度</th>
            <th>高程(m)</th>
            <th>版本</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in candidates" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.x }}</td>
            <td>{{ item.y }}</td>
            <td>{{ item.zone }}</td>
            <td>{{ item.roughness }}</td>
            <td>{{ item.elevation }}</td>
            <td><span class="tag">{{ item.version }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-if="modal.visible" :title="modal.title" @close="closeModal">
    <component :is="modal.component" :form="modal.form" />
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const turbineVersion = 'v1.3'
const turbineData = reactive({ hubHeight: 110, rotorDiameter: 156 })

const windRose = [
  { name: 'N', value: 26 },
  { name: 'NE', value: 18 },
  { name: 'E', value: 14 },
  { name: 'SE', value: 8 },
  { name: 'S', value: 6 },
  { name: 'SW', value: 9 },
  { name: 'W', value: 12 },
  { name: 'NW', value: 21 }
]

const candidates = Array.from({ length: 22 }).map((_, i) => ({
  id: `T-${(i + 1).toString().padStart(3, '0')}`,
  x: (470000 + i * 35).toFixed(1),
  y: (4420000 + i * 28).toFixed(1),
  zone: i % 3 === 0 ? '平原' : i % 3 === 1 ? '山前' : '丘陵',
  roughness: ['0.12', '0.18', '0.25'][i % 3],
  elevation: 150 + i * 3,
  version: i % 2 === 0 ? 'v1.3' : 'v1.2'
}))

const modal = reactive({ visible: false, title: '', component: null, form: {} })

const openModal = (title, form) => {
  modal.visible = true
  modal.title = title
  modal.component = form
  modal.form = reactive({})
}

const closeModal = () => {
  modal.visible = false
}

const boundaryForm = {
  template: `
    <div style="display:grid; gap:10px;">
      <label>选择边界/禁布区文件（GeoJSON/Shape）：<input type="file" /></label>
      <label>粗糙度分区标签：<input placeholder='例如 R1/R2/R3' /></label>
      <label>版本备注：<input placeholder='2024Q2 边界更新' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:65%'></div></div>
      <p style='margin:0;color:#475569;'>模拟上传中...65%</p>
    </div>`
}

const resourceForm = {
  template: `
    <div style="display:grid; gap:10px;">
      <label>风向玫瑰图：<input type='file' /></label>
      <label>风速频率表：<input type='file' /></label>
      <label>测风塔高度(m)：<input placeholder='80 / 100 / 120' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:38%'></div></div>
      <p style='margin:0;color:#475569;'>解析中：风向频率、湍流强度</p>
    </div>`
}

const turbineForm = {
  template: `
    <div style="display:grid; gap:10px;">
      <label>机型名称：<input placeholder='2.5MW-LVRT' /></label>
      <label>轮毂高度(m)：<input value='110' /></label>
      <label>叶轮直径(m)：<input value='156' /></label>
      <label>功率曲线文件：<input type='file' /></label>
      <p style='margin:0;color:#0ea5e9;'>导入后自动生成机型版本号并记录</p>
    </div>`
}

const candidateForm = {
  template: `
    <div style="display:grid; gap:10px;">
      <label>网格间距(m)：<input value='450' /></label>
      <label>最小间距(倍数D)：<input value='4.0' /></label>
      <label>候选点筛选条件：<textarea rows='2' placeholder='剔除红线、林地、噪声敏感区...'></textarea></label>
      <div class='progress-track'><div class='progress-bar' style='width:82%'></div></div>
      <p style='margin:0;color:#16a34a;'>已生成 22 个候选机位并写入数据库</p>
    </div>`
}
</script>

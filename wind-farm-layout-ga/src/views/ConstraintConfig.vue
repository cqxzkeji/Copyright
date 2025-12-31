<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom:12px;">
      <div>
        <h3 style="margin:0">约束与规则配置</h3>
        <p style="margin:4px 0 0 0; color:#4b5563;">最小机间距、红线、并网及交通走廊、噪声生态约束、可施工区域筛选</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap: wrap;">
        <button class="button-secondary" @click="openModal('设置最小机间距', spacingForm)">机间距</button>
        <button class="button-secondary" @click="openModal('并网与道路走廊', corridorForm)">走廊约束</button>
        <button class="button-secondary" @click="openModal('噪声与生态管控', noiseForm)">噪声/生态</button>
        <button class="button-primary" @click="openModal('候选点筛选', filterForm)">筛选候选点</button>
      </div>
    </div>
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 12px;">
      <div class="chart-box">
        <div class="flex-between">
          <strong>机间距约束</strong>
          <span class="badge">{{ spacing }}D</span>
        </div>
        <p style="margin:6px 0 0 0; color:#4b5563;">按叶轮直径倍数控制，支持风向扇区自适应放大。</p>
      </div>
      <div class="chart-box">
        <div class="flex-between">
          <strong>红线/禁布区</strong>
          <span class="badge">6 区</span>
        </div>
        <p style="margin:6px 0 0 0; color:#b91c1c;">含生态保护、文物保护、居民噪声敏感区。</p>
      </div>
      <div class="chart-box">
        <div class="flex-between">
          <strong>走廊约束</strong>
          <span class="badge">并网/道路/集电</span>
        </div>
        <p style="margin:6px 0 0 0; color:#4b5563;">自动与机位保持安全距离，支持等距偏移生成缓冲带。</p>
      </div>
    </div>
    <div style="margin-top:14px;">
      <div class="flex-between" style="margin-bottom:8px;">
        <strong>候选点约束校验结果</strong>
        <span class="badge">{{ filtered.length }} / {{ rawCandidates.length }} 通过</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>机位</th>
            <th>距红线(m)</th>
            <th>距并网走廊(m)</th>
            <th>噪声(dB)</th>
            <th>是否可施工</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.redline }}</td>
            <td>{{ item.grid }}</td>
            <td>{{ item.noise }}</td>
            <td>{{ item.buildable ? '是' : '否' }}</td>
            <td><span :class="['badge', item.passed ? '':'tag']">{{ item.passed ? '通过' : '待优化' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-if="modal.visible" :title="modal.title" @close="closeModal">
    <component :is="modal.component" />
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const spacing = 4.5
const rawCandidates = Array.from({ length: 24 }).map((_, i) => ({
  id: `C-${(i + 1).toString().padStart(3, '0')}`,
  redline: 200 + i * 5,
  grid: 80 + (i % 5) * 12,
  noise: 40 + (i % 6) * 1.5,
  buildable: i % 7 !== 0,
  passed: i % 6 !== 0
}))
const filtered = rawCandidates.filter((item) => item.redline > 210 && item.grid > 90 && item.noise < 48)

const modal = reactive({ visible: false, title: '', component: null })
const openModal = (title, comp) => {
  modal.visible = true
  modal.title = title
  modal.component = comp
}
const closeModal = () => {
  modal.visible = false
}

const spacingForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>最小机间距(倍数D)：<input value='4.5' /></label>
      <label>顺风向放大系数：<input value='1.2' /></label>
      <label>横风向放大系数：<input value='0.9' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:58%'></div></div>
      <p style='margin:0;color:#2563eb;'>已对 24 个候选点重新计算间距约束</p>
    </div>`
}

const corridorForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>并网走廊缓冲(m)：<input value='150' /></label>
      <label>道路走廊缓冲(m)：<input value='100' /></label>
      <label>集电线路走廊缓冲(m)：<input value='80' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:44%'></div></div>
      <p style='margin:0;color:#475569;'>自动生成走廊缓冲并与候选点叠加</p>
    </div>`
}

const noiseForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>噪声上限(dB)：<input value='45' /></label>
      <label>生态保护区距离(m)：<input value='500' /></label>
      <label>红线最小距离(m)：<input value='300' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:71%'></div></div>
      <p style='margin:0;color:#16a34a;'>噪声模拟完成，标记 3 个待优化点</p>
    </div>`
}

const filterForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>可施工坡度阈值(°)：<input value='6' /></label>
      <label>最小硬化场地面积(㎡)：<input value='4500' /></label>
      <label>过滤规则：<textarea rows='2' placeholder='剔除红线内、噪声>45dB、坡度>6°的点'></textarea></label>
      <div class='progress-track'><div class='progress-bar' style='width:87%'></div></div>
      <p style='margin:0;color:#f97316;'>已过滤 {{ filtered.length }} / {{ rawCandidates.length }} 个点</p>
    </div>`
}
</script>

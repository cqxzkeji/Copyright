<template>
  <div class="grid">
    <div class="flex-between">
      <h2>剂量评估与对比</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; min-width: 420px;">
        <button @click="openModal('calc')">计算剂量</button>
        <button @click="openModal('compare')">方案对比</button>
        <button @click="openModal('dvh')">DVH 查看</button>
      </div>
    </div>

    <div class="card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px; align-items:center;">
      <div>
        <svg viewBox="0 0 320 200" width="100%" height="200">
          <polyline :points="pt(targetCurve)" fill="rgba(66,165,245,0.15)" stroke="#42a5f5" stroke-width="2" />
          <polyline :points="pt(oarCurve)" fill="rgba(76,175,80,0.15)" stroke="#66bb6a" stroke-width="2" />
          <text x="20" y="20" fill="#0d47a1" font-weight="700">DVH</text>
        </svg>
      </div>
      <div class="grid">
        <div class="flex-between"><strong>靶区 D95</strong><span>{{ stats.d95 }} Gy</span></div>
        <div class="flex-between"><strong>GTV 覆盖</strong><span>{{ stats.coverage }}%</span></div>
        <div class="flex-between"><strong>OAR 约束</strong><span>{{ stats.oar }}</span></div>
        <p style="margin:0; color:#5f6a7a;">靶区曲线（蓝）与危及器官曲线（绿）实时绘制，方便快速对比。</p>
      </div>
    </div>

    <div class="table-card">
      <h3>剂量统计</h3>
      <table>
        <thead>
          <tr>
            <th>结构</th>
            <th>平均剂量</th>
            <th>最大剂量</th>
            <th>体积</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.mean }} Gy</td>
            <td>{{ row.max }} Gy</td>
            <td>{{ row.volume }} cc</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="modal" :title="titleMap[modal]" @close="modal=null">
      <template #body>
        <div class="grid">
          <label>
            <span>评估方案</span>
            <select v-model="form.plan">
              <option>GA-01</option>
              <option>GA-02</option>
              <option>GA-03</option>
            </select>
          </label>
          <label>
            <span>剂量网格</span>
            <input v-model="form.grid" placeholder="1mm / 2mm" />
          </label>
          <label>
            <span>比较基准</span>
            <input v-model="form.baseline" placeholder="等剂量面 / 梯度" />
          </label>
          <div>
            <p style="margin:0 0 6px">任务进度</p>
            <div style="background:#e6f2ff; border-radius:10px; height:14px; overflow:hidden;">
              <div :style="{width: progress+'%', background:'linear-gradient(120deg,#ffa000,#ff7043)', height:'100%'}"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button @click="progress=Math.min(100, progress+20)">推进</button>
        <button @click="recalcDose">执行</button>
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

const stats = ref({ d95: 14.5, coverage: 98.4, oar: '全部满足' })
const targetCurve = ref([
  [0, 10],
  [40, 50],
  [80, 70],
  [120, 82],
  [200, 95],
  [280, 100]
])
const oarCurve = ref([
  [0, 5],
  [60, 20],
  [120, 35],
  [200, 55],
  [260, 70],
  [320, 82]
])
const table = ref([
  { name: 'GTV', mean: 15.2, max: 19.1, volume: 4.6, note: '符合处方' },
  { name: 'CTV', mean: 14.8, max: 18.5, volume: 6.0, note: '包络 GTV' },
  { name: '脑干', mean: 4.2, max: 8.4, volume: 18.3, note: '低于 12Gy' },
  { name: '视神经', mean: 3.6, max: 7.5, volume: 4.9, note: '安全' },
  { name: '海马', mean: 2.4, max: 6.6, volume: 5.5, note: '满足 RTOG' }
])
const modal = ref(null)
const progress = ref(30)
const form = reactive({ plan: 'GA-01', grid: '1mm', baseline: '等剂量面' })
const titleMap = { calc: '剂量计算', compare: '方案对比', dvh: 'DVH 查看' }

function pt(arr) {
  return arr.map(([x, y]) => `${x},${200 - y}`).join(' ')
}

function openModal(type) {
  modal.value = type
  progress.value = 30
  form.plan = 'GA-01'
  form.grid = '1mm'
  form.baseline = '等剂量面'
}

function recalcDose() {
  const delta = form.plan === 'GA-02' ? 0.8 : form.plan === 'GA-03' ? -0.5 : 0
  stats.value = {
    d95: +(14.5 + delta).toFixed(1),
    coverage: +(98.4 + delta * 0.6).toFixed(1),
    oar: form.baseline.includes('梯度') ? '关注梯度' : '全部满足'
  }
  targetCurve.value = targetCurve.value.map(([x, y]) => [x, Math.min(100, y + delta * 2)])
  oarCurve.value = oarCurve.value.map(([x, y]) => [x, Math.min(100, y + delta)])
  table.value = table.value.map(item => ({
    ...item,
    mean: +(item.mean + delta * 0.2).toFixed(1),
    max: +(item.max + delta * 0.3).toFixed(1),
    note: form.grid.includes('2') ? `${item.note}｜粗网格` : `${item.note}｜细网格`
  }))
  progress.value = 100
  modal.value = null
}
</script>

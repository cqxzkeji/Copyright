<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom:12px;">
      <div>
        <h3 style="margin:0">遗传算法优化与参数设置</h3>
        <p style="margin:4px 0 0 0; color:#4b5563;">编码方式、适应度函数、选择/交叉/变异、精英保留与终止条件</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap: wrap;">
        <button class="button-secondary" @click="openModal('编码方式配置', codingForm)">编码方式</button>
        <button class="button-secondary" @click="openModal('适应度函数配置', fitnessForm)">适应度函数</button>
        <button class="button-secondary" @click="openModal('遗传算子设置', operatorForm)">算子设置</button>
        <button class="button-primary" @click="startOptimization">启动优化</button>
      </div>
    </div>
    <div class="grid-chart">
      <div class="chart-box">
        <div class="flex-between"><strong>参数快照</strong><span class="badge">并行</span></div>
        <ul style="margin:6px 0 0 0; padding-left: 16px; color:#374151;">
          <li>编码：坐标编码 + 机位选择混合</li>
          <li>种群规模：{{ params.population }}，精英：{{ params.elite }}</li>
          <li>交叉率：{{ params.crossover }}，变异率：{{ params.mutation }}</li>
          <li>终止条件：{{ params.generations }} 代或收敛阈值 {{ params.threshold }}</li>
        </ul>
      </div>
      <div class="chart-box">
        <div class="flex-between"><strong>多种子运行</strong><span class="badge">{{ seeds.length }} 次</span></div>
        <p style="margin:6px 0 10px 0; color:#4b5563;">支持并行运行多个随机种子，保留最优解。</p>
        <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:6px;">
          <div v-for="seed in seeds" :key="seed.id" class="card" style="padding:8px; border:1px solid #e5e7eb;">
            <div class="flex-between" style="font-weight:700;">Seed {{ seed.id }}<span class="tag">{{ seed.status }}</span></div>
            <div style="font-size:12px; color:#2563eb;">最佳AEP {{ seed.aep }} GWh</div>
            <div class="progress-track" style="height:8px; margin-top:4px;"><div class="progress-bar" :style="{width: seed.progress+'%'}"></div></div>
          </div>
        </div>
      </div>
      <div class="chart-box">
        <div class="flex-between"><strong>适应度演化</strong><span class="badge">示意</span></div>
        <div style="height:160px; display:flex; gap:6px; align-items:flex-end;">
          <div v-for="(fit, idx) in fitnessCurve" :key="idx" :style="{height: fit + 'px', background:'#3b82f6', width:'24px', borderRadius:'8px'}"></div>
        </div>
        <p style="margin:6px 0 0 0; color:#16a34a;">逐代提升，惩罚函数在违规时自动扣分</p>
      </div>
    </div>
  </div>

  <ModalDialog v-if="modal.visible" :title="modal.title" @close="closeModal">
    <component :is="modal.component" />
  </ModalDialog>

  <ModalDialog v-if="progress.visible" :title="progress.title" @close="progress.visible=false" :showFooter="false">
    <p style="margin:0 0 8px 0;">{{ progress.message }}</p>
    <div class="progress-track" style="height: 14px;">
      <div class="progress-bar" :style="{width: progress.value + '%'}"></div>
    </div>
    <p style="margin:6px 0 0 0; color:#0ea5e9;">预计剩余 {{ 100 - progress.value }}%</p>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const params = reactive({ population: 60, elite: 4, crossover: 0.8, mutation: 0.12, generations: 120, threshold: '0.5%' })
const seeds = reactive([
  { id: 1, status: '完成', aep: 132.4, progress: 100 },
  { id: 2, status: '运行中', aep: 129.8, progress: 74 },
  { id: 3, status: '排队', aep: '-', progress: 12 }
])
const fitnessCurve = [30, 48, 65, 78, 95, 112, 126, 134]

const modal = reactive({ visible: false, title: '', component: null })
const progress = reactive({ visible: false, title: '优化进度', message: '正在并行计算尾流与AEP...', value: 35 })

const openModal = (title, comp) => {
  modal.visible = true
  modal.title = title
  modal.component = comp
}
const closeModal = () => {
  modal.visible = false
}

const startOptimization = () => {
  progress.visible = true
  progress.value = 35
  progress.message = '正在并行计算尾流与AEP...'
  let step = 35
  const timer = setInterval(() => {
    step += 15
    progress.value = Math.min(step, 100)
    progress.message = progress.value >= 90 ? '收敛检测与精英筛选...' : '评估多目标适应度...'
    if (progress.value >= 100) {
      clearInterval(timer)
      progress.message = '完成，最优解已写入方案库'
    }
  }, 600)
}

const codingForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>编码方式：
        <select>
          <option>机位选择编码</option>
          <option>坐标编码</option>
          <option selected>混合编码</option>
        </select>
      </label>
      <label>候选点池：<input value='22 个合规机位' /></label>
      <p style='margin:0;color:#2563eb;'>混合编码兼顾离散机位选择与连续坐标微调</p>
    </div>`
}

const fitnessForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>目标函数：<input value='最大化年发电量 AEP' /></label>
      <label>成本项(万元/MW)：<input value='510' /></label>
      <label>罚函数权重：<input value='1.6' /></label>
      <label>综合指标：<input value='AEP - 成本 - 违规罚分' /></label>
      <p style='margin:0;color:#16a34a;'>支持噪声、红线、间距违规的惩罚项</p>
    </div>`
}

const operatorForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>选择算子：<input value='锦标赛选择(3)' /></label>
      <label>交叉算子：<input value='均匀交叉' /></label>
      <label>变异算子：<input value='高斯扰动+机位替换' /></label>
      <label>精英保留：<input value='保留前 4 个个体' /></label>
      <p style='margin:0;color:#f97316;'>终止条件：120 代或适应度提升 < 0.5%</p>
    </div>`
}
</script>

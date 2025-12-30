<template>
  <div class="section">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
      <h3>PSO 调度优化引擎</h3>
      <div class="actions">
        <button class="primary-btn" @click="openParam">参数设置</button>
        <button class="secondary-btn" @click="runPSO">运行优化</button>
        <button class="secondary-btn" @click="openWeights">多目标权重</button>
      </div>
    </div>
    <p>粒子编码（工序序列+机器指派）、适应度计算、约束处理、迭代收敛。</p>

    <div class="section" style="margin-top:12px;">
      <h3>迭代收敛曲线</h3>
      <div style="display:flex;gap:10px;align-items:flex-end;min-height:140px;">
        <div v-for="p in convergence" :key="p.iter" :title="`迭代${p.iter}`" style="flex:1;background:#eef2ff;border-radius:8px;padding:4px;">
          <div style="background:linear-gradient(180deg,#22d3ee,#6366f1);border-radius:6px 6px 3px 3px;" :style="{height: p.value + 'px'}"></div>
          <div style="font-size:12px;text-align:center;color:#6b7280;">{{ p.iter }}</div>
        </div>
      </div>
    </div>

    <div class="section" style="margin-top:12px;">
      <h3>粒子群解码示例</h3>
      <table class="table">
        <thead>
          <tr><th>粒子</th><th>工序序列</th><th>机器指派</th><th>适应度</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in particles" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.sequence }}</td>
            <td>{{ p.machine }}</td>
            <td>{{ p.fitness }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showParam" title="PSO 参数设置" @close="showParam=false">
      <form class="form" @submit.prevent="saveParam">
        <label>粒子数量<input v-model.number="paramForm.size" type="number" required /></label>
        <label>迭代次数<input v-model.number="paramForm.iter" type="number" required /></label>
        <label>学习因子<input v-model="paramForm.c1" required placeholder="c1/c2" /></label>
        <label>惯性权重<input v-model="paramForm.w" required /></label>
        <button class="primary-btn" type="submit">保存参数</button>
      </form>
    </BaseModal>

    <BaseModal v-if="showWeights" title="多目标权重配置" @close="showWeights=false">
      <p>调整完工期、延期、能耗权重，生成新的适应度函数。</p>
      <div class="form">
        <label>完工期权重<input v-model.number="weightForm.makespan" type="number" min="0" max="1" step="0.1" /></label>
        <label>总延期权重<input v-model.number="weightForm.delay" type="number" min="0" max="1" step="0.1" /></label>
        <label>能耗权重<input v-model.number="weightForm.energy" type="number" min="0" max="1" step="0.1" /></label>
        <button class="primary-btn" @click="applyWeight">应用</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showProgress" title="优化进度" @close="showProgress=false">
      <p>正在计算解空间，处理资源约束...</p>
      <div class="progress-bar" style="margin:12px 0;">
        <div class="fill" :style="{width: psoProgress + '%'}"></div>
      </div>
      <p>当前最优适应度：{{ bestFitness }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const convergence = ref(Array.from({ length: 12 }).map((_, idx) => ({ iter: idx * 10, value: 40 + (idx % 6) * 8 })))
const particles = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    id: `P-${idx + 1}`,
    sequence: `OP${10 + idx % 5}-OP${20 + (idx + 1) % 5}-OP${30 + (idx + 2) % 5}`,
    machine: `M0${(idx % 4) + 1}/M0${((idx + 1) % 4) + 1}`,
    fitness: (120 + idx * 3).toFixed(1)
  }))
)

const showParam = ref(false)
const showWeights = ref(false)
const showProgress = ref(false)
const psoProgress = ref(0)
const bestFitness = ref(132.4)

const paramForm = reactive({ size: 40, iter: 150, c1: '1.8/1.6', w: '0.85->0.6' })
const weightForm = reactive({ makespan: 0.6, delay: 0.3, energy: 0.1 })

const openParam = () => (showParam.value = true)
const openWeights = () => (showWeights.value = true)

const saveParam = () => {
  bestFitness.value = 120 + Math.random() * 10
  showParam.value = false
}

const applyWeight = () => {
  convergence.value = convergence.value.map((c, idx) => ({ ...c, value: c.value - idx }))
  showWeights.value = false
}

const runPSO = () => {
  psoProgress.value = 0
  showProgress.value = true
  const timer = setInterval(() => {
    psoProgress.value += 12
    bestFitness.value = Math.max(98, bestFitness.value - Math.random() * 3)
    if (psoProgress.value >= 100) {
      psoProgress.value = 100
      clearInterval(timer)
    }
  }, 260)
}
</script>

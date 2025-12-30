<template>
  <div class="grid">
    <div class="flex-between">
      <h2>遗传算法计划优化</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; min-width: 420px;">
        <button @click="openModal('start')">生成方案</button>
        <button @click="openModal('mutate')">调节参数</button>
        <button @click="openModal('analyze')">查看族群</button>
      </div>
    </div>

    <div class="card" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px;">
      <div class="grid">
        <div class="flex-between"><span>覆盖度权重</span><strong>{{ params.coverage }}</strong></div>
        <input type="range" min="0" max="1" step="0.05" v-model.number="params.coverage" />
        <div class="flex-between"><span>梯度下降概率</span><strong>{{ params.mutation }}%</strong></div>
        <input type="range" min="1" max="40" step="1" v-model.number="params.mutation" />
        <div class="flex-between"><span>种群规模</span><strong>{{ params.population }}</strong></div>
        <input type="range" min="20" max="200" step="5" v-model.number="params.population" />
      </div>
      <div style="background:#e3f2fd; border-radius:12px; padding:16px;">
        <p style="margin:0; font-weight:700; color:#0d47a1;">实时适应度</p>
        <div style="height:160px; display:flex; align-items:flex-end; gap:6px;">
          <div v-for="bar in fitness" :key="bar.generation" :style="{height: bar.score+'%', background:'linear-gradient(120deg,#42a5f5,#26c6da)', flex:'1', borderRadius:'8px'}" title="代 {{ bar.generation }}"></div>
        </div>
        <p style="margin:6px 0 0; color:#5f6a7a;">后代适应度提升 {{ fitness[fitness.length-1].score - fitness[0].score }}%.</p>
      </div>
    </div>

    <div class="table-card">
      <h3>候选方案</h3>
      <table>
        <thead>
          <tr>
            <th>方案</th>
            <th>覆盖度</th>
            <th>最大热点</th>
            <th>旁观器均值</th>
            <th>优势</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.name">
            <td>{{ plan.name }}</td>
            <td>{{ plan.coverage }}%</td>
            <td>{{ plan.hot }} Gy</td>
            <td>{{ plan.oar }} Gy</td>
            <td>{{ plan.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="modal" :title="titleMap[modal]" @close="modal=null">
      <template #body>
        <div class="grid">
          <label>
            <span>迭代次数</span>
            <input type="number" min="50" step="10" v-model.number="params.iteration" />
          </label>
          <label>
            <span>交叉概率</span>
            <input type="number" min="0" max="1" step="0.05" v-model.number="params.crossover" />
          </label>
          <label>
            <span>停机条件</span>
            <select>
              <option>适应度收敛</option>
              <option>达到最大代数</option>
              <option>旁观器剂量约束</option>
            </select>
          </label>
          <label>
            <span>目标方案名</span>
            <input v-model="form.planName" placeholder="例如 GA-05" />
          </label>
          <label>
            <span>备注</span>
            <input v-model="form.note" placeholder="热点抑制 / 剂量平衡" />
          </label>
          <div>
            <p style="margin:0 0 6px">进度</p>
            <div style="background:#e6f2ff; border-radius:10px; height:14px; overflow:hidden;">
              <div :style="{width: progress+'%', background:'linear-gradient(120deg,#66bb6a,#26a69a)', height:'100%'}"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button @click="progress=Math.min(100, progress+25)">推进</button>
        <button @click="applyAction">执行</button>
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

const params = ref({ coverage: 0.72, mutation: 18, population: 120, iteration: 120, crossover: 0.6 })
const fitness = ref([
  { generation: 1, score: 48 },
  { generation: 5, score: 56 },
  { generation: 10, score: 64 },
  { generation: 15, score: 71 },
  { generation: 20, score: 78 }
])
const plans = ref([
  { name: 'GA-01', coverage: 98.2, hot: 17.3, oar: 6.2, note: '均衡覆盖' },
  { name: 'GA-02', coverage: 99.1, hot: 18.8, oar: 6.8, note: '高覆盖' },
  { name: 'GA-03', coverage: 97.5, hot: 16.5, oar: 5.9, note: '旁观器友好' },
  { name: 'GA-04', coverage: 98.9, hot: 17.0, oar: 6.4, note: '热点抑制' }
])
const modal = ref(null)
const progress = ref(35)
const form = reactive({ planName: 'GA-05', note: '新一代方案' })
const titleMap = {
  start: '生成方案',
  mutate: '参数调节',
  analyze: '族群分析'
}

function openModal(type) {
  modal.value = type
  progress.value = 35
  form.planName = `GA-0${plans.value.length + 1}`
  form.note = '新一代方案'
}

function applyAction() {
  if (modal.value === 'start') {
    const score = Math.min(100, fitness.value[fitness.value.length - 1].score + 5)
    fitness.value.push({ generation: fitness.value.length * 2 + 2, score })
    plans.value.unshift({
      name: form.planName || `GA-${plans.value.length + 1}`,
      coverage: +(95 + params.value.coverage * 5).toFixed(1),
      hot: +(16 + params.value.mutation * 0.05).toFixed(1),
      oar: +(5.5 + (1 - params.value.coverage) * 2).toFixed(1),
      note: form.note || '自动生成'
    })
    progress.value = 100
  }
  if (modal.value === 'mutate') {
    params.value.coverage = Math.min(1, +(params.value.coverage + 0.05).toFixed(2))
    params.value.mutation = Math.max(1, params.value.mutation - 2)
    progress.value = Math.min(100, progress.value + 20)
  }
  if (modal.value === 'analyze') {
    plans.value = plans.value
      .map(p => ({ ...p, coverage: +(p.coverage + Math.random()).toFixed(1) }))
      .sort((a, b) => b.coverage - a.coverage)
    progress.value = 100
  }
  modal.value = null
}
</script>

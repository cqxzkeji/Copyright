<template>
  <div class="card">
    <div class="header">
      <div>
        <div class="subtitle">吸附剂制备模块</div>
        <h2 style="margin: 0;">制备路线配置</h2>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn" @click="openPlan">制定制备方案</button>
        <button class="btn secondary" @click="openCalc">剂量校准</button>
        <button class="btn secondary" @click="openProgress">工序监控</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>方案编号</th>
          <th>矿物基体</th>
          <th>活化剂</th>
          <th>目标负载%</th>
          <th>搅拌时间(min)</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in plans" :key="plan.id">
          <td>{{ plan.id }}</td>
          <td>{{ plan.base }}</td>
          <td>{{ plan.activator }}</td>
          <td>{{ plan.load }}</td>
          <td>{{ plan.stir }}</td>
          <td><span class="badge">{{ plan.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showPlan" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>制定制备方案</strong></div>
      <div class="modal-body">
        <div class="form-group">
          <label>方案编号</label>
          <input v-model="planForm.id" placeholder="例如：P-2404-01" />
        </div>
        <div class="form-group">
          <label>矿物基体</label>
          <input v-model="planForm.base" placeholder="如：沸石" />
        </div>
        <div class="form-group">
          <label>活化剂</label>
          <select v-model="planForm.activator">
            <option>FeCl₃</option>
            <option>AlCl₃</option>
            <option>Mg(OH)₂</option>
            <option>Zn(NO₃)₂</option>
          </select>
        </div>
        <div class="form-group">
          <label>目标负载%</label>
          <input type="number" v-model.number="planForm.load" />
        </div>
        <div class="form-group">
          <label>搅拌时间(min)</label>
          <input type="number" v-model.number="planForm.stir" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showPlan = false">取消</button>
        <button class="btn" @click="savePlan">保存方案</button>
      </div>
    </div>
  </div>

  <div v-if="showCalc" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>剂量校准</strong></div>
      <div class="modal-body">
        <div class="form-group">
          <label>矿物质量 (g)</label>
          <input type="number" v-model.number="calcForm.mass" />
        </div>
        <div class="form-group">
          <label>溶液体积 (mL)</label>
          <input type="number" v-model.number="calcForm.volume" />
        </div>
        <div class="form-group">
          <label>目标浓度 (mol/L)</label>
          <input type="number" step="0.01" v-model.number="calcForm.conc" />
        </div>
        <div class="card" style="margin-top: 0.5rem;">
          <div class="subtitle">滴加速率建议</div>
          <p style="margin: 0;">{{ dripRate }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showCalc = false">关闭</button>
        <button class="btn" @click="recalc">重新计算</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>工序监控</strong></div>
      <div class="modal-body">
        <p style="margin-top: 0;">当前工序：{{ currentStep }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: stepProgress + '%' }"></div>
        </div>
        <p style="margin: 0.5rem 0 0;">完成度：{{ stepProgress.toFixed(0) }}%</p>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showProgress = false">暂停监控</button>
        <button class="btn" @click="advanceStep">推进下一步</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const plans = reactive([
  { id: 'P-2404-01', base: '沸石', activator: 'FeCl₃', load: 12, stir: 90, status: '浸渍中' },
  { id: 'P-2404-02', base: '膨润土', activator: 'AlCl₃', load: 15, stir: 120, status: '干燥中' },
  { id: 'P-2404-03', base: '凹凸棒石', activator: 'FeCl₃', load: 10, stir: 80, status: '搅拌中' },
  { id: 'P-2404-04', base: '海泡石', activator: 'Mg(OH)₂', load: 8, stir: 60, status: '完成' },
  { id: 'P-2404-05', base: '水镁石', activator: 'Zn(NO₃)₂', load: 14, stir: 100, status: '升温中' },
  { id: 'P-2404-06', base: '黄铁矿', activator: 'FeCl₃', load: 18, stir: 110, status: '浸渍中' },
  { id: 'P-2404-07', base: '绿泥石', activator: 'AlCl₃', load: 9, stir: 70, status: '干燥中' },
  { id: 'P-2404-08', base: '白云石', activator: 'FeCl₃', load: 11, stir: 85, status: '搅拌中' },
  { id: 'P-2404-09', base: '赤铁矿', activator: 'FeCl₃', load: 16, stir: 95, status: '完成' },
  { id: 'P-2404-10', base: '伊利石', activator: 'AlCl₃', load: 13, stir: 75, status: '干燥中' }
])

const showPlan = ref(false)
const showCalc = ref(false)
const showProgress = ref(false)

const planForm = reactive({ id: '', base: '', activator: 'FeCl₃', load: 10, stir: 60 })
const calcForm = reactive({ mass: 10, volume: 200, conc: 0.1 })
const dripRate = ref('滴加速率：2.5 mL/min，可形成均匀包覆层')
const stepProgress = ref(45)
const currentStep = ref('浸渍反应保持 80℃')

const openPlan = () => {
  planForm.id = ''
  planForm.base = ''
  planForm.activator = 'FeCl₃'
  planForm.load = 10
  planForm.stir = 60
  showPlan.value = true
}

const savePlan = () => {
  if (planForm.id && planForm.base) {
    plans.push({ ...planForm, status: '待执行' })
    showPlan.value = false
  }
}

const openCalc = () => {
  showCalc.value = true
}

const recalc = () => {
  const mass = calcForm.mass || 0
  const volume = calcForm.volume || 1
  const conc = calcForm.conc || 0
  const totalMol = (conc * volume) / 1000
  const tip = totalMol > 1 ? '建议分段滴加，防止局部沉淀' : '稳定滴加即可'
  dripRate.value = `滴加速率：${(volume / 80).toFixed(2)} mL/min，${tip}`
}

const openProgress = () => {
  showProgress.value = true
}

const advanceStep = () => {
  stepProgress.value = Math.min(100, stepProgress.value + 15)
  if (stepProgress.value >= 100) {
    currentStep.value = '冷冻干燥完成，可转性能测试'
  } else if (stepProgress.value > 70) {
    currentStep.value = '煅烧阶段：450℃ 保温'
  } else if (stepProgress.value > 40) {
    currentStep.value = '老化阶段：收集滤饼'
  }
}
</script>

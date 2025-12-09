<template>
  <div class="card">
    <div class="header">
      <div>
        <div class="subtitle">吸附机制分析模块</div>
        <h2 style="margin: 0;">机理实验记录</h2>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn" @click="openIsotherm">等温线拟合</button>
        <button class="btn secondary" @click="openKinetics">动力学拟合</button>
        <button class="btn secondary" @click="openSurface">表面分析</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>实验编号</th>
          <th>温度(℃)</th>
          <th>平衡时间(min)</th>
          <th>拟合模型</th>
          <th>R²</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in records" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.temp }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.model }}</td>
          <td>{{ item.r2 }}</td>
          <td>{{ item.note }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showIsotherm" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>等温线拟合</strong></div>
      <div class="modal-body">
        <div class="form-group">
          <label>吸附剂质量 (g)</label>
          <input type="number" v-model.number="isoForm.mass" />
        </div>
        <div class="form-group">
          <label>温度 (℃)</label>
          <input type="number" v-model.number="isoForm.temp" />
        </div>
        <div class="form-group">
          <label>初始浓度序列 (mg/L)</label>
          <textarea v-model="isoForm.series" rows="3"></textarea>
        </div>
        <p style="margin: 0; color: #4b5568;">拟合建议：{{ isoSuggestion }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showIsotherm = false">取消</button>
        <button class="btn" @click="runIsotherm">开始拟合</button>
      </div>
    </div>
  </div>

  <div v-if="showKinetics" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>动力学拟合</strong></div>
      <div class="modal-body">
        <div class="form-group">
          <label>时间节点(min)</label>
          <input v-model="kinForm.timePoints" placeholder="0,5,10,30,60" />
        </div>
        <div class="form-group">
          <label>吸附量序列(mg/g)</label>
          <input v-model="kinForm.capacity" placeholder="0,5.2,8.7,12.4,15.0" />
        </div>
        <div class="card" style="margin-top: 0.5rem;">
          <div class="subtitle">模型选择</div>
          <p style="margin: 0;">{{ kineticSuggestion }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showKinetics = false">关闭</button>
        <button class="btn" @click="suggestKinetics">重新判别</button>
      </div>
    </div>
  </div>

  <div v-if="showSurface" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>表面分析提示</strong></div>
      <div class="modal-body">
        <ul style="margin: 0; padding-left: 1.2rem; color: #4b5568;">
          <li>XRD 显示 (104) 面峰形锐利，结晶性良好。</li>
          <li>XPS 中 P2p 峰位 133.5 eV，说明形成表面磷酸盐。</li>
          <li>BET 比表面积 86 m²/g，介孔比例 62%。</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="showSurface = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const records = reactive([
  { id: 'M-01', temp: 25, time: 60, model: 'Langmuir', r2: 0.982, note: '单层吸附' },
  { id: 'M-02', temp: 35, time: 45, model: 'Freundlich', r2: 0.954, note: '多层吸附' },
  { id: 'M-03', temp: 45, time: 30, model: 'Langmuir', r2: 0.968, note: '高亲和位点' },
  { id: 'M-04', temp: 25, time: 90, model: 'Temkin', r2: 0.912, note: '弱化热效应' },
  { id: 'M-05', temp: 55, time: 25, model: 'Langmuir', r2: 0.977, note: '高温促进' },
  { id: 'M-06', temp: 20, time: 120, model: 'Freundlich', r2: 0.939, note: '表面异质' },
  { id: 'M-07', temp: 30, time: 70, model: 'Langmuir', r2: 0.985, note: '单层吸附' },
  { id: 'M-08', temp: 40, time: 50, model: 'Temkin', r2: 0.927, note: '热效应明显' },
  { id: 'M-09', temp: 28, time: 80, model: 'Langmuir', r2: 0.963, note: '均一表面' },
  { id: 'M-10', temp: 33, time: 65, model: 'Freundlich', r2: 0.948, note: '多层吸附' }
])

const showIsotherm = ref(false)
const showKinetics = ref(false)
const showSurface = ref(false)

const isoForm = reactive({ mass: 0.1, temp: 25, series: '5,10,15,20,30' })
const kinForm = reactive({ timePoints: '0,5,10,30,60', capacity: '0,5.2,8.7,12.4,15.0' })
const isoSuggestion = ref('建议先用 Langmuir 模型拟合，关注单层饱和容量。')
const kineticSuggestion = ref('初步判断符合准二级动力学，吸附速率受化学吸附控制。')

const openIsotherm = () => {
  showIsotherm.value = true
}

const runIsotherm = () => {
  const temps = isoForm.temp
  isoSuggestion.value = temps > 40 ? '温度较高，注意选择 Temkin 模型修正热效应。' : '温度适中，优先尝试 Langmuir 拟合。'
}

const openKinetics = () => {
  showKinetics.value = true
}

const suggestKinetics = () => {
  kineticSuggestion.value = kinForm.capacity.includes('12') ? '数据呈快速趋稳，可采用 Boyd 或准二级模型。' : '吸附速率较慢，尝试颗粒内扩散模型。'
}

const openSurface = () => {
  showSurface.value = true
}
</script>

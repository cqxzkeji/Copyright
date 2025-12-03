<template>
  <div>
    <div class="header">
      <div>
        <h2>质量控制</h2>
        <p class="muted">跟踪理化、探伤与尺寸数据，及时发现偏差。</p>
      </div>
      <div class="action-row">
        <button class="primary-btn" @click="openSample">登记样品</button>
        <button class="secondary-btn" @click="openAlert">异常通报</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <div class="tag">{{ metric.label }}</div>
        <h3>{{ metric.value }}</h3>
        <p class="muted">{{ metric.note }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>批号</th>
          <th>钢号</th>
          <th>抗拉(MPa)</th>
          <th>冲击功(J)</th>
          <th>探伤</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in batches" :key="item.batch">
          <td>{{ item.batch }}</td>
          <td>{{ item.grade }}</td>
          <td>{{ item.tensile }}</td>
          <td>{{ item.impact }}</td>
          <td><span :class="['badge', item.ut === '合格' ? 'badge-green' : 'badge-amber']">{{ item.ut }}</span></td>
          <td>
            <button class="secondary-btn" @click="openCheck(item)">复核</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showSample" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>样品登记</h3>
        <button class="secondary-btn" @click="showSample = false">关闭</button>
      </div>
      <form class="form-grid" @submit.prevent="submitSample">
        <label>批号<input v-model="sample.batch" required /></label>
        <label>检验项目<input v-model="sample.item" required /></label>
      </form>
      <div class="modal-footer">
        <button class="primary-btn" @click="submitSample">提交</button>
      </div>
    </div>
  </div>

  <div v-if="showAlert" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>异常通报</h3>
        <button class="secondary-btn" @click="showAlert = false">关闭</button>
      </div>
      <p>将同步质检、生产、销售三方，锁定异常批次，暂停发运。</p>
      <div class="progress-bar"><div class="progress-fill" style="width: 100%"></div></div>
    </div>
  </div>

  <div v-if="showCheck" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ checkBatch.batch }} 复核</h3>
        <button class="secondary-btn" @click="showCheck = false">关闭</button>
      </div>
      <p>复核钢号：{{ checkBatch.grade }}，UT结果：{{ checkBatch.ut }}</p>
      <div class="alert">提示：已记录复核动作，如需偏差分析请导出原始报告。</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showSample = ref(false)
const showAlert = ref(false)
const showCheck = ref(false)
const checkBatch = ref({})
const sample = ref({ batch: '', item: '' })

const metrics = [
  { label: '一次合格率', value: '98.3%', note: '保持稳定' },
  { label: 'UT不合格批次', value: '1 批', note: '已隔离处理' },
  { label: '理化完成', value: '26 批', note: '本周进度 78%' },
  { label: '偏差闭环', value: '5 项', note: '责任人全部落实' }
]

const batches = [
  { batch: 'B240601', grade: 'UTG-12CrMo', tensile: '795', impact: '78', ut: '合格' },
  { batch: 'B240602', grade: 'UTG-40Cr', tensile: '870', impact: '72', ut: '合格' },
  { batch: 'B240603', grade: 'UTG-15CrMo', tensile: '760', impact: '69', ut: '合格' },
  { batch: 'B240604', grade: 'UTG-30Cr2Ni4', tensile: '960', impact: '82', ut: '合格' },
  { batch: 'B240605', grade: 'UTG-9SiCr', tensile: '1185', impact: '58', ut: '合格' },
  { batch: 'B240606', grade: 'UTG-5CrNiMo', tensile: '835', impact: '80', ut: '合格' },
  { batch: 'B240607', grade: 'UTG-20MnNi', tensile: '705', impact: '65', ut: '合格' },
  { batch: 'B240608', grade: 'UTG-50Mn2', tensile: '880', impact: '70', ut: '合格' },
  { batch: 'B240609', grade: 'UTG-12CrNi3', tensile: '1110', impact: '76', ut: '合格' },
  { batch: 'B240610', grade: 'UTG-30CrMnSi', tensile: '920', impact: '74', ut: '合格' }
]

const openSample = () => (showSample.value = true)
const openAlert = () => (showAlert.value = true)
const openCheck = (item) => {
  checkBatch.value = item
  showCheck.value = true
}
const submitSample = () => {
  showSample.value = false
  alert('样品已登记，等待检验。')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

h2 {
  margin: 0;
  color: #1e3a8a;
}

.muted {
  color: #6b7280;
  margin: 4px 0 0;
}

.action-row {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  gap: 10px;
}
</style>

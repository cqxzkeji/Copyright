<template>
  <div>
    <div class="header">
      <div>
        <h2>技术标准管理</h2>
        <p class="muted">维护定制钢种的化学成分、热处理与交付标准，确保销售承诺准确。</p>
      </div>
      <div class="action-row">
        <button class="primary-btn" @click="openForm">新增标准</button>
        <button class="secondary-btn" @click="openProgress">批量同步</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card" v-for="item in highlights" :key="item.title">
        <div class="tag">{{ item.title }}</div>
        <h3>{{ item.value }}</h3>
        <p class="muted">{{ item.note }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>钢号</th>
          <th>用途</th>
          <th>热处理</th>
          <th>强度标准</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in standards" :key="row.grade">
          <td>{{ row.grade }}</td>
          <td>{{ row.use }}</td>
          <td>{{ row.process }}</td>
          <td>{{ row.strength }}</td>
          <td><span :class="['badge', row.status === '生效' ? 'badge-green' : 'badge-amber']">{{ row.status }}</span></td>
          <td>
            <button class="secondary-btn" @click="viewDetail(row)">详情</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showForm" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>新增技术标准</h3>
        <button class="secondary-btn" @click="showForm = false">关闭</button>
      </div>
      <form class="form-grid" @submit.prevent="submitForm">
        <label>钢号<input v-model="form.grade" required /></label>
        <label>用途<input v-model="form.use" required /></label>
        <label>热处理<input v-model="form.process" required /></label>
        <label>强度标准<input v-model="form.strength" required /></label>
      </form>
      <div class="modal-footer">
        <button class="primary-btn" @click="submitForm">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>同步中</h3>
        <button class="secondary-btn" @click="showProgress = false">隐藏</button>
      </div>
      <p>与生产MES同步标准信息...</p>
      <div class="progress-bar"><div class="progress-fill" :style="{ width: syncProgress + '%' }"></div></div>
    </div>
  </div>

  <div v-if="showDetail" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ activeRow.grade }} 标准详情</h3>
        <button class="secondary-btn" @click="showDetail = false">关闭</button>
      </div>
      <p>用途：{{ activeRow.use }}</p>
      <p>热处理：{{ activeRow.process }}</p>
      <p>强度：{{ activeRow.strength }}</p>
      <div class="alert">提示：按钮已触发，当前标准处于{{ activeRow.status }}状态。</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showForm = ref(false)
const showProgress = ref(false)
const showDetail = ref(false)
const syncProgress = ref(70)
const activeRow = ref({})
const form = ref({ grade: '', use: '', process: '', strength: '' })

const highlights = [
  { title: '生效标准', value: '48 条', note: '覆盖主要定制钢号' },
  { title: '待审批', value: '6 条', note: '技术委员会审查中' },
  { title: '近30天更新', value: '12 次', note: '保持标准实时性' },
  { title: '关联订单', value: '35 单', note: '销售侧直接引用标准' }
]

const standards = [
  { grade: 'UTG-12CrMo', use: '压力容器', process: '调质', strength: '≥780MPa', status: '生效' },
  { grade: 'UTG-20MnNi', use: '低温管线', process: '正火', strength: '≥690MPa', status: '生效' },
  { grade: 'UTG-5CrNiMo', use: '模具钢', process: '调质', strength: '≥820MPa', status: '生效' },
  { grade: 'UTG-40Cr', use: '机械轴', process: '调质', strength: '≥850MPa', status: '生效' },
  { grade: 'UTG-15CrMo', use: '石化设备', process: '正火+回火', strength: '≥740MPa', status: '生效' },
  { grade: 'UTG-30Cr2Ni4', use: '齿轮', process: '渗碳', strength: '≥950MPa', status: '生效' },
  { grade: 'UTG-9SiCr', use: '弹簧', process: '淬火回火', strength: '≥1180MPa', status: '待用' },
  { grade: 'UTG-50Mn2', use: '车轴', process: '正火', strength: '≥860MPa', status: '生效' },
  { grade: 'UTG-12CrNi3', use: '轴承', process: '淬火', strength: '≥1100MPa', status: '生效' },
  { grade: 'UTG-30CrMnSi', use: '工程机械', process: '调质', strength: '≥900MPa', status: '待用' }
]

const openForm = () => {
  showForm.value = true
}

const openProgress = () => {
  showProgress.value = true
  syncProgress.value = 40
  setTimeout(() => (syncProgress.value = 80), 500)
  setTimeout(() => (syncProgress.value = 100), 1200)
}

const viewDetail = (row) => {
  activeRow.value = row
  showDetail.value = true
}

const submitForm = () => {
  showForm.value = false
  alert('已提交新标准，待技术评审。')
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

label input {
  display: block;
  margin-top: 6px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}
</style>

<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h2>技术标准库总览</h2>
        <div class="actions">
          <button class="btn" type="button" @click="openAdd">新增标准</button>
          <button class="btn primary" type="button" @click="openVersion">版本更新</button>
          <button class="btn ghost" type="button" @click="openAlert">同步提示</button>
        </div>
      </div>
      <div class="chart">
        <div class="chart-item" v-for="item in materialStats" :key="item.name">
          <div class="chart-title">{{ item.name }}</div>
          <div class="chart-bar">
            <span :style="{ width: item.value + '%' }"></span>
          </div>
          <div class="chart-value">{{ item.value }}%</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>优特钢技术标准表</h2>
        <div class="tag">版本：2024.06</div>
      </div>
      <div class="table">
        <div class="table-row table-head">
          <span>标准编号</span>
          <span>材质</span>
          <span>强度等级</span>
          <span>适用行业</span>
          <span>热处理</span>
          <span>状态</span>
        </div>
        <div v-for="row in standards" :key="row.code" class="table-row">
          <span>{{ row.code }}</span>
          <span>{{ row.material }}</span>
          <span>{{ row.strength }}</span>
          <span>{{ row.industry }}</span>
          <span>{{ row.process }}</span>
          <span>{{ row.status }}</span>
        </div>
      </div>
    </section>

    <BaseModal
      :open="modal.add"
      title="新增技术标准"
      primary-text="保存标准"
      @close="closeModals"
      @confirm="confirmAdd"
    >
      <label class="field">
        标准名称
        <input v-model="addForm.name" type="text" placeholder="例如：GCr15" />
      </label>
      <label class="field">
        强度等级
        <input v-model="addForm.strength" type="text" placeholder="≥ 1080 MPa" />
      </label>
      <label class="field">
        适用领域
        <input v-model="addForm.industry" type="text" placeholder="轴承制造、精密机械" />
      </label>
    </BaseModal>

    <BaseModal
      :open="modal.version"
      title="版本更新进度"
      :show-footer="false"
      @close="closeModals"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div>正在推送标准库版本：{{ progress }}%</div>
      <button class="btn primary" type="button" @click="finishVersion">完成升级</button>
    </BaseModal>

    <BaseModal
      :open="modal.alert"
      title="同步提示"
      primary-text="我知道了"
      @close="closeModals"
      @confirm="closeModals"
    >
      <p>标准库已与行业最新版本同步完成。</p>
      <p>建议在客户推导时优先使用最新版本。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const materialStats = [
  { name: '轴承钢', value: 78 },
  { name: '合金结构钢', value: 65 },
  { name: '工具钢', value: 48 },
  { name: '弹簧钢', value: 40 },
  { name: '齿轮钢', value: 72 }
]

const standards = [
  { code: 'TS-001', material: 'GCr15', strength: '1080-1250MPa', industry: '轴承', process: '淬火+回火', status: '启用' },
  { code: 'TS-002', material: '42CrMo', strength: '900-1100MPa', industry: '风电', process: '调质', status: '启用' },
  { code: 'TS-003', material: '35CrMo', strength: '850-980MPa', industry: '能源', process: '调质', status: '启用' },
  { code: 'TS-004', material: '20CrMnTi', strength: '780-930MPa', industry: '齿轮', process: '渗碳', status: '启用' },
  { code: 'TS-005', material: '40Cr', strength: '800-950MPa', industry: '通用机械', process: '调质', status: '启用' },
  { code: 'TS-006', material: '30CrMnSi', strength: '920-1080MPa', industry: '航空', process: '调质', status: '预审' },
  { code: 'TS-007', material: 'H13', strength: '1100-1300MPa', industry: '模具', process: '淬火', status: '启用' },
  { code: 'TS-008', material: 'Cr12MoV', strength: '1200-1400MPa', industry: '模具', process: '淬火', status: '启用' },
  { code: 'TS-009', material: '55SiCr', strength: '980-1150MPa', industry: '弹簧', process: '回火', status: '启用' },
  { code: 'TS-010', material: '65Mn', strength: '890-1020MPa', industry: '弹簧', process: '回火', status: '启用' },
  { code: 'TS-011', material: '15CrMo', strength: '760-900MPa', industry: '石化', process: '正火', status: '启用' },
  { code: 'TS-012', material: '17CrNiMo6', strength: '1000-1200MPa', industry: '齿轮', process: '渗碳', status: '启用' },
  { code: 'TS-013', material: '18CrNiMo7-6', strength: '1050-1250MPa', industry: '齿轮', process: '渗碳', status: '启用' },
  { code: 'TS-014', material: '30Cr2Ni4MoV', strength: '1100-1280MPa', industry: '海工', process: '调质', status: '预审' },
  { code: 'TS-015', material: '25Cr2MoV', strength: '980-1120MPa', industry: '汽轮机', process: '调质', status: '启用' },
  { code: 'TS-016', material: '38CrMoAl', strength: '980-1100MPa', industry: '氮化轴', process: '氮化', status: '启用' },
  { code: 'TS-017', material: '20Cr', strength: '750-900MPa', industry: '机械', process: '渗碳', status: '启用' },
  { code: 'TS-018', material: '16MnCr5', strength: '820-940MPa', industry: '汽车', process: '渗碳', status: '启用' },
  { code: 'TS-019', material: '50CrVA', strength: '1050-1200MPa', industry: '弹簧', process: '回火', status: '启用' },
  { code: 'TS-020', material: '35CrNiMo6', strength: '980-1120MPa', industry: '工程机械', process: '调质', status: '启用' },
  { code: 'TS-021', material: '20MnSi', strength: '700-820MPa', industry: '工程结构', process: '正火', status: '启用' },
  { code: 'TS-022', material: 'Q345D', strength: '470-630MPa', industry: '结构件', process: '正火', status: '启用' }
]

const modal = reactive({
  add: false,
  version: false,
  alert: false
})

const addForm = reactive({
  name: '',
  strength: '',
  industry: ''
})

const progress = ref(45)
let timer

const openAdd = () => {
  modal.add = true
}

const openVersion = () => {
  modal.version = true
  progress.value = 45
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 11, 100)
    if (progress.value === 100) {
      clearInterval(timer)
    }
  }, 350)
}

const openAlert = () => {
  modal.alert = true
}

const closeModals = () => {
  modal.add = false
  modal.version = false
  modal.alert = false
}

const confirmAdd = () => {
  closeModals()
}

const finishVersion = () => {
  progress.value = 100
}
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.panel {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(148, 163, 184, 0.16);
  display: grid;
  gap: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  cursor: pointer;
}

.btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.btn.ghost {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.chart {
  display: grid;
  gap: 12px;
}

.chart-item {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  gap: 12px;
  align-items: center;
}

.chart-bar {
  background: #f1f5f9;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.chart-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #93c5fd, #2563eb);
}

.chart-value {
  font-size: 12px;
  color: #64748b;
}

.table {
  display: grid;
  gap: 8px;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
}

.table-head {
  background: #e2e8f0;
  font-weight: 600;
}

.tag {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  background: #f8fafc;
}

.progress {
  width: 100%;
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  transition: width 0.3s ease;
}
</style>

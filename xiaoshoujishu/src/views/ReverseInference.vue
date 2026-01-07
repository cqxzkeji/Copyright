<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h2>逆向推导模型控制台</h2>
        <div class="actions">
          <button class="btn" type="button" @click="openInput">录入需求</button>
          <button class="btn primary" type="button" @click="openInference">启动推导</button>
          <button class="btn ghost" type="button" @click="openGuide">推导说明</button>
        </div>
      </div>
      <div class="flow">
        <div class="flow-step" v-for="step in steps" :key="step.title">
          <div class="step-title">{{ step.title }}</div>
          <div class="step-desc">{{ step.desc }}</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>推导任务列表</h2>
        <div class="tag">任务 {{ tasks.length }}</div>
      </div>
      <div class="table">
        <div class="table-row table-head">
          <span>任务编号</span>
          <span>客户需求</span>
          <span>匹配标准</span>
          <span>推导状态</span>
          <span>评分</span>
          <span>负责人</span>
        </div>
        <div v-for="row in tasks" :key="row.id" class="table-row">
          <span>{{ row.id }}</span>
          <span>{{ row.need }}</span>
          <span>{{ row.standard }}</span>
          <span>{{ row.status }}</span>
          <span>{{ row.score }}</span>
          <span>{{ row.owner }}</span>
        </div>
      </div>
    </section>

    <BaseModal
      :open="modal.input"
      title="录入逆向推导需求"
      primary-text="提交"
      @close="closeModals"
      @confirm="confirmInput"
    >
      <label class="field">
        关键指标
        <input v-model="inputForm.metric" type="text" placeholder="例如：抗拉强度 ≥ 1100MPa" />
      </label>
      <label class="field">
        使用场景
        <input v-model="inputForm.scene" type="text" placeholder="高负荷齿轮箱" />
      </label>
      <label class="field">
        约束条件
        <textarea v-model="inputForm.limit" rows="3" placeholder="如：必须符合 GB/T 3077" />
      </label>
    </BaseModal>

    <BaseModal
      :open="modal.inference"
      title="逆向推导进度"
      :show-footer="false"
      @close="closeModals"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div>正在推导标准组合：{{ progress }}%</div>
      <button class="btn primary" type="button" @click="finishInference">生成报告</button>
    </BaseModal>

    <BaseModal
      :open="modal.guide"
      title="推导算法说明"
      primary-text="了解"
      @close="closeModals"
      @confirm="closeModals"
    >
      <p>系统结合客户需求、标准约束与历史案例，自动计算材料匹配度。</p>
      <p>结果将生成推导过程与设计报告，确保符合行业规范。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const steps = [
  { title: '需求解析', desc: '提取强度、寿命、成本等核心指标' },
  { title: '标准筛选', desc: '对比标准库与行业规范约束' },
  { title: '反向计算', desc: '生成匹配度与风险评估' },
  { title: '报告输出', desc: '自动输出推导报告与建议' }
]

const tasks = [
  { id: 'RI-24001', need: '风电主轴高强度', standard: '42CrMo', status: '推导中', score: '88', owner: '刘工' },
  { id: 'RI-24002', need: '新能源汽车齿轮', standard: '20CrMnTi', status: '已完成', score: '94', owner: '王工' },
  { id: 'RI-24003', need: '船用曲轴', standard: '34CrNiMo6', status: '推导中', score: '86', owner: '陈工' },
  { id: 'RI-24004', need: '矿山液压缸', standard: '38CrMoAl', status: '已完成', score: '92', owner: '黄工' },
  { id: 'RI-24005', need: '高温模具', standard: 'H13', status: '已完成', score: '95', owner: '赵工' },
  { id: 'RI-24006', need: '重载齿轮', standard: '18CrNiMo7-6', status: '推导中', score: '89', owner: '孙工' },
  { id: 'RI-24007', need: '轨道弹簧', standard: '55SiCr', status: '已完成', score: '91', owner: '周工' },
  { id: 'RI-24008', need: '海工结构件', standard: 'Q345D', status: '评审中', score: '84', owner: '马工' },
  { id: 'RI-24009', need: '汽轮机转子', standard: '25Cr2MoV', status: '推导中', score: '87', owner: '罗工' },
  { id: 'RI-24010', need: '高压管道', standard: '15CrMo', status: '已完成', score: '90', owner: '朱工' },
  { id: 'RI-24011', need: '轴承套圈', standard: 'GCr15', status: '已完成', score: '93', owner: '彭工' },
  { id: 'RI-24012', need: '高速工具', standard: 'Cr12MoV', status: '推导中', score: '85', owner: '韩工' },
  { id: 'RI-24013', need: '汽车半轴', standard: '40Cr', status: '评审中', score: '82', owner: '许工' },
  { id: 'RI-24014', need: '风电齿轮箱', standard: '17CrNiMo6', status: '已完成', score: '94', owner: '汤工' },
  { id: 'RI-24015', need: '工程机械销轴', standard: '35CrMo', status: '推导中', score: '86', owner: '金工' },
  { id: 'RI-24016', need: '轧机轴承座', standard: '42CrMo', status: '评审中', score: '83', owner: '宋工' },
  { id: 'RI-24017', need: '液压杆', standard: '38CrMoAl', status: '已完成', score: '92', owner: '姚工' },
  { id: 'RI-24018', need: '耐磨齿板', standard: '30CrMnSi', status: '推导中', score: '85', owner: '白工' },
  { id: 'RI-24019', need: '石化阀体', standard: '15CrMo', status: '已完成', score: '90', owner: '冯工' },
  { id: 'RI-24020', need: '紧固件', standard: '20MnSi', status: '评审中', score: '81', owner: '朱工' },
  { id: 'RI-24021', need: '矿山车轴', standard: '30Cr2Ni4MoV', status: '推导中', score: '88', owner: '孔工' },
  { id: 'RI-24022', need: '高强度链条', standard: '50CrVA', status: '已完成', score: '91', owner: '高工' }
]

const modal = reactive({
  input: false,
  inference: false,
  guide: false
})

const inputForm = reactive({
  metric: '',
  scene: '',
  limit: ''
})

const progress = ref(32)
let timer

const openInput = () => {
  modal.input = true
}

const openInference = () => {
  modal.inference = true
  progress.value = 32
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 14, 100)
    if (progress.value === 100) {
      clearInterval(timer)
    }
  }, 360)
}

const openGuide = () => {
  modal.guide = true
}

const closeModals = () => {
  modal.input = false
  modal.inference = false
  modal.guide = false
}

const confirmInput = () => {
  closeModals()
}

const finishInference = () => {
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

.flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.flow-step {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
}

.step-title {
  font-weight: 600;
}

.step-desc {
  margin-top: 6px;
  font-size: 13px;
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

input,
textarea {
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

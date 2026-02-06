<template>
  <div class="module">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>风险监控与合规检查</h3>
          <p>自动评估风险并执行合规扫描。</p>
        </div>
        <div class="panel-actions">
          <button class="ghost-btn" @click="openScan">启动风险扫描</button>
          <button class="primary-btn" @click="openCompliance">生成合规报告</button>
        </div>
      </div>
      <div class="risk-grid">
        <div v-for="risk in riskCards" :key="risk.title" class="risk-card">
          <h4>{{ risk.title }}</h4>
          <p>{{ risk.desc }}</p>
          <span class="tag">{{ risk.level }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>跨部门协作追踪</h3>
          <p>合规事项与资源使用的跨部门协作状态。</p>
        </div>
        <button class="outline-btn" @click="openRegister">新增风险登记</button>
      </div>
      <div class="tracker-grid">
        <div v-for="item in trackers" :key="item.dept" class="tracker-card">
          <h4>{{ item.dept }}</h4>
          <p>{{ item.detail }}</p>
          <span class="status">{{ item.status }}</span>
        </div>
      </div>
    </section>

    <ModalBase :show="showScan" title="风险扫描" @close="showScan = false">
      <p>系统正在扫描项目风险与合规项。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: scanProgress + '%' }"></div>
      </div>
      <p class="muted">扫描进度：{{ scanProgress }}%</p>
      <template #footer>
        <button class="ghost-btn" @click="showScan = false">停止</button>
        <button class="primary-btn" @click="advanceScan">继续扫描</button>
      </template>
    </ModalBase>

    <ModalBase :show="showCompliance" title="合规报告生成" @close="showCompliance = false">
      <div class="form-grid">
        <label>
          报告范围
          <select v-model="complianceForm.scope">
            <option>全部项目</option>
            <option>高风险项目</option>
            <option>指定业务线</option>
          </select>
        </label>
        <label>
          审计周期
          <select v-model="complianceForm.period">
            <option>本月</option>
            <option>本季度</option>
            <option>本年度</option>
          </select>
        </label>
        <label class="full">
          备注说明
          <textarea v-model="complianceForm.note" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showCompliance = false">取消</button>
        <button class="primary-btn" @click="submitCompliance">生成报告</button>
      </template>
    </ModalBase>

    <ModalBase :show="showRegister" title="风险登记" @close="showRegister = false">
      <div class="form-grid">
        <label>
          风险标题
          <input v-model="registerForm.title" />
        </label>
        <label>
          风险等级
          <select v-model="registerForm.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label class="full">
          风险描述
          <textarea v-model="registerForm.desc" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showRegister = false">取消</button>
        <button class="primary-btn" @click="saveRegister">保存</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../components/ModalBase.vue'

const riskCards = [
  { title: '合规审计临近', desc: '3 个项目需要补充合规材料。', level: '高' },
  { title: '数据权限调整', desc: '跨部门权限需重新确认。', level: '中' },
  { title: '外包合同续签', desc: '供应商合规条款需更新。', level: '中' }
]

const trackers = [
  { dept: '法务部', detail: '合同审查进行中', status: '处理中' },
  { dept: '财务部', detail: '预算合规复核完成', status: '已完成' },
  { dept: '信息安全部', detail: '数据权限审计排期中', status: '待开始' }
]

const showScan = ref(false)
const showCompliance = ref(false)
const showRegister = ref(false)
const scanProgress = ref(36)

const complianceForm = ref({
  scope: '全部项目',
  period: '本月',
  note: ''
})

const registerForm = ref({
  title: '供应链合规风险',
  level: '中',
  desc: ''
})

const openScan = () => {
  showScan.value = true
}

const advanceScan = () => {
  scanProgress.value = Math.min(100, scanProgress.value + 20)
}

const openCompliance = () => {
  showCompliance.value = true
}

const submitCompliance = () => {
  showCompliance.value = false
}

const openRegister = () => {
  showRegister.value = true
}

const saveRegister = () => {
  showRegister.value = false
}
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.risk-grid,
.tracker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.risk-card,
.tracker-card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 14px;
  display: grid;
  gap: 6px;
}

.tag {
  background: #fee2e2;
  color: #b91c1c;
  padding: 4px 10px;
  border-radius: 999px;
  width: fit-content;
  font-size: 12px;
}

.status {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  width: fit-content;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.primary-btn {
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
}

.ghost-btn {
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 14px;
  border-radius: 10px;
}

.outline-btn {
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 8px 14px;
  border-radius: 10px;
  background: #ffffff;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 12px 0 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
}

.muted {
  color: #64748b;
  font-size: 13px;
}
</style>

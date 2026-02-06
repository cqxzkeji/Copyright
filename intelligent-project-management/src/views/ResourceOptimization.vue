<template>
  <div class="module">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>资源池概览</h3>
          <p>人力、设备、材料的实时负载情况。</p>
        </div>
        <div class="panel-actions">
          <button class="ghost-btn" @click="openAllocation">资源调配</button>
          <button class="primary-btn" @click="openForecast">预测优化</button>
        </div>
      </div>
      <div class="resource-grid">
        <div v-for="item in resources" :key="item.name" class="resource-card">
          <h4>{{ item.name }}</h4>
          <p>{{ item.desc }}</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: item.utilization + '%' }"></div>
          </div>
          <span class="muted">利用率 {{ item.utilization }}%</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>多项目资源分配</h3>
          <p>确保关键项目优先级与资源均衡。</p>
        </div>
        <button class="outline-btn" @click="openMulti">并行调度设置</button>
      </div>
      <div class="allocation-grid">
        <div v-for="plan in allocations" :key="plan.project" class="allocation-card">
          <h4>{{ plan.project }}</h4>
          <p>{{ plan.detail }}</p>
          <span class="tag">{{ plan.status }}</span>
        </div>
      </div>
    </section>

    <ModalBase :show="showAllocation" title="资源调配申请" @close="showAllocation = false">
      <div class="form-grid">
        <label>
          项目名称
          <input v-model="allocationForm.project" placeholder="请输入项目名称" />
        </label>
        <label>
          资源类型
          <select v-model="allocationForm.type">
            <option>人力</option>
            <option>设备</option>
            <option>材料</option>
          </select>
        </label>
        <label>
          调配数量
          <input type="number" v-model="allocationForm.amount" />
        </label>
        <label>
          期望到位日期
          <input type="date" v-model="allocationForm.date" />
        </label>
        <label class="full">
          调配原因
          <textarea v-model="allocationForm.reason" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showAllocation = false">取消</button>
        <button class="primary-btn" @click="submitAllocation">提交申请</button>
      </template>
    </ModalBase>

    <ModalBase :show="showForecast" title="资源预测优化" @close="showForecast = false">
      <p>系统将基于历史负载预测未来四周资源需求。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: forecastProgress + '%' }"></div>
      </div>
      <p class="muted">计算进度：{{ forecastProgress }}%</p>
      <template #footer>
        <button class="ghost-btn" @click="showForecast = false">取消</button>
        <button class="primary-btn" @click="advanceForecast">继续分析</button>
      </template>
    </ModalBase>

    <ModalBase :show="showMulti" title="并行调度设置" @close="showMulti = false">
      <div class="form-grid">
        <label>
          调度策略
          <select v-model="multiForm.strategy">
            <option>关键项目优先</option>
            <option>资源均衡</option>
            <option>成本最小</option>
          </select>
        </label>
        <label>
          允许超配比例
          <input v-model="multiForm.overload" placeholder="例如：10%" />
        </label>
        <label class="full">
          协作说明
          <textarea v-model="multiForm.note" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showMulti = false">取消</button>
        <button class="primary-btn" @click="saveMulti">保存设置</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../components/ModalBase.vue'

const resources = [
  { name: '核心开发人力', desc: '可用 42 人 / 总量 60 人', utilization: 70 },
  { name: '测试与验证设备', desc: '可用 18 套 / 总量 25 套', utilization: 72 },
  { name: '供应链材料', desc: '可用 68% 库存 / 安全阈值 60%', utilization: 68 },
  { name: '算力资源池', desc: 'GPU 可用 32 张 / 总量 48 张', utilization: 67 }
]

const allocations = [
  { project: '智慧工厂升级', detail: '新增 6 名前端工程师', status: '执行中' },
  { project: '供应链协同平台', detail: '调入 2 套测试设备', status: '待审批' },
  { project: '数据中台迭代', detail: '材料库存补充 12%', status: '已完成' },
  { project: 'AI 质检平台', detail: '增加 GPU 配额 8 张', status: '执行中' }
]

const showAllocation = ref(false)
const showForecast = ref(false)
const showMulti = ref(false)
const forecastProgress = ref(52)

const allocationForm = ref({
  project: '',
  type: '人力',
  amount: 4,
  date: '',
  reason: ''
})

const multiForm = ref({
  strategy: '关键项目优先',
  overload: '10%',
  note: ''
})

const openAllocation = () => {
  showAllocation.value = true
}

const submitAllocation = () => {
  showAllocation.value = false
}

const openForecast = () => {
  showForecast.value = true
}

const advanceForecast = () => {
  forecastProgress.value = Math.min(100, forecastProgress.value + 16)
}

const openMulti = () => {
  showMulti.value = true
}

const saveMulti = () => {
  showMulti.value = false
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

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.resource-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 8px;
}

.allocation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.allocation-card {
  background: #f1f5f9;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 6px;
}

.tag {
  background: #dbeafe;
  color: #1d4ed8;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
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

.muted {
  color: #64748b;
  font-size: 13px;
}
</style>

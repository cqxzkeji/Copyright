<template>
  <div class="grid" style="grid-template-columns: 1fr 1fr;align-items:start;">
    <div class="card">
      <div class="flex-between">
        <div>
          <h2>数据采集批次</h2>
          <small>实时写入数据湖，至少 5 条记录</small>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(140px,1fr));gap:8px;min-width:280px;">
          <button @click="openModal('import')">导入批次</button>
          <button @click="openModal('optimize')" style="background:var(--secondary);box-shadow:0 10px 25px rgba(34,197,94,0.25);">优化分析</button>
          <button @click="openModal('export')" style="background:var(--accent);box-shadow:0 10px 25px rgba(249,115,22,0.25);">导出报告</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>批次号</th>
            <th>任务</th>
            <th>样本量</th>
            <th>异常率</th>
            <th>标签</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="batch in batches" :key="batch.id">
            <td>{{ batch.id }}</td>
            <td>{{ batch.task }}</td>
            <td>{{ batch.size }}</td>
            <td>{{ batch.error }}%</td>
            <td><span class="badge" :class="batch.tag === '稳定' ? 'tag-green' : 'tag-orange'">{{ batch.tag }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="flex-between">
        <h2>能耗与精度分析</h2>
        <small>根据最近批次绘制</small>
      </div>
      <div class="analysis-grid">
        <div v-for="metric in metrics" :key="metric.name" class="analysis-card">
          <div class="highlight">{{ metric.value }}</div>
          <small>{{ metric.name }}</small>
          <div class="progress" style="margin-top:8px;">
            <div class="progress-bar" :style="{ width: metric.ratio + '%'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BaseModal :show="showModal === 'import'" title="导入批次" @close="closeModal">
    <p>填写数据批次元信息，上传后立即进入清洗。</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(180px,1fr));gap:12px;">
      <div>
        <label>批次号</label>
        <input v-model="importForm.id" />
      </div>
      <div>
        <label>任务类型</label>
        <input v-model="importForm.task" />
      </div>
      <div>
        <label>样本量</label>
        <input type="number" v-model="importForm.size" />
      </div>
      <div>
        <label>标签</label>
        <select v-model="importForm.tag">
          <option>稳定</option>
          <option>异常</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button @click="saveImport">提交</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'optimize'" title="优化分析" @close="closeModal">
    <p>自动计算能耗分布、重复精度与节拍敏感度。</p>
    <div class="progress" style="margin:12px 0;">
      <div class="progress-bar" :style="{ width: optimizeProgress + '%' }"></div>
    </div>
    <template #footer>
      <button @click="startOptimize" :disabled="optimizeProgress < 100" style="background:var(--secondary);box-shadow:none;">重跑分析</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'export'" title="导出报告" @close="closeModal">
    <p>即将导出《协同机械臂能耗与精度报告》，包含 KPI、折线和柱状图。</p>
    <template #footer>
      <button @click="closeModal" style="background:#e2e8f0;color:#0f172a;box-shadow:none;">取消</button>
      <button @click="confirmExport" style="background:var(--accent);">确认导出</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showModal = ref('')
const optimizeProgress = ref(55)

const batches = ref([
  { id: 'B-240512', task: '装配', size: 3200, error: 1.2, tag: '稳定' },
  { id: 'B-240513', task: '码垛', size: 1800, error: 2.1, tag: '稳定' },
  { id: 'B-240514', task: '焊接', size: 2600, error: 3.4, tag: '异常' },
  { id: 'B-240515', task: '检测', size: 1500, error: 1.8, tag: '稳定' },
  { id: 'B-240516', task: '分拣', size: 2100, error: 2.6, tag: '稳定' }
])

const metrics = ref([
  { name: '平均能耗(kWh)', value: '12.6', ratio: 72 },
  { name: '重复精度(mm)', value: '±0.03', ratio: 88 },
  { name: '节拍改善(%)', value: '+14', ratio: 64 },
  { name: '异常收敛(%)', value: '92', ratio: 92 }
])

const importForm = ref({
  id: 'B-240517',
  task: '校准',
  size: 2400,
  tag: '稳定'
})

const openModal = (key) => {
  showModal.value = key
  if (key === 'optimize') startOptimize()
}

const closeModal = () => {
  showModal.value = ''
}

const saveImport = () => {
  alert(`批次 ${importForm.value.id} (${importForm.value.task}) 已导入，样本 ${importForm.value.size}`)
  closeModal()
}

const startOptimize = () => {
  optimizeProgress.value = 0
  const timer = setInterval(() => {
    optimizeProgress.value += 22
    if (optimizeProgress.value >= 100) {
      optimizeProgress.value = 100
      clearInterval(timer)
    }
  }, 420)
}

const confirmExport = () => {
  alert('报告生成完成，已推送至系统管理的文件分发列表。')
  closeModal()
}
</script>

<style scoped>
.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.analysis-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
</style>

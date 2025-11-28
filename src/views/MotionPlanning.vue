<template>
  <div class="grid" style="grid-template-columns: 1.3fr 1fr;align-items:start;">
    <div class="card">
      <div class="flex-between">
        <div>
          <h2>轨迹规划队列</h2>
          <small>自适应多维插补 · 关键点不少于 5 条</small>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(140px,1fr));gap:8px;min-width:280px;">
          <button @click="openModal('pathForm')">生成轨迹</button>
          <button @click="openModal('queue')" style="background:var(--secondary);box-shadow:0 10px 25px rgba(34,197,94,0.25);">推送队列</button>
          <button @click="openModal('preview')" style="background:var(--accent);box-shadow:0 10px 25px rgba(249,115,22,0.25);">预览仿真</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>目标位姿</th>
            <th>速度(°/s)</th>
            <th>加速度(°/s²)</th>
            <th>模式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in plans" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.pose }}</td>
            <td>{{ item.speed }}</td>
            <td>{{ item.acc }}</td>
            <td>
              <span class="badge" :class="item.mode === '笛卡尔' ? 'tag-blue' : 'tag-green'">{{ item.mode }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="flex-between">
        <h2>运动规划热力分布</h2>
        <small>按关键帧占比绘制</small>
      </div>
      <div class="heatmap">
        <div v-for="stage in stages" :key="stage.name" class="heat-row">
          <div class="heat-label">{{ stage.name }}</div>
          <div class="heat-bar">
            <div class="heat-fill" :style="{ width: stage.load + '%'}"></div>
          </div>
          <div class="highlight">{{ stage.load }}%</div>
        </div>
      </div>
    </div>
  </div>

  <BaseModal :show="showModal === 'pathForm'" title="生成轨迹" @close="closeModal">
    <p>填写轨迹关键点，系统自动生成多维平滑路径。</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(180px,1fr));gap:12px;">
      <div>
        <label>起点</label>
        <input v-model="pathForm.start" placeholder="如 A1" />
      </div>
      <div>
        <label>终点</label>
        <input v-model="pathForm.end" placeholder="如 B7" />
      </div>
      <div>
        <label>速度(°/s)</label>
        <input type="number" v-model="pathForm.speed" />
      </div>
      <div>
        <label>插补模式</label>
        <select v-model="pathForm.mode">
          <option value="笛卡尔">笛卡尔</option>
          <option value="关节">关节</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button @click="savePath">生成并缓存</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'queue'" title="推送到调度队列" @close="closeModal">
    <p>正在推送规划结果到协同调度模块，进度实时刷新。</p>
    <div class="progress" style="margin:12px 0;">
      <div class="progress-bar" :style="{ width: queueProgress + '%' }"></div>
    </div>
    <template #footer>
      <button @click="startQueue" :disabled="queueProgress < 100" style="background:var(--secondary);box-shadow:none;">重新推送</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'preview'" title="仿真预览" @close="closeModal">
    <p>系统已生成 3D 预演数据，确认后将同步到云端数字孪生。</p>
    <template #footer>
      <button @click="closeModal" style="background:#e2e8f0;color:#0f172a;box-shadow:none;">取消</button>
      <button @click="confirmPreview" style="background:var(--accent);">同步数字孪生</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showModal = ref('')
const queueProgress = ref(35)

const plans = ref([
  { id: 1, pose: 'P(0.4,0.2,0.6)', speed: 120, acc: 240, mode: '笛卡尔' },
  { id: 2, pose: 'P(0.5,0.4,0.7)', speed: 110, acc: 220, mode: '笛卡尔' },
  { id: 3, pose: 'J(30,12,9)', speed: 95, acc: 200, mode: '关节' },
  { id: 4, pose: 'J(32,16,12)', speed: 90, acc: 180, mode: '关节' },
  { id: 5, pose: 'P(0.6,0.35,0.5)', speed: 105, acc: 210, mode: '笛卡尔' }
])

const stages = ref([
  { name: '关节空间', load: 62 },
  { name: '笛卡尔空间', load: 74 },
  { name: '避障偏置', load: 53 },
  { name: '动力学补偿', load: 41 },
  { name: '轨迹重采样', load: 67 }
])

const pathForm = ref({
  start: 'A1',
  end: 'B7',
  speed: 100,
  mode: '笛卡尔'
})

const openModal = (key) => {
  showModal.value = key
  if (key === 'queue') startQueue()
}

const closeModal = () => {
  showModal.value = ''
}

const savePath = () => {
  alert(`已生成 ${pathForm.value.start} -> ${pathForm.value.end} 的 ${pathForm.value.mode} 轨迹，速度 ${pathForm.value.speed}°/s`)
  closeModal()
}

const startQueue = () => {
  queueProgress.value = 0
  const timer = setInterval(() => {
    queueProgress.value += 20
    if (queueProgress.value >= 100) {
      queueProgress.value = 100
      clearInterval(timer)
    }
  }, 350)
}

const confirmPreview = () => {
  alert('仿真结果已推送到数字孪生，影像回放可在“协同调度”中查看。')
  closeModal()
}
</script>

<style scoped>
.heatmap {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.heat-row {
  display: grid;
  grid-template-columns: 120px 1fr 80px;
  gap: 10px;
  align-items: center;
}

.heat-bar {
  background: #eef2ff;
  border-radius: 999px;
  height: 12px;
  position: relative;
  overflow: hidden;
}

.heat-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  transition: width 0.3s ease;
}

@media (max-width: 960px) {
  .heat-row {
    grid-template-columns: 1fr;
  }
  .heat-bar {
    width: 100%;
  }
}
</style>

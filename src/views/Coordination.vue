<template>
  <div class="grid" style="grid-template-columns: 1.2fr 1fr;align-items:start;">
    <div class="card">
      <div class="flex-between">
        <div>
          <h2>协同任务队列</h2>
          <small>多机械臂协同调度，至少 5 条待办</small>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(140px,1fr));gap:8px;min-width:280px;">
          <button @click="openModal('assign')">分配任务</button>
          <button @click="openModal('sync')" style="background:var(--secondary);box-shadow:0 10px 25px rgba(34,197,94,0.25);">同步节拍</button>
          <button @click="openModal('broadcast')" style="background:var(--accent);box-shadow:0 10px 25px rgba(249,115,22,0.25);">广播提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>分配机械臂</th>
            <th>节拍</th>
            <th>优先级</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.robot }}</td>
            <td>{{ task.tact }}s</td>
            <td>{{ task.priority }}</td>
            <td><span class="badge" :class="task.status === '执行中' ? 'tag-blue' : 'tag-green'">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="flex-between">
        <h2>协同矩阵</h2>
        <small>互锁与资源占用</small>
      </div>
      <div class="matrix">
        <div v-for="(row, i) in matrix" :key="i" class="matrix-row">
          <div v-for="cell in row" :key="cell.label" class="matrix-cell" :style="{ background: cell.color }">
            <div class="highlight">{{ cell.label }}</div>
            <small>{{ cell.desc }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BaseModal :show="showModal === 'assign'" title="分配任务" @close="closeModal">
    <p>把任务分配给指定机械臂，并设置节拍与优先级。</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(180px,1fr));gap:12px;">
      <div>
        <label>任务名称</label>
        <input v-model="assignForm.name" />
      </div>
      <div>
        <label>目标机械臂</label>
        <select v-model="assignForm.robot">
          <option>臂-Alpha</option>
          <option>臂-Beta</option>
          <option>臂-Gamma</option>
        </select>
      </div>
      <div>
        <label>节拍(s)</label>
        <input type="number" v-model="assignForm.tact" />
      </div>
      <div>
        <label>优先级</label>
        <select v-model="assignForm.priority">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button @click="saveAssign">确定分配</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'sync'" title="节拍同步" @close="closeModal">
    <p>对各机械臂的协同节拍执行同步，对齐夹爪释放与输送窗口。</p>
    <div class="progress" style="margin:12px 0;">
      <div class="progress-bar" :style="{ width: syncProgress + '%' }"></div>
    </div>
    <template #footer>
      <button @click="startSync" :disabled="syncProgress < 100" style="background:var(--secondary);box-shadow:none;">重置节拍</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'broadcast'" title="广播提示" @close="closeModal">
    <p>将提示推送到工作位屏幕与语音播报。</p>
    <template #footer>
      <button @click="closeModal" style="background:#e2e8f0;color:#0f172a;box-shadow:none;">取消</button>
      <button @click="confirmBroadcast" style="background:var(--accent);">立即广播</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showModal = ref('')
const syncProgress = ref(60)

const tasks = ref([
  { name: '装配-焊接', robot: '臂-Alpha', tact: 12, priority: '高', status: '执行中' },
  { name: '检测-扫码', robot: '臂-Beta', tact: 9, priority: '中', status: '执行中' },
  { name: '搬运-码垛', robot: '臂-Gamma', tact: 7, priority: '高', status: '就绪' },
  { name: '抛光-末端', robot: '臂-Delta', tact: 11, priority: '中', status: '就绪' },
  { name: '分拣-分料', robot: '臂-Epsilon', tact: 8, priority: '低', status: '就绪' }
])

const matrix = ref([
  [
    { label: 'A→B', desc: '抓取互锁', color: '#e0f2fe' },
    { label: 'B→C', desc: '输送共享', color: '#ecfeff' }
  ],
  [
    { label: 'C→D', desc: '力控协同', color: '#f0fdf4' },
    { label: 'D→E', desc: '安全互斥', color: '#ffedd5' }
  ]
])

const assignForm = ref({
  name: '拼装-锁附',
  robot: '臂-Alpha',
  tact: 10,
  priority: '高'
})

const openModal = (key) => {
  showModal.value = key
  if (key === 'sync') startSync()
}

const closeModal = () => {
  showModal.value = ''
}

const saveAssign = () => {
  alert(`任务 ${assignForm.value.name} 已分配给 ${assignForm.value.robot}，节拍 ${assignForm.value.tact}s，优先级 ${assignForm.value.priority}`)
  closeModal()
}

const startSync = () => {
  syncProgress.value = 0
  const timer = setInterval(() => {
    syncProgress.value += 18
    if (syncProgress.value >= 100) {
      syncProgress.value = 100
      clearInterval(timer)
    }
  }, 400)
}

const confirmBroadcast = () => {
  alert('广播已发布，工位屏幕与语音播报完成同步。')
  closeModal()
}
</script>

<style scoped>
.matrix {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.matrix-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.matrix-cell {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 4px;
  min-height: 100px;
}
</style>

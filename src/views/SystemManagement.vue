<template>
  <div class="grid" style="grid-template-columns: 1fr 1fr;align-items:start;">
    <div class="card">
      <div class="flex-between">
        <div>
          <h2>系统用户与权限</h2>
          <small>统一身份与权限管理，列表不少于 5 条</small>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(140px,1fr));gap:8px;min-width:280px;">
          <button @click="openModal('user')">新增账号</button>
          <button @click="openModal('backup')" style="background:var(--secondary);box-shadow:0 10px 25px rgba(34,197,94,0.25);">同步备份</button>
          <button @click="openModal('restart')" style="background:var(--accent);box-shadow:0 10px 25px rgba(249,115,22,0.25);">安全重启</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>角色</th>
            <th>最近登录</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.last }}</td>
            <td><span class="badge" :class="user.status === '启用' ? 'tag-green' : 'tag-orange'">{{ user.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="flex-between">
        <h2>运行配置快照</h2>
        <small>关键参数趋势</small>
      </div>
      <div class="snapshot-grid">
        <div v-for="snap in snapshots" :key="snap.name" class="snapshot">
          <div class="flex-between">
            <div>
              <div class="highlight">{{ snap.value }}</div>
              <small>{{ snap.name }}</small>
            </div>
            <span class="badge" :class="snap.tag === '高' ? 'tag-orange' : 'tag-green'">{{ snap.tag }}</span>
          </div>
          <div class="progress" style="margin-top:8px;">
            <div class="progress-bar" :style="{ width: snap.ratio + '%'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BaseModal :show="showModal === 'user'" title="新增账号" @close="closeModal">
    <p>设置账户信息与角色，创建后可立刻登陆。</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(180px,1fr));gap:12px;">
      <div>
        <label>名称</label>
        <input v-model="userForm.name" />
      </div>
      <div>
        <label>角色</label>
        <select v-model="userForm.role">
          <option>管理员</option>
          <option>工艺工程师</option>
          <option>维护工程师</option>
        </select>
      </div>
      <div>
        <label>联系电话</label>
        <input v-model="userForm.phone" />
      </div>
    </div>
    <template #footer>
      <button @click="saveUser">创建账号</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'backup'" title="同步备份" @close="closeModal">
    <p>正在把控制策略、日志与参数快照推送到备份节点。</p>
    <div class="progress" style="margin:12px 0;">
      <div class="progress-bar" :style="{ width: backupProgress + '%' }"></div>
    </div>
    <template #footer>
      <button @click="startBackup" :disabled="backupProgress < 100" style="background:var(--secondary);box-shadow:none;">重新同步</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'restart'" title="安全重启" @close="closeModal">
    <p>将执行滚动重启，确保控制线程与调度线程平滑切换。</p>
    <template #footer>
      <button @click="closeModal" style="background:#e2e8f0;color:#0f172a;box-shadow:none;">取消</button>
      <button @click="confirmRestart" style="background:var(--accent);">确认重启</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showModal = ref('')
const backupProgress = ref(70)

const users = ref([
  { name: '李程', role: '管理员', last: '09:12', status: '启用' },
  { name: '陈诺', role: '工艺工程师', last: '09:45', status: '启用' },
  { name: '王源', role: '维护工程师', last: '08:58', status: '启用' },
  { name: '刘玥', role: '工艺工程师', last: '09:30', status: '停用' },
  { name: '周格', role: '管理员', last: '07:18', status: '启用' }
])

const snapshots = ref([
  { name: '控制周期(ms)', value: '4', ratio: 92, tag: '低' },
  { name: '调度排队(ms)', value: '18', ratio: 66, tag: '低' },
  { name: '网络时延(ms)', value: '22', ratio: 78, tag: '高' },
  { name: '传感采样率(Hz)', value: '500', ratio: 84, tag: '低' }
])

const userForm = ref({
  name: '新工程师',
  role: '工艺工程师',
  phone: '138xxxx8820'
})

const openModal = (key) => {
  showModal.value = key
  if (key === 'backup') startBackup()
}

const closeModal = () => {
  showModal.value = ''
}

const saveUser = () => {
  alert(`账号 ${userForm.value.name} (${userForm.value.role}) 已创建，联系电话 ${userForm.value.phone}`)
  closeModal()
}

const startBackup = () => {
  backupProgress.value = 0
  const timer = setInterval(() => {
    backupProgress.value += 16
    if (backupProgress.value >= 100) {
      backupProgress.value = 100
      clearInterval(timer)
    }
  }, 380)
}

const confirmRestart = () => {
  alert('重启计划已提交，组件将分批重启并保持任务状态。')
  closeModal()
}
</script>

<style scoped>
.snapshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.snapshot {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
}
</style>

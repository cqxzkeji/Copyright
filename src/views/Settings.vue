<template>
  <section class="grid" style="gap: 18px">
    <div class="flex-between">
      <div>
        <p class="badge">系统</p>
        <h3 style="margin: 4px 0">系统设置与用户配置</h3>
      </div>
      <div style="display: flex; gap: 8px">
        <button class="secondary-btn" @click="openPreference">更新偏好</button>
        <button class="primary-btn" @click="openSync">同步配置</button>
        <button class="secondary-btn" @click="openReset">恢复默认</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">配置覆盖率</h4>
        <span class="tag">实时</span>
      </div>
      <div class="chart-bars">
        <div v-for="item in coverageChart" :key="item.label" class="chart-bar">
          <div class="flex-between">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}%</strong>
          </div>
          <div class="bar" :style="{ width: item.value + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">用户与角色表</h4>
        <span class="badge">10条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>最近登录</th>
            <th>安全级别</th>
            <th>状态</th>
            <th>通知</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in userRows" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.role }}</td>
            <td>{{ row.last }}</td>
            <td>{{ row.level }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.notify }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      v-if="showPreference"
      title="更新界面偏好"
      badge="个性化"
      description="切换布局、语言与通知样式"
      @close="showPreference = false"
    >
      <div class="form-row two-col">
        <div>
          <label class="label">主题</label>
          <select v-model="pref.theme">
            <option>亮色</option>
            <option>暗色</option>
          </select>
        </div>
        <div>
          <label class="label">语言</label>
          <select v-model="pref.lang">
            <option>简体中文</option>
            <option>English</option>
          </select>
        </div>
        <div>
          <label class="label">通知方式</label>
          <select v-model="pref.notify">
            <option>站内信</option>
            <option>邮件</option>
            <option>短信</option>
          </select>
        </div>
        <div>
          <label class="label">默认模块</label>
          <select v-model="pref.defaultModule">
            <option>行为洞察</option>
            <option>推荐系统</option>
            <option>采集与处理</option>
            <option>统计分析</option>
          </select>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showPreference = false">取消</button>
        <button class="primary-btn" @click="savePreference">保存</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showSync"
      title="同步配置"
      badge="任务"
      description="同步配置到多数据中心"
      @close="stopSync"
    >
      <div class="progress-bar" style="margin: 12px 0">
        <span :style="{ width: syncProgress + '%' }"></span>
      </div>
      <p style="margin: 0">{{ syncProgress < 100 ? '同步中…' : '同步完成' }}</p>
      <div style="display: flex; justify-content: flex-end; margin-top: 14px">
        <button class="primary-btn" @click="stopSync">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showReset"
      title="恢复默认配置"
      badge="提示"
      description="将清除自定义设置并恢复默认方案"
      @close="showReset = false"
    >
      <p>确认恢复默认配置吗？操作不可撤销。</p>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showReset = false">取消</button>
        <button class="primary-btn" @click="confirmReset">确认恢复</button>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const coverageChart = [
  { label: '认证配置', value: 96 },
  { label: '存储策略', value: 88 },
  { label: '告警订阅', value: 76 },
  { label: '路由策略', value: 69 },
  { label: '安全审计', value: 92 },
  { label: '访问控制', value: 84 }
]

const userRows = [
  { name: '张伟', role: '管理员', last: '2024-06-01 09:00', level: '高', status: '启用', notify: '邮件' },
  { name: '李静', role: '运营', last: '2024-06-01 08:40', level: '中', status: '启用', notify: '站内信' },
  { name: '王磊', role: '产品', last: '2024-06-01 08:30', level: '中', status: '启用', notify: '邮件' },
  { name: '赵敏', role: '分析师', last: '2024-06-01 08:20', level: '中', status: '启用', notify: '邮件' },
  { name: '陈刚', role: '数据工程', last: '2024-06-01 08:10', level: '高', status: '启用', notify: '短信' },
  { name: '周洋', role: '算法', last: '2024-06-01 08:00', level: '高', status: '启用', notify: '站内信' },
  { name: '钱程', role: '实习生', last: '2024-06-01 07:50', level: '低', status: '启用', notify: '邮件' },
  { name: '孙琳', role: '测试', last: '2024-06-01 07:40', level: '中', status: '启用', notify: '站内信' },
  { name: '周启', role: '安全', last: '2024-06-01 07:30', level: '高', status: '启用', notify: '邮件' },
  { name: '吴越', role: '客服', last: '2024-06-01 07:20', level: '低', status: '启用', notify: '站内信' }
]

const showPreference = ref(false)
const showSync = ref(false)
const showReset = ref(false)
const syncProgress = ref(30)
const pref = reactive({ theme: '亮色', lang: '简体中文', notify: '站内信', defaultModule: '行为洞察' })
let timer

const openPreference = () => (showPreference.value = true)
const savePreference = () => {
  showPreference.value = false
}

const openSync = () => {
  showSync.value = true
  syncProgress.value = 30
  timer = setInterval(() => {
    syncProgress.value = Math.min(100, syncProgress.value + 18)
    if (syncProgress.value === 100) clearInterval(timer)
  }, 500)
}

const stopSync = () => {
  showSync.value = false
  clearInterval(timer)
}

const openReset = () => (showReset.value = true)
const confirmReset = () => {
  showReset.value = false
}
</script>

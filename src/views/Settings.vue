<template>
  <div class="grid" style="grid-template-columns: 1fr 0.9fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>系统设置与用户管理</h3>
        <div class="chip-row">
          <button class="secondary" @click="showNewUser = true">新增用户</button>
          <button @click="showSync = true">同步到云</button>
          <button @click="showReset = true">批量重置密码</button>
        </div>
      </div>
      <p class="tooltip">配置角色权限、通知策略，所有按钮均有弹窗提示。</p>
      <div class="table-card">
        <div class="flex-between">
          <h4>用户列表</h4>
          <span class="badge">{{ users.length }} 人</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>姓名</th><th>角色</th><th>部门</th><th>状态</th><th>最近登录</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.name">
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.dept }}</td>
              <td>{{ user.status }}</td>
              <td>{{ user.last }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="flex-between">
        <h3>安全与偏好</h3>
        <button class="secondary" @click="showPreference = true">修改偏好</button>
      </div>
      <p class="tooltip">支持 SSO、审计日志、主题配置。</p>
      <ul>
        <li>SSO 状态：已启用（对接企业门户）</li>
        <li>审计日志：保留 180 天</li>
        <li>主题：亮色（可自适应布局）</li>
      </ul>
      <div class="table-card" style="margin-top: 12px;">
        <div class="flex-between">
          <h4>通知策略</h4>
          <button class="secondary" @click="showNotify = true">调整策略</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>场景</th><th>渠道</th><th>频率</th><th>负责人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in notices" :key="item.scene">
              <td>{{ item.scene }}</td>
              <td>{{ item.channel }}</td>
              <td>{{ item.rate }}</td>
              <td>{{ item.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showNewUser" title="新增用户" show-actions @confirm="showNewUser = false">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px;">
      <label>姓名 <input placeholder="如：李青" /></label>
      <label>角色 <select><option>管理员</option><option>审核人</option><option>设计工程师</option></select></label>
      <label>部门 <input placeholder="销售技术" /></label>
      <label>邮箱 <input type="email" placeholder="name@corp.com" /></label>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showSync" title="同步到云">
    <p class="tooltip">正在与云端配置中心同步...</p>
    <div class="progress" style="margin-top: 8px;"><div :style="{ width: syncProgress + '%' }"></div></div>
    <p>进度：{{ syncProgress }}%</p>
  </ModalDialog>

  <ModalDialog v-model="showReset" title="批量重置密码" show-actions @confirm="showReset = false">
    <p>确认将选中用户密码重置并邮件通知？</p>
  </ModalDialog>

  <ModalDialog v-model="showPreference" title="修改偏好" show-actions @confirm="showPreference = false">
    <label>默认主题 <select><option>亮色</option><option>暗色</option><option>跟随系统</option></select></label>
    <label style="margin-top: 8px;">语言 <select><option>简体中文</option><option>English</option></select></label>
  </ModalDialog>

  <ModalDialog v-model="showNotify" title="通知策略" show-actions @confirm="showNotify = false">
    <label>策略名称 <input placeholder="工艺变更提醒" /></label>
    <label style="margin-top: 8px;">渠道 <select><option>邮件</option><option>短信</option><option>飞书</option></select></label>
  </ModalDialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const users = [
  { name: '陈工', role: '管理员', dept: '销售技术', status: '启用', last: '06-01 09:12' },
  { name: '王璐', role: '审核人', dept: '质控', status: '启用', last: '06-02 11:43' },
  { name: '黄威', role: '设计工程师', dept: '研发', status: '启用', last: '06-02 10:21' },
  { name: '周勇', role: '审核人', dept: '制造', status: '启用', last: '06-03 08:50' },
  { name: '李静', role: '管理员', dept: '质控', status: '启用', last: '06-03 10:14' },
  { name: '林浩', role: '设计工程师', dept: '研发', status: '启用', last: '06-04 14:33' },
  { name: '陈鑫', role: '访客', dept: '销售', status: '停用', last: '05-28 15:18' },
  { name: '常远', role: '审核人', dept: '制造', status: '启用', last: '06-04 09:12' },
  { name: '郝星', role: '设计工程师', dept: '研发', status: '启用', last: '06-05 13:20' },
  { name: '周勇', role: '审核人', dept: '制造', status: '启用', last: '06-05 16:45' }
]

const notices = [
  { scene: '推导完成', channel: '站内信+邮件', rate: '实时', owner: '陈工' },
  { scene: '标准发布', channel: '邮件', rate: '立即', owner: '王璐' },
  { scene: '质量预警', channel: '短信+邮件', rate: '及时', owner: '李静' },
  { scene: '交付延期', channel: '飞书', rate: '实时', owner: '陈鑫' },
  { scene: '权限变更', channel: '邮件', rate: '每日', owner: '林浩' },
  { scene: '安全告警', channel: '短信', rate: '立即', owner: '周勇' },
  { scene: '模板更新', channel: '站内信', rate: '每周', owner: '黄威' },
  { scene: '参数漂移', channel: '邮件', rate: '及时', owner: '常远' },
  { scene: '交互反馈', channel: '站内信', rate: '每周', owner: '郝星' },
  { scene: '批量导出', channel: '邮件', rate: '实时', owner: '陈工' }
]

const showNewUser = ref(false)
const showSync = ref(false)
const showReset = ref(false)
const showPreference = ref(false)
const showNotify = ref(false)
const syncProgress = ref(30)
let syncTimer

onMounted(() => {
  syncTimer = setInterval(() => {
    if (showSync.value) {
      syncProgress.value = Math.min(100, syncProgress.value + 14)
      if (syncProgress.value === 100) {
        showSync.value = false
      }
    }
  }, 550)
})

onUnmounted(() => clearInterval(syncTimer))
</script>

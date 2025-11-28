<template>
  <div class="panel-grid">
    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">系统</p>
          <h3>用户与权限</h3>
        </div>
        <div class="chip ghost">安全</div>
      </header>
      <table class="data-table">
        <thead>
          <tr><th>用户</th><th>角色</th><th>最近登录</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.last }}</td>
            <td><span class="tag" :class="user.status">{{ user.status }}</span></td>
            <td><button class="ghost" @click="openUser(user)">编辑</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">数据</p>
          <h3>备份与日志</h3>
        </div>
        <div class="chip">自动</div>
      </header>
      <div class="buttons">
        <button @click="openProgress('执行全量备份', 70)">立即备份</button>
        <button class="ghost" @click="showLog = true">查看日志</button>
      </div>
      <ul class="muted">
        <li>最近备份：今日 09:20</li>
        <li>自动策略：每日 02:00 增量，保留 14 天</li>
        <li>日志位置：/var/logs/arm-control</li>
      </ul>
    </div>
  </div>

  <ModalDialog :show="showUser" title="编辑用户" primary-text="保存" @close="showUser = false" @confirm="saveUser">
    <form class="form">
      <label>用户<input v-model="userForm.name" /></label>
      <label>角色<select v-model="userForm.role"><option>管理员</option><option>操作员</option><option>观察员</option></select></label>
      <label>状态<select v-model="userForm.status"><option>启用</option><option>禁用</option></select></label>
    </form>
  </ModalDialog>

  <ModalDialog :show="showLog" title="系统日志" primary-text="关闭" @close="showLog = false" @confirm="showLog = false">
    <p class="muted">最近 30 条系统事件已保存，可导出 CSV。</p>
    <div class="log-box">
      <div v-for="(log, index) in logs" :key="index" class="log-line">{{ log }}</div>
    </div>
  </ModalDialog>

  <ModalDialog :show="progress.show" :title="progress.title" :show-footer="false" @close="progress.show = false">
    <p class="muted">后台处理中…</p>
    <div class="progress"><div class="progress__bar" :style="{ width: progress.value + '%' }"></div></div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const users = reactive([
  { name: '陈杰', role: '管理员', last: '09:52', status: '启用' },
  { name: '王立', role: '操作员', last: '09:31', status: '启用' },
  { name: '李珊', role: '观察员', last: '08:55', status: '启用' },
  { name: '系统巡检', role: '系统', last: '自动', status: '启用' },
  { name: '张敏', role: '操作员', last: '07:33', status: '禁用' }
])

const logs = [
  '[09:58] 同步主控参数完成',
  '[09:50] 备份任务成功上传至 NAS',
  '[09:30] 登录成功：operator',
  '[09:12] 清理历史日志 12 条',
  '[08:55] 校准配置被应用到线体A',
  '[08:30] 巡检脚本生成完毕'
]

const showUser = ref(false)
const showLog = ref(false)
const progress = reactive({ show: false, title: '执行中', value: 0 })
const userForm = reactive({ name: '陈杰', role: '管理员', status: '启用' })

const openProgress = (title, value) => {
  progress.title = title
  progress.value = value
  progress.show = true
  setTimeout(() => (progress.value = 100), 500)
}

const openUser = (user) => {
  Object.assign(userForm, user)
  showUser.value = true
}

const saveUser = () => {
  const target = users.find((u) => u.name === userForm.name)
  if (target) {
    Object.assign(target, userForm)
  }
  showUser.value = false
  openProgress('用户已更新', 64)
}
</script>

<style scoped>
.panel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
.card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 14px; }
.card__header { display: flex; justify-content: space-between; align-items: center; }
.eyebrow { color: var(--primary); font-weight: 700; letter-spacing: 0.06em; }
.chip { padding: 6px 10px; border-radius: 10px; background: #eaf7ff; color: #2d9cdb; font-weight: 700; }
.chip.ghost { background: #f1f4f9; color: #4a5568; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { border-bottom: 1px solid var(--border); padding: 10px 8px; text-align: left; }
.data-table tbody tr:hover { background: #f9fbff; }
.buttons { display: flex; gap: 10px; flex-wrap: wrap; }
.buttons button { border: none; border-radius: 12px; padding: 10px 12px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, var(--primary), var(--primary-strong)); color: #fff; }
.buttons .ghost { background: #eef2f7; color: #1b2a3c; border: 1px solid var(--border); }
.tag { padding: 4px 8px; border-radius: 10px; font-weight: 700; }
.tag.启用 { background: #e5f7f0; color: #1b7f51; }
.tag.禁用 { background: #ffe6e1; color: #b23c2a; }
.form { display: flex; flex-direction: column; gap: 10px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #1b2a3c; }
.form input, .form select { border: 1px solid var(--border); border-radius: 10px; padding: 10px; }
.log-box { background: #f9fbff; border: 1px solid var(--border); border-radius: 10px; padding: 10px; max-height: 240px; overflow: auto; }
.log-line { padding: 6px 0; border-bottom: 1px dashed var(--border); font-family: 'SFMono-Regular', monospace; }
.progress { height: 12px; border-radius: 12px; background: #eef2f7; overflow: hidden; }
.progress__bar { height: 100%; background: linear-gradient(135deg, var(--primary), var(--success)); transition: width 0.6s ease; }
.muted { color: var(--muted); }
</style>

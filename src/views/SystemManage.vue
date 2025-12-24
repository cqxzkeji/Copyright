<template>
  <div class="surface">
    <div class="topbar" style="margin-bottom:10px;">
      <div class="badge">系统管理追溯</div>
      <div class="actions">
        <button @click="openUser = true">新增用户</button>
        <button class="secondary" @click="openBackup = true">执行备份</button>
        <button class="secondary" @click="openLog = true">追溯日志</button>
      </div>
    </div>
    <div class="stat-grid" style="margin-bottom:12px;">
      <div class="stat-card" v-for="stat in sysCards" :key="stat.label">
        <div style="color:var(--muted);">{{ stat.label }}</div>
        <h2 style="margin:6px 0;">{{ stat.value }}</h2>
        <div class="progress-bar"><div class="progress-inner" :style="{ width: stat.percent + '%' }"></div></div>
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>操作人</th>
            <th>动作</th>
            <th>模块</th>
            <th>结果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in logs" :key="item.time + item.action">
            <td>{{ item.time }}</td>
            <td>{{ item.user }}</td>
            <td>{{ item.action }}</td>
            <td>{{ item.module }}</td>
            <td><span class="badge">{{ item.result }}</span></td>
            <td class="actions">
              <button class="ghost" @click="openLog = true">查看</button>
              <button class="secondary" @click="openTrace(item)">追溯</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="openUser">
    <template #title>新增用户</template>
    <div class="form-grid">
      <label>姓名<input v-model="userForm.name" placeholder="管理员" /></label>
      <label>角色<select v-model="userForm.role"><option>管理员</option><option>质检员</option><option>班组长</option></select></label>
      <label>手机号<input v-model="userForm.phone" placeholder="188****" /></label>
      <label>邮箱<input v-model="userForm.email" placeholder="mail@site.com" /></label>
    </div>
    <div class="actions" style="justify-content:flex-end; margin-top:12px;">
      <button class="secondary" @click="openUser=false">保存</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openBackup">
    <template #title>系统备份</template>
    <p>正在打包数据库与日志…</p>
    <div class="progress-bar"><div class="progress-inner" :style="{ width: backupProgress + '%' }"></div></div>
    <div class="actions" style="margin-top:10px; justify-content:flex-end;">
      <button @click="backupProgress = 100">立即完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openLog">
    <template #title>日志追溯</template>
    <ul style="color:var(--muted); padding-left:18px;">
      <li v-for="trace in traceList" :key="trace">{{ trace }}</li>
    </ul>
    <div class="actions" style="justify-content:flex-end;">
      <button @click="openLog=false">关闭</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openTraceModal">
    <template #title>追溯详情</template>
    <p>动作：{{ currentTrace.action }}</p>
    <p>对象：{{ currentTrace.module }}</p>
    <p style="color:var(--muted);">系统将记录追溯链路并上传。</p>
    <div class="actions" style="justify-content:flex-end;">
      <button @click="openTraceModal=false">关闭</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const openUser = ref(false)
const openBackup = ref(false)
const openLog = ref(false)
const openTraceModal = ref(false)
const backupProgress = ref(45)
const userForm = reactive({ name: '', role: '管理员', phone: '', email: '' })
const currentTrace = reactive({ action: '', module: '' })

const sysCards = [
  { label: '在线用户', value: '18', percent: 72 },
  { label: '审计日志', value: '2,340', percent: 88 },
  { label: '追溯记录', value: '680', percent: 64 },
  { label: '备份成功率', value: '99.2%', percent: 99 },
]

const logs = Array.from({ length: 20 }).map((_, idx) => ({
  time: `05-${(idx + 1).toString().padStart(2, '0')} 14:${(20 + idx).toString().padStart(2, '0')}`,
  user: ['管理员A', '系统', '班组长', '质检员'][idx % 4],
  action: idx % 3 === 0 ? '角色调整' : idx % 3 === 1 ? '数据追溯' : '备份校验',
  module: idx % 2 === 0 ? '标识管理' : '采集记录',
  result: idx % 4 === 0 ? '成功' : '已记录',
}))

const traceList = [
  '05-01 14:20 质检员提交异常追溯',
  '05-02 14:32 系统完成备份校验',
  '05-03 14:51 班组长调整采集人',
  '05-04 15:10 管理员导出核验日志',
]

const openTrace = (item) => {
  currentTrace.action = item.action
  currentTrace.module = item.module
  openTraceModal.value = true
}
</script>

<template>
  <div class="card-grid">
    <section class="card">
      <h2>系统设置</h2>
      <p>配置训练中心信息与基础参数。</p>
      <div class="form-grid" style="margin-top: 12px;">
        <label>
          训练中心名称
          <input v-model="settings.center" />
        </label>
        <label>
          设备维护周期
          <input v-model="settings.maintenance" />
        </label>
        <label>
          数据备份频率
          <input v-model="settings.backup" />
        </label>
      </div>
      <div class="button-group" style="margin-top: 14px;">
        <button class="primary-button" type="button" @click="openModal('save')">保存设置</button>
        <button class="secondary-button" type="button" @click="openModal('security')">安全策略</button>
        <button class="secondary-button" type="button" @click="openModal('tip')">系统提示</button>
      </div>
    </section>
    <section class="card">
      <h2>账户角色配置</h2>
      <p>管理教练、学员与管理员的角色权限。</p>
      <ul>
        <li v-for="role in roles" :key="role.name">
          {{ role.name }} - {{ role.permission }} <span class="badge">{{ role.status }}</span>
        </li>
      </ul>
    </section>
  </div>
  <BaseModal :open="modal.open" :title="modal.title" @close="closeModal" @confirm="confirmModal">
    <div v-if="modal.type === 'save'">
      <p>确认保存系统设置，并同步到所有训练终端。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 76%"></span></div>
      <small>同步进度 76%</small>
    </div>
    <div v-else-if="modal.type === 'security'">
      <p>配置安全策略与访问权限。</p>
      <div class="form-grid">
        <label>
          登录超时
          <input v-model="form.timeout" />
        </label>
        <label>
          数据脱敏级别
          <select v-model="form.level">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </label>
      </div>
    </div>
    <div v-else>
      <p>建议每周检查设备日志，确保系统稳定运行。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 100%"></span></div>
      <small>系统提示已更新</small>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const settings = reactive({
  center: '智能动捕训练中心',
  maintenance: '每 30 天游检',
  backup: '每日 22:00 自动备份'
})

const roles = [
  { name: '管理员', permission: '全权限配置', status: '启用' },
  { name: '教练', permission: '训练管理', status: '启用' },
  { name: '学员', permission: '训练执行', status: '启用' }
]

const form = reactive({
  timeout: '30 分钟',
  level: 'medium'
})

const modal = reactive({
  open: false,
  title: '',
  type: 'save'
})

const openModal = (type) => {
  modal.open = true
  modal.type = type
  const titles = {
    save: '保存设置',
    security: '安全策略',
    tip: '系统提示'
  }
  modal.title = titles[type] || '提示'
}

const closeModal = () => {
  modal.open = false
}

const confirmModal = () => {
  modal.open = false
}
</script>

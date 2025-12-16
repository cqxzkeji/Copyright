<template>
  <section class="grid" style="gap: 16px;">
    <div class="card" style="padding: 16px; display: grid; gap: 12px;">
      <div class="topbar">
        <div>
          <h3 style="font-size: 18px;">系统配置与权限管理</h3>
          <p style="color: var(--muted); font-size: 14px;">管理用户、角色与审计。按钮均弹窗表单或提示。</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button @click="openModal('user')">新增用户</button>
          <button style="background: #22c55e;" @click="openModal('role')">调整角色</button>
          <button style="background: #eab308;" @click="openModal('audit')">导出审计</button>
        </div>
      </div>
      <div style="display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <div class="card" style="padding: 12px;">
          <div class="label">账号总数</div>
          <div style="font-size: 22px; font-weight: 700;">{{ users.length }}</div>
          <p style="color: var(--muted); font-size: 13px;">包含 admin/analyst/ops</p>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">权限策略</div>
          <div style="font-size: 22px; font-weight: 700;">12 条</div>
          <p style="color: var(--muted); font-size: 13px;">已同步至策略中心</p>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">最近审计</div>
          <div style="font-size: 22px; font-weight: 700;">2024-06-05</div>
          <p style="color: var(--muted); font-size: 13px;">审计按钮弹窗进度</p>
        </div>
      </div>
    </div>

    <DataTable
      title="用户与权限"
      subtitle="展示账户状态，按钮弹窗编辑"
      :columns="columns"
      :rows="users"
    >
      <template #cell-status="{ value }">
        <span class="badge" :class="value === '启用' ? 'success' : 'danger'">{{ value }}</span>
      </template>
      <template #actions>
        <button style="background: #e2e8f0; color: #0f172a;" @click="openModal('reset')">重置密码</button>
      </template>
    </DataTable>
  </section>

  <ModalDialog v-model="visible" :title="modalTitle" @confirm="confirmAction">
    <div v-if="activeAction === 'user' || activeAction === 'role'" class="grid" style="gap: 10px;">
      <label class="grid">
        <span class="label">用户名</span>
        <input class="input" v-model="form.username" placeholder="输入用户名" />
      </label>
      <label class="grid">
        <span class="label">角色</span>
        <select class="select" v-model="form.role">
          <option value="admin">管理员</option>
          <option value="analyst">分析员</option>
          <option value="ops">运营</option>
          <option value="viewer">只读</option>
        </select>
      </label>
    </div>
    <div v-else class="grid" style="gap: 10px;">
      <p style="color: var(--muted);">{{ modalTip }}</p>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div style="color: var(--muted);">进度：{{ progress }}%</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import DataTable from '../components/DataTable.vue';
import ModalDialog from '../components/ModalDialog.vue';
import { systemUsers } from '../services/mockData.js';
import { randomPercent } from '../utils/format.js';

const users = reactive([...systemUsers]);

const columns = [
  { key: 'name', label: '用户名' },
  { key: 'role', label: '角色' },
  { key: 'status', label: '状态' },
  { key: 'lastActive', label: '最近活跃' }
];

const visible = ref(false);
const activeAction = ref('');
const progress = ref(0);
const form = reactive({ username: '', role: 'viewer' });

const modalTitle = computed(() => {
  const map = { user: '新增用户', role: '调整角色', audit: '导出审计', reset: '重置密码' };
  return map[activeAction.value] || '操作';
});

const modalTip = computed(() => {
  const tips = {
    audit: '正在导出审计日志，完成后可下载。',
    reset: '正在重置密码并发送通知邮件。'
  };
  return tips[activeAction.value] || '确认执行操作';
});

const openModal = (action) => {
  activeAction.value = action;
  progress.value = randomPercent();
  visible.value = true;
};

const confirmAction = () => {
  progress.value = 100;
  setTimeout(() => (visible.value = false), 600);
};
</script>

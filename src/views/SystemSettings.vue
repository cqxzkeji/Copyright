<template>
  <div class="card" style="display: grid; gap: 14px;">
    <header style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">系统设置与用户管理</h3>
        <p class="muted" style="margin: 4px 0 0;">管理权限、偏好与安全策略，操作按钮均有弹窗</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="primary-btn" @click="showUser = true">新增用户</button>
        <button class="secondary-btn" @click="showPreference = true">界面偏好</button>
      </div>
    </header>
    <table class="table">
      <thead>
        <tr>
          <th>用户</th>
          <th>角色</th>
          <th>双因子</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.mfa }}</td>
          <td>{{ user.state }}</td>
        </tr>
      </tbody>
    </table>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      <div class="stat">
        <small>安全策略</small>
        <strong>启用</strong>
        <button class="secondary-btn" @click="showPolicy = true">查看</button>
      </div>
      <div class="stat">
        <small>数据备份</small>
        <strong>每日 02:00</strong>
        <button class="secondary-btn" @click="showBackup = true">配置</button>
      </div>
      <div class="stat">
        <small>主题</small>
        <strong>亮色</strong>
        <button class="secondary-btn" @click="showPreference = true">调整</button>
      </div>
    </div>

    <div v-if="showUser" class="modal-backdrop" @click.self="showUser = false">
      <div class="modal-card">
        <h3>新增用户</h3>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
          <label class="field">
            <span>姓名</span>
            <input v-model="form.name" placeholder="输入姓名" />
          </label>
          <label class="field">
            <span>角色</span>
            <select v-model="form.role">
              <option>管理员</option>
              <option>工程师</option>
              <option>操作员</option>
            </select>
          </label>
          <label class="field">
            <span>开启双因子</span>
            <select v-model="form.mfa">
              <option>是</option>
              <option>否</option>
            </select>
          </label>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="secondary-btn" @click="showUser = false">取消</button>
          <button class="primary-btn" @click="addUser">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showPreference" class="modal-backdrop" @click.self="showPreference = false">
      <div class="modal-card">
        <h3>界面偏好</h3>
        <p class="muted">已启用亮色主题，自适应布局根据屏幕宽度自动调整。</p>
        <button class="secondary-btn" @click="showPreference = false">关闭</button>
      </div>
    </div>

    <div v-if="showPolicy" class="modal-backdrop" @click.self="showPolicy = false">
      <div class="modal-card">
        <h3>安全策略</h3>
        <p class="muted">密码复杂度、操作留痕与角色分离均已启用。</p>
        <button class="secondary-btn" @click="showPolicy = false">明白</button>
      </div>
    </div>

    <div v-if="showBackup" class="modal-backdrop" @click.self="showBackup = false">
      <div class="modal-card">
        <h3>备份配置</h3>
        <p class="muted">正在准备备份计划，请在进度完成后核对日志。</p>
        <div class="progress" style="margin-top: 10px;">
          <span :style="{ width: backupProgress + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const users = ref([
  { name: '刘工', role: '管理员', mfa: '是', state: '启用' },
  { name: '张工', role: '工程师', mfa: '是', state: '启用' },
  { name: '王技师', role: '操作员', mfa: '否', state: '启用' },
  { name: '陈技师', role: '操作员', mfa: '是', state: '锁定' },
  { name: '赵工', role: '工程师', mfa: '是', state: '启用' }
]);

const showUser = ref(false);
const showPreference = ref(false);
const showPolicy = ref(false);
const showBackup = ref(false);
const backupProgress = ref(75);
const form = reactive({ name: '', role: '工程师', mfa: '是' });

const addUser = () => {
  users.value.push({ name: form.name || '新用户', role: form.role, mfa: form.mfa, state: '启用' });
  showUser.value = false;
};
</script>

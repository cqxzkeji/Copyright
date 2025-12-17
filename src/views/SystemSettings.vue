<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <h2 class="header-title">权限管理</h2>
      <p class="subtle">角色与功能授权</p>
      <ul>
        <li v-for="role in roles" :key="role.name">
          {{ role.name }} - {{ role.modules.join('、') }}
          <button class="button secondary" style="margin-left: 8px;" @click="editRole(role)">配置</button>
        </li>
      </ul>
      <button class="button" style="margin-top: 10px;" @click="openModal('add')">新增角色</button>
    </div>
    <div class="card">
      <h2 class="header-title">系统配置</h2>
      <p class="subtle">通知、数据、样式</p>
      <div class="form-group">
        <label>通知渠道</label>
        <select v-model="settings.notice">
          <option>邮件</option>
          <option>企业微信</option>
          <option>短信</option>
        </select>
      </div>
      <div class="form-group">
        <label>数据保留天数</label>
        <input v-model="settings.retention" type="number" />
      </div>
      <div class="form-group">
        <label>界面主题</label>
        <select v-model="settings.theme">
          <option>亮色</option>
          <option>暗色</option>
        </select>
      </div>
      <button class="button" @click="openModal('save')">保存配置</button>
    </div>
  </div>

  <div v-if="modal === 'add'" class="modal-backdrop">
    <div class="modal">
      <h3>新增角色</h3>
      <form @submit.prevent="addRole">
        <div class="form-group">
          <label>角色名称</label>
          <input v-model="form.name" required />
        </div>
        <div class="form-group">
          <label>授权模块</label>
          <textarea v-model="form.modules" rows="2" placeholder="用顿号分隔" required></textarea>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button class="button secondary" type="button" @click="closeModal">取消</button>
          <button class="button" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modal === 'edit'" class="modal-backdrop">
    <div class="modal">
      <h3>配置角色</h3>
      <p class="subtle">{{ current?.name }}</p>
      <div class="form-group">
        <label>模块</label>
        <textarea v-model="currentText" rows="3"></textarea>
      </div>
      <div class="progress-bar" style="margin: 12px 0;">
        <div class="progress-bar__value" style="width: 70%"></div>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="applyEdit">应用</button>
      </div>
    </div>
  </div>

  <div v-if="modal === 'save'" class="modal-backdrop">
    <div class="modal">
      <h3>保存系统配置</h3>
      <p>通知渠道：{{ settings.notice }}</p>
      <p>数据保留：{{ settings.retention }}天</p>
      <p>界面主题：{{ settings.theme }}</p>
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="closeModal">确认保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const roles = reactive([
  { name: '项目经理', modules: ['任务', '记录', '标准', '统计', '配置'] },
  { name: '监理', modules: ['任务', '记录', '标准'] },
  { name: '专业工程师', modules: ['任务', '记录'] },
  { name: '资料员', modules: ['标准', '统计'] }
]);

const settings = reactive({ notice: '企业微信', retention: 180, theme: '亮色' });
const modal = ref('');
const form = reactive({ name: '', modules: '' });
const current = ref(null);
const currentText = ref('');

const openModal = (type) => {
  modal.value = type;
};

const closeModal = () => {
  modal.value = '';
};

const addRole = () => {
  roles.push({ name: form.name, modules: form.modules.split('、') });
  Object.assign(form, { name: '', modules: '' });
  closeModal();
};

const editRole = (role) => {
  current.value = role;
  currentText.value = role.modules.join('、');
  modal.value = 'edit';
};

const applyEdit = () => {
  if (current.value) {
    current.value.modules = currentText.value.split('、');
  }
  closeModal();
};
</script>

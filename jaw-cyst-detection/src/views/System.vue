<template>
  <div class="card">
    <div class="section-title">系统管理与维护</div>
    <p class="muted">统一管理用户权限、模型版本与数据维护任务，确保系统安全与可追踪。</p>
    <div class="toolbar">
      <button @click="showUser = true">新增用户</button>
      <button @click="showRole = true">修改权限</button>
      <button @click="showModel = true">同步模型</button>
      <button @click="showClean = true">清理缓存</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>用户名</th>
          <th>角色</th>
          <th>上次登录</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.last }}</td>
          <td>{{ user.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showUser" title="新增用户" confirm-text="创建账户" @confirm="createUser">
    <label>用户名
      <input v-model="userForm.name" placeholder="engineer01" />
    </label>
    <label>角色
      <select v-model="userForm.role">
        <option>管理员</option>
        <option>标注员</option>
        <option>审核员</option>
      </select>
    </label>
  </BaseModal>

  <BaseModal v-model="showRole" title="修改权限" confirm-text="保存权限" @confirm="saveRole">
    <label>选择用户
      <select v-model="roleForm.name">
        <option v-for="user in users" :key="user.name">{{ user.name }}</option>
      </select>
    </label>
    <label>权限范围
      <textarea rows="3" v-model="roleForm.scope" placeholder="上传、训练、审核"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="showModel" title="同步模型" confirm-text="开始同步" @confirm="syncModel">
    <p>将在线仓库的 YOLOv5 最新囊肿模型同步到本地推理服务。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: modelProgress + '%' }"></div>
    </div>
    <p class="muted">{{ modelProgress }}% 已下载</p>
  </BaseModal>

  <BaseModal v-model="showClean" title="缓存清理" confirm-text="执行清理" @confirm="clean">
    <p>清理训练缓存、日志与过期推理结果，释放磁盘空间。</p>
    <p class="muted">当前可释放 3.2 GB</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const users = reactive([
  { name: 'admin', role: '管理员', last: '2024-05-01', status: '启用' },
  { name: 'tech01', role: '工程师', last: '2024-04-29', status: '启用' },
  { name: 'auditor', role: '审核员', last: '2024-04-28', status: '启用' },
  { name: 'label01', role: '标注员', last: '2024-04-26', status: '启用' }
]);

const showUser = ref(false);
const showRole = ref(false);
const showModel = ref(false);
const showClean = ref(false);
const modelProgress = ref(0);
let timer;

const userForm = reactive({ name: '', role: '管理员' });
const roleForm = reactive({ name: 'admin', scope: '上传、训练、审核' });

const createUser = () => {
  users.push({ name: userForm.name, role: userForm.role, last: '刚刚', status: '启用' });
  showUser.value = false;
  alert('用户已创建');
};

const saveRole = () => {
  showRole.value = false;
  alert(`已为 ${roleForm.name} 保存权限`);
};

const syncModel = () => {
  showModel.value = true;
  modelProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    modelProgress.value = Math.min(100, modelProgress.value + 20);
    if (modelProgress.value >= 100) clearInterval(timer);
  }, 500);
};

const clean = () => {
  showClean.value = false;
  alert('缓存与日志清理完成');
};
</script>

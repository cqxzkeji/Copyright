<template>
  <div class="module-layout">
    <section class="section-card">
      <header class="module-header">
        <div>
          <h3>用户接入概览</h3>
          <p>实时掌握每类游客的入驻情况</p>
        </div>
        <button @click="showAdd = true">新增游客</button>
      </header>
      <div class="flat-chart">
        <div v-for="segment in segments" :key="segment.label" class="flat-chart-bar" :style="{ height: segment.value + '%' }">
          <span>{{ segment.label }}</span>
        </div>
      </div>
    </section>

    <section class="section-card">
      <header class="module-header">
        <h3>当前在线游客</h3>
        <small style="color:#94a3b8;">点击行内操作按钮触发弹窗提醒</small>
      </header>
      <div class="user-table">
        <div class="user-row user-head">
          <span>昵称</span>
          <span>类型</span>
          <span>状态</span>
          <span>互动积分</span>
          <span>操作</span>
        </div>
        <div class="user-row" v-for="user in users" :key="user.id">
          <span>{{ user.name }}</span>
          <span>{{ user.role }}</span>
          <span><span class="tag">{{ user.status }}</span></span>
          <span>{{ user.points }}</span>
          <span style="display:flex;gap:0.4rem;">
            <button @click="openReset(user)" style="background:#22c55e;">重置密码</button>
            <button @click="notify(user)" style="background:#0ea5e9;">推送提醒</button>
          </span>
        </div>
      </div>
    </section>

    <section class="section-card">
      <header class="module-header">
        <h3>权限方案</h3>
      </header>
      <div class="permission-grid">
        <article v-for="pkg in packages" :key="pkg.id" class="permission-card">
          <h4>{{ pkg.title }}</h4>
          <p>{{ pkg.desc }}</p>
          <ul>
            <li v-for="item in pkg.items" :key="item">{{ item }}</li>
          </ul>
          <button @click="selectPackage(pkg)">应用方案</button>
        </article>
      </div>
    </section>

    <BaseModal :open="showAdd" title="新增游客账号" @close="showAdd = false">
      <form class="form-grid" @submit.prevent="createUser">
        <label>
          昵称
          <input v-model="newUser.name" required />
        </label>
        <label>
          类型
          <select v-model="newUser.role">
            <option>体验团</option>
            <option>企业客户</option>
            <option>教育机构</option>
          </select>
        </label>
        <label>
          初始状态
          <input v-model="newUser.status" />
        </label>
        <label>
          互动积分
          <input type="number" v-model.number="newUser.points" />
        </label>
        <button type="submit">确认创建</button>
      </form>
    </BaseModal>

    <BaseModal :open="showReset" title="重置密码" @close="showReset = false">
      <p>确定为 {{ selectedUser?.name }} 重新分配登录密码？</p>
      <template #actions>
        <button style="background:#e2e8f0;color:#0f172a;" @click="showReset = false">取消</button>
        <button @click="confirmReset">确认</button>
      </template>
    </BaseModal>

    <BaseModal :open="showNotify" title="推送提醒" @close="showNotify = false">
      <p>{{ notifyMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const segments = [
  { label: '体验团', value: 80 },
  { label: '企业客户', value: 60 },
  { label: '教育合作', value: 45 },
  { label: '自由行', value: 70 }
];

const users = ref([
  { id: 1, name: '北极星', role: '体验团', status: '活跃', points: 3200 },
  { id: 2, name: '凌雪', role: '企业客户', status: '预热', points: 2100 },
  { id: 3, name: '雪峰', role: '教育机构', status: '沉浸学习', points: 2600 }
]);

const packages = [
  { id: 1, title: '沉浸体验包', desc: '开放全景场景与互动反馈。', items: ['访问全部场景', '触觉回传', 'AI 引导'] },
  { id: 2, title: '企业团建包', desc: '协作任务与实时看板。', items: ['多人语音', '任务分派', '实景看板'] },
  { id: 3, title: '教育研学包', desc: '教学脚本与成就评测。', items: ['课程模板', '过程录制', '知识问答'] }
];

const showAdd = ref(false);
const showReset = ref(false);
const showNotify = ref(false);
const selectedUser = ref(null);
const notifyMessage = ref('');
const newUser = reactive({ name: '', role: '体验团', status: '活跃', points: 1800 });

function createUser() {
  users.value.push({ id: Date.now(), ...newUser });
  showAdd.value = false;
  notifyMessage.value = `${newUser.name} 已创建，默认密码已通过短信发送。`;
  showNotify.value = true;
  newUser.name = '';
  newUser.status = '活跃';
  newUser.points = 1800;
}

function openReset(user) {
  selectedUser.value = user;
  showReset.value = true;
}

function confirmReset() {
  showReset.value = false;
  notifyMessage.value = `${selectedUser.value.name} 的密码已重置，需在10分钟内完成首次登录。`;
  showNotify.value = true;
}

function notify(user) {
  notifyMessage.value = `已向 ${user.name} 推送“集合进入冰川场景”的弹窗提醒。`;
  showNotify.value = true;
}

function selectPackage(pkg) {
  notifyMessage.value = `${pkg.title} 已应用至全局权限，生效时间 30 秒。`;
  showNotify.value = true;
}
</script>

<style scoped>
.module-layout {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-table {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.user-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  padding: 0.4rem 0.2rem;
  border-radius: 12px;
}

.user-head {
  font-weight: 600;
  color: #475569;
}

.user-row:not(.user-head) {
  background: #f8fafc;
}

.permission-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.permission-card {
  flex: 1 1 220px;
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.permission-card ul {
  padding-left: 1rem;
  margin: 0;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
</style>

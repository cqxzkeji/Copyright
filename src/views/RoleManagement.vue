<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <h2>权限控制与安全管理</h2>
        <div class="button-group">
          <button class="primary" type="button" @click="openAdd">新增角色</button>
          <button class="secondary" type="button" @click="openAudit">查看访问日志</button>
          <button class="secondary" type="button" @click="openSecurity">安全巡检</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>部门</th>
            <th>权限等级</th>
            <th>最近登录</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.level }}</td>
            <td>{{ user.lastLogin }}</td>
            <td>
              <button class="text" type="button" @click="openAssign(user)">分配权限</button>
              <button class="text" type="button" @click="openFreeze(user)">冻结</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>风险告警</h2>
        <button class="secondary" type="button" @click="openRisk">处理告警</button>
      </div>
      <ul>
        <li>检测到 2 次异常登录尝试。</li>
        <li>数据导出操作超过阈值，已触发审批。</li>
        <li>高权限账号 3 个月未更新密码。</li>
      </ul>
    </div>

    <BaseModal :open="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'form'">
        <div class="form-grid">
          <input v-model="form.name" placeholder="姓名" />
          <input v-model="form.department" placeholder="部门" />
          <select v-model="form.role">
            <option value="管理员">管理员</option>
            <option value="运营">运营</option>
            <option value="分析师">分析师</option>
            <option value="客服">客服</option>
          </select>
          <select v-model="form.level">
            <option value="一级">一级</option>
            <option value="二级">二级</option>
            <option value="三级">三级</option>
          </select>
        </div>
        <div class="button-group" style="justify-content: flex-end; margin-top: 16px;">
          <button class="secondary" type="button" @click="closeModal">取消</button>
          <button class="primary" type="button" @click="saveUser">保存</button>
        </div>
      </template>
      <template v-else>
        <p>{{ modalMessage }}</p>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="primary" type="button" @click="closeModal">完成</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const users = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `管理员-${index + 1}`,
    role: ['管理员', '运营', '分析师', '客服'][index % 4],
    department: ['华东区', '华南区', '华北区', '西南区'][index % 4],
    level: ['一级', '二级', '三级'][index % 3],
    lastLogin: `2024-0${(index % 9) + 1}-2${index % 8}`
  }))
);

const modalOpen = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref('');
const selected = ref(null);
const form = ref({
  name: '',
  department: '',
  role: '管理员',
  level: '一级'
});

const openAdd = () => {
  modalTitle.value = '新增角色/用户';
  modalType.value = 'form';
  form.value = {
    name: '',
    department: '',
    role: '管理员',
    level: '一级'
  };
  modalOpen.value = true;
};

const openAssign = (user) => {
  selected.value = user;
  modalTitle.value = '分配权限';
  modalMessage.value = `已为 ${user.name} 更新权限方案，包含客户管理与报表权限。`;
  modalType.value = '';
  modalOpen.value = true;
};

const openFreeze = (user) => {
  selected.value = user;
  modalTitle.value = '冻结账号';
  modalMessage.value = `账号 ${user.name} 已冻结，需主管审批后解冻。`;
  modalType.value = '';
  modalOpen.value = true;
};

const openAudit = () => {
  modalTitle.value = '访问日志';
  modalMessage.value = '今日共记录 128 条访问日志，已同步至安全审计中心。';
  modalType.value = '';
  modalOpen.value = true;
};

const openSecurity = () => {
  modalTitle.value = '安全巡检';
  modalMessage.value = '巡检完成：未发现高危漏洞，建议更新 2 项中风险配置。';
  modalType.value = '';
  modalOpen.value = true;
};

const openRisk = () => {
  modalTitle.value = '风险告警处理';
  modalMessage.value = '已发起异常登录复核流程，并推送短信通知责任人。';
  modalType.value = '';
  modalOpen.value = true;
};

const saveUser = () => {
  const nextId = Math.max(...users.value.map((item) => item.id)) + 1;
  users.value.unshift({
    id: nextId,
    name: form.value.name || `新用户-${nextId}`,
    role: form.value.role,
    department: form.value.department || '总部',
    level: form.value.level,
    lastLogin: '未登录'
  });
  modalOpen.value = false;
};

const closeModal = () => {
  modalOpen.value = false;
};
</script>

<style scoped>
ul {
  margin: 0;
  padding-left: 18px;
  color: #52607a;
  line-height: 1.8;
}
</style>

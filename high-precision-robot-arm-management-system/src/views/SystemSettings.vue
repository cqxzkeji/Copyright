<template>
  <div class="grid cols-2">
    <div class="card">
      <h3>用户与权限</h3>
      <table class="table">
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.state }}</td>
          </tr>
        </tbody>
      </table>
      <div class="actions">
        <button class="btn" @click="showUserModal = true">新增用户</button>
        <button class="btn secondary" @click="showTip('权限同步', '已同步云端策略与本地白名单。')">
          同步策略
        </button>
      </div>
    </div>
    <div class="card">
      <h3>网络与安全</h3>
      <ul class="muted">
        <li>VPN 通道：加密 · 稳定</li>
        <li>防火墙：工业协议白名单</li>
        <li>固件版本：v2.3.1</li>
      </ul>
      <button class="btn" @click="showTip('安全巡检', '安全规则已覆盖 EtherCAT 与 CAN 总线。')">
        安全巡检
      </button>
    </div>
  </div>

  <div v-if="showUserModal" class="modal-backdrop" @click.self="showUserModal = false">
    <div class="modal-panel">
      <h3>新增用户</h3>
      <div class="grid">
        <label class="form-group">
          <span>用户名</span>
          <input v-model="userForm.name" placeholder="工程师名称" />
        </label>
        <label class="form-group">
          <span>角色</span>
          <select v-model="userForm.role">
            <option>管理员</option>
            <option>调试员</option>
            <option>访客</option>
          </select>
        </label>
      </div>
      <div class="footer">
        <button class="btn" @click="addUser">保存</button>
      </div>
    </div>
  </div>

  <div v-if="tip" class="modal-backdrop" @click.self="tip = null">
    <div class="modal-panel">
      <h3>{{ tip.title }}</h3>
      <p>{{ tip.body }}</p>
      <div class="footer">
        <button class="btn secondary" @click="tip = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const users = reactive([
  { name: 'arm-admin', role: '管理员', state: '在线' },
  { name: 'safety', role: '安全官', state: '在线' },
  { name: 'planner', role: '调度', state: '离线' },
  { name: 'qa', role: 'QA', state: '在线' },
  { name: 'guest', role: '访客', state: '受限' },
]);

const showUserModal = ref(false);
const tip = ref(null);
const userForm = reactive({ name: 'new-engineer', role: '调试员' });

const addUser = () => {
  if (!userForm.name) return;
  users.push({ name: userForm.name, role: userForm.role, state: '待审核' });
  showUserModal.value = false;
  showTip('已创建', `${userForm.name} 已加入列表，等待权限审批。`);
};

const showTip = (title, body) => {
  tip.value = { title, body };
};
</script>

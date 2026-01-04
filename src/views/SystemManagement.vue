<template>
  <div class="grid" aria-label="系统管理与安全控制">
    <div class="section-title">
      <h2>系统管理与安全</h2>
      <div class="actions">
        <button @click="openUser">新增用户</button>
        <button class="secondary" @click="showAudit = true">审计日志</button>
        <button class="accent" @click="showSecurity = true">安全策略</button>
      </div>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>用户名</th>
            <th>角色</th>
            <th>最近登录</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.lastLogin }}</td>
            <td><span class="badge" :class="user.active ? 'green badge' : 'orange badge'">{{ user.active ? '启用' : '已禁用' }}</span></td>
            <td>
              <div class="actions">
                <button class="secondary" @click="toggle(user)">{{ user.active ? '禁用' : '启用' }}</button>
                <button class="accent" @click="reset(user)">重置密码</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="responsive-grid">
      <div class="card">
        <h3>角色说明</h3>
        <p>医生可录入与评估，质控员负责审核，管理员负责安全策略与权限。</p>
        <div class="chip-row">
          <span class="tag">最小权限</span>
          <span class="tag">审计保留180天</span>
          <span class="tag">单点登录</span>
        </div>
      </div>
      <div class="card">
        <h3>安全概览</h3>
        <div class="progress-bar"><span :style="{ width: '82%' }"></span></div>
        <small>安全策略覆盖度 82%</small>
      </div>
      <div class="card">
        <h3>运行状态</h3>
        <p>近 24 小时接口成功率 99.96%，审计日志持续写入。</p>
        <div class="chart-bar">
          <span>可用性</span>
          <div class="bar-track"><div class="bar-fill" style="width: 99%; background: #22c55e;"></div></div>
          <span>99%</span>
        </div>
      </div>
    </div>

    <div v-if="userModal" class="overlay" @click.self="userModal = false">
      <div class="modal">
        <h3>新增用户</h3>
        <div class="form-grid">
          <label>姓名<input v-model="userForm.name" placeholder="请输入姓名" /></label>
          <label>角色<select v-model="userForm.role"><option>医生</option><option>质控员</option><option>管理员</option></select></label>
          <label>手机<input v-model="userForm.phone" placeholder="用于双因子" /></label>
          <label>科室<input v-model="userForm.dept" placeholder="如：肾内科" /></label>
        </div>
        <div class="actions" style="justify-content: flex-end;">
          <button class="secondary" @click="addUser">创建账户</button>
        </div>
      </div>
    </div>

    <div v-if="showAudit" class="overlay" @click.self="showAudit = false">
      <div class="modal">
        <h3>审计日志</h3>
        <ul>
          <li v-for="log in audits" :key="log.id">{{ log.time }} - {{ log.action }}</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="showAudit = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="showSecurity" class="overlay" @click.self="showSecurity = false">
      <div class="modal">
        <h3>安全策略</h3>
        <ul>
          <li>角色基于 RBAC，敏感操作双因子验证</li>
          <li>数据加密存储，关键接口开启签名</li>
          <li>日志审计保留 180 天，可导出</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="showSecurity = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="resetUser" class="overlay" @click.self="resetUser = null">
      <div class="modal">
        <h3>密码重置</h3>
        <p>已为 {{ resetUser?.name }} 生成临时密码，并通过短信发送。</p>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="resetUser = null">完成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const users = reactive([
  { id: 1, name: '管理员A', role: '管理员', lastLogin: '2024-06-05 09:12', active: true },
  { id: 2, name: '医生B', role: '医生', lastLogin: '2024-06-06 08:33', active: true },
  { id: 3, name: '质控员C', role: '质控员', lastLogin: '2024-06-05 21:12', active: true },
  { id: 4, name: '医生D', role: '医生', lastLogin: '2024-06-02 14:55', active: false }
]);

const audits = [
  { id: 1, action: '管理员A 导出 5 月随访报表', time: '2024-06-06 10:12' },
  { id: 2, action: '医生B 提交张伟新评估', time: '2024-06-05 17:22' },
  { id: 3, action: '质控员C 通过 12 条质控校验', time: '2024-06-04 11:05' }
];

const userModal = ref(false);
const showAudit = ref(false);
const showSecurity = ref(false);
const resetUser = ref(null);
const userForm = reactive({ name: '', role: '医生', phone: '', dept: '' });

const openUser = () => {
  userModal.value = true;
};

const toggle = (user) => {
  user.active = !user.active;
};

const reset = (user) => {
  resetUser.value = user;
};

const addUser = () => {
  users.push({
    id: Date.now(),
    name: userForm.name || '新用户',
    role: userForm.role,
    lastLogin: '未登录',
    active: true
  });
  userModal.value = false;
};
</script>

<template>
  <section class="card">
    <div class="card-header">
      <div>
        <div class="card-title">系统运行与用户管理</div>
        <div style="color: var(--muted); font-size: 13px;">权限管理、系统监控、日志与配置维护。</div>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="button-secondary" type="button" @click="showLogModal = true">查看日志</button>
        <button class="button-secondary" type="button" @click="startMonitor">健康检查</button>
        <button class="button-secondary" type="button" @click="showRoleModal = true">权限配置</button>
        <button class="button-primary" type="button" @click="showUserModal = true">新增用户</button>
      </div>
    </div>
    <div class="grid-3">
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">在线用户</div>
        <div style="font-size: 26px; font-weight: 700;">36 人</div>
        <div style="color: var(--accent); font-size: 13px;">角色覆盖 5 类</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">系统负载</div>
        <div style="font-size: 26px; font-weight: 700;">43%</div>
        <div style="color: var(--accent); font-size: 13px;">节点运行正常</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">告警消息</div>
        <div style="font-size: 26px; font-weight: 700;">2 条</div>
        <div style="color: #f97316; font-size: 13px;">待确认 1 条</div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">用户与权限清单</div>
      <button class="button-ghost" type="button" @click="showTipModal = true">权限说明</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>用户</th>
          <th>角色</th>
          <th>所属部门</th>
          <th>最近登录</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.team }}</td>
          <td>{{ user.lastLogin }}</td>
          <td><span class="chip">{{ user.status }}</span></td>
          <td>
            <button class="button-ghost" type="button" @click="openUserDetail(user)">详情</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal
    :open="showUserModal"
    title="新增用户"
    @close="showUserModal = false"
    @confirm="confirmUser"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>姓名</label>
        <input v-model="userForm.name" placeholder="例如：李晓" />
      </div>
      <div class="form-field">
        <label>角色</label>
        <select v-model="userForm.role">
          <option>系统管理员</option>
          <option>生产主管</option>
          <option>数据分析师</option>
          <option>设备运维</option>
        </select>
      </div>
      <div class="form-field">
        <label>所属部门</label>
        <input v-model="userForm.team" placeholder="例如：数据中心" />
      </div>
      <div class="form-field">
        <label>联系方式</label>
        <input v-model="userForm.phone" placeholder="例如：13800000000" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showRoleModal"
    title="权限配置"
    @close="showRoleModal = false"
    @confirm="confirmRole"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>角色选择</label>
        <select v-model="roleForm.role">
          <option>系统管理员</option>
          <option>生产主管</option>
          <option>数据分析师</option>
        </select>
      </div>
      <div class="form-field">
        <label>权限范围</label>
        <select v-model="roleForm.scope">
          <option>全局管理</option>
          <option>区域管理</option>
          <option>只读分析</option>
        </select>
      </div>
      <div class="form-field">
        <label>角色描述</label>
        <input v-model="roleForm.desc" placeholder="例如：管理所有数据与权限" />
      </div>
      <div class="form-field">
        <label>有效期</label>
        <input v-model="roleForm.expire" placeholder="例如：永久" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showLogModal"
    title="系统日志"
    @close="showLogModal = false"
    @confirm="showLogModal = false"
  >
    <ul style="line-height: 1.8; color: var(--muted);">
      <li>08:12 设备监控服务完成健康巡检。</li>
      <li>09:03 数据同步任务执行成功。</li>
      <li>10:24 新增用户“李晓”，角色为数据分析师。</li>
      <li>11:15 预警规则更新，触发次数下降。</li>
    </ul>
  </BaseModal>

  <BaseModal
    :open="showMonitorModal"
    title="系统健康检查"
    @close="closeMonitor"
    @confirm="closeMonitor"
  >
    <p>正在执行系统健康检查。</p>
    <div class="progress-bar">
      <span :style="{ width: monitorProgress + '%' }"></span>
    </div>
    <div style="color: var(--muted); font-size: 13px;">{{ monitorProgress }}% 已完成</div>
  </BaseModal>

  <BaseModal
    :open="showUserDetail"
    title="用户详情"
    @close="showUserDetail = false"
    @confirm="showUserDetail = false"
  >
    <p>用户：{{ selectedUser.name }}</p>
    <p>角色：{{ selectedUser.role }}</p>
    <p>部门：{{ selectedUser.team }}</p>
    <p>最近登录：{{ selectedUser.lastLogin }}</p>
  </BaseModal>

  <BaseModal
    :open="showTipModal"
    title="权限说明"
    @close="showTipModal = false"
    @confirm="showTipModal = false"
  >
    <p style="color: var(--muted); line-height: 1.6;">
      权限配置决定用户可访问的模块与数据范围，建议按岗位设置最小权限策略。
    </p>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const users = Array.from({ length: 24 }, (_, index) => ({
  name: ['李晓', '张强', '王敏', '周磊'][index % 4],
  role: ['系统管理员', '生产主管', '数据分析师', '设备运维'][index % 4],
  team: ['数据中心', '生产部', '运营部'][index % 3],
  lastLogin: `2024-03-${(index % 20) + 1} 09:${index % 6}0`,
  status: index % 5 === 0 ? '待审核' : '正常'
}));

const showUserModal = ref(false);
const showRoleModal = ref(false);
const showLogModal = ref(false);
const showMonitorModal = ref(false);
const showUserDetail = ref(false);
const showTipModal = ref(false);

const userForm = reactive({
  name: '',
  role: '系统管理员',
  team: '',
  phone: ''
});

const roleForm = reactive({
  role: '系统管理员',
  scope: '全局管理',
  desc: '',
  expire: ''
});

const selectedUser = reactive({
  name: '',
  role: '',
  team: '',
  lastLogin: ''
});

const monitorProgress = ref(0);
let timer;

const startMonitor = () => {
  monitorProgress.value = 0;
  showMonitorModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (monitorProgress.value < 100) {
      monitorProgress.value += 14;
    } else {
      clearInterval(timer);
    }
  }, 240);
};

const closeMonitor = () => {
  showMonitorModal.value = false;
  monitorProgress.value = 100;
};

const confirmUser = () => {
  showUserModal.value = false;
};

const confirmRole = () => {
  showRoleModal.value = false;
};

const openUserDetail = (user) => {
  selectedUser.name = user.name;
  selectedUser.role = user.role;
  selectedUser.team = user.team;
  selectedUser.lastLogin = user.lastLogin;
  showUserDetail.value = true;
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

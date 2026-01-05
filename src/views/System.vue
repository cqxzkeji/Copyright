<template>
  <div class="table-card">
    <div class="section-header">
      <div>
        <h2>系统管理与协同支撑</h2>
        <p>提供用户权限、角色分工、数据配置与日志审计能力。</p>
      </div>
      <div class="action-row">
        <button @click="showUser = true">新增用户</button>
        <button style="background:#10b981" @click="showReset = true">重置密码任务</button>
        <button style="background:#eef2ff;color:#0b5bd3" @click="showLog = true">查看操作日志</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="bar-chart">
        <h4>角色分布</h4>
        <div v-for="role in roles" :key="role.name" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ role.name }}</span>
            <span>{{ role.count }}人</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: role.percent + '%' }"></div></div>
        </div>
      </div>
      <div class="progress-chart">
        <h4>协同任务进度</h4>
        <div v-for="task in tasks.slice(0,5)" :key="task.id" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ task.name }}</span>
            <span>{{ task.progress }}%</span>
          </div>
          <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: task.progress + '%' }"></div></div>
        </div>
      </div>
    </div>

    <table class="table" style="margin-top:12px;">
      <thead>
        <tr>
          <th>姓名</th>
          <th>部门</th>
          <th>角色</th>
          <th>权限级别</th>
          <th>最近登录</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.dept }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.level }}</td>
          <td>{{ user.login }}</td>
          <td><span class="badge" :class="user.active ? 'active' : 'idle'">{{ user.active ? '启用' : '停用' }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showUser" title="新增用户" @close="showUser = false">
    <div class="form-grid">
      <div class="input-group">
        <label>姓名</label>
        <input v-model="userForm.name" />
      </div>
      <div class="input-group">
        <label>部门</label>
        <input v-model="userForm.dept" />
      </div>
      <div class="input-group">
        <label>角色</label>
        <select v-model="userForm.role">
          <option>管理员</option>
          <option>资产管理员</option>
          <option>项目经理</option>
          <option>审计专员</option>
        </select>
      </div>
      <div class="input-group">
        <label>权限级别</label>
        <input v-model="userForm.level" />
      </div>
    </div>
    <template #footer>
      <button style="background:#eef2ff;color:#0b5bd3" @click="showUser = false">取消</button>
      <button @click="addUser">保存</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showReset" title="密码重置批量任务" @close="showReset = false">
    <p>批量密码重置正在执行，完成后将发送通知到相关用户。</p>
    <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: resetProgress + '%' }"></div></div>
  </ModalDialog>

  <ModalDialog v-if="showLog" title="最近操作日志" @close="showLog = false">
    <ul>
      <li v-for="log in logs" :key="log">{{ log }}</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showUser = ref(false);
const showReset = ref(false);
const showLog = ref(false);
const resetProgress = ref(40);

const roles = ref([
  { name: '管理员', count: 6, percent: 80 },
  { name: '资产管理员', count: 10, percent: 60 },
  { name: '项目经理', count: 14, percent: 70 },
  { name: '审计专员', count: 5, percent: 40 }
]);

const tasks = ref([
  { id: 1, name: '权限梳理', progress: 55 },
  { id: 2, name: '数据口径对齐', progress: 73 },
  { id: 3, name: '日志抽查', progress: 48 },
  { id: 4, name: '接口联调', progress: 66 },
  { id: 5, name: '备份巡检', progress: 82 },
  { id: 6, name: '安全基线检查', progress: 41 },
  { id: 7, name: '角色映射更新', progress: 57 },
  { id: 8, name: '数据脱敏校验', progress: 69 },
  { id: 9, name: '审计报告输出', progress: 38 },
  { id: 10, name: '应急演练', progress: 64 }
]);

const users = ref([
  { name: '李娜', dept: '资产中心', role: '管理员', level: 'S1', login: '2024-07-01', active: true },
  { name: '王伟', dept: '资产中心', role: '资产管理员', level: 'A1', login: '2024-06-30', active: true },
  { name: '赵敏', dept: '合作办', role: '项目经理', level: 'B1', login: '2024-06-28', active: true },
  { name: '刘洋', dept: '改造办', role: '项目经理', level: 'B2', login: '2024-06-25', active: true },
  { name: '陈军', dept: '运营部', role: '资产管理员', level: 'A2', login: '2024-06-21', active: true },
  { name: '孙燕', dept: '审计科', role: '审计专员', level: 'B1', login: '2024-06-19', active: true },
  { name: '周强', dept: '信息科', role: '管理员', level: 'S2', login: '2024-06-18', active: true },
  { name: '郭菲', dept: '资产中心', role: '资产管理员', level: 'A2', login: '2024-06-16', active: true },
  { name: '钱昕', dept: '合作办', role: '项目经理', level: 'B2', login: '2024-06-14', active: true },
  { name: '吴晨', dept: '审计科', role: '审计专员', level: 'B1', login: '2024-06-12', active: true },
  { name: '冯睿', dept: '运营部', role: '资产管理员', level: 'A1', login: '2024-06-10', active: true },
  { name: '马倩', dept: '资产中心', role: '管理员', level: 'S1', login: '2024-06-09', active: true },
  { name: '贾琦', dept: '信息科', role: '管理员', level: 'S2', login: '2024-06-08', active: true },
  { name: '侯亮', dept: '改造办', role: '项目经理', level: 'B2', login: '2024-06-07', active: false },
  { name: '吕莹', dept: '运营部', role: '资产管理员', level: 'A1', login: '2024-06-06', active: true },
  { name: '董琪', dept: '审计科', role: '审计专员', level: 'B1', login: '2024-06-05', active: true },
  { name: '程飞', dept: '资产中心', role: '资产管理员', level: 'A2', login: '2024-06-04', active: false },
  { name: '石磊', dept: '合作办', role: '项目经理', level: 'B1', login: '2024-06-02', active: true },
  { name: '贺心', dept: '审计科', role: '审计专员', level: 'B2', login: '2024-06-01', active: true },
  { name: '段超', dept: '信息科', role: '管理员', level: 'S2', login: '2024-05-30', active: true }
]);

const logs = ref([
  '2024-07-01 10:20 管理员 李娜 新增用户 张三',
  '2024-07-01 09:55 项目经理 赵敏 更新项目进度 65%',
  '2024-06-30 17:30 审计专员 孙燕 导出审计日志',
  '2024-06-30 15:16 管理员 王伟 变更资产权限 A-05',
  '2024-06-29 11:10 信息科 周强 同步单点登录配置'
]);

onMounted(() => {
  const timer = setInterval(() => {
    resetProgress.value = Math.min(resetProgress.value + 15, 100);
    if (resetProgress.value === 100) clearInterval(timer);
  }, 500);
});

const userForm = reactive({ name: '', dept: '资产中心', role: '管理员', level: 'A1' });

const addUser = () => {
  users.value.unshift({
    name: userForm.name || '新用户',
    dept: userForm.dept,
    role: userForm.role,
    level: userForm.level,
    login: '刚刚',
    active: true
  });
  showUser.value = false;
};
</script>

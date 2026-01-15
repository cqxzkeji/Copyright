<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>系统管理</h2>
        <p>用户权限、基础配置与日志管理，保障平台稳定安全运行。</p>
      </div>
      <div class="actions">
        <button @click="openModal('user')">新增用户</button>
        <button @click="openModal('config')">基础配置</button>
        <button @click="openModal('log')">日志检索</button>
      </div>
    </section>

    <div class="cards">
      <div class="card">
        <h3>权限概览</h3>
        <p>管理员 6 人，运维人员 18 人。</p>
        <div class="tags">
          <span>高权限访问：12 次</span>
          <span>策略阻断：3 次</span>
        </div>
      </div>
      <div class="card">
        <h3>系统配置</h3>
        <p>当前版本 V2.2.1，已启用双因素验证。</p>
        <button class="ghost" @click="openModal('upgrade')">安排升级</button>
      </div>
      <div class="card">
        <h3>日志概况</h3>
        <p>今日采集 12,480 条日志。</p>
        <div class="progress">
          <div class="bar" :style="{ width: '64%' }"></div>
        </div>
        <span>异常日志占比 2.6%</span>
      </div>
    </div>

    <div class="table-card">
      <h3>用户与权限表</h3>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>角色</th>
            <th>部门</th>
            <th>最近登录</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.team }}</td>
            <td>{{ user.last }}</td>
            <td>{{ user.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      :open="modal.open"
      :title="modal.title"
      :confirm-text="modal.confirmText"
      @close="modal.open = false"
      @confirm="modal.open = false"
    >
      <div v-if="modal.type === 'user'">
        <p>新增用户并分配权限。</p>
        <form class="form-grid">
          <label>姓名<input placeholder="请输入姓名" /></label>
          <label>角色<select><option>管理员</option><option>运维人员</option><option>监控人员</option></select></label>
          <label>部门<select><option>指挥中心</option><option>运维部</option><option>安全部</option></select></label>
          <label>权限等级<select><option>高</option><option>中</option><option>低</option></select></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'config'">
        <p>基础配置将影响全局运行策略。</p>
        <form class="form-grid">
          <label>日志保留时长<select><option>30 天</option><option>90 天</option><option>180 天</option></select></label>
          <label>认证方式<select><option>双因素</option><option>单因素</option></select></label>
          <label>自动备份<select><option>开启</option><option>关闭</option></select></label>
          <label>告警渠道<select><option>短信</option><option>平台通知</option></select></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'log'">
        <p>检索指定时间段日志。</p>
        <form class="form-grid">
          <label>开始时间<input type="datetime-local" /></label>
          <label>结束时间<input type="datetime-local" /></label>
          <label>日志级别<select><option>全部</option><option>警告</option><option>错误</option></select></label>
          <label>关键词<input placeholder="输入关键字" /></label>
        </form>
      </div>
      <div v-else>
        <p>升级计划将自动通知相关人员。</p>
        <form class="form-grid">
          <label>升级时间<input type="datetime-local" /></label>
          <label>影响范围<select><option>全平台</option><option>运维模块</option></select></label>
          <label>灰度策略<select><option>逐步升级</option><option>一次性</option></select></label>
          <label>负责人<select><option>系统管理员</option><option>运维经理</option></select></label>
        </form>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const users = [
  { name: '陈亮', role: '管理员', team: '指挥中心', last: '10:12', status: '在线' },
  { name: '李楠', role: '运维人员', team: '运维部', last: '09:54', status: '在线' },
  { name: '周航', role: '监控人员', team: '监控组', last: '09:30', status: '离线' },
  { name: '王静', role: '运维人员', team: '运维部', last: '09:12', status: '在线' },
  { name: '赵敏', role: '监控人员', team: '监控组', last: '08:50', status: '在线' },
  { name: '刘峰', role: '管理员', team: '安全部', last: '08:35', status: '在线' }
];

const modal = reactive({
  open: false,
  type: '',
  title: '',
  confirmText: ''
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  const titles = {
    user: '新增用户',
    config: '基础配置',
    log: '日志检索',
    upgrade: '安排升级'
  };
  modal.title = titles[type];
  modal.confirmText = '确认提交';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button,
.ghost {
  border: none;
  background: #eef3ff;
  color: #2f3c4a;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #5b6b82;
}

.progress {
  height: 10px;
  background: #e4ecfb;
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2fb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #5b6b82;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f3;
  background: #f7faff;
}
</style>

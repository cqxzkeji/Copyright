<template>
  <div class="container">
    <div class="flex">
      <div class="card" style="flex: 1 1 320px;">
        <h3>系统工具</h3>
        <div class="actions">
          <button @click="showUser = true">新增用户</button>
          <button class="ghost" @click="startHealth">健康巡检</button>
          <button @click="showPolicy = true">策略提示</button>
        </div>
        <p class="muted">所有操作均以模态弹窗提示，安全可控</p>
      </div>
      <div class="card" style="flex: 1 1 320px;">
        <h3>运行状况</h3>
        <ul class="bullet">
          <li>CPU 占用 42%，充足余量。</li>
          <li>磁盘健康，剩余 2.1 TB。</li>
          <li>三处节点延迟升高，已自动旁路。</li>
        </ul>
        <button style="margin-top: 12px;" @click="showPolicy = true">查看处置方案</button>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>用户与权限</h3>
          <p class="muted">展示 10 条以上用户数据，支持快速审核</p>
        </div>
        <button class="ghost" @click="showUser = true">快速添加</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>角色</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>最近登录</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.email }}</td>
            <td><span class="badge" :style="{ background: user.color }">{{ user.status }}</span></td>
            <td>{{ user.last }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <modal-dialog v-model="showUser" title="新增用户" width="520px">
      <div class="form-grid">
        <label>姓名<input placeholder="请输入姓名" /></label>
        <label>邮箱<input type="email" placeholder="user@example.com" /></label>
        <label>角色<select><option>管理员</option><option>审计</option><option>只读</option></select></label>
      </div>
      <template #footer>
        <button class="ghost" @click="showUser = false">取消</button>
        <button @click="showUser = false; showPolicy = true;">保存</button>
      </template>
    </modal-dialog>

    <modal-dialog v-model="showHealth" title="系统巡检" width="460px">
      <p>正在巡检 CPU、存储、网络与安全策略...</p>
      <div class="progress"><div class="progress-bar" :style="{ width: health + '%' }"></div></div>
    </modal-dialog>

    <modal-dialog v-model="showPolicy" title="安全策略提示">
      <ul class="bullet">
        <li>建议启用多因素登录并定期轮换口令。</li>
        <li>导出链接 2 小时后自动失效，可在此处提前关闭。</li>
        <li>审计日志保留 180 天，可导出备份。</li>
      </ul>
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showUser = ref(false);
const showHealth = ref(false);
const showPolicy = ref(false);
const health = ref(15);

const users = [
  { name: '陈静', role: '管理员', email: 'jing.chen@example.com', status: '启用', color: '#43a047', last: '今天 09:55' },
  { name: '李泽', role: '数据分析', email: 'ze.li@example.com', status: '启用', color: '#43a047', last: '今天 09:50' },
  { name: '王晓', role: '审计', email: 'xiao.wang@example.com', status: '启用', color: '#43a047', last: '今天 09:45' },
  { name: '赵涵', role: '运营', email: 'han.zhao@example.com', status: '启用', color: '#43a047', last: '今天 09:44' },
  { name: '刘敏', role: '研发', email: 'min.liu@example.com', status: '启用', color: '#43a047', last: '今天 09:42' },
  { name: '杨晨', role: '只读', email: 'chen.yang@example.com', status: '启用', color: '#43a047', last: '今天 09:40' },
  { name: '苏瑾', role: '安全', email: 'jin.su@example.com', status: '启用', color: '#43a047', last: '今天 09:36' },
  { name: '韩旭', role: '管理员', email: 'xu.han@example.com', status: '禁用', color: '#e53935', last: '昨天 23:10' },
  { name: '周琪', role: 'BI 分析', email: 'qi.zhou@example.com', status: '启用', color: '#43a047', last: '今天 09:30' },
  { name: '何云', role: '运营', email: 'yun.he@example.com', status: '启用', color: '#43a047', last: '今天 09:28' },
  { name: '史诺', role: '审计', email: 'nuo.shi@example.com', status: '启用', color: '#43a047', last: '今天 09:20' }
];

const startHealth = () => {
  showHealth.value = true;
  health.value = 15;
  const timer = setInterval(() => {
    health.value += 22;
    if (health.value >= 100) {
      clearInterval(timer);
      showHealth.value = false;
      showPolicy.value = true;
    }
  }, 320);
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button.ghost {
  background: #eef2f7;
  color: #1f2933;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.muted {
  margin: 0;
  color: #94a3b8;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d7deea;
}
</style>

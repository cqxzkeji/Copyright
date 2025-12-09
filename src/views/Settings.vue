<template>
  <section class="grid" style="grid-template-columns: 1fr 1fr; align-items: start;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>系统参数</h2>
          <p>设置登录、安全与通知策略</p>
        </div>
        <button class="btn primary" @click="openSave">保存配置</button>
      </header>
      <form class="form" @submit.prevent="openSave">
        <label>默认用户名<input v-model="settings.username" required /></label>
        <label>密码策略<select v-model="settings.password">
          <option>强制包含数字与字母</option>
          <option>仅长度限制</option>
          <option>定期重置</option>
        </select></label>
        <label>通知邮箱<input v-model="settings.email" type="email" placeholder="alert@example.com" /></label>
        <label>主题风格<select v-model="settings.theme">
          <option>亮色</option>
          <option>暗色</option>
        </select></label>
        <footer>
          <button class="btn" type="button" @click="openReset">恢复默认</button>
          <button class="btn primary" type="submit">提交保存</button>
        </footer>
      </form>
    </div>

    <div class="card">
      <header class="section-header">
        <div>
          <h2>操作日志</h2>
          <p>近期用户登录与配置修改记录</p>
        </div>
        <button class="btn" @click="showLogs = true">查看更多</button>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>事件</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time">
            <td>{{ log.time }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <div v-if="showSave" class="modal-backdrop" @click.self="showSave = false">
    <div class="modal">
      <header>
        <span>保存成功</span>
        <button class="btn" @click="showSave = false">关闭</button>
      </header>
      <p>配置已保存，将在下次登录后生效。</p>
      <footer>
        <button class="btn primary" @click="showSave = false">确定</button>
      </footer>
    </div>
  </div>

  <div v-if="showReset" class="modal-backdrop" @click.self="showReset = false">
    <div class="modal">
      <header>
        <span>恢复默认</span>
        <button class="btn" @click="showReset = false">关闭</button>
      </header>
      <p>确定将所有设置恢复为系统默认值？</p>
      <footer>
        <button class="btn" @click="showReset = false">取消</button>
        <button class="btn primary" @click="resetSettings">确认恢复</button>
      </footer>
    </div>
  </div>

  <div v-if="showLogs" class="modal-backdrop" @click.self="showLogs = false">
    <div class="modal">
      <header>
        <span>更多日志</span>
        <button class="btn" @click="showLogs = false">关闭</button>
      </header>
      <ul>
        <li v-for="log in logs" :key="`${log.time}-${log.user}`">{{ log.time }} — {{ log.user }} — {{ log.action }}</li>
      </ul>
      <footer>
        <button class="btn primary" @click="showLogs = false">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const settings = reactive({
  username: 'demo',
  password: '强制包含数字与字母',
  email: 'alert@example.com',
  theme: '亮色'
});

const logs = ref([
  { time: '09:00', user: 'demo', action: '登录系统' },
  { time: '09:05', user: 'demo', action: '调整密码策略' },
  { time: '09:06', user: 'demo', action: '更新通知邮箱' },
  { time: '09:10', user: 'ops', action: '导出运行报表' },
  { time: '09:15', user: 'ops', action: '编辑投加计划' },
  { time: '09:20', user: 'ops', action: '核对监测数据' },
  { time: '09:30', user: 'demo', action: '查看资源去向' },
  { time: '09:40', user: 'admin', action: '上传监测报告' },
  { time: '09:50', user: 'admin', action: '审计操作日志' },
  { time: '10:00', user: 'demo', action: '退出登录' }
]);

const showSave = ref(false);
const showReset = ref(false);
const showLogs = ref(false);

const openSave = () => (showSave.value = true);
const openReset = () => (showReset.value = true);

const resetSettings = () => {
  settings.username = 'demo';
  settings.password = '强制包含数字与字母';
  settings.email = 'alert@example.com';
  settings.theme = '亮色';
  showReset.value = false;
  showSave.value = true;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}

input, select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}
</style>

<template>
  <div class="page">
    <div class="flex-between">
      <div>
        <p class="muted">系统参数与协同设置</p>
        <h2 class="section-title">系统设置</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="saveSettings">保存设置</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="data-card">
        <p class="muted">协同提醒</p>
        <h3>通知与审批</h3>
        <label class="toggle">短信提醒<input type="checkbox" v-model="settings.sms" /></label>
        <label class="toggle">邮件抄送<input type="checkbox" v-model="settings.mail" /></label>
      </div>
      <div class="data-card">
        <p class="muted">数据同步</p>
        <h3>接口配置</h3>
        <label>数据中心地址<input v-model="settings.api" placeholder="https://api.example.com" /></label>
        <label>同步频率<select v-model="settings.frequency"><option>15分钟</option><option>30分钟</option><option>1小时</option></select></label>
      </div>
      <div class="data-card">
        <p class="muted">安全策略</p>
        <h3>访问控制</h3>
        <label class="toggle">双因素登录<input type="checkbox" v-model="settings.mfa" /></label>
        <label class="toggle">IP 白名单<input type="checkbox" v-model="settings.ip" /></label>
      </div>
    </div>

    <h3 class="section-title">操作日志</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>操作</th>
            <th>模块</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time">
            <td>{{ log.time }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.module }}</td>
            <td>{{ log.result }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showToast" title="设置保存">
      <p>{{ toastMessage }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const settings = reactive({ sms: true, mail: true, api: 'https://api.seed.cn', frequency: '30分钟', mfa: true, ip: false });
const showToast = ref(false);
const toastMessage = ref('');

const logs = ref([
  { time: '2024-01-10', user: 'Admin', action: '更新阈值', module: '监控', result: '成功' },
  { time: '2024-01-12', user: 'Li Lei', action: '导出报表', module: '数据分析', result: '成功' },
  { time: '2024-01-13', user: 'Han Meimei', action: '新增种质', module: '基因库', result: '成功' },
  { time: '2024-01-14', user: 'Zhao Qi', action: '调整优化参数', module: '繁育优化', result: '成功' },
  { time: '2024-01-15', user: 'Admin', action: '更新通知策略', module: '设置', result: '成功' },
  { time: '2024-01-16', user: 'Li Lei', action: '推送匹配', module: '智能匹配', result: '成功' },
  { time: '2024-01-17', user: 'Admin', action: '启用监控', module: '监控', result: '成功' },
  { time: '2024-01-18', user: 'Han Meimei', action: '安排试验', module: '繁育优化', result: '成功' },
  { time: '2024-01-19', user: 'Zhao Qi', action: '导入批次', module: '基因库', result: '失败-校验' },
  { time: '2024-01-20', user: 'Admin', action: '调整权限', module: '设置', result: '成功' }
]);

const saveSettings = () => {
  toastMessage.value = `配置已保存：同步频率${settings.frequency}，API ${settings.api}`;
  showToast.value = true;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-card label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.data-card input, .data-card select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">告警管理</p>
        <h2>策略、推送与确认</h2>
      </div>
      <div class="btns">
        <button class="primary" @click="showCreate = true">新建告警</button>
        <button @click="showBatch = true">批量确认</button>
        <button @click="showChannel = true">通知渠道</button>
      </div>
    </header>

    <section class="table-card">
      <div class="table-head">
        <h3>告警列表</h3>
        <button @click="showGuide = true">规则说明</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>标题</th>
            <th>级别</th>
            <th>来源</th>
            <th>时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in alerts" :key="alert.title">
            <td>{{ alert.title }}</td>
            <td>{{ alert.level }}</td>
            <td>{{ alert.source }}</td>
            <td>{{ alert.time }}</td>
            <td>{{ alert.state }}</td>
            <td><button @click="openAlert(alert)">处理</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-if="showCreate" title="新建告警规则" @close="showCreate = false">
      <form class="form" @submit.prevent="submitRule">
        <label>规则名称<input v-model="ruleForm.name" required /></label>
        <label>阈值条件<input v-model="ruleForm.threshold" required /></label>
        <label>通知人<input v-model="ruleForm.owner" required /></label>
        <label>恢复策略<input v-model="ruleForm.resume" required /></label>
        <div class="modal-actions">
          <button class="primary" type="submit">保存</button>
          <button type="button" @click="showCreate = false">取消</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal v-if="showBatch" title="批量确认" @close="showBatch = false">
      <p>将为选中的告警记录自动添加确认人。</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: batchPercent + '%' }"></div>
      </div>
      <p class="desc">执行进度：{{ batchPercent }}%</p>
      <div class="modal-actions">
        <button class="primary" @click="increaseBatch">刷新进度</button>
        <button @click="showBatch = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showChannel" title="通知渠道" @close="showChannel = false">
      <p>可切换钉钉、企业微信、短信或邮件推送。</p>
      <div class="modal-actions">
        <button class="primary" @click="showChannel = false">保存</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showGuide" title="规则说明" @close="showGuide = false">
      <p>CPU 超过 80%、内存超过 85% 或磁盘剩余小于 15% 将触发告警。</p>
      <div class="modal-actions">
        <button class="primary" @click="showGuide = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeAlert" :title="activeAlert.title" @close="activeAlert = null">
      <p>级别：{{ activeAlert.level }}，来源：{{ activeAlert.source }}</p>
      <p>发生时间：{{ activeAlert.time }}</p>
      <div class="modal-actions">
        <button class="primary" @click="showSilence = true">静默</button>
        <button @click="activeAlert = null">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showSilence" title="静默设置" @close="showSilence = false">
      <p>静默期间相同告警将不再推送。</p>
      <div class="modal-actions">
        <button class="primary" @click="showSilence = false">确认</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from './components/BaseModal.vue';

const alerts = ref([
  { title: 'GPU 温度过高', level: 'P1', source: 'ap-sg-gpu', time: '10:12', state: '未处理' },
  { title: 'CN-SH 负载异常', level: 'P2', source: 'cn-sh-01', time: '10:20', state: '未处理' },
  { title: '存储容量不足', level: 'P1', source: 'cn-bj-oss', time: '10:33', state: '处理中' },
  { title: '网络延迟升高', level: 'P2', source: 'us-ca-01', time: '10:41', state: '未处理' },
  { title: '登录失败次数过多', level: 'P3', source: 'iam', time: '10:55', state: '未处理' },
  { title: 'API 超时', level: 'P2', source: 'gateway', time: '11:03', state: '处理中' },
  { title: '队列堆积', level: 'P2', source: 'mq', time: '11:16', state: '未处理' },
  { title: '节点掉线', level: 'P1', source: 'cn-sh-02', time: '11:24', state: '未处理' },
  { title: '磁盘 IOPS 飙升', level: 'P2', source: 'cn-sh-ssd', time: '11:37', state: '已恢复' },
  { title: 'TLS 证书即将过期', level: 'P3', source: 'cert', time: '11:45', state: '未处理' }
]);

const showCreate = ref(false);
const showBatch = ref(false);
const showChannel = ref(false);
const showGuide = ref(false);
const activeAlert = ref(null);
const showSilence = ref(false);
const batchPercent = ref(20);

const ruleForm = ref({ name: '', threshold: '', owner: '', resume: '' });

const submitRule = () => {
  showCreate.value = false;
};

const increaseBatch = () => {
  batchPercent.value = Math.min(100, batchPercent.value + 25);
};

const openAlert = (alert) => {
  activeAlert.value = alert;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.08);
}

.btns button {
  margin-left: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
}

.eyebrow {
  color: #6b7280;
  margin: 0;
}

.table-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #374151;
}

.form input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  grid-column: span 2;
}

.progress {
  width: 100%;
  height: 12px;
  background: #eef2ff;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #22c55e);
}
</style>

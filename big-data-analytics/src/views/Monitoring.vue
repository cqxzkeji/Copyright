<template>
  <div class="module">
    <div class="panel metrics">
      <div class="panel-header">
        <h3>运行指标监控</h3>
        <small>实时采样 3s</small>
      </div>
      <div class="grid">
        <div class="metric" v-for="metric in metrics" :key="metric.name">
          <p>{{ metric.name }}</p>
          <strong>{{ metric.value }}</strong>
          <small>{{ metric.desc }}</small>
          <button class="ghost" @click="openModal(metric.name, metric.desc)">查看趋势</button>
        </div>
      </div>
    </div>

    <div class="panel alert">
      <div class="panel-header">
        <h3>告警策略 &amp; 通知</h3>
        <small>短信 / 钉钉 / Webhook</small>
      </div>
      <form @submit.prevent="saveAlarm">
        <label>监控指标</label>
        <select v-model="alarm.metric">
          <option v-for="metric in metrics" :value="metric.name" :key="metric.name">
            {{ metric.name }}
          </option>
        </select>
        <label>阈值</label>
        <input type="number" v-model.number="alarm.threshold" />
        <label>通知渠道</label>
        <div class="channels">
          <label v-for="channel in channels" :key="channel">
            <input type="checkbox" :value="channel" v-model="alarm.channels" />
            {{ channel }}
          </label>
        </div>
        <div class="buttons">
          <button type="submit">保存策略</button>
          <button type="button" class="ghost" @click="triggerTest">发送测试告警</button>
        </div>
      </form>
    </div>

    <BaseModal v-model="modal.show" :title="modal.title">
      <p>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = reactive([
  { name: 'CPU 占用', value: '65%', desc: '集群平均值' },
  { name: '内存占用', value: '70%', desc: 'Flink TaskManager' },
  { name: '吞吐 QPS', value: '920k', desc: 'Kafka 入口' },
  { name: '错误率', value: '0.02%', desc: 'Streaming SQL' }
]);

const channels = ['短信', '邮箱', '钉钉机器人', 'Webhook'];

const alarm = reactive({ metric: 'CPU 占用', threshold: 80, channels: ['短信'] });
const modal = reactive({ show: false, title: '监控提醒', message: '' });

const openModal = (title, message) => {
  modal.title = title;
  modal.message = `${message}，详细趋势请在监控看板查看`;
  modal.show = true;
};

const saveAlarm = () => {
  modal.title = '策略已保存';
  modal.message = `${alarm.metric} 阈值 ${alarm.threshold}，通知 ${alarm.channels.join(' / ')}`;
  modal.show = true;
};

const triggerTest = () => {
  modal.title = '测试告警';
  modal.message = '已通过所选渠道推送测试信息';
  modal.show = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.panel {
  flex: 1 1 360px;
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.metric {
  background: #f8fafc;
  border-radius: 18px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.metric strong {
  font-size: 1.5rem;
}
button {
  border: none;
  border-radius: 16px;
  padding: 0.5rem 1rem;
  background: linear-gradient(120deg, #f97316, #fb7185);
  color: #fff;
  cursor: pointer;
}
button.ghost {
  background: rgba(249, 115, 22, 0.1);
  color: #9a3412;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
select,
input {
  border: none;
  border-radius: 14px;
  padding: 0.6rem 0.8rem;
  background: #f1f5f9;
}
.channels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.channels label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
}
.buttons {
  display: flex;
  gap: 0.5rem;
}
</style>

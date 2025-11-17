<template>
  <div class="module">
    <div class="panel ingest">
      <div class="panel-header">
        <h3>多源采集通道</h3>
        <small>实时同步 {{ sources.length }} 个数据源</small>
      </div>
      <div class="sources">
        <div class="source" v-for="source in sources" :key="source.name">
          <h4>{{ source.name }}</h4>
          <p>{{ source.desc }}</p>
          <div class="meta">
            <span>状态：<strong :class="source.status">{{ source.status }}</strong></span>
            <span>速率：{{ source.rate }}</span>
          </div>
          <div class="actions">
            <button @click="showAction('采集任务已启动', source.name)">启动</button>
            <button class="ghost" @click="showAction('采集任务已暂停', source.name)">暂停</button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel form">
      <div class="panel-header">
        <h3>新增采集端</h3>
        <small>选择协议自动创建接入</small>
      </div>
      <form @submit.prevent="createSource">
        <label>数据源名称</label>
        <input v-model="form.name" placeholder="如 IoT 设备" required />
        <label>接入协议</label>
        <select v-model="form.protocol" required>
          <option value="Kafka">Kafka</option>
          <option value="MQTT">MQTT</option>
          <option value="HTTP">HTTP Pull</option>
          <option value="S3">对象存储</option>
        </select>
        <label>采样频率 (条/秒)</label>
        <input type="number" v-model.number="form.rate" min="1" placeholder="500" />
        <button type="submit">提交接入申请</button>
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

const sources = reactive([
  { name: 'Kafka-交易日志', desc: '华东交易集群 Kafka Topic', status: '运行中', rate: '120k msg/s' },
  { name: 'MQTT-物联网', desc: '全国设备遥测', status: '运行中', rate: '85k msg/s' },
  { name: '对象存储-批量', desc: 'S3 数据湖增量', status: '待命', rate: '8 TB/d' }
]);

const form = reactive({ name: '', protocol: 'Kafka', rate: 500 });
const modal = reactive({ show: false, title: '操作提醒', message: '' });

const showAction = (message, name) => {
  modal.show = true;
  modal.message = `${name}：${message}`;
};

const createSource = () => {
  modal.title = '接入结果';
  modal.message = `${form.name} (${form.protocol}) 已生成，计划速率 ${form.rate}/s`;
  modal.show = true;
  form.name = '';
  form.protocol = 'Kafka';
  form.rate = 500;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.panel {
  flex: 1 1 320px;
  background: #fff;
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.panel-header h3 {
  margin: 0;
}
.sources {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.source {
  padding: 1rem;
  border-radius: 18px;
  background: #f8fafc;
}
.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #475569;
}
strong.运行中 {
  color: #22c55e;
}
strong.待命 {
  color: #f97316;
}
.actions {
  margin-top: 0.8rem;
  display: flex;
  gap: 0.5rem;
}
button {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  background: linear-gradient(120deg, #0ea5e9, #38bdf8);
  color: #fff;
  cursor: pointer;
}
button.ghost {
  background: rgba(14, 165, 233, 0.12);
  color: #0ea5e9;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
input,
select {
  border: none;
  border-radius: 14px;
  padding: 0.75rem 0.9rem;
  background: #f1f5f9;
}
.form button {
  width: fit-content;
}
</style>

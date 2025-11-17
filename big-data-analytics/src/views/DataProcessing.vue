<template>
  <div class="module">
    <div class="pipeline panel">
      <div class="panel-header">
        <h3>实时流处理拓扑</h3>
        <small>基于 Flink SQL 的窗口聚合</small>
      </div>
      <div class="steps">
        <div class="step" v-for="step in steps" :key="step.title">
          <h4>{{ step.title }}</h4>
          <p>{{ step.desc }}</p>
          <span>{{ step.detail }}</span>
        </div>
      </div>
      <div class="actions">
        <button @click="startJob">启动实时计算</button>
        <button class="ghost" @click="openConfig">调整窗口参数</button>
      </div>
    </div>

    <div class="panel status">
      <div class="panel-header">
        <h3>最新计算批次</h3>
        <small>自动监控水位 &amp; 迟到数据</small>
      </div>
      <ul>
        <li v-for="batch in batches" :key="batch.id">
          <strong>#{{ batch.id }}</strong>
          <span>{{ batch.window }}</span>
          <em>{{ batch.latency }}</em>
        </li>
      </ul>
      <button class="ghost" @click="showAction('已触发补数', '迟到数据重放')">补数重算</button>
    </div>

    <ProgressModal
      v-model="progress.show"
      title="作业部署中"
      description="Flink 作业正在编译并提交至集群"
      :progress="progress.value"
    />
    <BaseModal v-model="modal.show" :title="modal.title">
      <p>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ProgressModal from '../components/ProgressModal.vue';

const steps = [
  { title: 'Source', desc: 'Kafka: trade_topic', detail: '按分钟消费' },
  { title: 'Window', desc: 'Tumble 60s', detail: '延迟 5s 容忍' },
  { title: 'Aggregate', desc: 'SUM(amount), COUNT(*)', detail: '多维指标' },
  { title: 'Sink', desc: 'ClickHouse 实时表', detail: '带版本号' }
];

const batches = [
  { id: 2680, window: '10:01:00 ~ 10:02:00', latency: '延迟 1.3s' },
  { id: 2681, window: '10:02:00 ~ 10:03:00', latency: '延迟 1.1s' },
  { id: 2682, window: '10:03:00 ~ 10:04:00', latency: '延迟 0.9s' }
];

const progress = reactive({ show: false, value: 0 });
const modal = reactive({ show: false, title: '参数变更', message: '' });
let timer;

const startJob = () => {
  progress.show = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(timer);
      modal.title = '作业状态';
      modal.message = '实时计算作业已经成功部署并开始运行';
      modal.show = true;
      progress.show = false;
    }
  }, 300);
};

const openConfig = () => {
  modal.title = '窗口参数';
  modal.message = '当前窗口 60s，允许迟到 5s，可在 SQL 中修改 HOP/TUMBLE 参数';
  modal.show = true;
};

const showAction = (title, message) => {
  modal.title = title;
  modal.message = message;
  modal.show = true;
};

onBeforeUnmount(() => clearInterval(timer));
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
.pipeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.steps {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.step {
  flex: 1 1 150px;
  background: #f8fafc;
  border-radius: 18px;
  padding: 0.9rem;
}
.step h4 {
  margin: 0 0 0.3rem;
}
.step span {
  font-size: 0.8rem;
  color: #94a3b8;
}
.actions {
  display: flex;
  gap: 0.8rem;
}
button {
  border: none;
  border-radius: 16px;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(120deg, #22d3ee, #6366f1);
  color: #fff;
  cursor: pointer;
}
button.ghost {
  background: rgba(99, 102, 241, 0.12);
  color: #4c1d95;
}
.status ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.status li {
  background: #f8fafc;
  padding: 0.8rem 1rem;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status strong {
  color: #0f172a;
}
.status em {
  color: #22c55e;
}
</style>

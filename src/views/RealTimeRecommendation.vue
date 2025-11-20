<template>
  <div class="module-shell">
    <header>
      <div>
        <h3>实时推荐系统</h3>
        <p>监测流式管道与响应时间，保证每条请求都可实时决策。</p>
      </div>
      <div class="actions">
        <button @click="showAlert = true">熔断配置</button>
        <button class="primary" @click="showStream = true">刷新流</button>
      </div>
    </header>
    <section class="status-panel">
      <article>
        <h4>当前 QPS</h4>
        <strong>42.5k</strong>
        <small>平均响应 68ms</small>
      </article>
      <article>
        <h4>延迟分布</h4>
        <div class="latency-bars">
          <span v-for="bucket in latency" :key="bucket" :style="{ height: bucket + 'px' }" />
        </div>
      </article>
      <article>
        <h4>节点状态</h4>
        <ul>
          <li v-for="node in nodes" :key="node.name">
            <span :class="node.status" />
            <p>{{ node.name }}</p>
            <small>{{ node.desc }}</small>
          </li>
        </ul>
      </article>
    </section>
    <section class="timeline">
      <h4>实时事件流</h4>
      <ul>
        <li v-for="event in events" :key="event.time">
          <span>{{ event.time }}</span>
          <p>{{ event.desc }}</p>
          <button @click="ack(event)">查看详情</button>
        </li>
      </ul>
    </section>
  </div>
  <BaseModal v-model:open="showAlert" title="熔断设置">
    <p>可为延迟 > 120ms 的请求开启局部熔断，并自动降级至上一版本。</p>
  </BaseModal>
  <BaseModal v-model:open="showStream" title="刷新成功">
    <p>实时流已重启，所有节点状态绿色，日志同步完成。</p>
  </BaseModal>
  <BaseModal v-model:open="showEvent" :title="activeEvent?.time || '事件详情'">
    <p>{{ activeEvent?.desc }}</p>
    <p>处理建议：同步算法团队评估是否需要调整权重。</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const latency = [40, 80, 60, 100, 72, 54, 66, 90]
const nodes = [
  { name: '北区集群', status: 'ok', desc: '负载 61%' },
  { name: '华南集群', status: 'ok', desc: '负载 58%' },
  { name: '海外集群', status: 'warn', desc: '负载 79%' }
]
const events = [
  { time: '10:01:12', desc: '海外节点延迟升高，自动扩容 2 台。' },
  { time: '10:02:44', desc: '推送频道 CTR 攀升，触发自适应调权。' },
  { time: '10:05:03', desc: '新增实验模型上线，占用 5% 流量。' }
]

const showAlert = ref(false)
const showStream = ref(false)
const showEvent = ref(false)
const activeEvent = ref(null)

const ack = (event) => {
  activeEvent.value = event
  showEvent.value = true
}
</script>

<style scoped>
.module-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  background: #e2e8f0;
}

button.primary {
  background: linear-gradient(135deg, #f97316, #fb7185);
  color: #fff;
}

.status-panel {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-panel article {
  flex: 1;
  min-width: 220px;
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
}

.latency-bars {
  display: flex;
  gap: 0.4rem;
  align-items: flex-end;
  margin-top: 1rem;
}

.latency-bars span {
  flex: 1;
  border-radius: 6px 6px 0 0;
  background: #f97316;
}

.status-panel ul {
  list-style: none;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.status-panel li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: center;
}

.status-panel li span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-panel li span.ok {
  background: #22c55e;
}

.status-panel li span.warn {
  background: #f97316;
}

.timeline {
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
}

.timeline ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.timeline li {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: center;
}

.timeline button {
  background: transparent;
  border: 1px dashed #f97316;
  color: #f97316;
}
</style>

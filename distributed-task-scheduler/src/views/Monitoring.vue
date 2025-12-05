<template>
  <div class="card">
    <div class="flex-between">
      <h2>任务监控</h2>
      <div class="actions">
        <button class="ghost" @click="openRealtime">实时状态</button>
        <button class="ghost" @click="openAlert">告警确认</button>
      </div>
    </div>
    <div class="grid" style="margin-top: 10px">
      <div class="card" v-for="node in nodes" :key="node.name">
        <div class="flex-between">
          <div>{{ node.name }}</div>
          <span class="tag">{{ node.role }}</span>
        </div>
        <div class="progress-bar" style="margin-top: 8px">
          <div :style="{ width: `${node.load}%` }"></div>
        </div>
        <p class="hint">负载 {{ node.load }}%，近 5 分钟失败 {{ node.failures }} 次。</p>
        <button class="ghost" @click="selectNode(node)">查看详情</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>任务</th>
          <th>节点</th>
          <th>耗时</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobs" :key="job.id">
          <td>{{ job.name }}</td>
          <td>{{ job.node }}</td>
          <td>{{ job.duration }} s</td>
          <td>{{ job.status }}</td>
          <td>
            <button class="ghost" @click="openTrace(job)">追踪</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showRealtime" class="modal-backdrop" @click.self="showRealtime = false">
    <div class="modal">
      <header>实时状态</header>
      <div class="body">
        <p>流量与队列长度正在拉取...</p>
        <div class="progress-bar" style="margin-top: 10px">
          <div :style="{ width: `${realtimeProgress}%` }"></div>
        </div>
      </div>
      <div class="footer">
        <button @click="showRealtime = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showAlert" class="modal-backdrop" @click.self="showAlert = false">
    <div class="modal">
      <header>告警确认</header>
      <div class="body">
        <p>确认清除 3 条已处理告警并记录备注？</p>
        <textarea rows="3" placeholder="填写处理说明"></textarea>
      </div>
      <div class="footer">
        <button @click="showAlert = false">取消</button>
        <button @click="confirmAlert">确认</button>
      </div>
    </div>
  </div>

  <div v-if="showNode" class="modal-backdrop" @click.self="showNode = false">
    <div class="modal">
      <header>节点详情：{{ currentNode?.name }}</header>
      <div class="body">
        <p>角色：{{ currentNode?.role }}，最近成功率 {{ currentNode?.success }}%。</p>
        <p>吞吐：{{ currentNode?.throughput }} t/min，延迟 P99 {{ currentNode?.latency }} ms。</p>
      </div>
      <div class="footer">
        <button @click="showNode = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTraceModal" class="modal-backdrop" @click.self="showTraceModal = false">
    <div class="modal">
      <header>链路追踪：{{ traceJob?.name }}</header>
      <div class="body">
        <p>节点 {{ traceJob?.node }} -> 队列 -> 执行耗时 {{ traceJob?.duration }}s。</p>
        <div class="progress-bar" style="margin-top: 8px">
          <div :style="{ width: `${traceJob?.duration ?? 0}%` }"></div>
        </div>
      </div>
      <div class="footer">
        <button @click="showTraceModal = false">完成</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const nodes = reactive([
  { name: '节点 A', role: '实时', load: 72, failures: 1, success: 99.1, throughput: 240, latency: 42 },
  { name: '节点 B', role: '离线', load: 44, failures: 0, success: 99.9, throughput: 160, latency: 35 },
  { name: '节点 C', role: 'GPU', load: 87, failures: 2, success: 97.8, throughput: 310, latency: 58 },
  { name: '节点 D', role: '调度', load: 55, failures: 0, success: 99.7, throughput: 190, latency: 41 },
  { name: '节点 E', role: '实时', load: 63, failures: 1, success: 98.8, throughput: 210, latency: 38 },
  { name: '节点 F', role: '离线', load: 32, failures: 0, success: 99.5, throughput: 130, latency: 30 },
  { name: '节点 G', role: 'GPU', load: 91, failures: 3, success: 96.5, throughput: 350, latency: 71 },
  { name: '节点 H', role: '存储', load: 48, failures: 0, success: 99.6, throughput: 175, latency: 29 },
  { name: '节点 I', role: '预处理', load: 59, failures: 0, success: 99.2, throughput: 200, latency: 36 },
  { name: '节点 J', role: '缓存', load: 67, failures: 1, success: 98.9, throughput: 205, latency: 40 },
]);

const jobs = reactive([
  { id: 1, name: '计算作业 A', node: '节点 C', duration: 42, status: '运行中' },
  { id: 2, name: '日志压缩', node: '节点 B', duration: 18, status: '完成' },
  { id: 3, name: '特征生成', node: '节点 A', duration: 33, status: '运行中' },
  { id: 4, name: '指标同步', node: '节点 D', duration: 12, status: '完成' },
  { id: 5, name: '报告汇总', node: '节点 E', duration: 26, status: '运行中' },
  { id: 6, name: '监控聚合', node: '节点 A', duration: 20, status: '排队' },
  { id: 7, name: '缓存刷新', node: '节点 J', duration: 16, status: '完成' },
  { id: 8, name: '备份验证', node: '节点 H', duration: 37, status: '运行中' },
  { id: 9, name: '离线训练', node: '节点 F', duration: 61, status: '运行中' },
  { id: 10, name: '热度排行', node: '节点 I', duration: 24, status: '排队' },
]);

const showRealtime = ref(false);
const showAlert = ref(false);
const showNode = ref(false);
const showTraceModal = ref(false);
const currentNode = ref(null);
const traceJob = ref(null);
const realtimeProgress = ref(35);

const openRealtime = () => {
  showRealtime.value = true;
  realtimeProgress.value = 35;
  setTimeout(() => (realtimeProgress.value = 88), 500);
};

const openAlert = () => {
  showAlert.value = true;
};

const selectNode = (node) => {
  currentNode.value = node;
  showNode.value = true;
};

const openTrace = (job) => {
  traceJob.value = job;
  showTraceModal.value = true;
};

const confirmAlert = () => {
  showAlert.value = false;
};
</script>

<style scoped>
h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.hint {
  color: #6a7a8b;
  font-size: 13px;
}
</style>

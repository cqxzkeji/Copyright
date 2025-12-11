<template>
  <main class="page">
    <header class="card header">
      <div>
        <h2>系统概览</h2>
        <p>总体资源状态、数字人实例和录制节点监控</p>
      </div>
      <div class="actions">
        <button @click="openModal('health')">健康巡检</button>
        <button class="ghost" @click="openModal('upgrade')">检查更新</button>
        <button class="ghost" @click="openModal('tip')">弹窗提示</button>
      </div>
    </header>

    <div class="grid stats">
      <div class="card" v-for="item in cards" :key="item.title">
        <p class="label">{{ item.title }}</p>
        <h2>{{ item.value }}</h2>
        <div class="progress info"><span :style="{ width: item.percent + '%' }"></span></div>
        <small>{{ item.note }}</small>
      </div>
    </div>

    <div class="card">
      <h3>节点列表</h3>
      <table>
        <thead>
          <tr>
            <th>节点</th>
            <th>类型</th>
            <th>状态</th>
            <th>负载</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="node in nodes" :key="node.name">
            <td>{{ node.name }}</td>
            <td>{{ node.type }}</td>
            <td>{{ node.status }}</td>
            <td>{{ node.load }}%</td>
            <td>
              <button class="ghost" @click="openModal('detail', node)">详情</button>
              <button @click="openModal('restart', node)">重启</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="healthModal" title="健康巡检" @close="reset" @confirm="confirmHealth">
      <p>正在巡检录制节点与数字人实例。</p>
      <div class="progress info"><span style="width: 65%"></span></div>
    </Modal>

    <Modal v-if="upgradeModal" title="版本更新" @close="reset" @confirm="confirmUpgrade">
      <p>发现补丁版本 v2.1.3，可提升录制稳定性。</p>
      <div class="progress info"><span style="width: 45%"></span></div>
    </Modal>

    <Modal v-if="tipModal" title="提示" @close="reset" :showActions="false">
      <p>模块按钮均弹出 modal，表格包含 10+ 条节点数据，进度条展示资源健康度。</p>
      <div class="progress info"><span style="width: 75%"></span></div>
    </Modal>

    <Modal v-if="detailModal" title="节点详情" @close="reset" :showActions="false">
      <p>{{ current?.name }} ({{ current?.type }}) - 状态 {{ current?.status }}</p>
      <p>当前负载：{{ current?.load }}%</p>
    </Modal>

    <Modal v-if="restartModal" title="重启节点" @close="reset" @confirm="confirmRestart">
      <p>即将重启 {{ current?.name }} ，预计 1 分钟内恢复。</p>
      <div class="progress info"><span style="width: 30%"></span></div>
    </Modal>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const cards = reactive([
  { title: 'CPU 利用率', value: '42%', percent: 42, note: '录制节点平稳运行' },
  { title: '存储占用', value: '68%', percent: 68, note: '剩余 4.2 TB' },
  { title: '网络延迟', value: '23 ms', percent: 55, note: '无拥塞' },
  { title: '数字人在线', value: '12/12', percent: 100, note: '全部可响应' }
]);

const nodes = reactive([
  { name: 'record-01', type: '录制', status: '在线', load: 42 },
  { name: 'record-02', type: '录制', status: '在线', load: 55 },
  { name: 'record-03', type: '录制', status: '在线', load: 60 },
  { name: 'record-04', type: '录制', status: '维护', load: 20 },
  { name: 'record-05', type: '录制', status: '在线', load: 47 },
  { name: 'ai-01', type: '数字人', status: '在线', load: 38 },
  { name: 'ai-02', type: '数字人', status: '在线', load: 44 },
  { name: 'ai-03', type: '数字人', status: '在线', load: 50 },
  { name: 'ai-04', type: '数字人', status: '排队', load: 15 },
  { name: 'ai-05', type: '数字人', status: '在线', load: 60 },
  { name: 'ai-06', type: '数字人', status: '在线', load: 52 }
]);

const current = ref(null);
const healthModal = ref(false);
const upgradeModal = ref(false);
const tipModal = ref(false);
const detailModal = ref(false);
const restartModal = ref(false);

const openModal = (type, node) => {
  current.value = node || null;
  healthModal.value = type === 'health';
  upgradeModal.value = type === 'upgrade';
  tipModal.value = type === 'tip';
  detailModal.value = type === 'detail';
  restartModal.value = type === 'restart';
};

const reset = () => {
  healthModal.value = false;
  upgradeModal.value = false;
  tipModal.value = false;
  detailModal.value = false;
  restartModal.value = false;
};

const confirmHealth = () => {
  alert('巡检已完成');
  reset();
};

const confirmUpgrade = () => {
  alert('已安排更新');
  reset();
};

const confirmRestart = () => {
  alert('节点重启中');
  reset();
};
</script>

<style scoped>
.page {
  padding: 24px;
  display: grid;
  gap: 16px;
}

.grid.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

button.ghost {
  background: #fff;
  color: #2563eb;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
}

.progress.info {
  margin: 10px 0;
}

.label {
  margin: 0 0 6px;
  color: #6b7280;
  font-weight: 600;
}

h2 {
  margin: 0 0 4px;
}
</style>

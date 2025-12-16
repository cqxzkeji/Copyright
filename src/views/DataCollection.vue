<template>
  <section class="grid" style="gap: 16px;">
    <div class="card" style="padding: 16px; display: grid; gap: 10px;">
      <div class="topbar">
        <div>
          <h3 style="font-size: 18px;">流量采集控制</h3>
          <p style="color: var(--muted); font-size: 14px;">启动、暂停、校验接入状态，全部按钮均弹窗确认。</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button @click="openModal('start')">启动采集</button>
          <button style="background: #22c55e;" @click="openModal('validate')">校验接入</button>
          <button style="background: #eab308;" @click="openModal('stop')">暂停采集</button>
        </div>
      </div>
      <div style="display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        <div class="card" style="padding: 12px;">
          <div class="label">当前吞吐</div>
          <div style="font-size: 24px; font-weight: 700;">{{ metrics.throughput }} Mbps</div>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">接入探针</div>
          <div style="font-size: 24px; font-weight: 700;">{{ metrics.probes }}</div>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">延时</div>
          <div style="font-size: 24px; font-weight: 700;">{{ metrics.latency }} ms</div>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">实时丢包</div>
          <div style="font-size: 24px; font-weight: 700;">{{ metrics.loss }}%</div>
        </div>
      </div>
    </div>

    <DataTable
      title="采集任务列表"
      subtitle="不少于 10 条，展示各探针通道状态"
      :columns="columns"
      :rows="trafficSamples"
    >
      <template #cell-status="{ value }">
        <span class="badge" :class="value === '已接入' ? 'success' : 'warning'">{{ value }}</span>
      </template>
      <template #actions>
        <button style="background: #e2e8f0; color: var(--text);" @click="openModal('add')">新增探针</button>
      </template>
    </DataTable>
  </section>

  <ModalDialog v-model="modalVisible" :title="modalTitle" @confirm="confirmAction">
    <div v-if="activeAction === 'add'" class="grid" style="gap: 10px;">
      <label class="grid">
        <span class="label">探针名称</span>
        <input class="input" v-model="form.name" placeholder="例如：南区采集器" />
      </label>
      <label class="grid">
        <span class="label">接入地址</span>
        <input class="input" v-model="form.addr" placeholder="如：10.1.8.12:9000" />
      </label>
      <label class="grid">
        <span class="label">协议</span>
        <select class="select" v-model="form.proto">
          <option>TCP</option>
          <option>UDP</option>
          <option>HTTP</option>
        </select>
      </label>
    </div>
    <div v-else class="grid" style="gap: 10px;">
      <p style="color: var(--muted);">即将对采集服务执行「{{ modalTitle }}」。确认后展示进度。</p>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div style="color: var(--muted);">进度：{{ progress }}%</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import DataTable from '../components/DataTable.vue';
import ModalDialog from '../components/ModalDialog.vue';
import { trafficSamples } from '../services/mockData.js';
import { randomPercent } from '../utils/format.js';

const columns = [
  { key: 'source', label: '源地址' },
  { key: 'dest', label: '目的地址' },
  { key: 'protocol', label: '协议' },
  { key: 'bytes', label: '吞吐(KB/s)' },
  { key: 'status', label: '状态' }
];

const metrics = reactive({
  throughput: 186,
  probes: 5,
  latency: 36,
  loss: 0.8
});

const modalVisible = ref(false);
const activeAction = ref('');
const progress = ref(0);
const form = reactive({ name: '', addr: '', proto: 'TCP' });

const modalTitle = computed(() => {
  const map = { start: '启动采集', stop: '暂停采集', validate: '校验接入', add: '新增探针' };
  return map[activeAction.value] || '操作确认';
});

const openModal = (action) => {
  activeAction.value = action;
  progress.value = randomPercent();
  modalVisible.value = true;
};

const confirmAction = () => {
  progress.value = 100;
  setTimeout(() => {
    modalVisible.value = false;
  }, 600);
};
</script>

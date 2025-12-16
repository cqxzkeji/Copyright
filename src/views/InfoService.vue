<template>
  <section class="grid" style="gap: 16px;">
    <div class="card" style="padding: 16px; display: grid; gap: 10px;">
      <div class="topbar">
        <div>
          <h3 style="font-size: 18px;">恶意行为识别与检测</h3>
          <p style="color: var(--muted); font-size: 14px;">调用模型服务、下发阻断策略、查看实时告警。按钮均弹窗反馈。</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button style="background: #22c55e;" @click="openModal('detect')">实时检测</button>
          <button style="background: #f97316;" @click="openModal('block')">下发阻断</button>
          <button style="background: #6366f1;" @click="openModal('simulate')">模拟演练</button>
        </div>
      </div>
      <div style="display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <div class="card" style="padding: 12px;">
          <div class="label">在线模型</div>
          <div style="font-size: 22px; font-weight: 700;">MalNet-v2</div>
          <p style="color: var(--muted); font-size: 13px;">推理延时 32ms</p>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">今日告警</div>
          <div style="font-size: 22px; font-weight: 700;">{{ stats.alerts }}</div>
          <p style="color: var(--muted); font-size: 13px;">命中率 {{ stats.hitRate }}%</p>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">阻断策略</div>
          <div style="font-size: 22px; font-weight: 700;">{{ stats.policies }} 条</div>
          <p style="color: var(--muted); font-size: 13px;">生效率 {{ stats.applyRate }}%</p>
        </div>
      </div>
    </div>

    <DataTable
      title="威胁事件流"
      subtitle="不少于 10 条实时事件，每条支持操作"
      :columns="columns"
      :rows="threatEvents"
    >
      <template #cell-risk="{ value }">
        <span class="badge" :class="value === '高' ? 'danger' : value === '中' ? 'warning' : 'success'">{{ value }}</span>
      </template>
      <template #cell-status="{ value }">
        <span style="color: var(--muted);">{{ value }}</span>
      </template>
      <template #actions>
        <button style="background: #e2e8f0; color: #0f172a;" @click="openModal('dispatch')">派发研判</button>
      </template>
    </DataTable>
  </section>

  <ModalDialog v-model="visible" :title="modalTitle" @confirm="confirmAction">
    <div v-if="activeAction === 'block'" class="grid" style="gap: 10px;">
      <label class="grid">
        <span class="label">阻断类型</span>
        <select class="select" v-model="form.blockType">
          <option>IP 黑洞</option>
          <option>域名封禁</option>
          <option>会话重置</option>
        </select>
      </label>
      <label class="grid">
        <span class="label">目标</span>
        <input class="input" v-model="form.target" placeholder="10.0.0.12 或域名" />
      </label>
    </div>
    <div v-else class="grid" style="gap: 10px;">
      <p style="color: var(--muted);">{{ modalHint }}</p>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div style="color: var(--muted);">进度：{{ progress }}%</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import DataTable from '../components/DataTable.vue';
import ModalDialog from '../components/ModalDialog.vue';
import { threatEvents } from '../services/mockData.js';
import { randomPercent } from '../utils/format.js';

const stats = reactive({ alerts: 128, hitRate: 92, policies: 24, applyRate: 88 });

const columns = [
  { key: 'scene', label: '攻击场景' },
  { key: 'target', label: '目标节点' },
  { key: 'confidence', label: '可信度' },
  { key: 'risk', label: '风险' },
  { key: 'status', label: '处置状态' }
];

const visible = ref(false);
const activeAction = ref('');
const progress = ref(0);
const form = reactive({ blockType: 'IP 黑洞', target: '' });

const modalTitle = computed(() => {
  const map = {
    detect: '实时检测',
    block: '下发阻断',
    simulate: '模拟演练',
    dispatch: '派发研判'
  };
  return map[activeAction.value] || '操作';
});

const modalHint = computed(() =>
  activeAction.value === 'detect'
    ? '正在调用模型识别恶意行为，并同步流量片段信息。'
    : activeAction.value === 'simulate'
      ? '正在模拟攻击链路并回放检测逻辑。'
      : '正在派发事件给威胁分析人员。'
);

const openModal = (action) => {
  activeAction.value = action;
  progress.value = randomPercent();
  visible.value = true;
};

const confirmAction = () => {
  progress.value = 100;
  setTimeout(() => (visible.value = false), 600);
};
</script>

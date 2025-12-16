<template>
  <section class="grid" style="gap: 16px;">
    <div class="card" style="padding: 16px;">
      <div class="topbar" style="margin-bottom: 8px;">
        <div>
          <h3 style="font-size: 18px;">安全态势可视化</h3>
          <p style="color: var(--muted); font-size: 14px;">包含图与表，所有按钮均触发报表或导出弹窗。</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button @click="openModal('report')">生成报表</button>
          <button style="background: #22c55e;" @click="openModal('share')">分享快照</button>
        </div>
      </div>
      <div style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
        <div class="card" style="padding: 14px;">
          <div class="label">流量趋势</div>
          <div style="display: flex; align-items: flex-end; gap: 6px; height: 120px; margin-top: 12px;">
            <div v-for="(v, idx) in stats.trafficTrend" :key="idx" :style="barStyle(v)"></div>
          </div>
          <p style="color: var(--muted); font-size: 13px;">样本 7 天趋势</p>
        </div>
        <div class="card" style="padding: 14px;">
          <div class="label">威胁占比</div>
          <div style="display: grid; gap: 8px; margin-top: 12px;">
            <div v-for="item in stats.attackSplit" :key="item.label" style="display: grid; grid-template-columns: 120px 1fr 50px; align-items: center; gap: 6px;">
              <span>{{ item.label }}</span>
              <div class="progress-track"><div class="progress-bar" :style="{ width: item.value + '%' }"></div></div>
              <span style="text-align: right; color: var(--muted);">{{ item.value }}%</span>
            </div>
          </div>
        </div>
        <div class="card" style="padding: 14px;">
          <div class="label">告警分布</div>
          <ul style="margin-top: 12px; display: grid; gap: 6px; color: var(--muted);">
            <li>高危：{{ alertSplit.high }} 起</li>
            <li>中危：{{ alertSplit.medium }} 起</li>
            <li>低危：{{ alertSplit.low }} 起</li>
          </ul>
          <button style="margin-top: 12px; background: #f97316;" @click="openModal('drill')">态势下钻</button>
        </div>
      </div>
    </div>

    <DataTable
      title="周度检测报表"
      subtitle="不少于 10 条，可导出"
      :columns="columns"
      :rows="tableData"
    >
      <template #cell-status="{ value }">
        <span class="badge" :class="value === '完成' ? 'success' : 'warning'">{{ value }}</span>
      </template>
      <template #actions>
        <button style="background: #e2e8f0; color: #0f172a;" @click="openModal('export')">导出报表</button>
      </template>
    </DataTable>
  </section>

  <ModalDialog v-model="visible" :title="modalTitle" @confirm="confirmAction">
    <p style="color: var(--muted); margin-bottom: 8px;">{{ modalTip }}</p>
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <div style="color: var(--muted);">进度：{{ progress }}%</div>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import DataTable from '../components/DataTable.vue';
import ModalDialog from '../components/ModalDialog.vue';
import { visualizationStats } from '../services/mockData.js';
import { randomPercent } from '../utils/format.js';

const stats = reactive({ ...visualizationStats });
const alertSplit = reactive({ high: 18, medium: 26, low: 31 });

const columns = [
  { key: 'date', label: '日期' },
  { key: 'detected', label: '检测数' },
  { key: 'blocked', label: '阻断数' },
  { key: 'status', label: '状态' }
];

const tableData = Array.from({ length: 10 }).map((_, idx) => ({
  id: idx + 1,
  date: `2024-06-${(idx + 1).toString().padStart(2, '0')}`,
  detected: 240 + idx * 12,
  blocked: 90 + idx * 8,
  status: idx % 3 === 0 ? '处理中' : '完成'
}));

const visible = ref(false);
const activeAction = ref('');
const progress = ref(0);

const modalTitle = computed(() => {
  const map = { report: '生成报表', share: '分享快照', drill: '态势下钻', export: '导出报表' };
  return map[activeAction.value] || '操作确认';
});

const modalTip = computed(() => {
  const tips = {
    report: '正在汇总检测与告警数据，生成可下载报表。',
    share: '正在生成可分享的快照链接。',
    drill: '正在下钻高危告警，抽取特征细节。',
    export: '准备导出周度报表文件。'
  };
  return tips[activeAction.value] || '即将执行操作';
});

const barStyle = (v) => ({
  width: '12%',
  height: `${v}px`,
  background: 'linear-gradient(180deg, #93c5fd, #2563eb)',
  borderRadius: '10px 10px 4px 4px'
});

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

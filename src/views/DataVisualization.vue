<template>
  <div class="container">
    <div class="flex-between">
      <div>
        <h2>数据可视化</h2>
        <p class="muted">图表与表格呈现融合后的核心指标</p>
      </div>
      <div class="flex" style="gap: 10px;">
        <button class="ghost" @click="showExport = true">导出报表</button>
        <button class="secondary" @click="showRefresh = true">刷新数据</button>
      </div>
    </div>

    <div class="grid two" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); margin-top: 16px;">
      <ChartPanel
        title="业务质量得分"
        subtitle="融合后质量评分分布"
        :data="scoreData"
      />
      <div class="card">
        <div class="flex-between">
          <h3>指标列表</h3>
          <button class="ghost" @click="showNote = true">指标说明</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>指标</th>
              <th>当前值</th>
              <th>变化</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in metrics" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
              <td :style="{ color: item.trend.startsWith('+') ? '#16a34a' : '#dc2626' }">{{ item.trend }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showExport" class="modal-overlay" @click.self="showExport = false">
      <div class="modal">
        <div class="modal-header">
          <h3>导出报表</h3>
          <button class="ghost" @click="showExport = false">关闭</button>
        </div>
        <p>选择需要导出的格式：</p>
        <div class="tag-row">
          <span class="mini-tag" style="background:#eef2ff;color:#4338ca">PDF</span>
          <span class="mini-tag" style="background:#ecfeff;color:#0ea5e9">Excel</span>
          <span class="mini-tag" style="background:#fef9c3;color:#854d0e">图片</span>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showExport = false">取消</button>
          <button @click="showExport = false">导出</button>
        </div>
      </div>
    </div>

    <div v-if="showRefresh" class="modal-overlay" @click.self="showRefresh = false">
      <div class="modal">
        <div class="modal-header">
          <h3>刷新数据</h3>
          <button class="ghost" @click="showRefresh = false">关闭</button>
        </div>
        <p>正在从融合层同步最新数据，加载中…</p>
        <div class="progress">
          <div class="progress-bar" style="width: 55%; background: var(--primary);"></div>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showRefresh = false">稍后</button>
          <button @click="showRefresh = false">完成</button>
        </div>
      </div>
    </div>

    <div v-if="showNote" class="modal-overlay" @click.self="showNote = false">
      <div class="modal">
        <div class="modal-header">
          <h3>指标说明</h3>
          <button class="ghost" @click="showNote = false">关闭</button>
        </div>
        <ul>
          <li>业务连续性：结合系统可用性与数据延迟。</li>
          <li>用户体验：来自埋点与日志的错误率。</li>
          <li>运营效率：由产线节拍与资源利用率计算。</li>
        </ul>
        <div class="modal-actions">
          <button @click="showNote = false">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChartPanel from '../components/ChartPanel.vue';

const scoreData = [
  { label: '业务连续性', value: 82, color: '#3b82f6', desc: '稳定性保持高位' },
  { label: '用户体验', value: 76, color: '#10b981', desc: '错误率下降' },
  { label: '运营效率', value: 68, color: '#f59e0b', desc: '资源利用优化' },
  { label: '安全合规', value: 74, color: '#ef4444', desc: '合规检查通过' }
];

const metrics = [
  { name: '数据延迟', value: '820 ms', trend: '-35 ms' },
  { name: '融合覆盖率', value: '93%', trend: '+2%' },
  { name: '告警关闭率', value: '88%', trend: '+5%' },
  { name: '预测准确率', value: '91%', trend: '+1%' },
  { name: '报表生成时长', value: '4.2 s', trend: '-0.4 s' }
];

const showExport = ref(false);
const showRefresh = ref(false);
const showNote = ref(false);
</script>

<style scoped>
.muted { color: var(--muted); }
</style>

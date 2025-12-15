<template>
  <div class="container">
    <div class="flex-between" style="margin-bottom: 16px;">
      <div>
        <h2>系统总览</h2>
        <p class="muted">一览平台运行、数据流与融合健康度</p>
      </div>
      <div class="flex" style="gap: 10px;">
        <button class="ghost" @click="showHelp = true">模块说明</button>
        <button class="secondary" @click="showProgress = true">刷新全局</button>
      </div>
    </div>

    <div class="grid two" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
      <div class="card" v-for="card in summary" :key="card.title">
        <div class="flex-between">
          <h3>{{ card.title }}</h3>
          <span class="badge info">{{ card.tag }}</span>
        </div>
        <p class="stat">{{ card.value }}</p>
        <p class="muted">{{ card.desc }}</p>
      </div>
    </div>

    <div class="grid two" style="margin-top: 16px; grid-template-columns: 2fr 1.5fr;">
      <ChartPanel
        title="采集覆盖率"
        subtitle="按业务域统计有效数据源覆盖情况"
        :data="chartData"
      />
      <FusionStatus />
    </div>

    <div v-if="showHelp" class="modal-overlay" @click.self="showHelp = false">
      <div class="modal">
        <div class="modal-header">
          <h3>模块说明</h3>
          <button class="ghost" @click="showHelp = false">关闭</button>
        </div>
        <ul>
          <li>总览展示平台运行概况；</li>
          <li>数据采集、预处理、融合、可视化模块均可从顶部导航进入；</li>
          <li>按钮将拉起对应的操作弹窗。</li>
        </ul>
        <div class="modal-actions">
          <button @click="showHelp = false">知道了</button>
        </div>
      </div>
    </div>

    <div v-if="showProgress" class="modal-overlay" @click.self="showProgress = false">
      <div class="modal">
        <div class="modal-header">
          <h3>全局刷新</h3>
          <button class="ghost" @click="showProgress = false">关闭</button>
        </div>
        <p>正在同步最新运行指标，请稍候。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 80%; background: var(--primary);"></div>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showProgress = false">取消</button>
          <button @click="showProgress = false">完成刷新</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChartPanel from '../components/ChartPanel.vue';
import FusionStatus from '../components/FusionStatus.vue';

const summary = [
  { title: '活跃数据源', value: '48', desc: '近24小时保持在线的数据源数量', tag: '采集' },
  { title: '日均处理量', value: '2.1 TB', desc: '数据预处理与融合阶段的总吞吐', tag: '流量' },
  { title: '告警事件', value: '3', desc: '融合规则触发的高优先级事件', tag: '告警' },
  { title: '可视化看板', value: '12', desc: '对外发布的实时数据展示看板', tag: '大屏' }
];

const chartData = [
  { label: '设备健康', value: 78, color: '#3b82f6', desc: '设备稳定性持续提升' },
  { label: '业务日志', value: 66, color: '#10b981', desc: '日志采集完整性保持稳定' },
  { label: 'API数据', value: 54, color: '#f59e0b', desc: '接口数据需扩充安全域' },
  { label: '第三方接入', value: 41, color: '#ef4444', desc: '合作方对接仍在推进' }
];

const showHelp = ref(false);
const showProgress = ref(false);
</script>

<style scoped>
.muted { color: var(--muted); }
.stat { font-size: 30px; margin: 8px 0; font-weight: 700; }
</style>

<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h3>融合任务健康度</h3>
        <p class="muted">实时跟踪融合拓扑状态</p>
      </div>
      <button class="ghost" @click="showModal = true">刷新拓扑</button>
    </div>
    <div class="grid" style="gap: 10px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div class="topology-card" v-for="node in nodes" :key="node.name">
        <div class="flex-between">
          <div class="flex" style="gap: 8px;">
            <span class="status-dot" :style="{ background: node.color }"></span>
            <strong>{{ node.name }}</strong>
          </div>
          <span class="badge" :class="node.badge">{{ node.status }}</span>
        </div>
        <p class="muted">输入: {{ node.input }} · 输出: {{ node.output }}</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: `${node.load}%`, background: node.color }"></div>
        </div>
        <small class="muted">负载 {{ node.load }}%</small>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>拓扑刷新</h3>
          <button class="ghost" @click="showModal = false">关闭</button>
        </div>
        <p>正在同步最新融合节点运行图，请确认。</p>
        <div class="modal-actions">
          <button class="ghost" @click="showModal = false">取消</button>
          <button @click="showModal = false">同步完成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const nodes = [
  { name: '多模态对齐', status: '正常', badge: 'success', color: '#10b981', input: '图像+文本', output: '向量', load: 62 },
  { name: '指标归一化', status: '延迟', badge: 'warning', color: '#f59e0b', input: '结构化', output: '标准分', load: 74 },
  { name: '规则推理', status: '告警', badge: 'danger', color: '#ef4444', input: '事件流', output: '告警', load: 83 },
  { name: '特征融合', status: '正常', badge: 'success', color: '#3b82f6', input: '多模态', output: '特征表', load: 58 }
];
</script>

<style scoped>
.muted {
  margin: 4px 0;
  color: var(--muted);
}

.topology-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  background: #f9fafb;
}

.progress {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  margin: 6px 0;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}
</style>

<template>
  <div class="module flex-column">
    <div class="module-header flex-row">
      <div>
        <h2>故障检测与恢复</h2>
        <p>实时检测异常，自动化切换与回滚。</p>
      </div>
      <button class="primary-button" @click="startRecovery">启动恢复演练</button>
    </div>

    <div class="flex-row panels">
      <div class="card panel flex-column">
        <h3>故障告警</h3>
        <div class="alert" v-for="issue in issues" :key="issue.id">
          <div>
            <strong>{{ issue.title }}</strong>
            <p>{{ issue.desc }}</p>
          </div>
          <button class="secondary-button" @click="ack(issue.title)">确认</button>
        </div>
      </div>
      <div class="card panel flex-column">
        <h3>恢复拓扑</h3>
        <div class="topology">
          <div class="node primary">主库</div>
          <div class="links">
            <div class="line"></div>
            <div class="line"></div>
          </div>
          <div class="node standby">备库 A</div>
          <div class="node standby">备库 B</div>
        </div>
      </div>
    </div>

    <div v-if="progressModal" class="modal-backdrop" @click="progressModal = false">
      <div class="modal-panel" @click.stop>
        <h3>演练进度</h3>
        <p>当前阶段：{{ stage }}</p>
        <div class="bar-track progress-track">
          <div class="bar-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <button class="primary-button" @click="progressModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const issues = [
  { id: 1, title: '延迟突增', desc: '节点 db-prod-01 延迟 220ms' },
  { id: 2, title: '复制偏移异常', desc: '备库 A 与主库偏移 320MB' }
];
const progressModal = ref(false);
const progress = ref(0);
const stage = ref('预检查');

const startRecovery = () => {
  progressModal.value = true;
  progress.value = 0;
  stage.value = '预检查';
  const steps = ['预检查', '复制冻结', '日志回放', '切换完成'];
  let idx = 0;
  const timer = setInterval(() => {
    progress.value += 25;
    stage.value = steps[idx];
    idx += 1;
    if (progress.value >= 100) {
      progress.value = 100;
      stage.value = '演练完成';
      clearInterval(timer);
    }
  }, 600);
};

const ack = (title) => {
  window.alert(`${title} 已入库并标记处理中`);
};
</script>

<style scoped>
.module {
  gap: 1.5rem;
}

.module-header {
  justify-content: space-between;
  align-items: center;
}

.panels {
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  gap: 1rem;
}

.alert {
  border: 1px solid #fee2e2;
  background: #fff7ed;
  padding: 1rem;
  border-radius: 14px;
  margin-bottom: 1rem;
}

.topology {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

.node {
  padding: 1rem 1.5rem;
  border-radius: 999px;
  color: #fff;
}

.primary {
  background: #fb7185;
}

.standby {
  background: #34d399;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.line {
  width: 60px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
}

.progress-track {
  height: 12px;
  margin: 1rem 0;
}
</style>

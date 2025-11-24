<template>
  <div class="dashboard flex-column">
    <header class="dashboard-header flex-row">
      <div>
        <h1>数据库运行总览</h1>
        <p>实时掌握实例运行状况，模块化切换至各类运维场景。</p>
      </div>
      <div class="flex-row header-actions">
        <button class="secondary-button" @click="showAlert('性能体检任务已加入队列')">性能体检</button>
        <button class="primary-button" @click="openProgressModal">一键巡检</button>
      </div>
    </header>

    <section class="overview flex-row">
      <div class="card health-card flex-column">
        <div class="flex-row health-stat">
          <div>
            <h3>资源利用率</h3>
            <p>{{ resourceStatus.cpu }}% CPU / {{ resourceStatus.memory }}% 内存</p>
          </div>
          <button class="secondary-button" @click="showAlert('已同步至监控告警中心')">同步告警</button>
        </div>
        <div class="chart-wrapper">
          <div class="chart-bar" v-for="(item, index) in chartSeries" :key="index">
            <span>{{ item.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <small>{{ item.value }}%</small>
          </div>
        </div>
      </div>
      <div class="card modules-card flex-column">
        <h3>快速进入模块</h3>
        <div class="modules flex-column">
          <button
            v-for="module in modules"
            :key="module.path"
            class="module-button flex-row"
            @click="navigate(module.path)"
          >
            <div>
              <strong>{{ module.name }}</strong>
              <p>{{ module.desc }}</p>
            </div>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>

    <section class="content-panel card">
      <RouterView />
    </section>

    <div v-if="progressModal" class="modal-backdrop" @click="progressModal = false">
      <div class="modal-panel" @click.stop>
        <h3>系统巡检任务</h3>
        <p>正在执行 {{ progress }}% ...</p>
        <div class="bar-track progress-track">
          <div class="bar-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <button class="primary-button" @click="progressModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const progressModal = ref(false);
const progress = ref(68);

const resourceStatus = {
  cpu: 54,
  memory: 63
};

const chartSeries = [
  { label: '读写负载', value: 72 },
  { label: '连接数', value: 48 },
  { label: '慢查询', value: 22 },
  { label: '备份进度', value: 89 }
];

const modules = [
  { name: '性能监控与优化', desc: 'SQL 画像、慢查询、索引建议', path: '/dashboard/performance' },
  { name: '安全管理', desc: '权限管控、审计、密钥轮换', path: '/dashboard/security' },
  { name: '故障检测与恢复', desc: '健康巡检、自动回滚', path: '/dashboard/fault' },
  { name: '报告与数据分析', desc: '成本分析、合规报告', path: '/dashboard/report' }
];

const navigate = (path) => {
  if (route.path !== path) {
    router.push(path);
  }
};

const showAlert = (message) => {
  window.alert(message);
};

const openProgressModal = () => {
  progress.value = 0;
  progressModal.value = true;
  const timer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 400);
};
</script>

<style scoped>
.dashboard {
  padding: 2.5rem;
  gap: 1.5rem;
}

.dashboard-header {
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin-bottom: 0.3rem;
}

.header-actions {
  gap: 0.75rem;
}

.overview {
  gap: 1.5rem;
  flex-wrap: wrap;
}

.health-card {
  flex: 2;
  gap: 1.5rem;
}

.modules-card {
  flex: 1;
  gap: 1rem;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.chart-bar span {
  width: 80px;
  color: #475569;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
}

.modules {
  gap: 0.8rem;
}

.module-button {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #fff;
  transition: border 0.2s ease, transform 0.2s ease;
}

.module-button:hover {
  border-color: #2563eb;
  transform: translateY(-2px);
}

.module-button p {
  margin: 0.2rem 0 0;
  color: #94a3b8;
}

.content-panel {
  min-height: 420px;
}

.progress-track {
  height: 12px;
  margin: 1rem 0;
}

@media (max-width: 960px) {
  .dashboard {
    padding: 1.5rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>

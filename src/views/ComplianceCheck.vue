<template>
  <div class="grid grid-2">
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">指标校核</div>
          <h3>合规检查</h3>
        </div>
        <div class="actions">
          <button class="btn btn-outline" @click="startCheck">一键校核</button>
          <button class="btn btn-primary" @click="openRectify">添加整改措施</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>要求</th>
            <th>当前值</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in checks" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.requirement }}</td>
            <td>{{ item.value }}</td>
            <td><span class="badge" :class="item.pass ? 'ok' : 'warn'">{{ item.pass ? '通过' : '预警' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">风险图</div>
          <h3>不足项热力</h3>
        </div>
        <button class="btn btn-outline" @click="openTips">提示信息</button>
      </header>
      <div class="heat">
        <div v-for="item in checks" :key="item.name" class="heat-row">
          <div class="label">{{ item.name }}</div>
          <div class="heat-bar">
            <div class="fill" :style="{ width: `${100 - item.value}%`, background: `linear-gradient(120deg, #ff6b6b, #ffd166 ${100 - item.value}%)` }"></div>
          </div>
          <span class="value">余量 {{ 100 - item.value }}%</span>
        </div>
      </div>
    </div>
  </div>
  <BaseModal v-if="showProgress" title="正在校核" @close="showProgress = false">
    <p>校核建筑限高、退线、容积率与噪声控制...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="muted">{{ progress }}%</p>
  </BaseModal>
  <BaseModal v-if="showRectify" title="新增整改" @close="showRectify = false" :actions="rectifyActions">
    <form class="modal-form" @submit.prevent>
      <label>整改项</label>
      <input v-model="rectify.name" />
      <label>措施</label>
      <textarea v-model="rectify.action" rows="3"></textarea>
    </form>
  </BaseModal>
  <BaseModal v-if="showTips" title="提示信息" @close="showTips = false" :actions="tipsActions">
    <p>对预警项优先调整退线与绿化率，降低违规概率。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const checks = reactive([
  { name: '容积率', requirement: '≤3.0', value: 2.6, pass: true },
  { name: '建筑限高', requirement: '≤80m', value: 76, pass: true },
  { name: '绿化率', requirement: '≥35%', value: 32, pass: false },
  { name: '退线控制', requirement: '≥6m', value: 5.2, pass: false },
  { name: '噪声敏感', requirement: '≤65dB', value: 62, pass: true }
]);

const showProgress = ref(false);
const showRectify = ref(false);
const showTips = ref(false);
const progress = ref(10);
const rectify = reactive({ name: '', action: '' });

const startCheck = () => {
  showProgress.value = true;
  progress.value = 10;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 22);
    if (progress.value >= 100) clearInterval(timer);
  }, 400);
};

const openRectify = () => (showRectify.value = true);
const openTips = () => (showTips.value = true);

const rectifyActions = [
  { label: '取消', onClick: () => (showRectify.value = false) },
  {
    label: '提交整改',
    primary: true,
    onClick: () => {
      if (rectify.name) {
        checks.push({ name: rectify.name, requirement: rectify.action, value: 0, pass: false });
        Object.assign(rectify, { name: '', action: '' });
        showRectify.value = false;
      }
    }
  }
];

const tipsActions = [{ label: '收到', primary: true, onClick: () => (showTips.value = false) }];
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.heat {
  display: grid;
  gap: 12px;
}

.heat-row {
  display: grid;
  grid-template-columns: 1fr 3fr 0.8fr;
  align-items: center;
  gap: 10px;
}

.heat-bar {
  height: 14px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 999px;
}

.fill {
  height: 100%;
  border-radius: 999px;
}

.badge.ok {
  color: #0f766e;
  background: rgba(79, 225, 185, 0.15);
}

.badge.warn {
  color: #c2410c;
  background: rgba(255, 179, 71, 0.2);
}

.modal-form {
  display: grid;
  gap: 10px;
}

input,
textarea {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(45, 123, 255, 0.3);
  font-family: inherit;
}

.muted {
  color: var(--muted);
}
</style>

<template>
  <div class="module-shell">
    <section class="module-header">
      <div>
        <h2>平台安全与保障</h2>
        <p>多重防护策略、链路安全与访问审计实时可视。</p>
      </div>
      <div class="header-btns">
        <button class="secondary-btn" @click="triggerScan">威胁扫描</button>
        <button class="primary-btn" @click="openModal('密钥轮换', '新的密钥已推送至所有控制节点。')">密钥轮换</button>
      </div>
    </section>

    <div class="security-grid">
      <div class="card" v-for="item in indicators" :key="item.title">
        <div class="indicator">
          <span class="status-dot" :style="{ background: item.color }"></span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
        <strong>{{ item.value }}</strong>
      </div>
    </div>

    <div class="log-panel">
      <h3>安全审计日志</h3>
      <div class="log-list">
        <div class="log-item" v-for="log in logs" :key="log.time">
          <strong>{{ log.time }}</strong>
          <p>{{ log.event }}</p>
          <button class="secondary-btn" @click="openModal('日志详情', log.event)">查看</button>
        </div>
      </div>
    </div>

    <BaseModal v-if="modal" :title="modal.title" @close="modal = null">
      {{ modal.message }}
    </BaseModal>

    <BaseModal v-if="showProgress" title="威胁扫描">
      <p>扫描进度 {{ progress }}%，正在分析链路...</p>
      <div class="progress-shell">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modal = ref(null);
const showProgress = ref(false);
const progress = ref(0);
let timer;

const indicators = ref([
  { title: '链路安全', desc: 'VPN + 量子密钥通道', value: '正常', color: '#22c55e' },
  { title: '入侵检测', desc: '近 24h 拦截', value: '32 次', color: '#f59e0b' },
  { title: '访问控制', desc: '多因子认证', value: '稳定', color: '#05c3dd' }
]);

const logs = ref([
  { time: '09:12', event: '北部指挥所 IP 白名单更新' },
  { time: '09:47', event: '自动化脚本拦截，风险等级：中' },
  { time: '10:15', event: '密钥轮换成功，批次 K-224' }
]);

const openModal = (title, message) => {
  modal.value = { title, message };
};

const triggerScan = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 500);
      openModal('扫描完成', '未检测到高危威胁，建议 4 小时后再次执行。');
    } else {
      progress.value += 18;
    }
  }, 300);
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.indicator {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.log-panel {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
}

.log-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.log-item button {
  align-self: flex-start;
}
</style>

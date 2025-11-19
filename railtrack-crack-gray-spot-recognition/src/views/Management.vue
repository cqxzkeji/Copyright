<template>
  <div class="module">
    <header class="panel">
      <div>
        <h3>系统管理与用户界面</h3>
        <p>配置多角色权限、作业流程与界面风格</p>
      </div>
      <div class="flex gap">
        <button @click="openModal('新增用户', '请前往用户管理界面录入人员信息')">新增用户</button>
        <button @click="openModal('界面主题', '深色主题已应用至所有终端')">应用主题</button>
      </div>
    </header>
    <section class="grid">
      <div class="card">
        <h4>用户活跃度</h4>
        <MiniChart :values="[10, 12, 18, 25, 30, 28, 32]" />
        <p>今日值班工程师 32 人</p>
      </div>
      <div class="card">
        <h4>权限变更</h4>
        <MiniChart :values="[1, 2, 1, 3, 2, 4, 2]" />
        <p>变更记录稳定</p>
      </div>
    </section>
    <section class="actions">
      <button @click="openModal('权限同步', '所有角色权限已同步到边缘节点')">权限同步</button>
      <button @click="openModal('系统备份', '配置和模型快照已备份至灾备中心')">系统备份</button>
      <button @click="startAudit">安全审计</button>
    </section>
  </div>
  <BaseModal :show="modal" :title="modalTitle" @close="modal = false">
    <p>{{ modalContent }}</p>
  </BaseModal>
  <BaseModal :show="auditModal" title="审计进度" @close="auditModal = false">
    <p>正在核查最近 500 条操作日志…</p>
    <div class="progress-bar">
      <div class="progress-bar__inner" :style="{ width: auditProgress + '%' }"></div>
    </div>
    <p>{{ auditProgress }}%</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import MiniChart from '../components/MiniChart.vue';
import BaseModal from '../components/BaseModal.vue';

const modal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const auditModal = ref(false);
const auditProgress = ref(0);

const openModal = (title, content) => {
  modalTitle.value = title;
  modalContent.value = content;
  modal.value = true;
};

const startAudit = () => {
  auditModal.value = true;
  auditProgress.value = 0;
  const timer = setInterval(() => {
    auditProgress.value += 20;
    if (auditProgress.value >= 100) {
      auditProgress.value = 100;
      clearInterval(timer);
      openModal('审计完成', '未发现高风险操作');
    }
  }, 300);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}

.panel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.grid .card {
  flex: 1;
  min-width: 240px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>

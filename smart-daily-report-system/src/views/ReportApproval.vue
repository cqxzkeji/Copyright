<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h2>日报审批</h2>
        <p>审批节点评级展示，支持即时反馈。</p>
      </div>
      <button class="primary" @click="showInfo = true">流程设置</button>
    </header>

    <div class="approvals">
      <article v-for="item in pending" :key="item.id" class="approval-card">
        <div class="header">
          <div>
            <h3>{{ item.owner }}</h3>
            <p>{{ item.team }} · {{ item.date }}</p>
          </div>
          <span class="badge">待审批</span>
        </div>
        <p class="summary">{{ item.summary }}</p>
        <div class="actions">
          <button class="outline" @click="openModal('意见模板：请补充风险说明。')">退回</button>
          <button class="primary" @click="approve(item)">通过</button>
        </div>
      </article>
    </div>

    <ModalDialog :show="showInfo" title="审批流程设置" @close="showInfo = false">
      <p>审批遵循“直属主管 → 项目负责人 → PMO”的多级流程，可按项目自定义。</p>
      <p>支持设置 SLA 超时时间，超期自动提醒上一节点。</p>
    </ModalDialog>

    <ModalDialog :show="Boolean(activeOpinion)" title="审批提醒" @close="activeOpinion = ''">
      <p>{{ activeOpinion }}</p>
    </ModalDialog>

    <ModalDialog :show="Boolean(approvedMember)" title="审批完成" @close="approvedMember = ''">
      <p>{{ approvedMember }} 的日报已通过，并同步至数据分析模块。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const pending = ref([
  {
    id: 1,
    owner: '张晨',
    team: 'AI 研发',
    date: '2024-05-13',
    summary: '完成模型训练第 3 轮，准确率 95%，需要 GPU 资源加速下一阶段。'
  },
  {
    id: 2,
    owner: '李玥',
    team: '数据分析',
    date: '2024-05-13',
    summary: '交付 2 份日报分析报告，待确认新增维度指标。'
  }
])

const showInfo = ref(false)
const activeOpinion = ref('')
const approvedMember = ref('')

const openModal = (message) => {
  activeOpinion.value = message
}

const approve = (item) => {
  approvedMember.value = item.owner
  pending.value = pending.value.filter((p) => p.id !== item.id)
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(15, 22, 58, 0.08);
}

.approvals {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.approval-card {
  border: 1px solid #e2e8fb;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  padding: 4px 12px;
  border-radius: 999px;
  background: #fff1d7;
  color: #b27900;
  font-size: 12px;
}

.summary {
  margin: 0;
  color: #4d5976;
}

.actions {
  display: flex;
  gap: 12px;
}

.primary,
.outline {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #4dc27d, #44ddc4);
  color: #fff;
}

.outline {
  border: 1px solid #ffc9a7;
  color: #e8792d;
  background: transparent;
}
</style>

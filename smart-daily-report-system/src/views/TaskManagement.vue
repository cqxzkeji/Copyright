<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h2>任务与项目管理</h2>
        <p>对接日报数据，自动生成项目推进看板和风险提醒。</p>
      </div>
      <button class="primary" @click="showCreate = true">新增任务</button>
    </header>

    <div class="tasks">
      <article v-for="task in tasks" :key="task.id" class="task-card">
        <div class="task-header">
          <div>
            <h3>{{ task.name }}</h3>
            <p>{{ task.owner }} · {{ task.deadline }}</p>
          </div>
          <span class="status" :class="task.status">{{ task.statusLabel }}</span>
        </div>
        <p>{{ task.desc }}</p>
        <div class="meta">
          <div>
            <strong>关联日报：</strong>{{ task.reports }} 份
          </div>
          <button class="outline" @click="openProgress(task)">查看进度</button>
        </div>
      </article>
    </div>

    <ModalDialog :show="showCreate" title="新增任务" @close="showCreate = false">
      <p>可直接从日报内容生成任务卡片，并自动分配给责任人。</p>
      <p>支持设置跨项目依赖与提醒节奏。</p>
    </ModalDialog>

    <ModalDialog :show="Boolean(activeTask)" title="任务进度" @close="activeTask = null">
      <template v-if="activeTask">
        <p>{{ activeTask.name }} 当前进度 {{ activeTask.progress }}%</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: activeTask.progress + '%' }"></div>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const tasks = ref([
  {
    id: 1,
    name: '智能报表示例项目',
    owner: '赵磊',
    deadline: '5月20日',
    status: 'on-track',
    statusLabel: '按计划',
    desc: '根据日报收集需求，迭代 V2.0 版本。',
    reports: 12,
    progress: 72
  },
  {
    id: 2,
    name: '指标补全专项',
    owner: '王敏',
    deadline: '5月18日',
    status: 'warning',
    statusLabel: '需关注',
    desc: '部分日报缺失业务指标，需统一模板。',
    reports: 9,
    progress: 48
  }
])

const showCreate = ref(false)
const activeTask = ref(null)

const openProgress = (task) => {
  activeTask.value = task
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

.tasks {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.task-card {
  border: 1px solid #e3eafc;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status.on-track {
  background: #e4f9f2;
  color: #0f9d58;
}

.status.warning {
  background: #fff4e5;
  color: #e37400;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress {
  width: 100%;
  height: 8px;
  background: #edf1fb;
  border-radius: 999px;
  margin-top: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
}

.primary,
.outline {
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #ff7eb3, #ff758c);
  color: #fff;
}

.outline {
  border: 1px solid #ffd6e3;
  color: #ff4f81;
  background: #fff;
}
</style>

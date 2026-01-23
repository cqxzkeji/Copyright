<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>现场验收</h2>
          <p>任务派发、问题记录与整改跟踪，确保问题闭环。</p>
        </div>
        <div class="action-group">
          <button class="primary-btn" @click="openModal('assign')">派发任务</button>
          <button class="secondary-btn" @click="openModal('issue')">记录问题</button>
          <button class="secondary-btn" @click="openModal('progress')">进度跟踪</button>
        </div>
      </div>
      <div class="progress-grid">
        <div class="progress-card">
          <h4>任务完成率</h4>
          <div class="progress-line">
            <div class="progress-fill" style="width: 72%;"></div>
          </div>
          <span>72%</span>
        </div>
        <div class="progress-card">
          <h4>问题整改率</h4>
          <div class="progress-line">
            <div class="progress-fill" style="width: 64%;"></div>
          </div>
          <span>64%</span>
        </div>
        <div class="progress-card">
          <h4>复检通过率</h4>
          <div class="progress-line">
            <div class="progress-fill" style="width: 88%;"></div>
          </div>
          <span>88%</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <h3>现场验收任务</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>任务编号</th>
              <th>验收区域</th>
              <th>责任人</th>
              <th>问题数</th>
              <th>整改进度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.area }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.issues }}</td>
              <td>{{ row.progress }}%</td>
              <td>
                <div class="action-group">
                  <button class="secondary-btn" @click="openModal('detail', row)">查看</button>
                  <button class="secondary-btn" @click="openModal('track', row)">跟踪</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'assign'">
        <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
          <label class="label">任务名称<input class="input" placeholder="输入验收任务" /></label>
          <label class="label">验收区域<select class="select"><option>消防系统</option><option>机电安装</option><option>公共区域</option></select></label>
          <label class="label">责任人<input class="input" placeholder="责任人" /></label>
          <label class="label">计划时间<input class="input" type="date" /></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'issue'">
        <p>现场问题已登记，系统自动生成整改清单并提醒责任单位。</p>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>整改进度实时更新：</p>
        <div class="progress-line">
          <div class="progress-fill" style="width: 64%;"></div>
        </div>
        <p class="progress-text">当前整改进度 64%</p>
      </template>
      <template v-else-if="activeModal === 'detail'">
        <p>{{ selected?.area }} 当前问题 {{ selected?.issues }} 项，进度 {{ selected?.progress }}%。</p>
      </template>
      <template v-else>
        <p>已为 {{ selected?.owner }} 启动整改跟踪提醒。</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `TASK-${3001 + index}`,
  area: ['消防系统', '机电安装', '公共区域'][index % 3],
  owner: ['陈工', '赵工', '周工'][index % 3],
  issues: 2 + (index % 5),
  progress: 50 + (index % 5) * 10
}));

const activeModal = ref('');
const selected = ref(null);

const modalTitle = computed(() => {
  const map = {
    assign: '派发验收任务',
    issue: '问题记录',
    progress: '整改进度',
    detail: '任务详情',
    track: '整改跟踪'
  };
  return map[activeModal.value] || '提示';
});

function openModal(type, row) {
  activeModal.value = type;
  selected.value = row || null;
}

function closeModal() {
  activeModal.value = '';
}

function confirmModal() {
  closeModal();
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: #fff;
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.progress-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-line {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #38bdf8, #22c55e);
}

.progress-text {
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
}

.label {
  font-size: 13px;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

@media (max-width: 960px) {
  .progress-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="page">
    <div class="grid summary" :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }">
      <div class="card summary-card">
        <h3>车型/座椅项目</h3>
        <p>在研项目 {{ projects.length }} 个，重点项目 6 个。</p>
        <div class="summary-actions">
          <button class="primary" type="button" @click="openModal('create')">新建项目</button>
          <button class="ghost" type="button" @click="openModal('tips')">操作提示</button>
        </div>
      </div>
      <div class="card summary-card">
        <h3>里程碑进度</h3>
        <p>当前平均完成率 72%，延期项目 2 个。</p>
        <div class="progress-bar"><span :style="{ width: '72%' }"></span></div>
        <button class="ghost" type="button" @click="openModal('progress')">查看进度弹窗</button>
      </div>
      <div class="card summary-card">
        <h3>座椅结构总览</h3>
        <img class="summary-image" src="/src/assets/seat-diagram.svg" alt="座椅结构示意" />
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>项目清单</h3>
          <p>覆盖车型规划、座椅系列与关键任务。</p>
        </div>
        <div class="table-actions">
          <button class="ghost" type="button" @click="openModal('task')">分配任务</button>
          <button class="primary" type="button" @click="openModal('schedule')">更新进度</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>项目编号</th>
            <th>车型</th>
            <th>座椅平台</th>
            <th>负责人</th>
            <th>进度</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.code">
            <td>{{ project.code }}</td>
            <td>{{ project.model }}</td>
            <td>{{ project.platform }}</td>
            <td>{{ project.owner }}</td>
            <td>{{ project.progress }}%</td>
            <td><span class="badge">{{ project.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'create'">
        <div class="input-group">
          <label>项目名称</label>
          <input v-model="form.name" placeholder="如：S9 豪华座椅项目" />
        </div>
        <div class="input-group">
          <label>车型平台</label>
          <input v-model="form.model" placeholder="如：X-Platform" />
        </div>
        <div class="input-group">
          <label>计划交付</label>
          <input v-model="form.deadline" type="date" />
        </div>
      </template>
      <template v-else-if="activeModal === 'task'">
        <div class="input-group">
          <label>任务名称</label>
          <input v-model="form.task" placeholder="如：泡沫密度方案" />
        </div>
        <div class="input-group">
          <label>负责人</label>
          <input v-model="form.owner" placeholder="工程师姓名" />
        </div>
        <div class="input-group">
          <label>截止日期</label>
          <input v-model="form.taskDate" type="date" />
        </div>
      </template>
      <template v-else-if="activeModal === 'schedule'">
        <div class="input-group">
          <label>选择项目</label>
          <select v-model="form.project">
            <option v-for="project in projects" :key="project.code" :value="project.code">
              {{ project.code }} - {{ project.model }}
            </option>
          </select>
        </div>
        <div class="input-group">
          <label>最新进度</label>
          <input v-model="form.progress" type="number" min="0" max="100" />
        </div>
        <div class="input-group">
          <label>风险说明</label>
          <textarea v-model="form.risk" rows="3" placeholder="说明风险与解决方案"></textarea>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>当前里程碑完成度为 72%，关键路径为结构仿真与供应商样件。</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span :style="{ width: '72%' }"></span>
        </div>
      </template>
      <template v-else-if="activeModal === 'tips'">
        <ul>
          <li>新建项目后需要立即绑定座椅平台与里程碑节点。</li>
          <li>每周更新进度时同步记录风险等级。</li>
          <li>任务分配建议与需求标准联动管理。</li>
        </ul>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const projects = [
  { code: 'P-001', model: 'S9 旗舰款', platform: 'X-Platform', owner: '李欣', progress: 82, status: '按计划' },
  { code: 'P-002', model: 'E7 运动款', platform: 'E-Platform', owner: '王凯', progress: 76, status: '按计划' },
  { code: 'P-003', model: 'V5 商务款', platform: 'V-Platform', owner: '陈昕', progress: 68, status: '轻微风险' },
  { code: 'P-004', model: 'Q3 城市款', platform: 'Q-Platform', owner: '刘雅', progress: 74, status: '按计划' },
  { code: 'P-005', model: 'H2 SUV款', platform: 'H-Platform', owner: '周晨', progress: 65, status: '风险' },
  { code: 'P-006', model: 'M6 MPV款', platform: 'M-Platform', owner: '林涛', progress: 80, status: '按计划' },
  { code: 'P-007', model: 'Z1 高性能', platform: 'Z-Platform', owner: '孙悦', progress: 70, status: '按计划' },
  { code: 'P-008', model: 'F8 旗舰款', platform: 'F-Platform', owner: '郭明', progress: 59, status: '风险' },
  { code: 'P-009', model: 'B4 入门款', platform: 'B-Platform', owner: '许婷', progress: 63, status: '按计划' },
  { code: 'P-010', model: 'K2 轻量化', platform: 'K-Platform', owner: '韩飞', progress: 71, status: '按计划' },
  { code: 'P-011', model: 'S8 豪华款', platform: 'X-Platform', owner: '郑鹏', progress: 69, status: '轻微风险' },
  { code: 'P-012', model: 'E5 运动款', platform: 'E-Platform', owner: '段慧', progress: 77, status: '按计划' },
  { code: 'P-013', model: 'V7 商务款', platform: 'V-Platform', owner: '张森', progress: 62, status: '风险' },
  { code: 'P-014', model: 'Q2 城市款', platform: 'Q-Platform', owner: '孔娜', progress: 73, status: '按计划' },
  { code: 'P-015', model: 'H5 SUV款', platform: 'H-Platform', owner: '沈越', progress: 58, status: '风险' },
  { code: 'P-016', model: 'M8 MPV款', platform: 'M-Platform', owner: '蒋程', progress: 81, status: '按计划' },
  { code: 'P-017', model: 'Z3 高性能', platform: 'Z-Platform', owner: '彭蕾', progress: 67, status: '按计划' },
  { code: 'P-018', model: 'F6 旗舰款', platform: 'F-Platform', owner: '许平', progress: 75, status: '按计划' },
  { code: 'P-019', model: 'B9 入门款', platform: 'B-Platform', owner: '宋琪', progress: 66, status: '轻微风险' },
  { code: 'P-020', model: 'K8 轻量化', platform: 'K-Platform', owner: '何卓', progress: 79, status: '按计划' },
];

const activeModal = ref('');
const form = reactive({
  name: '',
  model: '',
  deadline: '',
  task: '',
  owner: '',
  taskDate: '',
  project: projects[0].code,
  progress: 70,
  risk: '',
});

const modalTitle = computed(() => {
  const map = {
    create: '新建项目',
    task: '分配任务',
    schedule: '更新进度',
    progress: '进度概览',
    tips: '操作提示',
  };
  return map[activeModal.value] || '弹窗';
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const confirmModal = () => {
  closeModal();
};
</script>

<style scoped>
.summary {
  margin-bottom: 20px;
}

.summary-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-actions {
  display: flex;
  gap: 10px;
}

.summary-image {
  width: 100%;
  border-radius: 14px;
}

.table-card {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.primary {
  background: linear-gradient(90deg, #38bdf8, #4f46e5);
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.ghost {
  background: #e2e8f0;
  color: #334155;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
}
</style>

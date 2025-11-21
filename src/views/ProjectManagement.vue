<template>
  <div class="panel">
    <div class="flex space-between" style="margin-bottom: 12px">
      <div>
        <h2 style="margin: 0">装修项目管理</h2>
        <p class="page-sub">分解地下室及裙楼公区的装修分项，实时掌控状态</p>
      </div>
      <div class="flex" style="gap: 10px">
        <button @click="openProgress">批量更新进度</button>
        <button class="secondary" @click="showAddForm = true">新增项目</button>
      </div>
    </div>
    <div v-if="showAddForm" class="panel" style="margin-bottom: 16px">
      <h3 style="margin-top: 0">新增装修任务</h3>
      <div class="card-grid">
        <div>
          <label>项目名称</label>
          <input v-model="newProject.name" placeholder="地下室强电间整饰" />
        </div>
        <div>
          <label>责任人</label>
          <input v-model="newProject.owner" placeholder="王监理" />
        </div>
        <div>
          <label>计划完成</label>
          <input v-model="newProject.deadline" type="date" />
        </div>
        <div>
          <label>楼层/区域</label>
          <input v-model="newProject.zone" placeholder="B3 电梯厅" />
        </div>
      </div>
      <div class="flex space-between" style="margin-top: 14px">
        <button @click="createProject">保存并创建</button>
        <button class="secondary" @click="showAddForm = false">收起表单</button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="project in projects" :key="project.id" class="panel">
        <div class="flex space-between">
          <div>
            <p style="margin: 0; font-weight: 700">{{ project.name }}</p>
            <p class="page-sub">区域：{{ project.zone }}</p>
          </div>
          <span class="badge" :class="statusClass(project.status)">{{ project.status }}</span>
        </div>
        <div class="progress-bar" style="margin: 12px 0">
          <span :style="{ width: `${project.progress}%` }"></span>
        </div>
        <p class="page-sub">责任人：{{ project.owner }} ｜ 计划：{{ project.deadline }}</p>
        <div class="flex" style="margin-top: 10px">
          <button @click="showDetail(project)">查看进度</button>
          <button class="secondary" @click="markComplete(project)">标记完成</button>
        </div>
      </div>
    </div>

    <ModalDialog
      v-model="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :progress="progress"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const projects = reactive([
  {
    id: 1,
    name: '地下三层消防泵房饰面',
    owner: '刘监理',
    deadline: '2024-05-20',
    status: '进行中',
    zone: 'B3 设备区',
    progress: 45,
  },
  {
    id: 2,
    name: '裙楼大堂地砖铺贴',
    owner: '张监理',
    deadline: '2024-05-28',
    status: '待验收',
    zone: '裙楼一层大堂',
    progress: 80,
  },
  {
    id: 3,
    name: '地下二层车库照明优化',
    owner: '王监理',
    deadline: '2024-06-01',
    status: '计划中',
    zone: 'B2 停车区',
    progress: 10,
  },
]);

const showAddForm = ref(false);
const newProject = reactive({ name: '', owner: '', deadline: '', zone: '' });
const showModal = ref(false);
const modalMessage = ref('');
const modalTitle = ref('');
const progress = ref(null);

const statusClass = (status) => {
  if (status === '待验收') return 'tag-blue';
  if (status === '进行中') return 'tag-orange';
  if (status === '完成') return 'tag-green';
  return '';
};

const showDetail = (project) => {
  modalTitle.value = project.name;
  modalMessage.value = `当前进度 ${project.progress}% ，请关注关键节点：${project.zone}。`;
  progress.value = project.progress;
  showModal.value = true;
};

const markComplete = (project) => {
  project.status = '完成';
  project.progress = 100;
  modalTitle.value = '完成确认';
  modalMessage.value = `${project.name} 已完成，自动同步至验收计划。`;
  progress.value = 100;
  showModal.value = true;
};

const openProgress = () => {
  modalTitle.value = '批量更新';
  modalMessage.value = '正在拉取现场看板数据，自动刷新进度条。';
  progress.value = 0;
  showModal.value = true;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 200);
};

const createProject = () => {
  if (!newProject.name || !newProject.owner) {
    modalTitle.value = '信息不完整';
    modalMessage.value = '请填写项目名称和责任人。';
    progress.value = null;
    showModal.value = true;
    return;
  }
  projects.push({
    id: Date.now(),
    name: newProject.name,
    owner: newProject.owner,
    deadline: newProject.deadline || '待排期',
    zone: newProject.zone || '未指定',
    status: '计划中',
    progress: 0,
  });
  Object.assign(newProject, { name: '', owner: '', deadline: '', zone: '' });
  modalTitle.value = '创建成功';
  modalMessage.value = '已生成新装修任务，并加入进度跟踪。';
  progress.value = null;
  showModal.value = true;
};
</script>

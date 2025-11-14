<template>
  <div class="module-grid">
    <div class="flat-card" style="grid-column: span 2">
      <header class="section-header">
        <div>
          <h3>后台任务监控</h3>
          <p>多端展示联动 · 支持 VR/PC 同屏</p>
        </div>
        <button class="primary-btn" @click="publishDisplay">推送到大屏</button>
      </header>
      <table class="task-table">
        <thead>
          <tr>
            <th>任务</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in adminTasks" :key="task.id">
            <td>{{ task.name }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.status }}</td>
            <td>
              <button class="secondary-btn" @click="openTask(task)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>展示素材管理</h3>
          <p>上传后自动同步 VR 展馆</p>
        </div>
      </header>
      <div class="upload-card">
        <p>支持 MP4、WebVR、图片</p>
        <input type="file" @change="uploadAsset" />
      </div>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>后台通知</h3>
          <p>系统消息与审批提醒</p>
        </div>
        <button class="secondary-btn" @click="markAllRead">全部已读</button>
      </header>
      <ul class="notice-list">
        <li v-for="notice in notices" :key="notice.id">
          <h4>{{ notice.title }}</h4>
          <p>{{ notice.desc }}</p>
        </li>
      </ul>
    </div>
  </div>
  <BaseModal v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
    <p>{{ modal.message }}</p>
    <div v-if="modal.progress !== null" class="progress-container" style="margin-top: 16px">
      <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const adminTasks = [
  { id: 1, name: 'VR 场景升级', owner: '朱工', status: '运行中' },
  { id: 2, name: '移动端巡检', owner: '王宁', status: '待上线' },
  { id: 3, name: 'AI 模型调优', owner: '刘晨', status: '验证中' }
];

const notices = reactive([
  { id: 1, title: '后台安全补丁', desc: '2024-05-26 已完成补丁安装，重启 Web 服务。' },
  { id: 2, title: '新场景上线审批', desc: '新建“危废分拣 VR 教学”待审批，请在今日完成。' }
]);

const modal = reactive({ visible: false, title: '', message: '', progress: null });

const publishDisplay = () => {
  modal.visible = true;
  modal.title = '推送中';
  modal.message = '正在把任务看板同步到展厅大屏…';
  modal.progress = 64;
};

const openTask = (task) => {
  modal.visible = true;
  modal.title = '任务详情';
  modal.message = `${task.name} 负责人 ${task.owner}，状态：${task.status}`;
  modal.progress = null;
};

const uploadAsset = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  modal.visible = true;
  modal.title = '素材上传';
  modal.message = `${file.name} 已上传并同步 VR 展馆。`;
  modal.progress = 100;
};

const markAllRead = () => {
  modal.visible = true;
  modal.title = '通知';
  modal.message = '所有通知已标记为已读。';
  modal.progress = null;
};
</script>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px;
}

thead {
  background: #f1f5f9;
}

tr:nth-child(even) {
  background: #f8fafc;
}

.upload-card {
  background: #eef2ff;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-list li {
  padding: 16px;
  background: #fff7ed;
  border-radius: 16px;
}
</style>

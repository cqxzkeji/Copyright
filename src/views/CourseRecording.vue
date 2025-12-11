<template>
  <main class="page">
    <header class="card header">
      <div>
        <h2>课程录制与管理</h2>
        <p>记录课程素材、上传文件并实时查看录制进度</p>
      </div>
      <div class="actions">
        <button @click="openModal('start')">开始录制</button>
        <button class="ghost" @click="openModal('upload')">上传课件</button>
        <button class="ghost" @click="openModal('alert')">录制提示</button>
      </div>
    </header>

    <div class="card">
      <h3>录制中的课程</h3>
      <table>
        <thead>
          <tr>
            <th>课程</th>
            <th>讲师</th>
            <th>状态</th>
            <th>进度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in courses" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.teacher }}</td>
            <td>{{ item.status }}</td>
            <td>
              <div class="progress"><span :style="{ width: item.progress + '%' }"></span></div>
              {{ item.progress }}%
            </td>
            <td>
              <button class="ghost" @click="openModal('detail', item)">查看</button>
              <button @click="openModal('sync', item)">同步</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="startModal" title="开始录制" @close="reset" @confirm="confirmStart">
      <form class="form">
        <label>课程名称<input v-model="form.name" placeholder="机器学习" /></label>
        <label>录制模式<select v-model="form.mode"><option>全景摄像</option><option>屏幕录制</option><option>音频采集</option></select></label>
        <label>预计时长<input v-model="form.duration" type="number" min="1" /></label>
      </form>
    </Modal>

    <Modal v-if="uploadModal" title="上传课件" @close="reset" @confirm="confirmUpload">
      <form class="form">
        <label>文件名<input v-model="upload.file" placeholder="课件.pdf" /></label>
        <label>版本备注<input v-model="upload.note" placeholder="第二讲修订" /></label>
      </form>
    </Modal>

    <Modal v-if="alertModal" title="录制提示" @close="reset" :showActions="false">
      <p>录制按钮会唤起摄像头与屏幕捕获。请确认环境光线充足，麦克风正常。</p>
      <div class="progress info"><span style="width: 70%"></span></div>
      <p>质量评分 70% → 继续优化设备摆放。</p>
    </Modal>

    <Modal v-if="detailModal" title="课程详情" @close="reset" :showActions="false">
      <p>课程：{{ current?.name }}</p>
      <p>讲师：{{ current?.teacher }}</p>
      <p>模式：{{ current?.mode }}</p>
      <div class="progress info"><span :style="{ width: current?.progress + '%' }"></span></div>
    </Modal>

    <Modal v-if="syncModal" title="同步到云端" @close="reset" @confirm="confirmSync">
      <p>准备同步 {{ current?.name }} 的录制文件，预计 2 分钟。</p>
      <div class="progress info"><span style="width: 40%"></span></div>
    </Modal>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const courses = reactive([
  { name: '数据结构', teacher: '李雷', status: '录制中', progress: 72, mode: '全景摄像' },
  { name: '高等数学', teacher: '韩梅', status: '录制中', progress: 45, mode: '屏幕录制' },
  { name: '计算机网络', teacher: '王芳', status: '上传中', progress: 60, mode: '全景摄像' },
  { name: '线性代数', teacher: '陈晨', status: '录制中', progress: 30, mode: '屏幕录制' },
  { name: '大学物理', teacher: '周舟', status: '已完成', progress: 100, mode: '全景摄像' },
  { name: '人工智能导论', teacher: '吴新', status: '录制中', progress: 85, mode: '音频采集' },
  { name: '操作系统', teacher: '李华', status: '录制中', progress: 55, mode: '屏幕录制' },
  { name: '数据库原理', teacher: '赵云', status: '上传中', progress: 65, mode: '全景摄像' },
  { name: '软件工程', teacher: '谢苗', status: '录制中', progress: 40, mode: '音频采集' },
  { name: '英语演讲', teacher: 'Grace', status: '录制中', progress: 25, mode: '屏幕录制' },
  { name: 'Python 实战', teacher: 'Alex', status: '排队', progress: 10, mode: '屏幕录制' }
]);

const form = reactive({ name: '', mode: '全景摄像', duration: 45 });
const upload = reactive({ file: '', note: '' });
const current = ref(null);

const startModal = ref(false);
const uploadModal = ref(false);
const alertModal = ref(false);
const detailModal = ref(false);
const syncModal = ref(false);

const openModal = (type, item) => {
  current.value = item || null;
  startModal.value = type === 'start';
  uploadModal.value = type === 'upload';
  alertModal.value = type === 'alert';
  detailModal.value = type === 'detail';
  syncModal.value = type === 'sync';
};

const reset = () => {
  startModal.value = false;
  uploadModal.value = false;
  alertModal.value = false;
  detailModal.value = false;
  syncModal.value = false;
};

const confirmStart = () => {
  alert(`开始录制：${form.name || '未命名课程'} (${form.mode})`);
  reset();
};

const confirmUpload = () => {
  alert(`文件 ${upload.file || '未命名'} 已上传`);
  reset();
};

const confirmSync = () => {
  alert('同步任务已提交');
  reset();
};
</script>

<style scoped>
.page {
  padding: 24px;
  display: grid;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

button.ghost {
  background: #fff;
  color: #2563eb;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
}

.progress.info {
  margin: 10px 0;
}

.form {
  display: grid;
  gap: 10px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}
</style>

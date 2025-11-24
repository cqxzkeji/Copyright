<template>
  <div class="module">
    <header>
      <div>
        <h2>数据导出与共享</h2>
        <p>支持一键导出、共享链接以及开放平台推送。</p>
      </div>
      <button class="ghost" @click="openShare">共享链接</button>
    </header>

    <section class="export-panel">
      <label>选择数据集
        <select v-model="exportForm.dataset">
          <option>遥感裁剪成果</option>
          <option>地块地类图</option>
          <option>矢量道路网</option>
        </select>
      </label>
      <label>导出格式
        <select v-model="exportForm.format">
          <option>GeoJSON</option>
          <option>SHP</option>
          <option>CSV</option>
          <option>TIFF</option>
        </select>
      </label>
      <label>坐标系
        <select v-model="exportForm.crs">
          <option>CGCS2000</option>
          <option>WGS84</option>
        </select>
      </label>
      <label>分发方式
        <select v-model="exportForm.channel">
          <option>本地下载</option>
          <option>共享云盘</option>
          <option>开放 API</option>
        </select>
      </label>
      <button @click="exportData">开始导出</button>
      <p v-if="status" class="status">{{ status }}</p>
    </section>

    <section class="tasks">
      <h3>最近导出任务</h3>
      <div class="task" v-for="task in tasks" :key="task.id">
        <div>
          <strong>{{ task.name }}</strong>
          <p>{{ task.detail }}</p>
        </div>
        <button @click="download(task)">下载</button>
      </div>
    </section>

    <ModalDialog v-if="share" title="共享链接" @close="share = ''">
      <p>复制以下链接分享给协同单位：</p>
      <code>{{ share }}</code>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const exportForm = reactive({ dataset: '遥感裁剪成果', format: 'GeoJSON', crs: 'CGCS2000', channel: '本地下载' });
const status = ref('');
const share = ref('');
const tasks = ref([
  { id: 1, name: '土地利用成果包', detail: 'GeoJSON / 512MB / 2024-04-08' },
  { id: 2, name: '道路交通现势库', detail: 'SHP / 1.2GB / 2024-04-06' }
]);

const exportData = () => {
  status.value = `${exportForm.dataset} 已按照 ${exportForm.format} (${exportForm.crs}) 生成，分发方式：${exportForm.channel}`;
};

const download = (task) => {
  status.value = `${task.name} 下载任务已加入队列。`;
};

const openShare = () => {
  share.value = `https://geo-share.cn/${Date.now().toString(36)}`;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.export-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.export-panel label {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
select {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}
button {
  padding: 10px 18px;
  border-radius: 12px;
  background: linear-gradient(120deg, #a8ff78, #78ffd6);
  color: #0d1b2a;
  font-weight: 600;
}
.tasks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}
.status {
  flex-basis: 100%;
}
code {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  border-radius: 8px;
  display: inline-block;
}
.ghost {
  background: rgba(255, 255, 255, 0.15);
}
</style>

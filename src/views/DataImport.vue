<template>
  <div class="module">
    <header>
      <div>
        <h2>数据导入与采集</h2>
        <p>支持多源数据上传、在线采集和标准化质检。</p>
      </div>
      <button class="ghost" @click="openGuide">导入规范</button>
    </header>

    <section class="import-grid">
      <div class="card">
        <h3>批量文件导入</h3>
        <p>支持 SHP、GeoJSON、TIFF 等主流格式。</p>
        <label class="upload">
          <input type="file" multiple @change="handleFiles" />
          选择文件
        </label>
        <button @click="startBatch">开始导入</button>
        <ul>
          <li v-for="log in logs" :key="log">{{ log }}</li>
        </ul>
      </div>
      <div class="card">
        <h3>在线采集任务</h3>
        <p>配置采集范围与周期，系统自动抓取遥感切片。</p>
        <div class="form">
          <label>采集区域
            <select v-model="task.area">
              <option>长三角</option>
              <option>粤港澳大湾区</option>
              <option>京津冀</option>
            </select>
          </label>
          <label>采集频率
            <input type="number" v-model.number="task.frequency" min="1" /> 天 / 次
          </label>
          <label>最高云量阈值
            <input type="number" v-model.number="task.cloud" min="0" max="100" />%
          </label>
        </div>
        <button @click="scheduleTask">提交任务</button>
        <p class="status" v-if="taskMessage">{{ taskMessage }}</p>
      </div>
    </section>

    <ModalDialog v-if="guide" title="数据导入规范" @close="guide = false">
      <ul>
        <li>确保坐标系统一为 CGCS2000 或 WGS84。</li>
        <li>属性字段需包含唯一标识、更新时间和来源。</li>
        <li>数据量超过 1GB 时建议拆分批次上传。</li>
      </ul>
      <template #footer>
        <button class="ghost" @click="guide = false">我已知晓</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const logs = ref([]);
const guide = ref(false);
const taskMessage = ref('');
const task = reactive({ area: '长三角', frequency: 3, cloud: 25 });

const handleFiles = (event) => {
  const files = Array.from(event.target.files || []);
  logs.value = files.map((f) => `${f.name} 等待导入`);
};

const startBatch = () => {
  if (!logs.value.length) {
    logs.value = ['请先选择文件'];
    return;
  }
  logs.value = logs.value.map((item, index) => `${item} - 已完成 ${(index + 1) * 20}%`);
};

const scheduleTask = () => {
  taskMessage.value = `已为 ${task.area} 创建 ${task.frequency} 天 / 次 的采集任务，云量阈值 ${task.cloud}%。`;
};

const openGuide = () => (guide.value = true);
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
.import-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 280px;
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.upload {
  display: inline-flex;
  padding: 10px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.upload input {
  display: none;
}
button {
  padding: 10px 18px;
  border-radius: 12px;
  background: linear-gradient(120deg, #3dd598, #42a5f5);
  color: #fff;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.status {
  font-size: 0.9rem;
  opacity: 0.8;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
select,
input[type="number"] {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
}
.ghost {
  background: rgba(255, 255, 255, 0.15);
}
</style>

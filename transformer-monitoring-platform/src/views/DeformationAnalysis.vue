<template>
  <div class="module">
    <div class="card">
      <div class="header">
        <div>
          <h3>变形模型对比</h3>
          <p class="muted">基于历史工况与实时波形的拟合偏差</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openProgress('触发深度分析')">启动计算</button>
          <button class="btn secondary" @click="openForm('上传模型')">模型维护</button>
          <button class="btn ghost" @click="openAlert('已刷新分析日志，详细记录保存在系统管理。')">查看日志</button>
        </div>
      </div>
      <div class="bars">
        <div v-for="item in bars" :key="item.label" class="bar-row">
          <div class="bar-label">{{ item.label }}</div>
          <div class="bar-meter">
            <div class="bar-fill" :style="{ width: item.value + '%', background: item.color }"></div>
          </div>
          <div class="bar-value">{{ item.value }}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>异常波形片段</h3>
          <p class="muted">检测出的可疑区段，包含幅值、频段与定位信息</p>
        </div>
        <button class="btn" @click="openForm('追加验证标签')">标注异常</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>特征</th>
            <th>幅值</th>
            <th>概率</th>
            <th>定位</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="segment in segments" :key="segment.id">
            <td>{{ segment.id }}</td>
            <td>{{ segment.feature }}</td>
            <td>{{ segment.amplitude }}</td>
            <td>
              <span class="badge" :class="segment.badge">{{ segment.score }}</span>
            </td>
            <td>{{ segment.location }}</td>
            <td class="actions">
              <button class="btn secondary" @click="openAlert(`已下载波形 ${segment.id}`)">下载</button>
              <button class="btn ghost" @click="openProgress('正在重建波形…')">重建</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal-panel">
        <h3>{{ modal.title }}</h3>
        <form v-if="modal.type === 'form'" @submit.prevent="submitForm">
          <div class="form-row">
            <label>模型/文件</label>
            <input v-model="form.file" placeholder="输入文件名称或选择" required />
          </div>
          <div class="form-row">
            <label>备注说明</label>
            <textarea v-model="form.remark" rows="2"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn" type="submit">提交</button>
            <button class="btn ghost" type="button" @click="closeModal">取消</button>
          </div>
        </form>
        <div v-else-if="modal.type === 'progress'">
          <p class="muted">{{ modal.message }}</p>
          <div class="progress-bar"><div class="fill" :style="{ width: modal.progress + '%' }"></div></div>
          <p class="muted">{{ modal.progress }}% 完成</p>
          <div class="modal-actions">
            <button class="btn ghost" @click="closeModal">关闭</button>
          </div>
        </div>
        <div v-else>
          <p class="muted">{{ modal.message }}</p>
          <div class="modal-actions">
            <button class="btn" @click="closeModal">知道了</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const bars = [
  { label: '绕组轴向偏移', value: 72, color: '#1e88e5' },
  { label: '径向鼓包', value: 38, color: '#43a047' },
  { label: '夹件松动', value: 54, color: '#f59e0b' },
  { label: '铁芯偏斜', value: 29, color: '#ef4444' },
  { label: '绕组翘曲', value: 63, color: '#8b5cf6' },
];

const segments = reactive([
  { id: 'WF-101', feature: '三次谐波增强', amplitude: '0.82 g', score: '0.86', badge: 'success', location: '高压侧上层' },
  { id: 'WF-205', feature: '谐振峰偏移', amplitude: '1.12 g', score: '0.73', badge: 'warning', location: '铁芯下端' },
  { id: 'WF-318', feature: '冲击瞬态', amplitude: '1.54 g', score: '0.92', badge: 'danger', location: '夹件南侧' },
  { id: 'WF-422', feature: '零漂偏移', amplitude: '0.45 g', score: '0.61', badge: 'warning', location: '低压侧中部' },
  { id: 'WF-509', feature: '带宽压缩', amplitude: '0.67 g', score: '0.58', badge: 'warning', location: '套管末端' },
]);

const modal = reactive({ visible: false, type: 'alert', title: '', message: '', progress: 0 });
const form = reactive({ file: '', remark: '' });
const timer = ref(null);

const openForm = (title) => {
  modal.visible = true;
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (title) => {
  modal.visible = true;
  modal.type = 'progress';
  modal.title = title;
  modal.message = '正在调度 GPU 集群进行频谱分析…';
  modal.progress = 10;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer.value);
    } else {
      modal.progress += 18;
    }
  }, 500);
};

const openAlert = (message) => {
  modal.visible = true;
  modal.type = 'alert';
  modal.title = '提示';
  modal.message = message;
};

const submitForm = () => {
  modal.type = 'alert';
  modal.title = '提交成功';
  modal.message = '模型/标注已入库，将触发重新训练。';
};

const closeModal = () => {
  modal.visible = false;
  clearInterval(timer.value);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.bars {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.bar-row {
  display: grid;
  grid-template-columns: 130px 1fr 60px;
  gap: 10px;
  align-items: center;
}

.bar-meter {
  height: 12px;
  border-radius: 8px;
  background: #e2e8f0;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 8px;
}

.bar-value {
  font-weight: 700;
  text-align: right;
}

.actions {
  display: flex;
  gap: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
</style>

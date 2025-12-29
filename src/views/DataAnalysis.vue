<template>
  <LayoutShell>
    <div class="card">
      <div class="section-title">
        <h3>趋势分析</h3>
        <div class="toolbar">
          <button @click="openProgress('analysis')">运行分析</button>
          <button class="secondary" @click="openForm('model')">模型配置</button>
          <button class="outline" @click="openInfo('export')">导出报告</button>
        </div>
      </div>
      <div class="responsive-table">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>平均温度</th>
              <th>湿度</th>
              <th>压力</th>
              <th>异常概率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="point in trend" :key="point.time">
              <td>{{ point.time }}</td>
              <td>{{ point.temp }}℃</td>
              <td>{{ point.humidity }}%</td>
              <td>{{ point.pressure }} kPa</td>
              <td>{{ point.outlier }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid">
      <div class="stat-card" v-for="block in summary" :key="block.title">
        <div class="flex-between">
          <h4>{{ block.title }}</h4>
          <span class="badge">分析</span>
        </div>
        <div class="value">{{ block.value }}</div>
        <div class="progress-container" style="margin-top: 8px;">
          <div class="progress-bar" :style="{ width: block.progress + '%' }"></div>
        </div>
        <div class="small-text">{{ block.desc }}</div>
      </div>
    </div>

    <div v-if="modal.type === 'analysis'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>运行分析</h3>
          <span class="status-pill">计算中</span>
        </div>
        <p>正在执行趋势拟合与异常检测，请稍候。</p>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <div class="modal-footer">
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'model'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>模型配置</h3>
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
        <div class="input-group">
          <label>分析窗口 (分钟)</label>
          <input type="number" v-model.number="modelForm.window" />
        </div>
        <div class="input-group">
          <label>异常阈值 (%)</label>
          <input type="number" v-model.number="modelForm.threshold" />
        </div>
        <div class="modal-footer">
          <button class="outline" @click="closeModal">取消</button>
          <button class="secondary" @click="saveModel">保存</button>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'export'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>导出报告</h3>
          <button class="menu-button" @click="closeModal">完成</button>
        </div>
        <div class="alert">已生成 PDF 报告，包含趋势图、统计表与异常列表。</div>
        <div class="modal-footer">
          <button class="secondary" @click="closeModal">下载</button>
        </div>
      </div>
    </div>
  </LayoutShell>
</template>

<script setup>
import { reactive } from 'vue';
import LayoutShell from '../components/LayoutShell.vue';

const trend = Array.from({ length: 20 }).map((_, idx) => ({
  time: `08:${(idx + 1).toString().padStart(2, '0')}`,
  temp: (22 + idx * 0.5).toFixed(1),
  humidity: (55 + (idx % 5) * 2).toFixed(1),
  pressure: (101 + idx * 0.1).toFixed(1),
  outlier: (idx % 6) * 3
}));

const summary = [
  { title: '趋势斜率', value: '+0.5 /h', progress: 60, desc: '温度上升趋势稳定' },
  { title: '异常得分', value: '低风险', progress: 80, desc: '均在安全范围' },
  { title: '相关性', value: '0.82', progress: 82, desc: '温湿度相关度' }
];

const modal = reactive({ type: '', progress: 0 });
const modelForm = reactive({ window: 15, threshold: 8 });
let timer;

const openProgress = (type) => {
  modal.type = type;
  modal.progress = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 15);
    if (modal.progress >= 100) clearInterval(timer);
  }, 300);
};

const openForm = (type) => (modal.type = type);
const openInfo = (type) => (modal.type = type);

const saveModel = () => {
  alert(`窗口 ${modelForm.window} 分钟，异常阈值 ${modelForm.threshold}% 已更新`);
  modal.type = '';
};

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};
</script>

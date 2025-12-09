<template>
  <div class="card">
    <div class="section-title">😊 情绪追踪与分析</div>
    <p>结合表情识别、语音情感与生理信号推断情绪波动，便于每日干预。</p>
    <div class="button-group">
      <button class="btn" @click="showLogForm = true">记录情绪</button>
      <button class="btn secondary" @click="startProgress">重新评估</button>
      <button class="btn ghost" @click="showTip = true">查看提示</button>
    </div>
  </div>

  <div class="grid two" style="margin-top: 16px;">
    <div class="card">
      <div class="section-title">📈 情绪强度分布</div>
      <div class="chart-grid">
        <div class="simple-chart">
          <div v-for="item in moodSpectrum" :key="item.label" class="bar-row">
            <span>{{ item.label }}</span>
            <div class="bar"><span :style="{ width: item.value + '%' }"></span></div>
            <span style="text-align: right; font-weight: 700;">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">🧭 日志概览（10+条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>日期</th>
            <th>情绪</th>
            <th>强度</th>
            <th>触发事件</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in logs" :key="item.date + item.mood">
            <td>{{ item.date }}</td>
            <td>{{ item.mood }}</td>
            <td>{{ item.intensity }}</td>
            <td>{{ item.trigger }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showLogForm" class="modal-overlay" @click.self="showLogForm = false">
    <div class="modal">
      <h3>新增情绪记录</h3>
      <form @submit.prevent="addLog">
        <label>
          日期
          <input v-model="form.date" type="date" required />
        </label>
        <label>
          情绪
          <select v-model="form.mood">
            <option>积极</option>
            <option>平稳</option>
            <option>紧张</option>
            <option>焦虑</option>
          </select>
        </label>
        <label>
          强度 (1-10)
          <input v-model.number="form.intensity" type="number" min="1" max="10" required />
        </label>
        <label>
          触发事件
          <textarea v-model="form.trigger" rows="2" placeholder="描述当时情境"></textarea>
        </label>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="btn ghost" type="button" @click="showLogForm = false">取消</button>
          <button class="btn" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showTip" class="modal-overlay" @click.self="showTip = false">
    <div class="modal">
      <h3>分析提示</h3>
      <p>系统将同步摄像头、语音与可穿戴设备信号，提供跨场景情绪稳定度趋势。</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn" @click="showTip = false">明白了</button>
      </div>
    </div>
  </div>

  <div v-if="progressing" class="modal-overlay" @click.self="progressing = false">
    <div class="modal">
      <h3>情绪重新评估中</h3>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p style="margin-top: 10px;">整合语音与脑电特征，估算即时平稳度...</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn ghost" type="button" @click="progressing = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const moodSpectrum = [
  { label: '积极', value: 38 },
  { label: '平稳', value: 32 },
  { label: '紧张', value: 18 },
  { label: '焦虑', value: 12 }
];

const logs = reactive([
  { date: '2024-06-01', mood: '积极', intensity: 7, trigger: '与同学合作顺利' },
  { date: '2024-06-02', mood: '平稳', intensity: 5, trigger: '日常课程' },
  { date: '2024-06-03', mood: '紧张', intensity: 6, trigger: '项目截止' },
  { date: '2024-06-04', mood: '焦虑', intensity: 7, trigger: '考试临近' },
  { date: '2024-06-05', mood: '积极', intensity: 8, trigger: '导师肯定' },
  { date: '2024-06-06', mood: '平稳', intensity: 5, trigger: '社团活动' },
  { date: '2024-06-07', mood: '积极', intensity: 9, trigger: '演讲完成' },
  { date: '2024-06-08', mood: '紧张', intensity: 6, trigger: '小组讨论冲突' },
  { date: '2024-06-09', mood: '平稳', intensity: 4, trigger: '休息日' },
  { date: '2024-06-10', mood: '积极', intensity: 8, trigger: '学习突破' },
  { date: '2024-06-11', mood: '焦虑', intensity: 6, trigger: '等待成绩' }
]);

const showLogForm = ref(false);
const showTip = ref(false);
const progressing = ref(false);
const progress = ref(0);
const form = reactive({ date: '', mood: '积极', intensity: 5, trigger: '' });
let timer;

const addLog = () => {
  logs.unshift({ ...form });
  form.date = '';
  form.mood = '积极';
  form.intensity = 5;
  form.trigger = '';
  showLogForm.value = false;
};

const startProgress = () => {
  progressing.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 25);
    if (progress.value >= 100) clearInterval(timer);
  }, 400);
};
</script>

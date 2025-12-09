<template>
  <div class="card">
    <div class="section-title">👣 行为洞察</div>
    <p>聚合课堂互动、线上学习与社交移动轨迹，发现规律与异常行为。</p>
    <div class="button-group">
      <button class="btn" @click="showPattern = true">添加行为模式</button>
      <button class="btn secondary" @click="startProgress">运行模式识别</button>
      <button class="btn ghost" @click="showTip = true">提示</button>
    </div>
  </div>

  <div class="grid two" style="margin-top: 16px;">
    <div class="card">
      <div class="section-title">📊 行为占比</div>
      <div class="simple-chart">
        <div v-for="item in behaviors" :key="item.label" class="bar-row">
          <span>{{ item.label }}</span>
          <div class="bar"><span :style="{ width: item.value + '%' }"></span></div>
          <span style="text-align: right; font-weight: 700;">{{ item.value }}%</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">📌 行为事件表（10+条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>事件</th>
            <th>持续时长</th>
            <th>情境标签</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in events" :key="item.time + item.event">
            <td>{{ item.time }}</td>
            <td>{{ item.event }}</td>
            <td>{{ item.duration }}</td>
            <td>{{ item.tag }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showPattern" class="modal-overlay" @click.self="showPattern = false">
    <div class="modal">
      <h3>添加行为模式</h3>
      <form @submit.prevent="addPattern">
        <label>
          模式名称
          <input v-model="patternForm.name" required placeholder="晚间高强度学习" />
        </label>
        <label>
          场景
          <select v-model="patternForm.tag">
            <option>课堂</option>
            <option>宿舍</option>
            <option>图书馆</option>
            <option>户外</option>
          </select>
        </label>
        <label>
          时长 (分钟)
          <input v-model.number="patternForm.duration" type="number" min="10" />
        </label>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="btn ghost" type="button" @click="showPattern = false">取消</button>
          <button class="btn" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showTip" class="modal-overlay" @click.self="showTip = false">
    <div class="modal">
      <h3>洞察提示</h3>
      <p>模式识别将融合定位、交互和生理节律，可用于预测学习疲劳与社交倦怠。</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn" @click="showTip = false">明白</button>
      </div>
    </div>
  </div>

  <div v-if="progressing" class="modal-overlay" @click.self="progressing = false">
    <div class="modal">
      <h3>模式识别中</h3>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p style="margin-top: 10px;">正在扫描异常行为窗口...</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn ghost" type="button" @click="progressing = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const behaviors = [
  { label: '深度学习', value: 34 },
  { label: '社交互动', value: 22 },
  { label: '移动出行', value: 18 },
  { label: '休息放松', value: 26 }
];

const events = reactive([
  { time: '08:20', event: '课堂发言', duration: '25min', tag: '课堂' },
  { time: '09:40', event: '实验室编码', duration: '50min', tag: '科研' },
  { time: '11:10', event: '食堂交流', duration: '35min', tag: '社交' },
  { time: '12:30', event: '午休', duration: '45min', tag: '休息' },
  { time: '14:00', event: '图书馆学习', duration: '70min', tag: '学习' },
  { time: '15:30', event: '线上会议', duration: '40min', tag: '协作' },
  { time: '17:00', event: '操场跑步', duration: '30min', tag: '运动' },
  { time: '19:00', event: '晚间自习', duration: '90min', tag: '学习' },
  { time: '21:00', event: '宿舍交流', duration: '40min', tag: '社交' },
  { time: '22:10', event: '放松冥想', duration: '20min', tag: '放松' },
  { time: '22:40', event: '准备睡眠', duration: '25min', tag: '休息' }
]);

const showPattern = ref(false);
const showTip = ref(false);
const progressing = ref(false);
const progress = ref(0);
const patternForm = reactive({ name: '', tag: '课堂', duration: 30 });
let timer;

const addPattern = () => {
  events.push({ time: '新增', event: patternForm.name, duration: `${patternForm.duration}min`, tag: patternForm.tag });
  patternForm.name = '';
  patternForm.tag = '课堂';
  patternForm.duration = 30;
  showPattern.value = false;
};

const startProgress = () => {
  progressing.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 18);
    if (progress.value >= 100) clearInterval(timer);
  }, 350);
};
</script>

<template>
  <div class="card">
    <div class="section-title">🧠 认知分析</div>
    <p>融合脑电、行为作答速度与注意分布，评估认知负荷与任务匹配度。</p>
    <div class="button-group">
      <button class="btn" @click="showScenario = true">创建情景任务</button>
      <button class="btn secondary" @click="startProgress">推理认知负荷</button>
      <button class="btn ghost" @click="showNotice = true">提示</button>
    </div>
  </div>

  <div class="grid two" style="margin-top: 16px;">
    <div class="card">
      <div class="section-title">🎯 认知维度分布</div>
      <div class="simple-chart">
        <div v-for="item in cognitiveMix" :key="item.label" class="bar-row">
          <span>{{ item.label }}</span>
          <div class="bar"><span :style="{ width: item.value + '%' }"></span></div>
          <span style="text-align: right; font-weight: 700;">{{ item.value }}%</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">📋 任务表现表（10+条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>准确率</th>
            <th>反应时</th>
            <th>认知负荷</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.accuracy }}%</td>
            <td>{{ task.rt }}ms</td>
            <td>{{ task.load }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showScenario" class="modal-overlay" @click.self="showScenario = false">
    <div class="modal">
      <h3>创建情景任务</h3>
      <form @submit.prevent="addScenario">
        <label>
          任务名称
          <input v-model="scenarioForm.name" required placeholder="工作记忆干扰任务" />
        </label>
        <label>
          难度等级
          <select v-model="scenarioForm.load">
            <option>低</option>
            <option>中</option>
            <option>高</option>
          </select>
        </label>
        <label>
          目标准确率
          <input v-model.number="scenarioForm.target" type="number" min="60" max="100" />
        </label>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="btn ghost" type="button" @click="showScenario = false">取消</button>
          <button class="btn" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showNotice" class="modal-overlay" @click.self="showNotice = false">
    <div class="modal">
      <h3>认知提示</h3>
      <p>推理认知负荷时，将同步融合任务难度、心率变异与瞳孔直径变化。</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn" @click="showNotice = false">了解</button>
      </div>
    </div>
  </div>

  <div v-if="progressing" class="modal-overlay" @click.self="progressing = false">
    <div class="modal">
      <h3>推理中</h3>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p style="margin-top: 10px;">正在估算实时认知负荷...</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn ghost" type="button" @click="progressing = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const cognitiveMix = [
  { label: '注意资源', value: 36 },
  { label: '工作记忆', value: 28 },
  { label: '执行控制', value: 22 },
  { label: '情景理解', value: 14 }
];

const tasks = reactive([
  { name: 'N-back 2 阶', accuracy: 89, rt: 820, load: '中' },
  { name: 'Stroop', accuracy: 83, rt: 710, load: '中' },
  { name: '数字广度', accuracy: 92, rt: 650, load: '低' },
  { name: '工作记忆更新', accuracy: 78, rt: 930, load: '高' },
  { name: '情景推理', accuracy: 81, rt: 880, load: '高' },
  { name: '语义判断', accuracy: 86, rt: 760, load: '中' },
  { name: '空间旋转', accuracy: 74, rt: 940, load: '高' },
  { name: '注意闪烁', accuracy: 69, rt: 1020, load: '高' },
  { name: '反向跨度', accuracy: 88, rt: 840, load: '中' },
  { name: '双任务追踪', accuracy: 71, rt: 980, load: '高' },
  { name: '持续注意', accuracy: 90, rt: 770, load: '低' }
]);

const showScenario = ref(false);
const showNotice = ref(false);
const progressing = ref(false);
const progress = ref(0);
const scenarioForm = reactive({ name: '', load: '中', target: 85 });
let timer;

const addScenario = () => {
  tasks.push({ name: scenarioForm.name, accuracy: scenarioForm.target, rt: 900, load: scenarioForm.load });
  scenarioForm.name = '';
  scenarioForm.load = '中';
  scenarioForm.target = 85;
  showScenario.value = false;
};

const startProgress = () => {
  progressing.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value >= 100) clearInterval(timer);
  }, 350);
};
</script>

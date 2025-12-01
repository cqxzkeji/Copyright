<template>
  <div class="card">
    <h2>应用场景模拟与分析</h2>
    <p class="helper-text">模拟纳米膜在包装、过滤与生物医用场景下的服役表现。</p>
    <div class="flex">
      <button @click="showScenario = true">配置场景</button>
      <button @click="startScenario">运行场景模拟</button>
      <button @click="showInsight = true">风险提示</button>
    </div>

    <div class="grid" style="margin-top: 16px;">
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">应变响应</div>
        <div class="chart">
          <div v-for="item in strainData" :key="item.case" class="bar" :style="{ height: 70 + item.value * 1.4 + 'px', background: 'linear-gradient(180deg,#c3fbd8,#5edb8e)' }">
            <span>{{ item.value }} %</span>
            <small>{{ item.case }}</small>
          </div>
        </div>
      </div>
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">渗透性能</div>
        <div class="chart">
          <div v-for="item in permeateData" :key="item.case" class="bar" :style="{ height: 60 + item.value * 1.5 + 'px', background: 'linear-gradient(180deg,#c6d0ff,#6c7bff)' }">
            <span>{{ item.value }}</span>
            <small>{{ item.case }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="badge">模拟工况记录</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>场景</th>
              <th>温度 (℃)</th>
              <th>湿度 (%)</th>
              <th>压差 (Pa)</th>
              <th>耐久性评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in scenarios" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.temp }}</td>
              <td>{{ row.humidity }}</td>
              <td>{{ row.pressure }}</td>
              <td>{{ row.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showScenario" class="modal-mask">
    <div class="modal-container">
      <h3>配置模拟场景</h3>
      <div class="grid">
        <div class="input-row">
          <label>使用场景</label>
          <select v-model="scenarioForm.case">
            <option>食品包装</option>
            <option>空气过滤</option>
            <option>创面敷料</option>
          </select>
        </div>
        <div class="input-row">
          <label>目标湿度 (%)</label>
          <input v-model.number="scenarioForm.humidity" type="number" />
        </div>
        <div class="input-row">
          <label>温度 (℃)</label>
          <input v-model.number="scenarioForm.temp" type="number" />
        </div>
      </div>
      <div class="flex" style="justify-content: flex-end; margin-top: 12px;">
        <button @click="showScenario = false">保存配置</button>
      </div>
    </div>
  </div>

  <div v-if="showRun" class="modal-mask">
    <div class="modal-container">
      <h3>模拟运行中</h3>
      <p>正在计算多场耦合效应。</p>
      <div class="progress"><div :style="{ width: progress + '%' }"></div></div>
      <p class="helper-text">完成度：{{ progress }}%</p>
    </div>
  </div>

  <div v-if="showInsight" class="modal-mask">
    <div class="modal-container">
      <h3>风险提示</h3>
      <ul>
        <li>包装场景需注意高湿度导致的粘连，建议预涂抗粘剂。</li>
        <li>过滤场景应控制压差不超过 350 Pa 以防纤维塌陷。</li>
        <li>医疗场景需要额外的生物相容性测试与灭菌验证。</li>
      </ul>
      <div class="flex" style="justify-content: flex-end;">
        <button @click="showInsight = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue';

const strainData = [
  { case: '包装弯折', value: 4.2 },
  { case: '过滤压缩', value: 3.5 },
  { case: '医用拉伸', value: 5.1 },
  { case: '湿热循环', value: 4.8 }
];

const permeateData = [
  { case: '氧气透过', value: 420 },
  { case: '水蒸气透过', value: 180 },
  { case: '细菌阻隔', value: 99.2 },
  { case: '颗粒过滤', value: 96.5 }
];

const scenarios = [
  { name: '食品包装', temp: 25, humidity: 70, pressure: 120, score: 'A' },
  { name: '空气过滤', temp: 28, humidity: 55, pressure: 320, score: 'A-' },
  { name: '医用敷料', temp: 30, humidity: 80, pressure: 150, score: 'B+' },
  { name: '储运高温', temp: 40, humidity: 50, pressure: 200, score: 'B' },
  { name: '冷链运输', temp: 4, humidity: 65, pressure: 180, score: 'A' },
  { name: '高湿仓储', temp: 27, humidity: 90, pressure: 100, score: 'B' },
  { name: '户外暴露', temp: 35, humidity: 45, pressure: 260, score: 'B-' },
  { name: '呼吸防护', temp: 32, humidity: 60, pressure: 340, score: 'A-' },
  { name: '实验洁净', temp: 23, humidity: 40, pressure: 210, score: 'A' },
  { name: '工业排风', temp: 38, humidity: 48, pressure: 360, score: 'B-' }
];

const showScenario = ref(false);
const showRun = ref(false);
const showInsight = ref(false);
const progress = ref(0);
let timer;

const scenarioForm = reactive({ case: '食品包装', humidity: 65, temp: 25 });

const startScenario = () => {
  showRun.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 7);
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showRun.value = false), 800);
    }
  }, 280);
};

onBeforeUnmount(() => clearInterval(timer));
</script>

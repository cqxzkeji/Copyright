<template>
  <div class="card">
    <h2>纤维素纳米膜建模与分析</h2>
    <p class="helper-text">加载结构网格、设置纤维排列与孔隙率，快速生成纳米膜数字模型。</p>
    <div class="flex">
      <button @click="showImport = true">导入建模参数</button>
      <button @click="startSimulation">运行建模</button>
      <button @click="showSummary = true">查看分析提示</button>
    </div>
    <div class="grid" style="margin-top: 16px;">
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">厚度梯度</div>
        <div class="chart">
          <div v-for="item in thicknessData" :key="item.layer" class="bar" :style="{ height: 80 + item.value * 1.2 + 'px' }">
            <span>{{ item.value }} nm</span>
            <small>{{ item.layer }}</small>
          </div>
        </div>
      </div>
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">纤维取向分布</div>
        <div class="chart">
          <div v-for="item in orientationData" :key="item.axis" class="bar" :style="{ height: 80 + item.value + 'px', background: 'linear-gradient(180deg,#66e0ff,#2f80ed)' }">
            <span>{{ item.value }}%</span>
            <small>{{ item.axis }}</small>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="badge">生成的网格参数</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>单元尺寸 (nm)</th>
              <th>孔隙率</th>
              <th>密度 (g/cm³)</th>
              <th>层数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in meshRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.cell }}</td>
              <td>{{ row.porosity }}%</td>
              <td>{{ row.density }}</td>
              <td>{{ row.layers }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showImport" class="modal-mask">
    <div class="modal-container">
      <h3>导入建模参数</h3>
      <div class="input-row">
        <label>孔隙率范围</label>
        <input v-model="form.porosity" placeholder="例如 20-35%" />
      </div>
      <div class="input-row">
        <label>层间厚度 (nm)</label>
        <input v-model.number="form.thickness" type="number" min="10" />
      </div>
      <div class="input-row">
        <label>纤维排列方式</label>
        <select v-model="form.pattern">
          <option>交叉随机</option>
          <option>径向取向</option>
          <option>平行织构</option>
        </select>
      </div>
      <div class="flex" style="justify-content: flex-end; margin-top: 12px;">
        <button @click="saveImport">保存并更新</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <h3>建模进行中</h3>
      <p>正在根据参数生成纳米膜网格，预计 12 秒完成。</p>
      <div class="progress"><div :style="{ width: progress + '%' }"></div></div>
      <div class="helper-text">进度：{{ progress }}%</div>
    </div>
  </div>

  <div v-if="showSummary" class="modal-mask">
    <div class="modal-container">
      <h3>分析提示</h3>
      <ul>
        <li>建议孔隙率控制在 18%-32% 之间以平衡渗透性与强度。</li>
        <li>厚度梯度可通过减薄顶层来提高亲水性。</li>
        <li>径向取向有助于提高沿流向的抗拉强度。</li>
      </ul>
      <div class="flex" style="justify-content: flex-end;">
        <button @click="showSummary = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue';

const thicknessData = [
  { layer: 'L1', value: 28 },
  { layer: 'L2', value: 32 },
  { layer: 'L3', value: 30 },
  { layer: 'L4', value: 34 },
  { layer: 'L5', value: 29 }
];

const orientationData = [
  { axis: '0°', value: 22 },
  { axis: '30°', value: 18 },
  { axis: '60°', value: 15 },
  { axis: '90°', value: 25 },
  { axis: '随机', value: 20 }
];

const meshRows = [
  { id: 'M-01', cell: '5×5', porosity: 22, density: 1.21, layers: 6 },
  { id: 'M-02', cell: '6×6', porosity: 24, density: 1.18, layers: 5 },
  { id: 'M-03', cell: '5×8', porosity: 26, density: 1.16, layers: 8 },
  { id: 'M-04', cell: '8×8', porosity: 20, density: 1.25, layers: 4 },
  { id: 'M-05', cell: '10×10', porosity: 28, density: 1.15, layers: 7 },
  { id: 'M-06', cell: '12×12', porosity: 30, density: 1.12, layers: 9 },
  { id: 'M-07', cell: '6×10', porosity: 23, density: 1.17, layers: 6 },
  { id: 'M-08', cell: '7×7', porosity: 25, density: 1.19, layers: 5 },
  { id: 'M-09', cell: '9×9', porosity: 27, density: 1.14, layers: 8 },
  { id: 'M-10', cell: '11×11', porosity: 29, density: 1.13, layers: 10 }
];

const form = reactive({ porosity: '20-35%', thickness: 32, pattern: '交叉随机' });
const showImport = ref(false);
const showProgress = ref(false);
const showSummary = ref(false);
const progress = ref(0);
let timer;

const saveImport = () => {
  showImport.value = false;
};

const startSimulation = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 12;
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 600);
    }
  }, 300);
};

onBeforeUnmount(() => clearInterval(timer));
</script>

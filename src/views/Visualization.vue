<template>
  <div class="grid" style="grid-template-columns: 1.1fr 1fr;">
    <div class="card">
      <div class="flex-between">
        <div class="section-title">污染物分布</div>
        <span class="badge">PM2.5 / O3</span>
      </div>
      <p class="muted">快速预览多污染物空间分布，支持多情景对比。</p>
      <div class="legend">
        <div class="chart-bar" style="width: 70%;"></div>
        <span>高值</span>
        <div class="chart-bar" style="width: 30%; opacity:0.7;"></div>
        <span>低值</span>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-top:12px; gap:10px;">
        <div v-for="item in pollutantStats" :key="item.name" class="card" style="background:#f8fafc;">
          <div class="flex-between">
            <div>{{ item.name }}</div>
            <span class="badge">{{ item.scene }}</span>
          </div>
          <div class="progress-bar" style="margin-top:8px; height:18px;">
            <div class="progress-inner" :style="{ width: item.value + '%' }"></div>
          </div>
          <div class="muted" style="margin-top:6px;">平均浓度 {{ item.avg }} μg/m³</div>
        </div>
      </div>
      <div class="toolbar" style="margin-top: 12px;">
        <button @click="openCompare">多情景对比</button>
        <button @click="openExport">导出图件</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <div class="section-title">时序变化</div>
        <span class="badge">逐小时</span>
      </div>
      <p class="muted">查看未来 72 小时 PM2.5、O3 变化趋势。</p>
      <div class="grid" style="gap:8px;">
        <div v-for="point in timeSeries" :key="point.time" class="flex-between" style="background:#f8fafc; padding:10px; border-radius:10px;">
          <div>{{ point.time }}</div>
          <div class="progress-bar" style="width: 60%; height:12px;">
            <div class="progress-inner" :style="{ width: point.pm25 + '%' }"></div>
          </div>
          <div class="badge">PM2.5 {{ point.pm25 }} μg/m³</div>
        </div>
      </div>
      <div class="toolbar" style="margin-top:12px;">
        <button @click="openAlert">预警生成</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="flex-between">
      <div class="section-title">情景对比</div>
      <span class="badge">排放/方案</span>
    </div>
    <p class="muted">对比不同排放情景或物理方案下的浓度差异。</p>
    <table class="table">
      <thead>
        <tr>
          <th>情景</th><th>描述</th><th>PM2.5 改变</th><th>O3 改变</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="scene in scenes" :key="scene.name">
          <td>{{ scene.name }}</td>
          <td>{{ scene.desc }}</td>
          <td>{{ scene.pm }}%</td>
          <td>{{ scene.o3 }}%</td>
          <td><button @click="compare(scene.name)">查看</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showDialog" class="modal-overlay" @click.self="close">
    <div class="modal">
      <h3>{{ dialogTitle }}</h3>
      <p>请选择需要输出的图表或对比方案。</p>
      <form class="grid" style="gap:10px;" @submit.prevent="confirm">
        <div>
          <label>选择情景</label>
          <select v-model="form.scene">
            <option v-for="scene in scenes" :key="scene.name">{{ scene.name }}</option>
          </select>
        </div>
        <div>
          <label>输出格式</label>
          <select v-model="form.format">
            <option>PNG</option>
            <option>PDF</option>
            <option>NetCDF</option>
          </select>
        </div>
        <div class="toolbar">
          <button type="submit">确定</button>
          <button type="button" @click="close">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const pollutantStats = [
  { name: 'PM2.5', value: 76, avg: 68, scene: '基准' },
  { name: 'PM10', value: 52, avg: 82, scene: '基准' },
  { name: 'O3', value: 41, avg: 110, scene: '高温' },
  { name: 'NO2', value: 33, avg: 24, scene: '交通削减' },
  { name: 'SO2', value: 24, avg: 9, scene: '脱硫升级' }
];

const timeSeries = [
  { time: 'T+6', pm25: 32 },
  { time: 'T+12', pm25: 48 },
  { time: 'T+24', pm25: 70 },
  { time: 'T+36', pm25: 64 },
  { time: 'T+48', pm25: 40 }
];

const scenes = [
  { name: '基准', desc: '常规排放+默认物理方案', pm: 0, o3: 0 },
  { name: '交通削减', desc: '交通排放降低 30%', pm: -12, o3: 5 },
  { name: '工业减排', desc: '工业源削减 20%', pm: -18, o3: -2 },
  { name: '火点抑制', desc: '关闭农残焚烧', pm: -25, o3: 8 },
  { name: '高温情景', desc: '高温少云放大光化学', pm: 10, o3: 20 }
];

const showDialog = ref(false);
const dialogTitle = ref('');
const form = reactive({ scene: '基准', format: 'PNG' });

const openCompare = () => {
  dialogTitle.value = '情景对比导出';
  showDialog.value = true;
};

const openExport = () => {
  dialogTitle.value = '导出地图/曲线';
  showDialog.value = true;
};

const compare = (name) => {
  dialogTitle.value = `查看情景：${name}`;
  form.scene = name;
  showDialog.value = true;
};

const openAlert = () => {
  dialogTitle.value = '生成预警等级';
  showDialog.value = true;
};

const close = () => {
  showDialog.value = false;
};

const confirm = () => {
  alert(`已生成 ${form.scene} 情景的图件，格式：${form.format}`);
  showDialog.value = false;
};
</script>

<template>
  <div class="grid" style="grid-template-columns: 1.2fr 1fr;">
    <div class="card">
      <div class="flex-between">
        <div class="section-title">物理过程方案</div>
        <span class="badge">微物理/边界层/辐射</span>
      </div>
      <p class="muted">选择并组合适合区域的大气物理方案。</p>
      <table class="table">
        <thead>
          <tr>
            <th>过程</th><th>当前方案</th><th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in physics" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.scheme }}</td>
            <td>{{ item.note }}</td>
          </tr>
        </tbody>
      </table>
      <div class="toolbar" style="margin-top:12px;">
        <button @click="openForm('physics')">调整方案</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <div class="section-title">化学机制</div>
        <span class="badge">RACM / MOZART / CBMZ</span>
      </div>
      <p class="muted">针对不同情景选择合适的气溶胶与光化学机制。</p>
      <div class="chip-row">
        <span v-for="item in chemistry" :key="item" class="badge">{{ item }}</span>
      </div>
      <div class="toolbar" style="margin-top: 12px;">
        <button @click="openForm('chem')">切换机制</button>
        <button @click="openForm('aero')">气溶胶设置</button>
      </div>
      <div class="card" style="margin-top:14px; background:#f8fafc;">
        <div class="flex-between">
          <div>当前机制：{{ selectedChem }}</div>
          <span class="badge tag-success">已匹配排放</span>
        </div>
        <div class="progress-bar" style="margin-top:8px;">
          <div class="progress-inner" :style="{ width: '82%' }"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="flex-between">
      <div class="section-title">区域网格与嵌套</div>
      <span class="badge">多嵌套</span>
    </div>
    <p class="muted">设置多嵌套网格分辨率、时间步长与并行划分。</p>
    <table class="table">
      <thead>
        <tr>
          <th>网格 ID</th><th>分辨率</th><th>大小</th><th>时间步长</th><th>并行核数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grid in grids" :key="grid.id">
          <td>{{ grid.id }}</td>
          <td>{{ grid.resolution }}</td>
          <td>{{ grid.size }}</td>
          <td>{{ grid.dt }}</td>
          <td>{{ grid.cores }}</td>
        </tr>
      </tbody>
    </table>
    <div class="toolbar" style="margin-top: 12px;">
      <button @click="openForm('grid')">调整网格</button>
      <button @click="openForm('domain')">导入静态文件</button>
    </div>
  </div>

  <div v-if="showDialog" class="modal-overlay" @click.self="closeDialog">
    <div class="modal">
      <h3>{{ dialogTitle }}</h3>
      <form class="grid" style="gap:12px;" @submit.prevent="submit">
        <div>
          <label>关键参数</label>
          <input v-model="form.value" placeholder="如：mp_physics=8" required />
        </div>
        <div>
          <label>备注</label>
          <textarea v-model="form.note" rows="3" placeholder="记录原因或来源" />
        </div>
        <div class="toolbar">
          <button type="submit">保存</button>
          <button type="button" @click="closeDialog">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const physics = [
  { name: '微物理', scheme: 'WSM6', note: '适合华东梅雨期对流' },
  { name: '边界层', scheme: 'YSU', note: '高层混合好，适合城市边界层' },
  { name: '陆面', scheme: 'Noah LSM', note: '耦合土壤湿度' },
  { name: '积云', scheme: 'New Tiedtke', note: '海陆风弱对流' },
  { name: '辐射', scheme: 'RRTMG', note: '短波+长波' }
];

const chemistry = ['RACM', 'MOZART', 'CBMZ', 'GEOS-Chem Simplified'];
const selectedChem = 'RACM + MADE/SORGAM';

const grids = [
  { id: 'd01', resolution: '27 km', size: '120 x 100', dt: '120 s', cores: 64 },
  { id: 'd02', resolution: '9 km', size: '160 x 150', dt: '60 s', cores: 96 },
  { id: 'd03', resolution: '3 km', size: '200 x 220', dt: '30 s', cores: 128 },
  { id: 'd04', resolution: '1 km', size: '280 x 280', dt: '12 s', cores: 160 },
  { id: 'd05', resolution: '333 m', size: '320 x 320', dt: '6 s', cores: 200 }
];

const showDialog = ref(false);
const dialogTitle = ref('');
const form = reactive({ value: '', note: '' });

const openForm = (type) => {
  const names = {
    physics: '调整物理方案',
    chem: '切换化学机制',
    aero: '配置气溶胶模块',
    grid: '调整多嵌套网格',
    domain: '导入静态文件'
  };
  dialogTitle.value = names[type] || '参数配置';
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const submit = () => {
  alert('参数已保存并写入 namelist');
  showDialog.value = false;
  form.value = '';
  form.note = '';
};
</script>

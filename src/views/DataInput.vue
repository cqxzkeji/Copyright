<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
    <div class="card">
      <div class="flex-between">
        <div class="section-title">气象数据接入</div>
        <span class="badge">NCAR/NCEP</span>
      </div>
      <p class="muted">再分析场与地面/高空观测数据管理。</p>
      <div class="toolbar">
        <button @click="openDialog('met')">接入数据</button>
        <button @click="openDialog('qc')">质控规则</button>
      </div>
      <table class="table" style="margin-top: 12px;">
        <thead>
          <tr>
            <th>数据源</th><th>覆盖范围</th><th>状态</th><th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in metSources" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.area }}</td>
            <td><span class="badge" :class="item.ok ? 'tag-success' : 'tag-warning'">{{ item.ok ? '正常' : '待检查' }}</span></td>
            <td>{{ item.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between">
        <div class="section-title">排放源管理</div>
        <span class="badge">火电/工业/交通</span>
      </div>
      <p class="muted">统一管理多源排放清单并生成排放栅格。</p>
      <div class="toolbar">
        <button @click="openDialog('emission')">导入排放清单</button>
        <button @click="openDialog('grid')">栅格化</button>
      </div>
      <table class="table" style="margin-top: 12px;">
        <thead>
          <tr>
            <th>源类型</th><th>清单版本</th><th>覆盖年份</th><th>最近操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in emissionList" :key="item.type">
            <td>{{ item.type }}</td>
            <td>{{ item.version }}</td>
            <td>{{ item.year }}</td>
            <td>{{ item.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between">
        <div class="section-title">初始/边界场</div>
        <span class="badge">Chem IC/BC</span>
      </div>
      <p class="muted">自动生成化学初始场与边界场，支持多嵌套区域。</p>
      <div class="toolbar">
        <button @click="openDialog('init')">生成初始场</button>
        <button @click="openDialog('boundary')">生成边界场</button>
      </div>
      <div class="grid" style="grid-template-columns: 1fr; margin-top: 12px; gap: 10px;">
        <div v-for="item in chemStatus" :key="item.name" class="card" style="background:#f8fafc; border-style:dashed;">
          <div class="flex-between">
            <div>{{ item.name }}</div>
            <span class="badge" :class="item.status === '已完成' ? 'tag-success' : ''">{{ item.status }}</span>
          </div>
          <div class="progress-bar" style="margin-top:8px;">
            <div class="progress-inner" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="dialogVisible" class="modal-overlay" @click.self="dialogVisible=false">
    <div class="modal">
      <h3>{{ dialogTitle }}</h3>
      <form class="grid" style="gap:12px;" @submit.prevent="submitForm">
        <div>
          <label>数据文件路径 / URL</label>
          <input v-model="form.path" placeholder="/data/obs/mete.nc" required />
        </div>
        <div>
          <label>备注</label>
          <textarea v-model="form.note" rows="3" placeholder="例如：添加最新 GFS 数据" />
        </div>
        <div class="toolbar">
          <button type="submit">提交</button>
          <button type="button" @click="dialogVisible=false">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const metSources = [
  { name: 'NCEP FNL', area: '东亚 0.25°', ok: true, updated: '2024-04-02 08:00' },
  { name: 'NCAR Reanalysis', area: '全球 1°', ok: true, updated: '2024-04-02 06:00' },
  { name: '地面站观测', area: '省域 120 站', ok: false, updated: '2024-04-01 23:00' },
  { name: '高空探空', area: '8 个探空站', ok: true, updated: '2024-04-01 20:00' },
  { name: '卫星 AOD', area: 'MODIS 3km', ok: true, updated: '2024-04-01 12:00' }
];

const emissionList = [
  { type: '火电源', version: 'CAMS-v4.2', year: '2023', action: '3 小时前导入' },
  { type: '工业源', version: 'MEIC-2022', year: '2022', action: '昨天更新' },
  { type: '交通源', version: 'GAINS-Asia', year: '2023', action: '2 天前栅格化' },
  { type: '生活源', version: 'CityLive-1.0', year: '2023', action: '手动修订' },
  { type: '生物质燃烧', version: 'FINN v1.5', year: '2024', action: '自动火点融合' }
];

const chemStatus = reactive([
  { name: '嵌套 1 初始场', progress: 100, status: '已完成' },
  { name: '嵌套 2 边界场', progress: 72, status: '生成中' },
  { name: '嵌套 3 初始场', progress: 45, status: '生成中' }
]);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const form = reactive({ path: '', note: '' });

const openDialog = (type) => {
  const titles = {
    met: '接入气象数据',
    qc: '设置质控规则',
    emission: '导入排放清单',
    grid: '生成排放栅格',
    init: '生成化学初始场',
    boundary: '生成化学边界场'
  };
  dialogTitle.value = titles[type] || '操作';
  dialogVisible.value = true;
};

const submitForm = () => {
  dialogVisible.value = false;
  form.path = '';
  form.note = '';
  alert('任务已提交，后台正在处理');
};
</script>

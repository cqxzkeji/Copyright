<template>
  <div class="grid two">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="tag">项目库管理</div>
          <h3 style="margin:6px 0 0;">地块与项目台账</h3>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn" @click="openAdd">新增项目</button>
          <button class="btn secondary" @click="openUpload">导入台账</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>项目</th>
            <th>地块编号</th>
            <th>现状建筑</th>
            <th>权属</th>
            <th>人口</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in projects" :key="row.id">
            <td>{{ row.name }}</td>
            <td>{{ row.plot }}</td>
            <td>{{ row.buildings }}</td>
            <td>{{ row.ownership }}</td>
            <td>{{ row.population }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">地块建设强度对比</h3>
        <button class="btn warning" @click="openTip">查看提示</button>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-end;">
        <div v-for="item in intensity" :key="item.name" style="flex:1; text-align:center;">
          <div style="background:linear-gradient(180deg, rgba(62,157,246,0.3), rgba(62,157,246,0.9)); border-radius:12px 12px 4px 4px; width:100%; transition:height .3s;" :style="{height: item.value + '%'}"></div>
          <div style="margin-top:6px;font-weight:700;">{{ item.name }}</div>
          <small style="color:var(--muted);">{{ item.value }}%</small>
        </div>
      </div>
      <div class="progress-bar"><span :style="{ width: '68%' }"></span></div>
      <small style="color:var(--muted);">指标来源：总建面/地块面积，自动同步最新现状台账。</small>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">权属与人口结构</h3>
        <button class="btn secondary" @click="openOwnership">调整比例</button>
      </div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:center;">
        <div style="flex:1;min-width:220px;">
          <div v-for="segment in ownershipMix" :key="segment.name" style="display:flex;align-items:center;gap:10px;margin:8px 0;">
            <div style="width:12px;height:12px;border-radius:4px;" :style="{ background: segment.color }"></div>
            <div style="flex:1;display:flex;justify-content:space-between;">
              <span>{{ segment.name }}</span>
              <strong>{{ segment.value }}%</strong>
            </div>
          </div>
        </div>
        <div style="flex:1;min-width:220px;display:grid;place-items:center;">
          <svg width="160" height="160" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="#f5f7fb" />
            <template v-for="segment in ownershipMix" :key="segment.name">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="transparent"
                stroke-width="4"
                :stroke="segment.color"
                :stroke-dasharray="segment.value + ' ' + (100 - segment.value)"
                :stroke-dashoffset="segment.offset"
                stroke-linecap="round"
              />
            </template>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#1f2d3d" font-size="6">人口结构</text>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAdd" class="overlay" @click.self="showAdd=false">
    <div class="modal">
      <h3>新增项目</h3>
      <div class="form-row"><label>项目名称</label><input placeholder="如：滨河综合更新单元" /></div>
      <div class="form-row"><label>地块编号</label><input placeholder="A-12-03" /></div>
      <div class="form-row"><label>现状建筑</label><input placeholder="住宅/商业混合" /></div>
      <div class="form-row"><label>常住人口</label><input type="number" placeholder="输入人数" /></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn secondary" @click="showAdd=false">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showUpload" class="overlay" @click.self="showUpload=false">
    <div class="modal">
      <h3>导入进度</h3>
      <p>台账数据解析与校验中。</p>
      <div class="progress-bar"><span :style="{ width: uploadProgress + '%' }"></span></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn" @click="simulateUpload">刷新</button>
        <button class="btn secondary" @click="showUpload=false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTip" class="overlay" @click.self="showTip=false">
    <div class="modal">
      <h3>提示信息</h3>
      <p>可通过调整容积率与建筑限高，优化地块建设强度。</p>
      <button class="btn" @click="showTip=false">知道了</button>
    </div>
  </div>

  <div v-if="showOwnership" class="overlay" @click.self="showOwnership=false">
    <div class="modal">
      <h3>调整权属比例</h3>
      <div class="form-row" v-for="segment in ownershipMix" :key="segment.name">
        <label>{{ segment.name }}</label>
        <input type="number" :value="segment.value" />
      </div>
      <button class="btn secondary" @click="showOwnership=false" style="align-self:flex-end;">确认</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const projects = [
  { id: 1, name: '滨河活力社区', plot: 'A-12-03', buildings: '老旧住宅 12万㎡', ownership: '国有+集体', population: '8200人' },
  { id: 2, name: '产业活力片区', plot: 'B-05-08', buildings: '厂房 9万㎡', ownership: '国有', population: '4300人' },
  { id: 3, name: 'TOD综合枢纽', plot: 'C-02-01', buildings: '枢纽综合体 15万㎡', ownership: '国有', population: '15000人' },
  { id: 4, name: '滨水文化街区', plot: 'D-16-02', buildings: '历史街区 6万㎡', ownership: '多产权', population: '6100人' },
  { id: 5, name: '社区微更新示范', plot: 'E-08-05', buildings: '住宅 4万㎡', ownership: '集体', population: '3500人' },
];

const intensity = [
  { name: 'A-12-03', value: 72 },
  { name: 'B-05-08', value: 65 },
  { name: 'C-02-01', value: 88 },
  { name: 'D-16-02', value: 54 },
  { name: 'E-08-05', value: 46 },
];

const ownershipMix = ref([
  { name: '国有', value: 40, color: '#3e9df6', offset: 0 },
  { name: '集体', value: 25, color: '#ff9f7f', offset: -40 },
  { name: '个人', value: 20, color: '#7fd6b2', offset: -65 },
  { name: '其他', value: 15, color: '#ffc94a', offset: -85 },
]);

const showAdd = ref(false);
const showUpload = ref(false);
const showTip = ref(false);
const showOwnership = ref(false);
const uploadProgress = ref(35);

const openAdd = () => (showAdd.value = true);
const openUpload = () => {
  showUpload.value = true;
  simulateUpload();
};
const openTip = () => (showTip.value = true);
const openOwnership = () => (showOwnership.value = true);

const simulateUpload = () => {
  uploadProgress.value = 20;
  setTimeout(() => (uploadProgress.value = 60), 400);
  setTimeout(() => (uploadProgress.value = 100), 800);
};

onMounted(() => {
  simulateUpload();
});
</script>

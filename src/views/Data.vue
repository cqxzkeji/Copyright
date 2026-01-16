<template>
  <section class="card">
    <div class="card-header">
      <div>
        <div class="card-title">农业数据采集管理</div>
        <div style="color: var(--muted); font-size: 13px;">统一采集土壤、气象、作物基础数据并集中存储。</div>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="button-secondary" type="button" @click="showAlertModal = true">查看异常</button>
        <button class="button-secondary" type="button" @click="startSync">同步数据</button>
        <button class="button-secondary" type="button" @click="showImportModal = true">批量导入</button>
        <button class="button-primary" type="button" @click="showAddModal = true">新增传感器</button>
      </div>
    </div>
    <div class="grid-3">
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">今日采集量</div>
        <div style="font-size: 26px; font-weight: 700;">32,680 条</div>
        <div style="color: var(--accent); font-size: 13px;">较昨日 +8.4%</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">在线传感器</div>
        <div style="font-size: 26px; font-weight: 700;">168 台</div>
        <div style="color: var(--accent); font-size: 13px;">覆盖 12 个地块</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">异常报警</div>
        <div style="font-size: 26px; font-weight: 700;">4 项</div>
        <div style="color: #f59e0b; font-size: 13px;">待处理 2 项</div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">实时数据趋势</div>
      <span class="chip">土壤湿度 / 气温 / 光照</span>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
      <svg viewBox="0 0 600 220" style="width: 100%; height: 220px;">
        <polyline
          fill="none"
          stroke="#2a7c4f"
          stroke-width="3"
          points="0,160 60,140 120,150 180,120 240,130 300,110 360,100 420,90 480,95 540,80 600,85"
        />
        <polyline
          fill="none"
          stroke="#1f8fdd"
          stroke-width="3"
          points="0,180 60,170 120,160 180,150 240,140 300,135 360,130 420,120 480,118 540,110 600,105"
        />
        <polyline
          fill="none"
          stroke="#10b981"
          stroke-width="3"
          points="0,200 60,190 120,180 180,170 240,165 300,150 360,145 420,140 480,135 540,120 600,115"
        />
      </svg>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">平均土壤湿度</div>
          <div style="font-size: 22px; font-weight: 700;">43%</div>
        </div>
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">平均气温</div>
          <div style="font-size: 22px; font-weight: 700;">26.5℃</div>
        </div>
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">光照指数</div>
          <div style="font-size: 22px; font-weight: 700;">7.8k lx</div>
        </div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">传感器采集清单</div>
      <button class="button-ghost" type="button" @click="showTipModal = true">字段说明</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>区域</th>
          <th>设备类型</th>
          <th>土壤湿度</th>
          <th>气温</th>
          <th>光照</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.area }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.moisture }}%</td>
          <td>{{ row.temp }}℃</td>
          <td>{{ row.light }} lx</td>
          <td><span class="chip">{{ row.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal
    :open="showAddModal"
    title="新增传感器"
    @close="showAddModal = false"
    @confirm="saveSensor"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>设备编号</label>
        <input v-model="form.id" placeholder="例如：S-210" />
      </div>
      <div class="form-field">
        <label>覆盖区域</label>
        <input v-model="form.area" placeholder="例如：北区 2 号地" />
      </div>
      <div class="form-field">
        <label>设备类型</label>
        <select v-model="form.type">
          <option>土壤墒情</option>
          <option>气象综合</option>
          <option>光照强度</option>
        </select>
      </div>
      <div class="form-field">
        <label>采集频次</label>
        <select v-model="form.frequency">
          <option>5 分钟</option>
          <option>10 分钟</option>
          <option>30 分钟</option>
        </select>
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showImportModal"
    title="批量导入采集设备"
    @close="showImportModal = false"
    @confirm="confirmImport"
  >
    <div class="form-field">
      <label>选择导入模板</label>
      <select v-model="importTemplate">
        <option>传感器模板 A</option>
        <option>温室模板 B</option>
        <option>露天模板 C</option>
      </select>
    </div>
    <div class="form-field">
      <label>备注说明</label>
      <textarea v-model="importNote" rows="3" placeholder="填写导入说明"></textarea>
    </div>
  </BaseModal>

  <BaseModal
    :open="showSyncModal"
    title="同步数据进度"
    @close="closeSync"
    @confirm="closeSync"
  >
    <p>正在同步 {{ syncTarget }} 的实时数据，请稍候。</p>
    <div class="progress-bar">
      <span :style="{ width: syncProgress + '%' }"></span>
    </div>
    <div style="color: var(--muted); font-size: 13px;">{{ syncProgress }}% 已完成</div>
  </BaseModal>

  <BaseModal
    :open="showAlertModal"
    title="异常报警"
    @close="showAlertModal = false"
    @confirm="acknowledgeAlerts"
  >
    <ul style="line-height: 1.8; color: var(--muted);">
      <li>北区 3 号地传感器 S-109 湿度波动过大。</li>
      <li>南区温室温度超过 32℃。</li>
      <li>西区光照传感器连接不稳定。</li>
    </ul>
  </BaseModal>

  <BaseModal
    :open="showTipModal"
    title="字段说明"
    @close="showTipModal = false"
    @confirm="showTipModal = false"
  >
    <p style="color: var(--muted); line-height: 1.6;">
      采集清单展示每台设备最新 15 分钟的数据摘要，状态标识设备健康度。
    </p>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const rows = Array.from({ length: 24 }, (_, index) => ({
  id: `S-${101 + index}`,
  area: `${['北区', '南区', '东区', '西区'][index % 4]} ${index + 1} 号地`,
  type: ['土壤墒情', '气象综合', '光照强度'][index % 3],
  moisture: 35 + (index % 8),
  temp: 22 + (index % 6),
  light: 520 + index * 6,
  status: index % 5 === 0 ? '关注' : '正常'
}));

const showAddModal = ref(false);
const showImportModal = ref(false);
const showSyncModal = ref(false);
const showAlertModal = ref(false);
const showTipModal = ref(false);

const form = reactive({
  id: '',
  area: '',
  type: '土壤墒情',
  frequency: '10 分钟'
});

const importTemplate = ref('传感器模板 A');
const importNote = ref('');

const syncProgress = ref(0);
const syncTarget = ref('全部区域');
let timer;

const startSync = () => {
  syncTarget.value = '全部区域';
  syncProgress.value = 0;
  showSyncModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (syncProgress.value < 100) {
      syncProgress.value += 10;
    } else {
      clearInterval(timer);
    }
  }, 300);
};

const closeSync = () => {
  showSyncModal.value = false;
  syncProgress.value = 100;
};

const saveSensor = () => {
  showAddModal.value = false;
};

const confirmImport = () => {
  showImportModal.value = false;
};

const acknowledgeAlerts = () => {
  showAlertModal.value = false;
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

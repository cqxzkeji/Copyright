<template>
  <div class="grid" style="gap:16px;">
    <div class="card">
      <div class="toolbar" style="justify-content: space-between;">
        <div>
          <h3 class="section-title">驱动管理与自动加载</h3>
          <p class="muted">扫描本地驱动、导入包并自动加载运行状态。</p>
        </div>
        <div class="toolbar">
          <button class="btn" @click="scanDrivers">扫描驱动</button>
          <button class="btn secondary" @click="importDriver">导入驱动</button>
          <button class="btn ghost" @click="autoLoad">自动加载</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>版本</th>
            <th>类型</th>
            <th>最近加载</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in drivers" :key="item.name + item.version">
            <td>{{ item.name }}</td>
            <td>{{ item.version }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.loadedAt }}</td>
            <td><span class="badge" :class="item.statusClass">{{ item.status }}</span></td>
            <td>
              <div class="toolbar">
                <button class="btn secondary" @click="showCheck(item)">运行状态</button>
                <button class="btn ghost" @click="openVersion(item)">版本管理</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
      <div class="card" v-for="block in stats" :key="block.label">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">{{ block.label }}</h4>
          <span class="badge info">{{ block.tag }}</span>
        </div>
        <p class="muted">{{ block.desc }}</p>
        <div class="progress-track" style="margin-top:10px;">
          <div class="progress-bar" :style="{ width: block.value + '%' }"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;">
          <span>{{ block.value }}%</span>
          <span>{{ block.note }}</span>
        </div>
      </div>
    </div>

    <ProgressModal :open="showProgress" :progress="progress" title="驱动处理" subtitle="当前进度" @close="showProgress = false" @confirm="showProgress = false" />
    <ModalDialog :open="showImport" @close="showImport = false" @confirm="showImport = false">
      <template #title><h3 style="margin:0;">导入驱动包</h3></template>
      <div class="input-row">
        <label>驱动文件<input placeholder="选择 .tar.gz" /></label>
        <label>适配设备<select><option>激光雷达</option><option>毫米波雷达</option><option>摄像头</option></select></label>
      </div>
    </ModalDialog>
    <ModalDialog :open="showCheckModal" @close="showCheckModal = false" @confirm="showCheckModal = false">
      <template #title><h3 style="margin:0;">运行状态</h3></template>
      <p>驱动 {{ currentDriver?.name }} 运行心跳正常，最近 1 分钟无报错。</p>
    </ModalDialog>
    <ModalDialog :open="showVersion" @close="showVersion = false" @confirm="showVersion = false">
      <template #title><h3 style="margin:0;">版本管理</h3></template>
      <ul style="margin:0;padding-left:18px;">
        <li>当前版本：{{ currentDriver?.version }}</li>
        <li>最新版本：v2.{{ currentIndex }}.0</li>
        <li>升级策略：分批重启</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const drivers = reactive(Array.from({ length: 22 }).map((_, i) => ({
  name: `驱动-${i + 1}`,
  version: `v2.${i % 6}.0`,
  type: ['激光雷达', '毫米波雷达', '超声波雷达'][i % 3],
  loadedAt: `2024-05-${(10 + i).toString().padStart(2, '0')}`,
  status: ['运行中', '待升级', '异常'][i % 3],
  statusClass: ['success', 'warning', 'danger'][i % 3]
})));

const stats = [
  { label: '自动加载成功率', tag: '自动', value: 94, note: '稳定', desc: '扫描驱动后自动匹配成功率' },
  { label: '版本覆盖率', tag: '版本', value: 88, note: '已覆盖', desc: '已适配到最新协议的驱动比例' },
  { label: '运行稳定度', tag: '状态', value: 82, note: '低告警', desc: '驱动在线运行稳定度' }
];

const showProgress = ref(false);
const showImport = ref(false);
const showCheckModal = ref(false);
const showVersion = ref(false);
const currentDriver = ref();
const currentIndex = ref(1);
const progress = ref(0);

const scanDrivers = () => {
  progress.value = 10;
  showProgress.value = true;
};
const importDriver = () => {
  showImport.value = true;
};
const autoLoad = () => {
  progress.value = 60;
  showProgress.value = true;
};
const showCheck = (driver) => {
  currentDriver.value = driver;
  showCheckModal.value = true;
};
const openVersion = (driver) => {
  currentDriver.value = driver;
  currentIndex.value = drivers.indexOf(driver) + 1;
  showVersion.value = true;
};
</script>

<style scoped>
.muted { color: var(--muted); margin: 4px 0 0; }
</style>

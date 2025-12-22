<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">设备连接状态</div>
      <div class="grid three">
        <div class="kpi">
          <span>在线设备</span>
          <strong>8</strong>
        </div>
        <div class="kpi">
          <span>待校准</span>
          <strong>2</strong>
        </div>
        <div class="kpi">
          <span>电量告警</span>
          <strong>1</strong>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="primary-btn" @click="openForm">新建设备</button>
        <button class="secondary-btn" @click="openProgress">扫描设备</button>
        <button class="secondary-btn" @click="openTip">操作提示</button>
      </div>
      <div class="tag-list" style="margin-top: 16px;">
        <span class="tag">蓝牙已启用</span>
        <span class="tag">Wi-Fi 同步</span>
        <span class="tag">自动校准</span>
        <span class="tag">安全加密</span>
      </div>
    </div>

    <div class="card">
      <div class="section-title">设备列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>名称</th>
            <th>连接方式</th>
            <th>电量</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in devices" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.channel }}</td>
            <td>{{ item.battery }}</td>
            <td><span class="badge" :class="item.statusClass">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <teleport to="body">
    <div v-if="formVisible" class="modal-backdrop">
      <div class="modal">
        <h3>新建设备</h3>
        <div class="form-field">
          <label>设备名称</label>
          <input v-model="form.name" placeholder="请输入设备名称" />
        </div>
        <div class="form-field">
          <label>连接方式</label>
          <select v-model="form.channel">
            <option value="蓝牙">蓝牙</option>
            <option value="Wi-Fi">Wi-Fi</option>
            <option value="USB">USB</option>
          </select>
        </div>
        <div class="form-field">
          <label>负责人</label>
          <input v-model="form.owner" placeholder="请输入负责人" />
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="formVisible = false">取消</button>
          <button class="primary-btn" @click="saveDevice">保存</button>
        </div>
      </div>
    </div>

    <div v-if="progressVisible" class="modal-backdrop">
      <div class="modal">
        <h3>扫描设备</h3>
        <p>系统正在搜索附近可用设备。</p>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="progressVisible = false">停止</button>
        </div>
      </div>
    </div>

    <div v-if="tipVisible" class="modal-backdrop">
      <div class="modal">
        <h3>操作提示</h3>
        <p>建议保持设备电量高于 40%，并定期进行校准。</p>
        <div class="modal-actions">
          <button class="primary-btn" @click="tipVisible = false">了解</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref } from 'vue';

const formVisible = ref(false);
const progressVisible = ref(false);
const tipVisible = ref(false);
const progress = ref(30);

const form = reactive({
  name: '',
  channel: '蓝牙',
  owner: ''
});

const devices = ref([
  { id: 'DV-001', name: '多参数仪 A', channel: '蓝牙', battery: '88%', status: '在线', statusClass: 'success' },
  { id: 'DV-002', name: '多参数仪 B', channel: 'Wi-Fi', battery: '76%', status: '在线', statusClass: 'success' },
  { id: 'DV-003', name: '多参数仪 C', channel: 'USB', battery: '59%', status: '待校准', statusClass: 'warning' },
  { id: 'DV-004', name: '多参数仪 D', channel: '蓝牙', battery: '66%', status: '在线', statusClass: 'success' },
  { id: 'DV-005', name: '多参数仪 E', channel: 'Wi-Fi', battery: '91%', status: '在线', statusClass: 'success' },
  { id: 'DV-006', name: '多参数仪 F', channel: '蓝牙', battery: '42%', status: '电量低', statusClass: 'warning' },
  { id: 'DV-007', name: '多参数仪 G', channel: 'Wi-Fi', battery: '69%', status: '在线', statusClass: 'success' },
  { id: 'DV-008', name: '多参数仪 H', channel: 'USB', battery: '52%', status: '校准中', statusClass: 'info' },
  { id: 'DV-009', name: '多参数仪 I', channel: '蓝牙', battery: '77%', status: '在线', statusClass: 'success' },
  { id: 'DV-010', name: '多参数仪 J', channel: 'Wi-Fi', battery: '83%', status: '在线', statusClass: 'success' }
]);

const openForm = () => {
  formVisible.value = true;
};

const openProgress = () => {
  progressVisible.value = true;
  progress.value = 30;
};

const openTip = () => {
  tipVisible.value = true;
};

const saveDevice = () => {
  devices.value.unshift({
    id: `DV-${String(devices.value.length + 1).padStart(3, '0')}`,
    name: form.name || '未命名设备',
    channel: form.channel,
    battery: '100%',
    status: '在线',
    statusClass: 'success'
  });
  form.name = '';
  form.owner = '';
  formVisible.value = false;
};
</script>

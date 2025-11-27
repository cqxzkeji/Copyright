<template>
  <div class="card" style="display: grid; gap: 16px;">
    <div style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      <div class="stat">
        <small>当前功率</small>
        <strong>2.4 kW</strong>
      </div>
      <div class="stat">
        <small>安全锁定</small>
        <strong>已启用</strong>
      </div>
      <div class="stat">
        <small>轨迹模式</small>
        <strong>精细切割</strong>
      </div>
      <div class="stat">
        <small>冷却状态</small>
        <strong>循环冷却</strong>
      </div>
    </div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <button class="primary-btn" @click="openStart">启动设备</button>
      <button class="secondary-btn" @click="openPause">暂停/恢复</button>
      <button class="danger-btn" @click="openLock">安全锁定</button>
      <button class="secondary-btn" @click="showHint = true">操作提示</button>
    </div>
    <div class="grid responsive-grid" style="grid-template-columns: 2fr 1.2fr; align-items: start;">
      <div class="card">
        <h3 style="margin-top: 0;">设备通道状态</h3>
        <table class="table">
          <thead>
            <tr>
              <th>通道</th>
              <th>功率(kW)</th>
              <th>温度(°C)</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="channel in channels" :key="channel.name">
              <td>{{ channel.name }}</td>
              <td>{{ channel.power }}</td>
              <td>{{ channel.temp }}</td>
              <td>{{ channel.state }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3 style="margin-top: 0;">功率波形</h3>
        <svg viewBox="0 0 200 120" style="width: 100%; height: auto;">
          <polyline
            :points="wavePoints"
            fill="none"
            stroke="#4ea8de"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            :points="wavePointsShadow"
            fill="none"
            stroke="#c7d2fe"
            stroke-width="6"
            opacity="0.35"
          />
        </svg>
        <p class="muted">实时采集 1.2s 滤波数据，确认波形稳定后再启动批量切割。</p>
      </div>
    </div>
    <div v-if="startModal" class="modal-backdrop" @click.self="startModal = false">
      <div class="modal-card">
        <h3 style="margin: 0 0 8px;">启动参数</h3>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <label class="field">
            <span>功率设定 (kW)</span>
            <input v-model="startForm.power" type="number" min="0" step="0.1" />
          </label>
          <label class="field">
            <span>气体流量 (L/min)</span>
            <input v-model="startForm.gas" type="number" min="0" step="1" />
          </label>
          <label class="field">
            <span>轨迹方案</span>
            <select v-model="startForm.path">
              <option>精细切割</option>
              <option>快速切割</option>
              <option>试刀对焦</option>
            </select>
          </label>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="secondary-btn" @click="startModal = false">取消</button>
          <button class="primary-btn" @click="confirmStart">执行启动</button>
        </div>
      </div>
    </div>
    <div v-if="showProgress" class="modal-backdrop">
      <div class="modal-card">
        <h3 style="margin: 0 0 8px;">执行中</h3>
        <p class="muted">正在同步伺服、气体与安全互锁，完成后自动进入运行。</p>
        <div class="progress" style="margin-top: 10px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
    </div>
    <div v-if="pauseModal" class="modal-backdrop" @click.self="pauseModal = false">
      <div class="modal-card">
        <h3>暂停/恢复</h3>
        <p class="muted">选择需要的动作，系统将协调运动控制与功率输出。</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="primary-btn" @click="triggerPause('pause')">暂停</button>
          <button class="secondary-btn" @click="triggerPause('resume')">恢复</button>
          <button class="danger-btn" @click="triggerPause('stop')">停止</button>
        </div>
      </div>
    </div>
    <div v-if="lockModal" class="modal-backdrop" @click.self="lockModal = false">
      <div class="modal-card">
        <h3>安全锁定</h3>
        <p class="muted">锁定后禁止远程启停，需要物理钥匙解除。</p>
        <button class="danger-btn" @click="lockModal = false">确认锁定</button>
      </div>
    </div>
    <div v-if="showHint" class="modal-backdrop" @click.self="showHint = false">
      <div class="modal-card">
        <h3>操作提示</h3>
        <ul style="margin: 0 0 12px; padding-left: 18px; color: #4b5563;">
          <li>确保轨迹对焦完成后再执行启动。</li>
          <li>暂停时功率会缓降，恢复后重新渐进输出。</li>
          <li>安全锁定将同步通知所有操作端。</li>
        </ul>
        <button class="primary-btn" @click="showHint = false">关闭提示</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const channels = [
  { name: '主激光', power: '2.4', temp: 28.3, state: '稳定' },
  { name: '辅助刀具', power: '1.2', temp: 31.1, state: '预热' },
  { name: '冷却泵', power: '0.6', temp: 22.5, state: '运行' },
  { name: '伺服X', power: '0.3', temp: 35.2, state: '运行' },
  { name: '伺服Y', power: '0.3', temp: 34.8, state: '运行' },
  { name: '伺服Z', power: '0.2', temp: 33.5, state: '待机' }
];

const startModal = ref(false);
const pauseModal = ref(false);
const lockModal = ref(false);
const showHint = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const startForm = reactive({ power: 2.4, gas: 35, path: '精细切割' });

const openStart = () => {
  startModal.value = true;
};

const confirmStart = () => {
  startModal.value = false;
  showProgress.value = true;
  progress.value = 15;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    } else {
      progress.value += 21;
    }
  }, 300);
};

const openPause = () => {
  pauseModal.value = true;
};

const triggerPause = (type) => {
  pauseModal.value = false;
  showHint.value = true;
};

const openLock = () => {
  lockModal.value = true;
};

const wavePoints = computed(() => {
  const data = [
    40, 52, 48, 60, 66, 58, 62, 70, 64, 80,
    72, 68, 74, 60, 56, 62, 58, 64, 68, 60
  ];
  return data.map((v, idx) => `${idx * 10},${120 - v}`).join(' ');
});

const wavePointsShadow = computed(() => wavePoints.value + ' 200,120 0,120');
</script>

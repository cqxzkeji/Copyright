<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>视觉伺服与运动控制</h3>
        <div class="flex">
          <button @click="openTrack = true">目标跟踪</button>
          <button @click="openGait = true">步态调度</button>
          <button @click="openPose = true">姿态调整</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-top: 12px;">
        <div class="card">
          <p class="badge">视觉误差</p>
          <h2>{{ visualError.x }} / {{ visualError.y }} px</h2>
          <p>闭环频率：60Hz</p>
        </div>
        <div class="card">
          <p class="badge">速度规划</p>
          <h2>{{ speedPlan }} m/s</h2>
          <p>动态避障已启用</p>
        </div>
        <div class="card">
          <p class="badge">步态模式</p>
          <h2>{{ gaitMode }}</h2>
          <p>支撑相位 {{ stanceRatio }}%</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <h4>控制日志</h4>
        <button @click="openStop = true">紧急停机</button>
      </div>
      <ul>
        <li v-for="log in logs" :key="log.time" style="padding: 6px 0;">
          {{ log.time }} - {{ log.msg }}
        </li>
      </ul>
    </div>
  </div>

  <div v-if="openTrack" class="modal-overlay" @click.self="openTrack = false">
    <div class="modal">
      <h3>目标跟踪</h3>
      <label>目标类型<select v-model="trackForm.type"><option>圆标靶</option><option>AprilTag</option><option>人体</option></select></label>
      <label>滤波<select v-model="trackForm.filter"><option>卡尔曼</option><option>粒子</option></select></label>
      <div class="flex-between" style="margin-top: 10px">
        <span>预测窗口 {{ trackForm.window }} ms</span>
        <button @click="applyTrack">启用</button>
      </div>
    </div>
  </div>

  <div v-if="openGait" class="modal-overlay" @click.self="openGait = false">
    <div class="modal">
      <h3>步态调度</h3>
      <label>步态模式<select v-model="gaitForm.mode"><option>三角对称</option><option>交替三足</option><option>波浪推进</option></select></label>
      <label>步长<input v-model="gaitForm.step" type="number" /></label>
      <div class="flex-between" style="margin-top: 10px">
        <span>当前步长 {{ gaitForm.step }} cm</span>
        <button @click="applyGait">下发</button>
      </div>
    </div>
  </div>

  <div v-if="openPose" class="modal-overlay" @click.self="openPose = false">
    <div class="modal">
      <h3>姿态调整</h3>
      <label>俯仰角<input v-model="poseForm.pitch" type="number" /></label>
      <label>横滚角<input v-model="poseForm.roll" type="number" /></label>
      <label>高度<input v-model="poseForm.height" type="number" /></label>
      <div class="flex-between" style="margin-top: 10px">
        <span>高度 {{ poseForm.height }} mm</span>
        <button @click="applyPose">执行</button>
      </div>
    </div>
  </div>

  <div v-if="openStop" class="modal-overlay" @click.self="openStop = false">
    <div class="modal">
      <h3>紧急停机</h3>
      <p>将立即锁定伺服并断开动力。</p>
      <div class="flex-between">
        <span class="status-bad">安全确认</span>
        <button @click="doStop">立即停机</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const visualError = reactive({ x: 1.2, y: -0.8 });
const speedPlan = ref(0.35);
const gaitMode = ref('三角对称');
const stanceRatio = ref(65);
const logs = ref([
  { time: '10:00:01', msg: '闭环启动，频率 60Hz' },
  { time: '10:01:12', msg: '目标捕获：AprilTag #5' },
  { time: '10:02:08', msg: '步态切换：三角对称' }
]);

const trackForm = reactive({ type: 'AprilTag', filter: '卡尔曼', window: 80 });
const gaitForm = reactive({ mode: '三角对称', step: 18 });
const poseForm = reactive({ pitch: 0, roll: 0, height: 260 });

const openTrack = ref(false);
const openGait = ref(false);
const openPose = ref(false);
const openStop = ref(false);

const applyTrack = () => {
  logs.value.push({ time: '10:05:00', msg: `启用 ${trackForm.type} 跟踪` });
  openTrack.value = false;
};

const applyGait = () => {
  gaitMode.value = gaitForm.mode;
  logs.value.push({ time: '10:05:10', msg: `步态下发：${gaitForm.mode}` });
  openGait.value = false;
};

const applyPose = () => {
  logs.value.push({ time: '10:05:20', msg: `姿态：pitch ${poseForm.pitch} roll ${poseForm.roll} 高度 ${poseForm.height}` });
  openPose.value = false;
};

const doStop = () => {
  logs.value.push({ time: '10:05:30', msg: '紧急停机已触发' });
  openStop.value = false;
};
</script>

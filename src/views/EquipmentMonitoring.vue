<template>
  <section class="grid-2">
    <div class="card">
      <div class="section-title">实时运行状态</div>
      <div class="grid-2">
        <div>
          <p>在线设备</p>
          <strong>112 台</strong>
        </div>
        <div>
          <p>待检测设备</p>
          <strong>8 台</strong>
        </div>
        <div>
          <p>故障设备</p>
          <strong>4 台</strong>
        </div>
        <div>
          <p>今日巡检计划</p>
          <strong>15 项</strong>
        </div>
      </div>
      <div class="button-row">
        <button class="btn" @click="openModal('refresh')">刷新状态</button>
        <button class="btn secondary" @click="openModal('remote')">下发远程测试</button>
        <button class="btn secondary" @click="openModal('note')">状态提示</button>
        <button class="btn secondary" @click="openModal('progress')">运行自检</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">运行时长分布</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: `${item.value}%` }"
        ></div>
      </div>
      <p style="margin-top: 12px; color: #607088">关键设备运行时长稳定，预计今日无超时风险。</p>
    </div>
  </section>

  <section class="card" style="margin-top: 18px;">
    <div class="section-title">设备运行明细</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>设备编号</th>
          <th>设备类型</th>
          <th>当前状态</th>
          <th>运行时长</th>
          <th>健康评分</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.type }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
          <td>{{ item.runtime }}</td>
          <td>{{ item.score }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal :show="modal.type === 'refresh'" title="刷新设备状态" @close="closeModal">
    <p>已向全部消防设备发送状态刷新指令，预计 30 秒内完成更新。</p>
  </BaseModal>

  <BaseModal :show="modal.type === 'remote'" title="下发远程测试" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>测试设备</label>
        <select v-model="remoteForm.device">
          <option v-for="item in tableData.slice(0, 6)" :key="item.id">{{ item.code }} - {{ item.type }}</option>
        </select>
      </div>
      <div>
        <label>测试项目</label>
        <select v-model="remoteForm.task">
          <option>远程启停</option>
          <option>压力/水流检测</option>
          <option>喷淋阀组联动</option>
          <option>自动巡检</option>
        </select>
      </div>
      <div>
        <label>备注</label>
        <textarea v-model="remoteForm.note" rows="3" placeholder="填写测试目的"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitRemote">确认下发</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'note'" title="设备状态提示" @close="closeModal">
    <ul style="line-height: 1.8; color: #51647a; padding-left: 18px;">
      <li>喷淋泵 03 号建议在 18:00 前完成电机温升检测。</li>
      <li>气体灭火控制柜 02 号电池电量下降，请安排补充。</li>
      <li>北区消防泵房湿度偏高，建议通风。</li>
    </ul>
  </BaseModal>

  <BaseModal :show="modal.type === 'progress'" title="运行自检进度" @close="closeModal">
    <p>正在执行设备自检任务，请保持在线。</p>
    <div style="margin-top: 16px;">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p style="margin-top: 8px;">完成度 {{ progress }}%</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tableData = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  code: `EQ-${String(index + 1).padStart(3, '0')}`,
  type: ['喷淋系统', '消防泵', '灭火器', '烟感探测器', '水流指示器'][index % 5],
  status: index % 6 === 0 ? '需检测' : '运行正常',
  runtime: `${4 + (index % 9)} 小时`,
  score: `${88 + (index % 10)} 分`
}));

const chartData = [
  { label: '1h', value: 40 },
  { label: '2h', value: 55 },
  { label: '3h', value: 62 },
  { label: '4h', value: 68 },
  { label: '5h', value: 74 },
  { label: '6h', value: 80 }
];

const modal = reactive({ type: '' });
const progress = ref(0);
let timer;

const remoteForm = reactive({
  device: '',
  task: '远程启停',
  note: ''
});

const openModal = (type) => {
  modal.type = type;
  if (type === 'progress') {
    progress.value = 5;
    timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 15);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 380);
  }
};

const closeModal = () => {
  modal.type = '';
  if (timer) {
    clearInterval(timer);
  }
};

const submitRemote = () => {
  modal.type = 'note';
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

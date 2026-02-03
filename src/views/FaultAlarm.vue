<template>
  <section class="grid-2">
    <div class="card">
      <div class="section-title">故障与报警概况</div>
      <div class="grid-2">
        <div>
          <p>今日新增报警</p>
          <strong>9 条</strong>
        </div>
        <div>
          <p>处理中</p>
          <strong>4 条</strong>
        </div>
        <div>
          <p>已关闭</p>
          <strong>5 条</strong>
        </div>
        <div>
          <p>紧急等级</p>
          <strong>2 条</strong>
        </div>
      </div>
      <div class="button-row">
        <button class="btn" @click="openModal('create')">新增报警</button>
        <button class="btn secondary" @click="openModal('assign')">指派处理人</button>
        <button class="btn secondary" @click="openModal('progress')">告警处理进度</button>
        <button class="btn secondary" @click="openModal('tips')">告警提示</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">告警等级分布</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: `${item.value}%` }"
        ></div>
      </div>
      <p style="margin-top: 12px; color: #607088">当前告警以设备失联和压力波动为主。</p>
    </div>
  </section>

  <section class="card" style="margin-top: 18px;">
    <div class="section-title">报警列表</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>报警编号</th>
          <th>设备</th>
          <th>告警内容</th>
          <th>等级</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.device }}</td>
          <td>{{ item.detail }}</td>
          <td>{{ item.level }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal :show="modal.type === 'create'" title="新增报警" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>关联设备</label>
        <select v-model="alarmForm.device">
          <option v-for="item in tableData.slice(0, 8)" :key="item.id">{{ item.device }}</option>
        </select>
      </div>
      <div>
        <label>告警等级</label>
        <select v-model="alarmForm.level">
          <option>一般</option>
          <option>重要</option>
          <option>紧急</option>
        </select>
      </div>
      <div>
        <label>告警描述</label>
        <textarea v-model="alarmForm.detail" rows="3" placeholder="填写告警原因"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitAlarm">确认生成</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'assign'" title="指派处理人" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>选择报警编号</label>
        <select v-model="assignForm.code">
          <option v-for="item in tableData.slice(0, 10)" :key="item.id">{{ item.code }}</option>
        </select>
      </div>
      <div>
        <label>处理人</label>
        <select v-model="assignForm.owner">
          <option>张磊</option>
          <option>王琳</option>
          <option>黄涛</option>
          <option>陈倩</option>
        </select>
      </div>
      <div>
        <label>处理期限</label>
        <input v-model="assignForm.deadline" type="datetime-local" />
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitAssign">确认指派</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'progress'" title="告警处理进度" @close="closeModal">
    <p>系统正在汇总处理进度，请稍候。</p>
    <div style="margin-top: 16px;">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p style="margin-top: 8px;">已汇总 {{ progress }}%</p>
    </div>
  </BaseModal>

  <BaseModal :show="modal.type === 'tips'" title="告警提示" @close="closeModal">
    <ul style="line-height: 1.8; color: #51647a; padding-left: 18px;">
      <li>地下泵房压力波动告警已连续出现 3 次。</li>
      <li>消防泵 05 号通信异常，建议安排现场检查。</li>
      <li>消防主机 2 号电源模块温度偏高。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tableData = Array.from({ length: 21 }, (_, index) => ({
  id: index + 1,
  code: `AL-${String(index + 1).padStart(3, '0')}`,
  device: ['喷淋泵', '消防主机', '烟感探测器', '水流指示器', '灭火器'][index % 5],
  detail: ['压力波动', '通信异常', '电池低电', '误报触发', '温度过高'][index % 5],
  level: ['一般', '重要', '紧急'][index % 3],
  status: index % 4 === 0 ? '处理中' : '已确认'
}));

const chartData = [
  { label: '一般', value: 40 },
  { label: '重要', value: 70 },
  { label: '紧急', value: 90 }
];

const modal = reactive({ type: '' });
const progress = ref(0);
let timer;

const alarmForm = reactive({
  device: '喷淋泵',
  level: '一般',
  detail: ''
});

const assignForm = reactive({
  code: 'AL-001',
  owner: '张磊',
  deadline: ''
});

const openModal = (type) => {
  modal.type = type;
  if (type === 'progress') {
    progress.value = 12;
    timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 14);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 420);
  }
};

const closeModal = () => {
  modal.type = '';
  if (timer) {
    clearInterval(timer);
  }
};

const submitAlarm = () => {
  modal.type = 'tips';
};

const submitAssign = () => {
  modal.type = 'tips';
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

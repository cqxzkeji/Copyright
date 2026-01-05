<template>
  <div>
    <div class="section-header">
      <h3>调度执行与协同指挥</h3>
      <div class="tag-row">
        <button class="btn" @click="showDispatch = true">下发计划</button>
        <button class="btn secondary" @click="showAlert = true">冲突预警</button>
        <button class="btn" @click="showFeedback = true">指令回执</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-card">
        <div class="section-header">
          <strong>实时进度</strong>
          <span>{{ progress }}%</span>
        </div>
        <div class="progress-track">
          <div class="bar" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>包括岸桥、场桥、AGV 多设备协同执行的总体完成度。</p>
      </div>
      <div class="chart-card">
        <div class="section-header">
          <strong>动态重调度</strong>
          <span>事件数: {{ adjustments.length }}</span>
        </div>
        <ul>
          <li v-for="item in adjustments" :key="item.title">{{ item.title }}：{{ item.action }}</li>
        </ul>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>设备/班组</th>
          <th>任务</th>
          <th>状态</th>
          <th>时间窗</th>
          <th>位置</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in dispatchRows" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.task }}</td>
          <td><span :class="['badge', row.stateClass]">{{ row.state }}</span></td>
          <td>{{ row.window }}</td>
          <td>{{ row.location }}</td>
          <td>{{ row.note }}</td>
        </tr>
      </tbody>
    </table>

    <BaseModal v-model="showDispatch" title="计划下发">
      <div class="form-grid">
        <div class="input-group">
          <label>选择设备</label>
          <select v-model="dispatchForm.equipment">
            <option>QCT-01</option>
            <option>RTG-11</option>
            <option>AGV-21</option>
            <option>拖车-31</option>
          </select>
        </div>
        <div class="input-group">
          <label>绑定任务</label>
          <select v-model="dispatchForm.task">
            <option>T-1001</option>
            <option>T-1005</option>
            <option>T-1010</option>
            <option>T-1016</option>
          </select>
        </div>
        <div class="input-group">
          <label>班组</label>
          <select v-model="dispatchForm.team">
            <option>甲班</option>
            <option>乙班</option>
            <option>丙班</option>
          </select>
        </div>
      </div>
      <div class="section-header" style="margin-top: 12px;">
        <span>确认后同步至设备与班组终端，并生成回执。</span>
        <button class="btn" @click="confirmDispatch">确认下发</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showAlert" title="作业冲突预警">
      <ul>
        <li>岸桥 QCT-03 与场桥 RTG-12 存在跨堆干涉，建议调整场桥窗口。</li>
        <li>AGV-24 路径与拖车-32 重叠 120m，已推送避让路线。</li>
        <li>B2 泊位靠泊时间推迟 30 分钟，需同步班组与拖车计划。</li>
      </ul>
    </BaseModal>

    <BaseModal v-model="showFeedback" title="指令回执与消息">
      <div class="form-grid">
        <div class="input-group">
          <label>回执来源</label>
          <select>
            <option>岸桥终端</option>
            <option>场桥终端</option>
            <option>AGV 调度</option>
          </select>
        </div>
        <div class="input-group">
          <label>消息</label>
          <textarea rows="3" placeholder="反馈信息、异常说明"></textarea>
        </div>
      </div>
      <div class="section-header" style="margin-top: 12px;">
        <span>所有回执均会留痕审计，可追溯。</span>
        <button class="btn" @click="sendFeedback">确认</button>
      </div>
    </BaseModal>

    <ProgressModal v-model="showProgress" :message="progressMessage" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ProgressModal from '../components/ProgressModal.vue';

const progress = 68;
const adjustments = [
  { title: '插单处理', action: '优先调入方案-K1，桥吊增加至 6 台' },
  { title: '设备故障', action: 'QCT-03 暂停 20 分钟，AGV 重排路径' },
  { title: '天气调整', action: '大风预警，部分堆场转移夜班' }
];

const dispatchRows = [
  { name: 'QCT-01', task: 'T-1001 卸船', state: '执行中', stateClass: 'success', window: '02:00-04:00', location: 'A1 泊位', note: '作业效率 32 moves/h' },
  { name: 'QCT-02', task: 'T-1002 装船', state: '待命', stateClass: 'warning', window: '03:00-05:00', location: 'A1 泊位', note: '等待舱位解锁' },
  { name: 'QCT-03', task: 'T-1005 卸船', state: '执行中', stateClass: 'success', window: '06:00-08:00', location: 'A2 泊位', note: '调整吊具' },
  { name: 'RTG-11', task: 'B01 场内转运', state: '执行中', stateClass: 'success', window: '02:00-04:30', location: 'C3 堆场', note: '配合 QCT-01' },
  { name: 'RTG-12', task: 'B02 场内转运', state: '待命', stateClass: 'warning', window: '04:00-06:30', location: 'B2 堆场', note: '等待岸桥' },
  { name: 'RTG-13', task: 'B03 转堆', state: '执行中', stateClass: 'success', window: '05:00-07:00', location: 'D1 堆场', note: '危品隔离' },
  { name: 'AGV-21', task: 'AGV 运输批次 B01', state: '执行中', stateClass: 'success', window: '02:00-04:00', location: 'A1-堆场', note: '电量 78%' },
  { name: 'AGV-22', task: 'AGV 运输批次 B02', state: '待命', stateClass: 'warning', window: '04:00-06:00', location: 'A2-堆场', note: '维护完成后启用' },
  { name: 'AGV-23', task: 'AGV 运输批次 B03', state: '执行中', stateClass: 'success', window: '05:00-07:00', location: 'B1-堆场', note: '路径避让' },
  { name: 'AGV-24', task: 'AGV 运输批次 B04', state: '执行中', stateClass: 'success', window: '06:00-08:00', location: 'B2-堆场', note: '协同拖车' },
  { name: '拖车-31', task: '冷藏箱运抵', state: '执行中', stateClass: 'success', window: '02:00-04:30', location: '冷藏区', note: '插座 90% 使用' },
  { name: '拖车-32', task: '散杂转运', state: '待命', stateClass: 'warning', window: '03:00-05:00', location: '堆场入口', note: '等待确认' },
  { name: '拖车-33', task: '危品监管', state: '执行中', stateClass: 'success', window: '05:00-07:00', location: 'D1 堆场', note: '安全陪同' },
  { name: '班组-甲', task: '岸桥作业', state: '执行中', stateClass: 'success', window: '02:00-08:00', location: 'A1', note: '满编 8 人' },
  { name: '班组-乙', task: '场桥作业', state: '待命', stateClass: 'warning', window: '04:00-10:00', location: 'B2', note: '准备换班' },
  { name: '班组-丙', task: '夜班装船', state: '执行中', stateClass: 'success', window: '06:00-12:00', location: 'B1', note: '补员到位' },
  { name: '泊位-A1', task: '船舶 东方01', state: '执行中', stateClass: 'success', window: '00:30-09:30', location: 'A1 泊位', note: '桥吊 5 台' },
  { name: '泊位-A2', task: '船舶 宁海', state: '待命', stateClass: 'warning', window: '05:30-14:00', location: 'A2 泊位', note: '等待潮窗' },
  { name: '泊位-B1', task: '船舶 星河', state: '执行中', stateClass: 'success', window: '04:30-13:30', location: 'B1 泊位', note: '桥吊 4 台' },
  { name: '泊位-B2', task: '船舶 绿洲', state: '执行中', stateClass: 'success', window: '06:00-15:00', location: 'B2 泊位', note: '桥吊 3 台' },
  { name: '安保-01', task: '巡查', state: '执行中', stateClass: 'success', window: '24h', location: '全区域', note: '安全巡检' }
];

const showDispatch = ref(false);
const showAlert = ref(false);
const showFeedback = ref(false);
const showProgress = ref(false);
const progressMessage = ref('');

const dispatchForm = ref({
  equipment: 'QCT-01',
  task: 'T-1001',
  team: '甲班'
});

const confirmDispatch = () => {
  progressMessage.value = `正在下发任务 ${dispatchForm.value.task} 至 ${dispatchForm.value.equipment}，班组 ${dispatchForm.value.team} 同步接收...`;
  showDispatch.value = false;
  showProgress.value = true;
};

const sendFeedback = () => {
  progressMessage.value = '反馈已记录，推送至调度台并生成审计日志...';
  showFeedback.value = false;
  showProgress.value = true;
};
</script>

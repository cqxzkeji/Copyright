<template>
  <div>
    <div class="section-header">
      <h3>港口资源与基础资料</h3>
      <div class="tag-row">
        <button class="btn" @click="showForm = true">新增资源</button>
        <button class="btn secondary" @click="openBerthImport">导入泊位计划</button>
        <button class="btn" @click="openRuleTips">作业规则提示</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-card" v-for="slot in berthUtil" :key="slot.name">
        <div class="section-header">
          <strong>{{ slot.name }}</strong>
          <span>{{ slot.rate }}% 利用率</span>
        </div>
        <div class="progress-track">
          <div class="bar" :style="{ width: `${slot.rate}%` }"></div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>资源</th>
          <th>类型</th>
          <th>班组</th>
          <th>班次</th>
          <th>状态</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in resourceRows" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.team }}</td>
          <td>{{ row.shift }}</td>
          <td><span :class="['badge', row.status]">{{ row.statusLabel }}</span></td>
          <td>{{ row.note }}</td>
        </tr>
      </tbody>
    </table>

    <BaseModal v-model="showForm" title="新增资源">
      <div class="form-grid">
        <div class="input-group">
          <label>资源名称</label>
          <input v-model="form.name" placeholder="例如：QCT-09" />
        </div>
        <div class="input-group">
          <label>类型</label>
          <select v-model="form.type">
            <option>岸桥</option>
            <option>场桥</option>
            <option>AGV</option>
            <option>泊位</option>
          </select>
        </div>
        <div class="input-group">
          <label>班组</label>
          <input v-model="form.team" placeholder="甲班" />
        </div>
        <div class="input-group">
          <label>班次</label>
          <input v-model="form.shift" placeholder="夜班" />
        </div>
        <div class="input-group">
          <label>备注</label>
          <textarea v-model="form.note" rows="3"></textarea>
        </div>
      </div>
      <div class="section-header" style="margin-top: 14px;">
        <span>提交后将自动校验安全间隔与桥吊干涉</span>
        <button class="btn" @click="saveResource">保存</button>
      </div>
    </BaseModal>

    <ProgressModal v-model="showProgress" :message="progressMessage" />

    <BaseModal v-model="showTip" title="作业规则提示">
      <p class="modal-message">{{ tipMessage }}</p>
      <ul>
        <li>泊位安全间隔 ≥ 30m，桥吊横移间隔 ≥ 2 Bay。</li>
        <li>AGV、拖车路径冲突自动避让，场桥与岸桥避免同时跨堆。</li>
        <li>班组换班前 20 分钟不下发新任务，保持空闲缓冲。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ProgressModal from '../components/ProgressModal.vue';

const berthUtil = [
  { name: 'A1 泊位', rate: 78 },
  { name: 'A2 泊位', rate: 66 },
  { name: 'B1 泊位', rate: 82 },
  { name: 'B2 泊位', rate: 59 }
];

const resourceRows = [
  { name: 'QCT-01', type: '岸桥', team: '甲班', shift: '白班', status: 'success', statusLabel: '可用', note: '安全校核已通过' },
  { name: 'QCT-02', type: '岸桥', team: '乙班', shift: '夜班', status: 'success', statusLabel: '可用', note: '夜班优先分配' },
  { name: 'QCT-03', type: '岸桥', team: '丙班', shift: '白班', status: 'warning', statusLabel: '检修', note: '吊具更换' },
  { name: 'RTG-11', type: '场桥', team: '甲班', shift: '夜班', status: 'success', statusLabel: '可用', note: '堆场C区' },
  { name: 'RTG-12', type: '场桥', team: '乙班', shift: '夜班', status: 'success', statusLabel: '可用', note: '堆场B区' },
  { name: 'RTG-13', type: '场桥', team: '甲班', shift: '白班', status: 'success', statusLabel: '可用', note: '堆场D区' },
  { name: 'AGV-21', type: 'AGV', team: '乙班', shift: '夜班', status: 'success', statusLabel: '可用', note: '电量 80%' },
  { name: 'AGV-22', type: 'AGV', team: '丙班', shift: '白班', status: 'warning', statusLabel: '维护', note: '轮胎检查' },
  { name: 'AGV-23', type: 'AGV', team: '甲班', shift: '夜班', status: 'success', statusLabel: '可用', note: '航线北区' },
  { name: 'AGV-24', type: 'AGV', team: '乙班', shift: '白班', status: 'success', statusLabel: '可用', note: '航线南区' },
  { name: '泊位-A1', type: '泊位', team: '计划', shift: '全天', status: 'success', statusLabel: '可靠', note: '长 400m' },
  { name: '泊位-A2', type: '泊位', team: '计划', shift: '全天', status: 'warning', statusLabel: '冲突复核', note: '潮窗限制' },
  { name: '泊位-B1', type: '泊位', team: '计划', shift: '全天', status: 'success', statusLabel: '可靠', note: '深度 16m' },
  { name: '泊位-B2', type: '泊位', team: '计划', shift: '全天', status: 'success', statusLabel: '可靠', note: '靠泊桥吊 5 台' },
  { name: '拖车-31', type: '拖车', team: '甲班', shift: '夜班', status: 'success', statusLabel: '可用', note: '冷藏箱专用' },
  { name: '拖车-32', type: '拖车', team: '乙班', shift: '夜班', status: 'success', statusLabel: '可用', note: '备用' },
  { name: '拖车-33', type: '拖车', team: '甲班', shift: '白班', status: 'warning', statusLabel: '保养', note: '更换机油' },
  { name: '班组-甲', type: '班组', team: '甲班', shift: '白班', status: 'success', statusLabel: '满编', note: '桥司机 5 人' },
  { name: '班组-乙', type: '班组', team: '乙班', shift: '夜班', status: 'success', statusLabel: '满编', note: '场桥司机 6 人' },
  { name: '班组-丙', type: '班组', team: '丙班', shift: '夜班', status: 'warning', statusLabel: '补员中', note: '缺口 1 人' },
  { name: '堆场-C3', type: '堆场区块', team: '计划', shift: '全天', status: 'success', statusLabel: '开放', note: '冷藏插座 20 个' },
  { name: '堆场-D1', type: '堆场区块', team: '计划', shift: '全天', status: 'success', statusLabel: '开放', note: '危品隔离区' }
];

const showForm = ref(false);
const showTip = ref(false);
const showProgress = ref(false);
const progressMessage = ref('');
const tipMessage = ref('作业规则与新资源校验结果');

const form = reactive({
  name: '',
  type: '岸桥',
  team: '',
  shift: '',
  note: ''
});

const saveResource = () => {
  tipMessage.value = `资源 ${form.name || '新资源'} 已校验安全间隔与干涉，等待调度生效。`;
  showForm.value = false;
  showTip.value = true;
};

const openBerthImport = () => {
  progressMessage.value = '正在导入泊位计划并核对潮窗、靠泊窗口与桥吊可达性...';
  showProgress.value = true;
};

const openRuleTips = () => {
  tipMessage.value = '最新作业规则与安全约束提示，确保资源录入合规。';
  showTip.value = true;
};
</script>

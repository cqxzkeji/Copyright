<template>
  <div class="card">
    <h2>转化漏斗</h2>
    <p class="muted">从曝光到成交的各环节表现</p>
    <table class="table">
      <thead>
        <tr>
          <th>环节</th>
          <th>人数</th>
          <th>转化率</th>
          <th>流失原因</th>
          <th>优化动作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="step in steps" :key="step.stage">
          <td>{{ step.stage }}</td>
          <td>{{ step.count }}</td>
          <td>{{ step.rate }}</td>
          <td>{{ step.reason }}</td>
          <td>{{ step.action }}</td>
        </tr>
      </tbody>
    </table>
    <div class="btn-row">
      <button class="btn" @click="showWeight = true">更新渠道权重</button>
      <button class="btn secondary" @click="startAB">执行 A/B 同步</button>
      <button class="btn danger" @click="showGuide = true">优化提示</button>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h2>渠道转化</h2>
      <div v-for="channel in channelCv" :key="channel.name" class="chart-row">
        <span>{{ channel.name }}</span>
        <div class="chart-bar" :style="{ width: channel.value + '%' }"></div>
        <strong>{{ channel.value }}%</strong>
      </div>
    </div>
    <div class="card">
      <h2>表单质量</h2>
      <div v-for="field in formQuality" :key="field.name" class="chart-row">
        <span>{{ field.name }}</span>
        <div class="chart-bar" :style="{ width: field.score + '%' }"></div>
        <strong>{{ field.score }}%</strong>
      </div>
    </div>
  </div>

  <ModalDialog title="渠道权重" v-model="showWeight">
    <form class="login-form" @submit.prevent="submitWeight">
      <label>渠道名称</label>
      <input v-model="weightForm.channel" required />
      <label>权重百分比</label>
      <input v-model="weightForm.weight" placeholder="如：20%" />
      <div class="modal-footer">
        <button type="button" class="btn secondary" @click="showWeight = false">取消</button>
        <button type="submit" class="btn">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog title="A/B 同步" v-model="abSyncing">
    <p>正在同步实验流量与转化事件。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: abProgress + '%' }"></div>
    </div>
    <div class="modal-footer">
      <button class="btn" :disabled="abProgress < 100" @click="abSyncing = false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog title="优化提示" v-model="showGuide">
    <p>建议缩短表单项并提升移动端加载速度，以提升支付环节转化。</p>
    <div class="modal-footer">
      <button class="btn" @click="showGuide = false">好的</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const steps = [
  { stage: '曝光', count: '3,200,000', rate: '100%', reason: '-', action: '优化定向' },
  { stage: '点击', count: '240,000', rate: '7.5%', reason: '创意吸引力', action: 'A/B 创意' },
  { stage: '到达', count: '180,000', rate: '5.6%', reason: '落地页加载', action: '性能优化' },
  { stage: '停留 10s', count: '120,000', rate: '3.8%', reason: '内容相关度', action: '强化卖点' },
  { stage: '表单启动', count: '85,000', rate: '2.6%', reason: '表单长度', action: '减少字段' },
  { stage: '表单提交', count: '62,000', rate: '1.9%', reason: '字段错误', action: '校验提示' },
  { stage: '线索确认', count: '50,000', rate: '1.5%', reason: '重复线索', action: '去重合并' },
  { stage: '销售跟进', count: '32,000', rate: '1.0%', reason: '响应速度', action: 'SLA 提升' },
  { stage: '支付意向', count: '22,000', rate: '0.7%', reason: '价格敏感', action: '优惠券触达' },
  { stage: '成交', count: '16,800', rate: '0.5%', reason: '竞争产品', action: '差异化话术' }
];

const channelCv = [
  { name: '抖音', value: 5.2 },
  { name: '信息流', value: 4.8 },
  { name: '搜索', value: 3.9 },
  { name: '朋友圈', value: 2.6 },
  { name: '知乎', value: 2.4 }
];

const formQuality = [
  { name: '字段完整率', score: 82 },
  { name: '号码有效率', score: 76 },
  { name: '重复率', score: 12 },
  { name: '提交成功率', score: 88 },
  { name: '验证通过率', score: 91 }
];

const showWeight = ref(false);
const abSyncing = ref(false);
const showGuide = ref(false);
const abProgress = ref(0);
const weightForm = ref({ channel: '', weight: '' });
let abTimer;

const submitWeight = () => {
  showWeight.value = false;
};

const startAB = () => {
  abSyncing.value = true;
  abProgress.value = 0;
  clearInterval(abTimer);
  abTimer = setInterval(() => {
    if (abProgress.value >= 100) {
      clearInterval(abTimer);
      return;
    }
    abProgress.value += 17;
  }, 350);
};
</script>

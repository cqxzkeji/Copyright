<template>
  <div class="card">
    <h2>活动进度表</h2>
    <p class="muted">跨渠道推广状态监控</p>
    <table class="table">
      <thead>
        <tr>
          <th>活动名称</th>
          <th>渠道</th>
          <th>预算</th>
          <th>曝光</th>
          <th>点击</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in campaigns" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.channel }}</td>
          <td>{{ item.budget }}</td>
          <td>{{ item.impression }}</td>
          <td>{{ item.click }}</td>
          <td><span class="tag">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
    <div class="btn-row">
      <button class="btn" @click="showCreate = true">新建活动</button>
      <button class="btn secondary" @click="showPause = true">批量暂停</button>
      <button class="btn danger" @click="startExport">导出报告</button>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h2>投放节奏</h2>
      <div v-for="pace in pacing" :key="pace.time" class="chart-row">
        <span>{{ pace.time }}</span>
        <div class="chart-bar" :style="{ width: pace.value + '%' }"></div>
        <strong>{{ pace.value }}%</strong>
      </div>
    </div>
    <div class="card">
      <h2>曝光来源</h2>
      <div v-for="source in sources" :key="source.name" class="chart-row">
        <span>{{ source.name }}</span>
        <div class="chart-bar" :style="{ width: source.rate + '%' }"></div>
        <strong>{{ source.rate }}%</strong>
      </div>
    </div>
  </div>

  <ModalDialog title="新建活动" v-model="showCreate">
    <form class="login-form" @submit.prevent="submitCampaign">
      <label>活动名称</label>
      <input v-model="newCampaign.name" required />
      <label>投放渠道</label>
      <input v-model="newCampaign.channel" placeholder="如：信息流" />
      <label>预算</label>
      <input v-model="newCampaign.budget" placeholder="如：￥50,000" />
      <div class="modal-footer">
        <button type="button" class="btn secondary" @click="showCreate = false">取消</button>
        <button type="submit" class="btn">创建</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog title="批量暂停提示" v-model="showPause">
    <p>暂停后将立即下线当前选中的 10 个活动，确认继续？</p>
    <div class="modal-footer">
      <button class="btn secondary" @click="showPause = false">稍后处理</button>
      <button class="btn danger" @click="showPause = false">确认暂停</button>
    </div>
  </ModalDialog>

  <ModalDialog title="导出进度" v-model="exporting">
    <p>正在生成活动报告，包含投放、转化与 ROI 维度。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: exportProgress + '%' }"></div>
    </div>
    <div class="modal-footer">
      <button class="btn" :disabled="exportProgress < 100" @click="exporting = false">完成</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const campaigns = [
  { name: '春节红包雨', channel: '抖音', budget: '￥80,000', impression: '2,100,000', click: '123,000', status: '投放中' },
  { name: '返校季', channel: '微博', budget: '￥35,000', impression: '820,000', click: '42,000', status: '已完成' },
  { name: '新品首发', channel: '小红书', budget: '￥50,000', impression: '1,200,000', click: '72,000', status: '投放中' },
  { name: '618 大促', channel: '信息流', budget: '￥120,000', impression: '3,500,000', click: '210,000', status: '投放中' },
  { name: '校园合作', channel: 'B站', budget: '￥28,000', impression: '640,000', click: '30,000', status: '已完成' },
  { name: '品牌深耕', channel: '知乎', budget: '￥45,000', impression: '910,000', click: '51,000', status: '优化中' },
  { name: '用户拉新', channel: '快手', budget: '￥65,000', impression: '1,600,000', click: '93,000', status: '投放中' },
  { name: '城市门店', channel: '朋友圈', budget: '￥38,000', impression: '700,000', click: '37,000', status: '优化中' },
  { name: '会员召回', channel: '短信', budget: '￥15,000', impression: '300,000', click: '19,000', status: '投放中' },
  { name: '线索收集', channel: '搜索', budget: '￥55,000', impression: '1,400,000', click: '86,000', status: '投放中' },
  { name: '新品测款', channel: '微信广告', budget: '￥32,000', impression: '520,000', click: '28,000', status: '已完成' }
];

const pacing = [
  { time: '上午', value: 56 },
  { time: '中午', value: 68 },
  { time: '下午', value: 74 },
  { time: '晚上', value: 92 }
];

const sources = [
  { name: '短视频', rate: 42 },
  { name: '信息流', rate: 28 },
  { name: '搜索广告', rate: 18 },
  { name: '公众号/朋友圈', rate: 12 }
];

const showCreate = ref(false);
const showPause = ref(false);
const exporting = ref(false);
const exportProgress = ref(0);
const newCampaign = ref({ name: '', channel: '', budget: '' });
let exportTimer;

const submitCampaign = () => {
  showCreate.value = false;
};

const startExport = () => {
  exporting.value = true;
  exportProgress.value = 0;
  clearInterval(exportTimer);
  exportTimer = setInterval(() => {
    if (exportProgress.value >= 100) {
      clearInterval(exportTimer);
      return;
    }
    exportProgress.value += 15;
  }, 350);
};
</script>

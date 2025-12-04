<template>
  <div class="card">
    <h2>人群分层</h2>
    <p class="muted">受众画像与偏好洞察</p>
    <table class="table">
      <thead>
        <tr>
          <th>人群</th>
          <th>规模</th>
          <th>转化率</th>
          <th>偏好内容</th>
          <th>最近互动</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in segments" :key="group.name">
          <td>{{ group.name }}</td>
          <td>{{ group.size }}</td>
          <td>{{ group.cv }}</td>
          <td>{{ group.preference }}</td>
          <td>{{ group.recency }}</td>
        </tr>
      </tbody>
    </table>
    <div class="btn-row">
      <button class="btn" @click="showPortrait = true">添加画像标签</button>
      <button class="btn secondary" @click="showHint = true">查看分析提示</button>
      <button class="btn danger" @click="syncProfile">同步受众包</button>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h2>性别与年龄结构</h2>
      <div v-for="item in ageGender" :key="item.label" class="chart-row">
        <span>{{ item.label }}</span>
        <div class="chart-bar" :style="{ width: item.value + '%' }"></div>
        <strong>{{ item.value }}%</strong>
      </div>
    </div>
    <div class="card">
      <h2>城市覆盖</h2>
      <div v-for="city in cities" :key="city.name" class="chart-row">
        <span>{{ city.name }}</span>
        <div class="chart-bar" :style="{ width: city.rate + '%' }"></div>
        <strong>{{ city.rate }}%</strong>
      </div>
    </div>
  </div>

  <ModalDialog title="新增画像标签" v-model="showPortrait">
    <form class="login-form" @submit.prevent="submitPortrait">
      <label>标签名称</label>
      <input v-model="portrait.name" required />
      <label>标签规则</label>
      <input v-model="portrait.rule" placeholder="如：近7天下单≥2" />
      <div class="modal-footer">
        <button type="button" class="btn secondary" @click="showPortrait = false">取消</button>
        <button type="submit" class="btn">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog title="分析提示" v-model="showHint">
    <p>建议将高价值人群拆分投放，并对互动强度低的人群触发召回任务。</p>
    <div class="modal-footer">
      <button class="btn" @click="showHint = false">我知道了</button>
    </div>
  </ModalDialog>

  <ModalDialog title="受众同步" v-model="syncing">
    <p>正在打包受众并同步到广告平台。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: syncProgress + '%' }"></div>
    </div>
    <div class="modal-footer">
      <button class="btn" :disabled="syncProgress < 100" @click="syncing = false">完成</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const segments = [
  { name: '高价值会员', size: '120,000', cv: '14.2%', preference: '数码、家电', recency: '1.5 天' },
  { name: '沉睡用户', size: '420,000', cv: '2.1%', preference: '优惠券', recency: '19 天' },
  { name: '新品兴趣', size: '260,000', cv: '8.6%', preference: '美妆、穿搭', recency: '3 天' },
  { name: '学生群体', size: '180,000', cv: '6.1%', preference: '学习、平板', recency: '5 天' },
  { name: '家庭决策者', size: '210,000', cv: '7.4%', preference: '家装、亲子', recency: '4 天' },
  { name: '价格敏感', size: '330,000', cv: '3.2%', preference: '拼团、满减', recency: '11 天' },
  { name: '线索跟进', size: '90,000', cv: '9.8%', preference: '电话咨询', recency: '2 天' },
  { name: '新注册', size: '510,000', cv: '1.5%', preference: '引导激活', recency: '0.5 天' },
  { name: '复购潜力', size: '160,000', cv: '12.4%', preference: '老客加购', recency: '3 天' },
  { name: '品牌粉丝', size: '220,000', cv: '10.1%', preference: '互动玩法', recency: '2 天' },
  { name: '渠道导流', size: '140,000', cv: '5.4%', preference: '线下体验', recency: '6 天' }
];

const ageGender = [
  { label: '女性 18-25', value: 32 },
  { label: '女性 26-35', value: 24 },
  { label: '男性 18-25', value: 18 },
  { label: '男性 26-35', value: 16 },
  { label: '其他', value: 10 }
];

const cities = [
  { name: '一线城市', rate: 36 },
  { name: '新一线', rate: 28 },
  { name: '二线城市', rate: 20 },
  { name: '三线及以下', rate: 16 }
];

const showPortrait = ref(false);
const showHint = ref(false);
const syncing = ref(false);
const syncProgress = ref(0);
const portrait = ref({ name: '', rule: '' });
let syncTimer;

const submitPortrait = () => {
  showPortrait.value = false;
};

const syncProfile = () => {
  syncing.value = true;
  syncProgress.value = 0;
  clearInterval(syncTimer);
  syncTimer = setInterval(() => {
    if (syncProgress.value >= 100) {
      clearInterval(syncTimer);
      return;
    }
    syncProgress.value += 20;
  }, 400);
};
</script>

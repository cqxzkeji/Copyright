<template>
  <div class="page">
    <div class="section-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 700;">运营与营销管理</div>
        <div class="action-row">
          <button class="btn" @click="openCampaign">创建活动</button>
          <button class="btn secondary" @click="openCoupon">投放优惠券</button>
          <button class="btn warning" @click="openTip">推广提示</button>
        </div>
      </div>
      <div class="card-grid" style="margin-top: 16px;">
        <div class="section-card" v-for="metric in metrics" :key="metric.label">
          <div style="font-size: 12px; color: #64748b;">{{ metric.label }}</div>
          <div style="font-size: 22px; font-weight: 700; margin-top: 8px;">{{ metric.value }}</div>
          <div class="badge" style="margin-top: 10px;">{{ metric.tag }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">直播与团购热度</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
        <div class="section-card" v-for="live in liveData" :key="live.name">
          <div style="font-weight: 600;">{{ live.name }}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 6px;">{{ live.detail }}</div>
          <div class="progress" style="margin-top: 12px;">
            <span :style="{ width: live.progress }"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">营销活动执行表</div>
      <table class="table">
        <thead>
          <tr>
            <th>活动名称</th>
            <th>渠道</th>
            <th>触达量</th>
            <th>转化率</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="act in activities" :key="act.name">
            <td>{{ act.name }}</td>
            <td>{{ act.channel }}</td>
            <td>{{ act.reach }}</td>
            <td>{{ act.rate }}</td>
            <td><span class="badge">{{ act.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="campaignOpen" title="创建营销活动" :on-close="closeCampaign">
      <form class="modal-form" @submit.prevent="submitCampaign">
        <div>
          <label>活动名称</label>
          <input v-model="campaignForm.name" type="text" placeholder="如：乡味直播节" required />
        </div>
        <div>
          <label>渠道</label>
          <select v-model="campaignForm.channel">
            <option>直播间</option>
            <option>社区团购</option>
            <option>政府平台</option>
          </select>
        </div>
        <div>
          <label>目标触达</label>
          <input v-model="campaignForm.reach" type="number" min="0" required />
        </div>
        <div>
          <label>主推产品</label>
          <input v-model="campaignForm.product" type="text" placeholder="如：高山蔬菜" />
        </div>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeCampaign">取消</button>
        <button class="btn" @click="submitCampaign">创建</button>
      </template>
    </BaseModal>

    <BaseModal :open="couponOpen" title="投放优惠券" :on-close="closeCoupon">
      <p>正在向 3,200 名用户投放新客券。</p>
      <div class="progress" style="margin-top: 16px;">
        <span :style="{ width: '82%' }"></span>
      </div>
      <template #footer>
        <button class="btn" @click="closeCoupon">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="tipOpen" title="推广提示" :on-close="closeTip">
      <p>建议本周重点推广菌菇礼盒与生态大米，直播间转化率高。</p>
      <p>社区团购渠道下单高峰在周三晚间。</p>
      <template #footer>
        <button class="btn" @click="closeTip">收到</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = [
  { label: '活动数', value: '12 场', tag: '本周计划' },
  { label: '直播观看', value: '18.6 万', tag: '周同比 +8%' },
  { label: '团购订单', value: '4,320 单', tag: '转化率 5.2%' },
  { label: '新增会员', value: '920 人', tag: '复购潜力' }
];

const liveData = [
  { name: '乡味直播间', detail: '主推菌菇礼盒', progress: '78%' },
  { name: '乡村特产馆', detail: '主推蜂蜜制品', progress: '66%' },
  { name: '农旅融合专场', detail: '主推文旅套餐', progress: '55%' },
  { name: '社区团购专区', detail: '主推高山蔬菜', progress: '72%' }
];

const activities = ref([
  { name: '乡味直播节', channel: '直播间', reach: '4.2 万', rate: '6.1%', status: '进行中' },
  { name: '丰收团购季', channel: '社区团购', reach: '3.8 万', rate: '5.4%', status: '进行中' },
  { name: '暖心年货节', channel: '政府平台', reach: '2.9 万', rate: '4.8%', status: '筹备中' },
  { name: '乡村好物周', channel: '直播间', reach: '5.1 万', rate: '6.8%', status: '进行中' },
  { name: '农旅周末行', channel: '小程序', reach: '1.4 万', rate: '3.2%', status: '已完成' },
  { name: '供应链直供', channel: '社区团购', reach: '2.2 万', rate: '5.0%', status: '进行中' },
  { name: '新客尝鲜券', channel: '短信触达', reach: '6.5 万', rate: '2.9%', status: '进行中' },
  { name: '乡村惠民日', channel: '政府平台', reach: '2.1 万', rate: '4.1%', status: '筹备中' },
  { name: '品牌故事传播', channel: '短视频', reach: '7.6 万', rate: '3.6%', status: '进行中' },
  { name: '加工品专场', channel: '直播间', reach: '3.3 万', rate: '5.9%', status: '已完成' }
]);

const campaignOpen = ref(false);
const couponOpen = ref(false);
const tipOpen = ref(false);

const campaignForm = reactive({
  name: '',
  channel: '直播间',
  reach: 0,
  product: ''
});

const openCampaign = () => {
  campaignOpen.value = true;
};
const closeCampaign = () => {
  campaignOpen.value = false;
};
const submitCampaign = () => {
  activities.value.unshift({
    name: campaignForm.name,
    channel: campaignForm.channel,
    reach: `${campaignForm.reach} 人`,
    rate: '0.0%',
    status: '筹备中'
  });
  campaignForm.name = '';
  campaignForm.channel = '直播间';
  campaignForm.reach = 0;
  campaignForm.product = '';
  campaignOpen.value = false;
};

const openCoupon = () => {
  couponOpen.value = true;
};
const closeCoupon = () => {
  couponOpen.value = false;
};

const openTip = () => {
  tipOpen.value = true;
};
const closeTip = () => {
  tipOpen.value = false;
};
</script>

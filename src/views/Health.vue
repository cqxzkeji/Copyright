<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section-header">
        <div>
          <p class="eyebrow">健康管理建议</p>
          <h3>根据患者数据生成个性化健康管理与生活方式建议</h3>
        </div>
        <div class="chip-row">
          <button class="btn" @click="showAdviceForm = true">新建方案</button>
          <button class="btn secondary" @click="openInfo('运动、饮食与用药提醒已同步到患者APP。')">同步提醒</button>
        </div>
      </header>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <div class="card" v-for="item in plans" :key="item.title" :style="{ background: item.bg }">
          <p class="eyebrow">{{ item.title }}</p>
          <h2>{{ item.focus }}</h2>
          <p>{{ item.detail }}</p>
          <button class="btn secondary" @click="openInfo(item.title + ' 已推送至患者。')">查看推送</button>
        </div>
      </div>
    </div>

    <div class="card">
      <header class="section-header">
        <h3>生活方式与用药建议</h3>
        <small>个性化建议帮助患者自我管理</small>
      </header>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
        <div class="card" style="background:#ecfeff;">
          <h4>饮食管理</h4>
          <ul>
            <li v-for="(tip, idx) in dietTips" :key="idx">{{ tip }}</li>
          </ul>
          <button class="btn secondary" @click="openInfo('已将饮食清单推送至家庭群。')">发送饮食表</button>
        </div>
        <div class="card" style="background:#f0fdf4;">
          <h4>运动处方</h4>
          <ul>
            <li v-for="(tip, idx) in exerciseTips" :key="idx">{{ tip }}</li>
          </ul>
          <button class="btn secondary" @click="openInfo('运动计划已同步至随访日历。')">安排运动</button>
        </div>
        <div class="card" style="background:#fefce8;">
          <h4>用药提醒</h4>
          <ul>
            <li v-for="(tip, idx) in medicineTips" :key="idx">{{ tip }}</li>
          </ul>
          <button class="btn secondary" @click="openInfo('本周用药提醒已生成。')">生成提醒</button>
        </div>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showAdviceForm" title="制定健康管理方案">
    <form class="grid" @submit.prevent="createPlan">
      <div class="form-row">
        <div>
          <label>方案名称</label>
          <input v-model="planForm.title" required />
        </div>
        <div>
          <label>侧重方向</label>
          <input v-model="planForm.focus" required />
        </div>
      </div>
      <div>
        <label>详细措施</label>
        <textarea v-model="planForm.detail" rows="3" required></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" type="button" @click="showAdviceForm = false">取消</button>
        <button class="btn" type="submit">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="提示">
    <p>{{ infoMessage }}</p>
    <div class="modal-footer">
      <button class="btn" @click="showInfo = false">确定</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const plans = reactive([
  { title: '稳压与控盐', focus: '减钠饮食', detail: '限制每日食盐 < 5g，减少腌制食品。', bg: '#eff6ff' },
  { title: '蛋白管理', focus: '优质蛋白', detail: '鸡蛋白、鱼肉、奶类优先，避免高嘌呤。', bg: '#fef9c3' },
  { title: '补水与监测', focus: '水化管理', detail: '每日饮水 1500-2000ml，记录出入量。', bg: '#ecfeff' }
]);

const dietTips = [
  '增加蔬菜水果摄入，控制动物脂肪',
  '减少高钠调味料，选择低钠盐',
  '优先选择蒸煮方式，少油炸',
  '保持充足钾摄入但避免过量补充'
];

const exerciseTips = [
  '每周至少 150 分钟中等强度运动',
  '选择快走、游泳、骑行等低冲击运动',
  '运动前后监测血压，避免过度疲劳'
];

const medicineTips = [
  'ARB/ACEI 类药物按时服用，监测血钾',
  '定期复查肌酐、尿素氮，根据指标调整剂量',
  '避免肾毒性药物，使用前咨询医生'
];

const showAdviceForm = ref(false);
const showInfo = ref(false);
const infoMessage = ref('');
const planForm = reactive({ title: '', focus: '', detail: '' });

const createPlan = () => {
  plans.push({ ...planForm, bg: '#e0f2fe' });
  showAdviceForm.value = false;
  openInfo('方案已创建，并同步到患者端。');
  planForm.title = '';
  planForm.focus = '';
  planForm.detail = '';
};

const openInfo = (msg) => {
  infoMessage.value = msg;
  showInfo.value = true;
};
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

ul {
  padding-left: 18px;
  margin: 0 0 12px 0;
}
</style>

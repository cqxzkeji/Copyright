<template>
  <div class="module-layout">
    <section class="section-card">
      <header class="module-header">
        <div>
          <h3>互动活动排期</h3>
          <p>一键推送冰雪任务到所有参团成员</p>
        </div>
        <button @click="launchMiniGame">发起冰壶竞速</button>
      </header>
      <div class="activity-list">
        <article v-for="activity in activities" :key="activity.id" class="activity-card">
          <div>
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.desc }}</p>
          </div>
          <div class="activity-meta">
            <span class="tag">{{ activity.time }}</span>
            <button @click="join(activity)">报名</button>
            <button style="background:#0ea5e9;" @click="openChecklist(activity)">道具清单</button>
          </div>
        </article>
      </div>
    </section>

    <section class="section-card">
      <header class="module-header">
        <h3>互动热度排行</h3>
      </header>
      <div class="flat-chart">
        <div v-for="team in teams" :key="team.name" class="flat-chart-bar" :style="{ height: team.score + '%' }">
          <span>{{ team.name }}</span>
        </div>
      </div>
    </section>

    <BaseModal :open="showJoin" :title="`报名 ${currentActivity?.title}`" @close="showJoin = false">
      <p>选择角色与装备，将任务推送至头显。</p>
      <form class="form-grid" @submit.prevent="confirmJoin">
        <label>
          角色定位
          <select v-model="joinForm.role">
            <option>向导</option>
            <option>纪录者</option>
            <option>挑战者</option>
          </select>
        </label>
        <label>
          体感装备
          <select v-model="joinForm.device">
            <option>全身动捕</option>
            <option>手柄 + 触觉背心</option>
            <option>基础手柄</option>
          </select>
        </label>
        <button type="submit">提交</button>
      </form>
    </BaseModal>

    <BaseModal :open="showChecklist" :title="`${currentActivity?.title} 道具清单`" @close="showChecklist = false">
      <ul>
        <li v-for="item in currentActivity?.items || []" :key="item">{{ item }}</li>
      </ul>
    </BaseModal>

    <BaseModal :open="showProgress" title="冰壶竞速部署" @close="stopMiniGame">
      <div style="display:flex;flex-direction:column;gap:0.8rem;">
        <p>正在同步玩法脚本与实时语音频道。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: miniProgress + '%' }"></div>
        </div>
        <strong>{{ miniProgress }}%</strong>
      </div>
    </BaseModal>

    <BaseModal :open="showToast" title="操作完成" @close="showToast = false">
      <p>{{ toastMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activities = [
  { id: 1, title: '雪山救援协作', desc: '四人组队完成搜救路线。', time: '10:00', items: ['绳索模拟器', '热成像探测', '医疗背包'] },
  { id: 2, title: '冰湖飞跃挑战', desc: '通过身体平衡躲避裂缝。', time: '11:30', items: ['平衡脚环', '安全抓钩', '语音计时器'] },
  { id: 3, title: '极夜篝火晚会', desc: '音乐互动与节奏游戏。', time: '14:00', items: ['乐器插件', '灯光脚本', '烟雾模拟'] }
];

const teams = [
  { name: '雪狐', score: 90 },
  { name: '冰雕', score: 70 },
  { name: '霜翼', score: 60 },
  { name: '凌风', score: 55 }
];

const showJoin = ref(false);
const showChecklist = ref(false);
const showProgress = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const currentActivity = ref(null);
const joinForm = reactive({ role: '向导', device: '全身动捕' });
const miniProgress = ref(0);
let timer;

function join(activity) {
  currentActivity.value = activity;
  showJoin.value = true;
}

function confirmJoin() {
  showJoin.value = false;
  toastMessage.value = `${currentActivity.value.title} 已为 ${joinForm.role} 分配 ${joinForm.device}`;
  showToast.value = true;
}

function openChecklist(activity) {
  currentActivity.value = activity;
  showChecklist.value = true;
}

function launchMiniGame() {
  miniProgress.value = 0;
  showProgress.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    miniProgress.value += 20;
    if (miniProgress.value >= 100) {
      miniProgress.value = 100;
      clearInterval(timer);
      toastMessage.value = '冰壶竞速匹配完成，已生成房间号。';
      showToast.value = true;
    }
  }, 400);
}

function stopMiniGame() {
  showProgress.value = false;
  clearInterval(timer);
}
</script>

<style scoped>
.module-layout {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.activity-card {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 16px;
  gap: 1rem;
}

.activity-meta {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}
</style>

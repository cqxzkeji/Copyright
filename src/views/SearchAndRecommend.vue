<template>
  <div class="grid" style="grid-template-columns: 1.2fr 1fr; gap: 16px;">
    <section class="card">
      <div class="header">
        <h2>搜索 & 推荐</h2>
        <div class="actions">
          <button class="btn" @click="showStrategy = true">调整策略</button>
          <button class="btn secondary" @click="showQuery = true">搜索示例</button>
          <button class="btn" @click="showTip = true">提示</button>
        </div>
        <p v-if="strategySummary" class="status">{{ strategySummary }}</p>
        <p v-if="searchResult" class="muted">{{ searchResult }}</p>
      </div>
      <div class="search-box">
        <input v-model="keyword" placeholder="输入关键词" @keyup.enter="runSearch" />
        <button class="btn" @click="runSearch">开始搜索</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>关键词</th>
            <th>热度</th>
            <th>点击率</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in keywords" :key="item.word">
            <td>
              <div class="cell-title">
                <span>{{ item.word }}</span>
                <span v-if="item.boundTo" class="chip inline">{{ item.boundTo }}</span>
              </div>
              <small v-if="item.boosted" class="muted">已冲榜完成</small>
            </td>
            <td>{{ item.heat }}</td>
            <td>{{ item.ctr }}</td>
            <td>
              <button class="btn secondary" @click="openBind(item)">绑定视频</button>
              <button class="btn" @click="openBoost(item)">冲榜</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <div class="header">
        <h3>推荐流量</h3>
        <button class="btn secondary" @click="showPlan = true">新建计划</button>
      </div>
      <div class="dashboard-chart">
        <div v-for="item in recommend" :key="item.scene" class="bar" :style="{ height: item.value + 'px' }">
          {{ item.scene }}
        </div>
      </div>
      <ul class="chips">
        <li v-for="tag in tags" :key="tag" class="chip">{{ tag }}</li>
      </ul>
    </section>
  </div>

    <Modal v-if="showStrategy" title="策略调整" @close="showStrategy = false">
    <form class="form-grid" @submit.prevent="submitStrategy">
      <label>推荐倾向</label>
      <select v-model="strategy.tendency">
        <option>新用户优先</option>
        <option>高消费人群</option>
        <option>高完播率人群</option>
      </select>
      <label>权重 ({{ strategy.weight }}%)</label>
      <input v-model.number="strategy.weight" type="range" min="0" max="100" />
      <button class="btn" type="submit">保存</button>
    </form>
  </Modal>

  <Modal v-if="showQuery" title="搜索示例" @close="showQuery = false">
    <p>示例：夜市美食 vlog、城市夜景、手工咖啡拉花、萌宠治愈片段。</p>
    <button class="btn" @click="showQuery = false">知道了</button>
  </Modal>

  <Modal v-if="showTip" title="提示" @close="showTip = false">
    <p>提升相关性可以让推荐页曝光提升 15%，请保持标题与内容一致。</p>
    <button class="btn" @click="showTip = false">我会优化</button>
  </Modal>

  <Modal v-if="activeBind" :title="`绑定 ${activeBind.word}`" @close="activeBind = null">
    <form class="form-grid" @submit.prevent="submitBind">
      <label>选择视频</label>
      <select v-model="bindSelection">
        <option>夜市烟火气记录</option>
        <option>萌宠日常混剪</option>
        <option>森林露营 24 小时</option>
      </select>
      <button class="btn" type="submit">绑定</button>
    </form>
  </Modal>

  <Modal v-if="activeBoost" :title="`冲榜 ${activeBoost.word}`" @close="activeBoost = null">
    <p>正在推送至推荐位... {{ boostProgress }}%</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: boostProgress + '%' }"></div>
    </div>
  </Modal>

  <Modal v-if="showPlan" title="新建推荐计划" @close="showPlan = false">
    <form class="form-grid" @submit.prevent="submitPlan">
      <label>计划名称</label>
      <input v-model="planForm.name" placeholder="例：夜市主题提升" />
      <label>预算</label>
      <input v-model.number="planForm.budget" type="number" min="0" step="500" />
      <button class="btn" type="submit">创建</button>
    </form>
  </Modal>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue';

const showStrategy = ref(false);
const showQuery = ref(false);
const showTip = ref(false);
const showPlan = ref(false);
const boostProgress = ref(20);
const activeBind = ref(null);
const activeBoost = ref(null);
const keyword = ref('城市夜景');
const strategy = reactive({ tendency: '新用户优先', weight: 50 });
const strategySummary = ref('');
const searchResult = ref('');
const planForm = reactive({ name: '', budget: 5000 });
const bindSelection = ref('夜市烟火气记录');
let boostTimer;

const keywords = reactive([
  { word: '夜市美食', heat: '98,223', ctr: '5.2%', boundTo: '', boosted: false },
  { word: '露营', heat: '72,303', ctr: '4.8%', boundTo: '', boosted: false },
  { word: '咖啡', heat: '64,021', ctr: '6.1%', boundTo: '', boosted: false },
  { word: '滑板', heat: '51,894', ctr: '4.3%', boundTo: '', boosted: false },
  { word: '科技新品', heat: '48,112', ctr: '5.7%', boundTo: '', boosted: false },
  { word: '萌宠', heat: '105,003', ctr: '7.8%', boundTo: '', boosted: false },
  { word: '手绘', heat: '33,932', ctr: '3.9%', boundTo: '', boosted: false },
  { word: '健身燃脂', heat: '41,000', ctr: '5.0%', boundTo: '', boosted: false },
  { word: '延时摄影', heat: '38,220', ctr: '4.5%', boundTo: '', boosted: false },
  { word: '城市夜景', heat: '54,103', ctr: '4.9%', boundTo: '', boosted: false },
  { word: '旅拍', heat: '29,833', ctr: '3.4%', boundTo: '', boosted: false },
  { word: 'vlog', heat: '62,410', ctr: '4.6%', boundTo: '', boosted: false }
]);

const recommend = reactive([
  { scene: '首页', value: 120 },
  { scene: '同城', value: 160 },
  { scene: '关注', value: 110 },
  { scene: '热榜', value: 150 },
  { scene: '猜你想看', value: 140 }
]);

const tags = reactive(['新锐创作者', '高完播', '冷启动', '优质音频', '高清画面']);

const runSearch = () => {
  if (!keyword.value) return;
  const heatNumber = Math.floor(Math.random() * 60000) + 30000;
  const ctrNumber = (Math.random() * 3 + 3).toFixed(1);
  keywords.unshift({
    word: keyword.value,
    heat: heatNumber.toLocaleString(),
    ctr: `${ctrNumber}%`,
    boundTo: '',
    boosted: false
  });
  if (!tags.includes(keyword.value)) tags.push(keyword.value);
  searchResult.value = `${keyword.value} 搜索完成，新增了实时热度数据`;
  showQuery.value = false;
};

const submitStrategy = () => {
  strategySummary.value = `策略已保存：${strategy.tendency}，权重 ${strategy.weight}%`;
  const lift = 1 + strategy.weight / 300;
  recommend.forEach((item) => (item.value = Math.min(260, Math.round(item.value * lift))));
  showStrategy.value = false;
};

const openBind = (item) => {
  activeBind.value = item;
  bindSelection.value = '夜市烟火气记录';
};

const submitBind = () => {
  if (!activeBind.value) return;
  activeBind.value.boundTo = bindSelection.value;
  searchResult.value = `${activeBind.value.word} 已绑定 ${bindSelection.value}`;
  activeBind.value = null;
};

const openBoost = (item) => {
  activeBoost.value = item;
  boostProgress.value = 20;
  clearInterval(boostTimer);
  boostTimer = setInterval(() => {
    boostProgress.value = Math.min(100, boostProgress.value + 18);
    if (boostProgress.value >= 100 && activeBoost.value) {
      activeBoost.value.boosted = true;
      searchResult.value = `${activeBoost.value.word} 冲榜完成并进入推荐位`;
      recommend.unshift({ scene: activeBoost.value.word, value: 180 });
      activeBoost.value = null;
      clearInterval(boostTimer);
    }
  }, 800);
};

const submitPlan = () => {
  const sceneName = planForm.name || '新计划';
  const barHeight = Math.min(220, Math.max(90, Math.floor(planForm.budget / 80)));
  recommend.push({ scene: sceneName, value: barHeight });
  if (planForm.name) tags.push(planForm.name);
  searchResult.value = `${sceneName} 已创建，预算 ¥${planForm.budget.toLocaleString()}`;
  planForm.name = '';
  planForm.budget = 5000;
  showPlan.value = false;
};

onUnmounted(() => clearInterval(boostTimer));
</script>

<script>
const Modal = {
  name: 'Modal',
  props: ['title'],
  emits: ['close'],
  template: `
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <h3 style="margin:0;">{{ title }}</h3>
          <button class="btn secondary" @click="$emit('close')">关闭</button>
        </div>
        <slot />
      </div>
    </div>
  `
};

export default {
  components: { Modal }
};
</script>

<style scoped>
.search-box {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin: 10px 0 16px;
}

.cell-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip.inline {
  padding: 4px 8px;
  background: #eef2ff;
  border-radius: 10px;
}

.chips {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status {
  margin: 4px 0;
  font-weight: 600;
  color: #111827;
}
</style>

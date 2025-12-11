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
      </div>
      <div class="search-box">
        <input v-model="keyword" placeholder="输入关键词" />
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
            <td>{{ item.word }}</td>
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
    <form class="form-grid" @submit.prevent="showStrategy = false">
      <label>推荐倾向</label>
      <select>
        <option>新用户优先</option>
        <option>高消费人群</option>
        <option>高完播率人群</option>
      </select>
      <label>权重</label>
      <input type="range" min="0" max="100" />
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
    <form class="form-grid" @submit.prevent="activeBind = null">
      <label>选择视频</label>
      <select>
        <option>夜市烟火气记录</option>
        <option>萌宠日常混剪</option>
        <option>森林露营 24 小时</option>
      </select>
      <button class="btn" type="submit">绑定</button>
    </form>
  </Modal>

  <Modal v-if="activeBoost" :title="`冲榜 ${activeBoost.word}`" @close="activeBoost = null">
    <p>正在推送至推荐位...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: boostProgress + '%' }"></div>
    </div>
  </Modal>

  <Modal v-if="showPlan" title="新建推荐计划" @close="showPlan = false">
    <form class="form-grid" @submit.prevent="showPlan = false">
      <label>计划名称</label>
      <input placeholder="例：夜市主题提升" />
      <label>预算</label>
      <input type="number" min="0" step="500" />
      <button class="btn" type="submit">创建</button>
    </form>
  </Modal>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';

const showStrategy = ref(false);
const showQuery = ref(false);
const showTip = ref(false);
const showPlan = ref(false);
const boostProgress = ref(20);
const activeBind = ref(null);
const activeBoost = ref(null);
const keyword = ref('城市夜景');

const keywords = reactive([
  { word: '夜市美食', heat: '98,223', ctr: '5.2%' },
  { word: '露营', heat: '72,303', ctr: '4.8%' },
  { word: '咖啡', heat: '64,021', ctr: '6.1%' },
  { word: '滑板', heat: '51,894', ctr: '4.3%' },
  { word: '科技新品', heat: '48,112', ctr: '5.7%' },
  { word: '萌宠', heat: '105,003', ctr: '7.8%' },
  { word: '手绘', heat: '33,932', ctr: '3.9%' },
  { word: '健身燃脂', heat: '41,000', ctr: '5.0%' },
  { word: '延时摄影', heat: '38,220', ctr: '4.5%' },
  { word: '城市夜景', heat: '54,103', ctr: '4.9%' },
  { word: '旅拍', heat: '29,833', ctr: '3.4%' },
  { word: 'vlog', heat: '62,410', ctr: '4.6%' }
]);

const recommend = reactive([
  { scene: '首页', value: 120 },
  { scene: '同城', value: 160 },
  { scene: '关注', value: 110 },
  { scene: '热榜', value: 150 },
  { scene: '猜你想看', value: 140 }
]);

const tags = reactive(['新锐创作者', '高完播', '冷启动', '优质音频', '高清画面']);

let timer;

onMounted(() => {
  timer = setInterval(() => {
    boostProgress.value = Math.min(100, boostProgress.value + 18);
    if (boostProgress.value >= 100) boostProgress.value = 20;
  }, 1000);
});

onUnmounted(() => clearInterval(timer));

const runSearch = () => {
  showQuery.value = true;
};

const openBind = (item) => {
  activeBind.value = item;
};

const openBoost = (item) => {
  activeBoost.value = item;
};
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

.chips {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section">
        <div>
          <p class="section-title">布局展示</p>
          <p class="hint">以不同渐变色渲染家具分区，查看比例与光影过渡。</p>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" @click="openSceneModal">切换场景</button>
          <button class="btn btn-primary" @click="openPreviewModal">渲染预览</button>
        </div>
      </header>
      <div class="responsive-row">
        <div v-for="scene in scenes" :key="scene.name" class="layout-card">
          <div class="layout-visual" :style="{ background: scene.gradient }">
            <div class="zone" v-for="zone in scene.zones" :key="zone.name" :style="zone.style">
              <span>{{ zone.name }}</span>
            </div>
          </div>
          <div class="layout-meta">
            <strong>{{ scene.name }}</strong>
            <p class="hint">{{ scene.tip }}</p>
            <button class="btn btn-primary" @click="selectScene(scene)">载入此布局</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="section-title">布局对照表（10 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>空间</th>
            <th>渐变主题</th>
            <th>光照策略</th>
            <th>家具密度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in layoutPlans" :key="plan.space + plan.theme">
            <td>{{ plan.space }}</td>
            <td>{{ plan.theme }}</td>
            <td>{{ plan.light }}</td>
            <td>{{ plan.density }}</td>
            <td><button class="btn btn-secondary" @click="viewPlan(plan)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showPlanModal" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>方案详情</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>空间：{{ activePlan.space }}</p>
        <p>主题：{{ activePlan.theme }}</p>
        <p>光照：{{ activePlan.light }}</p>
        <p>密度：{{ activePlan.density }}</p>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">完成</button>
      </footer>
    </div>
  </div>

  <div v-if="showPreview" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>渲染预览</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>实时渲染当前选中布局，展示渐变衔接与动线。</p>
        <div class="progress-bar"><span :style="{ width: renderProgress + '%' }"></span></div>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">完成</button>
      </footer>
    </div>
  </div>

  <div v-if="showScene" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>选择要展示的空间</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <label>空间<select v-model="activeScene" class="input"><option v-for="scene in scenes" :key="scene.name">{{ scene.name }}</option></select></label>
        <p class="hint">选择后可直接载入对应渐变布局。</p>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">确定</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const scenes = reactive([
  {
    name: '客厅环景',
    gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
    tip: '北向采光，冷暖平衡；保持动线流畅。',
    zones: [
      { name: '沙发区', style: { gridArea: 'sofa' } },
      { name: '洽谈', style: { gridArea: 'meet' } },
      { name: '展示墙', style: { gridArea: 'wall' } }
    ]
  },
  {
    name: '卧室舒眠',
    gradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
    tip: '柔和紫粉渐变，强调静谧与层次。',
    zones: [
      { name: '睡眠区', style: { gridArea: 'bed' } },
      { name: '梳妆', style: { gridArea: 'desk' } },
      { name: '飘窗', style: { gridArea: 'window' } }
    ]
  },
  {
    name: '儿童学习',
    gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)',
    tip: '生动绿蓝过渡，保持趣味与专注。',
    zones: [
      { name: '玩耍', style: { gridArea: 'play' } },
      { name: '阅读', style: { gridArea: 'read' } },
      { name: '手作', style: { gridArea: 'craft' } }
    ]
  }
]);

const layoutPlans = reactive([
  { space: '客厅', theme: '晨光暖橙', light: '大面落地窗', density: '中等' },
  { space: '卧室', theme: '星云紫', light: '柔和壁灯', density: '低' },
  { space: '书房', theme: '松露绿光', light: '背光书架', density: '中等' },
  { space: '餐厅', theme: '麦田风', light: '吊灯+筒灯', density: '中等' },
  { space: '厨房', theme: '极地光', light: '轨道灯', density: '紧凑' },
  { space: '阳台', theme: '水岸蓝', light: '自然光', density: '低' },
  { space: '玄关', theme: '星云紫', light: '嵌入灯带', density: '精简' },
  { space: '儿童房', theme: '森林调', light: '双侧窗', density: '活跃' },
  { space: '卫浴', theme: '海雾灰', light: '镜前灯', density: '紧凑' },
  { space: '影音室', theme: '暮霭粉', light: '可调光带', density: '低' }
]);

const showPlanModal = ref(false);
const showPreview = ref(false);
const showScene = ref(false);
const activePlan = ref({});
const activeScene = ref('客厅环景');
const renderProgress = ref(25);

const selectScene = (scene) => {
  activeScene.value = scene.name;
  renderProgress.value = 25;
  showPreview.value = true;
  const loop = setInterval(() => {
    renderProgress.value += 20;
    if (renderProgress.value >= 100) clearInterval(loop);
  }, 500);
};

const viewPlan = (plan) => {
  activePlan.value = plan;
  showPlanModal.value = true;
};

const openSceneModal = () => {
  showScene.value = true;
};

const openPreviewModal = () => {
  renderProgress.value = 15;
  showPreview.value = true;
  const loop = setInterval(() => {
    renderProgress.value += 18;
    if (renderProgress.value >= 100) clearInterval(loop);
  }, 480);
};

const closeModals = () => {
  showPlanModal.value = false;
  showPreview.value = false;
  showScene.value = false;
};
</script>

<style scoped>
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.layout-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  display: grid;
  gap: 10px;
  background: #fff;
}

.layout-visual {
  display: grid;
  grid-template-areas:
    'sofa meet meet'
    'sofa wall wall';
  gap: 6px;
  border-radius: 12px;
  padding: 12px;
  min-height: 180px;
  background-size: 200% 200%;
  position: relative;
}

.layout-visual .zone {
  background: rgba(255, 255, 255, 0.72);
  border-radius: 10px;
  padding: 10px;
  font-weight: 700;
  color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.layout-visual .zone:nth-child(2) {
  grid-area: meet;
}

.layout-visual .zone:nth-child(3) {
  grid-area: wall;
}

.layout-meta {
  display: grid;
  gap: 6px;
}
</style>

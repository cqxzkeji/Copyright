<template>
  <section class="scene-display">
    <div class="card hero">
      <div>
        <div class="badge">场景展示与沉浸体验</div>
        <h2>高精度还原传统非遗文化场景</h2>
        <p>支持 360° 全景浏览、第一人称漫游与多视角切换，构建沉浸式文化体验环境。</p>
        <div class="hero-actions">
          <button class="primary-btn" @click="openModal('panorama')">启动全景浏览</button>
          <button class="ghost-btn" @click="openModal('walkthrough')">第一人称漫游</button>
          <button class="ghost-btn" @click="openModal('multiView')">多视角切换</button>
          <button class="ghost-btn" @click="openModal('settings')">环境参数设置</button>
        </div>
      </div>
      <div class="hero-preview">
        <img src="../assets/scene-heritage-1.svg" alt="场景预览" />
      </div>
    </div>

    <div class="card">
      <div class="section-title">精选非遗场景</div>
      <div class="scene-grid">
        <div v-for="scene in scenes" :key="scene.name" class="scene-card">
          <img :src="scene.image" :alt="scene.name" />
          <div>
            <div class="scene-title">{{ scene.name }}</div>
            <p>{{ scene.description }}</p>
            <button class="ghost-btn" @click="openScene(scene)">加载场景</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card status-panel">
      <div>
        <div class="section-title">沉浸体验状态</div>
        <p>实时监测用户的沉浸度、画面帧率与互动热度。</p>
      </div>
      <div class="status-grid">
        <div class="status-item">
          <span>沉浸指数</span>
          <strong>92%</strong>
        </div>
        <div class="status-item">
          <span>平均帧率</span>
          <strong>84 FPS</strong>
        </div>
        <div class="status-item">
          <span>交互热度</span>
          <strong>高</strong>
        </div>
      </div>
      <button class="primary-btn" @click="openModal('progress')">加载资源进度</button>
    </div>

    <BaseModal
      v-if="activeModal"
      :title="activeModalTitle"
      @close="closeModal"
      @confirm="closeModal"
    >
      <template v-if="activeModal === 'panorama'">
        <label>
          场景选择
          <select class="input">
            <option>徽州古村落</option>
            <option>苗族银饰工坊</option>
            <option>景德镇窑火</option>
          </select>
        </label>
        <label>
          画面清晰度
          <select class="input">
            <option>超清 8K</option>
            <option>高清 4K</option>
            <option>标准 2K</option>
          </select>
        </label>
        <p>确认后将启动 360° 全景浏览并记录体验数据。</p>
      </template>
      <template v-else-if="activeModal === 'walkthrough'">
        <label>
          漫游速度
          <input class="input" placeholder="请输入 1-5 的速度等级" />
        </label>
        <label>
          起始位置
          <input class="input" placeholder="如：入口、工坊、展厅" />
        </label>
        <p>系统将为用户规划第一人称漫游路线并开启导航。</p>
      </template>
      <template v-else-if="activeModal === 'multiView'">
        <label>
          视角布局
          <select class="input">
            <option>主视角 + 细节视角</option>
            <option>双人协作视角</option>
            <option>全景 + 俯视视角</option>
          </select>
        </label>
        <label>
          注释显示
          <select class="input">
            <option>开启</option>
            <option>关闭</option>
          </select>
        </label>
        <p>多视角同步展示时，系统会自动对齐声音与光照。</p>
      </template>
      <template v-else-if="activeModal === 'settings'">
        <label>
          环境光照
          <input class="input" placeholder="自然光 / 暖光 / 传统灯笼" />
        </label>
        <label>
          声场模式
          <input class="input" placeholder="立体环绕 / 历史语音讲解" />
        </label>
        <p>调整环境参数将同步更新场景的氛围渲染。</p>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>正在同步场景模型与纹理资源，请稍候。</p>
        <div class="progress-track">
          <div class="progress-value" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>当前进度：{{ progress }}%</p>
      </template>
      <template v-else-if="activeModal === 'scene'">
        <p>已选择：{{ selectedScene?.name }}</p>
        <label>
          讲解语言
          <select class="input">
            <option>普通话</option>
            <option>英语</option>
            <option>方言讲解</option>
          </select>
        </label>
        <label>
          视线引导
          <select class="input">
            <option>开启引导</option>
            <option>自由探索</option>
          </select>
        </label>
        <p>确认后将自动加载该非遗场景并记录访客路径。</p>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import sceneImage1 from "../assets/scene-heritage-1.svg";
import sceneImage2 from "../assets/scene-heritage-2.svg";
import sceneImage3 from "../assets/scene-heritage-3.svg";

const scenes = [
  {
    name: "徽州古村落",
    description: "木雕砖雕与祠堂空间的沉浸复原。",
    image: sceneImage1
  },
  {
    name: "苗族银饰工坊",
    description: "银饰打磨、锻造与纹样细节展示。",
    image: sceneImage2
  },
  {
    name: "景德镇陶瓷窑火",
    description: "传统窑烧流程与火候变化监测。",
    image: sceneImage3
  }
];

const activeModal = ref("");
const progress = ref(20);
const selectedScene = ref(null);
let timer;

const openModal = (type) => {
  activeModal.value = type;
  if (type === "progress") {
    progress.value = 20;
    timer = window.setInterval(() => {
      progress.value = Math.min(progress.value + 8, 100);
    }, 400);
  }
};

const openScene = (scene) => {
  selectedScene.value = scene;
  activeModal.value = "scene";
};

const closeModal = () => {
  activeModal.value = "";
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
};

const activeModalTitle = computed(() => {
  const map = {
    panorama: "全景浏览设置",
    walkthrough: "第一人称漫游",
    multiView: "多视角切换",
    settings: "环境参数",
    progress: "资源加载进度",
    scene: "场景加载确认"
  };
  return map[activeModal.value] || "场景操作";
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.scene-display {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  align-items: center;
}

.hero h2 {
  font-size: 24px;
  margin: 12px 0;
}

.hero p {
  color: #64748b;
  margin-bottom: 18px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-preview {
  justify-self: center;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.scene-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
}

.scene-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.scene-card p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 12px;
}

.status-panel {
  display: grid;
  gap: 16px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.status-item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>

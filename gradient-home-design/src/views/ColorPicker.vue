<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section">
        <div>
          <p class="section-title">渐变色灵感库</p>
          <p class="hint">挑选适合家居空间的渐变色方案，支持快速预览与收藏。</p>
        </div>
        <div class="actions">
          <button class="btn btn-primary" @click="openCreateModal">新增渐变</button>
          <button class="btn btn-secondary" @click="openFavoriteModal">收藏提示</button>
        </div>
      </header>
      <div class="responsive-row">
        <div
          v-for="preset in gradientPresets"
          :key="preset.name"
          class="gradient-card"
          :style="{ background: preset.preview }"
        >
          <div class="gradient-meta">
            <strong>{{ preset.name }}</strong>
            <span class="tag">{{ preset.scene }}</span>
          </div>
          <div class="gradient-actions">
            <button class="btn btn-secondary" @click="selectPreset(preset)">预览</button>
            <button class="btn btn-primary" @click="applyPreset(preset)">应用到设计</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="section-title">渐变色清单（10 组）</p>
      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>场景</th>
            <th>色值</th>
            <th>对比度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="preset in gradientPresets" :key="preset.name + preset.scene">
            <td>{{ preset.name }}</td>
            <td>{{ preset.scene }}</td>
            <td>{{ preset.colors.join(' / ') }}</td>
            <td><span class="badge">{{ preset.contrast }}</span></td>
            <td>
              <button class="btn btn-secondary" @click="selectPreset(preset)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showPreview" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>渐变预览 - {{ activePreset?.name }}</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <div class="preview" :style="{ background: activePreset?.preview }">
          <p>适用场景：{{ activePreset?.scene }}</p>
        </div>
        <p>色值：{{ activePreset?.colors.join(' / ') }}</p>
      </div>
      <footer>
        <button class="btn btn-primary" @click="applyPreset(activePreset)">应用到设计</button>
      </footer>
    </div>
  </div>

  <div v-if="showCreate" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>新建渐变方案</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <label>方案名称<input v-model="form.name" class="input" placeholder="晨雾蓝" /></label>
        <label>适用空间<select v-model="form.scene" class="input"><option>客厅</option><option>卧室</option><option>书房</option><option>儿童房</option></select></label>
        <label>主色<input v-model="form.colors[0]" class="input" /></label>
        <label>辅色<input v-model="form.colors[1]" class="input" /></label>
      </div>
      <footer>
        <button class="btn btn-secondary" @click="closeModals">取消</button>
        <button class="btn btn-primary" @click="savePreset">保存</button>
      </footer>
    </div>
  </div>

  <div v-if="showFavorite" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>收藏说明</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>收藏的渐变将同步到设计定制模块，便于快速套用到空间方案。</p>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">好的</button>
      </footer>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>应用进度</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>正在将渐变套用到当前布局...</p>
        <div class="progress-bar"><span :style="{ width: applyProgress + '%' }"></span></div>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">完成</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const gradientPresets = reactive([
  { name: '晨光暖橙', scene: '客厅', preview: 'linear-gradient(120deg,#ff9a9e,#fad0c4)', colors: ['#ff9a9e', '#fad0c4'], contrast: '7.1' },
  { name: '松露绿光', scene: '书房', preview: 'linear-gradient(120deg,#a8edea,#fed6e3)', colors: ['#a8edea', '#fed6e3'], contrast: '6.4' },
  { name: '礁石蓝', scene: '卧室', preview: 'linear-gradient(120deg,#89f7fe,#66a6ff)', colors: ['#89f7fe', '#66a6ff'], contrast: '7.6' },
  { name: '星云紫', scene: '玄关', preview: 'linear-gradient(120deg,#c3cfe2,#f5f7fa)', colors: ['#c3cfe2', '#f5f7fa'], contrast: '6.8' },
  { name: '森林调', scene: '儿童房', preview: 'linear-gradient(120deg,#84fab0,#8fd3f4)', colors: ['#84fab0', '#8fd3f4'], contrast: '6.9' },
  { name: '暮霭粉', scene: '客厅', preview: 'linear-gradient(120deg,#f6d365,#fda085)', colors: ['#f6d365', '#fda085'], contrast: '7.0' },
  { name: '海雾灰', scene: '卫浴', preview: 'linear-gradient(120deg,#cfd9df,#e2ebf0)', colors: ['#cfd9df', '#e2ebf0'], contrast: '6.1' },
  { name: '极地光', scene: '厨房', preview: 'linear-gradient(120deg,#f093fb,#f5576c)', colors: ['#f093fb', '#f5576c'], contrast: '7.4' },
  { name: '麦田风', scene: '餐厅', preview: 'linear-gradient(120deg,#fbd786,#f7797d)', colors: ['#fbd786', '#f7797d'], contrast: '6.7' },
  { name: '水岸蓝', scene: '阳台', preview: 'linear-gradient(120deg,#a1c4fd,#c2e9fb)', colors: ['#a1c4fd', '#c2e9fb'], contrast: '6.5' }
]);

const showPreview = ref(false);
const showCreate = ref(false);
const showFavorite = ref(false);
const showProgress = ref(false);
const activePreset = ref(null);
const applyProgress = ref(30);

const form = reactive({ name: '', scene: '客厅', colors: ['#8ec5fc', '#e0c3fc'] });

const selectPreset = (preset) => {
  activePreset.value = preset;
  showPreview.value = true;
};

const applyPreset = (preset) => {
  activePreset.value = preset;
  showProgress.value = true;
  applyProgress.value = 10;
  const loop = setInterval(() => {
    applyProgress.value += 15;
    if (applyProgress.value >= 100) {
      clearInterval(loop);
    }
  }, 400);
};

const openCreateModal = () => {
  form.name = '';
  form.scene = '客厅';
  form.colors = ['#8ec5fc', '#e0c3fc'];
  showCreate.value = true;
};

const openFavoriteModal = () => {
  showFavorite.value = true;
};

const savePreset = () => {
  gradientPresets.unshift({
    name: form.name || '自定义渐变',
    scene: form.scene,
    preview: `linear-gradient(120deg, ${form.colors[0]}, ${form.colors[1]})`,
    colors: [...form.colors],
    contrast: '6.5'
  });
  closeModals();
};

const closeModals = () => {
  showPreview.value = false;
  showCreate.value = false;
  showFavorite.value = false;
  showProgress.value = false;
};
</script>

<style scoped>
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gradient-card {
  border-radius: 14px;
  padding: 14px;
  min-height: 160px;
  display: grid;
  gap: 10px;
  color: #0f172a;
  border: 1px solid #e5e7eb;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.gradient-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gradient-actions {
  display: flex;
  gap: 10px;
}

.preview {
  border-radius: 12px;
  padding: 30px;
  color: #0f172a;
  border: 1px solid #e5e7eb;
  background-size: 200% 200%;
}
</style>

<template>
  <section class="module">
    <header>
      <h2>跨文化内容优化与适配</h2>
      <p>对不同文化偏好的表达、配色和禁忌进行智能检测，确保品牌叙事在全球范围内保持一致。</p>
    </header>
    <div class="grid">
      <div class="panel">
        <h3>文化目标</h3>
        <label>
          市场地区
          <select v-model="region">
            <option>北美</option>
            <option>中东</option>
            <option>东南亚</option>
            <option>欧洲</option>
          </select>
        </label>
        <label>
          文化敏感点
          <textarea v-model="constraints" rows="3" placeholder="输入需要规避的内容、敏感话题等"></textarea>
        </label>
        <div class="btn-group">
          <button @click="optimize">立即优化</button>
          <button class="secondary" @click="showTips">提示信息</button>
        </div>
      </div>
      <div class="panel insights">
        <h3>文化洞察</h3>
        <ul>
          <li v-for="insight in localizedInsights" :key="insight">{{ insight }}</li>
        </ul>
      </div>
      <div class="panel score">
        <h3>适配指数</h3>
        <div class="dial">
          <div class="dial-inner">{{ suitability }}%</div>
        </div>
        <p>模型根据用词、象征符号、审美偏好计算出的匹配度。</p>
      </div>
    </div>
    <ModalDialog v-model="modalVisible" title="优化建议">
      <p v-for="(item, index) in suggestions" :key="index">{{ item }}</p>
    </ModalDialog>
    <ModalDialog v-model="tipsVisible" title="按钮提示">
      <p>“提示信息”按钮会展示最新的文化注意事项，用于协助本地化团队快速同步共识。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const region = ref('北美');
const constraints = ref('');
const modalVisible = ref(false);
const tipsVisible = ref(false);
const suggestions = ref([]);

const insightMap = {
  北美: ['偏好直接表达价值主张', '强调可持续与社会责任', '对数据隐私表达敏感'],
  中东: ['注意配色中的宗教含义', '强调家庭与社区价值', '尊重节日仪式感'],
  东南亚: ['避免复杂隐喻，保持温暖友善', '突出移动端体验与便利', '价格敏感度较高'],
  欧洲: ['使用事实与权威引用', '关注环保承诺', '支持多语言客服']
};

const localizedInsights = computed(() => insightMap[region.value]);
const suitability = computed(() => 78 + region.value.length);

const optimize = () => {
  suggestions.value = [
    `在${region.value}市场建议强调：${localizedInsights.value[0]}`,
    constraints.value
      ? `避开如下敏感点：${constraints.value}`
      : '未检测到额外敏感项，可直接复用核心内容',
    '请同步设计团队更新视觉规范。'
  ];
  modalVisible.value = true;
};

const showTips = () => {
  tipsVisible.value = true;
};
</script>

<style scoped>
.module header {
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.panel {
  background: var(--panel);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

label,
ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

select,
textarea {
  border: none;
  border-radius: 16px;
  padding: 12px 16px;
  background: var(--panel-light);
  color: var(--text);
}

textarea {
  resize: none;
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

button {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  background: var(--accent);
  color: #0f172a;
}

button.secondary {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--muted);
}

.insights ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.insights li {
  padding: 12px 0;
  border-bottom: 1px dashed rgba(148, 163, 184, 0.2);
}

.dial {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 10px solid rgba(56, 189, 248, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px auto;
  position: relative;
}

.dial::after {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  border: 4px solid rgba(14, 165, 233, 0.4);
}

.dial-inner {
  font-size: 2.4rem;
  font-weight: 700;
}
</style>

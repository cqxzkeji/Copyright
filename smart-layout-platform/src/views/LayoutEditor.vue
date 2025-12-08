<template>
  <div class="module">
    <div class="flex-between">
      <div>
        <p class="eyebrow">排版设计</p>
        <h3>内容编排与场景布局</h3>
      </div>
      <div class="top-actions">
        <button class="secondary-btn" @click="showGuide = true">排版指引</button>
        <button class="primary-btn" @click="showAutoProgress = true">自动排版</button>
        <button class="primary-btn" @click="showCreate = true">新建分栏</button>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 1rem;">
      <div class="card">
        <div class="flex-between">
          <p class="eyebrow">画布组件</p>
          <button class="secondary-btn" @click="showAlign = true">对齐策略</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>组件</th>
              <th>类型</th>
              <th>状态</th>
              <th>曝光权重</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in layoutItems" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td><span class="badge">{{ item.status }}</span></td>
              <td>{{ item.weight }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <p class="eyebrow">排版参数</p>
        <div class="form-grid">
          <div class="input-field">
            <label>行间距</label>
            <input v-model="settings.lineHeight" type="number" min="1" />
          </div>
          <div class="input-field">
            <label>列间距</label>
            <input v-model="settings.columnGap" type="number" min="0" />
          </div>
          <div class="input-field">
            <label>字体</label>
            <select v-model="settings.font">
              <option>Inter</option>
              <option>思源黑体</option>
              <option>HarmonyOS Sans</option>
            </select>
          </div>
          <div class="input-field">
            <label>主色</label>
            <input v-model="settings.primary" type="color" />
          </div>
        </div>
        <div class="flex-between" style="margin-top: 1rem;">
          <div class="badge">实时预览已开启</div>
          <button class="primary-btn" @click="showPreview = true">预览效果</button>
        </div>
      </div>
    </div>

    <BaseModal v-model="showGuide" title="排版指引">
      <ol>
        <li>先添加主视觉与标题，确保图文对齐。</li>
        <li>使用分栏组件保持阅读节奏，建议 2-3 栏。</li>
        <li>图表区采用统一色板并保持 8px 间距。</li>
      </ol>
    </BaseModal>

    <BaseModal v-model="showCreate" title="创建分栏">
      <div class="form-grid">
        <div class="input-field">
          <label>分栏名称</label>
          <input v-model="newColumn.name" placeholder="如：产品亮点" />
        </div>
        <div class="input-field">
          <label>列数</label>
          <select v-model="newColumn.columns">
            <option v-for="n in [2, 3, 4]" :key="n">{{ n }}</option>
          </select>
        </div>
        <div class="input-field">
          <label>留白系数</label>
          <input v-model="newColumn.padding" type="number" min="0" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="confirmColumn">确认添加</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showAlign" title="智能对齐">
      <p>将按照网格系统自动对齐组件，并统一间距。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showAlign = false">开始对齐</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showAutoProgress" title="自动排版中">
      <p>引擎正在重排 12 个组件，预计 6 秒完成。</p>
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p style="margin-top: 0.5rem;">完成度：{{ progress }}%</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="simulateProgress">刷新进度</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showPreview" title="预览效果">
      <p>当前配色：{{ settings.primary }}，字体：{{ settings.font }}，行间距：{{ settings.lineHeight }}，列间距：{{ settings.columnGap }}。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showPreview = false">关闭预览</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const layoutItems = [
  { name: '主视觉 Banner', type: '图片', status: '已放置', weight: 25 },
  { name: '副标题', type: '文本', status: '已放置', weight: 8 },
  { name: '产品卖点', type: '文本', status: '优化中', weight: 12 },
  { name: '品牌介绍', type: '文本', status: '草稿', weight: 10 },
  { name: '情感配图', type: '图片', status: '待替换', weight: 6 },
  { name: 'FAQ 列表', type: '列表', status: '已放置', weight: 9 },
  { name: '数据亮点图', type: '图表', status: '已放置', weight: 14 },
  { name: 'CTA 按钮', type: '按钮', status: '已放置', weight: 7 },
  { name: '社交分享', type: '组件', status: '待定', weight: 5 },
  { name: '页脚版权', type: '文本', status: '已放置', weight: 4 }
];

const settings = reactive({ lineHeight: 1.6, columnGap: 16, font: 'Inter', primary: '#4f46e5' });
const showGuide = ref(false);
const showCreate = ref(false);
const showAlign = ref(false);
const showPreview = ref(false);
const showAutoProgress = ref(false);
const progress = ref(35);
const newColumn = reactive({ name: '产品亮点', columns: 3, padding: 16 });

const simulateProgress = () => {
  progress.value = Math.min(100, progress.value + 15);
};

const confirmColumn = () => {
  showCreate.value = false;
};
</script>

<style scoped>
.module h3 {
  margin: 0.15rem 0 0.35rem;
}

.top-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

table {
  margin-top: 0.5rem;
}
</style>

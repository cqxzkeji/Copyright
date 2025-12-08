<template>
  <div class="module">
    <div class="flex-between">
      <div>
        <p class="eyebrow">模板库</p>
        <h3>行业模板与品牌样板</h3>
      </div>
      <div class="top-actions">
        <button class="secondary-btn" @click="showDetail = true">查看详情</button>
        <button class="primary-btn" @click="showApply = true">应用模板</button>
        <button class="primary-btn" @click="showUpload = true">上传模板</button>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 1rem;">
      <div v-for="template in templates" :key="template.name" class="card">
        <div class="flex-between">
          <div>
            <p class="eyebrow">{{ template.industry }}</p>
            <h4 style="margin: 0">{{ template.name }}</h4>
          </div>
          <button class="secondary-btn" @click="showPreview(template)">预览</button>
        </div>
        <p>{{ template.desc }}</p>
        <div class="tag-list">
          <span class="tag" v-for="tag in template.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <BaseModal v-model="showDetail" title="模板亮点">
      <ul>
        <li>采用 8pt 栅格体系与无衬线字体。</li>
        <li>自适应横竖屏，适配 16:9、1:1、9:16 多尺寸。</li>
        <li>内置 10+ 组件组合，可快速替换品牌色。</li>
      </ul>
    </BaseModal>

    <BaseModal v-model="showApply" title="应用模板">
      <div class="form-grid">
        <div class="input-field">
          <label>选择模板</label>
          <select v-model="selectedTemplate">
            <option v-for="template in templates" :key="template.name">{{ template.name }}</option>
          </select>
        </div>
        <div class="input-field">
          <label>目标项目</label>
          <input placeholder="如：520 品牌活动" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showApply = false">一键应用</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showUpload" title="上传模板">
      <div class="input-field">
        <label>模板名称</label>
        <input v-model="uploadName" placeholder="输入模板名称" />
      </div>
      <div class="input-field">
        <label>上传进度</label>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <p>完成度：{{ uploadProgress }}%</p>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="increaseProgress">继续上传</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showPreviewModal" :title="previewTemplate?.name || '模板预览'">
      <p>{{ previewTemplate?.desc }}</p>
      <div class="tag-list">
        <span class="tag" v-for="tag in previewTemplate?.tags || []" :key="tag">{{ tag }}</span>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showPreviewModal = false">关闭</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const templates = reactive([
  { name: '科技发布', industry: '科技', desc: '适合新品发布与功能亮点展示。', tags: ['科技蓝', '产品亮点', '渐变'] },
  { name: '教育招生', industry: '教育', desc: '突出课程优势与师资介绍。', tags: ['浅色', '留白', '信息块'] },
  { name: '文化节庆', industry: '文化', desc: '用于节日推广与互动活动。', tags: ['插画', '暖色', '二维码'] },
  { name: '城市旅游', industry: '旅游', desc: '展示目的地景点与线路推荐。', tags: ['卡片式', '多图', '地图'] },
  { name: '企业招聘', industry: '招聘', desc: '展现岗位亮点与团队文化。', tags: ['蓝灰', '时间轴', '流程'] },
  { name: '直播脚本', industry: '直播', desc: '快速生成直播流程与话术。', tags: ['分栏', '脚本', '数据位'] },
  { name: '新品首发', industry: '零售', desc: '强调产品 USP 和优惠信息。', tags: ['品牌色', '价格卡', 'CTA'] },
  { name: '年度总结', industry: '企业', desc: '数据总结与 KPI 展示。', tags: ['图表', '亮色', '网格'] }
]);

const showDetail = ref(false);
const showApply = ref(false);
const showUpload = ref(false);
const showPreviewModal = ref(false);
const selectedTemplate = ref('科技发布');
const uploadProgress = ref(30);
const uploadName = ref('行业通用模板');
const previewTemplate = ref(null);

const increaseProgress = () => {
  uploadProgress.value = Math.min(100, uploadProgress.value + 25);
};

const showPreview = (template) => {
  previewTemplate.value = template;
  showPreviewModal.value = true;
};
</script>

<style scoped>
.top-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

h4 {
  color: #0f172a;
}
</style>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h2>数据分析画像</h2>
        <p>沉淀企业咨询画像，快速洞察行业趋势与需求热点。</p>
      </div>
      <div class="actions">
        <button @click="openModal('refresh')">刷新画像</button>
        <button @click="openModal('export')">导出分析</button>
      </div>
    </header>

    <section class="card">
      <div class="chart-grid">
        <div class="chart-card">
          <h3>需求强度雷达</h3>
          <div class="radar">
            <div v-for="p in radarPoints" :key="p.label" class="radar-row">
              <span>{{ p.label }}</span>
              <div class="radar-track">
                <div class="radar-fill" :style="{ width: p.score + '%' }"></div>
              </div>
              <span class="value">{{ p.score }}%</span>
            </div>
          </div>
        </div>
        <div class="chart-card">
          <h3>地区热力</h3>
          <div class="heatmap">
            <div v-for="city in topCities" :key="city.name" class="heat-row">
              <div>{{ city.name }}</div>
              <div class="dot-line">
                <span class="dot" :style="{ width: city.hot + '%' }"></span>
              </div>
              <span class="value">{{ city.count }} 起</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="table-head">
        <h3>咨询需求画像明细</h3>
        <span class="note">共 {{ portrait.length }} 条画像样本</span>
      </div>
      <div class="table">
        <div class="table-row table-header">
          <span>行业</span>
          <span>需求关键词</span>
          <span>典型目标</span>
          <span>预算区间</span>
          <span>紧急程度</span>
          <span>推荐方向</span>
        </div>
        <div v-for="item in portrait" :key="item.tag + item.industry" class="table-row">
          <span>{{ item.industry }}</span>
          <span>{{ item.tag }}</span>
          <span>{{ item.objective }}</span>
          <span>{{ item.budget }}</span>
          <span>{{ item.priority }}</span>
          <span>{{ item.suggestion }}</span>
        </div>
      </div>
    </section>

    <Modal v-if="modal" :title="modalTitle" @close="modal = ''" @confirm="modal = ''">
      <template v-if="modal === 'refresh'">
        <p class="subtitle">正在重新生成行业画像，预计 8 秒完成。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '65%' }"></div>
        </div>
      </template>
      <template v-else-if="modal === 'export'">
        <p class="subtitle">选择导出格式并包含的指标。</p>
        <label class="check"><input type="checkbox" checked /> 行业画像</label>
        <label class="check"><input type="checkbox" checked /> 地区热力</label>
        <label class="check"><input type="checkbox" /> 预算敏感度</label>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import Modal from '../components/Modal.vue';

const portrait = ref([
  { industry: '智能制造', tag: '自动化改造', objective: '提升OEE', budget: '80-120万', priority: '高', suggestion: '精益与数智联合项目' },
  { industry: '新能源', tag: '项目融资', objective: '扩大产线', budget: '200-300万', priority: '高', suggestion: '投研顾问与资本对接' },
  { industry: '医疗', tag: '合规体系', objective: '通过注册', budget: '60-90万', priority: '中', suggestion: '质量体系升级' },
  { industry: '消费品', tag: '品牌升级', objective: '新品上市', budget: '50-80万', priority: '高', suggestion: '品牌与渠道协同' },
  { industry: 'SaaS', tag: '渠道拓展', objective: '开拓华南', budget: '40-70万', priority: '中', suggestion: '渠道伙伴与定制包' },
  { industry: '供应链', tag: '仓储规划', objective: '降低周转', budget: '90-130万', priority: '高', suggestion: '仓网优化' },
  { industry: '半导体', tag: '产能规划', objective: '扩建二期', budget: '300-450万', priority: '高', suggestion: '项目论证+EPC顾问' },
  { industry: '金融', tag: '风控模型', objective: '降低坏账', budget: '70-110万', priority: '中', suggestion: '模型共建' },
  { industry: '教育', tag: '产品化', objective: '线上化', budget: '30-60万', priority: '中', suggestion: '数字课程设计' },
  { industry: '农业', tag: '品牌打造', objective: '电商破圈', budget: '20-40万', priority: '中', suggestion: '品牌与直播策略' },
  { industry: '汽车', tag: '智能座舱', objective: '导入AI', budget: '150-220万', priority: '高', suggestion: '座舱交互优化' },
  { industry: '环保', tag: '节能改造', objective: '降碳', budget: '60-90万', priority: '高', suggestion: '双碳路线图' },
  { industry: '地产', tag: '营销策划', objective: '项目出清', budget: '80-120万', priority: '高', suggestion: '体验式营销' },
  { industry: '物流', tag: '干线优化', objective: '提效降本', budget: '50-70万', priority: '中', suggestion: '线路与仓网调整' },
  { industry: '餐饮', tag: '连锁拓展', objective: '标准化', budget: '40-60万', priority: '中', suggestion: '供应链与SOP' },
  { industry: '文化', tag: '活动策划', objective: '破圈增长', budget: '30-50万', priority: '低', suggestion: 'IP共创' },
  { industry: '安防', tag: '城市标案', objective: '投标支持', budget: '90-120万', priority: '高', suggestion: '方案+标书联动' },
  { industry: '家居', tag: '仓储升级', objective: '交付优化', budget: '60-100万', priority: '中', suggestion: '供应链数字化' },
  { industry: '化工', tag: '安全评估', objective: '风险分级', budget: '100-150万', priority: '高', suggestion: '安全管理体系' },
  { industry: '交通', tag: '智慧出行', objective: '调度优化', budget: '120-160万', priority: '高', suggestion: '智能调度' }
]);

const radarPoints = computed(() => [
  { label: '数字化', score: 82 },
  { label: '融资需求', score: 71 },
  { label: '市场增长', score: 77 },
  { label: '运营优化', score: 88 },
  { label: '人才与组织', score: 63 }
]);

const topCities = computed(() => [
  { name: '上海', hot: 96, count: 38 },
  { name: '深圳', hot: 90, count: 34 },
  { name: '北京', hot: 84, count: 31 },
  { name: '杭州', hot: 78, count: 27 },
  { name: '成都', hot: 72, count: 22 },
  { name: '苏州', hot: 65, count: 19 },
  { name: '武汉', hot: 58, count: 17 }
]);

const modal = ref('');
const modalTitle = computed(() => (modal.value === 'export' ? '导出画像报告' : '生成画像'));

const openModal = (type) => {
  modal.value = type;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e5edf7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, #2aa8ff, #6dd6ff);
  color: #fff;
  font-weight: 700;
}

.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5edf7;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
}

.chart-card {
  background: linear-gradient(180deg, #fafeff, #f2f7ff);
  border: 1px dashed #d7e6f4;
  border-radius: 14px;
  padding: 14px;
}

.radar-row,
.heat-row {
  display: grid;
  grid-template-columns: 120px 1fr 80px;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.radar-track,
.dot-line {
  background: #f1f6fd;
  height: 12px;
  border-radius: 999px;
}

.radar-fill,
.dot {
  display: block;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(120deg, #27a5ff, #64d3ff);
}

.table {
  margin-top: 10px;
  border: 1px solid #e7eef7;
  border-radius: 12px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 10px 12px;
  align-items: center;
}

.table-header {
  background: #f5f9ff;
  font-weight: 700;
}

.table-row:nth-child(even) {
  background: #fbfdff;
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note {
  color: #6a7c92;
}

.subtitle {
  color: #355278;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #f1f4f8;
  overflow: hidden;
  margin: 10px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(120deg, #3bb2ff, #7fe0ff);
}
</style>

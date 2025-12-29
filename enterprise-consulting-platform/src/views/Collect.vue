<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h2>企业信息采集</h2>
        <p>统一汇聚企业基础档案与咨询诉求，支持多渠道录入与分级管理。</p>
      </div>
      <div class="actions">
        <button @click="openModal('add')">新增企业</button>
        <button @click="openModal('import')">批量导入</button>
        <button @click="openModal('support')">咨询需求登记</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h3>行业分布概览</h3>
        <div class="chart">
          <div v-for="item in industryStats" :key="item.name" class="bar">
            <div class="label">{{ item.name }}</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.ratio + '%' }"></div>
            </div>
            <div class="value">{{ item.count }} 家</div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>待审核与高优需求</h3>
        <ul class="metrics">
          <li>
            <span>待审核企业</span>
            <strong>{{ pending }}</strong>
          </li>
          <li>
            <span>高优咨询需求</span>
            <strong>{{ highPriority }}</strong>
          </li>
          <li>
            <span>本周新增</span>
            <strong>{{ weeklyAdded }}</strong>
          </li>
        </ul>
        <button class="ghost" @click="openModal('remind')">提醒审核</button>
      </div>
    </section>

    <section class="card">
      <div class="table-head">
        <h3>企业信息清单</h3>
        <span class="note">当前共 {{ enterprises.length }} 条数据</span>
      </div>
      <div class="table">
        <div class="table-row table-header">
          <span>企业名称</span>
          <span>行业</span>
          <span>地区</span>
          <span>联系人</span>
          <span>需求类型</span>
          <span>录入渠道</span>
        </div>
        <div v-for="item in enterprises" :key="item.name" class="table-row">
          <span>{{ item.name }}</span>
          <span>{{ item.industry }}</span>
          <span>{{ item.city }}</span>
          <span>{{ item.contact }}</span>
          <span>{{ item.demand }}</span>
          <span>{{ item.channel }}</span>
        </div>
      </div>
    </section>

    <Modal v-if="modal.type" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="modal.type === 'add'">
        <p class="subtitle">填写企业基础信息以便快速建档。</p>
        <div class="form-grid">
          <label>企业名称<input v-model="form.name" placeholder="如：青岛新动科技" /></label>
          <label>行业<input v-model="form.industry" placeholder="智能制造" /></label>
          <label>所在城市<input v-model="form.city" placeholder="杭州" /></label>
          <label>联系人<input v-model="form.contact" placeholder="王经理" /></label>
          <label>需求类型<input v-model="form.demand" placeholder="数字化转型" /></label>
          <label>录入渠道<input v-model="form.channel" placeholder="官网表单" /></label>
        </div>
      </template>
      <template v-else-if="modal.type === 'import'">
        <p class="subtitle">系统正在校验导入数据，请保持窗口开启。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '72%' }"></div>
        </div>
        <p class="muted">校验完成后将自动创建档案并推送到审核列表。</p>
      </template>
      <template v-else-if="modal.type === 'support'">
        <p class="subtitle">登记咨询诉求，自动分派至对应领域的顾问。</p>
        <textarea v-model="form.requirement" rows="4" placeholder="描述企业痛点、预期目标与时间节点"></textarea>
      </template>
      <template v-else-if="modal.type === 'remind'">
        <p class="subtitle">确认向审核人发送催办提醒？</p>
        <div class="badge-list">
          <span class="chip">风控组</span>
          <span class="chip">行业审核组</span>
          <span class="chip">数据质量组</span>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const enterprises = reactive([
  { name: '科越智造', industry: '智能制造', city: '苏州', contact: '钱程', demand: '精益生产', channel: '伙伴同步' },
  { name: '星环科技', industry: '大数据', city: '上海', contact: '李斯', demand: '数据治理', channel: '自助录入' },
  { name: '远航物流', industry: '供应链', city: '宁波', contact: '周全', demand: '仓储优化', channel: '线索导入' },
  { name: '海川能源', industry: '新能源', city: '广州', contact: '林明', demand: '投融资', channel: '伙伴同步' },
  { name: '华锐医药', industry: '医疗', city: '武汉', contact: '蒋楠', demand: '研发管理', channel: '自助录入' },
  { name: '锦程服饰', industry: '消费品', city: '泉州', contact: '陈真', demand: '品牌升级', channel: '活动采集' },
  { name: '数博云', industry: 'SaaS', city: '北京', contact: '唐宇', demand: '渠道拓展', channel: '自助录入' },
  { name: '领帆自动化', industry: '智能制造', city: '成都', contact: '尹航', demand: '产线改造', channel: '伙伴同步' },
  { name: '联创网络', industry: '互联网', city: '深圳', contact: '郑牧', demand: '安全合规', channel: '线索导入' },
  { name: '泰木食品', industry: '食品', city: '长沙', contact: '朱砂', demand: '供应链数字化', channel: '活动采集' },
  { name: '阳澄农业', industry: '农业', city: '苏州', contact: '戴河', demand: '品牌塑造', channel: '伙伴同步' },
  { name: '慧云航科', industry: '航空', city: '西安', contact: '白禹', demand: '项目论证', channel: '自助录入' },
  { name: '云杉环保', industry: '环保', city: '合肥', contact: '田晋', demand: '节能方案', channel: '活动采集' },
  { name: '启行教育', industry: '教育', city: '郑州', contact: '乔兰', demand: '课程产品化', channel: '线索导入' },
  { name: '蓝图地产', industry: '地产', city: '重庆', contact: '徐林', demand: '营销策划', channel: '伙伴同步' },
  { name: '志远汽车', industry: '汽车', city: '上海', contact: '顾南', demand: '智能座舱', channel: '自助录入' },
  { name: '光华智芯', industry: '半导体', city: '无锡', contact: '史格', demand: '产能规划', channel: '线索导入' },
  { name: '信泽金融', industry: '金融', city: '北京', contact: '文磊', demand: '风控体系', channel: '活动采集' },
  { name: '森宇家居', industry: '家居', city: '佛山', contact: '花磊', demand: '仓储升级', channel: '伙伴同步' },
  { name: '飞创数字', industry: 'IT服务', city: '南京', contact: '桂可', demand: '云原生改造', channel: '自助录入' }
]);

const modal = reactive({ type: '' });
const form = reactive({ name: '', industry: '', city: '', contact: '', demand: '', channel: '', requirement: '' });
const pending = 7;
const highPriority = 5;
const weeklyAdded = 12;

const industryStats = computed(() => {
  const summary = {};
  enterprises.forEach((item) => {
    summary[item.industry] = (summary[item.industry] || 0) + 1;
  });
  const total = enterprises.length || 1;
  return Object.entries(summary).map(([name, count]) => ({
    name,
    count,
    ratio: Math.round((count / total) * 100)
  }));
});

const modalTitle = computed(() => {
  switch (modal.type) {
    case 'add':
      return '新增企业档案';
    case 'import':
      return '批量导入进度';
    case 'support':
      return '需求登记';
    case 'remind':
      return '发送催办提醒';
    default:
      return '提示';
  }
});

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};

const confirmModal = () => {
  if (modal.type === 'add' && form.name) {
    enterprises.unshift({ ...form });
  }
  closeModal();
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
  gap: 12px;
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

button.ghost {
  background: #fff;
  border: 1px solid #d7e6f4;
  color: #1e5084;
}

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5edf7;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 120px 1fr 80px;
  align-items: center;
  gap: 10px;
}

.bar-track {
  background: #f1f6fd;
  height: 12px;
  border-radius: 999px;
}

.bar-fill {
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(120deg, #27a5ff, #64d3ff);
}

.metrics {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metrics li {
  display: flex;
  justify-content: space-between;
  background: #f5f9ff;
  border: 1px dashed #d9e7f7;
  padding: 10px 12px;
  border-radius: 12px;
}

.table {
  margin-top: 10px;
  border: 1px solid #e7eef7;
  border-radius: 12px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.form-grid label,
textarea {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #436083;
}

input,
textarea {
  border-radius: 10px;
  border: 1px solid #d8e5f3;
  padding: 10px;
  background: #f8fbff;
}

.subtitle {
  margin: 0 0 10px;
  color: #315173;
}

.badge-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 6px 10px;
  background: #e9f6ff;
  color: #1a7ecb;
  border-radius: 999px;
  border: 1px solid #c6e7ff;
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #f1f4f8;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(120deg, #3bb2ff, #7fe0ff);
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .table-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .bar {
    grid-template-columns: 1fr;
  }
}
</style>

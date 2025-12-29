<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h2>过程跟踪与评估</h2>
        <p>全流程跟踪咨询对接，采集反馈并评估效果。</p>
      </div>
      <div class="actions">
        <button @click="openModal('record')">记录进展</button>
        <button @click="openModal('feedback')">收集反馈</button>
        <button @click="openModal('score')">生成评估</button>
      </div>
    </header>

    <section class="card">
      <div class="table-head">
        <h3>对接进展</h3>
        <span class="note">共 {{ progresses.length }} 条互动记录</span>
      </div>
      <div class="table">
        <div class="table-row table-header">
          <span>企业</span>
          <span>阶段</span>
          <span>责任人</span>
          <span>最新动作</span>
          <span>完成率</span>
          <span>下一步</span>
        </div>
        <div v-for="item in progresses" :key="item.company + item.stage" class="table-row">
          <span>{{ item.company }}</span>
          <span>{{ item.stage }}</span>
          <span>{{ item.owner }}</span>
          <span>{{ item.action }}</span>
          <span>
            <div class="score" :style="{ width: item.rate + '%' }">{{ item.rate }}%</div>
          </span>
          <span>{{ item.next }}</span>
        </div>
      </div>
    </section>

    <section class="grid">
      <div class="card">
        <h3>风险与预警</h3>
        <ul class="risk-list">
          <li v-for="risk in risks" :key="risk.title">
            <div>
              <strong>{{ risk.title }}</strong>
              <p class="muted">{{ risk.desc }}</p>
            </div>
            <button class="ghost" @click="openModal('mitigate', risk)">处理</button>
          </li>
        </ul>
      </div>
      <div class="card">
        <h3>进度燃尽</h3>
        <div class="burn">
          <div v-for="item in burnDown" :key="item.label" class="burn-row">
            <span>{{ item.label }}</span>
            <div class="burn-bar">
              <div class="burn-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <span class="value">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </section>

    <Modal v-if="modal.type" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="modal.type === 'record'">
        <p class="subtitle">记录本次跟进动作。</p>
        <label>企业<input v-model="form.company" placeholder="选择企业" /></label>
        <label>动作<input v-model="form.action" placeholder="如：完成方案初稿" /></label>
      </template>
      <template v-else-if="modal.type === 'feedback'">
        <p class="subtitle">系统向企业与专家发送反馈表。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '48%' }"></div>
        </div>
        <p class="muted">已推送 12 份问卷，等待回收。</p>
      </template>
      <template v-else-if="modal.type === 'score'">
        <p class="subtitle">选择评分维度并生成评估报告。</p>
        <label class="check"><input type="checkbox" checked /> 达成度</label>
        <label class="check"><input type="checkbox" checked /> 交付质量</label>
        <label class="check"><input type="checkbox" /> 长期影响</label>
      </template>
      <template v-else-if="modal.type === 'mitigate'">
        <p class="subtitle">{{ modal.payload?.title }}</p>
        <textarea v-model="form.mitigation" rows="3" placeholder="输入缓解措施与责任人"></textarea>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import Modal from '../components/Modal.vue';

const progresses = reactive([
  { company: '科越智造', stage: '方案沟通', owner: '王瑜', action: '对齐KPI', rate: 65, next: '专家访厂' },
  { company: '星环科技', stage: '需求澄清', owner: '贺兰', action: '补充数据', rate: 55, next: '提交方案' },
  { company: '远航物流', stage: '方案评审', owner: '周舟', action: '调整费用', rate: 48, next: '确认预算' },
  { company: '海川能源', stage: '方案定稿', owner: '刘戈', action: '对齐交付', rate: 72, next: '签订合同' },
  { company: '华锐医药', stage: '执行中', owner: '苏盈', action: '陪标辅导', rate: 58, next: '专家复盘' },
  { company: '锦程服饰', stage: '执行中', owner: '崔南', action: '新增品类', rate: 61, next: '盘点结果' },
  { company: '数博云', stage: '沟通中', owner: '吴青', action: '渠道方案', rate: 44, next: '确认排期' },
  { company: '领帆自动化', stage: '执行中', owner: '王映', action: '验收节点', rate: 69, next: '专家验收' },
  { company: '联创网络', stage: '执行中', owner: '沈然', action: '安全加固', rate: 63, next: '渗透测试' },
  { company: '泰木食品', stage: '需求澄清', owner: '高杨', action: '盘点工厂', rate: 46, next: '方案评审' },
  { company: '阳澄农业', stage: '执行中', owner: '张苇', action: '品牌共创', rate: 57, next: '发布节点' },
  { company: '慧云航科', stage: '执行中', owner: '黎笑', action: '项目论证', rate: 74, next: '专家路演' },
  { company: '云杉环保', stage: '方案沟通', owner: '吕舟', action: '节能方案', rate: 52, next: '财务测算' },
  { company: '启行教育', stage: '执行中', owner: '苗棠', action: '试点课程', rate: 60, next: '上线复盘' },
  { company: '蓝图地产', stage: '执行中', owner: '项晖', action: '体验活动', rate: 70, next: '周会复盘' },
  { company: '志远汽车', stage: '方案评审', owner: '陶衡', action: '验证原型', rate: 64, next: '排期确认' },
  { company: '光华智芯', stage: '执行中', owner: '贺星', action: '工艺调优', rate: 67, next: '阶段验收' },
  { company: '信泽金融', stage: '执行中', owner: '隋野', action: '风控建模', rate: 62, next: '模型验收' },
  { company: '森宇家居', stage: '沟通中', owner: '赵轶', action: '仓储规划', rate: 50, next: '实地调研' },
  { company: '飞创数字', stage: '需求澄清', owner: '李衡', action: '云迁移勘测', rate: 45, next: '签订合同' }
]);

const risks = reactive([
  { title: '需求场景不清晰', desc: '客户尚未明确转型边界，需加速澄清' },
  { title: '排期冲突', desc: '专家档期与客户时间冲突，需重新协调' },
  { title: '预算偏低', desc: '预算与预期交付不匹配，需要分阶段推进' }
]);

const burnDown = computed(() => [
  { label: '方案确认', value: 78 },
  { label: '合同签署', value: 62 },
  { label: '执行落地', value: 48 },
  { label: '效果评估', value: 36 }
]);

const modal = reactive({ type: '', payload: null });
const form = reactive({ company: '', action: '', mitigation: '' });

const modalTitle = computed(() => {
  switch (modal.type) {
    case 'record':
      return '记录进展';
    case 'feedback':
      return '推送反馈表';
    case 'score':
      return '生成评估';
    case 'mitigate':
      return '风险缓解';
    default:
      return '提示';
  }
});

const openModal = (type, payload = null) => {
  modal.type = type;
  modal.payload = payload;
};

const closeModal = () => {
  modal.type = '';
  modal.payload = null;
};

const confirmModal = () => {
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

.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5edf7;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
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

.score {
  background: linear-gradient(120deg, #27a5ff, #64d3ff);
  color: #fff;
  padding: 6px;
  border-radius: 10px;
  text-align: center;
  font-weight: 700;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.risk-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.risk-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f6f9ff;
  border: 1px dashed #d8e5f4;
  padding: 10px;
  border-radius: 12px;
}

.burn-row {
  display: grid;
  grid-template-columns: 120px 1fr 80px;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.burn-bar {
  height: 12px;
  background: #f1f6fd;
  border-radius: 999px;
}

.burn-fill {
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(120deg, #27a5ff, #64d3ff);
}

.subtitle {
  color: #355278;
  margin-bottom: 8px;
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

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.muted {
  color: #69829d;
  margin: 0;
}

label,
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

@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .table-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
</style>

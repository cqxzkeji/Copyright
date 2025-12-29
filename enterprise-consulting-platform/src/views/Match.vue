<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h2>咨询资源匹配</h2>
        <p>智能匹配企业诉求与顾问、项目资源，提供推荐与锁定。</p>
      </div>
      <div class="actions">
        <button @click="openModal('smart')">智能推荐</button>
        <button @click="openModal('reserve')">锁定资源</button>
      </div>
    </header>

    <section class="card">
      <div class="table-head">
        <h3>需求与专家匹配度</h3>
        <span class="note">实时匹配共 {{ matches.length }} 条记录</span>
      </div>
      <div class="table">
        <div class="table-row table-header">
          <span>企业</span>
          <span>需求</span>
          <span>专家</span>
          <span>匹配度</span>
          <span>可排期</span>
          <span>操作</span>
        </div>
        <div v-for="item in matches" :key="item.company + item.expert" class="table-row">
          <span>{{ item.company }}</span>
          <span>{{ item.need }}</span>
          <span>{{ item.expert }}</span>
          <span>
            <div class="score" :style="{ width: item.score + '%' }">{{ item.score }}%</div>
          </span>
          <span>{{ item.slot }}</span>
          <span>
            <button class="ghost" @click="openModal('assign', item)">指派</button>
          </span>
        </div>
      </div>
    </section>

    <section class="grid">
      <div class="card">
        <h3>资源池概览</h3>
        <div class="pill-group">
          <span class="chip" v-for="pool in resourcePools" :key="pool">{{ pool }}</span>
        </div>
        <button class="ghost" @click="openModal('pool')">查看资源明细</button>
      </div>
      <div class="card">
        <h3>匹配趋势</h3>
        <div class="trend">
          <div v-for="item in trend" :key="item.label" class="trend-row">
            <span>{{ item.label }}</span>
            <div class="trend-bar">
              <div class="trend-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <span class="value">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </section>

    <Modal v-if="modal.type" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="modal.type === 'smart'">
        <p class="subtitle">系统正在根据画像与标签进行智能推荐。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '80%' }"></div>
        </div>
      </template>
      <template v-else-if="modal.type === 'reserve'">
        <p class="subtitle">确认锁定匹配资源并同步给对接人？</p>
        <label class="check"><input type="checkbox" checked /> 同步日程</label>
        <label class="check"><input type="checkbox" checked /> 发送短信</label>
      </template>
      <template v-else-if="modal.type === 'assign'">
        <p class="subtitle">选择与 {{ modal.payload?.company }} 沟通的专家与时间。</p>
        <label>专家<input v-model="form.expert" placeholder="输入专家姓名" /></label>
        <label>时间<input v-model="form.time" placeholder="如：本周四 15:00" /></label>
      </template>
      <template v-else-if="modal.type === 'pool'">
        <p class="subtitle">共 68 位可用专家，精选 18 个在研项目资源。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '58%' }"></div>
        </div>
        <p class="muted">正在加载资源池详情...</p>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const matches = reactive([
  { company: '科越智造', need: '精益生产', expert: '林骁', score: 93, slot: '可三天内' },
  { company: '星环科技', need: '数据治理', expert: '周曼', score: 88, slot: '下周有档' },
  { company: '远航物流', need: '仓储优化', expert: '张赫', score: 82, slot: '可当周' },
  { company: '海川能源', need: '融资辅导', expert: '付琦', score: 85, slot: '可当周' },
  { company: '华锐医药', need: '合规体系', expert: '苏盈', score: 81, slot: '下周有档' },
  { company: '锦程服饰', need: '品牌升级', expert: '崔南', score: 79, slot: '可三天内' },
  { company: '数博云', need: '渠道拓展', expert: '吴青', score: 84, slot: '下周有档' },
  { company: '领帆自动化', need: '产线改造', expert: '王映', score: 90, slot: '可当周' },
  { company: '联创网络', need: '安全合规', expert: '沈然', score: 76, slot: '可三天内' },
  { company: '泰木食品', need: '供应链数字化', expert: '高杨', score: 78, slot: '下周有档' },
  { company: '阳澄农业', need: '品牌塑造', expert: '张苇', score: 83, slot: '可当周' },
  { company: '慧云航科', need: '项目论证', expert: '黎笑', score: 87, slot: '可当周' },
  { company: '云杉环保', need: '节能方案', expert: '吕舟', score: 80, slot: '下周有档' },
  { company: '启行教育', need: '课程产品化', expert: '苗棠', score: 77, slot: '可当周' },
  { company: '蓝图地产', need: '营销策划', expert: '项晖', score: 82, slot: '可三天内' },
  { company: '志远汽车', need: '智能座舱', expert: '陶衡', score: 89, slot: '下周有档' },
  { company: '光华智芯', need: '产能规划', expert: '贺星', score: 91, slot: '可三天内' },
  { company: '信泽金融', need: '风控体系', expert: '隋野', score: 80, slot: '可当周' },
  { company: '森宇家居', need: '仓储升级', expert: '赵轶', score: 78, slot: '下周有档' },
  { company: '飞创数字', need: '云原生改造', expert: '李衡', score: 86, slot: '可三天内' }
]);

const resourcePools = ['数字化顾问', '投研顾问', '财税专家', '精益顾问', '安全合规', '组织人才', '项目资源'];

const trend = computed(() => [
  { label: '匹配成功率', value: 86 },
  { label: '平均响应度', value: 78 },
  { label: '沟通确认率', value: 72 },
  { label: '资源利用率', value: 69 }
]);

const modal = reactive({ type: '', payload: null });
const form = reactive({ expert: '', time: '' });

const modalTitle = computed(() => {
  switch (modal.type) {
    case 'smart':
      return '智能推荐中';
    case 'reserve':
      return '锁定资源确认';
    case 'assign':
      return '指派沟通';
    case 'pool':
      return '资源池详情';
    default:
      return '提示';
  }
});

const openModal = (type, payload = null) => {
  modal.type = type;
  modal.payload = payload;
  if (type === 'assign' && payload) {
    form.expert = payload.expert;
  }
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

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.chip {
  padding: 6px 10px;
  background: #e9f6ff;
  color: #1a7ecb;
  border-radius: 999px;
  border: 1px solid #c6e7ff;
}

.trend-row {
  display: grid;
  grid-template-columns: 140px 1fr 70px;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.trend-bar {
  height: 12px;
  background: #f1f6fd;
  border-radius: 999px;
}

.trend-fill {
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
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #436083;
}

input {
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

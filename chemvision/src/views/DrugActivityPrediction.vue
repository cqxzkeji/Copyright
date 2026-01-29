<template>
  <section class="module">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <h3 class="section-title">活性评分面板</h3>
        <p class="module-desc">当前模型综合评分：<strong>87.6</strong> / 100</p>
        <div class="score-row">
          <div>
            <span>抑制率</span>
            <strong>82%</strong>
          </div>
          <div>
            <span>选择性</span>
            <strong>76%</strong>
          </div>
          <div>
            <span>成药性</span>
            <strong>90%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">预测示意图</h3>
        <img :src="predictionImage" alt="预测模型示意" />
      </div>
      <div class="card">
        <h3 class="section-title">模型操作</h3>
        <div class="button-group">
          <button class="btn" @click="openPredictModal">启动预测</button>
          <button class="btn secondary" @click="openFormModal">提交样本</button>
          <button class="btn ghost" @click="openTipModal">评分说明</button>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top: 24px;">
      <div class="card">
        <h3 class="section-title">模型特征权重</h3>
        <div class="chart">
          <div v-for="item in weights" :key="item.name" class="chart-row">
            <span>{{ item.name }}</span>
            <div class="chart-bar">
              <div class="chart-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">优化建议</h3>
        <ul class="notes">
          <li>提高芳香环比例可提升靶点结合能。</li>
          <li>引入羟基有助于降低 LogP 值，提高溶解度。</li>
          <li>建议将分子量控制在 450 Da 以下以维持成药性。</li>
        </ul>
      </div>
    </div>

    <div class="card" style="margin-top: 24px;">
      <h3 class="section-title">预测样本列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>分子名称</th>
            <th>模型</th>
            <th>活性评分</th>
            <th>优化建议</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sample in samples" :key="sample.id">
            <td>{{ sample.id }}</td>
            <td>{{ sample.name }}</td>
            <td>{{ sample.model }}</td>
            <td>{{ sample.score }}</td>
            <td>{{ sample.advice }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showPredictModal" title="活性预测进度" @close="showPredictModal = false">
      <p>系统正在调用机器学习模型进行活性评分，请稍候。</p>
      <div class="progress" style="margin: 16px 0;">
        <div class="progress-bar" :style="{ width: predictProgress + '%' }"></div>
      </div>
      <p>当前进度：{{ predictProgress }}%</p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="completePredict">生成预测报告</button>
      </div>
    </BaseModal>

    <BaseModal :show="showFormModal" title="提交预测样本" @close="showFormModal = false">
      <form class="form-grid" @submit.prevent="submitSample">
        <label class="form-field">
          分子名称
          <input v-model="form.name" required placeholder="如：CV-203" />
        </label>
        <label class="form-field">
          主要官能团
          <input v-model="form.group" required placeholder="如：酰胺、胺基" />
        </label>
        <label class="form-field">
          使用模型
          <select v-model="form.model">
            <option>随机森林</option>
            <option>深度学习</option>
            <option>图神经网络</option>
          </select>
        </label>
        <label class="form-field">
          目标靶点
          <input v-model="form.target" placeholder="如：EGFR" />
        </label>
        <label class="form-field">
          备注
          <textarea v-model="form.note" rows="3" placeholder="填写样本来源"></textarea>
        </label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button class="btn secondary" type="button" @click="showFormModal = false">取消</button>
          <button class="btn" type="submit">提交样本</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showTipModal" title="活性评分说明" @close="showTipModal = false">
      <p>
        活性评分综合抑制率、选择性、成药性三项指标，并结合模型置信度加权。
      </p>
      <p>
        每次预测完成后系统会给出结构优化提示，帮助调整官能团组合。
      </p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="showTipModal = false">知道了</button>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const predictionImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200" fill="none">
      <rect width="360" height="200" rx="20" fill="#F2F6FF"/>
      <rect x="40" y="40" width="120" height="40" rx="12" fill="#2F5BFF" opacity="0.2"/>
      <rect x="200" y="120" width="120" height="40" rx="12" fill="#54B8FF" opacity="0.3"/>
      <path d="M160 60L220 80" stroke="#2F5BFF" stroke-width="6" stroke-linecap="round"/>
      <path d="M140 140L200 140" stroke="#54B8FF" stroke-width="6" stroke-linecap="round"/>
    </svg>`
  );

const samples = ref([
  { id: 1, name: 'CV-101', model: '随机森林', score: 86.2, advice: '降低分子量' },
  { id: 2, name: 'CV-102', model: '图神经网络', score: 90.1, advice: '提升羟基比例' },
  { id: 3, name: 'CV-103', model: '深度学习', score: 78.4, advice: '优化芳香环' },
  { id: 4, name: 'CV-104', model: '随机森林', score: 83.7, advice: '降低LogP' },
  { id: 5, name: 'CV-105', model: '图神经网络', score: 92.5, advice: '稳定氢键' },
  { id: 6, name: 'CV-106', model: '深度学习', score: 81.9, advice: '优化侧链柔性' },
  { id: 7, name: 'CV-107', model: '随机森林', score: 75.3, advice: '引入极性基团' },
  { id: 8, name: 'CV-108', model: '图神经网络', score: 88.6, advice: '改善溶解度' },
  { id: 9, name: 'CV-109', model: '深度学习', score: 79.5, advice: '增加氟代' },
  { id: 10, name: 'CV-110', model: '随机森林', score: 84.9, advice: '控制分子量' },
  { id: 11, name: 'CV-111', model: '图神经网络', score: 91.3, advice: '优化羟基' },
  { id: 12, name: 'CV-112', model: '深度学习', score: 77.8, advice: '增强疏水性' },
  { id: 13, name: 'CV-113', model: '随机森林', score: 82.1, advice: '优化电荷' },
  { id: 14, name: 'CV-114', model: '图神经网络', score: 89.4, advice: '增加芳香环' },
  { id: 15, name: 'CV-115', model: '深度学习', score: 76.2, advice: '优化受体适配' },
  { id: 16, name: 'CV-116', model: '随机森林', score: 85.6, advice: '提高稳定性' },
  { id: 17, name: 'CV-117', model: '图神经网络', score: 90.7, advice: '改善代谢' },
  { id: 18, name: 'CV-118', model: '深度学习', score: 79.9, advice: '强化氢键' },
  { id: 19, name: 'CV-119', model: '随机森林', score: 83.3, advice: '降低毒性' },
  { id: 20, name: 'CV-120', model: '图神经网络', score: 92.0, advice: '增强亲水性' }
]);

const weights = [
  { name: '官能团极性', value: 28 },
  { name: '分子量', value: 22 },
  { name: 'LogP', value: 18 },
  { name: '氢键供体', value: 17 },
  { name: '拓扑极性表面积', value: 15 }
];

const showPredictModal = ref(false);
const showFormModal = ref(false);
const showTipModal = ref(false);
const predictProgress = ref(0);

const form = ref({
  name: '',
  group: '',
  model: '随机森林',
  target: '',
  note: ''
});

const openPredictModal = () => {
  showPredictModal.value = true;
  predictProgress.value = 0;
};

const openFormModal = () => {
  showFormModal.value = true;
};

const openTipModal = () => {
  showTipModal.value = true;
};

const completePredict = () => {
  predictProgress.value = 100;
};

const submitSample = () => {
  showFormModal.value = false;
};

onMounted(() => {
  const interval = setInterval(() => {
    if (!showPredictModal.value) return;
    if (predictProgress.value < 90) {
      predictProgress.value += 6;
    }
  }, 450);
  return () => clearInterval(interval);
});
</script>

<style scoped>
.module-desc {
  color: #5f6c8a;
}

.score-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.score-row span {
  display: block;
  font-size: 12px;
  color: #7a879f;
}

.score-row strong {
  font-size: 18px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  gap: 12px;
  align-items: center;
  font-size: 14px;
}

.chart-bar {
  background: #eef3ff;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.chart-fill {
  height: 100%;
  background: linear-gradient(90deg, #2f5bff, #54b8ff);
}

.notes {
  margin: 0;
  padding-left: 20px;
  color: #5f6c8a;
  line-height: 1.8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}
</style>

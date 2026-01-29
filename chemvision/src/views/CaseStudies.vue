<template>
  <section class="module">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <h3 class="section-title">教学案例概览</h3>
        <p class="module-desc">已收录 {{ cases.length }} 个药物设计案例，可用于课程讨论与实验训练。</p>
        <div class="badge">已同步至课堂资料库</div>
      </div>
      <div class="card">
        <h3 class="section-title">案例图谱</h3>
        <img :src="caseImage" alt="教学案例图谱" />
      </div>
      <div class="card">
        <h3 class="section-title">案例操作</h3>
        <div class="button-group">
          <button class="btn" @click="openProgressModal">生成教学报告</button>
          <button class="btn secondary" @click="openFormModal">添加案例</button>
          <button class="btn ghost" @click="openTipModal">教学提示</button>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top: 24px;">
      <div class="card">
        <h3 class="section-title">案例覆盖主题</h3>
        <div class="chart">
          <div v-for="topic in topics" :key="topic.name" class="chart-row">
            <span>{{ topic.name }}</span>
            <div class="chart-bar">
              <div class="chart-fill" :style="{ width: topic.value + '%' }"></div>
            </div>
            <strong>{{ topic.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">教学建议</h3>
        <ul class="notes">
          <li>结合 SAR 模块引导学生理解结构优化步骤。</li>
          <li>案例讨论建议采用小组汇报形式，突出官能团贡献。</li>
          <li>可使用模拟模块演示关键构象变化，提升互动性。</li>
        </ul>
      </div>
    </div>

    <div class="card" style="margin-top: 24px;">
      <h3 class="section-title">案例库列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>案例名称</th>
            <th>研究方向</th>
            <th>核心官能团</th>
            <th>教学要点</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cases" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.field }}</td>
            <td>{{ item.group }}</td>
            <td>{{ item.point }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showProgressModal" title="教学报告生成进度" @close="showProgressModal = false">
      <p>正在汇总案例学习记录并生成教学报告。</p>
      <div class="progress" style="margin: 16px 0;">
        <div class="progress-bar" :style="{ width: reportProgress + '%' }"></div>
      </div>
      <p>当前进度：{{ reportProgress }}%</p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="finishReport">下载报告</button>
      </div>
    </BaseModal>

    <BaseModal :show="showFormModal" title="添加教学案例" @close="showFormModal = false">
      <form class="form-grid" @submit.prevent="submitCase">
        <label class="form-field">
          案例名称
          <input v-model="form.name" required placeholder="如：抗肿瘤先导优化" />
        </label>
        <label class="form-field">
          研究方向
          <input v-model="form.field" required placeholder="如：靶向治疗" />
        </label>
        <label class="form-field">
          核心官能团
          <input v-model="form.group" required placeholder="如：酰胺、吡啶" />
        </label>
        <label class="form-field">
          教学要点
          <textarea v-model="form.point" rows="3" placeholder="请描述教学重点"></textarea>
        </label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button class="btn secondary" type="button" @click="showFormModal = false">取消</button>
          <button class="btn" type="submit">保存案例</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showTipModal" title="教学提示信息" @close="showTipModal = false">
      <p>
        建议在案例教学中结合官能团分析模块，使学生理解结构变化与活性之间的关系。
      </p>
      <p>
        可在课堂中设置案例对比任务，引导学生进行结构优化方案设计。
      </p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="showTipModal = false">收到</button>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const caseImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200" fill="none">
      <rect width="360" height="200" rx="20" fill="#F2F6FF"/>
      <rect x="60" y="50" width="80" height="100" rx="16" fill="#2F5BFF" opacity="0.2"/>
      <rect x="160" y="30" width="80" height="120" rx="16" fill="#54B8FF" opacity="0.3"/>
      <rect x="260" y="60" width="60" height="90" rx="16" fill="#2F5BFF" opacity="0.2"/>
    </svg>`
  );

const cases = ref([
  { id: 1, name: '抗肿瘤先导优化', field: '肿瘤治疗', group: '酰胺', point: '优化氢键' },
  { id: 2, name: '抗病毒结构改造', field: '抗病毒', group: '羟基', point: '提升溶解度' },
  { id: 3, name: '抗菌分子设计', field: '抗菌', group: '胺基', point: '提高结合' },
  { id: 4, name: '神经保护剂开发', field: '神经系统', group: '酯基', point: '提高通透性' },
  { id: 5, name: '代谢调节剂', field: '代谢疾病', group: '羧基', point: '优化酸性' },
  { id: 6, name: '抗炎候选化合物', field: '抗炎', group: '硝基', point: '降低毒性' },
  { id: 7, name: '抗凝血药物', field: '心血管', group: '磺酰胺', point: '增强选择性' },
  { id: 8, name: '肾病治疗分子', field: '泌尿系统', group: '羟基', point: '保持亲水性' },
  { id: 9, name: '抗过敏分子', field: '免疫调节', group: '胺基', point: '平衡 pKa' },
  { id: 10, name: '抗疼痛候选', field: '疼痛管理', group: '酰胺', point: '增强稳定性' },
  { id: 11, name: '抗抑郁药', field: '精神健康', group: '吡啶', point: '调节受体' },
  { id: 12, name: '抗高血压药物', field: '心血管', group: '酯基', point: '延长半衰期' },
  { id: 13, name: '免疫抑制剂', field: '免疫治疗', group: '羧基', point: '优化代谢' },
  { id: 14, name: '抗氧化分子', field: '抗氧化', group: '羟基', point: '清除自由基' },
  { id: 15, name: '呼吸系统药物', field: '呼吸系统', group: '胺基', point: '降低刺激性' },
  { id: 16, name: '皮肤药物设计', field: '皮肤科', group: '酰胺', point: '增加渗透' },
  { id: 17, name: '抗骨质疏松', field: '骨科', group: '磷酸基', point: '提高结合' },
  { id: 18, name: '抗糖尿病分子', field: '代谢疾病', group: '羟基', point: '提高活性' },
  { id: 19, name: '抗心律失常', field: '心血管', group: '氟代基', point: '降低毒性' },
  { id: 20, name: '抗贫血药物', field: '血液系统', group: '羧基', point: '提升成药性' }
]);

const topics = [
  { name: '抗肿瘤', value: 32 },
  { name: '代谢调节', value: 24 },
  { name: '心血管', value: 18 },
  { name: '神经系统', value: 14 },
  { name: '其他', value: 12 }
];

const showProgressModal = ref(false);
const showFormModal = ref(false);
const showTipModal = ref(false);
const reportProgress = ref(0);

const form = ref({
  name: '',
  field: '',
  group: '',
  point: ''
});

const openProgressModal = () => {
  showProgressModal.value = true;
  reportProgress.value = 0;
};

const openFormModal = () => {
  showFormModal.value = true;
};

const openTipModal = () => {
  showTipModal.value = true;
};

const finishReport = () => {
  reportProgress.value = 100;
};

const submitCase = () => {
  showFormModal.value = false;
};

onMounted(() => {
  const interval = setInterval(() => {
    if (!showProgressModal.value) return;
    if (reportProgress.value < 95) {
      reportProgress.value += 5;
    }
  }, 500);
  return () => clearInterval(interval);
});
</script>

<style scoped>
.module-desc {
  color: #5f6c8a;
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
  grid-template-columns: 90px 1fr 50px;
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

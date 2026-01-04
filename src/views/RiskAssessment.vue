<template>
  <div class="grid" aria-label="风险评估与分级">
    <div class="section-title">
      <h2>肾病风险评估与分级</h2>
      <div class="actions">
        <button @click="openNewAssessment">新建评估</button>
        <button class="secondary" @click="showModel = true">模型参数</button>
        <button class="accent" @click="showExplain = true">风险解释</button>
      </div>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>患者</th>
            <th>eGFR</th>
            <th>尿蛋白</th>
            <th>CKD分期</th>
            <th>风险等级</th>
            <th>评估时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in assessments" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.egfr }} ml/min</td>
            <td>{{ item.protein }}</td>
            <td>{{ item.stage }}</td>
            <td>
              <span class="badge" :class="badgeClass(item.risk)">{{ item.risk }}</span>
            </td>
            <td>{{ item.time }}</td>
            <td>
              <div class="actions">
                <button class="secondary" @click="showPlan(item)">生成随访计划</button>
                <button class="accent" @click="showAlert(item)">高风险提示</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="responsive-grid">
      <div class="card">
        <h3>分期判定规则</h3>
        <ul>
          <li>G1: eGFR ≥ 90</li>
          <li>G2: 60 ≤ eGFR &lt; 90</li>
          <li>G3: 30 ≤ eGFR &lt; 60</li>
          <li>G4: 15 ≤ eGFR &lt; 30</li>
          <li>G5: eGFR &lt; 15</li>
        </ul>
      </div>
      <div class="card">
        <h3>动态风险量化</h3>
        <p>基于 eGFR 斜率、尿蛋白分级与共病信息，实时生成综合评分。</p>
        <div class="progress-bar"><span :style="{ width: '72%' }"></span></div>
        <small>模型置信度 0.72</small>
      </div>
      <div class="card">
        <h3>高风险识别</h3>
        <p>自动推送需要转肾内科或肾替代治疗评估的患者名单。</p>
        <div class="chip-row">
          <span class="pill">急速下降</span>
          <span class="pill">蛋白尿3+</span>
          <span class="pill">高钾血症</span>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="overlay" @click.self="closeModal">
      <div class="modal">
        <h3>新建风险评估</h3>
        <div class="form-grid">
          <label>患者姓名<input v-model="form.name" placeholder="如：王晨" /></label>
          <label>eGFR<input v-model.number="form.egfr" type="number" /></label>
          <label>尿蛋白<select v-model="form.protein"><option>阴性</option><option>1+</option><option>2+</option><option>3+</option></select></label>
          <label>共病<select v-model="form.comorbidity"><option>无</option><option>高血压</option><option>糖尿病</option><option>高血压+糖尿病</option></select></label>
        </div>
        <div class="actions" style="justify-content: flex-end;">
          <button class="secondary" @click="submitAssessment">提交评估</button>
        </div>
      </div>
    </div>

    <div v-if="showModel" class="overlay" @click.self="showModel = false">
      <div class="modal">
        <h3>模型参数</h3>
        <ul>
          <li>特征权重：eGFR 0.45、尿蛋白 0.35、共病 0.2</li>
          <li>阈值设置：风险≥0.7 判定高风险</li>
          <li>训练数据：近 3 年随访队列 12 万条记录</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="showModel = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="showExplain" class="overlay" @click.self="showExplain = false">
      <div class="modal">
        <h3>风险解释</h3>
        <p>尿蛋白升高与 eGFR 下降是主要驱动因素。合并糖尿病、血压控制差会显著提高风险系数。</p>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="showExplain = false">知道了</button>
        </div>
      </div>
    </div>

    <div v-if="planPatient" class="overlay" @click.self="planPatient = null">
      <div class="modal">
        <h3>{{ planPatient.name }} 的随访计划</h3>
        <p>建议随访频次：每 {{ planPatient.risk === '高风险' ? '月' : '两月' }} 一次，复查项目：肌酐、尿蛋白、电解质。</p>
        <div class="progress-bar" style="margin: 10px 0;"><span :style="{ width: planPatient.risk === '高风险' ? '90%' : '65%' }"></span></div>
        <small>干预落实度预估</small>
        <div class="actions" style="justify-content: flex-end;">
          <button class="accent" @click="planPatient = null">生成提醒</button>
        </div>
      </div>
    </div>

    <div v-if="alertPatient" class="overlay" @click.self="alertPatient = null">
      <div class="modal">
        <h3>高风险提醒</h3>
        <p>{{ alertPatient?.name }}：符合转诊/肾替代治疗评估条件，请联系肾内科。</p>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="alertPatient = null">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const assessments = reactive([
  { id: 1, name: '王晨', egfr: 92, protein: '阴性', stage: 'G1', risk: '低风险', time: '2024-06-01' },
  { id: 2, name: '李敏', egfr: 65, protein: '1+', stage: 'G2', risk: '中风险', time: '2024-05-28' },
  { id: 3, name: '张伟', egfr: 32, protein: '3+', stage: 'G4', risk: '高风险', time: '2024-05-20' },
  { id: 4, name: '陈强', egfr: 48, protein: '2+', stage: 'G3', risk: '中风险', time: '2024-05-18' },
  { id: 5, name: '刘颖', egfr: 105, protein: '阴性', stage: 'G1', risk: '低风险', time: '2024-06-03' },
  { id: 6, name: '黄静', egfr: 42, protein: '1+', stage: 'G3', risk: '中风险', time: '2024-04-20' },
  { id: 7, name: '龚飞', egfr: 39, protein: '2+', stage: 'G3', risk: '高风险', time: '2024-04-16' },
  { id: 8, name: '许晴', egfr: 90, protein: '阴性', stage: 'G1', risk: '低风险', time: '2024-05-30' },
  { id: 9, name: '杜凯', egfr: 63, protein: '1+', stage: 'G2', risk: '中风险', time: '2024-05-10' },
  { id: 10, name: '唐越', egfr: 66, protein: '1+', stage: 'G2', risk: '中风险', time: '2024-05-12' }
]);

const showModal = ref(false);
const showModel = ref(false);
const showExplain = ref(false);
const planPatient = ref(null);
const alertPatient = ref(null);
const form = reactive({ name: '', egfr: 80, protein: '阴性', comorbidity: '无' });

const badgeClass = (risk) => {
  if (risk === '高风险') return 'red badge';
  if (risk === '中风险') return 'orange badge';
  return 'green badge';
};

const computeStage = (egfr) => {
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 30) return 'G3';
  if (egfr >= 15) return 'G4';
  return 'G5';
};

const computeRisk = (egfr, protein, comorbidity) => {
  let score = 0;
  score += egfr < 60 ? 0.4 : 0.1;
  score += protein === '3+' ? 0.4 : protein === '2+' ? 0.25 : protein === '1+' ? 0.15 : 0.05;
  score += comorbidity.includes('糖尿病') ? 0.2 : comorbidity.includes('高血压') ? 0.15 : 0.05;
  if (score >= 0.7) return '高风险';
  if (score >= 0.4) return '中风险';
  return '低风险';
};

const openNewAssessment = () => {
  showModal.value = true;
};

const submitAssessment = () => {
  const stage = computeStage(form.egfr || 0);
  const risk = computeRisk(form.egfr || 0, form.protein, form.comorbidity);
  assessments.unshift({
    id: Date.now(),
    name: form.name || '未命名',
    egfr: form.egfr || 80,
    protein: form.protein,
    stage,
    risk,
    time: new Date().toISOString().slice(0, 10)
  });
  showModal.value = false;
};

const showPlan = (item) => {
  planPatient.value = item;
};

const showAlert = (item) => {
  alertPatient.value = item;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

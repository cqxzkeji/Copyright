<template>
  <div class="grid" aria-label="患者健康数据采集与管理">
    <div class="section-title">
      <h2>患者健康数据档案</h2>
      <div class="actions">
        <button @click="openAdd">新增患者</button>
        <button class="secondary" @click="openUpload">导入检验数据</button>
        <button class="accent" @click="showQuality = true">质控校验</button>
      </div>
    </div>
    <div class="card">
      <div class="actions" style="justify-content: space-between; margin-bottom: 10px;">
        <div class="chip-row">
          <span class="tag">肌酐/尿蛋白动态监测</span>
          <span class="tag">历史记录不少于24个月</span>
        </div>
        <button class="secondary" @click="showFilters = true">筛选与导出</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>eGFR</th>
            <th>尿蛋白</th>
            <th>既往病史</th>
            <th>最近随访</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>{{ patient.name }}</td>
            <td>{{ patient.age }}</td>
            <td>{{ patient.egfr }} ml/min</td>
            <td>{{ patient.protein }}</td>
            <td>{{ patient.history }}</td>
            <td>{{ patient.followUp }}</td>
            <td>
              <div class="actions">
                <button class="secondary" @click="openHistory(patient)">查看历程</button>
                <button class="accent" @click="openUpload(patient)">补录检验</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="responsive-grid">
      <div class="card">
        <h3>采集标准</h3>
        <p>统一录入患者基础信息、检验指标、随访记录，确保数据可追溯。</p>
        <div class="chip-row">
          <span class="pill">可追溯ID</span>
          <span class="pill">跨机构汇聚</span>
          <span class="pill">时序管理</span>
        </div>
      </div>
      <div class="card">
        <h3>数据合规</h3>
        <p>入库前自动校验采血时间、样本类型与单位一致性，异常值标红提示。</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span :style="{ width: '86%' }"></span>
        </div>
        <small>本周质控通过率 86%</small>
      </div>
      <div class="card">
        <h3>随访记录摘要</h3>
        <ul>
          <li v-for="item in followUpNotes" :key="item.id">{{ item.text }}</li>
        </ul>
      </div>
    </div>

    <div v-if="showModal" class="overlay" @click.self="closeModal">
      <div class="modal">
        <h3>新增患者</h3>
        <div class="form-grid">
          <label>姓名<input v-model="form.name" placeholder="张三" /></label>
          <label>年龄<input v-model.number="form.age" type="number" placeholder="45" /></label>
          <label>eGFR<input v-model.number="form.egfr" type="number" placeholder="90" /></label>
          <label>尿蛋白<select v-model="form.protein"><option>阴性</option><option>1+</option><option>2+</option><option>3+</option></select></label>
          <label>既往病史<input v-model="form.history" placeholder="高血压/糖尿病" /></label>
          <label>最近随访<input v-model="form.followUp" type="date" /></label>
        </div>
        <div class="actions" style="justify-content: flex-end;">
          <button class="secondary" @click="savePatient">保存并进入评估</button>
        </div>
      </div>
    </div>

    <div v-if="historyPatient" class="overlay" @click.self="historyPatient = null">
      <div class="modal">
        <h3>{{ historyPatient.name }} 的健康历程</h3>
        <p>跨机构检验共 {{ historyPatient.trend.length }} 条，随访 {{ Math.ceil(Math.random()*6+6) }} 次。</p>
        <div class="grid" style="margin: 12px 0;">
          <div v-for="(value, idx) in historyPatient.trend" :key="idx" class="chart-bar">
            <span style="width: 80px;">{{ value.date }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: value.egfr + '%', background: value.egfr < 60 ? '#f87171' : '#22c55e' }"></div>
            </div>
            <span>{{ value.egfr }} ml/min</span>
          </div>
        </div>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="historyPatient = null">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="uploadTarget" class="overlay" @click.self="uploadTarget = null">
      <div class="modal">
        <h3>上传检验数据</h3>
        <p>患者：{{ uploadTarget.name || '批量导入' }}</p>
        <div class="form-grid">
          <label>检验日期<input type="date" /></label>
          <label>肌酐(umol/L)<input type="number" /></label>
          <label>尿蛋白<select><option>阴性</option><option>1+</option><option>2+</option><option>3+</option></select></label>
          <label>采集来源<select><option>门诊</option><option>住院</option><option>外部导入</option></select></label>
        </div>
        <div class="progress-bar" style="margin: 10px 0;">
          <span :style="{ width: uploadProgress + '%', background: '#f59e0b' }"></span>
        </div>
        <small>传输进度：{{ uploadProgress }}%</small>
        <div class="actions" style="justify-content: flex-end; margin-top: 12px;">
          <button class="accent" @click="simulateUpload">开始上传</button>
        </div>
      </div>
    </div>

    <div v-if="showQuality" class="overlay" @click.self="showQuality = false">
      <div class="modal">
        <h3>质控校验结果</h3>
        <ul>
          <li>单位统一性校验：通过</li>
          <li>采血时间与就诊时间匹配：3 条提示需人工复核</li>
          <li>极值识别：肌酐 &gt; 1200umol/L 1 条</li>
          <li>历史对比波动超过 30%：2 条</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="showQuality = false">完成</button>
        </div>
      </div>
    </div>

    <div v-if="showFilters" class="overlay" @click.self="showFilters = false">
      <div class="modal">
        <h3>筛选导出</h3>
        <div class="form-grid">
          <label>风险等级<select><option>全部</option><option>低风险</option><option>中风险</option><option>高风险</option></select></label>
          <label>随访状态<select><option>全部</option><option>按期</option><option>逾期</option></select></label>
          <label>时间范围<input type="date" /></label>
        </div>
        <div class="actions" style="justify-content: flex-end;">
          <button class="secondary" @click="showFilters = false">导出CSV</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const followUpNotes = [
  { id: 1, text: 'eGFR 年降幅控制在 4 ml/min 以下' },
  { id: 2, text: '高血压患者随访每月复查肌酐、尿蛋白' },
  { id: 3, text: '糖尿病合并患者增加 HbA1c 监测频次' }
];

const patients = reactive([
  { id: 1, name: '王晨', age: 45, egfr: 92, protein: '阴性', history: '高血压', followUp: '2024-06-01', trend: sampleTrend() },
  { id: 2, name: '李敏', age: 53, egfr: 65, protein: '1+', history: '糖尿病', followUp: '2024-05-25', trend: sampleTrend(60) },
  { id: 3, name: '陈强', age: 60, egfr: 48, protein: '2+', history: '高血压', followUp: '2024-04-30', trend: sampleTrend(50) },
  { id: 4, name: '刘颖', age: 37, egfr: 105, protein: '阴性', history: '无', followUp: '2024-06-05', trend: sampleTrend(95) },
  { id: 5, name: '张伟', age: 72, egfr: 32, protein: '3+', history: '糖尿病', followUp: '2024-04-12', trend: sampleTrend(30) },
  { id: 6, name: '赵磊', age: 55, egfr: 70, protein: '阴性', history: '高血压', followUp: '2024-05-20', trend: sampleTrend(72) },
  { id: 7, name: '孙丽', age: 49, egfr: 58, protein: '2+', history: '高血压', followUp: '2024-05-10', trend: sampleTrend(55) },
  { id: 8, name: '周航', age: 41, egfr: 88, protein: '阴性', history: '无', followUp: '2024-05-28', trend: sampleTrend(82) },
  { id: 9, name: '黄静', age: 66, egfr: 42, protein: '1+', history: '糖尿病', followUp: '2024-04-18', trend: sampleTrend(45) },
  { id: 10, name: '郭涛', age: 59, egfr: 55, protein: '1+', history: '高血压', followUp: '2024-05-02', trend: sampleTrend(52) },
  { id: 11, name: '韩冰', age: 63, egfr: 61, protein: '阴性', history: '无', followUp: '2024-04-25', trend: sampleTrend(60) },
  { id: 12, name: '吴桐', age: 57, egfr: 74, protein: '阴性', history: '高血压', followUp: '2024-05-29', trend: sampleTrend(76) },
  { id: 13, name: '郑明', age: 44, egfr: 97, protein: '阴性', history: '无', followUp: '2024-06-04', trend: sampleTrend(94) },
  { id: 14, name: '叶华', age: 70, egfr: 36, protein: '2+', history: '糖尿病', followUp: '2024-04-08', trend: sampleTrend(35) },
  { id: 15, name: '宋倩', age: 52, egfr: 68, protein: '1+', history: '高血压', followUp: '2024-05-12', trend: sampleTrend(67) },
  { id: 16, name: '罗云', age: 39, egfr: 102, protein: '阴性', history: '无', followUp: '2024-06-06', trend: sampleTrend(100) },
  { id: 17, name: '秦亮', age: 61, egfr: 50, protein: '2+', history: '高血压', followUp: '2024-04-30', trend: sampleTrend(50) },
  { id: 18, name: '范婷', age: 47, egfr: 83, protein: '阴性', history: '无', followUp: '2024-05-15', trend: sampleTrend(85) },
  { id: 19, name: '杜凯', age: 58, egfr: 63, protein: '1+', history: '糖尿病', followUp: '2024-05-06', trend: sampleTrend(64) },
  { id: 20, name: '崔娜', age: 54, egfr: 72, protein: '阴性', history: '高血压', followUp: '2024-05-18', trend: sampleTrend(70) },
  { id: 21, name: '黎佳', age: 46, egfr: 78, protein: '阴性', history: '无', followUp: '2024-06-03', trend: sampleTrend(80) },
  { id: 22, name: '龚飞', age: 69, egfr: 39, protein: '2+', history: '糖尿病', followUp: '2024-04-16', trend: sampleTrend(38) },
  { id: 23, name: '唐越', age: 51, egfr: 66, protein: '1+', history: '高血压', followUp: '2024-05-08', trend: sampleTrend(68) },
  { id: 24, name: '许晴', age: 43, egfr: 90, protein: '阴性', history: '无', followUp: '2024-05-30', trend: sampleTrend(92) },
  { id: 25, name: '赵明', age: 62, egfr: 47, protein: '2+', history: '高血压', followUp: '2024-04-22', trend: sampleTrend(48) }
]);

const showModal = ref(false);
const showQuality = ref(false);
const showFilters = ref(false);
const historyPatient = ref(null);
const uploadTarget = ref(null);
const uploadProgress = ref(0);
const form = reactive({ name: '', age: 0, egfr: 0, protein: '阴性', history: '', followUp: '' });

function sampleTrend(base = 80) {
  return Array.from({ length: 6 }).map((_, idx) => ({
    date: `2024-0${Math.min(idx + 1, 9)}`,
    egfr: Math.max(20, Math.round(base - idx * 5 + (Math.random() * 6 - 3)))
  }));
}

const openAdd = () => {
  showModal.value = true;
};

const openHistory = (patient) => {
  historyPatient.value = patient;
};

const openUpload = (patient = { name: '批量导入' }) => {
  uploadTarget.value = patient;
  uploadProgress.value = 0;
};

const simulateUpload = () => {
  uploadProgress.value = Math.min(100, uploadProgress.value + 25);
  if (uploadProgress.value < 100) {
    setTimeout(simulateUpload, 400);
  }
};

const savePatient = () => {
  patients.push({
    id: patients.length + 1,
    name: form.name || '未命名',
    age: form.age || 50,
    egfr: form.egfr || 85,
    protein: form.protein,
    history: form.history || '无',
    followUp: form.followUp || '2024-06-10',
    trend: sampleTrend(form.egfr || 80)
  });
  showModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

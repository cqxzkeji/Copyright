<template>
  <section class="module">
    <header>
      <h2>智能审核与合规性检查</h2>
      <p>自动对照不同市场法规、品牌守则和行业敏感词库，提前暴露潜在风险。</p>
    </header>
    <div class="grid">
      <div class="panel">
        <h3>审核范围</h3>
        <label>
          内容版本
          <select v-model="version">
            <option>EMEA 社媒贴</option>
            <option>APAC 电邮模板</option>
            <option>LATAM 广告脚本</option>
          </select>
        </label>
        <label>
          附加说明
          <textarea v-model="notes" rows="3" placeholder="提供产品信息、法律条款等补充材料"></textarea>
        </label>
        <div class="btn-group">
          <button @click="runAudit">执行审核</button>
          <button class="secondary" @click="downloadReport">下载报告</button>
        </div>
      </div>
      <div class="panel checklist">
        <h3>合规清单</h3>
        <div v-for="item in checklist" :key="item.title" class="check-item" :class="{ passed: item.passed }">
          <span>{{ item.title }}</span>
          <small>{{ item.desc }}</small>
        </div>
      </div>
    </div>
    <ModalDialog v-model="auditVisible" title="审核结果">
      <p>本次扫描发现 {{ issues }} 项需整改：{{ highlights }}</p>
    </ModalDialog>
    <ModalDialog v-model="reportVisible" title="报告准备中">
      <div class="progress">
        <div class="progress-fill" :style="{ width: reportProgress + '%' }"></div>
      </div>
      <p>正在生成 PDF 合规报告，请稍候...</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const version = ref('EMEA 社媒贴');
const notes = ref('');
const auditVisible = ref(false);
const reportVisible = ref(false);
const reportProgress = ref(0);
const issues = ref(0);
const highlights = ref('');

const checklist = reactive([
  { title: '隐私条款', desc: 'GDPR/CCPA 自动比对', passed: true },
  { title: '品牌语气', desc: '与品牌守则一致性', passed: true },
  { title: '文化敏感词', desc: '检测 3827 条本地黑名单', passed: false },
  { title: '法律免责声明', desc: '是否覆盖监管要求', passed: false }
]);

const runAudit = () => {
  const pending = checklist.filter((item) => !item.passed);
  issues.value = pending.length;
  highlights.value = pending.map((item) => item.title).join('、');
  auditVisible.value = true;
};

const downloadReport = () => {
  reportVisible.value = true;
  reportProgress.value = 0;
  const timer = setInterval(() => {
    reportProgress.value += 20;
    if (reportProgress.value >= 100) {
      reportProgress.value = 100;
      clearInterval(timer);
    }
  }, 250);
};
</script>

<style scoped>
.module header {
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.panel {
  background: var(--panel);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

select,
textarea {
  border-radius: 16px;
  border: none;
  padding: 12px 16px;
  background: var(--panel-light);
  color: var(--text);
}

textarea {
  resize: none;
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

button {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  background: var(--accent);
  color: #0f172a;
  cursor: pointer;
  font-weight: 700;
}

button.secondary {
  background: transparent;
  color: var(--muted);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.check-item {
  padding: 16px;
  border-radius: 18px;
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid transparent;
}

.check-item.passed {
  border-color: rgba(34, 197, 94, 0.5);
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.3);
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #38bdf8, #0ea5e9);
  transition: width 0.3s ease;
}
</style>

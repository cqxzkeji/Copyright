<template>
  <div class="grid two">
    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">验证评估与报告发布</h2>
          <p>对齐实验数据，评估误差并生成可追溯报告。</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('align')">实验对齐</button>
          <button class="btn secondary" @click="openModal('error')">误差评估</button>
          <button class="btn secondary" @click="openModal('review')">评审流转</button>
          <button class="btn ghost" @click="openModal('export')">导出报告</button>
          <button class="btn ghost" @click="openModal('progress')">发布进度</button>
          <button class="btn ghost" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="chart">
        <svg viewBox="0 0 400 160" width="100%" height="100%">
          <rect x="30" y="30" width="140" height="100" fill="#e0ecff" />
          <rect x="200" y="50" width="170" height="80" fill="#bcd3ff" />
          <line x1="30" y1="130" x2="370" y2="130" stroke="#2f6fed" stroke-width="3" />
        </svg>
      </div>
    </section>

    <section class="card">
      <h3 class="section-title">验证评估记录</h3>
      <table class="table">
        <thead>
          <tr>
            <th>报告编号</th>
            <th>实验来源</th>
            <th>误差</th>
            <th>校准状态</th>
            <th>发布级别</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ report.id }}</td>
            <td>{{ report.source }}</td>
            <td>{{ report.error }}</td>
            <td>{{ report.calibration }}</td>
            <td><span class="badge">{{ report.level }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <BaseModal
    v-if="activeModal === 'align'"
    title="实验数据对齐"
    description="上传实验数据并选择对应仿真方案。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>实验编号<input type="text" placeholder="EXP-2024-18" /></label>
      <label>对齐方案<input type="text" placeholder="SIM-20241" /></label>
      <label>数据格式
        <select>
          <option>CSV</option>
          <option>Excel</option>
          <option>JSON</option>
        </select>
      </label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'error'"
    title="误差评估与校准"
    description="计算实验与仿真偏差并生成校准建议。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>误差指标
        <select>
          <option>均方误差</option>
          <option>最大偏差</option>
        </select>
      </label>
      <label>校准策略
        <select>
          <option>自动校准</option>
          <option>人工复核</option>
        </select>
      </label>
      <label>允许误差 (%)<input type="number" placeholder="5" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'review'"
    title="方案评审流转"
    description="提交评审并设置评审人员。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>评审人<input type="text" placeholder="张工, 李工" /></label>
      <label>评审截止<input type="date" /></label>
      <label>评审意见<textarea rows="3" placeholder="填写评审重点"></textarea></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'export'"
    title="导出报告"
    description="选择导出格式并生成可追溯报告。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>导出格式
        <select>
          <option>PDF</option>
          <option>Excel</option>
        </select>
      </label>
      <label>报告模板
        <select>
          <option>技术评估模板</option>
          <option>项目交付模板</option>
        </select>
      </label>
      <label>包含图表<input type="text" placeholder="性能曲线、误差分布" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'progress'"
    title="发布进度"
    description="结果审核与发布流程进度。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <div class="progress-section">
      <p>误差校准：85%</p>
      <div class="progress-bar"><span :style="{ width: '85%' }"></span></div>
      <p>报告发布：30%</p>
      <div class="progress-bar"><span :style="{ width: '30%' }"></span></div>
    </div>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'tip'"
    title="按钮提示信息"
    description="报告发布后支持追溯与可视化看板。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <p>提示：导出前请确认评审流程已完成。</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const activeModal = ref('')

const openModal = (name) => {
  activeModal.value = name
}

const closeModal = () => {
  activeModal.value = ''
}

const reports = Array.from({ length: 20 }, (_, index) => ({
  id: `REP-${String(index + 1).padStart(3, '0')}`,
  source: ['隔热实验', '强度测试', '热-力耦合'][index % 3],
  error: `${2 + (index % 5)}%`,
  calibration: index % 2 === 0 ? '已校准' : '待校准',
  level: index % 2 === 0 ? '发布' : '草稿'
}))
</script>

<style scoped>
.section-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header p {
  color: var(--muted);
  font-size: 13px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>

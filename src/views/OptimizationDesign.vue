<template>
  <div class="grid two">
    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">设计优化与配方推荐</h2>
          <p>多目标优化，平衡轻量化、强度与隔热性能。</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('objective')">多目标配置</button>
          <button class="btn secondary" @click="openModal('constraint')">约束条件</button>
          <button class="btn secondary" @click="openModal('recommend')">生成方案</button>
          <button class="btn ghost" @click="openModal('compare')">方案对比</button>
          <button class="btn ghost" @click="openModal('progress')">优化进度</button>
          <button class="btn ghost" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="chart">
        <svg viewBox="0 0 400 160" width="100%" height="100%">
          <polygon points="80,120 200,20 320,120" fill="#cfe1ff" />
          <polygon points="120,110 200,50 280,110" fill="#9db9ff" />
          <circle cx="200" cy="80" r="6" fill="#2f6fed" />
        </svg>
      </div>
    </section>

    <section class="card">
      <h3 class="section-title">候选配方推荐</h3>
      <table class="table">
        <thead>
          <tr>
            <th>方案编号</th>
            <th>目标</th>
            <th>成本 (￥/kg)</th>
            <th>隔热指数</th>
            <th>推荐等级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.id">
            <td>{{ plan.id }}</td>
            <td>{{ plan.target }}</td>
            <td>{{ plan.cost }}</td>
            <td>{{ plan.insulation }}</td>
            <td><span class="badge">{{ plan.rank }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <BaseModal
    v-if="activeModal === 'objective'"
    title="多目标配置"
    description="设置轻量化、强度与隔热的权重。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>轻量化权重<input type="number" placeholder="0.4" /></label>
      <label>强度权重<input type="number" placeholder="0.3" /></label>
      <label>隔热权重<input type="number" placeholder="0.3" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'constraint'"
    title="约束条件"
    description="定义成本、工艺窗口与可靠性要求。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>成本上限 (￥/kg)<input type="number" placeholder="480" /></label>
      <label>工艺温度范围 (℃)<input type="text" placeholder="120 ~ 180" /></label>
      <label>可靠性目标 (%)<input type="number" placeholder="95" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'recommend'"
    title="自动生成候选方案"
    description="根据当前目标与约束生成配方。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>生成数量<input type="number" placeholder="6" /></label>
      <label>优化算法
        <select>
          <option>NSGA-II</option>
          <option>粒子群</option>
        </select>
      </label>
      <label>随机种子<input type="number" placeholder="202406" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'compare'"
    title="方案对比"
    description="对比配方的关键指标与优势。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>对比指标
        <select>
          <option>强度-密度比</option>
          <option>隔热指数</option>
          <option>成本系数</option>
        </select>
      </label>
      <label>对比方案<input type="text" placeholder="OPT-01, OPT-03" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'progress'"
    title="优化进度"
    description="显示当前优化计算进度。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <div class="progress-section">
      <p>方案搜索：58%</p>
      <div class="progress-bar"><span :style="{ width: '58%' }"></span></div>
      <p>约束筛选：76%</p>
      <div class="progress-bar"><span :style="{ width: '76%' }"></span></div>
    </div>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'tip'"
    title="按钮提示信息"
    description="可将推荐方案同步至验证模块。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <p>提示：约束条件越精确，推荐方案越贴合工艺需求。</p>
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

const plans = Array.from({ length: 20 }, (_, index) => ({
  id: `OPT-${String(index + 1).padStart(2, '0')}`,
  target: ['隔热优先', '轻量化', '强度优先'][index % 3],
  cost: 320 + index * 8,
  insulation: `${88 + (index % 5)}%`,
  rank: index % 2 === 0 ? '推荐' : '备选'
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

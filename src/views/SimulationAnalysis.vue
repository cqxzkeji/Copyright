<template>
  <div class="grid two">
    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">性能仿真与等效计算</h2>
          <p>热导率、力学与多物理耦合仿真配置中心。</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('setup')">配置工况</button>
          <button class="btn secondary" @click="openModal('boundary')">边界条件库</button>
          <button class="btn secondary" @click="openModal('inverse')">等效参数反演</button>
          <button class="btn ghost" @click="openModal('sensitivity')">敏感性分析</button>
          <button class="btn ghost" @click="openModal('progress')">仿真进度</button>
          <button class="btn ghost" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="chart">
        <svg viewBox="0 0 400 160" width="100%" height="100%">
          <path d="M10 140 C60 80, 120 80, 170 40 C220 0, 280 20, 340 50" stroke="#2f6fed" stroke-width="3" fill="none" />
          <path d="M10 140 C80 120, 140 100, 200 90 C260 80, 320 70, 380 60" stroke="#5cc0b7" stroke-width="3" fill="none" />
        </svg>
      </div>
    </section>

    <section class="card">
      <h3 class="section-title">仿真任务列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>耦合类型</th>
            <th>工况</th>
            <th>等效热导率</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in simulations" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.condition }}</td>
            <td>{{ task.k }}</td>
            <td><span class="badge">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <BaseModal
    v-if="activeModal === 'setup'"
    title="配置仿真工况"
    description="定义热流、载荷与环境温度。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>温度范围 (℃)<input type="text" placeholder="-50 ~ 200" /></label>
      <label>热流密度 (W/m²)<input type="number" placeholder="420" /></label>
      <label>载荷模式
        <select>
          <option>单轴压缩</option>
          <option>剪切耦合</option>
          <option>热-力耦合</option>
        </select>
      </label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'boundary'"
    title="边界条件库"
    description="调用标准化边界条件并创建新模板。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>模板名称<input type="text" placeholder="高温隔热边界" /></label>
      <label>边界类型
        <select>
          <option>对流 + 辐射</option>
          <option>固定温度</option>
          <option>热通量指定</option>
        </select>
      </label>
      <label>备注<textarea rows="3" placeholder="适用工况"></textarea></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'inverse'"
    title="等效参数反演"
    description="根据仿真结果反推等效参数。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>目标参数
        <select>
          <option>热导率</option>
          <option>弹性模量</option>
          <option>强度</option>
        </select>
      </label>
      <label>拟合误差阈值 (%)<input type="number" placeholder="3" /></label>
      <label>迭代次数<input type="number" placeholder="50" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'sensitivity'"
    title="敏感性分析"
    description="评估关键材料参数对性能的影响。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>分析方法
        <select>
          <option>局部敏感性</option>
          <option>全局 Sobol</option>
        </select>
      </label>
      <label>关注指标
        <select>
          <option>热导率波动</option>
          <option>模量变化率</option>
        </select>
      </label>
      <label>采样数量<input type="number" placeholder="200" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'progress'"
    title="仿真进度"
    description="显示当前仿真求解进度。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <div class="progress-section">
      <p>热导率计算：62%</p>
      <div class="progress-bar"><span :style="{ width: '62%' }"></span></div>
      <p>力学响应：38%</p>
      <div class="progress-bar"><span :style="{ width: '38%' }"></span></div>
    </div>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'tip'"
    title="按钮提示信息"
    description="仿真完成后可在验证模块校准。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <p>提示：建议在仿真前同步最新的多尺度映射参数。</p>
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

const simulations = Array.from({ length: 22 }, (_, index) => ({
  id: `SIM-${2024}${index + 1}`,
  type: ['热-力耦合', '热传导', '力学响应'][index % 3],
  condition: ['高温隔热', '低温保温', '冲击载荷'][index % 3],
  k: `${0.02 + (index % 5) * 0.003} W/m·K`,
  status: index % 2 === 0 ? '已完成' : '求解中'
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

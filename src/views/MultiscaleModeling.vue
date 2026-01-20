<template>
  <div class="grid two">
    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">多尺度结构生成与表征映射</h2>
          <p>构建微观孔结构、纤维网络与代表体积单元。</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('micro')">生成微观结构</button>
          <button class="btn secondary" @click="openModal('rve')">RVE 构建</button>
          <button class="btn secondary" @click="openModal('mapping')">尺度映射</button>
          <button class="btn ghost" @click="openModal('feature')">表征提取</button>
          <button class="btn ghost" @click="openModal('progress')">队列进度</button>
          <button class="btn ghost" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="chart">
        <svg viewBox="0 0 400 160" width="100%" height="100%">
          <rect x="20" y="40" width="60" height="90" rx="8" fill="#dfe8ff" />
          <rect x="110" y="20" width="60" height="110" rx="8" fill="#c9d8ff" />
          <rect x="200" y="30" width="60" height="100" rx="8" fill="#b3c8ff" />
          <rect x="290" y="60" width="60" height="70" rx="8" fill="#9db9ff" />
          <line x1="0" y1="130" x2="400" y2="130" stroke="#5cc0b7" stroke-width="3" />
        </svg>
      </div>
    </section>

    <section class="card">
      <h3 class="section-title">结构生成任务列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>结构类型</th>
            <th>孔径均值</th>
            <th>纤维取向</th>
            <th>映射状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.pore }}</td>
            <td>{{ task.orientation }}</td>
            <td><span class="badge">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <BaseModal
    v-if="activeModal === 'micro'"
    title="生成微观孔结构"
    description="选择孔结构生成算法并配置统计参数。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>生成算法
        <select>
          <option>随机场生成</option>
          <option>Voronoi 分割</option>
          <option>相场模拟</option>
        </select>
      </label>
      <label>目标孔径 (nm)<input type="number" placeholder="80" /></label>
      <label>孔径方差<input type="number" placeholder="5" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'rve'"
    title="RVE 构建"
    description="设置代表体积单元的尺寸与边界条件。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>RVE 尺寸 (μm)<input type="number" placeholder="120" /></label>
      <label>纤维网络密度<input type="number" placeholder="0.35" /></label>
      <label>边界类型
        <select>
          <option>周期性</option>
          <option>固定边界</option>
        </select>
      </label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'mapping'"
    title="尺度映射"
    description="将微观特征映射至宏观等效参数。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>映射方法
        <select>
          <option>均匀化理论</option>
          <option>多重尺度系数</option>
          <option>机器学习回归</option>
        </select>
      </label>
      <label>输出参数
        <select>
          <option>热导率、弹性模量</option>
          <option>屈服强度、失效准则</option>
        </select>
      </label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'feature'"
    title="表征特征提取"
    description="提取孔结构、纤维分布与各向异性指标。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>图像来源<input type="text" placeholder="SEM_2024_06_18" /></label>
      <label>指标集
        <select>
          <option>孔径分布、连通性</option>
          <option>取向张量、分形维数</option>
        </select>
      </label>
      <label>报告格式
        <select>
          <option>JSON + CSV</option>
          <option>PDF 图谱</option>
        </select>
      </label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'progress'"
    title="结构生成队列"
    description="实时显示多尺度任务执行进度。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <div class="progress-section">
      <p>微观孔结构生成：70%</p>
      <div class="progress-bar"><span :style="{ width: '70%' }"></span></div>
      <p>RVE 构建：45%</p>
      <div class="progress-bar"><span :style="{ width: '45%' }"></span></div>
    </div>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'tip'"
    title="按钮提示信息"
    description="映射结果将同步到性能仿真模块。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <p>提示：请先完成微观结构生成，再进行尺度映射。</p>
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

const tasks = Array.from({ length: 21 }, (_, index) => ({
  id: `RVE-${String(index + 1).padStart(3, '0')}`,
  type: ['孔隙网络', '纤维束', '多孔复合'][index % 3],
  pore: `${60 + (index % 8) * 5} nm`,
  orientation: ['随机', '单向', '双向'][index % 3],
  status: index % 2 === 0 ? '已映射' : '生成中'
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

<template>
  <div class="grid two">
    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">材料库与组分建模</h2>
          <p>管理纤维类型、体积分数、气凝胶孔隙率与基体参数。</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('create')">新增材料</button>
          <button class="btn secondary" @click="openModal('batch')">批次管理</button>
          <button class="btn secondary" @click="openModal('template')">模板版本</button>
          <button class="btn ghost" @click="openModal('calibration')">参数校准</button>
          <button class="btn ghost" @click="openModal('progress')">入库进度</button>
          <button class="btn ghost" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="chart">
        <svg viewBox="0 0 400 160" width="100%" height="100%">
          <polyline
            fill="none"
            stroke="#2f6fed"
            stroke-width="3"
            points="10,120 60,90 110,100 160,60 210,70 260,40 310,60 360,30"
          />
          <circle v-for="(dot, index) in 8" :key="index" :cx="10 + index * 50" :cy="[120,90,100,60,70,40,60,30][index]" r="4" fill="#5cc0b7" />
        </svg>
      </div>
    </section>

    <section class="card">
      <h3 class="section-title">材料牌号与参数表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>牌号</th>
            <th>纤维类型</th>
            <th>体积分数</th>
            <th>孔隙率</th>
            <th>密度 (kg/m³)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in materials" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.fiber }}</td>
            <td>{{ item.fraction }}</td>
            <td>{{ item.porosity }}</td>
            <td>{{ item.density }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <BaseModal
    v-if="activeModal === 'create'"
    title="新增材料"
    description="录入纤维增强气凝胶材料参数并生成牌号。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>材料牌号<input type="text" placeholder="例如 FA-AG-230" /></label>
      <label>纤维类型
        <select>
          <option>碳纤维</option>
          <option>玻璃纤维</option>
          <option>芳纶纤维</option>
        </select>
      </label>
      <label>体积分数 (%)<input type="number" placeholder="0-60" /></label>
      <label>气凝胶孔隙率 (%)<input type="number" placeholder="70-95" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'batch'"
    title="材料批次管理"
    description="管理不同实验批次的来源与可追溯信息。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>批次编号<input type="text" placeholder="Batch-2024-06" /></label>
      <label>供应商<input type="text" placeholder="供应商名称" /></label>
      <label>入库日期<input type="date" /></label>
      <label>质检结论
        <select>
          <option>合格</option>
          <option>待复检</option>
          <option>不合格</option>
        </select>
      </label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'template'"
    title="参数模板与版本控制"
    description="保存常用配方模板，并进行版本对比。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>模板名称<input type="text" placeholder="隔热优先模板" /></label>
      <label>版本号<input type="text" placeholder="V2.3" /></label>
      <label>备注<textarea rows="3" placeholder="记录变更要点"></textarea></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'calibration'"
    title="参数校准"
    description="根据最新实验数据对材料参数进行校准。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <form>
      <label>校准来源<input type="text" placeholder="实验编号" /></label>
      <label>热导率修正 (%)<input type="number" placeholder="-5 到 5" /></label>
      <label>密度修正 (%)<input type="number" placeholder="-2 到 2" /></label>
    </form>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'progress'"
    title="入库进度追踪"
    description="当前材料库更新与审批流程进度。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <div class="progress-section">
      <p>材料入库审核：55%</p>
      <div class="progress-bar"><span :style="{ width: '55%' }"></span></div>
      <p>参数模板同步：80%</p>
      <div class="progress-bar"><span :style="{ width: '80%' }"></span></div>
    </div>
  </BaseModal>

  <BaseModal
    v-if="activeModal === 'tip'"
    title="按钮提示信息"
    description="所有操作均可回溯，执行前请确认参数准确。"
    @close="closeModal"
    @confirm="closeModal"
  >
    <p>提示：完成材料库更新后，需同步到多尺度结构生成模块。</p>
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

const materials = Array.from({ length: 22 }, (_, index) => ({
  code: `FA-AG-${200 + index}`,
  fiber: ['碳纤维', '玻璃纤维', '芳纶纤维'][index % 3],
  fraction: `${20 + (index % 5) * 5}%`,
  porosity: `${78 + (index % 6)}%`,
  density: 150 + index * 3,
  status: index % 2 === 0 ? '已验证' : '待评估'
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

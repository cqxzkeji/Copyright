<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h2>客户需求画像</h2>
        <div class="actions">
          <button class="btn" type="button" @click="openProfile">新增需求</button>
          <button class="btn primary" type="button" @click="openMatch">匹配规格</button>
          <button class="btn ghost" type="button" @click="openNotice">需求提醒</button>
        </div>
      </div>
      <div class="chart">
        <div class="bubble" v-for="item in demandOverview" :key="item.name">
          <div class="bubble-title">{{ item.name }}</div>
          <div class="bubble-value">{{ item.value }}%</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>客户定制需求清单</h2>
        <div class="tag">活跃客户 {{ demands.length }}</div>
      </div>
      <div class="table">
        <div class="table-row table-head">
          <span>客户</span>
          <span>行业</span>
          <span>需求材质</span>
          <span>强度指标</span>
          <span>交付周期</span>
          <span>匹配状态</span>
        </div>
        <div v-for="row in demands" :key="row.client" class="table-row">
          <span>{{ row.client }}</span>
          <span>{{ row.industry }}</span>
          <span>{{ row.material }}</span>
          <span>{{ row.strength }}</span>
          <span>{{ row.timeline }}</span>
          <span>{{ row.status }}</span>
        </div>
      </div>
    </section>

    <BaseModal
      :open="modal.profile"
      title="新增客户需求"
      primary-text="保存需求"
      @close="closeModals"
      @confirm="confirmProfile"
    >
      <label class="field">
        客户名称
        <input v-model="profileForm.client" type="text" placeholder="请输入客户名称" />
      </label>
      <label class="field">
        需求材质
        <input v-model="profileForm.material" type="text" placeholder="例如：20CrMnTi" />
      </label>
      <label class="field">
        应用场景
        <input v-model="profileForm.scene" type="text" placeholder="新能源汽车齿轮" />
      </label>
    </BaseModal>

    <BaseModal
      :open="modal.match"
      title="匹配进度"
      :show-footer="false"
      @close="closeModals"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div>正在匹配标准库：{{ progress }}%</div>
      <button class="btn primary" type="button" @click="finishMatch">完成匹配</button>
    </BaseModal>

    <BaseModal
      :open="modal.notice"
      title="需求提示"
      primary-text="收到"
      @close="closeModals"
      @confirm="closeModals"
    >
      <p>高强度齿轮钢需求本周上涨 18%。</p>
      <p>建议提前锁定 20CrMnTi 与 18CrNiMo7-6 产能。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const demandOverview = [
  { name: '汽车零部件', value: 34 },
  { name: '风电装备', value: 22 },
  { name: '工程机械', value: 18 },
  { name: '轨道交通', value: 16 },
  { name: '石化设备', value: 10 }
]

const demands = [
  { client: '天马齿轮', industry: '汽车', material: '20CrMnTi', strength: '≥ 900MPa', timeline: '30天', status: '已匹配' },
  { client: '海风动力', industry: '风电', material: '42CrMo', strength: '≥ 1050MPa', timeline: '45天', status: '推导中' },
  { client: '华北重机', industry: '工程机械', material: '35CrMo', strength: '≥ 980MPa', timeline: '25天', status: '已匹配' },
  { client: '东港造船', industry: '船舶', material: 'Q345D', strength: '≥ 470MPa', timeline: '60天', status: '推导中' },
  { client: '星云矿山', industry: '矿山', material: '30CrMnSi', strength: '≥ 1080MPa', timeline: '40天', status: '已匹配' },
  { client: '云帆机器人', industry: '智能装备', material: '40Cr', strength: '≥ 900MPa', timeline: '20天', status: '已匹配' },
  { client: '金海石化', industry: '石化', material: '15CrMo', strength: '≥ 880MPa', timeline: '50天', status: '推导中' },
  { client: '宏达工具', industry: '模具', material: 'H13', strength: '≥ 1200MPa', timeline: '35天', status: '已匹配' },
  { client: '远景风电', industry: '风电', material: '34CrNiMo6', strength: '≥ 1100MPa', timeline: '55天', status: '推导中' },
  { client: '晟宇轨道', industry: '轨道交通', material: '60Si2Mn', strength: '≥ 1050MPa', timeline: '30天', status: '已匹配' },
  { client: '南岭液压', industry: '液压', material: '20Cr', strength: '≥ 850MPa', timeline: '25天', status: '已匹配' },
  { client: '金穗农业', industry: '农业机械', material: '16MnCr5', strength: '≥ 900MPa', timeline: '40天', status: '推导中' },
  { client: '顺泽工具', industry: '模具', material: 'Cr12MoV', strength: '≥ 1280MPa', timeline: '28天', status: '已匹配' },
  { client: '天正冶金', industry: '冶金', material: '25Cr2MoV', strength: '≥ 980MPa', timeline: '45天', status: '推导中' },
  { client: '驰航汽车', industry: '汽车', material: '18CrNiMo7-6', strength: '≥ 1200MPa', timeline: '35天', status: '已匹配' },
  { client: '海晟结构', industry: '结构件', material: 'Q345B', strength: '≥ 450MPa', timeline: '50天', status: '已匹配' },
  { client: '瑞合电机', industry: '电机', material: '50CrVA', strength: '≥ 1050MPa', timeline: '33天', status: '推导中' },
  { client: '华信轴承', industry: '轴承', material: 'GCr15', strength: '≥ 1250MPa', timeline: '22天', status: '已匹配' },
  { client: '东盟船机', industry: '船舶', material: '17CrNiMo6', strength: '≥ 1120MPa', timeline: '50天', status: '推导中' },
  { client: '群峰机械', industry: '工程机械', material: '38CrMoAl', strength: '≥ 1020MPa', timeline: '30天', status: '已匹配' },
  { client: '科锐能源', industry: '能源', material: '20MnSi', strength: '≥ 760MPa', timeline: '45天', status: '推导中' },
  { client: '星凯装备', industry: '装备制造', material: '30Cr2Ni4MoV', strength: '≥ 1150MPa', timeline: '40天', status: '已匹配' }
]

const modal = reactive({
  profile: false,
  match: false,
  notice: false
})

const profileForm = reactive({
  client: '',
  material: '',
  scene: ''
})

const progress = ref(38)
let timer

const openProfile = () => {
  modal.profile = true
}

const openMatch = () => {
  modal.match = true
  progress.value = 38
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 12, 100)
    if (progress.value === 100) {
      clearInterval(timer)
    }
  }, 380)
}

const openNotice = () => {
  modal.notice = true
}

const closeModals = () => {
  modal.profile = false
  modal.match = false
  modal.notice = false
}

const confirmProfile = () => {
  closeModals()
}

const finishMatch = () => {
  progress.value = 100
}
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.panel {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(148, 163, 184, 0.16);
  display: grid;
  gap: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  cursor: pointer;
}

.btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.btn.ghost {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.bubble {
  background: #eff6ff;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.bubble-title {
  font-size: 13px;
  color: #64748b;
}

.bubble-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 8px;
}

.table {
  display: grid;
  gap: 8px;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
}

.table-head {
  background: #e2e8f0;
  font-weight: 600;
}

.tag {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  background: #f8fafc;
}

.progress {
  width: 100%;
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  transition: width 0.3s ease;
}
</style>

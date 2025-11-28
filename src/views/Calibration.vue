<template>
  <div class="panel-grid">
    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">零点校准</p>
          <h3>力矩/相机对位</h3>
        </div>
        <div class="chip">偏差 mm</div>
      </header>
      <p class="muted">使用标准靶标和负载标定块完成一键零点校准，支持保存到当前工艺配置。</p>
      <div class="grid">
        <div class="stat" v-for="item in offsets" :key="item.label">
          <p class="label">{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <small>{{ item.desc }}</small>
        </div>
      </div>
      <div class="buttons">
        <button @click="openProgress('执行零点校准', 42)">启动校准</button>
        <button class="ghost" @click="showSave = true">保存结果</button>
        <button class="ghost" @click="showForm = true">自定义标定</button>
      </div>
    </div>

    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">末端配置</p>
          <h3>工具/安全区</h3>
        </div>
        <div class="chip ghost">模板管理</div>
      </header>
      <table class="data-table">
        <thead>
          <tr><th>工具名</th><th>重量(kg)</th><th>TCP(mm)</th><th>安全区</th><th>启用</th></tr>
        </thead>
        <tbody>
          <tr v-for="tool in tools" :key="tool.name">
            <td>{{ tool.name }}</td>
            <td>{{ tool.weight }}</td>
            <td>{{ tool.tcp }}</td>
            <td>{{ tool.zone }}</td>
            <td>
              <label class="switch">
                <input type="checkbox" :checked="tool.enabled" @change="toggle(tool)" />
                <span></span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog :show="showSave" title="保存到配置" primary-text="写入" @close="showSave = false" @confirm="confirmSave">
    <p>将当前标定结果写入工艺 <strong>{{ profile }}</strong>，后续任务将继承此配置。</p>
  </ModalDialog>

  <ModalDialog :show="showForm" title="自定义标定方案" primary-text="生成脚本" @close="showForm = false" @confirm="confirmCustom">
    <form class="form">
      <label>靶标型号<input v-model="customForm.target" placeholder="如：APRIL-36h11" /></label>
      <label>采样点位<input v-model.number="customForm.points" type="number" min="3" /></label>
      <label>容差(mm)<input v-model.number="customForm.tolerance" type="number" step="0.1" /></label>
    </form>
  </ModalDialog>

  <ModalDialog :show="progress.show" :title="progress.title" :show-footer="false" @close="progress.show = false">
    <p class="muted">正在写入控制器参数…</p>
    <div class="progress"><div class="progress__bar" :style="{ width: progress.value + '%' }"></div></div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const offsets = [
  { label: '关节零点', value: '±0.08', desc: '机器人本体' },
  { label: '力矩基准', value: '±0.04', desc: '肘关节外力' },
  { label: '相机位姿', value: '±0.12', desc: '外参偏差' }
]

const tools = reactive([
  { name: '夹爪-轻量', weight: '2.1', tcp: '0,0,155', zone: '0.4', enabled: true },
  { name: '焊枪-长颈', weight: '3.8', tcp: '12,0,210', zone: '0.3', enabled: true },
  { name: '打磨-柔性', weight: '2.9', tcp: '-6,0,180', zone: '0.5', enabled: false },
  { name: '喷涂-雾化', weight: '3.2', tcp: '5,0,240', zone: '0.6', enabled: false },
  { name: '视觉-双目', weight: '1.7', tcp: '0,0,120', zone: '0.4', enabled: true }
])

const profile = ref('装配-线体A')
const showSave = ref(false)
const showForm = ref(false)
const progress = reactive({ show: false, title: '执行中', value: 0 })
const customForm = reactive({ target: 'APRIL-36h11', points: 5, tolerance: 0.2 })

const toggle = (tool) => {
  tool.enabled = !tool.enabled
}

const openProgress = (title, value) => {
  progress.title = title
  progress.value = value
  progress.show = true
  setTimeout(() => (progress.value = 100), 500)
}

const confirmSave = () => {
  showSave.value = false
  openProgress('写入配置成功', 68)
}

const confirmCustom = () => {
  showForm.value = false
  openProgress('生成标定脚本', 54)
}
</script>

<style scoped>
.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.eyebrow { color: var(--primary); font-weight: 700; letter-spacing: 0.06em; }

.chip { padding: 6px 10px; border-radius: 10px; background: #eaf7ff; color: #2d9cdb; font-weight: 700; }

.chip.ghost { background: #f1f4f9; color: #4a5568; }

.muted { color: var(--muted); }

.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.stat { background: #f9fbff; border: 1px solid var(--border); border-radius: 12px; padding: 10px; }
.stat .label { color: var(--muted); }

.buttons { display: flex; flex-wrap: wrap; gap: 10px; }
.buttons button { flex: 1; border: none; border-radius: 12px; padding: 10px 12px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, var(--primary), var(--primary-strong)); color: #fff; }
.buttons .ghost { background: #eef2f7; color: #1b2a3c; border: 1px solid var(--border); }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { border-bottom: 1px solid var(--border); padding: 10px 8px; text-align: left; }
.data-table tbody tr:hover { background: #f9fbff; }

.switch { position: relative; display: inline-block; width: 46px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.switch span { position: absolute; cursor: pointer; inset: 0; background: #dfe5ec; border-radius: 24px; transition: .3s; }
.switch span:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 3px; background: white; transition: .3s; border-radius: 50%; }
.switch input:checked + span { background: linear-gradient(135deg, var(--primary), var(--success)); }
.switch input:checked + span:before { transform: translateX(20px); }

.form { display: flex; flex-direction: column; gap: 10px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #1b2a3c; }
.form input { border: 1px solid var(--border); border-radius: 10px; padding: 10px; }

.progress { height: 12px; border-radius: 12px; background: #eef2f7; overflow: hidden; }
.progress__bar { height: 100%; background: linear-gradient(135deg, var(--primary), var(--success)); transition: width 0.6s ease; }
</style>

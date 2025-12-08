<template>
  <div class="module">
    <header class="section-title"><span class="icon">🧰</span>工具使用</header>

    <div class="responsive-grid">
      <div class="info-card" v-for="tool in tools" :key="tool.name">
        <strong>{{ tool.name }}</strong>
        <p>{{ tool.desc }}</p>
        <div class="progress-track"><div class="progress-bar" :style="{ width: tool.health + '%' }"></div></div>
        <small>保养指数：{{ tool.health }}%</small>
      </div>
    </div>

    <div class="table-card">
      <header class="table-header">
        <h3>工具借用与保养记录</h3>
        <div class="actions">
          <button class="primary-button" @click="openModal('maintain')">开始检修</button>
          <button class="secondary-button" @click="openModal('request')">申请工具</button>
          <button class="secondary-button" @click="openModal('plan')">查看保养计划</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>工具</th>
            <th>用途</th>
            <th>责任人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in logs" :key="item.date + item.tool">
            <td>{{ item.date }}</td>
            <td>{{ item.tool }}</td>
            <td>{{ item.usage }}</td>
            <td>{{ item.owner }}</td>
            <td><span class="chip">{{ item.state }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'maintain'" title="工具检修" @close="closeModal">
      <div class="form-grid">
        <label>工具<select v-model="form.tool">
          <option v-for="tool in tools" :key="tool.name">{{ tool.name }}</option>
        </select></label>
        <label>检修人<input v-model="form.person" placeholder="填写姓名" /></label>
        <label>检修描述<textarea v-model="form.notes" rows="3"></textarea></label>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'request'" title="工具申请" @close="closeModal" @confirm="submitRequest">
      <div class="form-grid">
        <label>工具<select v-model="form.tool">
          <option v-for="tool in tools" :key="tool.name">{{ tool.name }}</option>
        </select></label>
        <label>使用时长<input v-model="form.duration" placeholder="如 2 小时" /></label>
        <label>用途说明<textarea v-model="form.notes" rows="3"></textarea></label>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'plan'" title="保养计划" @close="closeModal" :showFooter="false">
      <ul>
        <li>每周对吊装工具进行外观磨损检查，记录刮痕与裂纹。</li>
        <li>每两周为破碎锤补充润滑脂并校正冲击频率。</li>
        <li>砂轮切割机每日收工后需清理切割粉尘，检查磨片。</li>
        <li>电锤、高压水枪每月进行绝缘阻值测试。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tools = [
  { name: '吊装钢丝绳', desc: '用于吊运主峰石块与横联石。', health: 92 },
  { name: '破碎锤', desc: '调整石材边角与锁扣面。', health: 78 },
  { name: '水平仪', desc: '控制石材基座水平度。', health: 95 },
  { name: '角磨机', desc: '修整缝隙与切割辅助面。', health: 80 },
  { name: '灌浆泵', desc: '用于灌浆稳固与防水处理。', health: 88 },
  { name: '安全吊带', desc: '高空作业配套安全用品。', health: 90 }
];

const logs = [
  { date: '05-01', tool: '吊装钢丝绳', usage: '主峰吊装', owner: '张越', state: '完好' },
  { date: '05-02', tool: '破碎锤', usage: '面层修整', owner: '马晨', state: '调试' },
  { date: '05-03', tool: '水平仪', usage: '基座找平', owner: '吴静', state: '完好' },
  { date: '05-04', tool: '角磨机', usage: '切割修边', owner: '陆青', state: '完好' },
  { date: '05-05', tool: '灌浆泵', usage: '缝隙灌浆', owner: '陈鹏', state: '保养中' },
  { date: '05-06', tool: '安全吊带', usage: '登高防护', owner: '丁雯', state: '完好' },
  { date: '05-07', tool: '吊装钢丝绳', usage: '侧峰吊装', owner: '张越', state: '完好' },
  { date: '05-08', tool: '破碎锤', usage: '落差修凿', owner: '马晨', state: '完好' },
  { date: '05-09', tool: '角磨机', usage: '喷泉口打磨', owner: '陆青', state: '调试' },
  { date: '05-10', tool: '灌浆泵', usage: '导水石加固', owner: '陈鹏', state: '完好' }
];

const activeModal = ref('');
const form = ref({ tool: tools[0].name, person: '', notes: '', duration: '' });

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const submitRequest = () => {
  alert(`申请成功：${form.value.tool}，时长 ${form.value.duration || '未填写'}`);
  closeModal();
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
</style>

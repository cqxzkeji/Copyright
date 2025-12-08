<template>
  <div class="module">
    <header class="section-title"><span class="icon">🪨</span>假山叠石工艺展示</header>
    <div class="responsive-grid">
      <div class="info-card">
        <strong>工序全景</strong>
        <p>按水源勘测、基坑处理、石材堆叠、植被点缀四步展示虚拟流程。</p>
        <div class="progress-track"><div class="progress-bar" :style="{ width: '75%' }"></div></div>
        <div class="tag-row">
          <span class="chip">水流引导</span>
          <span class="chip">稳固基座</span>
          <span class="chip">主峰构型</span>
          <span class="chip">缝隙绿植</span>
        </div>
      </div>
      <div class="info-card">
        <strong>三维剖面</strong>
        <svg viewBox="0 0 260 120" class="chart">
          <polyline :points="polylinePoints" fill="#bfdbfe" stroke="#3b82f6" stroke-width="3" />
          <circle v-for="(point, index) in contour" :key="index" :cx="point.x" :cy="point.y" r="5" fill="#22c55e" />
        </svg>
        <small>曲线展示主峰及辅峰在剖面中的高程关系。</small>
      </div>
    </div>

    <div class="table-card">
      <header class="table-header">
        <h3>石材堆叠细节</h3>
        <div class="actions">
          <button class="primary-button" @click="openModal('animation')">播放工艺动画</button>
          <button class="secondary-button" @click="openModal('safety')">安全提示</button>
          <button class="secondary-button" @click="openModal('record')">提交观察记录</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>步骤</th>
            <th>重点石块</th>
            <th>重量</th>
            <th>连接工艺</th>
            <th>稳固评分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rockRows" :key="row.step">
            <td>{{ row.step }}</td>
            <td>{{ row.block }}</td>
            <td>{{ row.weight }}kg</td>
            <td>{{ row.technique }}</td>
            <td>
              <div class="progress-track"><div class="progress-bar" :style="{ width: row.score + '%' }"></div></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'animation'" title="工艺动画播放" @close="closeModal" :showFooter="false">
      <p>虚拟动画正按照 1:1 尺寸展示石材吊装、旋转和拼缝填砂过程。</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: animationProgress + '%' }"></div></div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'safety'" title="安全提示" @close="closeModal">
      <ul>
        <li>吊装区域需设置 5 米警戒线并张贴醒目标识。</li>
        <li>转运前检查吊带与钢扣磨损程度，确保无裂纹。</li>
        <li>堆叠角度超 60° 时必须使用隐形拉筋加固。</li>
        <li>夜间作业打开防眩光灯并佩戴反光背心。</li>
      </ul>
    </BaseModal>

    <BaseModal v-if="activeModal === 'record'" title="观察记录" @close="closeModal" @confirm="submitRecord">
      <div class="form-grid">
        <label>观察人<input v-model="record.observer" placeholder="填写姓名" /></label>
        <label>节点选择
          <select v-model="record.node">
            <option>基座夯实</option>
            <option>主峰吊装</option>
            <option>侧峰缝合</option>
            <option>水线调试</option>
          </select>
        </label>
        <label>稳定度评价<input v-model.number="record.score" type="number" min="60" max="100" /></label>
        <label>备注<textarea v-model="record.notes" rows="3"></textarea></label>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const animationProgress = ref(0);
const record = ref({ observer: '', node: '基座夯实', score: 90, notes: '' });
const rockRows = [
  { step: '勘测', block: '青石定位块', weight: 320, technique: '水平基准测量', score: 82 },
  { step: '基座', block: '底托石', weight: 540, technique: '夯实与垫砂', score: 88 },
  { step: '主峰', block: '龙门石', weight: 610, technique: '吊装+钢筋拉结', score: 92 },
  { step: '辅峰', block: '屏风石', weight: 410, technique: '燕尾榫插接', score: 86 },
  { step: '连体', block: '横联石', weight: 280, technique: '拉筋锚固', score: 80 },
  { step: '水线', block: '导水石', weight: 190, technique: '嵌缝防水', score: 84 },
  { step: '洞口', block: '叠洞石', weight: 260, technique: '错缝排布', score: 83 },
  { step: '点缀', block: '苔藓铺石', weight: 120, technique: '透水层铺设', score: 79 },
  { step: '收尾', block: '压顶石', weight: 350, technique: '砂浆填缝', score: 90 },
  { step: '验收', block: '封口石', weight: 200, technique: '震动压实', score: 87 }
];

const contour = [
  { x: 20, y: 90 },
  { x: 60, y: 70 },
  { x: 110, y: 40 },
  { x: 150, y: 55 },
  { x: 190, y: 30 },
  { x: 230, y: 45 }
];

const polylinePoints = computed(() => contour.map((p) => `${p.x},${p.y}`).join(' '));

const openModal = (type) => {
  activeModal.value = type;
  if (type === 'animation') {
    animationProgress.value = 0;
    const timer = setInterval(() => {
      animationProgress.value = Math.min(animationProgress.value + 20, 100);
      if (animationProgress.value === 100) {
        clearInterval(timer);
      }
    }, 500);
  }
};

const closeModal = () => {
  activeModal.value = '';
};

const submitRecord = () => {
  alert(`观察记录提交成功：${record.value.observer} @ ${record.value.node}`);
  closeModal();
};

onMounted(() => {
  animationProgress.value = 75;
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart {
  width: 100%;
  height: 120px;
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

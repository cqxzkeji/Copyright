<template>
  <section class="module">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <h3 class="section-title">SAR 关键结论</h3>
        <p class="module-desc">当前结构-活性关系模型已覆盖 128 组结构变体。</p>
        <div class="badge">高相关性区域 5 处</div>
      </div>
      <div class="card">
        <h3 class="section-title">结构变化路径</h3>
        <img :src="sarImage" alt="结构-活性示意图" />
      </div>
      <div class="card">
        <h3 class="section-title">分析操作</h3>
        <div class="button-group">
          <button class="btn" @click="openAnalysisModal">执行 SAR 分析</button>
          <button class="btn secondary" @click="openFormModal">录入结构变体</button>
          <button class="btn ghost" @click="openTipModal">相关性说明</button>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1.2fr 1fr; margin-top: 24px;">
      <div class="card">
        <h3 class="section-title">结构-活性热区</h3>
        <div class="heatmap">
          <div v-for="cell in heatmap" :key="cell.label" class="heatmap-row">
            <span>{{ cell.label }}</span>
            <div class="heatbar">
              <div class="heat" :style="{ width: cell.value + '%' }"></div>
            </div>
            <strong>{{ cell.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">结构优化建议</h3>
        <ul class="notes">
          <li>在 C3 位引入羟基可提升 15% 活性。</li>
          <li>缩短侧链长度可降低非特异性结合。</li>
          <li>保持芳香环平面性有助于增强靶点亲和力。</li>
        </ul>
      </div>
    </div>

    <div class="card" style="margin-top: 24px;">
      <h3 class="section-title">SAR 结构变体列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>变体结构</th>
            <th>关键修改</th>
            <th>活性变化</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variant in variants" :key="variant.id">
            <td>{{ variant.id }}</td>
            <td>{{ variant.structure }}</td>
            <td>{{ variant.change }}</td>
            <td>{{ variant.activity }}</td>
            <td>{{ variant.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showAnalysisModal" title="SAR 分析进度" @close="showAnalysisModal = false">
      <p>正在计算结构变化对活性的影响矩阵，请稍候。</p>
      <div class="progress" style="margin: 16px 0;">
        <div class="progress-bar" :style="{ width: analysisProgress + '%' }"></div>
      </div>
      <p>当前进度：{{ analysisProgress }}%</p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="completeAnalysis">输出分析报告</button>
      </div>
    </BaseModal>

    <BaseModal :show="showFormModal" title="录入结构变体" @close="showFormModal = false">
      <form class="form-grid" @submit.prevent="submitVariant">
        <label class="form-field">
          变体名称
          <input v-model="form.name" required placeholder="如：V-07" />
        </label>
        <label class="form-field">
          关键修改
          <input v-model="form.change" required placeholder="如：C3 位羟基" />
        </label>
        <label class="form-field">
          活性变化
          <select v-model="form.activity">
            <option>提升</option>
            <option>下降</option>
            <option>不变</option>
          </select>
        </label>
        <label class="form-field">
          备注
          <textarea v-model="form.note" rows="3" placeholder="补充实验结果"></textarea>
        </label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button class="btn secondary" type="button" @click="showFormModal = false">取消</button>
          <button class="btn" type="submit">保存变体</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showTipModal" title="SAR 相关性说明" @close="showTipModal = false">
      <p>
        相关性值由结构变化幅度与活性变化共同决定，数值越高表示结构调整对活性影响越显著。
      </p>
      <p>
        建议结合分子模拟模块验证关键位点的相互作用。
      </p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="showTipModal = false">明白了</button>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const sarImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200" fill="none">
      <rect width="360" height="200" rx="20" fill="#F2F6FF"/>
      <path d="M70 140C100 110 140 90 180 90C230 90 270 120 300 150" stroke="#2F5BFF" stroke-width="6" stroke-linecap="round"/>
      <circle cx="70" cy="140" r="10" fill="#2F5BFF"/>
      <circle cx="180" cy="90" r="10" fill="#54B8FF"/>
      <circle cx="300" cy="150" r="10" fill="#2F5BFF"/>
    </svg>`
  );

const variants = ref([
  { id: 1, structure: 'V-01', change: 'C3 羟基', activity: '提升 15%', note: '亲水性增强' },
  { id: 2, structure: 'V-02', change: '侧链缩短', activity: '提升 8%', note: '减少柔性' },
  { id: 3, structure: 'V-03', change: '芳香环扩展', activity: '提升 12%', note: '增强堆叠' },
  { id: 4, structure: 'V-04', change: '引入氟', activity: '下降 3%', note: '降低溶解度' },
  { id: 5, structure: 'V-05', change: 'C7 甲基', activity: '不变', note: '影响较小' },
  { id: 6, structure: 'V-06', change: '酰胺改酯', activity: '下降 9%', note: '氢键减少' },
  { id: 7, structure: 'V-07', change: '引入氮杂环', activity: '提升 10%', note: '增加结合' },
  { id: 8, structure: 'V-08', change: '双键还原', activity: '下降 6%', note: '构象变化' },
  { id: 9, structure: 'V-09', change: '羟基甲氧基化', activity: '下降 4%', note: '极性降低' },
  { id: 10, structure: 'V-10', change: '侧链拉长', activity: '下降 11%', note: '位阻增加' },
  { id: 11, structure: 'V-11', change: '吡啶替换', activity: '提升 6%', note: 'pKa 调整' },
  { id: 12, structure: 'V-12', change: '羧基消失', activity: '下降 14%', note: '结合减弱' },
  { id: 13, structure: 'V-13', change: '磺酰胺', activity: '提升 9%', note: '氢键增强' },
  { id: 14, structure: 'V-14', change: '三氟甲基', activity: '提升 5%', note: '疏水增强' },
  { id: 15, structure: 'V-15', change: '引入腈基', activity: '提升 7%', note: '电子效应' },
  { id: 16, structure: 'V-16', change: '芳环替换', activity: '下降 2%', note: '匹配下降' },
  { id: 17, structure: 'V-17', change: '双环结构', activity: '提升 13%', note: '刚性提高' },
  { id: 18, structure: 'V-18', change: '酯改酰胺', activity: '提升 11%', note: '稳定性提高' },
  { id: 19, structure: 'V-19', change: '增加氢键供体', activity: '提升 4%', note: '结合增强' },
  { id: 20, structure: 'V-20', change: '极性基团减少', activity: '下降 8%', note: '溶解度降低' }
]);

const heatmap = [
  { label: 'C3 羟基', value: 78 },
  { label: '侧链长度', value: 65 },
  { label: '芳香性', value: 72 },
  { label: '极性基团', value: 58 },
  { label: '构象刚性', value: 69 }
];

const showAnalysisModal = ref(false);
const showFormModal = ref(false);
const showTipModal = ref(false);
const analysisProgress = ref(0);

const form = ref({
  name: '',
  change: '',
  activity: '提升',
  note: ''
});

const openAnalysisModal = () => {
  showAnalysisModal.value = true;
  analysisProgress.value = 0;
};

const openFormModal = () => {
  showFormModal.value = true;
};

const openTipModal = () => {
  showTipModal.value = true;
};

const completeAnalysis = () => {
  analysisProgress.value = 100;
};

const submitVariant = () => {
  showFormModal.value = false;
};

onMounted(() => {
  const interval = setInterval(() => {
    if (!showAnalysisModal.value) return;
    if (analysisProgress.value < 92) {
      analysisProgress.value += 4;
    }
  }, 480);
  return () => clearInterval(interval);
});
</script>

<style scoped>
.module-desc {
  color: #5f6c8a;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.heatmap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.heatmap-row {
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  gap: 12px;
  align-items: center;
  font-size: 14px;
}

.heatbar {
  background: #eef3ff;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.heat {
  height: 100%;
  background: linear-gradient(90deg, #2f5bff, #54b8ff);
}

.notes {
  margin: 0;
  padding-left: 20px;
  color: #5f6c8a;
  line-height: 1.8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}
</style>

<template>
  <section class="module">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <h3 class="section-title">官能团识别概况</h3>
        <p class="module-desc">
          系统共识别 <strong>{{ functionalGroups.length }}</strong> 个分子片段，涵盖羟基、胺基、羧基等典型官能团。
        </p>
        <div class="badge">识别准确率 96.8%</div>
      </div>
      <div class="card">
        <h3 class="section-title">结构示意图</h3>
        <img :src="groupImage" alt="官能团结构图" />
      </div>
      <div class="card">
        <h3 class="section-title">模块操作</h3>
        <div class="button-group">
          <button class="btn" @click="openIdentifyModal">启动识别</button>
          <button class="btn secondary" @click="openFormModal">新增官能团</button>
          <button class="btn ghost" @click="openTipModal">属性说明</button>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1.1fr 1fr; margin-top: 24px;">
      <div class="card">
        <h3 class="section-title">官能团分布图</h3>
        <div class="chart">
          <div v-for="item in chartData" :key="item.name" class="chart-row">
            <span>{{ item.name }}</span>
            <div class="chart-bar">
              <div class="chart-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">分析备注</h3>
        <ul class="notes">
          <li>羟基与胺基在样本中出现频率最高，适合开展亲水性优化实验。</li>
          <li>硫醚类官能团在活性分子中较少，可作为稀有特征进行标记。</li>
          <li>点击“启动识别”将进行批量结构扫描并生成进度报告。</li>
        </ul>
      </div>
    </div>

    <div class="card" style="margin-top: 24px;">
      <h3 class="section-title">官能团属性列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>官能团</th>
            <th>特征峰 (cm⁻¹)</th>
            <th>极性等级</th>
            <th>常见药效贡献</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in functionalGroups" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.peak }}</td>
            <td>{{ item.polarity }}</td>
            <td>{{ item.effect }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showIdentifyModal" title="官能团识别进度" @close="showIdentifyModal = false">
      <p>系统正在扫描输入的分子结构并标注官能团位置。</p>
      <div class="progress" style="margin: 16px 0;">
        <div class="progress-bar" :style="{ width: identifyProgress + '%' }"></div>
      </div>
      <p>当前进度：{{ identifyProgress }}%</p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="finishIdentify">完成并生成报告</button>
      </div>
    </BaseModal>

    <BaseModal :show="showFormModal" title="新增官能团记录" @close="showFormModal = false">
      <form class="form-grid" @submit.prevent="submitForm">
        <label class="form-field">
          官能团名称
          <input v-model="form.name" required placeholder="如：磺酰胺" />
        </label>
        <label class="form-field">
          特征峰 (cm⁻¹)
          <input v-model="form.peak" required placeholder="如：1340" />
        </label>
        <label class="form-field">
          极性等级
          <select v-model="form.polarity">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label class="form-field">
          备注说明
          <textarea v-model="form.note" rows="3" placeholder="记录识别来源或用途"></textarea>
        </label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button class="btn secondary" type="button" @click="showFormModal = false">取消</button>
          <button class="btn" type="submit">保存记录</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showTipModal" title="官能团属性说明" @close="showTipModal = false">
      <p>
        官能团极性等级依据共振、诱导效应和氢键能力综合评估，极性越高意味着潜在溶解度越强。
      </p>
      <p>
        结合“结构-活性关系”模块可以进一步验证官能团变化对药效的影响。
      </p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="showTipModal = false">了解</button>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const groupImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200" fill="none">
      <rect width="360" height="200" rx="20" fill="#F2F6FF"/>
      <path d="M60 120L120 80L180 120L240 80L300 120" stroke="#2F5BFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="60" cy="120" r="10" fill="#2F5BFF"/>
      <circle cx="120" cy="80" r="10" fill="#54B8FF"/>
      <circle cx="180" cy="120" r="10" fill="#2F5BFF"/>
      <circle cx="240" cy="80" r="10" fill="#54B8FF"/>
      <circle cx="300" cy="120" r="10" fill="#2F5BFF"/>
    </svg>`
  );

const functionalGroups = ref([
  { id: 1, name: '羟基', peak: '3200-3600', polarity: '高', effect: '提升亲水性' },
  { id: 2, name: '胺基', peak: '3300-3500', polarity: '高', effect: '增强碱性' },
  { id: 3, name: '羧基', peak: '1700-1725', polarity: '高', effect: '提升酸性' },
  { id: 4, name: '醚基', peak: '1050-1150', polarity: '中', effect: '改善代谢' },
  { id: 5, name: '酮基', peak: '1710-1750', polarity: '中', effect: '提升稳定性' },
  { id: 6, name: '酯基', peak: '1735-1750', polarity: '中', effect: '调节脂溶性' },
  { id: 7, name: '硝基', peak: '1510-1560', polarity: '中', effect: '增强电子吸收' },
  { id: 8, name: '氯代基', peak: '600-800', polarity: '低', effect: '增加疏水性' },
  { id: 9, name: '溴代基', peak: '500-650', polarity: '低', effect: '延长作用时间' },
  { id: 10, name: '碘代基', peak: '500-600', polarity: '低', effect: '增强结合' },
  { id: 11, name: '硫醚', peak: '700-750', polarity: '中', effect: '提高穿透性' },
  { id: 12, name: '磺酰胺', peak: '1310-1340', polarity: '高', effect: '提高选择性' },
  { id: 13, name: '酰胺', peak: '1640-1690', polarity: '高', effect: '稳定氢键' },
  { id: 14, name: '烯烃', peak: '1640-1680', polarity: '低', effect: '提供共轭' },
  { id: 15, name: '炔烃', peak: '2100-2260', polarity: '低', effect: '增强硬度' },
  { id: 16, name: '芳香环', peak: '1450-1600', polarity: '低', effect: '增强疏水性' },
  { id: 17, name: '吡啶环', peak: '1580-1610', polarity: '中', effect: '提高结合力' },
  { id: 18, name: '磷酸基', peak: '1040-1100', polarity: '高', effect: '提高亲水性' },
  { id: 19, name: '硼酸基', peak: '1330-1350', polarity: '中', effect: '提升亲核性' },
  { id: 20, name: '腈基', peak: '2210-2260', polarity: '中', effect: '提高代谢稳定性' }
]);

const chartData = [
  { name: '羟基', value: 24 },
  { name: '胺基', value: 20 },
  { name: '羧基', value: 18 },
  { name: '酰胺', value: 15 },
  { name: '卤代基', value: 12 },
  { name: '其他', value: 11 }
];

const showIdentifyModal = ref(false);
const showFormModal = ref(false);
const showTipModal = ref(false);
const identifyProgress = ref(0);

const form = ref({
  name: '',
  peak: '',
  polarity: '高',
  note: ''
});

const openIdentifyModal = () => {
  showIdentifyModal.value = true;
  identifyProgress.value = 0;
};

const openFormModal = () => {
  showFormModal.value = true;
};

const openTipModal = () => {
  showTipModal.value = true;
};

const finishIdentify = () => {
  identifyProgress.value = 100;
};

const submitForm = () => {
  showFormModal.value = false;
};

onMounted(() => {
  const interval = setInterval(() => {
    if (!showIdentifyModal.value) return;
    if (identifyProgress.value < 90) {
      identifyProgress.value += 5;
    }
  }, 500);
  return () => clearInterval(interval);
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
}

.module-desc {
  color: #5f6c8a;
  line-height: 1.6;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.chart-bar {
  background: #eef3ff;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.chart-fill {
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

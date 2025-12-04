<template>
  <div class="page">
    <div class="flex-between">
      <div>
        <p class="muted">AI 亲和力匹配</p>
        <h2 class="section-title">智能匹配</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="runMatching">重新匹配</button>
        <button class="secondary" @click="showUpload = true">上传序列</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="data-card" v-for="item in highlights" :key="item.label">
        <p class="muted">{{ item.label }}</p>
        <h3>{{ item.value }}</h3>
        <p class="muted">{{ item.desc }}</p>
      </div>
    </div>

    <h3 class="section-title">匹配结果</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>匹配ID</th>
            <th>种质A</th>
            <th>种质B</th>
            <th>亲和评分</th>
            <th>联合优势</th>
            <th>推荐用途</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in matches" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.a }}</td>
            <td>{{ row.b }}</td>
            <td><span class="badge">{{ row.score }}</span></td>
            <td>{{ row.trait }}</td>
            <td>{{ row.usage }}</td>
            <td class="actions">
              <button class="primary" @click="viewPlan(row)">生成计划</button>
              <button class="secondary" @click="showToastMsg('已锁定并推送到繁育模块')">推送</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showUpload" title="上传序列">
      <p>上传测序 FASTQ/VCF 文件，系统自动比对并生成 SNP 矩阵。</p>
      <div class="actions">
        <button class="primary" @click="showToastMsg('文件校验通过，已放入匹配队列')">开始上传</button>
        <button class="secondary" @click="showUpload = false">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showPlan" title="匹配组合规划">
      <p>匹配对：{{ activeMatch?.a }} × {{ activeMatch?.b }}</p>
      <p>亲和评分：{{ activeMatch?.score }}，优势：{{ activeMatch?.trait }}</p>
      <div class="actions">
        <button class="success" @click="showToastMsg('已生成田间试验设计表')">生成试验</button>
        <button class="secondary" @click="showPlan = false">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="匹配计算">
      <p>正在运行AI亲和力模型与基因位点共显性筛选。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showToast" title="提示">
      <p>{{ toastMessage }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const highlights = [
  { label: '优质匹配', value: '18 对', desc: '满足目标亲和力和3个优势性状' },
  { label: '待验证组合', value: '9 对', desc: '等待田间实验复核' },
  { label: '基因标记覆盖', value: '96.3%', desc: '关键位点已被标记' },
  { label: '推荐更新', value: '3 个', desc: '算法更新增加覆盖度' }
];

const matches = ref([
  { id: 'M-01', a: '高产1号', b: '丰优9号', score: 95, trait: '高产+强秆', usage: '主栽推广' },
  { id: 'M-02', a: '抗病5号', b: '润田2号', score: 92, trait: '抗病+稳产', usage: '病害重灾区' },
  { id: 'M-03', a: '抗旱7号', b: '北斗6号', score: 88, trait: '抗旱+抗寒', usage: '干旱寒冷地区' },
  { id: 'M-04', a: '皓穗10号', b: '星河7号', score: 87, trait: '早熟+强秆', usage: '双季稻衔接' },
  { id: 'M-05', a: '晨露8号', b: '江南11号', score: 90, trait: '优质口感', usage: '高端市场' },
  { id: 'M-06', a: '金谷3号', b: '高产1号', score: 89, trait: '高产+耐肥', usage: '高肥力田' },
  { id: 'M-07', a: '早熟8号', b: '丰禾4号', score: 86, trait: '早熟+抗旱', usage: '应急补种' },
  { id: 'M-08', a: '丰优9号', b: '江南11号', score: 85, trait: '稳产+抗倒伏', usage: '长江流域' },
  { id: 'M-09', a: '抗旱7号', b: '晨露8号', score: 83, trait: '抗旱+高口感', usage: '高温干旱' },
  { id: 'M-10', a: '高产1号', b: '皓穗10号', score: 84, trait: '高产+抗病', usage: '黄淮海' }
]);

const showUpload = ref(false);
const showPlan = ref(false);
const showProgress = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const activeMatch = ref(null);
const progress = ref(0);

const runMatching = () => {
  showProgress.value = true;
  progress.value = 15;
  const timer = setInterval(() => {
    progress.value += 30;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      showToastMsg('匹配完成，已更新亲和力列表');
    }
  }, 400);
};

const viewPlan = (row) => {
  activeMatch.value = row;
  showPlan.value = true;
};

const showToastMsg = (text) => {
  toastMessage.value = text;
  showToast.value = true;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress {
  background: #e5e7eb;
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  height: 100%;
  transition: width 0.3s ease;
}
</style>

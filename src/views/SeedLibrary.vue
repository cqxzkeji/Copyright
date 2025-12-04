<template>
  <div class="page">
    <div class="flex-between">
      <div>
        <p class="muted">基因资源全链路管理</p>
        <h2 class="section-title">基因库管理</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="showAdd = true">新增种质</button>
        <button class="secondary" @click="showImport = true">批量导入</button>
        <button class="success" @click="showExport = true">导出样本</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="data-card" v-for="summary in summaries" :key="summary.label">
        <p class="muted">{{ summary.label }}</p>
        <h3>{{ summary.value }}</h3>
        <p class="muted">{{ summary.desc }}</p>
      </div>
    </div>

    <h3 class="section-title">库存明细</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>品系</th>
            <th>地区</th>
            <th>抗性</th>
            <th>含水率</th>
            <th>库存</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in seeds" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.region }}</td>
            <td><span class="badge">{{ item.resistance }}</span></td>
            <td>{{ item.moisture }}%</td>
            <td>{{ item.stock }}袋</td>
            <td class="actions">
              <button class="secondary" @click="openInfo(item)">详情</button>
              <button class="primary" @click="openQuality(item)">质检</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showAdd" title="新增种质样本">
      <form class="modal-form" @submit.prevent="submitAdd">
        <label>品系名称<input v-model="form.name" required /></label>
        <label>采集地区<input v-model="form.region" required /></label>
        <label>抗性等级<select v-model="form.resistance"><option>抗旱</option><option>抗病</option><option>高产</option></select></label>
        <label>入库数量<input type="number" v-model.number="form.stock" min="1" required /></label>
        <div class="actions">
          <button class="primary" type="submit">提交</button>
          <button class="secondary" type="button" @click="showAdd = false">取消</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showImport" title="批量导入">
      <p>选择Excel或CSV文件，系统将自动校验字段与重复数据。</p>
      <div class="actions">
        <button class="primary" @click="simulateProgress('导入')">开始导入</button>
        <button class="secondary" @click="showImport = false">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showExport" title="导出基因库数据">
      <p>导出将包含品系编号、抗性标注与批次历史。</p>
      <div class="actions">
        <button class="success" @click="simulateProgress('导出')">立即导出</button>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showInfo" title="样本详情">
      <p>品系：{{ activeSeed?.name }}</p>
      <p>来源：{{ activeSeed?.region }} ｜ 抗性：{{ activeSeed?.resistance }}</p>
      <p>库存：{{ activeSeed?.stock }} 袋；含水率：{{ activeSeed?.moisture }}%</p>
    </ModalDialog>

    <ModalDialog v-model="showQuality" title="质检记录">
      <p>自动生成质检流程，检测水分、芽率与病害特征。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: qualityProgress + '%' }"></div>
      </div>
      <div class="actions">
        <button class="primary" @click="startQuality">开始质检</button>
        <button class="secondary" @click="showQuality = false">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showToast" :title="toastTitle">
      <p>{{ toastMessage }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const seeds = ref([
  { id: 'G-101', name: '高产1号', region: '黑龙江', resistance: '抗寒', moisture: 12.1, stock: 32 },
  { id: 'G-102', name: '润田2号', region: '吉林', resistance: '抗病', moisture: 11.5, stock: 25 },
  { id: 'G-103', name: '金谷3号', region: '河南', resistance: '高产', moisture: 10.9, stock: 48 },
  { id: 'G-104', name: '丰禾4号', region: '四川', resistance: '抗旱', moisture: 10.8, stock: 19 },
  { id: 'G-105', name: '东风5号', region: '辽宁', resistance: '抗病', moisture: 12.4, stock: 40 },
  { id: 'G-106', name: '北斗6号', region: '内蒙古', resistance: '抗寒', moisture: 9.8, stock: 18 },
  { id: 'G-107', name: '星河7号', region: '河北', resistance: '耐盐碱', moisture: 11.2, stock: 33 },
  { id: 'G-108', name: '晨露8号', region: '山东', resistance: '高产', moisture: 10.7, stock: 21 },
  { id: 'G-109', name: '丰优9号', region: '江苏', resistance: '抗涝', moisture: 11.9, stock: 30 },
  { id: 'G-110', name: '皓穗10号', region: '陕西', resistance: '抗病', moisture: 12.0, stock: 27 },
  { id: 'G-111', name: '江南11号', region: '浙江', resistance: '早熟', moisture: 10.5, stock: 29 }
]);

const summaries = [
  { label: '在库品系', value: '142', desc: '覆盖8大生态区、36个批次' },
  { label: '最新入库', value: '7 个', desc: '本周新采集的高抗样本' },
  { label: '质检合格率', value: '98.2%', desc: '近30天无异常波动' },
  { label: '优选可用', value: '116', desc: '可直接参与配对与繁育' }
];

const showAdd = ref(false);
const showImport = ref(false);
const showExport = ref(false);
const showInfo = ref(false);
const showQuality = ref(false);
const showToast = ref(false);
const toastTitle = ref('提醒');
const toastMessage = ref('');
const activeSeed = ref(null);
const qualityProgress = ref(22);
const form = reactive({ name: '', region: '', resistance: '抗旱', stock: 10 });

const submitAdd = () => {
  seeds.value.unshift({
    id: `G-${Math.floor(Math.random() * 900 + 120)}`,
    name: form.name,
    region: form.region,
    resistance: form.resistance,
    moisture: 11,
    stock: form.stock
  });
  showAdd.value = false;
  showToast.value = true;
  toastTitle.value = '新增成功';
  toastMessage.value = `${form.name} 已入库，自动加入质检计划。`;
};

const simulateProgress = (action) => {
  showToast.value = true;
  toastTitle.value = `${action}中`;
  toastMessage.value = `${action}任务正在后台执行，请勿关闭窗口。`;
};

const openInfo = (item) => {
  activeSeed.value = item;
  showInfo.value = true;
};

const openQuality = (item) => {
  activeSeed.value = item;
  showQuality.value = true;
  qualityProgress.value = 30;
};

const startQuality = () => {
  qualityProgress.value = 30;
  const timer = setInterval(() => {
    qualityProgress.value += 20;
    if (qualityProgress.value >= 100) {
      clearInterval(timer);
      toastTitle.value = '质检完成';
      toastMessage.value = `${activeSeed.value?.name} 质检通过，已同步报告。`;
      showToast.value = true;
    }
  }, 500);
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form input, .modal-form select {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.progress {
  background: #e5e7eb;
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #34d399, #22c55e);
  height: 100%;
  transition: width 0.3s ease;
}
</style>

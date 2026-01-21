<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>全链路数据接入概况</h3>
      <p>覆盖供应商、生产、物流、库存的结构化数据模型。</p>
      <div class="chart">
        <div v-for="(item, index) in barData" :key="index" class="chart-bar" :style="{ height: item + '%' }" />
      </div>
      <div class="flex">
        <button @click="openModal('source')">新增数据源</button>
        <button class="secondary" @click="openModal('build')">生成结构模型</button>
        <button class="ghost" @click="openModal('export')">导出建模报告</button>
      </div>
    </div>
    <div class="card">
      <h3>数据清洗与标准化</h3>
      <p>对接入数据执行标签映射、异常修正与字段统一。</p>
      <div class="grid grid-3">
        <div class="card">
          <h4>字段一致性</h4>
          <h2>98.2%</h2>
        </div>
        <div class="card">
          <h4>异常值清除</h4>
          <h2>1,242</h2>
        </div>
        <div class="card">
          <h4>主数据完整度</h4>
          <h2>95.7%</h2>
        </div>
      </div>
      <div class="flex">
        <button class="secondary" @click="openModal('quality')">质量校验计划</button>
        <button class="ghost" @click="openModal('mapping')">字段映射说明</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <h3>供应链链路建模列表</h3>
    <table class="table">
      <thead>
        <tr>
          <th>节点编号</th>
          <th>类型</th>
          <th>所属区域</th>
          <th>数据同步频率</th>
          <th>关键度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.region }}</td>
          <td>{{ item.sync }}</td>
          <td><span class="tag">{{ item.level }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'source'" title="新增数据源" @close="closeModal">
    <div class="form-field">
      <label>数据源名称</label>
      <input placeholder="例如：华南供应商ERP" />
    </div>
    <div class="form-field">
      <label>接入类型</label>
      <select>
        <option>API实时接入</option>
        <option>批量文件上传</option>
        <option>数据库直连</option>
      </select>
    </div>
    <div class="form-field">
      <label>负责人</label>
      <input placeholder="张涵 / 李楠" />
    </div>
    <button @click="closeModal">提交接入申请</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'build'" title="结构模型生成进度" @close="closeModal">
    <p>正在对供应商-生产-物流-库存链路进行拓扑计算。</p>
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p>当前进度：{{ progress }}%</p>
    <button class="secondary" @click="closeModal">后台继续运行</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'export'" title="导出建模报告" @close="closeModal">
    <p>报告将包含节点结构、依赖关系、数据质量评估。</p>
    <div class="form-field">
      <label>导出格式</label>
      <select>
        <option>PDF</option>
        <option>Excel</option>
        <option>PowerPoint</option>
      </select>
    </div>
    <button @click="closeModal">确认导出</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'quality'" title="质量校验计划" @close="closeModal">
    <p>计划在今晚23:00执行全链路质量复核。</p>
    <div class="form-field">
      <label>通知人</label>
      <input placeholder="邮箱或手机号" />
    </div>
    <button @click="closeModal">保存计划</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'mapping'" title="字段映射说明" @close="closeModal">
    <ul>
      <li>供应商编码 ⇢ Supplier_ID</li>
      <li>生产批次 ⇢ Batch_No</li>
      <li>运输里程 ⇢ Logistics_KM</li>
      <li>库存周转天数 ⇢ Inventory_Days</li>
    </ul>
    <button class="secondary" @click="closeModal">已了解</button>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseModal from "../components/BaseModal.vue";

const barData = [40, 55, 72, 64, 80, 68, 92, 75, 60, 88];
const tableData = [
  { id: "SC-001", type: "供应商", region: "华东", sync: "15分钟", level: "核心" },
  { id: "SC-002", type: "供应商", region: "华南", sync: "30分钟", level: "关键" },
  { id: "SC-003", type: "生产", region: "华北", sync: "10分钟", level: "核心" },
  { id: "SC-004", type: "物流", region: "华东", sync: "30分钟", level: "关键" },
  { id: "SC-005", type: "库存", region: "华中", sync: "60分钟", level: "一般" },
  { id: "SC-006", type: "供应商", region: "华西", sync: "15分钟", level: "关键" },
  { id: "SC-007", type: "生产", region: "华南", sync: "10分钟", level: "核心" },
  { id: "SC-008", type: "物流", region: "华北", sync: "20分钟", level: "关键" },
  { id: "SC-009", type: "库存", region: "华东", sync: "45分钟", level: "一般" },
  { id: "SC-010", type: "供应商", region: "华北", sync: "30分钟", level: "关键" },
  { id: "SC-011", type: "生产", region: "华中", sync: "12分钟", level: "核心" },
  { id: "SC-012", type: "物流", region: "华南", sync: "25分钟", level: "一般" },
  { id: "SC-013", type: "库存", region: "华西", sync: "60分钟", level: "一般" },
  { id: "SC-014", type: "供应商", region: "华东", sync: "20分钟", level: "关键" },
  { id: "SC-015", type: "生产", region: "华北", sync: "15分钟", level: "核心" },
  { id: "SC-016", type: "物流", region: "华中", sync: "20分钟", level: "关键" },
  { id: "SC-017", type: "库存", region: "华南", sync: "30分钟", level: "一般" },
  { id: "SC-018", type: "供应商", region: "华西", sync: "20分钟", level: "关键" },
  { id: "SC-019", type: "生产", region: "华东", sync: "10分钟", level: "核心" },
  { id: "SC-020", type: "物流", region: "华北", sync: "25分钟", level: "关键" },
  { id: "SC-021", type: "库存", region: "华中", sync: "40分钟", level: "一般" },
  { id: "SC-022", type: "供应商", region: "华南", sync: "35分钟", level: "关键" }
];

const activeModal = ref("");
const progress = ref(0);
let timer;

const openModal = (name) => {
  activeModal.value = name;
  if (name === "build") {
    progress.value = 12;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 12, 100);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 400);
  }
};

const closeModal = () => {
  activeModal.value = "";
  clearInterval(timer);
};

onMounted(() => {
  progress.value = 0;
});
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="section-title">智能分析与决策支持概览</div>
      <div class="grid grid-3">
        <div class="card">
          <div class="section-title">分析算法</div>
          <p>已部署模型：{{ summary.models }}</p>
          <p>算法类型：{{ summary.algorithms }}</p>
        </div>
        <div class="card">
          <div class="section-title">预测与优化</div>
          <p>预测任务：{{ summary.forecasts }}</p>
          <p>优化策略：{{ summary.optimizations }}</p>
        </div>
        <div class="card">
          <div class="section-title">决策支持</div>
          <p>决策建议：{{ summary.decisions }}</p>
          <p>已采纳：{{ summary.adopted }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">模型命中率趋势</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: item.value + '%' }"
          :title="item.value + '%'"
        ></div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));">
        <div v-for="item in chartData" :key="item.label" class="chart-label">{{ item.label }}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">分析操作</div>
      <div class="actions">
        <button class="btn" type="button" @click="openModal('train')">启动模型训练</button>
        <button class="btn btn-secondary" type="button" @click="openModal('predict')">生成预测报告</button>
        <button class="btn" type="button" @click="openModal('optimize')">执行优化策略</button>
        <button class="btn btn-secondary" type="button" @click="openModal('decision')">更新决策支持</button>
        <button class="btn" type="button" @click="openModal('tip')">分析提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">分析任务列表（20条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>算法</th>
            <th>准确率</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.algorithm }}</td>
            <td>{{ task.accuracy }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'train'" class="form-grid">
        <label class="form-field">
          模型名称
          <input v-model="form.model" type="text" placeholder="例如：风险识别模型" />
        </label>
        <label class="form-field">
          训练周期
          <input v-model="form.period" type="text" placeholder="例如：3小时" />
        </label>
      </div>
      <div v-else-if="modal.type === 'predict'">
        <p>预测报告将包含趋势、风险与资源优化建议。</p>
        <div class="progress" style="margin-top: 12px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
      <div v-else-if="modal.type === 'optimize'" class="form-grid">
        <label class="form-field">
          优化目标
          <select v-model="form.optimizeTarget">
            <option>响应时延</option>
            <option>能耗</option>
            <option>成本</option>
          </select>
        </label>
        <label class="form-field">
          影响范围
          <input v-model="form.scope" type="text" placeholder="例如：全网节点" />
        </label>
      </div>
      <div v-else-if="modal.type === 'decision'" class="form-grid">
        <label class="form-field">
          决策主题
          <input v-model="form.decisionTopic" type="text" placeholder="例如：重点区域布控" />
        </label>
        <label class="form-field">
          采纳策略
          <textarea v-model="form.decisionNote" rows="3" placeholder="填写策略建议"></textarea>
        </label>
      </div>
      <div v-else>
        <p>提示：模型训练建议在夜间执行，以确保资源稳定。</p>
      </div>
      <template #actions>
        <button class="btn btn-secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const summary = reactive({
  models: 8,
  algorithms: "聚类、预测、异常检测",
  forecasts: 5,
  optimizations: 4,
  decisions: 12,
  adopted: 9
});

const chartData = [
  { label: "周一", value: 65 },
  { label: "周二", value: 70 },
  { label: "周三", value: 68 },
  { label: "周四", value: 78 },
  { label: "周五", value: 82 },
  { label: "周六", value: 76 },
  { label: "周日", value: 85 }
];

const tasks = Array.from({ length: 20 }, (_, index) => ({
  id: `ANA-${String(index + 1).padStart(3, "0")}`,
  algorithm: ["预测模型", "异常检测", "知识图谱"][index % 3],
  accuracy: `${88 + (index % 5)}%`,
  owner: ["赵星", "梁宇", "宋彤"][index % 3],
  status: index % 3 === 0 ? "运行中" : index % 3 === 1 ? "待审核" : "已完成"
}));

const modal = reactive({
  open: false,
  type: "",
  title: ""
});

const progress = ref(74);

const form = reactive({
  model: "",
  period: "",
  optimizeTarget: "响应时延",
  scope: "",
  decisionTopic: "",
  decisionNote: ""
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  modal.title =
    type === "train"
      ? "启动模型训练"
      : type === "predict"
      ? "生成预测报告"
      : type === "optimize"
      ? "执行优化策略"
      : type === "decision"
      ? "更新决策支持"
      : "分析提示";
};

const closeModal = () => {
  modal.open = false;
};

const submitModal = () => {
  progress.value = Math.min(100, progress.value + 10);
  closeModal();
};
</script>

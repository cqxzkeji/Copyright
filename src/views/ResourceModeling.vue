<template>
  <section class="resource-modeling">
    <div class="card header">
      <div>
        <div class="badge">非遗资源采集与数字建模</div>
        <h2>多类型文化资源数字化建档</h2>
        <p>三维扫描、影像采集与模型重建一体化管理。</p>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openModal('scan')">三维扫描录入</button>
        <button class="ghost-btn" @click="openModal('capture')">影像采集任务</button>
        <button class="ghost-btn" @click="openModal('rebuild')">模型重建</button>
        <button class="ghost-btn" @click="openModal('archive')">数字归档</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">资源采集清单</div>
      <div class="resource-grid">
        <div v-for="item in resources" :key="item.name" class="resource-card">
          <div class="resource-title">{{ item.name }}</div>
          <p>{{ item.detail }}</p>
          <div class="resource-meta">
            <span class="badge">{{ item.type }}</span>
            <span>{{ item.status }}</span>
          </div>
          <button class="ghost-btn" @click="openResource(item)">编辑档案</button>
        </div>
      </div>
    </div>

    <div class="card workflow">
      <div>
        <div class="section-title">采集流程跟踪</div>
        <p>实时更新建模流程节点，确保数据一致性。</p>
      </div>
      <div class="workflow-steps">
        <div v-for="step in steps" :key="step" class="workflow-step">{{ step }}</div>
      </div>
      <button class="primary-btn" @click="openModal('progress')">同步进度</button>
    </div>

    <BaseModal
      v-if="activeModal"
      :title="activeModalTitle"
      @close="closeModal"
      @confirm="closeModal"
    >
      <template v-if="activeModal === 'scan'">
        <label>
          采集对象
          <input class="input" placeholder="如：竹编器具、木雕构件" />
        </label>
        <label>
          扫描精度
          <select class="input">
            <option>0.1mm 高精度</option>
            <option>0.5mm 标准</option>
            <option>1mm 快速</option>
          </select>
        </label>
        <p>提交后将生成扫描任务并同步到设备端。</p>
      </template>
      <template v-else-if="activeModal === 'capture'">
        <label>
          拍摄场景
          <input class="input" placeholder="填写拍摄地点" />
        </label>
        <label>
          影像清晰度
          <select class="input">
            <option>8K 全景</option>
            <option>4K 高清</option>
            <option>2K 标清</option>
          </select>
        </label>
        <p>将生成影像采集日程并安排设备。</p>
      </template>
      <template v-else-if="activeModal === 'rebuild'">
        <label>
          重建算法
          <select class="input">
            <option>结构光融合</option>
            <option>多视角纹理融合</option>
            <option>AI 自动补洞</option>
          </select>
        </label>
        <label>
          细节优化
          <input class="input" placeholder="例如：纹理增强、法线重采样" />
        </label>
        <p>系统将自动生成模型重建计划。</p>
      </template>
      <template v-else-if="activeModal === 'archive'">
        <label>
          档案编号
          <input class="input" placeholder="系统自动生成或手动输入" />
        </label>
        <label>
          权限设置
          <select class="input">
            <option>公开展示</option>
            <option>内部教学</option>
            <option>专家审核</option>
          </select>
        </label>
        <p>数字档案将同步至资源管理中心。</p>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>正在同步本周采集任务与建模进度。</p>
        <div class="progress-track">
          <div class="progress-value" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>完成度：{{ progress }}%</p>
      </template>
      <template v-else-if="activeModal === 'resource'">
        <p>正在编辑：{{ selectedResource?.name }}</p>
        <label>
          资料补充
          <input class="input" placeholder="填写补充说明" />
        </label>
        <label>
          审核状态
          <select class="input">
            <option>待审核</option>
            <option>已确认</option>
            <option>需补拍</option>
          </select>
        </label>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const resources = [
  { name: "苏绣针法样本", detail: "高密度线迹采样与纹理捕捉。", type: "手工艺", status: "已归档" },
  { name: "苗族银饰模具", detail: "记录锻造与雕刻纹样细节。", type: "器物", status: "采集中" },
  { name: "徽州砖雕构件", detail: "光照扫描与结构重建。", type: "建筑", status: "待审核" },
  { name: "景泰蓝工艺", detail: "分步骤采集工艺流程影像。", type: "工艺", status: "建模中" }
];

const steps = ["现场勘测", "设备校准", "影像采集", "三维重建", "纹理烘焙", "入库归档"];

const activeModal = ref("");
const progress = ref(30);
const selectedResource = ref(null);
let timer;

const openModal = (type) => {
  activeModal.value = type;
  if (type === "progress") {
    progress.value = 30;
    timer = window.setInterval(() => {
      progress.value = Math.min(progress.value + 10, 100);
    }, 500);
  }
};

const openResource = (resource) => {
  selectedResource.value = resource;
  activeModal.value = "resource";
};

const closeModal = () => {
  activeModal.value = "";
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
};

const activeModalTitle = computed(() => {
  const map = {
    scan: "三维扫描录入",
    capture: "影像采集任务",
    rebuild: "模型重建设置",
    archive: "数字档案归档",
    progress: "采集进度",
    resource: "资源档案编辑"
  };
  return map[activeModal.value] || "资源管理";
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.resource-modeling {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: grid;
  gap: 16px;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.resource-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  display: grid;
  gap: 8px;
}

.resource-title {
  font-weight: 600;
}

.resource-meta {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 8px;
}

.workflow {
  display: grid;
  gap: 16px;
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.workflow-step {
  background: #f1f5f9;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  text-align: center;
}
</style>

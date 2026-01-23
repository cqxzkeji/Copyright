<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title">归档策略</div>
      <div class="archive-rules">
        <div class="rule-item">按单位工程 > 分部工程 > 分项工程分层归档</div>
        <div class="rule-item">验收规范自动校验资料完整性</div>
        <div class="rule-item">支持多条件组合检索与调阅</div>
      </div>
      <div class="archive-actions">
        <button class="btn" @click="openModal('自动归档资料', 'auto')">自动归档</button>
        <button class="btn secondary" @click="openModal('设置检索条件', 'search')">条件检索</button>
        <button class="btn light" @click="openModal('归档进度', 'progress')">归档进度</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">快速检索</div>
      <div class="form-grid">
        <label>
          项目名称
          <input placeholder="请输入项目关键字" />
        </label>
        <label>
          分部工程
          <input placeholder="例如：机电分部" />
        </label>
        <label>
          归档时间
          <input type="date" />
        </label>
      </div>
      <button class="btn" @click="openModal('检索结果确认', 'search')">执行检索</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <div class="section-title">归档资料清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>档案编号</th>
          <th>项目/分部</th>
          <th>资料类型</th>
          <th>归档人</th>
          <th>归档时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in archives" :key="item.code">
          <td>{{ item.code }}</td>
          <td>{{ item.project }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.date }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td class="actions">
            <button class="btn light" @click="openModal('查看归档详情', 'detail', item)">详情</button>
            <button class="btn" @click="openModal('下载归档文件', 'download', item)">下载</button>
            <button class="btn secondary" @click="openModal('归档调阅记录', 'log', item)">调阅</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <AppModal :open="modalOpen" :title="modalTitle" @close="modalOpen = false" @confirm="modalOpen = false">
    <template v-if="modalType === 'progress'">
      <div class="notice">归档完成率 88%，待归档资料 32 份。</div>
      <div class="progress-track">
        <div class="progress-value" style="width: 88%"></div>
      </div>
    </template>
    <template v-else-if="modalType === 'log'">
      <div class="notice">{{ activeItem?.project }} 近 7 天调阅 12 次。</div>
    </template>
    <template v-else-if="modalType === 'download'">
      <div class="notice">已准备 {{ activeItem?.type }} 归档文件，可选择格式：</div>
      <div class="form-row">
        <label><input type="radio" checked /> PDF</label>
        <label><input type="radio" /> Excel</label>
      </div>
    </template>
    <template v-else>
      <div class="form-grid">
        <label>
          档案编号
          <input :value="activeItem?.code || ''" placeholder="请输入档案编号" />
        </label>
        <label>
          项目名称
          <input :value="activeItem?.project || ''" placeholder="请输入项目名称" />
        </label>
        <label>
          资料类型
          <input :value="activeItem?.type || ''" placeholder="验收表/检验批" />
        </label>
        <label>
          归档备注
          <input placeholder="请输入备注" />
        </label>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalOpen = ref(false);
const modalTitle = ref("");
const modalType = ref("auto");
const activeItem = ref(null);

const archives = Array.from({ length: 20 }, (_, index) => ({
  code: `DA-${String(index + 1).padStart(3, "0")}`,
  project: index % 2 === 0 ? "智慧综合体 2 号楼/机电" : "智慧综合体 5 号楼/土建",
  type: index % 3 === 0 ? "隐蔽验收" : "检验批",
  owner: index % 2 === 0 ? "周工" : "陈工",
  date: `2024-08-${String((index % 28) + 1).padStart(2, "0")}`,
  status: index % 4 === 0 ? "可调阅" : "已归档"
}));

const openModal = (title, type, item = null) => {
  modalTitle.value = title;
  modalType.value = type;
  activeItem.value = item;
  modalOpen.value = true;
};
</script>

<style scoped>
.archive-rules {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #475569;
}

.rule-item {
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 10px;
}

.archive-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 18px;
  align-items: center;
}
</style>

<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title">资料采集方式</div>
      <div class="method-list">
        <div class="method-item">
          <div class="badge">表单填报</div>
          <p>在线填写检验批、隐蔽工程与材料报验表单。</p>
        </div>
        <div class="method-item">
          <div class="badge">附件上传</div>
          <p>支持 PDF、CAD、图片附件上传并自动归档。</p>
        </div>
        <div class="method-item">
          <div class="badge">扫描导入</div>
          <p>扫描件自动识别编号，生成电子化档案。</p>
        </div>
      </div>
      <div class="collection-actions">
        <button class="btn" @click="openModal('在线填写验收表单', 'form')">在线填报</button>
        <button class="btn secondary" @click="openModal('上传扫描件', 'upload')">上传扫描件</button>
        <button class="btn light" @click="openModal('资料完整性校验', 'check')">批量校验</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">采集进度</div>
      <div class="progress-track" style="margin-bottom: 12px">
        <div class="progress-value" style="width: 78%"></div>
      </div>
      <div class="notice">已采集 156 份验收资料，待上传 45 份。</div>
      <button class="btn" @click="openModal('资料采集进度详情', 'progress')">查看进度</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <div class="section-title">资料采集明细</div>
    <table class="table">
      <thead>
        <tr>
          <th>资料编号</th>
          <th>资料类型</th>
          <th>关联分项</th>
          <th>采集人</th>
          <th>采集时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in documents" :key="item.code">
          <td>{{ item.code }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.section }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.date }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td class="actions">
            <button class="btn light" @click="openModal('查看资料详情', 'detail', item)">详情</button>
            <button class="btn" @click="openModal('补传附件', 'upload', item)">补传</button>
            <button class="btn secondary" @click="openModal('发送资料提醒', 'notify', item)">提醒</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <AppModal :open="modalOpen" :title="modalTitle" @close="modalOpen = false" @confirm="modalOpen = false">
    <template v-if="modalType === 'progress'">
      <div class="notice">本周新增资料 28 份，自动归档成功率 96%。</div>
      <div class="progress-track">
        <div class="progress-value" style="width: 78%"></div>
      </div>
    </template>
    <template v-else-if="modalType === 'notify'">
      <div class="notice">已向 {{ activeItem?.owner }} 发送补传提醒，预计 24 小时内补齐。</div>
    </template>
    <template v-else>
      <div class="form-grid">
        <label>
          资料类型
          <input :value="activeItem?.type || ''" placeholder="检验批/隐蔽工程" />
        </label>
        <label>
          关联分项
          <input :value="activeItem?.section || ''" placeholder="分项名称" />
        </label>
        <label>
          附件说明
          <input placeholder="请输入附件说明" />
        </label>
        <label>
          上传文件
          <input type="file" />
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
const modalType = ref("form");
const activeItem = ref(null);

const documents = Array.from({ length: 20 }, (_, index) => ({
  code: `ZL-${String(index + 1).padStart(3, "0")}`,
  type: index % 2 === 0 ? "检验批" : "隐蔽工程",
  section: index % 3 === 0 ? "混凝土结构" : "消防安装",
  owner: index % 2 === 0 ? "赵工" : "孙工",
  date: `2024-08-${String((index % 28) + 1).padStart(2, "0")}`,
  status: index % 4 === 0 ? "待上传" : "已归档"
}));

const openModal = (title, type, item = null) => {
  modalTitle.value = title;
  modalType.value = type;
  activeItem.value = item;
  modalOpen.value = true;
};
</script>

<style scoped>
.method-list {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.method-item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #475569;
}

.collection-actions {
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
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}
</style>

<template>
  <div class="grid grid-3">
    <div class="card">
      <div class="section-title">流程状态</div>
      <div class="status-list">
        <div v-for="stage in stages" :key="stage.name" class="status-item">
          <div class="status-name">{{ stage.name }}</div>
          <div class="progress-track">
            <div class="progress-value" :style="{ width: stage.value + '%' }"></div>
          </div>
          <div class="status-value">{{ stage.value }}%</div>
        </div>
      </div>
      <button class="btn" @click="openModal('发起分部分项验收', 'start')">发起验收</button>
    </div>
    <div class="card">
      <div class="section-title">待办提醒</div>
      <ul class="todo-list">
        <li>土建分部隐蔽工程需补充照片</li>
        <li>机电分部检验批待监理审核</li>
        <li>装修分项验收需安排现场签字</li>
      </ul>
      <button class="btn secondary" @click="openModal('提交验收资料审核', 'review')">提交审核</button>
    </div>
    <div class="card">
      <div class="section-title">进度跟踪</div>
      <div class="progress-track" style="margin-bottom: 10px">
        <div class="progress-value" style="width: 65%"></div>
      </div>
      <div class="notice">当前验收完成率 65%，资料完整率 92%。</div>
      <button class="btn light" @click="openModal('验收进度详情', 'progress')">进度详情</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <div class="section-title">分部分项验收列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>验收编号</th>
          <th>分部工程</th>
          <th>分项工程</th>
          <th>负责人</th>
          <th>验收时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in acceptanceList" :key="item.code">
          <td>{{ item.code }}</td>
          <td>{{ item.section }}</td>
          <td>{{ item.item }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.date }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td class="actions">
            <button class="btn light" @click="openModal('查看验收流程', 'flow', item)">流程</button>
            <button class="btn" @click="openModal('资料补充提示', 'notice', item)">提示</button>
            <button class="btn secondary" @click="openModal('确认验收结论', 'confirm', item)">确认</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <AppModal :open="modalOpen" :title="modalTitle" @close="modalOpen = false" @confirm="modalOpen = false">
    <template v-if="modalType === 'progress'">
      <div class="notice">验收资料待补充 5 项，预计 2 天内完成。</div>
      <div class="progress-track">
        <div class="progress-value" style="width: 65%"></div>
      </div>
    </template>
    <template v-else-if="modalType === 'flow'">
      <div class="flow-steps">
        <div>1. 资料提交：{{ activeItem?.owner }}</div>
        <div>2. 监理初审：进行中</div>
        <div>3. 现场验收：待安排</div>
        <div>4. 归档确认：待完成</div>
      </div>
    </template>
    <template v-else-if="modalType === 'notice'">
      <div class="notice">{{ activeItem?.item }} 需补充影像资料及隐蔽验收记录。</div>
    </template>
    <template v-else>
      <div class="form-grid">
        <label>
          分部工程
          <input :value="activeItem?.section || ''" placeholder="请输入分部工程" />
        </label>
        <label>
          分项工程
          <input :value="activeItem?.item || ''" placeholder="请输入分项工程" />
        </label>
        <label>
          验收负责人
          <input :value="activeItem?.owner || ''" placeholder="请输入负责人" />
        </label>
        <label>
          验收时间
          <input :value="activeItem?.date || ''" placeholder="2024-08-16" />
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
const modalType = ref("start");
const activeItem = ref(null);

const stages = [
  { name: "资料提交", value: 80 },
  { name: "监理审核", value: 66 },
  { name: "现场验收", value: 54 },
  { name: "归档确认", value: 42 }
];

const acceptanceList = Array.from({ length: 20 }, (_, index) => ({
  code: `YS-${String(index + 1).padStart(3, "0")}`,
  section: index % 2 === 0 ? "土建分部" : "机电分部",
  item: index % 3 === 0 ? "混凝土结构" : "给排水安装",
  owner: index % 2 === 0 ? "李工" : "王工",
  date: `2024-08-${String((index % 28) + 1).padStart(2, "0")}`,
  status: index % 4 === 0 ? "待补充" : "审核中"
}));

const openModal = (title, type, item = null) => {
  modalTitle.value = title;
  modalType.value = type;
  activeItem.value = item;
  modalOpen.value = true;
};
</script>

<style scoped>
.status-list {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.status-item {
  display: grid;
  gap: 6px;
}

.status-name {
  font-size: 14px;
  font-weight: 600;
}

.status-value {
  font-size: 12px;
  color: #64748b;
}

.todo-list {
  display: grid;
  gap: 10px;
  font-size: 14px;
  color: #475569;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.flow-steps {
  display: grid;
  gap: 8px;
  font-size: 14px;
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

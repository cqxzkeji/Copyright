<template>
  <div class="grid cols-2">
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">翻译与本地化中心</div>
          <div class="section-sub">集中管理多语种翻译、本地化适配与语言质量。</div>
        </div>
        <div class="actions">
          <button class="btn" type="button" @click="openModal('task')">新建翻译任务</button>
          <button class="btn secondary" type="button" @click="openModal('glossary')">术语管理</button>
          <button class="btn ghost" type="button" @click="openModal('qa')">质量检查</button>
          <button class="btn ghost" type="button" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="locale-grid">
        <div class="locale-card" v-for="item in localeCards" :key="item.id">
          <img :src="item.image" :alt="item.title" />
          <div>
            <div class="locale-title">{{ item.title }}</div>
            <div class="locale-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">本地化任务列表</div>
          <div class="section-sub">当前共 {{ localizationRows.length }} 条翻译与审校任务。</div>
        </div>
        <button class="btn secondary" type="button" @click="openModal('progress')">任务进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>语言对</th>
            <th>负责人</th>
            <th>交付</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in localizationRows" :key="row.id">
            <td>{{ row.title }}</td>
            <td>{{ row.lang }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.due }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('assign', row)">指派</button>
              <button class="btn ghost" type="button" @click="openModal('details', row)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" :on-close="closeModal">
    <template v-if="modal.type === 'task'">
      <label class="field">
        任务名称
        <input class="input" v-model="form.name" placeholder="新市场推广翻译" />
      </label>
      <label class="field">
        语言对
        <select class="select" v-model="form.lang">
          <option>中文 → 英语</option>
          <option>中文 → 日语</option>
          <option>英语 → 西班牙语</option>
        </select>
      </label>
      <label class="field">
        截止日期
        <input class="input" type="date" />
      </label>
      <button class="btn" type="button" @click="submitAction('翻译任务已创建')">提交任务</button>
    </template>

    <template v-else-if="modal.type === 'glossary'">
      <label class="field">
        新增术语
        <input class="input" placeholder="输入品牌术语" />
      </label>
      <label class="field">
        标准译文
        <input class="input" placeholder="输入标准译文" />
      </label>
      <button class="btn" type="button" @click="submitAction('术语已同步到全局库')">保存术语</button>
    </template>

    <template v-else-if="modal.type === 'qa'">
      <label class="field">
        选择检查范围
        <select class="select">
          <option>全部在译内容</option>
          <option>仅待审校内容</option>
        </select>
      </label>
      <label class="field">
        检查项
        <input class="input" value="术语一致性、语气、长度" readonly />
      </label>
      <button class="btn" type="button" @click="submitAction('质量检查已启动')">启动检查</button>
    </template>

    <template v-else-if="modal.type === 'progress'">
      <div class="progress-block">
        <div class="progress-title">本周翻译进度</div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-meta">完成 {{ progress }}%，剩余 {{ 100 - progress }}% 待校对。</div>
      </div>
      <button class="btn" type="button" @click="updateProgress">刷新进度</button>
    </template>

    <template v-else-if="modal.type === 'assign'">
      <label class="field">
        任务名称
        <input class="input" v-model="modal.payload.title" />
      </label>
      <label class="field">
        指派给
        <input class="input" placeholder="输入译员姓名" />
      </label>
      <button class="btn" type="button" @click="submitAction('任务已重新指派')">确认指派</button>
    </template>

    <template v-else-if="modal.type === 'details'">
      <div class="tip">
        {{ modal.payload.title }} ｜ {{ modal.payload.lang }} ｜ 负责人 {{ modal.payload.owner }} ｜
        截止 {{ modal.payload.due }}。
      </div>
    </template>

    <template v-else-if="modal.type === 'tip'">
      <div class="tip">
        提示：在启动本地化前先同步术语库，可显著降低返工风险。
      </div>
    </template>

    <template v-else-if="modal.type === 'result'">
      <div class="tip">{{ modal.message }}</div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const localeCards = [
  {
    id: 1,
    title: "品牌术语库",
    meta: "覆盖 12 种语言",
    image: "https://picsum.photos/seed/locale1/160/120"
  },
  {
    id: 2,
    title: "语气与风格指南",
    meta: "支持多市场差异化",
    image: "https://picsum.photos/seed/locale2/160/120"
  },
  {
    id: 3,
    title: "本地化审校",
    meta: "自动化审查规则",
    image: "https://picsum.photos/seed/locale3/160/120"
  }
];

const localizationRows = Array.from({ length: 21 }, (_, index) => ({
  id: `LC-${index + 1}`,
  title: `本地化任务 ${index + 1}`,
  lang: ["中文→英语", "英语→法语", "中文→德语"][index % 3],
  owner: ["Yuki", "Marco", "韩梅", "Sofia"][(index + 2) % 4],
  due: `2024-0${(index % 9) + 1}-2${index % 3}`,
  status: ["进行中", "待审校", "已完成"][index % 3]
}));

const modal = reactive({
  open: false,
  type: "",
  title: "",
  message: "",
  payload: {}
});

const form = reactive({
  name: "",
  lang: "中文 → 英语"
});

const progress = ref(54);

const openModal = (type, payload = {}) => {
  modal.open = true;
  modal.type = type;
  modal.payload = { ...payload };
  modal.message = "";
  const titles = {
    task: "新建翻译任务",
    glossary: "术语管理",
    qa: "质量检查",
    progress: "翻译进度",
    assign: "任务指派",
    details: "任务详情",
    tip: "按钮提示",
    result: "处理结果"
  };
  modal.title = titles[type] || "操作";
};

const closeModal = () => {
  modal.open = false;
};

const submitAction = (message) => {
  modal.type = "result";
  modal.title = "操作完成";
  modal.message = message;
};

const updateProgress = () => {
  progress.value = Math.min(100, progress.value + 8);
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
}

.section-sub {
  color: #6c7a96;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.locale-grid {
  display: grid;
  gap: 12px;
}

.locale-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #f7f9ff;
}

.locale-card img {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.locale-title {
  font-weight: 600;
}

.locale-meta {
  color: #6c7a96;
  font-size: 12px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #3a4a6b;
}

.progress-block {
  display: grid;
  gap: 8px;
}

.progress-title {
  font-weight: 600;
}

.progress-meta {
  font-size: 13px;
  color: #6c7a96;
}

.tip {
  background: #f5f7ff;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
}
</style>

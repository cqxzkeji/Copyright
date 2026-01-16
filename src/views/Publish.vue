<template>
  <div class="grid cols-2">
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">多渠道发布中心</div>
          <div class="section-sub">支持多平台内容排期、投放与回收。</div>
        </div>
        <div class="actions">
          <button class="btn" type="button" @click="openModal('schedule')">排期发布</button>
          <button class="btn secondary" type="button" @click="openModal('channel')">渠道映射</button>
          <button class="btn ghost" type="button" @click="openModal('approve')">发布审批</button>
          <button class="btn ghost" type="button" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="channel-grid">
        <div class="channel-card" v-for="item in channels" :key="item.id">
          <img :src="item.image" :alt="item.title" />
          <div>
            <div class="channel-title">{{ item.title }}</div>
            <div class="channel-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">发布计划清单</div>
          <div class="section-sub">共 {{ publishRows.length }} 条计划。</div>
        </div>
        <button class="btn secondary" type="button" @click="openModal('progress')">发布进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>活动</th>
            <th>渠道</th>
            <th>排期</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in publishRows" :key="row.id">
            <td>{{ row.title }}</td>
            <td>{{ row.channel }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.owner }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('adjust', row)">调整</button>
              <button class="btn ghost" type="button" @click="openModal('report', row)">报表</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" :on-close="closeModal">
    <template v-if="modal.type === 'schedule'">
      <label class="field">
        选择活动
        <input class="input" placeholder="输入活动名称" />
      </label>
      <label class="field">
        发布渠道
        <select class="select">
          <option>社交媒体</option>
          <option>电商平台</option>
          <option>官网首页</option>
        </select>
      </label>
      <label class="field">
        发布时间
        <input class="input" type="datetime-local" />
      </label>
      <button class="btn" type="button" @click="submitAction('发布排期已保存')">确认排期</button>
    </template>

    <template v-else-if="modal.type === 'channel'">
      <label class="field">
        主渠道
        <input class="input" value="品牌官网" readonly />
      </label>
      <label class="field">
        同步渠道
        <input class="input" value="微博、Instagram、TikTok" readonly />
      </label>
      <button class="btn" type="button" @click="submitAction('渠道映射已更新')">更新映射</button>
    </template>

    <template v-else-if="modal.type === 'approve'">
      <label class="field">
        待审批事项
        <input class="input" value="全球新品发布" readonly />
      </label>
      <label class="field">
        审批意见
        <textarea class="textarea" rows="4" placeholder="输入审批意见"></textarea>
      </label>
      <button class="btn" type="button" @click="submitAction('审批已通过')">通过审批</button>
    </template>

    <template v-else-if="modal.type === 'progress'">
      <div class="progress-block">
        <div class="progress-title">多渠道发布进度</div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-meta">已完成 {{ progress }}%，剩余 {{ 100 - progress }}%。</div>
      </div>
      <button class="btn" type="button" @click="updateProgress">刷新状态</button>
    </template>

    <template v-else-if="modal.type === 'adjust'">
      <label class="field">
        活动名称
        <input class="input" v-model="modal.payload.title" />
      </label>
      <label class="field">
        新排期
        <input class="input" placeholder="调整时间" />
      </label>
      <button class="btn" type="button" @click="submitAction('排期调整已记录')">保存调整</button>
    </template>

    <template v-else-if="modal.type === 'report'">
      <div class="tip">
        {{ modal.payload.title }} 在 {{ modal.payload.channel }} 渠道的投放点击率为 {{ modal.payload.rate }}。
      </div>
      <button class="btn" type="button" @click="submitAction('报表已导出')">导出报表</button>
    </template>

    <template v-else-if="modal.type === 'tip'">
      <div class="tip">
        提示：发布排期前请确认素材已通过合规审核与翻译校验。
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

const channels = [
  {
    id: 1,
    title: "社交媒体矩阵",
    meta: "全球 12 个账号",
    image: "https://picsum.photos/seed/publish1/160/120"
  },
  {
    id: 2,
    title: "电商平台",
    meta: "覆盖 8 个站点",
    image: "https://picsum.photos/seed/publish2/160/120"
  },
  {
    id: 3,
    title: "品牌官网",
    meta: "多语种首页",
    image: "https://picsum.photos/seed/publish3/160/120"
  }
];

const publishRows = Array.from({ length: 20 }, (_, index) => ({
  id: `PB-${index + 1}`,
  title: `活动 ${index + 1}`,
  channel: ["社交媒体", "电商平台", "官网首页"][index % 3],
  time: `2024-0${(index % 9) + 1}-1${index % 5}`,
  owner: ["吴越", "Amelia", "Tom", "刘畅"][(index + 2) % 4],
  status: ["排期中", "待发布", "已发布"][index % 3],
  rate: `${(12 + index) % 30}%`
}));

const modal = reactive({
  open: false,
  type: "",
  title: "",
  message: "",
  payload: {}
});

const progress = ref(47);

const openModal = (type, payload = {}) => {
  modal.open = true;
  modal.type = type;
  modal.payload = { ...payload };
  modal.message = "";
  const titles = {
    schedule: "排期发布",
    channel: "渠道映射",
    approve: "发布审批",
    progress: "发布进度",
    adjust: "调整排期",
    report: "投放报表",
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
  progress.value = Math.min(100, progress.value + 9);
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

.channel-grid {
  display: grid;
  gap: 12px;
}

.channel-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #f7f9ff;
}

.channel-card img {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.channel-title {
  font-weight: 600;
}

.channel-meta {
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

<template>
  <div class="grid cols-2">
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">内容制作工作台</div>
          <div class="section-sub">支持多语言文案、视觉素材与话术结构化生产。</div>
        </div>
        <div class="actions">
          <button class="btn" type="button" @click="openModal('create')">新增文案</button>
          <button class="btn secondary" type="button" @click="openModal('batch')">批量生成</button>
          <button class="btn ghost" type="button" @click="openModal('review')">审校请求</button>
          <button class="btn ghost" type="button" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="preview-grid">
        <div class="preview-card" v-for="item in previews" :key="item.id">
          <img :src="item.image" :alt="item.title" />
          <div>
            <div class="preview-title">{{ item.title }}</div>
            <div class="preview-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">多语言内容清单</div>
          <div class="section-sub">共 {{ contentRows.length }} 条正在制作或待审核的内容。</div>
        </div>
        <button class="btn secondary" type="button" @click="openModal('progress')">生成进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>主题</th>
            <th>语言</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in contentRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.topic }}</td>
            <td>{{ row.lang }}</td>
            <td>{{ row.owner }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('edit', row)">编辑</button>
              <button class="btn ghost" type="button" @click="openModal('preview', row)">预览</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" :on-close="closeModal">
    <template v-if="modal.type === 'create'">
      <label class="field">
        文案主题
        <input class="input" v-model="form.topic" placeholder="新品发布活动" />
      </label>
      <label class="field">
        目标语言
        <select class="select" v-model="form.lang">
          <option>中文</option>
          <option>英语</option>
          <option>西班牙语</option>
          <option>日语</option>
        </select>
      </label>
      <label class="field">
        主标题
        <input class="input" v-model="form.headline" placeholder="输入主标题" />
      </label>
      <label class="field">
        主要卖点
        <textarea class="textarea" v-model="form.keypoint" rows="4" placeholder="输入卖点描述"></textarea>
      </label>
      <button class="btn" type="button" @click="submitAction('已创建并进入审核流程')">提交制作</button>
    </template>

    <template v-else-if="modal.type === 'batch'">
      <label class="field">
        选择模板
        <select class="select">
          <option>季节促销模板</option>
          <option>电商新品模板</option>
          <option>品牌活动模板</option>
        </select>
      </label>
      <label class="field">
        覆盖语言
        <input class="input" value="中文、英语、德语、法语" readonly />
      </label>
      <label class="field">
        输出数量
        <input class="input" type="number" value="24" />
      </label>
      <button class="btn" type="button" @click="submitAction('批量生成任务已排队')">启动生成</button>
    </template>

    <template v-else-if="modal.type === 'review'">
      <label class="field">
        审校对象
        <input class="input" value="夏季新品推广内容" readonly />
      </label>
      <label class="field">
        审校要求
        <textarea class="textarea" rows="4" placeholder="说明语气、术语或风格要求"></textarea>
      </label>
      <button class="btn" type="button" @click="submitAction('审校请求已发送')">发送审校</button>
    </template>

    <template v-else-if="modal.type === 'progress'">
      <div class="progress-block">
        <div class="progress-title">本周内容生成进度</div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-meta">已完成 {{ progress }}%，剩余 {{ 100 - progress }}% 待生成。</div>
      </div>
      <button class="btn" type="button" @click="updateProgress">刷新进度</button>
    </template>

    <template v-else-if="modal.type === 'edit'">
      <label class="field">
        修改主题
        <input class="input" v-model="modal.payload.topic" />
      </label>
      <label class="field">
        当前语言
        <input class="input" v-model="modal.payload.lang" />
      </label>
      <label class="field">
        负责人
        <input class="input" v-model="modal.payload.owner" />
      </label>
      <button class="btn" type="button" @click="submitAction('内容更新已保存')">保存更新</button>
    </template>

    <template v-else-if="modal.type === 'preview'">
      <div class="preview-detail">
        <strong>{{ modal.payload.topic }}</strong>
        <p>语言：{{ modal.payload.lang }} ｜ 负责人：{{ modal.payload.owner }}</p>
        <p>状态：{{ modal.payload.status }}，请确认排版、语气和关键卖点。</p>
      </div>
      <button class="btn" type="button" @click="submitAction('已完成预览确认')">确认预览</button>
    </template>

    <template v-else-if="modal.type === 'tip'">
      <div class="tip">
        提示：内容制作按钮用于建立多语言文案，建议先完善术语库与品牌语气后再批量生成。
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

const previews = [
  {
    id: 1,
    title: "夏季轻量新品海报",
    meta: "中文 / 电商渠道",
    image: "https://picsum.photos/seed/content1/160/120"
  },
  {
    id: 2,
    title: "欧洲市场社媒短文案",
    meta: "英语 / 社交媒体",
    image: "https://picsum.photos/seed/content2/160/120"
  },
  {
    id: 3,
    title: "品牌故事长图",
    meta: "日语 / 官网",
    image: "https://picsum.photos/seed/content3/160/120"
  }
];

const contentRows = Array.from({ length: 22 }, (_, index) => ({
  id: `CT-${index + 1}`,
  topic: `多语言主题 ${index + 1}`,
  lang: ["中文", "英语", "西班牙语", "法语"][index % 4],
  owner: ["王琳", "李航", "Nora", "Ken"][(index + 1) % 4],
  status: ["草稿", "待审校", "已发布"][index % 3]
}));

const modal = reactive({
  open: false,
  type: "",
  title: "",
  message: "",
  payload: {}
});

const form = reactive({
  topic: "",
  lang: "中文",
  headline: "",
  keypoint: ""
});

const progress = ref(68);

const openModal = (type, payload = {}) => {
  modal.open = true;
  modal.type = type;
  modal.payload = { ...payload };
  modal.message = "";
  const titles = {
    create: "新增多语言文案",
    batch: "批量生成内容",
    review: "内容审校请求",
    progress: "生成进度",
    edit: "编辑内容",
    preview: "内容预览",
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
  progress.value = Math.min(100, progress.value + 7);
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

.preview-grid {
  display: grid;
  gap: 12px;
}

.preview-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #f7f9ff;
}

.preview-card img {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.preview-title {
  font-weight: 600;
}

.preview-meta {
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

.preview-detail {
  background: #f7f9ff;
  padding: 12px;
  border-radius: 12px;
}
</style>

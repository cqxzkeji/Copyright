<template>
  <div class="grid cols-2">
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">素材集中管理</div>
          <div class="section-sub">图片、视频与文案素材统一归档与标签化。</div>
        </div>
        <div class="actions">
          <button class="btn" type="button" @click="openModal('upload')">上传素材</button>
          <button class="btn secondary" type="button" @click="openModal('tag')">分类标签</button>
          <button class="btn ghost" type="button" @click="openModal('reuse')">复用申请</button>
          <button class="btn ghost" type="button" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="gallery">
        <div class="gallery-item" v-for="item in gallery" :key="item.id">
          <img :src="item.image" :alt="item.title" />
          <div>
            <div class="gallery-title">{{ item.title }}</div>
            <div class="gallery-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">素材清单</div>
          <div class="section-sub">共 {{ materialRows.length }} 条素材记录。</div>
        </div>
        <button class="btn secondary" type="button" @click="openModal('progress')">同步进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>素材</th>
            <th>类型</th>
            <th>标签</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in materialRows" :key="row.id">
            <td>{{ row.title }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.tag }}</td>
            <td>{{ row.owner }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('edit', row)">编辑</button>
              <button class="btn ghost" type="button" @click="openModal('share', row)">分享</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" :on-close="closeModal">
    <template v-if="modal.type === 'upload'">
      <label class="field">
        素材名称
        <input class="input" placeholder="输入素材名称" />
      </label>
      <label class="field">
        素材类型
        <select class="select">
          <option>图片</option>
          <option>视频</option>
          <option>文案</option>
        </select>
      </label>
      <label class="field">
        标签
        <input class="input" placeholder="如：新品、节日、社媒" />
      </label>
      <button class="btn" type="button" @click="submitAction('素材已上传并入库')">确认上传</button>
    </template>

    <template v-else-if="modal.type === 'tag'">
      <label class="field">
        分类名称
        <input class="input" placeholder="输入分类名称" />
      </label>
      <label class="field">
        标签列表
        <textarea class="textarea" rows="4" placeholder="输入标签，如：新品,节日,广告"></textarea>
      </label>
      <button class="btn" type="button" @click="submitAction('分类标签已更新')">保存分类</button>
    </template>

    <template v-else-if="modal.type === 'reuse'">
      <label class="field">
        复用场景
        <select class="select">
          <option>社交媒体投放</option>
          <option>电商详情页</option>
          <option>线下物料</option>
        </select>
      </label>
      <label class="field">
        说明
        <textarea class="textarea" rows="4" placeholder="说明复用需求"></textarea>
      </label>
      <button class="btn" type="button" @click="submitAction('复用申请已提交')">提交申请</button>
    </template>

    <template v-else-if="modal.type === 'progress'">
      <div class="progress-block">
        <div class="progress-title">素材入库同步</div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-meta">同步完成 {{ progress }}%。</div>
      </div>
      <button class="btn" type="button" @click="updateProgress">刷新同步</button>
    </template>

    <template v-else-if="modal.type === 'edit'">
      <label class="field">
        素材名称
        <input class="input" v-model="modal.payload.title" />
      </label>
      <label class="field">
        标签
        <input class="input" v-model="modal.payload.tag" />
      </label>
      <button class="btn" type="button" @click="submitAction('素材信息已更新')">保存更新</button>
    </template>

    <template v-else-if="modal.type === 'share'">
      <div class="tip">
        {{ modal.payload.title }} 将分享给 {{ modal.payload.owner }} 团队，用于 {{ modal.payload.tag }} 主题项目。
      </div>
      <button class="btn" type="button" @click="submitAction('分享链接已生成')">生成链接</button>
    </template>

    <template v-else-if="modal.type === 'tip'">
      <div class="tip">
        提示：高复用素材建议添加细分标签，便于多渠道快速检索。
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

const gallery = [
  {
    id: 1,
    title: "新品KV主视觉",
    meta: "图片 / 竖版",
    image: "https://picsum.photos/seed/material1/160/120"
  },
  {
    id: 2,
    title: "社媒短视频",
    meta: "视频 / 15s",
    image: "https://picsum.photos/seed/material2/160/120"
  },
  {
    id: 3,
    title: "品牌故事长图",
    meta: "图片 / 横版",
    image: "https://picsum.photos/seed/material3/160/120"
  }
];

const materialRows = Array.from({ length: 23 }, (_, index) => ({
  id: `MT-${index + 1}`,
  title: `素材 ${index + 1}`,
  type: ["图片", "视频", "文案"][index % 3],
  tag: ["新品", "节日", "会员运营", "社媒"][index % 4],
  owner: ["陈曦", "Luna", "David", "赵敏"][(index + 1) % 4],
  status: ["可复用", "待整理", "使用中"][index % 3]
}));

const modal = reactive({
  open: false,
  type: "",
  title: "",
  message: "",
  payload: {}
});

const progress = ref(62);

const openModal = (type, payload = {}) => {
  modal.open = true;
  modal.type = type;
  modal.payload = { ...payload };
  modal.message = "";
  const titles = {
    upload: "上传素材",
    tag: "分类标签",
    reuse: "复用申请",
    progress: "同步进度",
    edit: "编辑素材",
    share: "分享素材",
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
  progress.value = Math.min(100, progress.value + 6);
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

.gallery {
  display: grid;
  gap: 12px;
}

.gallery-item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #f7f9ff;
}

.gallery-item img {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.gallery-title {
  font-weight: 600;
}

.gallery-meta {
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

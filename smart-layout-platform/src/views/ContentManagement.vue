<template>
  <div class="module">
    <div class="flex-between">
      <div>
        <p class="eyebrow">内容管理</p>
        <h3>素材统筹与渠道分发</h3>
      </div>
      <div class="top-actions">
        <button class="secondary-btn" @click="showUpload = true">上传素材</button>
        <button class="primary-btn" @click="showBatch = true">批量分发</button>
        <button class="primary-btn" @click="showAudit = true">审核提示</button>
      </div>
    </div>

    <div class="card" style="margin-top: 1rem;">
      <div class="flex-between">
        <p class="eyebrow">内容库</p>
        <button class="secondary-btn" @click="showFilter = true">筛选</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>类型</th>
            <th>渠道</th>
            <th>更新人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contents" :key="item.title">
            <td>{{ item.title }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.channel }}</td>
            <td>{{ item.owner }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showUpload" title="上传素材">
      <div class="input-field">
        <label>素材标题</label>
        <input v-model="upload.title" placeholder="如：品牌主视觉" />
      </div>
      <div class="input-field">
        <label>上传进度</label>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: upload.progress + '%' }"></div>
        </div>
        <p>已完成 {{ upload.progress }}%</p>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="increaseUpload">继续上传</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showBatch" title="批量分发">
      <div class="form-grid">
        <div class="input-field">
          <label>选择渠道</label>
          <select v-model="batch.channel">
            <option>微博</option>
            <option>小红书</option>
            <option>视频号</option>
            <option>抖音</option>
          </select>
        </div>
        <div class="input-field">
          <label>发布时间</label>
          <input v-model="batch.time" type="datetime-local" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showBatch = false">确认分发</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showAudit" title="审核提示">
      <p>检测到 3 条内容待审核，请在发布前完成合规检查。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showAudit = false">我知道了</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showFilter" title="筛选内容">
      <div class="form-grid">
        <div class="input-field">
          <label>类型</label>
          <select>
            <option>全部</option>
            <option>图文</option>
            <option>短视频</option>
          </select>
        </div>
        <div class="input-field">
          <label>状态</label>
          <select>
            <option>全部</option>
            <option>草稿</option>
            <option>已上线</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showFilter = false">应用筛选</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const contents = [
  { title: '春季新品大片', type: '图文', channel: '微博', owner: '刘倩', status: '草稿' },
  { title: '5 月传播规划', type: '表格', channel: '企业号', owner: '张伟', status: '已上线' },
  { title: '品牌故事短片', type: '视频', channel: '视频号', owner: '王敏', status: '排期' },
  { title: '新品发布会', type: '直播', channel: '抖音', owner: '赵磊', status: '排期' },
  { title: '客户案例合集', type: '文档', channel: '官网', owner: '韩雪', status: '已上线' },
  { title: '数据洞察周报', type: '报告', channel: '内部', owner: '陈晨', status: '草稿' },
  { title: '节日海报', type: '图片', channel: '朋友圈', owner: '周扬', status: '草稿' },
  { title: '新品 FAQ', type: '文档', channel: '官网', owner: '李婷', status: '已上线' },
  { title: '抖音挑战脚本', type: '脚本', channel: '抖音', owner: '马超', status: '草稿' },
  { title: '媒体采访提纲', type: '文档', channel: '新闻稿', owner: '陈宇', status: '已上线' }
];

const showUpload = ref(false);
const showBatch = ref(false);
const showAudit = ref(false);
const showFilter = ref(false);
const upload = reactive({ title: '品牌主视觉', progress: 45 });
const batch = reactive({ channel: '微博', time: '' });

const increaseUpload = () => {
  upload.progress = Math.min(100, upload.progress + 20);
};
</script>

<style scoped>
.top-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

table {
  margin-top: 0.75rem;
}
</style>

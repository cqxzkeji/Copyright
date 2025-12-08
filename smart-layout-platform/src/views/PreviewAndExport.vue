<template>
  <div class="module">
    <div class="flex-between">
      <div>
        <p class="eyebrow">预览与导出</p>
        <h3>多渠道格式输出</h3>
      </div>
      <div class="top-actions">
        <button class="secondary-btn" @click="showShare = true">分享链接</button>
        <button class="primary-btn" @click="showExport = true">导出高清图</button>
        <button class="primary-btn" @click="showVideo = true">生成视频</button>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 1rem;">
      <div class="card">
        <p class="eyebrow">多端尺寸</p>
        <table class="table">
          <thead>
            <tr>
              <th>尺寸</th>
              <th>格式</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sizes" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.format }}</td>
              <td><span class="badge">{{ item.status }}</span></td>
              <td><button class="secondary-btn" @click="openPreview(item)">预览</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <p class="eyebrow">导出记录</p>
        <table class="table">
          <thead>
            <tr>
              <th>任务</th>
              <th>渠道</th>
              <th>用时</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in exports" :key="task.name">
              <td>{{ task.name }}</td>
              <td>{{ task.channel }}</td>
              <td>{{ task.duration }}</td>
              <td><span class="badge">{{ task.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showShare" title="生成分享链接">
      <p>链接将在 24 小时内有效，可用于内部预览。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showShare = false">复制链接</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showExport" title="导出高清图">
      <div class="form-grid">
        <div class="input-field">
          <label>格式</label>
          <select>
            <option>PNG</option>
            <option>JPG</option>
            <option>PDF</option>
          </select>
        </div>
        <div class="input-field">
          <label>分辨率</label>
          <select>
            <option>1x</option>
            <option>2x</option>
            <option>4K</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showExport = false">立即导出</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showVideo" title="生成视频">
      <p>正在将画布渲染为 15 秒 MP4 视频。</p>
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: videoProgress + '%' }"></div>
      </div>
      <p style="margin-top: 0.5rem;">完成度：{{ videoProgress }}%</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="increaseVideo">刷新进度</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showPreviewModal" :title="activeSize?.label || '预览'">
      <p>格式：{{ activeSize?.format }}，状态：{{ activeSize?.status }}</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showPreviewModal = false">关闭</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const sizes = reactive([
  { label: '9:16 竖版', format: 'PNG', status: '已生成' },
  { label: '1:1 正方形', format: 'PNG', status: '已生成' },
  { label: '16:9 横版', format: 'PNG', status: '渲染中' },
  { label: 'A4 海报', format: 'PDF', status: '排队' },
  { label: '小红书长图', format: 'JPG', status: '已生成' },
  { label: '微博长图', format: 'JPG', status: '渲染中' }]);

const exports = reactive([
  { name: '新品宣传图', channel: '微博', duration: '12s', status: '完成' },
  { name: '短视频封面', channel: '抖音', duration: '8s', status: '完成' },
  { name: '直播预告图', channel: '视频号', duration: '10s', status: '进行中' },
  { name: '线下海报', channel: '打印', duration: '15s', status: '完成' },
  { name: '媒体稿配图', channel: '新闻稿', duration: '11s', status: '完成' }]);

const showShare = ref(false);
const showExport = ref(false);
const showVideo = ref(false);
const showPreviewModal = ref(false);
const videoProgress = ref(40);
const activeSize = ref(null);

const increaseVideo = () => {
  videoProgress.value = Math.min(100, videoProgress.value + 18);
};

const openPreview = (item) => {
  activeSize.value = item;
  showPreviewModal.value = true;
};
</script>

<style scoped>
.top-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

table {
  margin-top: 0.5rem;
}
</style>

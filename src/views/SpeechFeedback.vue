<template>
  <div class="grid grid-2">
    <div class="card">
      <h2>语音合成与反馈</h2>
      <label>
        合成语言
        <select class="select">
          <option>中文</option>
          <option>英文</option>
          <option>法文</option>
        </select>
      </label>
      <label>
        音色选择
        <select class="select">
          <option>清晰女声</option>
          <option>沉稳男声</option>
          <option>中性播报</option>
        </select>
      </label>
      <label>
        语速调整
        <select class="select">
          <option>正常</option>
          <option>偏快</option>
          <option>偏慢</option>
        </select>
      </label>
      <div class="action-row">
        <button class="button" @click="openGenerate">生成语音</button>
        <button class="button secondary" @click="openPreview">播放预览</button>
        <button class="button ghost" @click="openDownload">下载音频</button>
      </div>
    </div>
    <div class="card">
      <h2>实时播报队列</h2>
      <ul class="queue">
        <li v-for="item in queue" :key="item">{{ item }}</li>
      </ul>
      <div class="action-row">
        <button class="button" @click="openQueue">队列调度</button>
      </div>
    </div>
  </div>

  <BaseModal v-if="showGenerate" title="生成语音" @close="showGenerate = false">
    <p>语音合成引擎正在渲染翻译结果。</p>
    <div class="progress-bar"><span></span></div>
    <div class="modal-actions">
      <span class="button" @click="showGenerate = false">完成</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showPreview" title="播放预览" @close="showPreview = false">
    <p>播放预览将使用当前选定音色。</p>
    <div class="modal-actions">
      <span class="button" @click="showPreview = false">开始播放</span>
      <span class="button ghost" @click="showPreview = false">关闭</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showDownload" title="下载音频" @close="showDownload = false">
    <label>
      文件格式
      <select class="select">
        <option>MP3</option>
        <option>WAV</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showDownload = false">生成下载</span>
      <span class="button ghost" @click="showDownload = false">取消</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showQueue" title="队列调度" @close="showQueue = false">
    <p>当前队列优先级已同步至播报节点。</p>
    <div class="modal-actions">
      <span class="button" @click="showQueue = false">确认</span>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showGenerate = ref(false);
const showPreview = ref(false);
const showDownload = ref(false);
const showQueue = ref(false);

const queue = [
  '会议纪要 - 中文播报',
  '客户支持 - 英文播报',
  '医疗问诊 - 法文播报'
];

const openGenerate = () => {
  showGenerate.value = true;
};
const openPreview = () => {
  showPreview.value = true;
};
const openDownload = () => {
  showDownload.value = true;
};
const openQueue = () => {
  showQueue.value = true;
};
</script>

<style scoped>
.queue {
  padding-left: 18px;
  margin: 12px 0 0;
  color: #35508b;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
</style>

<template>
  <div class="grid grid-2">
    <div class="card">
      <h2>多模态输入融合</h2>
      <div class="media-preview">
        <img :src="previewImage" alt="多模态输入示意图" />
        <div>
          <p>图像与语音融合后可提高复杂场景识别准确度。</p>
          <p>当前输入：语音 + 图像 + 手写。</p>
        </div>
      </div>
      <div class="action-row">
        <button class="button" @click="openImage">上传图像</button>
        <button class="button secondary" @click="openHandwriting">采集手写</button>
        <button class="button ghost" @click="openFusion">融合分析</button>
      </div>
    </div>
    <div class="card">
      <h2>手写输入区</h2>
      <div class="handwriting">
        <p>手写内容："实时翻译会议纪要"</p>
        <p>识别置信度：94%</p>
      </div>
      <div class="action-row">
        <button class="button" @click="openStream">同步语音输入</button>
      </div>
    </div>
  </div>

  <BaseModal v-if="showImage" title="上传图像" @close="showImage = false">
    <label>
      选择图像文件
      <input class="input" placeholder="图像文件路径" />
    </label>
    <div class="modal-actions">
      <span class="button" @click="showImage = false">开始解析</span>
      <span class="button ghost" @click="showImage = false">取消</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showHandwriting" title="采集手写" @close="showHandwriting = false">
    <p>连接手写板并开始采集。</p>
    <div class="progress-bar"><span></span></div>
    <div class="modal-actions">
      <span class="button" @click="showHandwriting = false">完成采集</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showFusion" title="融合分析" @close="showFusion = false">
    <p>融合模型正在整合多模态特征。</p>
    <label>
      融合策略
      <select class="select">
        <option>加权融合</option>
        <option>注意力融合</option>
        <option>时序对齐</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showFusion = false">启动分析</span>
      <span class="button ghost" @click="showFusion = false">关闭</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showStream" title="同步语音输入" @close="showStream = false">
    <p>语音流已同步进入多模态融合管线。</p>
    <div class="modal-actions">
      <span class="button" @click="showStream = false">确认</span>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showImage = ref(false);
const showHandwriting = ref(false);
const showFusion = ref(false);
const showStream = ref(false);

const previewImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#bcd3ff"/>
          <stop offset="100%" stop-color="#f5f8ff"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="16" fill="url(#g)"/>
      <circle cx="80" cy="80" r="28" fill="#2f6bff" opacity="0.6"/>
      <rect x="130" y="60" width="120" height="20" rx="8" fill="#2f6bff" opacity="0.6"/>
      <rect x="130" y="90" width="80" height="20" rx="8" fill="#6da2ff" opacity="0.6"/>
      <text x="24" y="170" font-size="14" fill="#2b4a7f">图像 + 语音 + 手写融合</text>
    </svg>`
  );

const openImage = () => {
  showImage.value = true;
};
const openHandwriting = () => {
  showHandwriting.value = true;
};
const openFusion = () => {
  showFusion.value = true;
};
const openStream = () => {
  showStream.value = true;
};
</script>

<style scoped>
.media-preview {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.media-preview img {
  width: 180px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(47, 107, 255, 0.2);
}

.handwriting {
  min-height: 180px;
  background: #f5f8ff;
  padding: 12px;
  border-radius: 12px;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
</style>

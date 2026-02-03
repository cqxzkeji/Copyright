<template>
  <div class="grid grid-2">
    <div class="card">
      <h2>音频输入与预处理</h2>
      <label>
        输入通道
        <select class="select">
          <option>麦克风阵列</option>
          <option>会议室音频</option>
          <option>远程语音流</option>
        </select>
      </label>
      <label>
        噪声抑制等级
        <select class="select">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
      <div class="action-row">
        <button class="button" @click="openCapture">开始采集</button>
        <button class="button secondary" @click="openUpload">上传音频</button>
        <button class="button ghost" @click="openNoise">噪声抑制设置</button>
      </div>
    </div>
    <div class="card">
      <h2>实时语音转文本</h2>
      <div class="transcript">
        <p>正在监听："请将会议内容实时翻译为英文并生成摘要。"</p>
        <p>识别输出："系统正在加载声学模型，预计 1 秒内完成。"</p>
        <p>识别输出："当前语速稳定，噪声水平较低。"</p>
      </div>
      <div class="action-row">
        <button class="button" @click="openStream">实时流处理</button>
        <button class="button secondary" @click="openLanguage">多语言识别</button>
      </div>
    </div>
  </div>

  <BaseModal v-if="showCapture" title="开始采集" @close="showCapture = false">
    <p>将启动语音采集并实时传输到识别引擎。</p>
    <div class="progress-bar"><span></span></div>
    <div class="modal-actions">
      <span class="button" @click="showCapture = false">确认启动</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showUpload" title="上传音频" @close="showUpload = false">
    <label>
      选择音频文件
      <input class="input" placeholder="音频文件路径" />
    </label>
    <div class="modal-actions">
      <span class="button" @click="showUpload = false">开始解析</span>
      <span class="button ghost" @click="showUpload = false">取消</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showNoise" title="噪声抑制设置" @close="showNoise = false">
    <label>
      目标信噪比
      <input class="input" placeholder="例如 18 dB" />
    </label>
    <label>
      过滤策略
      <select class="select">
        <option>自适应滤波</option>
        <option>多通道降噪</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showNoise = false">保存设置</span>
      <span class="button ghost" @click="showNoise = false">关闭</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showStream" title="实时流处理" @close="showStream = false">
    <p>当前流延迟 0.6 秒，声学模型已加载完成。</p>
    <div class="progress-bar"><span></span></div>
    <div class="modal-actions">
      <span class="button" @click="showStream = false">保持运行</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showLanguage" title="多语言识别" @close="showLanguage = false">
    <label>
      识别语种
      <select class="select">
        <option>中文 / 英文 / 粤语</option>
        <option>英文 / 法文 / 西班牙文</option>
        <option>日文 / 韩文 / 英文</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showLanguage = false">应用策略</span>
      <span class="button ghost" @click="showLanguage = false">取消</span>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showCapture = ref(false);
const showUpload = ref(false);
const showNoise = ref(false);
const showStream = ref(false);
const showLanguage = ref(false);

const openCapture = () => {
  showCapture.value = true;
};

const openUpload = () => {
  showUpload.value = true;
};

const openNoise = () => {
  showNoise.value = true;
};

const openStream = () => {
  showStream.value = true;
};

const openLanguage = () => {
  showLanguage.value = true;
};
</script>

<style scoped>
.transcript {
  background: #f5f8ff;
  padding: 12px;
  border-radius: 12px;
  min-height: 180px;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
</style>

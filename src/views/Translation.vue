<template>
  <div class="grid grid-2">
    <div class="card">
      <h2>实时翻译引擎</h2>
      <label>
        源语言
        <select class="select">
          <option>中文</option>
          <option>英文</option>
          <option>法文</option>
        </select>
      </label>
      <label>
        目标语言
        <select class="select">
          <option>英文</option>
          <option>中文</option>
          <option>西班牙文</option>
        </select>
      </label>
      <label>
        原始文本
        <textarea class="textarea" rows="6" placeholder="输入或来自语音识别的实时文本"></textarea>
      </label>
      <div class="action-row">
        <button class="button" @click="openTranslate">实时翻译</button>
        <button class="button secondary" @click="openGlossary">术语管理</button>
        <button class="button ghost" @click="openOptimize">翻译优化</button>
      </div>
    </div>
    <div class="card">
      <h2>翻译输出</h2>
      <div class="output-box">
        <p>翻译结果将在此实时显示。</p>
        <p>当前示例："The system is preparing the acoustic model for real-time translation."</p>
      </div>
      <div class="action-row">
        <button class="button" @click="openStream">输出播报</button>
      </div>
    </div>
  </div>

  <BaseModal v-if="showTranslate" title="实时翻译" @close="showTranslate = false">
    <p>引擎正在加载 NMT 模型并进行上下文匹配。</p>
    <div class="progress-bar"><span></span></div>
    <div class="modal-actions">
      <span class="button" @click="showTranslate = false">查看结果</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showGlossary" title="术语管理" @close="showGlossary = false">
    <label>
      新增术语
      <input class="input" placeholder="例如：声学模型 = Acoustic Model" />
    </label>
    <label>
      适用领域
      <select class="select">
        <option>会议场景</option>
        <option>技术演示</option>
        <option>医疗咨询</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showGlossary = false">保存术语</span>
      <span class="button ghost" @click="showGlossary = false">取消</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showOptimize" title="翻译优化" @close="showOptimize = false">
    <p>根据当前语境调整权重。</p>
    <label>
      语境偏好
      <select class="select">
        <option>正式会议</option>
        <option>日常沟通</option>
        <option>技术播报</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showOptimize = false">应用优化</span>
      <span class="button ghost" @click="showOptimize = false">关闭</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showStream" title="输出播报" @close="showStream = false">
    <p>已将翻译结果推送至语音合成模块。</p>
    <div class="modal-actions">
      <span class="button" @click="showStream = false">确认</span>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showTranslate = ref(false);
const showGlossary = ref(false);
const showOptimize = ref(false);
const showStream = ref(false);

const openTranslate = () => {
  showTranslate.value = true;
};
const openGlossary = () => {
  showGlossary.value = true;
};
const openOptimize = () => {
  showOptimize.value = true;
};
const openStream = () => {
  showStream.value = true;
};
</script>

<style scoped>
.output-box {
  min-height: 200px;
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

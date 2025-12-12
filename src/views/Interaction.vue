<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
    <div class="card">
      <div class="flex-between">
        <h3 style="margin: 0;">互动体验</h3>
        <button @click="showLike = true">批量点赞</button>
      </div>
      <ul class="timeline" style="margin-top: 10px;">
        <li v-for="item in feed" :key="item.title">
          <strong>{{ item.title }}</strong>
          <div style="color: var(--muted);">{{ item.message }}</div>
        </li>
      </ul>
    </div>
    <div class="card">
      <div class="flex-between">
        <h3 style="margin: 0;">评论与反馈</h3>
        <button style="background: var(--accent);" @click="showComment = true">新增评论</button>
      </div>
      <div class="grid" style="grid-template-columns: 1fr; gap: 10px; margin-top: 12px;">
        <div v-for="item in comments" :key="item.user" class="card" style="border: 1px dashed #e0e7f5;">
          <div class="flex-between">
            <div><strong>{{ item.user }}</strong> · <span style="color: var(--muted);">{{ item.role }}</span></div>
            <button style="padding: 6px 10px;" @click="showTip = true">提示</button>
          </div>
          <p style="color: var(--muted);">{{ item.text }}</p>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="flex-between">
        <h3 style="margin: 0;">体验实验室</h3>
        <button style="background: #3ac48b;" @click="showTest = true">启动 A/B</button>
      </div>
      <div style="margin-top: 12px;">
        <div class="progress-track">
          <div class="progress-bar" style="width: 50%;"></div>
        </div>
        <p style="color: var(--muted);">动态弹窗展示：对比两种交互动画方案。</p>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showLike" title="批量点赞弹窗">
    <p>已为 8 个作品追加互动热度，所有按钮均提供弹窗反馈。</p>
  </ModalDialog>

  <ModalDialog v-model="showComment" title="新增评论">
    <div class="form-field">
      <label>选择作品</label>
      <select>
        <option v-for="item in feed" :key="item.title">{{ item.title }}</option>
      </select>
    </div>
    <div class="form-field">
      <label>评论内容</label>
      <textarea rows="3" placeholder="分享你的体验..." />
    </div>
    <div class="progress-track">
      <div class="progress-bar" style="width: 70%;"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showTip" title="提示信息">
    <p>所有按钮都使用了 modal 弹窗，确保操作有反馈。</p>
  </ModalDialog>

  <ModalDialog v-model="showTest" title="实验进度">
    <p>正在部署交互动画方案 B，预估 15 秒完成。</p>
    <div class="progress-track">
      <div class="progress-bar" style="width: 45%;"></div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const feed = [
  { title: '流光之翼', message: '弹幕特效上线，互动提升 28%。' },
  { title: '荧火之森', message: '新增夜间模式光晕，停留时长 +18%。' },
  { title: '海上霓虹', message: 'VR 沉浸试听通过评审。' }
];

const comments = [
  { user: 'Mia', role: '策展人', text: '色彩控制得当，后期可考虑增加字幕动画。' },
  { user: 'Alex', role: '开发', text: '3D 模型加载流畅，可继续压缩贴图。' }
];

const showLike = ref(false);
const showComment = ref(false);
const showTip = ref(false);
const showTest = ref(false);
</script>

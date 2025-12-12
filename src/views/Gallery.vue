<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div class="card" v-for="item in artworks" :key="item.title">
      <div style="height: 140px; border-radius: 12px; background: linear-gradient(135deg, #cbe5ff, #f9fbff); display: grid; place-items: center;">
        <div style="text-align: center;">
          <div style="font-weight: 800; font-size: 32px; color: var(--primary);">{{ item.icon }}</div>
          <div style="font-weight: 700;">{{ item.title }}</div>
        </div>
      </div>
      <p style="color: var(--muted); margin: 10px 0;">{{ item.desc }}</p>
      <div class="chip-row">
        <span class="tag">分辨率 {{ item.resolution }}</span>
        <span class="tag">色彩 {{ item.tone }}</span>
      </div>
      <div class="flex-between" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
        <button @click="openUpload(item.title)">上传新版本</button>
        <button style="background: var(--accent);" @click="openPreview(item)">快速预览</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showUpload" title="上传新版本">
    <div class="form-field">
      <label>作品名称</label>
      <input v-model="uploadForm.title" />
    </div>
    <div class="form-field">
      <label>文件</label>
      <input type="file" />
    </div>
    <div class="progress-track" style="margin: 12px 0;">
      <div class="progress-bar"></div>
    </div>
    <p style="color: var(--muted);">模拟上传进度，确保体验弹窗。</p>
  </ModalDialog>

  <ModalDialog v-model="showPreview" title="预览海报">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px;">
      <div class="card" style="background: linear-gradient(135deg, #fff4e3, #fff); min-height: 160px;">
        <div style="font-weight: 800; font-size: 20px;">{{ previewItem.title }}</div>
        <p style="color: var(--muted);">{{ previewItem.desc }}</p>
      </div>
      <div class="card">
        <div class="form-field">
          <label>展示时长</label>
          <input placeholder="30 秒" />
        </div>
        <div class="form-field">
          <label>展位选择</label>
          <select>
            <option>巨幕屏</option>
            <option>移动端</option>
            <option>沉浸式空间</option>
          </select>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const artworks = [
  { title: '晨光云阶', desc: '以冷暖对比表现清晨的律动感。', icon: '🌄', resolution: '4K', tone: '清新' },
  { title: '荧火之森', desc: '夜间光线微微闪烁，突出宁静氛围。', icon: '🌌', resolution: '5K', tone: '幽蓝' },
  { title: '海上霓虹', desc: '水面折射城市霓虹，动感十足。', icon: '🌊', resolution: '4K', tone: '高饱和' },
  { title: '流光之翼', desc: '未来科技元素，线条流畅。', icon: '🪽', resolution: '8K', tone: '冷调' }
];

const showUpload = ref(false);
const showPreview = ref(false);
const previewItem = reactive({ title: '', desc: '' });
const uploadForm = reactive({ title: '' });

const openUpload = (title) => {
  uploadForm.title = title;
  showUpload.value = true;
};

const openPreview = (item) => {
  previewItem.title = item.title;
  previewItem.desc = item.desc;
  showPreview.value = true;
};
</script>

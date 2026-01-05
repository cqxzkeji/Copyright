<template>
  <div>
    <div class="section-header">
      <div>
        <p class="eyebrow">功能一 · 非遗资源采集与管理</p>
        <h2>统一采集文字、图片、音视频与三维模型，完成元数据管理。</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="openForm('采集新资源')">采集资源</button>
        <button class="accent" @click="openProgress('批量导入进度', 35)">批量导入</button>
        <button class="ghost" @click="openInfo('元数据校验', '已完成校验，未发现缺失字段。')">元数据校验</button>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>资源清单（{{ resources.length }} 条）</h3>
        <div class="filters">
          <select v-model="filter.type">
            <option value="">全部类型</option>
            <option value="影像">影像</option>
            <option value="音频">音频</option>
            <option value="图像">图像</option>
            <option value="文档">文档</option>
            <option value="模型">模型</option>
          </select>
          <select v-model="filter.region">
            <option value="">全部地区</option>
            <option v-for="region in uniqueRegions" :key="region">{{ region }}</option>
          </select>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>地区</th>
              <th>文件数</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredResources" :key="item.id">
              <td>{{ item.name }}</td>
              <td><span class="badge">{{ item.type }}</span></td>
              <td>{{ item.region }}</td>
              <td>{{ item.files }}</td>
              <td><span class="chip">{{ item.status }}</span></td>
              <td>
                <button class="ghost" @click="openInfo('资源详情', detailText(item))">详情</button>
                <button class="primary" @click="openProgress('归档同步', 60)">入库</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :show="modal.type === 'form'" :title="modal.title" width="540px" @close="closeModal">
      <div class="input-group">
        <input v-model="form.name" placeholder="资源名称，如：苗绣针法高清图" />
        <select v-model="form.type">
          <option value="影像">影像</option>
          <option value="音频">音频</option>
          <option value="图像">图像</option>
          <option value="文档">文档</option>
          <option value="模型">模型</option>
        </select>
        <input v-model="form.region" placeholder="采集地区，如：贵州黔东南" />
        <textarea v-model="form.desc" rows="3" placeholder="采集说明与版权备注"></textarea>
      </div>
      <template #footer>
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="submitForm">提交采集</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'progress'" :title="modal.title" width="480px" @close="closeModal">
      <p>{{ modal.message }}</p>
      <progress :value="modal.progress" max="100"></progress>
      <p class="progress-text">{{ modal.progress }}% 完成</p>
      <template #footer>
        <button class="primary" @click="closeModal">好的</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'info'" :title="modal.title" width="480px" @close="closeModal">
      <p>{{ modal.message }}</p>
      <template #footer>
        <button class="primary" @click="closeModal">我知道了</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const resources = reactive([
  { id: 1, name: '苗绣针法高清图', type: '图像', region: '贵州黔东南', files: 32, status: '已入库' },
  { id: 2, name: '木鼓舞360视频', type: '影像', region: '云南文山', files: 5, status: '待审核' },
  { id: 3, name: '侗族琵琶歌现场录音', type: '音频', region: '广西三江', files: 8, status: '已入库' },
  { id: 4, name: '徽州砖雕建模', type: '模型', region: '安徽黄山', files: 2, status: '建模中' },
  { id: 5, name: '黎锦纹样矢量文件', type: '文档', region: '海南黎族', files: 16, status: '已入库' },
  { id: 6, name: '潮州木雕刀法示范', type: '影像', region: '广东潮州', files: 4, status: '待审核' },
  { id: 7, name: '剪纸图案合集', type: '图像', region: '陕西延安', files: 28, status: '已入库' },
  { id: 8, name: '傩戏服饰纹样', type: '图像', region: '江西抚州', files: 18, status: '已入库' },
  { id: 9, name: '古琴减字谱稿本', type: '文档', region: '浙江杭州', files: 6, status: '已入库' },
  { id: 10, name: '藏香制作音频', type: '音频', region: '西藏拉萨', files: 9, status: '待审核' },
  { id: 11, name: '皮影光影效果视频', type: '影像', region: '陕西华县', files: 7, status: '已入库' },
  { id: 12, name: '评弹唱腔素材', type: '音频', region: '江苏苏州', files: 12, status: '已入库' },
  { id: 13, name: '苗年节庆场景照片', type: '图像', region: '贵州凯里', files: 20, status: '已入库' },
  { id: 14, name: '藏戏面具扫描模型', type: '模型', region: '西藏日喀则', files: 3, status: '建模中' },
  { id: 15, name: '龙舟鼓点节奏', type: '音频', region: '湖南汨罗', files: 10, status: '已入库' },
  { id: 16, name: '木版年画彩稿', type: '图像', region: '天津杨柳青', files: 14, status: '已入库' },
  { id: 17, name: '景泰蓝工序视频', type: '影像', region: '北京', files: 6, status: '待审核' },
  { id: 18, name: '侗族鼓楼数字模型', type: '模型', region: '贵州黎平', files: 4, status: '已入库' },
  { id: 19, name: '苗族银饰敲制声效', type: '音频', region: '贵州雷山', files: 11, status: '已入库' },
  { id: 20, name: '藏族氆氇织造记录', type: '影像', region: '青海果洛', files: 5, status: '已入库' }
]);

const filter = reactive({ type: '', region: '' });
const form = reactive({ name: '', type: '影像', region: '', desc: '' });
const modal = reactive({ type: '', title: '', message: '', progress: 0 });

const uniqueRegions = computed(() => Array.from(new Set(resources.map((r) => r.region))));

const filteredResources = computed(() =>
  resources.filter(
    (item) => (!filter.type || item.type === filter.type) && (!filter.region || item.region === filter.region)
  )
);

const openForm = (title) => {
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (title, start) => {
  modal.type = 'progress';
  modal.title = title;
  modal.message = '正在处理数据流，请保持应用开启……';
  modal.progress = start;
  const timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 10);
    if (modal.progress >= 100) clearInterval(timer);
  }, 380);
};

const openInfo = (title, message) => {
  modal.type = 'info';
  modal.title = title;
  modal.message = message;
};

const submitForm = () => {
  resources.unshift({
    id: resources.length + 1,
    name: form.name || '未命名资源',
    type: form.type,
    region: form.region || '待确认',
    files: Math.ceil(Math.random() * 8) + 2,
    status: '待审核'
  });
  closeModal();
  openProgress('提交采集任务', 45);
};

const detailText = (item) =>
  `${item.name} ｜ 类型：${item.type} ｜ 区域：${item.region} ｜ 文件数：${item.files}`;

const closeModal = () => {
  modal.type = '';
  modal.title = '';
  modal.message = '';
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.table-wrapper {
  overflow-x: auto;
}

.accent {
  background: linear-gradient(120deg, #ffb347, #ffd966);
  color: #5c3100;
}

.ghost {
  background: #f1f5ff;
  color: #1f2a44;
  border: 1px solid var(--border);
}
</style>

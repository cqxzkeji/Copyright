<template>
  <div class="card">
    <div class="section-title">CT影像数据管理</div>
    <div class="toolbar">
      <button @click="showImport = true">导入影像</button>
      <button @click="startClassify">分类存储</button>
      <button @click="showInfo = true">基础信息管理</button>
      <button @click="showPreview = true">快速预览</button>
    </div>
    <p class="muted">支持颌骨CT影像导入、标签、分类与基础信息维护。列表含 20+ 条样本数据。</p>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>患者</th>
          <th>扫描日期</th>
          <th>分辨率</th>
          <th>标签</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in ctList" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.date }}</td>
          <td>{{ row.resolution }}</td>
          <td><span class="tag">{{ row.label }}</span></td>
          <td>{{ row.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showImport" title="导入影像" confirm-text="开始导入" @confirm="confirmImport">
    <label>影像文件路径
      <input v-model="importForm.path" placeholder="/data/jaw_ct_001.nii.gz" />
    </label>
    <label>所属分组
      <select v-model="importForm.group">
        <option>训练集</option>
        <option>验证集</option>
        <option>测试集</option>
      </select>
    </label>
  </BaseModal>

  <BaseModal v-model="showInfo" title="基础信息管理" confirm-text="保存信息" @confirm="confirmInfo">
    <label>患者编号
      <input v-model="infoForm.id" placeholder="CT-202401" />
    </label>
    <label>补充描述
      <textarea rows="3" v-model="infoForm.desc" placeholder="填写扫描角度、对比剂信息等"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="showPreview" title="预览影像切片" confirm-text="关闭" @confirm="() => (showPreview = false)">
    <div class="grid">
      <div class="stat">
        <div class="muted">切片 32</div>
        <div class="section-title">囊肿疑似区域</div>
        <p>自动高亮出 0.8 cm³ 低密度区域。</p>
      </div>
      <div class="stat">
        <div class="muted">重建视图</div>
        <div class="section-title">轴位 + 冠状位</div>
        <p>分辨率 {{ preview.resolution }} ，窗宽 {{ preview.window }} 。</p>
      </div>
    </div>
  </BaseModal>

  <BaseModal v-model="showClassify" title="分类存储进度" confirm-text="好的" @confirm="() => (showClassify = false)">
    <p>正在按患者分组重排文件夹结构，并同步标签。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: classifyProgress + '%' }"></div>
    </div>
    <p class="muted">{{ classifyProgress }}% 已完成</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const ctList = Array.from({ length: 22 }).map((_, idx) => ({
  id: `CT-${String(idx + 1).padStart(3, '0')}`,
  name: `患者${idx + 1}`,
  date: `2024-0${(idx % 9) + 1}-1${idx % 9}`,
  resolution: `${512 - idx * 2}x${512 - idx * 2}`,
  label: idx % 3 === 0 ? '囊肿' : idx % 3 === 1 ? '牙源性囊肿' : '骨性囊肿',
  status: idx % 2 === 0 ? '已标注' : '待标注'
}));

const showImport = ref(false);
const showInfo = ref(false);
const showPreview = ref(false);
const showClassify = ref(false);
const classifyProgress = ref(0);
let timer;

const importForm = reactive({ path: '', group: '训练集' });
const infoForm = reactive({ id: '', desc: '' });
const preview = reactive({ resolution: '512x512', window: '450' });

const confirmImport = () => {
  showImport.value = false;
  alert(`已记录导入: ${importForm.path} (${importForm.group})`);
};

const confirmInfo = () => {
  showInfo.value = false;
  alert(`基础信息已保存: ${infoForm.id}`);
};

const startClassify = () => {
  showClassify.value = true;
  classifyProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    classifyProgress.value = Math.min(100, classifyProgress.value + 15);
    if (classifyProgress.value >= 100) {
      clearInterval(timer);
    }
  }, 500);
};
</script>

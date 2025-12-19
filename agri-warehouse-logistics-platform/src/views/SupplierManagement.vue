<template>
  <div class="page">
    <div class="grid two">
      <div class="card">
        <div class="section-title">产地分布与合作热度</div>
        <div class="hero-image">产地签约图谱 · 实时更新</div>
      </div>
      <div class="card">
        <div class="section-title">供应主体活跃度</div>
        <div class="chart-bars">
          <div v-for="bar in chartData" :key="bar.name" class="bar" :style="{ height: bar.value + '%' }">
            {{ bar.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">供应主体列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>主体编号</th>
            <th>产地</th>
            <th>负责人</th>
            <th>品类</th>
            <th>合作等级</th>
            <th>最近评估</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in suppliers" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.origin }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.category }}</td>
            <td><span class="badge">{{ item.level }}</span></td>
            <td>{{ item.review }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-title">主体管理操作</div>
      <div class="grid three">
        <button class="primary-btn" @click="openForm">新增合作主体</button>
        <button class="ghost-btn" @click="openProgress">同步评估进度</button>
        <button class="ghost-btn" @click="openInfo">风险提示</button>
      </div>
    </div>

    <BaseModal v-if="showForm" title="新增合作主体" @close="showForm = false">
      <div class="input-group">
        <label>主体名称</label>
        <input v-model="form.name" placeholder="请输入主体名称" />
      </div>
      <div class="input-group">
        <label>产地</label>
        <input v-model="form.origin" placeholder="请输入产地" />
      </div>
      <div class="input-group">
        <label>主要品类</label>
        <input v-model="form.category" placeholder="如：苹果/大米" />
      </div>
      <div class="input-group">
        <label>合作等级</label>
        <select v-model="form.level">
          <option>核心</option>
          <option>重点</option>
          <option>潜力</option>
        </select>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showForm = false">取消</button>
        <button class="primary-btn" @click="submitForm">提交</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showProgress" title="评估同步进度" @close="showProgress = false">
      <p>正在同步 12 个产地主体的最新评估与信用等级。</p>
      <div class="progress-bar" style="margin-top: 12px;">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showProgress = false">关闭</button>
        <button class="primary-btn" @click="boostProgress">加速同步</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showInfo" title="供应风险提示" @close="showInfo = false">
      <p>南部产区近期出现低温影响，建议加强叶菜类供应的备选方案。</p>
      <div class="actions">
        <button class="primary-btn" @click="showInfo = false">我知道了</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { name: '华北', value: 80 },
  { name: '东北', value: 62 },
  { name: '华东', value: 90 },
  { name: '华中', value: 70 },
  { name: '华南', value: 55 },
  { name: '西南', value: 76 }
];

const suppliers = [
  { id: 'SUP-001', origin: '山东烟台', owner: '刘晓峰', category: '苹果', level: '核心', review: '2024-06-01' },
  { id: 'SUP-002', origin: '河北邯郸', owner: '王志强', category: '小麦', level: '重点', review: '2024-06-02' },
  { id: 'SUP-003', origin: '海南三亚', owner: '陈敏', category: '椰子', level: '潜力', review: '2024-06-03' },
  { id: 'SUP-004', origin: '云南昆明', owner: '李春', category: '鲜花', level: '核心', review: '2024-06-04' },
  { id: 'SUP-005', origin: '内蒙古呼和浩特', owner: '张伟', category: '牛羊肉', level: '重点', review: '2024-06-05' },
  { id: 'SUP-006', origin: '吉林长春', owner: '赵倩', category: '大豆', level: '潜力', review: '2024-06-06' },
  { id: 'SUP-007', origin: '广西南宁', owner: '周鹏', category: '甘蔗', level: '重点', review: '2024-06-07' },
  { id: 'SUP-008', origin: '陕西宝鸡', owner: '孙丽', category: '猕猴桃', level: '核心', review: '2024-06-08' },
  { id: 'SUP-009', origin: '四川成都', owner: '郑明', category: '蔬菜', level: '重点', review: '2024-06-09' },
  { id: 'SUP-010', origin: '江西赣州', owner: '黄蓉', category: '脐橙', level: '潜力', review: '2024-06-10' },
  { id: 'SUP-011', origin: '安徽合肥', owner: '高洋', category: '稻米', level: '重点', review: '2024-06-11' },
  { id: 'SUP-012', origin: '宁夏银川', owner: '马岩', category: '枸杞', level: '核心', review: '2024-06-12' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(48);

const form = reactive({
  name: '',
  origin: '',
  category: '',
  level: '核心'
});

const openForm = () => {
  showForm.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

const openInfo = () => {
  showInfo.value = true;
};

const submitForm = () => {
  showForm.value = false;
};

const boostProgress = () => {
  progress.value = Math.min(100, progress.value + 20);
};
</script>

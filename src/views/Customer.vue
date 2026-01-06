<template>
  <div class="grid" style="gap:16px">
    <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:800;font-size:18px">客户与需求管理</div>
        <div style="color:#6b7c8c">统一管理档案、行业属性与定制需求</div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;">
        <button class="btn ghost" @click="openModal('import')">批量导入</button>
        <button class="btn" @click="openModal('add')">新增需求</button>
      </div>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom:10px;">
        <div>
          <div style="font-weight:800">客户需求列表</div>
          <div style="color:#6b7c8c">含 20+ 条档案，可追溯到历史订单与性能指标</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <input class="input" style="max-width:200px" v-model="keyword" placeholder="搜索客户或钢种" />
          <button class="btn ghost" @click="openModal('filter')">筛选</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>客户</th><th>行业</th><th>钢种</th><th>规格</th><th>性能指标</th><th>交期</th><th>状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>{{ item.customer }}</td>
            <td>{{ item.industry }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.spec }}</td>
            <td>{{ item.performance }}</td>
            <td>{{ item.delivery }}</td>
            <td><span class="badge" :class="item.status === '审批中' ? 'warning' : 'success'">{{ item.status }}</span></td>
            <td>
              <button class="btn ghost" style="padding:6px 8px" @click="openDetail(item)">详情</button>
              <button class="btn ghost" style="padding:6px 8px" @click="openModal('trace')">追溯</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="closeModal">
      <template v-if="activeModal==='add'">
        <p>录入客户定制需求，字段对应执行标准与检测规范。</p>
        <div class="form-row">
          <div><label>客户名称</label><input class="input" v-model="form.customer" /></div>
          <div><label>行业属性</label><select v-model="form.industry"><option>能源</option><option>装备</option><option>汽车</option><option>模具</option></select></div>
          <div><label>钢种</label><input class="input" v-model="form.grade" /></div>
          <div><label>规格</label><input class="input" v-model="form.spec" /></div>
        </div>
        <div class="form-row">
          <div><label>性能指标</label><input class="input" v-model="form.performance" /></div>
          <div><label>交期</label><input class="input" v-model="form.delivery" type="date" /></div>
          <div><label>执行标准</label><input class="input" placeholder="GB/T 3077" /></div>
          <div><label>检测规范</label><input class="input" placeholder="超声、硬度、探伤" /></div>
        </div>
      </template>
      <template v-else-if="activeModal==='import'">
        <p>支持 Excel 模板导入客户与需求信息。</p>
        <div class="progress-bar" style="margin:8px 0"><div :style="{ width: '40%' }"></div></div>
        <p style="color:#5c6b7a">导入时校验钢种、规格与执行标准的合法性。</p>
      </template>
      <template v-else-if="activeModal==='filter'">
        <p>根据行业、钢种、状态过滤客户需求。</p>
        <div class="form-row">
          <div><label>行业</label><select><option>全部</option><option>能源</option><option>装备</option><option>模具</option></select></div>
          <div><label>状态</label><select><option>审批中</option><option>已通过</option></select></div>
        </div>
      </template>
      <template v-else-if="activeModal==='trace'">
        <p>展示历史订单、成分检测与性能曲线，确保需求可追溯。</p>
        <div class="progress-bar"><div :style="{ width: '72%' }"></div></div>
      </template>
      <template v-else>
        <p>客户：{{ current?.customer }}</p>
        <p>需求钢种：{{ current?.grade }}，交期 {{ current?.delivery }}</p>
        <p>历史订单编号：HT{{ current?.id }}{{ current?.id }}</p>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const list = [
  { id: 1, customer: '华能电力', industry: '能源', grade: '20CrMo', spec: 'φ120mm', performance: '屈服≥900MPa', delivery: '2024-06-10', status: '审批中' },
  { id: 2, customer: '三一重工', industry: '装备', grade: '42CrMo', spec: '板厚 40mm', performance: '冲击≥34J', delivery: '2024-06-12', status: '已通过' },
  { id: 3, customer: '一汽模具', industry: '模具', grade: 'P20', spec: '块料 300*400', performance: '硬度 32-36HRC', delivery: '2024-06-15', status: '审批中' },
  { id: 4, customer: '中车轨交', industry: '装备', grade: '50CrVA', spec: '轨轴 160mm', performance: '疲劳≥10^7', delivery: '2024-06-18', status: '已通过' },
  { id: 5, customer: '宝钢汽配', industry: '汽车', grade: '20CrMnTi', spec: '齿轮 60mm', performance: '渗碳硬度 58HRC', delivery: '2024-06-11', status: '审批中' },
  { id: 6, customer: '沈鼓集团', industry: '装备', grade: '17-4PH', spec: '环件 200mm', performance: '抗拉≥1100MPa', delivery: '2024-06-20', status: '审批中' },
  { id: 7, customer: '国机重装', industry: '装备', grade: '5CrNiMo', spec: '锻件 320mm', performance: '冲击≥27J', delivery: '2024-06-22', status: '已通过' },
  { id: 8, customer: '美的压缩机', industry: '家电', grade: '40Cr', spec: '棒材 80mm', performance: '硬度 229HB', delivery: '2024-06-14', status: '已通过' },
  { id: 9, customer: '徐工起重', industry: '装备', grade: '30CrNiMo8', spec: '轴 140mm', performance: '屈服≥980MPa', delivery: '2024-06-09', status: '审批中' },
  { id: 10, customer: '比亚迪', industry: '汽车', grade: 'SCM440', spec: '板材 30mm', performance: '冲击≥47J', delivery: '2024-06-16', status: '审批中' },
  { id: 11, customer: '宁德时代', industry: '能源', grade: '1Cr17Ni2', spec: '带材 5mm', performance: '抗腐蚀', delivery: '2024-06-28', status: '审批中' },
  { id: 12, customer: '东方风电', industry: '能源', grade: '35CrMo', spec: '锻件 260mm', performance: '屈服≥930MPa', delivery: '2024-06-25', status: '已通过' },
  { id: 13, customer: '哈电汽轮', industry: '能源', grade: '9Cr1Mo', spec: '厚板 60mm', performance: '抗蠕变', delivery: '2024-06-29', status: '审批中' },
  { id: 14, customer: '宝能模具', industry: '模具', grade: 'H13', spec: '模胚 400*500', performance: '硬度 46-48HRC', delivery: '2024-06-26', status: '已通过' },
  { id: 15, customer: '首钢矿业', industry: '矿山', grade: 'NM500', spec: '耐磨板 20mm', performance: '硬度 480HB', delivery: '2024-07-02', status: '审批中' },
  { id: 16, customer: '河钢轴承', industry: '机械', grade: 'GCr15', spec: '套圈 70mm', performance: '硬度 60HRC', delivery: '2024-06-21', status: '已通过' },
  { id: 17, customer: '宝信钢构', industry: '建筑', grade: 'Q550D', spec: 'H 型钢', performance: '屈服≥550MPa', delivery: '2024-07-05', status: '审批中' },
  { id: 18, customer: '联想服务器', industry: 'IT', grade: '304', spec: '板材 3mm', performance: '抗腐蚀', delivery: '2024-06-19', status: '已通过' },
  { id: 19, customer: '莱钢汽轴', industry: '汽车', grade: '20MnCr5', spec: '轴 90mm', performance: '渗碳硬度 58HRC', delivery: '2024-06-24', status: '审批中' },
  { id: 20, customer: '山推工程', industry: '装备', grade: 'Q690', spec: '高强板 16mm', performance: '屈服≥690MPa', delivery: '2024-06-27', status: '已通过' },
  { id: 21, customer: '华润电力', industry: '能源', grade: '12Cr1MoV', spec: '管材 120mm', performance: '耐高温', delivery: '2024-07-03', status: '审批中' },
  { id: 22, customer: '中联重科', industry: '装备', grade: '40CrNiMo', spec: '轴 180mm', performance: '疲劳≥10^7', delivery: '2024-07-06', status: '审批中' }
];

const keyword = ref('');
const activeModal = ref('');
const modalTitle = ref('');
const current = ref(null);
const form = reactive({ customer: '', industry: '', grade: '', spec: '', performance: '', delivery: '' });

const filtered = computed(() =>
  list.filter(
    (i) =>
      i.customer.includes(keyword.value) ||
      i.grade.toLowerCase().includes(keyword.value.toLowerCase()) ||
      i.industry.includes(keyword.value)
  )
);

const openModal = (key) => {
  activeModal.value = key;
  modalTitle.value = `操作：${key}`;
};

const openDetail = (row) => {
  current.value = row;
  activeModal.value = 'detail';
  modalTitle.value = '需求详情';
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

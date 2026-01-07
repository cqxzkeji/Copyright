<template>
  <div class="section">
    <div class="section-title">产品配置概览</div>
    <div class="card-grid">
      <div class="card">
        <h3>可选标准库</h3>
        <p>{{ stats.standards }} 项</p>
      </div>
      <div class="card">
        <h3>定制方案</h3>
        <p>{{ stats.plans }} 套</p>
      </div>
      <div class="card">
        <h3>规格匹配率</h3>
        <p>{{ stats.matchRate }}%</p>
      </div>
      <div class="card">
        <h3>待审批参数</h3>
        <p>{{ stats.pending }} 条</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">热销规格分布</div>
    <div class="chart">
      <div v-for="item in chart" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">配置功能</div>
    <div class="button-row">
      <button class="btn" type="button" @click="openModal('config')">参数配置</button>
      <button class="btn secondary" type="button" @click="openModal('validate')">标准校验</button>
      <button class="btn ghost" type="button" @click="openModal('plan')">生成方案</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">定制产品清单</div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>产品型号</th>
            <th>适用标准</th>
            <th>规格范围</th>
            <th>强度等级</th>
            <th>定制要点</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.model">
            <td>{{ item.model }}</td>
            <td>{{ item.standard }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.focus }}</td>
            <td>{{ item.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'config'" title="参数配置" @close="activeModal = ''">
    <form>
      <div>
        <label>规格范围</label>
        <input type="text" placeholder="例如 20-120mm" />
      </div>
      <div>
        <label>标准选择</label>
        <select>
          <option>GB/T 1591 高强度结构钢</option>
          <option>GB/T 3077 合金结构钢</option>
          <option>ASTM A572 高强度低合金钢</option>
        </select>
      </div>
      <div>
        <label>个性化需求</label>
        <textarea rows="3" placeholder="输入客户定制要求"></textarea>
      </div>
      <div class="button-row">
        <button class="btn" type="button">提交配置</button>
        <button class="btn ghost" type="button" @click="activeModal = ''">取消</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'validate'" title="标准校验进度" @close="activeModal = ''">
    <p style="margin-top: 0;">正在校验配置参数与标准库的一致性。</p>
    <div class="progress-bar">
      <span style="width: 64%;"></span>
    </div>
    <p style="margin: 12px 0 0; color: var(--muted);">已校验 64%，预计 1 分钟完成。</p>
  </BaseModal>

  <BaseModal v-if="activeModal === 'plan'" title="定制方案生成" @close="activeModal = ''">
    <p style="margin-top: 0;">系统已生成 3 套可选方案，已推送给技术团队。</p>
    <button class="btn" type="button" @click="activeModal = ''">查看方案</button>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = {
  standards: 48,
  plans: 36,
  matchRate: 91,
  pending: 12
};

const chart = [
  { label: 'Q355', value: 52 },
  { label: 'Q460', value: 68 },
  { label: 'Q500', value: 45 },
  { label: 'Q690', value: 76 },
  { label: 'Q890', value: 58 },
  { label: '特种', value: 40 }
];

const products = [
  { model: 'UT-355A', standard: 'GB/T 1591', size: '20-80mm', grade: 'Q355B', focus: '焊接性能', owner: '黄哲' },
  { model: 'UT-460M', standard: 'GB/T 1591', size: '30-120mm', grade: 'Q460C', focus: '冲击韧性', owner: '周彤' },
  { model: 'UT-500X', standard: 'GB/T 3077', size: '20-60mm', grade: '42CrMo', focus: '回火硬度', owner: '林玉' },
  { model: 'UT-690G', standard: 'EN 10025', size: '40-140mm', grade: 'S690QL', focus: '低温性能', owner: '丁晨' },
  { model: 'UT-890P', standard: 'ASTM A572', size: '12-60mm', grade: 'Grade 65', focus: '强度稳定', owner: '姚青' },
  { model: 'UT-355N', standard: 'GB/T 1591', size: '20-90mm', grade: 'Q355D', focus: '耐候性', owner: '董林' },
  { model: 'UT-460R', standard: 'GB/T 1591', size: '25-100mm', grade: 'Q460D', focus: '耐疲劳', owner: '潘悦' },
  { model: 'UT-500S', standard: 'GB/T 3077', size: '25-75mm', grade: '40CrNiMo', focus: '强韧结合', owner: '宋宇' },
  { model: 'UT-690H', standard: 'EN 10025', size: '30-120mm', grade: 'S690Q', focus: '焊接性', owner: '邢楠' },
  { model: 'UT-890Z', standard: 'ASTM A514', size: '16-80mm', grade: 'Grade 100', focus: '厚板性能', owner: '郑峰' },
  { model: 'UT-355L', standard: 'GB/T 1591', size: '20-70mm', grade: 'Q355C', focus: '热处理优化', owner: '齐思' },
  { model: 'UT-460X', standard: 'GB/T 1591', size: '40-120mm', grade: 'Q460E', focus: '低温韧性', owner: '杜航' },
  { model: 'UT-500N', standard: 'GB/T 3077', size: '30-90mm', grade: '35CrMo', focus: '耐磨性能', owner: '韩宇' },
  { model: 'UT-690M', standard: 'EN 10025', size: '50-140mm', grade: 'S690QL', focus: '厚板交付', owner: '郭超' },
  { model: 'UT-890T', standard: 'ASTM A572', size: '16-65mm', grade: 'Grade 70', focus: '强度控制', owner: '刘欣' },
  { model: 'UT-355P', standard: 'GB/T 1591', size: '18-60mm', grade: 'Q355B', focus: '表面质量', owner: '叶青' },
  { model: 'UT-460Q', standard: 'GB/T 1591', size: '25-110mm', grade: 'Q460C', focus: '晶粒控制', owner: '曹宇' },
  { model: 'UT-500H', standard: 'GB/T 3077', size: '20-80mm', grade: '42CrMo', focus: '淬火深度', owner: '孟佳' },
  { model: 'UT-690R', standard: 'EN 10025', size: '40-120mm', grade: 'S690QL', focus: '交货周期', owner: '罗鑫' },
  { model: 'UT-890V', standard: 'ASTM A514', size: '22-90mm', grade: 'Grade 110', focus: '耐蚀性能', owner: '苏蕾' }
];

const activeModal = ref('');

const openModal = (name) => {
  activeModal.value = name;
};
</script>

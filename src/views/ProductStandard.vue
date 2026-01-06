<template>
  <div class="grid" style="gap:16px">
    <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:800;font-size:18px">产品与技术标准管理</div>
        <div style="color:#6b7c8c">维护牌号、化学成分、力学性能与检测规范</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn ghost" @click="openModal('template')">模板配置</button>
        <button class="btn" @click="openModal('add')">新增牌号</button>
      </div>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom:10px;">
        <div>
          <div style="font-weight:800">技术标准库</div>
          <div style="color:#6b7c8c">覆盖多种优特钢牌号的成分、性能与执行标准</div>
        </div>
        <button class="btn ghost" @click="openModal('export')">导出</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>牌号</th><th>化学成分</th><th>力学性能</th><th>执行标准</th><th>检测规范</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in standards" :key="item.grade">
            <td>{{ item.grade }}</td>
            <td>{{ item.chem }}</td>
            <td>{{ item.mechanic }}</td>
            <td>{{ item.standard }}</td>
            <td>{{ item.test }}</td>
            <td>
              <button class="btn ghost" style="padding:6px 8px" @click="openModal(item.grade)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:800">参数模板</div>
          <div style="color:#6b7c8c">快速选择性能指标与检测项目</div>
        </div>
        <button class="btn ghost" @click="openModal('apply')">应用模板</button>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px,1fr));margin-top:10px;">
        <div class="card" style="padding:12px;" v-for="tpl in templates" :key="tpl.name">
          <div style="font-weight:700">{{ tpl.name }}</div>
          <div style="color:#6b7c8c;font-size:12px">{{ tpl.desc }}</div>
          <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">
            <span class="tag" v-for="tag in tpl.items" :key="tag">{{ tag }}</span>
          </div>
          <button class="btn ghost" style="margin-top:8px;padding:6px 10px" @click="openModal(tpl.name)">选择</button>
        </div>
      </div>
    </div>

    <ModalDialog v-if="activeModal" :title="modalTitle" @close="activeModal=''" @confirm="activeModal=''">
      <template v-if="activeModal==='add'">
        <p>新增牌号并录入化学成分、力学性能范围。</p>
        <div class="form-row">
          <div><label>牌号</label><input class="input" placeholder="20CrNiMo" /></div>
          <div><label>执行标准</label><input class="input" placeholder="GB/T 3077" /></div>
          <div><label>热处理状态</label><select><option>退火</option><option>调质</option><option>正火</option></select></div>
        </div>
        <textarea rows="4" placeholder="成分与性能描述"></textarea>
      </template>
      <template v-else-if="activeModal==='template'">
        <p>配置技术参数模板，复用化学成分、硬度、冲击等指标。</p>
        <div class="progress-bar"><div :style="{ width: '55%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='export'">
        <p>导出标准库，支持 PDF/Excel。</p>
        <div class="progress-bar"><div :style="{ width: '36%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='apply'">
        <p>将模板应用到当前定制方案，自动匹配检测规范。</p>
        <div class="form-row">
          <div><label>选择模板</label><select><option v-for="tpl in templates" :key="tpl.name">{{ tpl.name }}</option></select></div>
          <div><label>目标客户</label><input class="input" placeholder="华能电力" /></div>
        </div>
      </template>
      <template v-else>
        <p>预览：{{ activeModal }}</p>
        <p style="color:#5c6b7a">确认后将同步到订单执行与检测环节。</p>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const standards = [
  { grade: '20CrMo', chem: 'C 0.17-0.24 Cr 0.9-1.2 Mo 0.15-0.25', mechanic: 'σb≥980MPa, AK≥39J', standard: 'GB/T 3077', test: '硬度、冲击、超声' },
  { grade: '42CrMo', chem: 'C 0.38-0.45 Cr 0.9-1.2 Mo 0.15-0.25', mechanic: 'σb≥1080MPa, AK≥47J', standard: 'GB/T 3077', test: '硬度、金相、冲击' },
  { grade: 'P20', chem: 'C 0.28-0.4 Cr 1.4-2.0 Ni 0.8-1.2', mechanic: '硬度 32-36HRC', standard: 'GB/T 24186', test: '硬度、探伤、尺寸' },
  { grade: 'H13', chem: 'C 0.32-0.45 Cr 4.75-5.5 Mo 1.1-1.75', mechanic: '硬度 46-48HRC, AK≥27J', standard: 'GB/T 1299', test: '硬度、超声、晶粒度' },
  { grade: 'GCr15', chem: 'C 0.95-1.05 Cr 1.4-1.65', mechanic: 'HRC 60, AK≥20J', standard: 'GB/T 18254', test: '脱碳、超声、硬度' },
  { grade: '17-4PH', chem: 'Cr 15-17.5 Ni 3-5 Cu 3-5', mechanic: 'σb≥1100MPa', standard: 'ASTM A564', test: '尺寸、硬度、盐雾' },
  { grade: '30CrNiMo8', chem: 'C 0.26-0.34 Cr 1.8-2.2 Ni 1.8-2.2 Mo 0.3-0.5', mechanic: 'σb≥1200MPa', standard: 'EN 10269', test: '冲击、硬度、磁粉' },
  { grade: '9Cr1Mo', chem: 'C 0.08-0.12 Cr 8-9.5 Mo 0.85-1.05', mechanic: '抗蠕变，σb≥620MPa', standard: 'ASME SA335', test: '硬度、组织、超声' }
];

const templates = [
  { name: '轴承钢检测模板', desc: '洁净度、脱碳层、硬度一致性', items: ['洁净度', '脱碳', '硬度', '探伤'] },
  { name: '模具钢性能模板', desc: '淬透性、韧性、热处理硬度', items: ['硬度', '冲击', '显微组织'] },
  { name: '高强钢焊接模板', desc: '冲击韧性、焊接性能验证', items: ['冲击', '弯曲', '金相'] }
];

const activeModal = ref('');
const modalTitle = ref('');

const openModal = (key) => {
  activeModal.value = key;
  modalTitle.value = `操作：${key}`;
};
</script>

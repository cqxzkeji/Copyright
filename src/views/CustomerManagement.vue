<template>
  <div class="section">
    <div class="section-title">客户管理与匹配</div>
    <div class="card-grid">
      <div class="card">
        <h3>活跃客户</h3>
        <p>{{ stats.active }} 家</p>
      </div>
      <div class="card">
        <h3>本月新增</h3>
        <p>{{ stats.new }} 家</p>
      </div>
      <div class="card">
        <h3>匹配成功率</h3>
        <p>{{ stats.matchRate }}%</p>
      </div>
      <div class="card">
        <h3>待跟进需求</h3>
        <p>{{ stats.pending }} 条</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">客户需求趋势图</div>
    <div class="chart">
      <div v-for="item in chart" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">功能操作</div>
    <div class="button-row">
      <button class="btn" type="button" @click="openModal('create')">新增客户</button>
      <button class="btn secondary" type="button" @click="openModal('match')">需求匹配</button>
      <button class="btn ghost" type="button" @click="openModal('notify')">发送提示</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">客户清单</div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>客户名称</th>
            <th>行业</th>
            <th>定制需求</th>
            <th>匹配等级</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in customers" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.industry }}</td>
            <td>{{ item.request }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'create'" title="新增客户" @close="activeModal = ''">
    <form>
      <div>
        <label>客户名称</label>
        <input type="text" placeholder="输入客户名称" />
      </div>
      <div>
        <label>所属行业</label>
        <input type="text" placeholder="输入行业类型" />
      </div>
      <div>
        <label>需求分类</label>
        <select>
          <option>高强度结构钢</option>
          <option>耐磨板材</option>
          <option>特种合金</option>
        </select>
      </div>
      <div class="button-row">
        <button class="btn" type="button">保存</button>
        <button class="btn ghost" type="button" @click="activeModal = ''">取消</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'match'" title="需求匹配进度" @close="activeModal = ''">
    <p style="margin-top: 0;">系统正在匹配客户需求与现有标准产品。</p>
    <div class="progress-bar">
      <span style="width: 72%;"></span>
    </div>
    <p style="margin: 12px 0 0; color: var(--muted);">已完成 72%，预计 2 分钟完成。</p>
  </BaseModal>

  <BaseModal v-if="activeModal === 'notify'" title="通知提示" @close="activeModal = ''">
    <p style="margin-top: 0;">已为重点客户生成定制需求提示并推送给销售负责人。</p>
    <button class="btn" type="button" @click="activeModal = ''">知道了</button>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = {
  active: 128,
  new: 16,
  matchRate: 86,
  pending: 24
};

const chart = [
  { label: '一月', value: 40 },
  { label: '二月', value: 55 },
  { label: '三月', value: 62 },
  { label: '四月', value: 48 },
  { label: '五月', value: 70 },
  { label: '六月', value: 58 }
];

const customers = [
  { name: '华北重工', industry: '装备制造', request: '高强度板材', level: 'A', owner: '李娜', status: '跟进中' },
  { name: '三江能源', industry: '能源', request: '耐腐蚀钢管', level: 'A', owner: '周博', status: '已匹配' },
  { name: '宏越工程', industry: '基建', request: '高韧性钢筋', level: 'B', owner: '张凯', status: '待确认' },
  { name: '远航船舶', industry: '船舶', request: '低温钢板', level: 'A', owner: '王杰', status: '已匹配' },
  { name: '凌峰风电', industry: '新能源', request: '厚壁钢材', level: 'B', owner: '刘欣', status: '跟进中' },
  { name: '恒久矿业', industry: '矿山', request: '耐磨板材', level: 'A', owner: '陈伟', status: '已匹配' },
  { name: '广诚设备', industry: '装备制造', request: '特种合金', level: 'B', owner: '许晨', status: '待确认' },
  { name: '启盛桥梁', industry: '基建', request: '高强桥梁钢', level: 'A', owner: '赵倩', status: '跟进中' },
  { name: '鑫龙机械', industry: '机械制造', request: '耐疲劳钢', level: 'B', owner: '韩宇', status: '已匹配' },
  { name: '鼎顺轨交', industry: '轨道交通', request: '轨道钢材', level: 'A', owner: '宋扬', status: '待确认' },
  { name: '宏盛化工', industry: '化工', request: '耐腐蚀合金', level: 'B', owner: '蒋宁', status: '已匹配' },
  { name: '瑞达电力', industry: '能源', request: '耐高温钢', level: 'A', owner: '叶青', status: '跟进中' },
  { name: '海川海工', industry: '海工', request: '防海水腐蚀钢', level: 'A', owner: '沈毅', status: '已匹配' },
  { name: '山河重装', industry: '重工', request: '超厚板材', level: 'B', owner: '杜航', status: '待确认' },
  { name: '远东物流', industry: '物流', request: '集装箱钢板', level: 'B', owner: '冯雪', status: '跟进中' },
  { name: '中岳环保', industry: '环保', request: '耐磨钢板', level: 'B', owner: '丁敏', status: '已匹配' },
  { name: '安泰矿业', industry: '矿山', request: '高强度支护钢', level: 'A', owner: '吕明', status: '待确认' },
  { name: '星域智造', industry: '智能制造', request: '高精度钢材', level: 'B', owner: '郭超', status: '跟进中' },
  { name: '蓝澜工程', industry: '基建', request: '桥梁加固钢', level: 'A', owner: '潘悦', status: '已匹配' },
  { name: '新航航空', industry: '航空', request: '特种合金', level: 'A', owner: '邵鹏', status: '待确认' }
];

const activeModal = ref('');

const openModal = (name) => {
  activeModal.value = name;
};
</script>

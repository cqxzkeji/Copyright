<template>
  <div class="grid">
    <div class="section-title">
      <h2>公众反馈管理</h2>
      <div class="actions">
        <button class="btn" @click="openModal('collect')">收集意见</button>
        <button class="btn secondary" @click="openModal('reply')">批量回复</button>
        <button class="btn secondary" @click="openModal('survey')">满意度调查</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="card">
        <p class="tip">本月收件</p>
        <h3 style="margin: 4px 0;">148 条</h3>
        <div class="progress-bar"><span :style="{ width: '78%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">已办结</p>
        <h3 style="margin: 4px 0;">132 条</h3>
        <div class="progress-bar"><span :style="{ width: '89%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">平均响应</p>
        <h3 style="margin: 4px 0;">6.2 小时</h3>
        <div class="progress-bar"><span :style="{ width: '62%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">满意率</p>
        <h3 style="margin: 4px 0;">94%</h3>
        <div class="progress-bar"><span :style="{ width: '94%' }"></span></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">
        <h3>诉求与建议</h3>
        <p class="tip">实时跟踪居民反馈，闭环处理进度</p>
      </div>
      <div class="chart-bar" style="background:#f8fbff;border:1px dashed #dbe6ff;">
        <div v-for="item in chartData" :key="item.label" class="bar" :style="{ height: item.value + 'px' }">
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>类型</th>
              <th>街道</th>
              <th>内容摘要</th>
              <th>受理人</th>
              <th>状态</th>
              <th>满意度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in feedback" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.street }}</td>
              <td>{{ item.desc }}</td>
              <td>{{ item.owner }}</td>
              <td><span class="tag" :class="item.status === '已办结' ? 'success' : 'info'">{{ item.status }}</span></td>
              <td>{{ item.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="section-title">
          <h3>{{ modalTitle }}</h3>
          <button class="btn secondary" @click="closeModal">关闭</button>
        </div>
        <div v-if="modal === 'collect'" class="grid" style="gap: 12px;">
          <label>反馈主题</label>
          <input placeholder="如：小区路灯不亮" />
          <label>详细描述</label>
          <textarea rows="3" placeholder="填写居民诉求与建议"></textarea>
          <button class="btn">登记反馈</button>
        </div>
        <div v-else-if="modal === 'reply'" class="grid" style="gap: 12px;">
          <p class="tip">选择待回复事项，系统将自动推送模板信息。</p>
          <select>
            <option v-for="item in feedback" :key="item.id">{{ item.id }} - {{ item.desc }}</option>
          </select>
          <button class="btn">批量回复</button>
        </div>
        <div v-else class="grid" style="gap: 12px;">
          <p class="tip">生成满意度问卷并推送到居民群。</p>
          <div class="progress-bar"><span :style="{ width: '58%' }"></span></div>
          <button class="btn">生成调查</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const feedback = reactive([
  { id: 'F001', type: '环境', street: '新华街道', desc: '小区垃圾桶满溢', owner: '张敏', status: '处理中', score: '待评价' },
  { id: 'F002', type: '设施', street: '新华街道', desc: '单元门禁故障', owner: '刘洋', status: '已办结', score: '满意' },
  { id: 'F003', type: '交通', street: '新华街道', desc: '施工车辆占道', owner: '李强', status: '处理中', score: '待评价' },
  { id: 'F004', type: '环境', street: '文化路街道', desc: '绿化灌木缺失', owner: '张敏', status: '已办结', score: '满意' },
  { id: 'F005', type: '安全', street: '文化路街道', desc: '夜间照明不足', owner: '陈晨', status: '处理中', score: '待评价' },
  { id: 'F006', type: '环境', street: '文化路街道', desc: '楼道乱堆物', owner: '陈晨', status: '已办结', score: '满意' },
  { id: 'F007', type: '设施', street: '文化路街道', desc: '电梯运行噪音', owner: '刘洋', status: '已办结', score: '满意' },
  { id: 'F008', type: '安全', street: '文化路街道', desc: '消防通道堵塞', owner: '周楠', status: '处理中', score: '待评价' },
  { id: 'F009', type: '环境', street: '迎宾路街道', desc: '道路积水', owner: '李强', status: '处理中', score: '待评价' },
  { id: 'F010', type: '设施', street: '迎宾路街道', desc: '充电桩不足', owner: '刘洋', status: '处理中', score: '待评价' },
  { id: 'F011', type: '安全', street: '迎宾路街道', desc: '围挡影响出行', owner: '张涛', status: '已办结', score: '满意' },
  { id: 'F012', type: '交通', street: '迎宾路街道', desc: '停车位紧张', owner: '张涛', status: '处理中', score: '待评价' },
  { id: 'F013', type: '环境', street: '迎宾路街道', desc: '绿化浇水过量', owner: '张敏', status: '已办结', score: '基本满意' },
  { id: 'F014', type: '设施', street: '迎宾路街道', desc: '公共照明闪烁', owner: '陈晨', status: '处理中', score: '待评价' },
  { id: 'F015', type: '安全', street: '迎宾路街道', desc: '井盖松动', owner: '李强', status: '已办结', score: '满意' },
  { id: 'F016', type: '环境', street: '东城街道', desc: '垃圾分类不到位', owner: '周楠', status: '处理中', score: '待评价' },
  { id: 'F017', type: '设施', street: '东城街道', desc: '排水口堵塞', owner: '李强', status: '处理中', score: '待评价' },
  { id: 'F018', type: '环境', street: '东城街道', desc: '杂草清理需求', owner: '张敏', status: '已办结', score: '满意' },
  { id: 'F019', type: '安全', street: '和平街道', desc: '楼道灯不亮', owner: '陈晨', status: '处理中', score: '待评价' },
  { id: 'F020', type: '设施', street: '和平街道', desc: '健身器材缺失', owner: '刘洋', status: '已办结', score: '满意' },
  { id: 'F021', type: '交通', street: '和平街道', desc: '道路封闭绕行', owner: '张涛', status: '处理中', score: '待评价' },
  { id: 'F022', type: '环境', street: '和平街道', desc: '绿化带积水', owner: '周楠', status: '处理中', score: '待评价' }
]);

const chartData = computed(() => [
  { label: '环境', value: 180 },
  { label: '设施', value: 150 },
  { label: '交通', value: 120 },
  { label: '安全', value: 140 }
]);

const modal = ref('');

const openModal = (type) => {
  modal.value = type;
};

const closeModal = () => {
  modal.value = '';
};

const modalTitle = computed(() => {
  if (modal.value === 'collect') return '收集居民意见';
  if (modal.value === 'reply') return '批量回复';
  if (modal.value === 'survey') return '满意度调查';
  return '';
});
</script>

<template>
  <div class="table-card">
    <div class="section-header">
      <div>
        <h2>资产盘活方式与项目管理</h2>
        <p>围绕出租、合作运营、改造升级等方式对项目进行全过程管理。</p>
      </div>
      <div class="action-row">
        <button @click="showCreate = true">创建盘活项目</button>
        <button style="background:#10b981" @click="showPush = true">推送审批</button>
        <button style="background:#eef2ff;color:#0b5bd3" @click="showTemplate = true">方案模板</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="bar-chart">
        <h4>盘活方式分布</h4>
        <div v-for="(item, idx) in methodStats" :key="idx" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.label }}</span>
            <span>{{ item.value }}个</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: item.percent + '%' }"></div></div>
        </div>
      </div>
      <div class="progress-chart">
        <h4>推进进度</h4>
        <div v-for="item in projects.slice(0,5)" :key="item.id" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.name }}</span>
            <span>{{ item.progress }}%</span>
          </div>
          <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: item.progress + '%' }"></div></div>
        </div>
      </div>
    </div>

    <table class="table" style="margin-top:12px;">
      <thead>
        <tr>
          <th>编号</th>
          <th>项目名称</th>
          <th>资产</th>
          <th>方式</th>
          <th>负责人</th>
          <th>阶段</th>
          <th>进度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in projects" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.asset }}</td>
          <td>{{ item.method }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.stage }}</td>
          <td><span class="badge" :class="item.progress > 70 ? 'active' : 'pending'">{{ item.progress }}%</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showCreate" title="创建盘活项目" @close="showCreate = false">
    <div class="form-grid">
      <div class="input-group">
        <label>项目名称</label>
        <input v-model="form.name" placeholder="如：闲置厂房改造为创客空间" />
      </div>
      <div class="input-group">
        <label>盘活方式</label>
        <select v-model="form.method">
          <option>出租</option>
          <option>合作运营</option>
          <option>改造升级</option>
          <option>功能置换</option>
        </select>
      </div>
      <div class="input-group">
        <label>计划收益(万元)</label>
        <input type="number" v-model="form.income" />
      </div>
    </div>
    <template #footer>
      <button style="background:#eef2ff;color:#0b5bd3" @click="showCreate = false">取消</button>
      <button @click="submitCreate">保存项目</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showPush" title="推送审批" @close="showPush = false">
    <p>已生成审批包并自动同步资产信息。</p>
    <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: pushProgress + '%' }"></div></div>
  </ModalDialog>

  <ModalDialog v-if="showTemplate" title="盘活方案模板" @close="showTemplate = false">
    <ul>
      <li>出租方案：收益测算、租期控制、维护责任。</li>
      <li>合作运营：收益分成、投资测算、风险分担。</li>
      <li>改造升级：设计指引、工程节点、验收流程。</li>
      <li>功能置换：指标核算、资产互换、合同模板。</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showCreate = ref(false);
const showPush = ref(false);
const showTemplate = ref(false);
const pushProgress = ref(30);
const form = reactive({ name: '', method: '出租', income: 30 });

const projects = ref([
  { id: 'P-01', name: '旧粮仓文创改造', asset: '旧粮仓', method: '改造升级', owner: '张婷', stage: '施工准备', progress: 42 },
  { id: 'P-02', name: '滨河厂房租赁', asset: '滨河文创厂房', method: '出租', owner: '王鹏', stage: '招商洽谈', progress: 65 },
  { id: 'P-03', name: '产业孵化合作', asset: '产业孵化中心', method: '合作运营', owner: '刘琛', stage: '协议审核', progress: 78 },
  { id: 'P-04', name: '广场地下空间置换', asset: '广场地下空间', method: '功能置换', owner: '赵雪', stage: '方案评审', progress: 54 },
  { id: 'P-05', name: '人才公寓整租', asset: '人才公寓', method: '出租', owner: '陈林', stage: '合同起草', progress: 72 },
  { id: 'P-06', name: '公共停车楼合作', asset: '公共停车楼', method: '合作运营', owner: '沈凯', stage: '收益测算', progress: 40 },
  { id: 'P-07', name: '沿街住宅功能置换', asset: '沿街老旧住宅', method: '功能置换', owner: '杨敏', stage: '资源匹配', progress: 35 },
  { id: 'P-08', name: '物流场站升级', asset: '物流场站', method: '改造升级', owner: '周峰', stage: '设计招标', progress: 28 },
  { id: 'P-09', name: '城郊市场升级', asset: '城郊农贸市场', method: '改造升级', owner: '刘洋', stage: '立项备案', progress: 18 },
  { id: 'P-10', name: '科技孵化楼招商', asset: '科技孵化楼', method: '出租', owner: '杜鹃', stage: '路演对接', progress: 52 },
  { id: 'P-11', name: '历史街区活化', asset: '历史街区房', method: '合作运营', owner: '梅雨', stage: '测算', progress: 47 },
  { id: 'P-12', name: '社区服务中心提升', asset: '社区服务中心', method: '改造升级', owner: '秦刚', stage: '需求调研', progress: 25 },
  { id: 'P-13', name: '综合体育馆商用', asset: '综合体育馆', method: '出租', owner: '李强', stage: '招商', progress: 68 },
  { id: 'P-14', name: '教学楼联合运营', asset: '教学培训楼', method: '合作运营', owner: '赵俊', stage: '合同谈判', progress: 73 },
  { id: 'P-15', name: '立体车库委托', asset: '立体车库', method: '合作运营', owner: '梁博', stage: '尽调', progress: 31 },
  { id: 'P-16', name: '老旧厂房孵化器', asset: '闲置厂房', method: '改造升级', owner: '杜涛', stage: '方案评审', progress: 57 },
  { id: 'P-17', name: '文化活动中心出租', asset: '文化活动中心', method: '出租', owner: '陶然', stage: '签约', progress: 83 },
  { id: 'P-18', name: '科研实验楼共建', asset: '科研实验楼', method: '合作运营', owner: '宋美', stage: '方案深化', progress: 69 },
  { id: 'P-19', name: '地下空间停车改造', asset: '广场地下空间', method: '改造升级', owner: '王安', stage: '施工', progress: 64 },
  { id: 'P-20', name: '滨河厂房功能置换', asset: '滨河文创厂房', method: '功能置换', owner: '孟欣', stage: '资产核算', progress: 22 }
]);

const methodStats = computed(() => {
  const counts = {};
  projects.value.forEach((p) => (counts[p.method] = (counts[p.method] || 0) + 1));
  const total = projects.value.length;
  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
    percent: Math.round((value / total) * 100)
  }));
});

onMounted(() => {
  const timer = setInterval(() => {
    pushProgress.value = Math.min(pushProgress.value + 12, 100);
    if (pushProgress.value === 100) clearInterval(timer);
  }, 500);
});

const submitCreate = () => {
  projects.value.unshift({
    id: `P-${projects.value.length + 1}`,
    name: form.name || '新盘活项目',
    asset: '待选择资产',
    method: form.method,
    owner: '未分配',
    stage: '方案草拟',
    progress: 15
  });
  showCreate.value = false;
};
</script>

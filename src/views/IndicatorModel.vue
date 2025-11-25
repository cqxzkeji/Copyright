<template>
  <div class="grid two">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="tag">指标体系配置</div>
          <h3 style="margin:6px 0 0;">评价指标清单</h3>
        </div>
        <button class="btn" @click="openAdd">新增指标</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>维度</th>
            <th>权重</th>
            <th>评分规则</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in indicators" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.weight }}%</td>
            <td>{{ item.rule }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">权重分布</h3>
        <div style="display:flex;gap:8px;">
          <button class="btn secondary" @click="openWeight">权重调整</button>
          <button class="btn warning" @click="openTemplate">导入模板</button>
        </div>
      </div>
      <div class="grid three">
        <div v-for="item in indicators" :key="item.name" class="card" style="padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:700;">{{ item.name }}</span>
            <span class="tag">{{ item.category }}</span>
          </div>
          <div class="progress-bar"><span :style="{ width: item.weight + '%'}"></span></div>
          <small style="color:var(--muted);">规则：{{ item.rule }}</small>
        </div>
      </div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">评估模板管理</h3>
        <button class="btn" @click="openTemplate">创建模板</button>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div v-for="tpl in templates" :key="tpl.name" class="card" style="min-width:220px; flex:1;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="badge info">{{ tpl.type }}</div>
            <div style="font-weight:700;">{{ tpl.name }}</div>
          </div>
          <div class="chip-row">
            <span class="tag" v-for="tag in tpl.tags" :key="tag">{{ tag }}</span>
          </div>
          <div class="progress-bar"><span :style="{ width: tpl.completeness + '%' }"></span></div>
          <small style="color:var(--muted);">覆盖指标 {{ tpl.coverage }} / 权重已校准 {{ tpl.completeness }}%</small>
          <button class="btn secondary" @click="openTip">发布</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAdd" class="overlay" @click.self="showAdd=false">
    <div class="modal">
      <h3>新增指标</h3>
      <div class="form-row"><label>指标名称</label><input placeholder="如：城市设计品质" /></div>
      <div class="form-row"><label>维度</label><input placeholder="社会、环境、经济" /></div>
      <div class="form-row"><label>权重(%)</label><input type="number" placeholder="10" /></div>
      <div class="form-row"><label>评分规则</label><textarea rows="2" placeholder="阈值、区间得分描述"></textarea></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn secondary" @click="showAdd=false">提交</button>
      </div>
    </div>
  </div>

  <div v-if="showWeight" class="overlay" @click.self="showWeight=false">
    <div class="modal">
      <h3>权重调整</h3>
      <div v-for="item in indicators" :key="item.name" class="form-row">
        <label>{{ item.name }}</label>
        <input type="range" min="5" max="40" :value="item.weight" />
      </div>
      <button class="btn" @click="showWeight=false" style="align-self:flex-end;">完成</button>
    </div>
  </div>

  <div v-if="showTemplate" class="overlay" @click.self="showTemplate=false">
    <div class="modal">
      <h3>模板导入</h3>
      <p>正在从模板库同步评分标准与权重...</p>
      <div class="progress-bar"><span :style="{ width: templateProgress + '%' }"></span></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn" @click="simulateTemplate">刷新</button>
        <button class="btn secondary" @click="showTemplate=false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTip" class="overlay" @click.self="showTip=false">
    <div class="modal">
      <h3>发布提示</h3>
      <p>模板发布将同步至所有评估任务。</p>
      <button class="btn" @click="showTip=false">确认</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const indicators = [
  { name: '经济收益率', category: '经济', weight: 25, rule: 'IRR≥8%得满分' },
  { name: '资金平衡度', category: '资金', weight: 20, rule: '资本金比例≥30%' },
  { name: '居住改善度', category: '社会', weight: 18, rule: '安置满意度≥85%' },
  { name: '环境提升度', category: '环境', weight: 15, rule: '绿化率+雨洪管理' },
  { name: '交通可达性', category: '设施', weight: 12, rule: '公共交通覆盖率' },
  { name: '实施风险', category: '风险', weight: 10, rule: '风险矩阵评分' },
];

const templates = [
  { name: '更新试点模板', type: '示范区', coverage: '18/20', completeness: 86, tags: ['示范', '政策跟踪', '流程简化'] },
  { name: '存量社区模板', type: '社区', coverage: '22/24', completeness: 90, tags: ['安置优先', '配套平衡', '社稳'] },
  { name: '产业园区模板', type: '产业', coverage: '16/18', completeness: 82, tags: ['产值导向', '效益回收', '分期'] },
];

const showAdd = ref(false);
const showWeight = ref(false);
const showTemplate = ref(false);
const showTip = ref(false);
const templateProgress = ref(30);

const openAdd = () => (showAdd.value = true);
const openWeight = () => (showWeight.value = true);
const openTemplate = () => {
  showTemplate.value = true;
  simulateTemplate();
};

const simulateTemplate = () => {
  templateProgress.value = 40;
  setTimeout(() => (templateProgress.value = 70), 400);
  setTimeout(() => (templateProgress.value = 100), 800);
};

const openTip = () => (showTip.value = true);

onMounted(() => simulateTemplate());
</script>

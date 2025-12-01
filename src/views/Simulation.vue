<template>
  <div>
    <div class="card-grid">
      <div class="card">
        <h3>运行集群</h3>
        <p class="kpi">12 台</p>
        <p class="kpi-label">GPU/CPU 混合调度</p>
      </div>
      <div class="card">
        <h3>场景库覆盖</h3>
        <p class="kpi">128 个</p>
        <p class="kpi-label">已校准的典型路况</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:82%;"></div>
        </div>
      </div>
      <div class="card">
        <h3>最新构建</h3>
        <p class="kpi">v1.6.4</p>
        <p class="kpi-label">发布到仿真集群</p>
        <span class="badge green">通过冒烟</span>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">仿真场景与构建</h3>
        <div>
          <button class="button" @click="showScenarioForm = true">创建场景</button>
          <button class="button secondary" @click="showBuildProgress = true">生成构建</button>
          <button class="button ghost" @click="showPlanModal = true">调度计划</button>
        </div>
      </div>
      <table class="table" aria-label="仿真场景表">
        <thead>
          <tr>
            <th>场景</th>
            <th>类型</th>
            <th>事件</th>
            <th>覆盖道路</th>
            <th>优先级</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="scene in scenes" :key="scene.name">
            <td>{{ scene.name }}</td>
            <td>{{ scene.category }}</td>
            <td>{{ scene.event }}</td>
            <td>{{ scene.road }}</td>
            <td>{{ scene.priority }}</td>
            <td><span class="badge" :class="scene.state === '排队' ? 'orange' : 'green'">{{ scene.state }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showScenarioForm" class="modal-mask">
      <div class="modal">
        <header>
          <h3>创建场景</h3>
          <button class="button ghost" @click="showScenarioForm = false">关闭</button>
        </header>
        <input v-model="scenarioForm.name" placeholder="场景名称" />
        <input v-model="scenarioForm.road" placeholder="道路段落" />
        <textarea v-model="scenarioForm.events" rows="3" placeholder="事件描述" />
        <footer>
          <button class="button ghost" @click="showScenarioForm = false">取消</button>
          <button class="button" @click="createScenario">提交</button>
        </footer>
      </div>
    </div>

    <div v-if="showBuildProgress" class="modal-mask">
      <div class="modal">
        <header>
          <h3>构建进度</h3>
          <button class="button ghost" @click="showBuildProgress = false">关闭</button>
        </header>
        <p>正在将新增场景打包并分发至仿真集群...</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" :style="{ width: buildProgress + '%' }"></div>
        </div>
        <p class="kpi-label">{{ buildProgress }}% 已完成</p>
      </div>
    </div>

    <div v-if="showPlanModal" class="modal-mask">
      <div class="modal">
        <header>
          <h3>调度计划</h3>
          <button class="button ghost" @click="showPlanModal = false">关闭</button>
        </header>
        <p>当前 GPU 集群负载 65%，建议优先执行高优先级、长尾场景以覆盖极端路况。</p>
        <footer>
          <button class="button" @click="showPlanModal = false">确认</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimulationView',
  data() {
    return {
      showScenarioForm: false,
      showBuildProgress: false,
      showPlanModal: false,
      buildProgress: 54,
      scenarioForm: {
        name: '隧道出入口跟车',
        road: 'S322-东段',
        events: ''
      },
      scenes: [
        { name: '雨天跟车', category: '天气', event: '轻微积水', road: 'G15 立交', priority: '高', state: '运行中' },
        { name: '夜间拥堵', category: '光照', event: '灯光干扰', road: '环城高架', priority: '高', state: '运行中' },
        { name: '隧道口并线', category: '道路', event: '视野突变', road: 'S322 出口', priority: '中', state: '排队' },
        { name: '交叉口行人横穿', category: '行人', event: '随机穿越', road: '大学路口', priority: '高', state: '运行中' },
        { name: '施工占道', category: '道路', event: '占道施工', road: '望江路', priority: '中', state: '运行中' },
        { name: '逆光眩目', category: '光照', event: '强烈眩目', road: '江滨大道', priority: '低', state: '排队' },
        { name: '坡道溜车', category: '动力', event: '坡道起步', road: '北三环', priority: '中', state: '运行中' },
        { name: '桥面侧风', category: '天气', event: '阵风', road: '滨江大桥', priority: '低', state: '运行中' },
        { name: '雨雪混合', category: '天气', event: '降雪+路滑', road: '山口公路', priority: '高', state: '排队' },
        { name: '应急车道入侵', category: '行为', event: '违规变道', road: '机场高速', priority: '高', state: '运行中' }
      ]
    };
  },
  methods: {
    createScenario() {
      alert(`已创建场景：${this.scenarioForm.name}`);
      this.showScenarioForm = false;
    }
  }
};
</script>

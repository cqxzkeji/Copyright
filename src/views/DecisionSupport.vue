<template>
  <div>
    <div class="card-grid">
      <div class="card">
        <h3>控制策略</h3>
        <p class="kpi">自适应信控</p>
        <p class="kpi-label">路口协同效率 +12%</p>
      </div>
      <div class="card">
        <h3>车路协同事件</h3>
        <p class="kpi">34 条</p>
        <p class="kpi-label">近1小时处理</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:68%;"></div>
        </div>
      </div>
      <div class="card">
        <h3>建议执行率</h3>
        <p class="kpi">91%</p>
        <p class="kpi-label">控制建议落地比例</p>
        <span class="badge blue">持续提升</span>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">决策建议与调度</h3>
        <div>
          <button class="button" @click="showDispatch = true">下发调度</button>
          <button class="button secondary" @click="showFeedback = true">采集反馈</button>
          <button class="button ghost" @click="showGuide = true">提示</button>
        </div>
      </div>
      <table class="table" aria-label="决策表">
        <thead>
          <tr>
            <th>编号</th>
            <th>路口</th>
            <th>策略</th>
            <th>优先级</th>
            <th>预计收益</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in decisions" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.cross }}</td>
            <td>{{ item.plan }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.gain }}</td>
            <td><span class="badge" :class="item.state === '待执行' ? 'orange' : 'green'">{{ item.state }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showDispatch" class="modal-mask">
      <div class="modal">
        <header>
          <h3>下发调度</h3>
          <button class="button ghost" @click="showDispatch = false">关闭</button>
        </header>
        <input v-model="dispatchForm.cross" placeholder="路口/路段" />
        <select v-model="dispatchForm.strategy">
          <option>信号配时优化</option>
          <option>车道动态分配</option>
          <option>车速引导</option>
        </select>
        <textarea v-model="dispatchForm.note" rows="3" placeholder="调度说明"></textarea>
        <footer>
          <button class="button ghost" @click="showDispatch = false">取消</button>
          <button class="button" @click="submitDispatch">提交</button>
        </footer>
      </div>
    </div>

    <div v-if="showFeedback" class="modal-mask">
      <div class="modal">
        <header>
          <h3>采集反馈</h3>
          <button class="button ghost" @click="showFeedback = false">关闭</button>
        </header>
        <p>对调度效果收集车辆端与路侧的反馈，以改进后续策略。</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:42%;"></div>
        </div>
        <p class="kpi-label">反馈收集进度 42%</p>
      </div>
    </div>

    <div v-if="showGuide" class="modal-mask">
      <div class="modal">
        <header>
          <h3>提示</h3>
          <button class="button ghost" @click="showGuide = false">关闭</button>
        </header>
        <p>协同策略优先选择时空冲突小的方案，必要时开启车端限速和车道管控。</p>
        <footer>
          <button class="button" @click="showGuide = false">了解</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DecisionSupport',
  data() {
    return {
      showDispatch: false,
      showFeedback: false,
      showGuide: false,
      dispatchForm: {
        cross: '科技大道-文一路',
        strategy: '信号配时优化',
        note: ''
      },
      decisions: [
        { id: 'D-01', cross: '科技大道', plan: '绿波带优化', level: '高', gain: '通行效率 +15%', state: '进行中' },
        { id: 'D-02', cross: '秋涛路', plan: '公交优先', level: '中', gain: '班次准点率 +8%', state: '待执行' },
        { id: 'D-03', cross: '滨江路', plan: '车速引导', level: '高', gain: '延误 -10%', state: '进行中' },
        { id: 'D-04', cross: '紫荆港路', plan: '自适应信控', level: '高', gain: '通行效率 +12%', state: '进行中' },
        { id: 'D-05', cross: '留和路', plan: '潮汐车道', level: '中', gain: '高峰容量 +9%', state: '待执行' },
        { id: 'D-06', cross: '中河高架', plan: '匝道管控', level: '高', gain: '拥堵时长 -7%', state: '进行中' },
        { id: 'D-07', cross: '莫干山路', plan: '行人保护', level: '中', gain: '冲突 -11%', state: '待执行' },
        { id: 'D-08', cross: '古翠路', plan: '左转相位优化', level: '低', gain: '通行效率 +5%', state: '进行中' },
        { id: 'D-09', cross: '文一路', plan: '车道动态分配', level: '高', gain: '瓶颈通行 +10%', state: '待执行' },
        { id: 'D-10', cross: '萧绍路', plan: '公交优先', level: '低', gain: '准点率 +6%', state: '进行中' }
      ]
    };
  },
  methods: {
    submitDispatch() {
      alert(`已下发到 ${this.dispatchForm.cross}，策略 ${this.dispatchForm.strategy}`);
      this.showDispatch = false;
    }
  }
};
</script>

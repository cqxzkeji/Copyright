<template>
  <div>
    <div class="card-grid">
      <div class="card">
        <h3>采集节点在线率</h3>
        <p class="kpi">98.4%</p>
        <p class="kpi-label">最近30分钟</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:98%;"></div>
        </div>
      </div>
      <div class="card">
        <h3>平均传输时延</h3>
        <p class="kpi">42 ms</p>
        <p class="kpi-label">路侧到云端链路</p>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <div style="flex:1;height:72px;border-radius:10px;background:linear-gradient(180deg,#1677ff 60%,#e5e7eb 60%);"></div>
          <div style="flex:1;height:72px;border-radius:10px;background:linear-gradient(180deg,#52c41a 70%,#e5e7eb 70%);"></div>
          <div style="flex:1;height:72px;border-radius:10px;background:linear-gradient(180deg,#ffc53d 55%,#e5e7eb 55%);"></div>
        </div>
      </div>
      <div class="card">
        <h3>本周采集数据量</h3>
        <p class="kpi">12.4 TB</p>
        <p class="kpi-label">视频、激光雷达、毫米波雷达</p>
        <div style="display:flex;align-items:center;gap:12px;margin-top:10px;">
          <span class="badge green">+8.6% 环比</span>
          <span class="badge orange">时延可控</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">采集通道状态</h3>
        <div>
          <button class="button" @click="showConfig = true">配置采集计划</button>
          <button class="button secondary" @click="showTransfer = true">开始传输</button>
          <button class="button ghost" @click="showTips = true">提示</button>
        </div>
      </div>
      <table class="table" aria-label="采集通道表">
        <thead>
          <tr>
            <th>序号</th>
            <th>节点</th>
            <th>类型</th>
            <th>频率</th>
            <th>状态</th>
            <th>健康度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in channels" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.rate }}</td>
            <td><span class="badge" :class="item.state === '告警' ? 'orange' : 'green'">{{ item.state }}</span></td>
            <td>{{ item.health }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showConfig" class="modal-mask">
      <div class="modal">
        <header>
          <h3>配置采集计划</h3>
          <button class="button ghost" @click="showConfig = false">关闭</button>
        </header>
        <input v-model="form.name" placeholder="计划名称" />
        <div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">
          <div>
            <label>采集频率(Hz)</label>
            <input type="number" v-model="form.rate" />
          </div>
          <div>
            <label>数据类型</label>
            <select v-model="form.type">
              <option>视频</option>
              <option>激光雷达</option>
              <option>毫米波雷达</option>
            </select>
          </div>
        </div>
        <textarea v-model="form.note" rows="3" placeholder="备注与触发规则"></textarea>
        <footer>
          <button class="button ghost" @click="showConfig = false">取消</button>
          <button class="button" @click="submitConfig">保存计划</button>
        </footer>
      </div>
    </div>

    <div v-if="showTransfer" class="modal-mask">
      <div class="modal">
        <header>
          <h3>传输进度</h3>
          <button class="button ghost" @click="showTransfer = false">关闭</button>
        </header>
        <p>正在将采集数据同步到云侧融合仓库...</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" :style="{ width: transferProgress + '%' }"></div>
        </div>
        <p class="kpi-label">{{ transferProgress }}% 已完成</p>
        <footer>
          <button class="button secondary" @click="boostTransfer">提速传输</button>
        </footer>
      </div>
    </div>

    <div v-if="showTips" class="modal-mask">
      <div class="modal">
        <header>
          <h3>传输提示</h3>
          <button class="button ghost" @click="showTips = false">关闭</button>
        </header>
        <p>建议在低峰时段批量上传，避免占用路侧链路。可开启差分编码以节约带宽。</p>
        <footer>
          <button class="button" @click="showTips = false">知道了</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCollection',
  data() {
    return {
      showConfig: false,
      showTransfer: false,
      showTips: false,
      transferProgress: 32,
      form: {
        name: '晚高峰环路采集',
        rate: 20,
        type: '视频',
        note: ''
      },
      channels: [
        { id: 1, name: 'RSU-北门', type: '视频', rate: '20Hz', state: '正常', health: '99%' },
        { id: 2, name: 'RSU-南出口', type: '雷达', rate: '15Hz', state: '正常', health: '98%' },
        { id: 3, name: 'RSU-西匝道', type: '视频', rate: '12Hz', state: '告警', health: '92%' },
        { id: 4, name: 'RSU-东广场', type: '雷达', rate: '18Hz', state: '正常', health: '97%' },
        { id: 5, name: '车载-01', type: '激光雷达', rate: '10Hz', state: '正常', health: '96%' },
        { id: 6, name: '车载-02', type: '视频', rate: '12Hz', state: '正常', health: '98%' },
        { id: 7, name: '车载-03', type: '毫米波雷达', rate: '8Hz', state: '正常', health: '95%' },
        { id: 8, name: '车载-04', type: '视频', rate: '14Hz', state: '正常', health: '97%' },
        { id: 9, name: '路测-气象', type: '气象传感', rate: '5Hz', state: '正常', health: '94%' },
        { id: 10, name: '路测-震动', type: '震动传感', rate: '8Hz', state: '正常', health: '93%' }
      ]
    };
  },
  methods: {
    submitConfig() {
      alert(`计划 ${this.form.name} 已保存，频率 ${this.form.rate}Hz`);
      this.showConfig = false;
    },
    boostTransfer() {
      this.transferProgress = Math.min(100, this.transferProgress + 18);
    }
  }
};
</script>

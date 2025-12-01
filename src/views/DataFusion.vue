<template>
  <div>
    <div class="card-grid">
      <div class="card">
        <h3>融合精度</h3>
        <p class="kpi">95.6%</p>
        <p class="kpi-label">地图对齐 + 轨迹关联</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:96%;"></div>
        </div>
      </div>
      <div class="card">
        <h3>延迟分布</h3>
        <div style="display:flex;gap:8px;margin-top:6px;">
          <div v-for="n in 6" :key="n" style="flex:1;height:70px;border-radius:10px;background:linear-gradient(180deg,#1677ff calc(30% + n*8%),#e5e7eb calc(30% + n*8%));"></div>
        </div>
        <p class="kpi-label">批次延时彩条图</p>
      </div>
      <div class="card">
        <h3>模型版本</h3>
        <p class="kpi">FusionNet v2.3</p>
        <p class="kpi-label">最近上线模型</p>
        <div style="display:flex;gap:10px;">
          <span class="badge blue">车路时空拼接</span>
          <span class="badge green">雷视协同</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">融合批次与指标</h3>
        <div>
          <button class="button" @click="showFusionForm = true">启动融合</button>
          <button class="button secondary" @click="showReport = true">查看报告</button>
          <button class="button ghost" @click="showModelUpload = true">上传模型</button>
        </div>
      </div>
      <table class="table" aria-label="融合批次表">
        <thead>
          <tr>
            <th>批次</th>
            <th>输入源</th>
            <th>时间窗</th>
            <th>召回率</th>
            <th>精确率</th>
            <th>覆盖度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in fusionRows" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.source }}</td>
            <td>{{ row.window }}</td>
            <td>{{ row.recall }}</td>
            <td>{{ row.precision }}</td>
            <td>{{ row.coverage }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showFusionForm" class="modal-mask">
      <div class="modal">
        <header>
          <h3>启动融合任务</h3>
          <button class="button ghost" @click="showFusionForm = false">关闭</button>
        </header>
        <input v-model="fusionForm.scene" placeholder="场景名称" />
        <div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
          <div>
            <label>融合窗口(s)</label>
            <input type="number" v-model="fusionForm.window" />
          </div>
          <div>
            <label>置信度阈值</label>
            <input type="number" v-model="fusionForm.threshold" />
          </div>
        </div>
        <textarea v-model="fusionForm.note" rows="3" placeholder="备注与回放数据"></textarea>
        <footer>
          <button class="button ghost" @click="showFusionForm = false">取消</button>
          <button class="button" @click="startFusion">提交任务</button>
        </footer>
      </div>
    </div>

    <div v-if="showReport" class="modal-mask">
      <div class="modal">
        <header>
          <h3>融合报告</h3>
          <button class="button ghost" @click="showReport = false">关闭</button>
        </header>
        <p>融合成功率 96%，轨迹重叠误差 0.12m，建议继续优化车端时间同步策略。</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:76%;"></div>
        </div>
        <p class="kpi-label">报告完成度 76%</p>
      </div>
    </div>

    <div v-if="showModelUpload" class="modal-mask">
      <div class="modal">
        <header>
          <h3>上传融合模型</h3>
          <button class="button ghost" @click="showModelUpload = false">关闭</button>
        </header>
        <input v-model="modelForm.name" placeholder="模型名称" />
        <input v-model="modelForm.version" placeholder="版本号" />
        <textarea v-model="modelForm.desc" rows="3" placeholder="特性与改进" />
        <footer>
          <button class="button ghost" @click="showModelUpload = false">取消</button>
          <button class="button secondary" @click="uploadModel">上传</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataFusion',
  data() {
    return {
      showFusionForm: false,
      showReport: false,
      showModelUpload: false,
      fusionForm: {
        scene: '环路晚高峰',
        window: 5,
        threshold: 0.6,
        note: ''
      },
      modelForm: {
        name: 'FusionNet',
        version: 'v2.4-beta',
        desc: ''
      },
      fusionRows: [
        { batch: 'B2101', source: '视频+雷达', window: '5s', recall: '96.2%', precision: '94.8%', coverage: '98.3%' },
        { batch: 'B2102', source: '视频+激光', window: '4s', recall: '95.4%', precision: '94.1%', coverage: '97.9%' },
        { batch: 'B2103', source: '视频+高精地图', window: '6s', recall: '94.9%', precision: '93.5%', coverage: '97.2%' },
        { batch: 'B2104', source: '雷达+IMU', window: '5s', recall: '95.8%', precision: '95.0%', coverage: '98.1%' },
        { batch: 'B2105', source: '视频+里程计', window: '5s', recall: '95.1%', precision: '93.8%', coverage: '97.6%' },
        { batch: 'B2106', source: '雷达+视频', window: '4s', recall: '96.5%', precision: '95.3%', coverage: '98.4%' },
        { batch: 'B2107', source: '视频+V2X', window: '5s', recall: '95.9%', precision: '94.6%', coverage: '97.8%' },
        { batch: 'B2108', source: '视频+激光', window: '6s', recall: '95.2%', precision: '94.2%', coverage: '97.5%' },
        { batch: 'B2109', source: '视频+雷达', window: '5s', recall: '96.7%', precision: '95.5%', coverage: '98.6%' },
        { batch: 'B2110', source: '视频+雷达', window: '5s', recall: '95.6%', precision: '94.7%', coverage: '97.7%' }
      ]
    };
  },
  methods: {
    startFusion() {
      alert(`场景 ${this.fusionForm.scene} 已提交，窗口 ${this.fusionForm.window}s`);
      this.showFusionForm = false;
    },
    uploadModel() {
      alert(`模型 ${this.modelForm.name} ${this.modelForm.version} 上传成功`);
      this.showModelUpload = false;
    }
  }
};
</script>

<template>
  <div class="grid two">
    <div class="card" style="padding:16px;">
      <h3 style="margin-top:0">异常识别与预警</h3>
      <p>当前模型：{{ model.name }}，准确率 {{ model.acc }}%</p>
      <div class="progress-track"><div class="progress-bar" :style="{width: model.acc + '%'}"></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
        <button class="btn primary" @click="open('train')">模型训练</button>
        <button class="btn" @click="open('rule')">预警规则</button>
        <button class="btn" @click="open('push')">发送预警</button>
      </div>
    </div>
    <div class="card" style="padding:16px;">
      <h3 style="margin-top:0">最近预警</h3>
      <ul style="padding-left:16px;margin:0;display:grid;gap:8px;">
        <li v-for="item in warnings" :key="item.id"><b>{{ item.level }}</b>：{{ item.message }}（{{ item.time }}）</li>
      </ul>
    </div>

    <div class="card" style="padding:16px;grid-column:1/-1;overflow:auto;">
      <table class="data-table">
        <thead><tr><th>时间</th><th>异常评分</th><th>类型</th><th>处置建议</th></tr></thead>
        <tbody><tr v-for="item in warningRows" :key="item.time"><td>{{ item.time }}</td><td>{{ item.score }}</td><td>{{ item.type }}</td><td>{{ item.advice }}</td></tr></tbody>
      </table>
    </div>

    <ModalDialog :visible="modal==='train'" title="模型训练任务" confirm-text="启动训练" @close="modal=''" @confirm="setTip('模型训练已提交，预计15分钟完成。')">
      <label>选择算法<select v-model="train.algorithm"><option>LSTM</option><option>XGBoost</option><option>随机森林</option></select></label>
      <label>训练窗口<input v-model="train.window" /></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='rule'" title="预警规则配置" confirm-text="保存规则" @close="modal=''" @confirm="setTip('预警规则保存成功。')">
      <label>温度预警阈值<input type="number" v-model="train.tempWarn" /></label>
      <label>氨气预警阈值<input type="number" v-model="train.ammWarn" /></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='push'" title="发送预警通知" confirm-text="发送" @close="modal=''" @confirm="setTip('已发送到值班人员和管理端。')">
      <label>通知渠道<select><option>短信+系统消息</option><option>仅系统消息</option></select></label>
      <label>附加信息<textarea rows="3" placeholder="填写说明"></textarea></label>
    </ModalDialog>
    <ModalDialog :visible="tipVisible" title="处理结果" @close="tipVisible=false"><p>{{ tip }}</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const modal = ref('')
const tipVisible = ref(false)
const tip = ref('')
const model = ref({ name: '多参数异常识别模型V2', acc: 93 })
const train = ref({ algorithm: 'LSTM', window: '最近30天', tempWarn: 62, ammWarn: 18 })
const warnings = [
  { id: 1, level: '二级', message: 'A区温度上升过快', time: '09:22' },
  { id: 2, level: '三级', message: 'C区湿度偏低', time: '08:57' },
  { id: 3, level: '一级', message: 'B区氨气浓度异常', time: '08:30' }
]
const warningRows = Array.from({ length: 20 }, (_, i) => ({
  time: `2026-03-12 ${String(5 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
  score: (0.55 + i * 0.02).toFixed(2),
  type: i % 3 ? '升温异常' : '气体异常',
  advice: i % 3 ? '降低通风并补水' : '立即检查翻堆与除臭模块'
}))

const open = (name) => (modal.value = name)
const setTip = (text) => {
  modal.value = ''
  tip.value = text
  tipVisible.value = true
}
</script>

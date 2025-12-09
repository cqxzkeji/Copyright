<template>
  <div class="card">
    <div class="header">
      <div>
        <div class="subtitle">性能测试与评价模块</div>
        <h2 style="margin: 0;">批次检测结果</h2>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn" @click="openAdd">添加测试记录</button>
        <button class="btn secondary" @click="openGuide">测试指引</button>
        <button class="btn secondary" @click="openProgress">检测进度</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>批次</th>
          <th>初始浓度 (mg/L)</th>
          <th>平衡浓度 (mg/L)</th>
          <th>吸附量 (mg/g)</th>
          <th>pH</th>
          <th>评价</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tests" :key="item.batch">
          <td>{{ item.batch }}</td>
          <td>{{ item.initial }}</td>
          <td>{{ item.final }}</td>
          <td>{{ item.capacity }}</td>
          <td>{{ item.ph }}</td>
          <td><span class="badge">{{ item.grade }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showAdd" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>添加测试记录</strong></div>
      <div class="modal-body">
        <div class="form-group">
          <label>批次编号</label>
          <input v-model="form.batch" placeholder="例如：T-2404-11" />
        </div>
        <div class="form-group">
          <label>初始浓度 (mg/L)</label>
          <input type="number" v-model.number="form.initial" />
        </div>
        <div class="form-group">
          <label>平衡浓度 (mg/L)</label>
          <input type="number" v-model.number="form.final" />
        </div>
        <div class="form-group">
          <label>pH</label>
          <input type="number" step="0.1" v-model.number="form.ph" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showAdd = false">取消</button>
        <button class="btn" @click="addTest">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showGuide" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>测试指引</strong></div>
      <div class="modal-body">
        <ol style="margin: 0; padding-left: 1.25rem; color: #4b5568;">
          <li>取 0.1 g 吸附剂加入 50 mL 20 mg/L 磷酸盐溶液。</li>
          <li>摇床 150 rpm 振荡 2 h，并记录温度稳定性。</li>
          <li>离心取上清，用钼锑抗分光光度法测定浓度。</li>
          <li>根据浓差计算吸附量，更新结果表。</li>
        </ol>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="showGuide = false">知道了</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>检测进度</strong></div>
      <div class="modal-body">
        <p style="margin-top: 0;">当前批次：{{ activeBatch }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin: 0.5rem 0 0;">完成度：{{ progress.toFixed(0) }}%</p>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showProgress = false">关闭</button>
        <button class="btn" @click="advance">继续测定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const tests = reactive([
  { batch: 'T-2404-01', initial: 20, final: 2.3, capacity: 17.7, ph: 6.5, grade: '优' },
  { batch: 'T-2404-02', initial: 20, final: 4.1, capacity: 15.9, ph: 7.0, grade: '良' },
  { batch: 'T-2404-03', initial: 10, final: 1.2, capacity: 8.8, ph: 6.8, grade: '优' },
  { batch: 'T-2404-04', initial: 30, final: 6.5, capacity: 23.5, ph: 6.2, grade: '良' },
  { batch: 'T-2404-05', initial: 25, final: 5.0, capacity: 20, ph: 7.5, grade: '良' },
  { batch: 'T-2404-06', initial: 15, final: 1.5, capacity: 13.5, ph: 6.4, grade: '优' },
  { batch: 'T-2404-07', initial: 18, final: 3.2, capacity: 14.8, ph: 6.7, grade: '优' },
  { batch: 'T-2404-08', initial: 22, final: 4.4, capacity: 17.6, ph: 6.9, grade: '良' },
  { batch: 'T-2404-09', initial: 16, final: 2.1, capacity: 13.9, ph: 6.5, grade: '优' },
  { batch: 'T-2404-10', initial: 12, final: 1.8, capacity: 10.2, ph: 6.6, grade: '优' }
])

const showAdd = ref(false)
const showGuide = ref(false)
const showProgress = ref(false)
const activeBatch = ref('T-2404-06')
const progress = ref(62)
const form = reactive({ batch: '', initial: 20, final: 2, ph: 6.5 })

const openAdd = () => {
  form.batch = ''
  form.initial = 20
  form.final = 2
  form.ph = 6.5
  showAdd.value = true
}

const addTest = () => {
  const capacity = form.initial - form.final
  if (form.batch) {
    tests.push({ batch: form.batch, initial: form.initial, final: form.final, capacity: capacity.toFixed(2), ph: form.ph, grade: capacity > 15 ? '优' : '良' })
    showAdd.value = false
  }
}

const openGuide = () => {
  showGuide.value = true
}

const openProgress = () => {
  showProgress.value = true
}

const advance = () => {
  progress.value = Math.min(100, progress.value + 12)
}
</script>

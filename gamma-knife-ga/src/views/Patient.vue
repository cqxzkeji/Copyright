<template>
  <div class="grid">
    <div class="flex-between">
      <h2>患者与影像管理</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; min-width: 420px;">
        <button @click="openModal('add')">新增患者</button>
        <button @click="openModal('import')">导入影像</button>
        <button @click="openModal('preprocess')">基础处理</button>
      </div>
    </div>
    <div class="table-card">
      <h3>在治患者列表（{{ patients.length }}）</h3>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>ID</th>
            <th>部位</th>
            <th>分割状态</th>
            <th>影像时间</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, idx) in patients" :key="p.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.id }}</td>
            <td>{{ p.site }}</td>
            <td>{{ p.seg }}</td>
            <td>{{ p.date }}</td>
            <td>{{ p.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>影像叠加预览</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center;">
        <div style="background:linear-gradient(135deg,#e3f2fd,#f1f8ff);border-radius:12px;padding:16px;">
          <div style="height:160px; background: radial-gradient(circle at 40% 40%, rgba(66,165,245,0.3), rgba(66,165,245,0)), radial-gradient(circle at 70% 60%, rgba(255,99,132,0.25), rgba(255,99,132,0)); border-radius:12px; position:relative;">
            <div style="position:absolute; bottom:10px; right:10px; background:#fff; padding:6px 10px; border-radius:10px; font-weight:700; color:#1565c0;">MRI+CT</div>
          </div>
        </div>
        <p style="margin:0; color:#5f6a7a">使用 MRI/CT 融合后的多模态叠加，用于靶点勾画。左侧热区表示当前的靶区候选。勾画完成后可直接进入遗传算法优化。</p>
      </div>
    </div>

    <Modal v-if="modal" :title="modalTitle" @close="modal=null">
      <template #body>
        <div class="grid">
          <label>
            <span>姓名</span>
            <input placeholder="输入姓名" />
          </label>
          <label>
            <span>部位</span>
            <select>
              <option>颅底</option>
              <option>丘脑</option>
              <option>小脑</option>
              <option>颞叶</option>
            </select>
          </label>
          <label>
            <span>影像备注</span>
            <textarea rows="3" placeholder="扫描方案、序列、注意事项"></textarea>
          </label>
          <div>
            <p style="margin:0 0 6px">处理进度</p>
            <div style="background:#e6f2ff; border-radius:10px; height:14px; overflow:hidden;">
              <div :style="{width: progress+'%', background:'linear-gradient(120deg,#66bb6a,#26a69a)', height:'100%'}"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button @click="stepProgress">推进进度</button>
        <button @click="modal=null" style="background:#90a4ae">关闭</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const Modal = {
  props: ['title'],
  emits: ['close'],
  template: `
    <div class="modal-mask">
      <div class="modal-container" role="dialog" aria-modal="true">
        <div class="modal-header">{{ title }}</div>
        <div class="modal-body"><slot name="body" /></div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>`
}

const patients = ref([
  { id: 'G001', name: '张华', site: '丘脑', seg: '已完成', date: '2024-03-12', note: '强化 T1' },
  { id: 'G002', name: '李伟', site: '小脑', seg: '待审核', date: '2024-03-13', note: '含弥散序列' },
  { id: 'G003', name: '王婷', site: '颞叶', seg: '已完成', date: '2024-03-15', note: '对比剂正常' },
  { id: 'G004', name: '刘洋', site: '丘脑', seg: '进行中', date: '2024-03-18', note: '需去伪影' },
  { id: 'G005', name: '陈静', site: '额叶', seg: '已完成', date: '2024-03-20', note: '含 TOF' },
  { id: 'G006', name: '赵强', site: '海马', seg: '进行中', date: '2024-03-22', note: '薄层扫描' },
  { id: 'G007', name: '孙磊', site: '小脑', seg: '已完成', date: '2024-03-23', note: '金属伪影矫正' },
  { id: 'G008', name: '周敏', site: '枕叶', seg: '待审核', date: '2024-03-24', note: 'T2 Flair' },
  { id: 'G009', name: '吴涛', site: '颅底', seg: '进行中', date: '2024-03-25', note: 'CTA 已上传' },
  { id: 'G010', name: '郑爽', site: '额叶', seg: '已完成', date: '2024-03-26', note: '神经导航' },
  { id: 'G011', name: '钱梅', site: '丘脑', seg: '进行中', date: '2024-03-27', note: '需重采样' },
  { id: 'G012', name: '汪豪', site: '海马', seg: '已完成', date: '2024-03-28', note: '已做配准' },
  { id: 'G013', name: '何倩', site: '枕叶', seg: '待审核', date: '2024-03-29', note: '待医生确认' },
  { id: 'G014', name: '彭林', site: '颞叶', seg: '已完成', date: '2024-03-30', note: '已导出 DICOM' },
  { id: 'G015', name: '段强', site: '顶叶', seg: '进行中', date: '2024-03-31', note: '厚度 1mm' },
  { id: 'G016', name: '胡美', site: '丘脑', seg: '已完成', date: '2024-04-01', note: '有轻度移位' },
  { id: 'G017', name: '蒋涛', site: '小脑', seg: '待审核', date: '2024-04-02', note: '需去噪' },
  { id: 'G018', name: '文倩', site: '额叶', seg: '进行中', date: '2024-04-03', note: 'CT 配准良好' },
  { id: 'G019', name: '毛晶', site: '颅底', seg: '已完成', date: '2024-04-04', note: 'Gamma Knife' },
  { id: 'G020', name: '邹雷', site: '顶叶', seg: '待审核', date: '2024-04-05', note: '待剂量导入' }
])

const modal = ref(null)
const progress = ref(35)
const modalTitle = computed(() => {
  if (modal.value === 'add') return '新增患者表单'
  if (modal.value === 'import') return '影像导入设置'
  if (modal.value === 'preprocess') return '基础处理参数'
  return '操作'
})

function openModal(type) {
  modal.value = type
  progress.value = 35
}

function stepProgress() {
  progress.value = Math.min(100, progress.value + 15)
}
</script>

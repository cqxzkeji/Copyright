<template>
  <div class="section-card">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
      <div>
        <div class="card-title">商品管理</div>
        <div class="card-subtitle">批量上架、调价与库存提醒</div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="primary" @click="openCreate">新建商品</button>
        <button class="ghost" @click="openBatch">批量调价</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>商品名</th>
          <th>类目</th>
          <th>价格</th>
          <th>库存</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in products" :key="row.name">
          <td>{{ row.name }}</td>
          <td><span class="chip">{{ row.category }}</span></td>
          <td>¥{{ row.price.toFixed(2) }}</td>
          <td>{{ row.stock }}</td>
          <td><span class="tag" :style="{ background: row.status === '在售' ? '#dcfce7' : '#fee2e2', color: row.status === '在售' ? '#16a34a' : '#b91c1c' }">{{ row.status }}</span></td>
          <td style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="ghost" @click="openEdit(row)">编辑</button>
            <button class="ghost" @click="openStock(row)">库存</button>
            <button class="ghost" @click="openNotify(row)">提醒</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="modalType" class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="ghost" @click="closeModal">✕</button>
      </div>
      <div v-if="modalType === 'create' || modalType === 'edit'">
        <div class="grid grid-2">
          <div class="field">
            <label>商品名</label>
            <input v-model="current.name" class="input" />
          </div>
          <div class="field">
            <label>类目</label>
            <input v-model="current.category" class="input" />
          </div>
          <div class="field">
            <label>价格</label>
            <input v-model.number="current.price" type="number" class="input" />
          </div>
          <div class="field">
            <label>库存</label>
            <input v-model.number="current.stock" type="number" class="input" />
          </div>
        </div>
      </div>
      <div v-else-if="modalType === 'stock'">
        <p>为 {{ current.name }} 设置库存预警值</p>
        <input v-model.number="current.threshold" type="number" class="input" placeholder="预警库存" />
      </div>
      <div v-else-if="modalType === 'batch'">
        <p>批量调价：选择涨幅并确认</p>
        <input v-model.number="batchRate" type="number" class="input" placeholder="例如 5 表示上涨5%" />
      </div>
      <div v-else-if="modalType === 'notify'">
        <p>将为 {{ current.name }} 开启缺货提醒并通知采购。</p>
      </div>
      <div class="modal-actions">
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="saveModal">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const products = reactive([
  { name: '高山苹果', category: '水果', price: 6.8, stock: 120, status: '在售' },
  { name: '砂糖桔', category: '水果', price: 5.2, stock: 200, status: '在售' },
  { name: '赣南脐橙', category: '水果', price: 7.6, stock: 86, status: '在售' },
  { name: '有机小米', category: '粮油', price: 12.3, stock: 140, status: '在售' },
  { name: '黑豆', category: '粮油', price: 9.8, stock: 60, status: '停售' },
  { name: '寒地大米', category: '粮油', price: 15.1, stock: 210, status: '在售' },
  { name: '绿心猕猴桃', category: '水果', price: 8.2, stock: 45, status: '在售' },
  { name: '散养土鸡蛋', category: '禽蛋', price: 18.9, stock: 35, status: '在售' },
  { name: '生态五花肉', category: '生鲜', price: 32.6, stock: 25, status: '停售' },
  { name: '富硒花菜', category: '蔬菜', price: 4.8, stock: 160, status: '在售' },
  { name: '甜玉米', category: '蔬菜', price: 3.5, stock: 130, status: '在售' }
])

const modalType = ref('')
const current = reactive({})
const batchRate = ref(0)

const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'create':
      return '新建商品'
    case 'edit':
      return '编辑商品'
    case 'stock':
      return '库存预警'
    case 'batch':
      return '批量调价'
    case 'notify':
      return '缺货提醒'
    default:
      return ''
  }
})

const openCreate = () => {
  Object.assign(current, { name: '', category: '', price: 0, stock: 0, status: '在售' })
  modalType.value = 'create'
}

const openEdit = (row) => {
  Object.assign(current, row)
  modalType.value = 'edit'
}

const openStock = (row) => {
  Object.assign(current, row, { threshold: row.threshold || 20 })
  modalType.value = 'stock'
}

const openNotify = (row) => {
  Object.assign(current, row)
  modalType.value = 'notify'
}

const openBatch = () => {
  batchRate.value = 5
  modalType.value = 'batch'
}

const closeModal = () => {
  modalType.value = ''
}

const saveModal = () => {
  if (modalType.value === 'create') {
    products.push({ ...current })
  }
  if (modalType.value === 'batch') {
    products.forEach((p) => (p.price = +(p.price * (1 + batchRate.value / 100)).toFixed(2)))
  }
  closeModal()
}
</script>

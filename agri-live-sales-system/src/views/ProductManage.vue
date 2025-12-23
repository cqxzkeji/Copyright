<template>
  <MainLayout>
    <section class="card">
      <div class="button-group" style="justify-content: space-between; align-items: center;">
        <div>
          <h3>商品与库存管理</h3>
          <p>管理直播带货商品、库存与补货提醒</p>
        </div>
        <div class="button-group">
          <button class="button" @click="openModal('add')">新增商品</button>
          <button class="button secondary" @click="openModal('stock')">补货申请</button>
          <button class="button ghost" @click="openModal('notice')">库存预警</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>商品名称</th>
            <th>分类</th>
            <th>可售库存</th>
            <th>安全库存</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.sku">
            <td>{{ item.sku }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.safe }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="grid-2">
      <div class="card">
        <h3>库存周转率</h3>
        <div class="chart">
          <div v-for="row in turnover" :key="row.name" class="chart-row">
            <span style="width: 80px;">{{ row.name }}</span>
            <div class="chart-bar"><span :style="{ width: row.value + '%' }"></span></div>
            <strong>{{ row.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>仓储作业进度</h3>
        <p>今日入库任务完成情况</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span style="width: 58%;"></span>
        </div>
      </div>
    </section>
  </MainLayout>

  <ModalDialog
    v-if="activeModal === 'add'"
    title="新增商品"
    confirm-text="保存商品"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="form-grid">
      <div>
        <label>商品名称</label>
        <input placeholder="如：陕西红富士" />
      </div>
      <div>
        <label>SKU 编码</label>
        <input placeholder="自动生成或手动输入" />
      </div>
      <div>
        <label>直播定价</label>
        <input type="number" placeholder="单位：元" />
      </div>
      <div>
        <label>分类</label>
        <select>
          <option>水果</option>
          <option>粮油</option>
          <option>生鲜</option>
        </select>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'stock'"
    title="补货申请"
    confirm-text="提交申请"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>提交后将推送至采购与仓储团队。</p>
    <div class="form-grid">
      <div>
        <label>选择商品</label>
        <select>
          <option>有机富硒大米</option>
          <option>山地苹果礼盒</option>
        </select>
      </div>
      <div>
        <label>补货数量</label>
        <input type="number" placeholder="请输入数量" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'notice'"
    title="库存预警提示"
    confirm-text="确认"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>当前有 6 项商品低于安全库存，请及时补货。</p>
    <div class="progress-bar" style="margin-top: 12px;">
      <span style="width: 30%;"></span>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ModalDialog from '../components/ModalDialog.vue'

const activeModal = ref('')

const products = [
  { sku: 'SKU-001', name: '有机富硒大米', category: '粮油', stock: 880, safe: 300 },
  { sku: 'SKU-002', name: '山地苹果礼盒', category: '水果', stock: 120, safe: 150 },
  { sku: 'SKU-003', name: '高山绿茶', category: '茶饮', stock: 420, safe: 200 },
  { sku: 'SKU-004', name: '生态鸡蛋', category: '生鲜', stock: 680, safe: 500 },
  { sku: 'SKU-005', name: '红心火龙果', category: '水果', stock: 96, safe: 120 },
  { sku: 'SKU-006', name: '紫薯预制包', category: '生鲜', stock: 210, safe: 180 },
  { sku: 'SKU-007', name: '土蜂蜜', category: '滋补', stock: 64, safe: 80 },
  { sku: 'SKU-008', name: '高原牦牛肉', category: '生鲜', stock: 38, safe: 60 },
  { sku: 'SKU-009', name: '鲜玉米', category: '蔬菜', stock: 460, safe: 320 },
  { sku: 'SKU-010', name: '蔬菜盲盒', category: '蔬菜', stock: 150, safe: 140 }
]

const turnover = [
  { name: '水果', value: 82 },
  { name: '粮油', value: 63 },
  { name: '生鲜', value: 71 },
  { name: '茶饮', value: 54 }
]

const openModal = (type) => {
  activeModal.value = type
}
</script>

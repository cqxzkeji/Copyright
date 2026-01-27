<template>
  <section>
    <div class="card-grid">
      <div class="card" v-for="item in stats" :key="item.label">
        <h3>{{ item.label }}</h3>
        <div class="value">{{ item.value }}</div>
        <p>{{ item.note }}</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>库存分类与上架管理</h2>
        <div class="button-group">
          <button class="btn" type="button" @click="openFormModal('新增产品')">新增产品</button>
          <button class="btn secondary" type="button" @click="openProgressModal('批量盘点')">批量盘点</button>
          <button class="btn ghost" type="button" @click="openNoticeModal('标签配置')">标签配置</button>
        </div>
      </div>
      <svg class="chart" viewBox="0 0 600 200" preserveAspectRatio="none">
        <rect x="40" y="80" width="60" height="100" fill="#7ad7ff" />
        <rect x="140" y="40" width="60" height="140" fill="#2454ff" />
        <rect x="240" y="100" width="60" height="80" fill="#7ad7ff" />
        <rect x="340" y="20" width="60" height="160" fill="#2454ff" />
        <rect x="440" y="60" width="60" height="120" fill="#7ad7ff" />
      </svg>
      <div class="table-wrapper" style="margin-top: 16px;">
        <table>
          <thead>
            <tr>
              <th>产品名称</th>
              <th>型号</th>
              <th>分类</th>
              <th>库存</th>
              <th>售价</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.model }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.price }}</td>
              <td>
                <span :class="['status', product.statusClass]">{{ product.status }}</span>
              </td>
              <td>
                <div class="button-group">
                  <button class="btn secondary" type="button" @click="openFormModal('编辑产品')">编辑</button>
                  <button class="btn" type="button" @click="openNoticeModal('上架/下架')">上下架</button>
                  <button class="btn ghost" type="button" @click="openProgressModal('库存调整')">库存</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="modal.show" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <div v-if="modal.formType" class="form-grid">
        <div>
          <label>产品名称</label>
          <input type="text" placeholder="输入产品名称" />
        </div>
        <div>
          <label>型号规格</label>
          <input type="text" placeholder="输入型号" />
        </div>
        <div>
          <label>售价</label>
          <input type="text" placeholder="输入售价" />
        </div>
      </div>
      <div v-if="modal.showProgress" class="progress-bar">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <template #footer>
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import Modal from '../components/Modal.vue';

const stats = [
  { label: '在售型号', value: '86', note: '含新品 12' },
  { label: '低库存', value: '14', note: '需补货' },
  { label: '本周上架', value: '6', note: '新品推广' },
  { label: '平均利润率', value: '34%', note: '同比 +3%' }
];

const products = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `智能设备${index + 1}`,
  model: `SH-${1000 + index}`,
  category: ['智能门锁', '安防摄像头', '照明套装', '环境监测'][index % 4],
  stock: 120 + index * 3,
  price: `¥${(899 + index * 20).toLocaleString()}`,
  status: index % 4 === 0 ? '低库存' : '充足',
  statusClass: index % 4 === 0 ? 'warning' : ''
}));

const modal = reactive({
  show: false,
  title: '',
  message: '',
  formType: false,
  showProgress: false,
  progress: 75
});

const openFormModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `请录入${action}的型号、规格、价格与库存信息。`;
  modal.formType = true;
  modal.showProgress = false;
};

const openProgressModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `系统正在执行${action}流程，请勿关闭页面。`;
  modal.formType = false;
  modal.showProgress = true;
  modal.progress = action === '库存调整' ? 52 : 88;
};

const openNoticeModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `提示：${action}将同步到电商与线下门店渠道。`;
  modal.formType = false;
  modal.showProgress = false;
};

const closeModal = () => {
  modal.show = false;
};
</script>

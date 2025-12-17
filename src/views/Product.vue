<template>
  <div class="container">
    <section class="hero">
      <div class="flex-between">
        <div>
          <h2 style="margin: 0;">商品管理</h2>
          <p>快速上架农产品、调整售价并查看营销标签。数据示例不少于 10 条。</p>
        </div>
        <div class="action-bar">
          <button class="btn primary" @click="showCreate = true">新增商品</button>
          <button class="btn" @click="showPrice = true">批量调价</button>
          <button class="btn ghost" @click="showHint = true">提示</button>
        </div>
      </div>
    </section>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">在售商品</h3>
        <div class="chip-row">
          <span class="badge info">有机优选</span>
          <span class="badge success">冷链</span>
          <span class="badge warning">预售</span>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>商品</th>
            <th>类目</th>
            <th>库存</th>
            <th>售价</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              {{ item.name }}
              <br />
              <small>{{ item.spec }}</small>
            </td>
            <td>{{ item.category }}</td>
            <td><span class="badge info">{{ item.stock }}</span></td>
            <td>¥{{ item.price }}</td>
            <td>
              <span :class="['badge', item.status === '在售' ? 'success' : 'warning']">{{ item.status }}</span>
            </td>
            <td>
              <div class="action-bar">
                <button class="btn primary" @click="edit(item)">编辑</button>
                <button class="btn" @click="showProgress = true">同步</button>
                <button class="btn ghost" @click="showReminder(item.name)">提醒</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="card stat-card">
        <h3 class="section-title">营销标签</h3>
        <div class="tag-cloud">
          <div class="tag" v-for="tag in tags" :key="tag">{{ tag }}</div>
        </div>
      </div>
      <div class="card stat-card">
        <h3 class="section-title">销售趋势</h3>
        <div class="list">
          <div v-for="trend in trends" :key="trend.label" class="list-item">
            <div>
              <strong>{{ trend.label }}</strong>
              <div class="chart-bar"><span :style="{ width: trend.percent + '%' }"></span></div>
            </div>
            <span class="badge success">{{ trend.percent }}%</span>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog v-model="showCreate" title="新增商品" @confirm="showCreate = false">
      <div class="form-grid">
        <label><div class="label">商品名称</div><input class="input" placeholder="输入名称" /></label>
        <label><div class="label">类目</div><input class="input" placeholder="水果/蔬菜" /></label>
        <label><div class="label">售价</div><input class="input" placeholder="¥" /></label>
        <label><div class="label">库存</div><input class="input" placeholder="件" /></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showEdit" title="编辑商品" @confirm="showEdit = false">
      <p>正在编辑：{{ current?.name }}</p>
      <div class="form-grid">
        <label><div class="label">售价</div><input class="input" :value="current?.price" /></label>
        <label><div class="label">上下架</div><select class="input"><option>在售</option><option>预售</option></select></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showPrice" title="批量调价" @confirm="showPrice = false">
      <p>将对选定的 10 个商品执行批量调价任务。</p>
      <div class="progress-bar"><div class="fill" style="width: 45%"></div></div>
    </ModalDialog>

    <ModalDialog v-model="showHint" title="操作提示" @confirm="showHint = false">
      <p>可在编辑弹窗中调整售价与上下架状态，调价会自动同步到前台站点、团购渠道与小程序。</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="同步中">
      <div class="progress-bar"><div class="fill" style="width: 70%"></div></div>
      <p style="color: var(--muted);">正在同步商品信息到前台小程序与自营店铺</p>
    </ModalDialog>

    <ModalDialog v-model="showToast" title="提醒">
      <p>{{ reminder }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const products = ref([
  { id: 'P-001', name: '赣南脐橙', spec: '5kg 礼盒', category: '水果', stock: 240, price: 89, status: '在售' },
  { id: 'P-002', name: '丹东草莓', spec: '24 粒精品', category: '水果', stock: 120, price: 129, status: '在售' },
  { id: 'P-003', name: '湛江对虾', spec: '净重 2kg', category: '水产', stock: 60, price: 159, status: '预售' },
  { id: 'P-004', name: '崇明生态鸡蛋', spec: '30 枚', category: '禽蛋', stock: 310, price: 49, status: '在售' },
  { id: 'P-005', name: '内蒙古牛腩', spec: '1.5kg 冷鲜', category: '肉类', stock: 80, price: 198, status: '在售' },
  { id: 'P-006', name: '云南小黄姜', spec: '2kg/袋', category: '蔬菜', stock: 260, price: 32, status: '在售' },
  { id: 'P-007', name: '烟台苹果', spec: '12 只精品', category: '水果', stock: 140, price: 69, status: '在售' },
  { id: 'P-008', name: '舟山带鱼', spec: '1kg 冷冻', category: '水产', stock: 110, price: 58, status: '预售' },
  { id: 'P-009', name: '东北黄小米', spec: '3kg 真空装', category: '粮油', stock: 200, price: 39, status: '在售' },
  { id: 'P-010', name: '赣南脐橙迷你装', spec: '2kg', category: '水果', stock: 180, price: 49, status: '在售' },
  { id: 'P-011', name: '新疆红枣', spec: '1kg/袋', category: '干货', stock: 95, price: 59, status: '在售' }
]);

const tags = ['溯源', '助农扶贫', '冷链加价', '次日达', '直播秒杀', '产地直发', '预售锁价', '高分好评'];
const trends = [
  { label: '水果', percent: 86 },
  { label: '蔬菜', percent: 72 },
  { label: '水产', percent: 64 },
  { label: '粮油干货', percent: 58 }
];

const showCreate = ref(false);
const showEdit = ref(false);
const showPrice = ref(false);
const showProgress = ref(false);
const showToast = ref(false);
const showHint = ref(false);
const reminder = ref('');
const current = ref(null);

const edit = (item) => {
  current.value = item;
  showEdit.value = true;
};

const showReminder = (name) => {
  reminder.value = `${name} 已加入上架巡检，通知已发送到质检群。`;
  showToast.value = true;
};
</script>

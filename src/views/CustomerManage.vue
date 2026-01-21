<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>用户与客户管理</h2>
        <p>管理个人与团购客户信息，记录历史订单与偏好。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">新增客户</button>
        <button class="ghost" @click="openModal('follow')">回访记录</button>
        <button class="ghost" @click="openModal('grade')">客户分级</button>
        <button class="ghost" @click="openModal('preference')">查看偏好</button>
      </div>
    </header>

    <div class="summary-grid">
      <div class="summary-card">
        <h3>客户总数</h3>
        <strong>126 位</strong>
        <span>团购客户 18 位</span>
      </div>
      <div class="summary-card">
        <h3>活跃客户</h3>
        <strong>82 位</strong>
        <span>近 30 天下单</span>
      </div>
      <div class="summary-card">
        <h3>复购率</h3>
        <strong>68%</strong>
        <span>重点客户维护中</span>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>客户编号</th>
            <th>客户名称</th>
            <th>客户类型</th>
            <th>等级</th>
            <th>偏好品类</th>
            <th>历史订单数</th>
            <th>联系方式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.id">
            <td>{{ customer.id }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.type }}</td>
            <td><span class="tag">{{ customer.level }}</span></td>
            <td>{{ customer.preference }}</td>
            <td>{{ customer.orders }}</td>
            <td>{{ customer.contact }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="modalVisible" :title="modalTitle">
      <div v-if="modalType === 'create'" class="form-grid">
        <label>
          客户名称
          <input v-model="form.name" placeholder="请输入客户名称" />
        </label>
        <label>
          客户类型
          <select v-model="form.type">
            <option value="个人">个人</option>
            <option value="团购">团购</option>
            <option value="企业">企业</option>
          </select>
        </label>
        <label>
          联系方式
          <input v-model="form.contact" placeholder="手机号/座机" />
        </label>
        <label>
          偏好品类
          <input v-model="form.preference" placeholder="如 草莓、番茄" />
        </label>
      </div>
      <div v-else-if="modalType === 'follow'" class="form-grid">
        <label>
          客户编号
          <input v-model="form.id" placeholder="请输入客户编号" />
        </label>
        <label>
          回访记录
          <textarea v-model="form.note" rows="3" placeholder="回访内容与需求" />
        </label>
      </div>
      <div v-else-if="modalType === 'grade'">
        <p>请选择需要调整的客户等级，并同步更新优惠策略。</p>
        <div class="form-grid">
          <label>
            客户编号
            <input v-model="form.id" placeholder="请输入客户编号" />
          </label>
          <label>
            新等级
            <select v-model="form.level">
              <option value="A">A - 核心</option>
              <option value="B">B - 重点</option>
              <option value="C">C - 常规</option>
            </select>
          </label>
        </div>
      </div>
      <div v-else>
        <p>客户偏好与历史订单分析：</p>
        <ul class="detail-list">
          <li>平均订单量：92 kg</li>
          <li>常购品类：草莓、番茄、葡萄</li>
          <li>偏好时间段：上午 9-11 点</li>
          <li>回访建议：每周推送团购优惠</li>
        </ul>
      </div>
      <template #footer>
        <button class="ghost" @click="modalVisible = false">关闭</button>
        <button class="primary" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const customers = ref([
  { id: 'CU-24001', name: '青禾商贸', type: '企业', level: 'A', preference: '草莓/葡萄', orders: 36, contact: '136-5522-1201' },
  { id: 'CU-24002', name: '悦享团购', type: '团购', level: 'A', preference: '番茄/黄瓜', orders: 28, contact: '139-8833-2209' },
  { id: 'CU-24003', name: '佳味餐饮', type: '企业', level: 'B', preference: '西兰花/生菜', orders: 22, contact: '137-6622-3410' },
  { id: 'CU-24004', name: '晓米家庭', type: '个人', level: 'C', preference: '草莓/苹果', orders: 12, contact: '135-7789-2211' },
  { id: 'CU-24005', name: '绿晨超市', type: '企业', level: 'A', preference: '番茄/辣椒', orders: 30, contact: '188-1122-5578' },
  { id: 'CU-24006', name: '馨悦团购', type: '团购', level: 'B', preference: '葡萄/蓝莓', orders: 24, contact: '136-8899-7712' },
  { id: 'CU-24007', name: '好运餐厅', type: '企业', level: 'B', preference: '黄瓜/茄子', orders: 19, contact: '137-8810-4433' },
  { id: 'CU-24008', name: '清甜社区', type: '团购', level: 'A', preference: '草莓/番茄', orders: 27, contact: '139-2211-6578' },
  { id: 'CU-24009', name: '山河配送', type: '企业', level: 'B', preference: '葡萄/西红柿', orders: 21, contact: '186-1102-7788' },
  { id: 'CU-24010', name: '和风家庭', type: '个人', level: 'C', preference: '西兰花/玉米', orders: 9, contact: '135-7711-6042' },
  { id: 'CU-24011', name: '溪谷团购', type: '团购', level: 'A', preference: '草莓/葡萄', orders: 26, contact: '136-9911-2202' },
  { id: 'CU-24012', name: '稻香餐饮', type: '企业', level: 'B', preference: '番茄/黄瓜', orders: 18, contact: '188-7733-1098' },
  { id: 'CU-24013', name: '小满家庭', type: '个人', level: 'C', preference: '蓝莓/桃', orders: 8, contact: '136-1100-4321' },
  { id: 'CU-24014', name: '丰盛超市', type: '企业', level: 'A', preference: '西兰花/芹菜', orders: 33, contact: '139-8822-5401' },
  { id: 'CU-24015', name: '新鲜团购', type: '团购', level: 'B', preference: '草莓/番茄', orders: 20, contact: '137-5500-6651' },
  { id: 'CU-24016', name: '慢香餐厅', type: '企业', level: 'B', preference: '南瓜/香菇', orders: 16, contact: '135-6677-9021' },
  { id: 'CU-24017', name: '甜橙家庭', type: '个人', level: 'C', preference: '葡萄/草莓', orders: 10, contact: '139-7712-4833' },
  { id: 'CU-24018', name: '优鲜配送', type: '企业', level: 'A', preference: '苹果/梨', orders: 29, contact: '188-2211-3322' },
  { id: 'CU-24019', name: '丰年团购', type: '团购', level: 'B', preference: '黄瓜/番茄', orders: 23, contact: '137-8822-5438' },
  { id: 'CU-24020', name: '春芽家庭', type: '个人', level: 'C', preference: '西兰花/生菜', orders: 7, contact: '136-0022-1900' }
]);

const modalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref('create');
const form = reactive({
  id: '',
  name: '',
  type: '个人',
  level: 'A',
  contact: '',
  preference: '',
  note: ''
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  const titles = {
    create: '新增客户',
    follow: '回访记录',
    grade: '客户分级调整',
    preference: '客户偏好分析'
  };
  modalTitle.value = titles[type];
};

const submitModal = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.summary-card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #f7fbf8;
  display: grid;
  gap: 6px;
}

.table-card {
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 14px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e8f5ff;
  color: #2d6f9b;
  font-size: 12px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.detail-list {
  padding-left: 20px;
  display: grid;
  gap: 6px;
}

.primary {
  background: var(--primary);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}
</style>

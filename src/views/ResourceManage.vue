<template>
  <div>
    <div class="section-header">
      <div>
        <p class="status-pill">资源整合与主体管理</p>
        <small>整合农产品供应商、农技服务与物流主体，确保供给与履约协同</small>
      </div>
      <div class="nav-links">
        <button class="btn" @click="openModal('entity')">新增主体</button>
        <button class="btn secondary" @click="openModal('sync')">同步产地仓</button>
        <button class="btn secondary" @click="openModal('training')">开通培训</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <div class="section-header">
          <span>{{ stat.label }}</span>
          <span class="status-pill">{{ stat.trend }}</span>
        </div>
        <p style="font-size: 26px; margin: 6px 0; color: #1b72e8;">{{ stat.value }}</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: stat.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>主体名称</th>
          <th>类型</th>
          <th>供应品类</th>
          <th>覆盖区域</th>
          <th>月供货</th>
          <th>协同状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in entities" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.region }}</td>
          <td>{{ item.capacity }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
          <td>
            <button class="btn secondary" @click="openModal('entity', item)">调整</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
      <template v-if="modal.type === 'entity'">
        <form class="form-grid" @submit.prevent="saveEntity">
          <div>
            <label>主体名称</label>
            <input v-model="form.name" required />
          </div>
          <div>
            <label>主体类型</label>
            <select v-model="form.type">
              <option>合作社</option>
              <option>加工厂</option>
              <option>县域品牌</option>
              <option>物流站点</option>
            </select>
          </div>
          <div>
            <label>供应品类</label>
            <input v-model="form.category" />
          </div>
          <div>
            <label>覆盖区域</label>
            <input v-model="form.region" />
          </div>
          <div>
            <label>月供货能力</label>
            <input v-model="form.capacity" />
          </div>
          <button class="btn" type="submit">保存主体</button>
        </form>
      </template>
      <template v-else-if="modal.type === 'sync'">
        <p>正在同步产地仓库存与周转信息，预计 20s 完成。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="margin-top: 10px;">{{ progress }}% 已完成</div>
      </template>
      <template v-else>
        <form class="form-grid" @submit.prevent="submitTraining">
          <div>
            <label>培训主题</label>
            <input v-model="training.title" placeholder="如：短视频选品" />
          </div>
          <div>
            <label>参与主体</label>
            <select v-model="training.target">
              <option>全体合作社</option>
              <option>村播达人</option>
              <option>产地仓运营</option>
            </select>
          </div>
          <div>
            <label>培训时间</label>
            <input v-model="training.time" type="datetime-local" />
          </div>
          <button class="btn" type="submit">安排培训</button>
        </form>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const stats = [
  { label: '核心供应主体', value: 32, trend: '+4 本月新增', progress: 64 },
  { label: '可用库存(吨)', value: '2860', trend: '实时更新', progress: 72 },
  { label: '履约线路', value: 18, trend: '新增2条', progress: 55 },
  { label: '培训完成率', value: '78%', trend: '5 场进行中', progress: 78 }
];

const entities = reactive([
  { name: '晨光果蔬合作社', type: '合作社', category: '瓜果蔬菜', region: '湘潭·乡镇', capacity: '320 吨', status: '稳定' },
  { name: '桐乡羊毛衫基地', type: '加工厂', category: '羊毛衫', region: '浙江·桐乡', capacity: '28 万件', status: '待审核' },
  { name: '稻花香合作社', type: '合作社', category: '大米', region: '黑龙江·五常', capacity: '480 吨', status: '稳定' },
  { name: '椒香农场', type: '合作社', category: '花椒', region: '四川·汉源', capacity: '120 吨', status: '稳定' },
  { name: '山泉水厂', type: '加工厂', category: '瓶装水', region: '贵州·黔南', capacity: '36 万箱', status: '测试中' },
  { name: '黄桃罐头联盟', type: '县域品牌', category: '罐头', region: '安徽·砀山', capacity: '60 万箱', status: '稳定' },
  { name: '冷链驿站一号', type: '物流站点', category: '冷链', region: '河南·郑州', capacity: '日转 1200 单', status: '稳定' },
  { name: '冷链驿站二号', type: '物流站点', category: '冷链', region: '湖南·长沙', capacity: '日转 900 单', status: '稳定' },
  { name: '茶叶深加工中心', type: '加工厂', category: '茶叶', region: '福建·武夷', capacity: '8 吨', status: '维护' },
  { name: '智慧农技站', type: '县域品牌', category: '农资套餐', region: '云南·玉溪', capacity: '年度 20 万套', status: '稳定' }
]);

const modal = reactive({ visible: false, type: 'entity', title: '主体管理' });
const form = reactive({ name: '', type: '合作社', category: '', region: '', capacity: '' });
const training = reactive({ title: '', target: '全体合作社', time: '' });
const progress = ref(25);

const openModal = (type, item) => {
  modal.type = type;
  modal.visible = true;
  modal.title = type === 'sync' ? '同步产地仓' : type === 'training' ? '培训安排' : '主体管理';
  if (item) {
    Object.assign(form, item);
  } else {
    Object.assign(form, { name: '', type: '合作社', category: '', region: '', capacity: '' });
  }
  if (type === 'sync') {
    progress.value = 25;
    const timer = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer);
      } else {
        progress.value += 15;
      }
    }, 600);
  }
};

const saveEntity = () => {
  const existing = entities.find((e) => e.name === form.name);
  if (existing) {
    Object.assign(existing, form);
  } else {
    entities.unshift({ ...form, status: '待审核' });
  }
  modal.visible = false;
};

const submitTraining = () => {
  modal.visible = false;
};
</script>

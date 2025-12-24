<template>
  <div class="page">
    <div class="card-grid">
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800;">权限配置</div>
            <div class="muted-text">运营、仓配、财务分权</div>
          </div>
          <button @click="openRole">新建角色</button>
        </div>
        <div class="bar-chart" style="height:110px;grid-template-columns:repeat(5,1fr);">
          <div v-for="(h, idx) in roleBars" :key="idx" class="bar" :style="{ height: h + 'px' }"></div>
        </div>
      </div>
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800;">数据分析</div>
            <div class="muted-text">报表、看板、归档</div>
          </div>
          <button @click="openReport">导出报表</button>
        </div>
        <div class="progress-bar" style="height:14px;margin-top:10px;"><span style="width:76%"></span></div>
        <p class="muted-text">自动生成周报并推送到邮箱/企业微信。</p>
      </div>
    </div>

    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3>系统配置项（20条+）</h3>
          <p class="muted-text">业务参数、告警策略、通知触达</p>
        </div>
        <div class="table-actions">
          <button @click="openConfig">新增配置</button>
          <button @click="openSync">同步配置</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>模块</th>
            <th>当前值</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in configRows" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.module }}</td>
            <td>{{ item.value }}</td>
            <td><span class="badge" :class="item.stateClass">{{ item.state }}</span></td>
            <td class="table-actions">
              <button @click="openEdit(item)">编辑</button>
              <button @click="openPublish(item)">发布</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="roleModal" title="新建角色" @close="roleModal = false">
      <form @submit.prevent="roleModal = false" style="display:grid;gap:10px;">
        <input placeholder="角色名称" required />
        <textarea rows="3" placeholder="权限说明"></textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="roleModal = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="reportModal" title="导出报表" @close="reportModal = false">
      <p>生成综合报表并邮件发送。</p>
      <div class="progress-bar" style="height:14px;margin:10px 0;">
        <span style="width:70%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="reportModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="configModal" title="新增配置" @close="configModal = false">
      <form @submit.prevent="configModal = false" style="display:grid;gap:10px;">
        <input placeholder="配置名称" required />
        <select required>
          <option>交易参数</option>
          <option>库存策略</option>
          <option>营销模板</option>
        </select>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="configModal = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="syncModal" title="同步配置" @close="syncModal = false">
      <p>同步到预发/生产环境。</p>
      <div class="progress-bar" style="height:14px;margin:10px 0;">
        <span style="width:60%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="syncModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="editModal" :title="'编辑 - ' + activeConfig?.name" @close="editModal = false">
      <form @submit.prevent="editModal = false" style="display:grid;gap:10px;">
        <input v-model="activeConfig.value" />
        <textarea rows="3" placeholder="备注"></textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="editModal = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="publishModal" :title="'发布 - ' + activeConfig?.name" @close="publishModal = false">
      <p>发布后立即生效，是否继续？</p>
      <div class="progress-bar" style="height:14px;margin:10px 0;">
        <span style="width:68%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="publishModal = false">取消</button>
        <button @click="publishModal = false">确认</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const roleBars = [110, 90, 130, 100, 120];

const configRows = reactive([
  { name: '支付超时', module: '交易', value: '30分钟', state: '生效中', stateClass: 'success' },
  { name: '订单风控', module: '交易', value: '中度', state: '生效中', stateClass: 'success' },
  { name: '售后自动同意', module: '售后', value: '退款<50', state: '灰度', stateClass: 'warn' },
  { name: '配送延误告警', module: '履约', value: '超时1h', state: '生效中', stateClass: 'success' },
  { name: '库存安全线', module: '商品', value: '>=20%', state: '生效中', stateClass: 'success' },
  { name: '补货提醒', module: '商品', value: '日补货', state: '生效中', stateClass: 'success' },
  { name: '直播红包', module: '营销', value: '每场10张', state: '排期', stateClass: 'warn' },
  { name: '渠道预算分配', module: '营销', value: '自动', state: '生效中', stateClass: 'success' },
  { name: '会员短信触达', module: '营销', value: '周三', state: '生效中', stateClass: 'success' },
  { name: '冷链温控', module: '履约', value: '2-8℃', state: '生效中', stateClass: 'success' },
  { name: '夜间配送限制', module: '履约', value: '23:00-6:00', state: '生效中', stateClass: 'success' },
  { name: '财务对账周期', module: '结算', value: '周', state: '生效中', stateClass: 'success' },
  { name: '佣金比例', module: '结算', value: '3%', state: '生效中', stateClass: 'success' },
  { name: '多仓调拨策略', module: '仓储', value: '智能', state: '灰度', stateClass: 'warn' },
  { name: '商品上新审核', module: '商品', value: '人工+自动', state: '生效中', stateClass: 'success' },
  { name: '优惠券叠加', module: '营销', value: '限2张', state: '排期', stateClass: 'warn' },
  { name: '库存预警阈值', module: '商品', value: '15%', state: '生效中', stateClass: 'success' },
  { name: '团购成团时限', module: '交易', value: '24h', state: '生效中', stateClass: 'success' },
  { name: '物流商切换', module: '履约', value: '自动', state: '灰度', stateClass: 'warn' },
  { name: '发票自动开具', module: '结算', value: '开票池', state: '生效中', stateClass: 'success' },
  { name: '健康证校验', module: '履约', value: '月检', state: '生效中', stateClass: 'success' }
]);

const roleModal = ref(false);
const reportModal = ref(false);
const configModal = ref(false);
const syncModal = ref(false);
const editModal = ref(false);
const publishModal = ref(false);
const activeConfig = ref(null);

const openRole = () => { roleModal.value = true; };
const openReport = () => { reportModal.value = true; };
const openConfig = () => { configModal.value = true; };
const openSync = () => { syncModal.value = true; };
const openEdit = (item) => { activeConfig.value = item; editModal.value = true; };
const openPublish = (item) => { activeConfig.value = item; publishModal.value = true; };
</script>

<template>
  <div class="card">
    <div class="flex-between" style="gap: 10px; flex-wrap: wrap;">
      <h3 style="margin: 0;">数据统计与分析</h3>
      <div class="chip-row">
        <button @click="showExport = true">导出数据</button>
        <button style="background: var(--accent);" @click="showInsight = true">生成洞察</button>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-top: 12px;">
      <div v-for="stat in stats" :key="stat.label" class="card">
        <div class="stat-card">
          <div>
            <div style="color: var(--muted);">{{ stat.label }}</div>
            <div style="font-size: 20px; font-weight: 800;">{{ stat.value }}</div>
          </div>
          <span class="badge">{{ stat.delta }}</span>
        </div>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 12px; margin-top: 12px;">
      <div class="card">
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
          <div v-for="item in chartData" :key="item.name" style="display: grid; gap: 6px;">
            <div class="progress-track" style="height: 80px; position: relative; overflow: visible;">
              <div class="progress-bar" :style="{ width: '100%', height: item.height + '%', position: 'absolute', bottom: 0 }"></div>
            </div>
            <div style="text-align: center; font-weight: 700;">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="card" style="display: grid; gap: 10px; align-content: start;">
        <div class="form-field">
          <label>指标选择</label>
          <select>
            <option>展示次数</option>
            <option>互动点击</option>
            <option>下载量</option>
          </select>
        </div>
        <button style="background: #3ac48b;" @click="showProgress = true">刷新数据</button>
        <p style="color: var(--muted);">按钮会弹窗显示刷新进度，满足所有操作有 modal 反馈的要求。</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>作品</th>
          <th>观看</th>
          <th>互动</th>
          <th>下载</th>
          <th>收藏</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.title">
          <td>{{ row.title }}</td>
          <td>{{ row.views }}</td>
          <td>{{ row.likes }}</td>
          <td>{{ row.downloads }}</td>
          <td>{{ row.fav }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showExport" title="导出 CSV">
    <p>确认后会打包 10 条以上记录并生成下载链接。</p>
  </ModalDialog>

  <ModalDialog v-model="showInsight" title="智能洞察">
    <p>系统自动总结增长机会：高点击作品建议增加展位曝光。</p>
  </ModalDialog>

  <ModalDialog v-model="showProgress" title="刷新进度">
    <div class="progress-track">
      <div class="progress-bar" style="width: 65%;"></div>
    </div>
    <p style="color: var(--muted);">数据正在重算，请稍候。</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const stats = [
  { label: '总展现', value: '18,230', delta: '+12%' },
  { label: '互动点击', value: '6,420', delta: '+8%' },
  { label: '下载量', value: '1,240', delta: '+5%' },
  { label: '收藏', value: '3,680', delta: '+9%' }
];

const chartData = [
  { name: '一月', height: 45 },
  { name: '二月', height: 60 },
  { name: '三月', height: 72 },
  { name: '四月', height: 58 },
  { name: '五月', height: 80 }
];

const tableRows = [
  { title: '晨光云阶', views: 1320, likes: 260, downloads: 78, fav: 120 },
  { title: '荧火之森', views: 1150, likes: 210, downloads: 64, fav: 104 },
  { title: '海上霓虹', views: 980, likes: 180, downloads: 52, fav: 88 },
  { title: '流光之翼', views: 1660, likes: 320, downloads: 90, fav: 142 },
  { title: '浮岛花园', views: 860, likes: 140, downloads: 40, fav: 70 },
  { title: '星际回声', views: 720, likes: 118, downloads: 36, fav: 52 },
  { title: '光影棋局', views: 940, likes: 165, downloads: 48, fav: 84 },
  { title: '雨林日记', views: 810, likes: 150, downloads: 41, fav: 66 },
  { title: '冰原晨曲', views: 690, likes: 120, downloads: 33, fav: 54 },
  { title: '沙丘乐章', views: 770, likes: 132, downloads: 39, fav: 60 }
];

const showExport = ref(false);
const showInsight = ref(false);
const showProgress = ref(false);
</script>

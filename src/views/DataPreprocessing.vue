<template>
  <div class="container">
    <div class="flex-between">
      <div>
        <h2>数据预处理</h2>
        <p class="muted">质量校验、清洗与特征工程统一编排</p>
      </div>
      <button class="secondary" @click="showPipeline = true">执行预处理</button>
    </div>

    <div class="grid two" style="grid-template-columns: 2fr 1fr; margin-top: 16px;">
      <div class="card">
        <div class="flex-between">
          <h3>质量校验</h3>
          <button class="ghost" @click="showRule = true">规则配置</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>规则</th>
              <th>覆盖字段</th>
              <th>通过率</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rule in rules" :key="rule.name">
              <td>{{ rule.name }}</td>
              <td>{{ rule.fields }}</td>
              <td>{{ rule.pass }}%</td>
              <td>{{ rule.time }}</td>
              <td><button class="ghost" @click="inspect(rule)">查看</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="flex-between">
          <h3>特征工程</h3>
          <button class="ghost" @click="showFeature = true">生成特征</button>
        </div>
        <ul>
          <li v-for="item in features" :key="item.name" class="muted">{{ item.name }}（来源：{{ item.source }}）</li>
        </ul>
      </div>
    </div>

    <div v-if="showRule" class="modal-overlay" @click.self="showRule = false">
      <div class="modal">
        <div class="modal-header">
          <h3>质量规则配置</h3>
          <button class="ghost" @click="showRule = false">关闭</button>
        </div>
        <p>选择需要启用的校验项：</p>
        <div class="tag-row">
          <span class="mini-tag" style="background:#ecfeff;color:#0ea5e9">缺失值填补</span>
          <span class="mini-tag" style="background:#eef2ff;color:#4338ca">异常值截断</span>
          <span class="mini-tag" style="background:#fef9c3;color:#854d0e">时间序列平滑</span>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showRule = false">取消</button>
          <button @click="showRule = false">应用</button>
        </div>
      </div>
    </div>

    <div v-if="showPipeline" class="modal-overlay" @click.self="showPipeline = false">
      <div class="modal">
        <div class="modal-header">
          <h3>预处理执行</h3>
          <button class="ghost" @click="showPipeline = false">关闭</button>
        </div>
        <p>批量运行清洗、标准化、特征生成，执行进度：</p>
        <div class="progress">
          <div class="progress-bar" style="width: 45%; background: var(--primary);"></div>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showPipeline = false">暂停</button>
          <button @click="showPipeline = false">继续</button>
        </div>
      </div>
    </div>

    <div v-if="showFeature" class="modal-overlay" @click.self="showFeature = false">
      <div class="modal">
        <div class="modal-header">
          <h3>特征生成</h3>
          <button class="ghost" @click="showFeature = false">关闭</button>
        </div>
        <p>依据选择的规则生成新特征，示例：</p>
        <ul>
          <li>传感器振幅·标准化</li>
          <li>API响应时间·滑动窗口</li>
          <li>日志告警密度·小时级</li>
        </ul>
        <div class="modal-actions">
          <button class="ghost" @click="showFeature = false">取消</button>
          <button @click="showFeature = false">开始生成</button>
        </div>
      </div>
    </div>

    <div v-if="detailRule" class="modal-overlay" @click.self="detailRule = null">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ detailRule?.name }} - 校验详情</h3>
          <button class="ghost" @click="detailRule = null">关闭</button>
        </div>
        <p>覆盖字段：{{ detailRule?.fields }}</p>
        <p>通过率：{{ detailRule?.pass }}%</p>
        <p class="muted">最近更新：{{ detailRule?.time }}</p>
        <div class="modal-actions">
          <button class="ghost" @click="detailRule = null">关闭</button>
          <button @click="detailRule = null">重新执行</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const rules = [
  { name: '缺失值填补', fields: '温度、湿度、功率', pass: 97, time: '10:40' },
  { name: '数据类型校验', fields: '日志字段、ID', pass: 92, time: '10:32' },
  { name: '异常值剔除', fields: '电流、电压', pass: 89, time: '10:15' },
  { name: '时序排序', fields: 'PLC数据', pass: 95, time: '09:55' },
  { name: '编码一致性', fields: '设备型号、区域码', pass: 90, time: '09:20' }
];

const features = [
  { name: '实时功率平滑', source: '传感器' },
  { name: '日志异常频次', source: '日志' },
  { name: 'API成功率趋势', source: 'API' },
  { name: '库存吞吐', source: '数据库' }
];

const showRule = ref(false);
const showPipeline = ref(false);
const showFeature = ref(false);
const detailRule = ref(null);

const inspect = (rule) => {
  detailRule.value = rule;
};
</script>

<style scoped>
.muted { color: var(--muted); }
</style>

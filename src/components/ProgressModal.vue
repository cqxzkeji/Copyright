<template>
  <div v-if="visible" class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card small">
      <header class="modal-header">
        <h3>{{ title }}</h3>
      </header>
      <section class="modal-body">
        <p>{{ description }}</p>
        <div class="progress-wrap">
          <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
        </div>
        <p class="progress-text">{{ progress }}%</p>
      </section>
      <footer class="modal-footer">
        <button class="primary" @click="$emit('close')">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
  description: String,
  progress: Number
})
</script>

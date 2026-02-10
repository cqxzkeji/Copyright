<template>
  <div v-if="visible" class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="ghost" @click="$emit('close')">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <button class="ghost" @click="$emit('close')">取消</button>
        <button class="primary" @click="$emit('confirm')">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '提示'
  }
})
</script>

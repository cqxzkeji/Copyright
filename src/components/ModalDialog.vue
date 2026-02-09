<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-mask" @click.self="$emit('update:modelValue', false)">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-btn" @click="$emit('update:modelValue', false)">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <button class="btn secondary" @click="$emit('update:modelValue', false)">关闭</button>
          <button v-if="showConfirm" class="btn" @click="$emit('confirm')">确认</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' },
  showConfirm: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'confirm'])
</script>

<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true" @click.self="onClose">
    <div class="modal-card">
      <header class="flex-between" style="margin-bottom: 12px">
        <div>
          <p class="badge" v-if="badge">{{ badge }}</p>
          <h3 style="margin: 6px 0 0">{{ title }}</h3>
        </div>
        <button class="secondary-btn" @click="onClose">关闭</button>
      </header>
      <div style="color: var(--muted); margin-bottom: 12px" v-if="description">{{ description }}</div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  badge: String,
  onClose: Function
})

const emit = defineEmits(['close'])

const onClose = () => {
  emit('close')
  props?.onClose?.()
}
</script>

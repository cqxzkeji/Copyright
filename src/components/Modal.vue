<template>
  <teleport to="body">
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <header>
          <h3>{{ title }}</h3>
          <button class="btn ghost" @click="$emit('close')">关闭</button>
        </header>
        <div>
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

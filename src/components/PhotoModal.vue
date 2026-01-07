<template>
  <div
    class="photo-modal"
    :class="{ active: isOpen }"
    @click.self="$emit('close')"
  >
    <div class="modal-content">
      <span class="close-modal" @click="$emit('close')">&times;</span>
      <img :src="imageSrc" :alt="t('common.modal.imageAlt')" class="modal-image" />
      <div class="modal-hint">{{ t('common.modal.hint') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

defineProps<{
  isOpen: boolean
  imageSrc: string
}>()

defineEmits<{
  close: []
}>()
</script>

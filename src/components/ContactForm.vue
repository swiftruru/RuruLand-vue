<template>
  <div class="contact-form-wrapper">
    <form
      class="contact-form"
      @submit.prevent="handleSubmit"
      :class="{ submitting: isSubmitting }"
    >
      <input
        type="hidden"
        name="access_key"
        value="de4416f1-497c-4bad-92e5-a0f961dd9d80"
      />

      <!-- 姓名欄位 -->
      <div class="form-group">
        <label for="name">{{ t('contact.form.name') }}</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          name="name"
          :placeholder="t('contact.form.namePlaceholder')"
          required
          :disabled="isSubmitting"
        />
      </div>

      <!-- Email 欄位 -->
      <div class="form-group">
        <label for="email">{{ t('contact.form.email') }}</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          name="email"
          :placeholder="t('contact.form.emailPlaceholder')"
          required
          :disabled="isSubmitting"
        />
      </div>

      <!-- 主旨欄位 -->
      <div class="form-group">
        <label for="subject">{{ t('contact.form.subject') }}</label>
        <input
          id="subject"
          v-model="formData.subject"
          type="text"
          name="subject"
          :placeholder="t('contact.form.subjectPlaceholder')"
          required
          :disabled="isSubmitting"
        />
      </div>

      <!-- 訊息欄位 -->
      <div class="form-group">
        <label for="message">{{ t('contact.form.message') }}</label>
        <textarea
          id="message"
          v-model="formData.message"
          name="message"
          rows="5"
          :placeholder="t('contact.form.messagePlaceholder')"
          required
          :disabled="isSubmitting"
        ></textarea>
      </div>

      <!-- 提交按鈕 -->
      <button
        type="submit"
        class="btn btn-primary submit-btn"
        :disabled="isSubmitting"
      >
        <span v-if="!isSubmitting">{{ t('contact.form.submit') }}</span>
        <span v-else>{{ t('contact.form.sending') }}</span>
      </button>

      <!-- 成功訊息 -->
      <div v-if="showSuccess" class="form-message success">
        {{ t('contact.form.successMessage') }}
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="showError" class="form-message error">
        {{ t('contact.form.errorMessage') }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { trackEvent } from '../composables/useGoogleAnalytics'

const { t } = useLanguage()

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)

async function handleSubmit(event: Event) {
  isSubmitting.value = true
  showSuccess.value = false
  showError.value = false

  try {
    const form = event.target as HTMLFormElement
    const formDataObj = new FormData(form)

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formDataObj
    })

    const data = await response.json()

    if (data.success) {
      showSuccess.value = true
      // 追蹤成功提交事件
      trackEvent('contact_form_submit', {
        status: 'success'
      })
      // 清空表單
      formData.name = ''
      formData.email = ''
      formData.subject = ''
      formData.message = ''
      // 3 秒後隱藏成功訊息
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    } else {
      showError.value = true
      trackEvent('contact_form_submit', {
        status: 'error',
        error: data.message
      })
    }
  } catch (error) {
    showError.value = true
    trackEvent('contact_form_submit', {
      status: 'error',
      error: 'network_error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

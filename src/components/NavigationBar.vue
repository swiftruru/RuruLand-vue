<template>
  <nav>
    <div class="container">
      <div class="logo">Ruru's Portfolio</div>

      <ul class="nav-links" :class="{ active: isMenuOpen }">
        <li><a href="#home" @click="closeMenu">{{ t('common.nav.home') }}</a></li>
        <li><a href="#about" @click="closeMenu">{{ t('common.nav.about') }}</a></li>
        <li><a href="#timeline" @click="closeMenu">{{ t('common.nav.timeline') }}</a></li>
        <li><a href="#projects" @click="closeMenu">{{ t('common.nav.projects') }}</a></li>
        <li><a href="#contact" @click="closeMenu">{{ t('common.nav.contact') }}</a></li>
      </ul>

      <div class="nav-actions">
        <button
          class="lang-switch"
          @click="toggleLanguage"
          aria-label="語言切換"
        >
          <span class="lang-text">{{ languageButtonText }}</span>
        </button>

        <button
          class="hamburger"
          :class="{ active: isMenuOpen }"
          @click="toggleMenu"
          aria-label="選單"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'
import { useMenu } from '../composables/useMenu'

// 語言切換邏輯
const { t, languageButtonText, toggleLanguage } = useLanguage()

// 選單控制邏輯
const { isMenuOpen, toggleMenu, closeMenu } = useMenu()
</script>

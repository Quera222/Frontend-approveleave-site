<template>
  <div class="language-switcher">
    <button 
      @click="changeLanguage('pl')" 
      :class="{ active: currentLocale === 'pl' }"
      class="lang-btn"
      title="Polski"
    >
      PL
    </button>
    <span class="separator">|</span>
    <button 
      @click="changeLanguage('en')" 
      :class="{ active: currentLocale === 'en' }"
      class="lang-btn"
      title="English"
    >
      EN
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const currentLocale = computed(() => locale.value);

const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
  padding: 4px;
  transition: color 0.2s;
}

.lang-btn:hover {
  color: #0d6efd;
}

.lang-btn.active {
  color: #0d6efd;
  font-weight: 700;
}

.separator {
  color: #dee2e6;
}
</style>

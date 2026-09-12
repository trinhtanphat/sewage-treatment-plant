<script setup>
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import enUS from 'ant-design-vue/es/locale/en_US';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import 'dayjs/locale/zh-cn';

const { locale } = useI18n();
const antLocale = computed(() => ({ vi: viVN, en: enUS, 'zh-CN': zhCN }[locale.value] ?? viVN));

watch(locale, (value) => {
  dayjs.locale(value === 'zh-CN' ? 'zh-cn' : value);
}, { immediate: true });
</script>

<template>
  <a-config-provider
    :locale="antLocale"
    :theme="{
      token: {
        colorPrimary: '#00688B',
        colorBgBase: '#04405D',
        colorTextBase: '#fafafa',
        colorBorder: '#00688B',
      },
    }"
  >    <router-view class="element"></router-view>
  </a-config-provider>
</template>

<template>
  <div class="d-flex gap-1 mt-2">
    <img
      :src="`https://flagcdn.com/32x24/${locale == 'ar' ? 'sa' : 'us'}.png`"
      v-for="locale in $i18n.availableLocales"
      :key="locale"
      @click="$i18n.locale = locale"
      :id="`locale-${locale}`"
    />
  </div>
</template>

<script>
export default {
  name: "FlagComponent",
};
</script>

<style scoped>
img {
  cursor: pointer;
}
</style>

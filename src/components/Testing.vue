<template>
  <div>
    Testing Component
    <button @click="$router.push({ query: { x: 55 } })">click</button>
    <button @click="$router.push({ query: {} })">reset</button>
  </div>
</template>

<script>
export default {
  name: "TestingComponent",
  created() {
    console.log("Hello Component is updated", this.$router);
  },
};
</script>

<style></style>

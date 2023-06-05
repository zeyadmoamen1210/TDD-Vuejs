<template>
  <div>
    <Navbar />
    <HomePage v-if="pathName === '/'" />
    <SignUp v-if="pathName === '/signup'" />
    <Login v-if="pathName === '/login'" />
    <User v-if="pathName.startsWith('/user/')" />
    <Flags />
  </div>
</template>

<script>
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import User from "./pages/User";
import Flags from "@/components/Flags";
import Navbar from "@/components/Navbar";
import HomePage from "./pages/Home.vue";
export default {
  name: "AppComponent",
  components: {
    SignUp,
    Login,
    Navbar,
    Flags,
    HomePage,
    User,
  },
  computed: {
    pathName() {
      return this.$route.path;
    },
  },
};
</script>

<style></style>

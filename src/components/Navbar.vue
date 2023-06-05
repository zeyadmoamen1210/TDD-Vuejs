<template>
  <div data-testid="navbar-component">
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/signup">Sign Up</router-link>
      </li>
      <li>
        <router-link to="/login">Login</router-link>
      </li>
      <li>
        <router-link to="/user/1">User</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NavbarComponent",
};
</script>

<style></style>

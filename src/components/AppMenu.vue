<template>
  <nav id="menu" class="navbar has-background-grey-dark " role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <div class="container">
        <div class="navbar-end">
          <div v-for="link in links" :key="link.route" class="navbar-item">
            <a class="has-text-white-bis" :href="link.route">{{ link.display }}</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppMenu',
  props: ['links']
};
</script>
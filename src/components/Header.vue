<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="/">NaMafia</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="https://namafia.com">Forums</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-form-checkbox v-model="checkedValue" switch class="darkmode-toggle">Dark Mode</b-form-checkbox>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'Header',
  computed: {

        checkedValue: {
            get() {
              if(localStorage.getItem('Darkmode')){
                return true;
              }
              return false;
            },
            set(state) {

                this.$emit('change', state);
            }
        }
    }
}
</script>

<template>
  <div class="site-container">
    <header class="container-fluid" id="header">
      <Header/>
    </header>
    <main class="container" id="main">
      <Mafia msg="Mafia Games"/>
    </main>
    <footer class="container-fluid">
      <Footer/>
    </footer>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Mafia from './components/Mafia.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Mafia,
    Footer
  },
}
</script>

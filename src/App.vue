<template>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css"
    />
    <div id="app">
      <Header />
      <div style="padding-top:6rem">
        <router-view />
      </div>
      <Footer />
    </div>
</template>

<script setup>
import Header from '@/common/components/Header.vue';
import Footer from '@/common/components/Footer.vue';
</script>

<style scoped></style>
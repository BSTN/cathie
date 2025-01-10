<template>
  <div class="p-6">
    <div class="contact w-[40rem] mb-12">
      <MDC :value="contact" v-if="contact" tag="div" class="w-[40rem] mb-4" />
    </div>
    <div class="about w-[40rem] mb-12">
     <MDC :value="about" v-if="about" tag="div" class="w-[40rem] mb-4" />
    </div>
    <div v-if="exhibitions">
      <div v-for="(exhibition,k) in exhibitions" class="mb-6">
        <h2 class="text-2xl">{{ exhibition.title }}</h2>
        <MDC :value="exhibition.description" v-if="exhibition?.description" tag="div" class="w-[40rem] mb-4" />
        <div v-for="image in exhibition.images" class="imgsize" v-if="k === 0">
          <TwicImg :src="image.url" :alt="image.title"/>
           <!-- {{ `https://cathie.lon1.digitaloceanspaces.com` + image.url }} -->
           <!-- <img :src="`https://cathie.lon1.digitaloceanspaces.com` + image.url" alt="" width="400px"> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { exhibitions, about, contact } = useData()

</script>

<style>
.imgsize {
  width: 50px;
  height: 50px;
  display: inline-block;
  margin: 0 0.5rem 0.5rem 0;
}
</style>

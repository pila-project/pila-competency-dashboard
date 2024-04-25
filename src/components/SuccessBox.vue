<script setup lang="ts">
import { computed } from 'vue';
import solidStar from '../assets/star-solid.svg';
import regularStar from '../assets/star-regular.svg';

const props = defineProps<{ completion: number }>();

const showStars = computed(() => [
  props.completion >= 0.5,
  props.completion >= 0.7,
  props.completion >= 0.85
]);
</script>

<template>
  <div>
    <span><img v-for="star in showStars" :src="star ? solidStar : regularStar" :class="star ? 'activeStar' : 'inactiveStar'"/></span>
    <span class="title"><slot /></span>
  </div>
</template>

<style scoped>
span {
  display: block;
}
div {
  border-radius: 8px;
  border: 2px solid gray;
  margin: 8px;
  padding: 8px;
}
img {
  width: 24px;
  height: 24px;
  padding: 0 4px;
}
.title {
  font-weight: bold;
  padding: 0 4px;
}
.activeStar {
  filter: invert(83%) sepia(35%) saturate(4226%) hue-rotate(358deg) brightness(109%) contrast(110%);
}
.inactiveStar {
  filter: invert(49%) sepia(2%) saturate(9%) hue-rotate(359deg) brightness(103%) contrast(92%);
}
</style>
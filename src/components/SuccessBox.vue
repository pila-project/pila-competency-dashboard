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
const percentage = computed(() => Math.round(props.completion * 100));
</script>

<template>
  <div>
    <span class="title"><slot /></span>
    <span><img
      v-for="(star, index) in showStars"
      :key="index"
      :src="star ? solidStar : regularStar"
      :class="star ? 'activeStar' : 'inactiveStar'"
    ><span class="percentage">{{ percentage }} %</span></span>
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
  vertical-align: middle;
}
.title {
  font-weight: bold;
  padding: 0 4px;
  margin-bottom: 8px;
  text-align: center;
}
.activeStar {
  filter: invert(83%) sepia(35%) saturate(4226%) hue-rotate(358deg) brightness(109%) contrast(110%);
}
.inactiveStar {
  filter: invert(49%) sepia(2%) saturate(9%) hue-rotate(359deg) brightness(103%) contrast(92%);
}
.percentage {
  display: inline;
  vertical-align: middle;
  padding-left: 4px;
  font-weight: bold;
}
</style>
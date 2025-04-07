<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import translate from '../translations/translate.ts';

interface Props {
  options: string[];
  modelValue: number;
  label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', newIndex: number): void }>();

const open = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  open.value = !open.value;
};

const selectOption = (index: number) => {
  emit('update:modelValue', index);
  open.value = false;
};

const selectedLabel = computed(() => {
  // If options are provided, use the one at the selected index; otherwise, default text.
  return props.options[props.modelValue] || translate('Select…');
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div
    ref="dropdownRef"
    class="dropdown"
  >
    <div
      class="dropdown-wrapper"
      @click="toggleDropdown"
    >
      <div class="dropdown-content">
        <span class="dropdown-label">{{ props.label }}</span>
        <span class="dropdown-selected">{{ selectedLabel }}</span>
      </div>
      <div class="dropdown-icon">
        <svg
          height="24"
          width="24"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
    </div>
    <ul
      v-if="open"
      class="dropdown-options"
    >
      <li
        v-for="(option, index) in props.options"
        :key="index"
        @click.stop="selectOption(index)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>


<style scoped>
.dropdown {
  position: relative;
  font-family: 'Roboto', sans-serif;
}
.dropdown-wrapper {
  border-bottom: 1px solid #ccc;
  padding: 12px 8px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.dropdown-content {
  display: flex;
  flex-direction: column;
}
.dropdown-label {
  font-size: 0.75rem;
  color: #666;
  line-height: 1;
}
.dropdown-selected {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  line-height: 1.2;
  padding-top: 4px;
}
.dropdown-icon {
  width: 24px;
  height: 24px;
  fill: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dropdown-options {
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  position: absolute;
  width: 100%;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  max-height: calc(50vh); /* Limit the height */
  overflow-y: auto;       /* Enable scrolling within the list */
}
.dropdown-options li {
  padding: 8px;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
}
.dropdown-options li:hover {
  background-color: #f5f5f5;
}
</style>
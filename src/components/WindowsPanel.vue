<template>
  <aside ref="panel"
    class="w-2xs h-full transition-[width] flex flex-col flex-nowrap justify-between bg-gray-900 text-gray-100">
    <div top class="w-full">
      <button @click="toggleCollapse" class="bg-gray-700 text-gray-300 text-xl font-bold h-9 w-full">
        <span v-show="!collapsed" class="inline-block h-full self-center">应用面板</span>
        <span class="inline-block h-full aspect-square float-right px-1 py-1 align-middle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="h-full">
            <path fill="#ffffff"
              d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32z">
            </path>
          </svg>
        </span>
      </button>
      <WindowCreators v-show="!collapsed" />
    </div>
    <!-- <MinimizedWindows v-show="!collapsed" /> -->
    <div class="w-full" v-show="!collapsed">
      <Copyright />
    </div>
  </aside>

  <Window v-for="([key, options], index) in Object.entries(windowsStore.windows)" :key="key" :windowKey="key"
    class="z-100">
    <component :is="options.content" />
  </Window>
</template>

<script setup lang="ts">
import MinimizedWindows from '@/components/MinimizedWindows.vue';  // 暂时没做
import WindowCreators from '@/components/WindowCreators.vue';
import { onMounted, ref, useTemplateRef, type ShallowRef } from 'vue';
import Copyright from './Copyright.vue';
import Window from '@/components/Window.vue';
import { useWindowsStore, type WindowOptions } from '@/stores/windows';
import { type WindowSystemOptions } from '@/types';
import { watch } from 'vue';

// ======================== 传入窗口 =======================

const windowsStore = useWindowsStore()
const props = defineProps<{ icons?: WindowSystemOptions }>()

console.log('[组件库] props keys:', Object.keys(props))
console.log('[组件库] props:', props)
console.log('[组件库] windowsStore.icons (before):', windowsStore.icons)

watch(
  () => props,
  (newProps) => {
    console.log('[组件库] props changed:', newProps)
    if (!newProps.icons) {
      windowsStore.icons = {}
    } else {
      windowsStore.icons = newProps.icons
    }
  },
  { immediate: true, deep: true }
)

// ======================== 控制窗口 ==============================

const collapsed = ref(false)
const panelRef = useTemplateRef<HTMLElement>("panel") as ShallowRef<HTMLElement>

function toggleCollapse() {
  if (collapsed.value) {
    panelRef.value.style.width = '288px';
    collapsed.value = false;
  } else {
    panelRef.value.style.width = '36px';
    collapsed.value = true;
  }
}

</script>

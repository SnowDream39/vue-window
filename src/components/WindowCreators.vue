<template>
  <div class="grid grid-cols-2 place-items-center">
    <div v-for="([key, options], index) in Object.entries(icons)"
      class="h-20 w-full flex justify-center items-center border-1 border-dashed">
      <button @click="createWindow(key)"
        class="block bg-blue-500 w-20 h-14 px-4 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700">{{ options.name
        }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowsStore, type WindowOptions } from '@/stores/windows';
import emitter from '@/utils/emitter';

const windowsStore = useWindowsStore();
const { windows, icons } = windowsStore;


function createWindow(key: string) {
  /**
   * 创建窗口
   * @param key 窗口标识符
   */
  if (key in icons) {
    if (!(key in windows)) {
      windows[key] = icons[key].windowOptions
    } else if (windows[key].minimized) {
      emitter.emit(`${key}-show`);
      windows[key].minimized = false;
    }
  }
}


</script>
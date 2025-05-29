<template>

</template>

<script setup lang="ts">

import { useWindowsStore } from '@/stores/windows';

const windowsStore = useWindowsStore();
const windows = windowsStore.windows;
</script>
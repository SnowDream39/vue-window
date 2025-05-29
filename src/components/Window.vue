<template>
  <div class="absolute border-2 border-amber-800 *:absolute" ref="container" :style="containerStyle">
    <div
      class="window-header bg-teal-200 cursor-grab pl-1 flex flex-row flex-nowrap justify-between text-center dark:bg-teal-800"
      ref="header" :style="headerStyle">
      <span>{{ options.title }}</span>
      <ul class="h-full float-right flex flex-nowrap *:hover:bg-green-300 *:active:bg-green-400 *:w-7 *:cursor-auto">
        <li @click="minimize">-</li>
        <li @click="maximize">□</li>
        <li @click="close">×</li>
      </ul>
    </div>
    <div class="window-top cursor-n-resize opacity-0" ref="top" :style="topStyle"></div>
    <div class="window-right cursor-e-resize opacity-0" ref="right" :style="rightStyle"></div>
    <div class="window-bottom cursor-s-resize opacity-0" ref="bottom" :style="bottomStyle"></div>
    <div class="window-left cursor-w-resize opacity-0" ref="left" :style="leftStyle"></div>
    <div class="window-core overflow-auto" ref="core" :style="coreStyle">
      <slot></slot>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, computed, type ShallowRef, useTemplateRef, reactive, onUnmounted, nextTick } from 'vue';
import { useWindowsStore } from '@/stores/windows';
import emitter from '@/utils/emitter';

/** 就给一个key，具体内容去问state要 */
const props = defineProps<{
  windowKey: string
}>();

const windowsStore = useWindowsStore();
const options = windowsStore.windows[props.windowKey]

let containerRef = useTemplateRef<HTMLElement>('container') as Readonly<ShallowRef<HTMLElement>>

function minimize() {
  if (options.beforeMinimize) options.beforeMinimize();
  containerRef.value.style.visibility = 'hidden';
  windowsStore.windows[props.windowKey].minimized = true;
  if (options.afterMinimize) options.afterMinimize();
}

function maximize() {
  if (options.beforeMaximize) options.beforeMaximize();
  if (options.afterMaximize) options.afterMaximize();
}

function close() {
  if (options.beforeClose) options.beforeClose();
  // containerRef.value.style.visibility = 'hidden';
  delete windowsStore.windows[props.windowKey];
  if (options.afterClose) options.afterClose();
}

function show() {
  containerRef.value.style.visibility = 'visible';
  windowsStore.windows[props.windowKey].minimized = false;
}


// 拖拽部分

const coreRef = useTemplateRef<HTMLElement>('core') as Readonly<ShallowRef<HTMLElement>>
const headerRef = useTemplateRef<HTMLElement>('header') as Readonly<ShallowRef<HTMLElement>>
const topRef = useTemplateRef<HTMLElement>('top') as Readonly<ShallowRef<HTMLElement>>
const rightRef = useTemplateRef<HTMLElement>('right') as Readonly<ShallowRef<HTMLElement>>
const bottomRef = useTemplateRef<HTMLElement>('bottom') as Readonly<ShallowRef<HTMLElement>>
const leftRef = useTemplateRef<HTMLElement>('left') as Readonly<ShallowRef<HTMLElement>>


const minSize = options.minSize ?? {
  width: 150,
  height: 100
}


/** 面板的位置以边框左上角为起点 */
const position = reactive({
  x: 300 + Math.random() * 300,
  y: 50 + Math.random() * 300,
  width: options.size?.width ?? 300,
  height: options.size?.height ?? 200,
});

enum DragType {
  header, top, right, bottom, left
}
class Drag {
  lastPosition = { x: 0, y: 0 };
  changePosition = { x: 0, y: 0 };
  type: DragType

  constructor(element: HTMLElement, type: DragType) {
    this.type = type;
    this.startMoving = this.startMoving.bind(this);
    this.endMoving = this.endMoving.bind(this);
    this.onMoving = this.onMoving.bind(this);
    element.addEventListener("mousedown", this.startMoving);
    element.addEventListener("mouseup", this.endMoving);
  }

  updatePosition() {
    let newHeight: number;
    let newWidth: number;
    switch (this.type) {
      case DragType.header:
        position.x += this.changePosition.x;
        position.y += this.changePosition.y;
        break;
      case DragType.top:
        newHeight = position.height - this.changePosition.y;
        if (newHeight > minSize.height) {
          position.y += this.changePosition.y
          position.height -= this.changePosition.y;
        } else {
          this.endMoving()
        }
        break;
      case DragType.right:
        newWidth = position.width + this.changePosition.x;
        if (newWidth > minSize.width) {
          position.width += this.changePosition.x;
        } else {
          this.endMoving()
        }
        break;
      case DragType.bottom:
        newHeight = position.height + this.changePosition.y
        if (newHeight > minSize.height) {
          position.height = position.height + this.changePosition.y;
        } else {
          this.endMoving()
        }
        break;
      case DragType.left:
        newWidth = position.width - this.changePosition.x;
        if (newWidth > minSize.width) {
          position.x += this.changePosition.x
          position.width -= this.changePosition.x;
        } else {
          this.endMoving()
        }
        break;

      default:
        break;
    }
  }

  onMoving(event: MouseEvent) {
    let currentPosition = { x: event.clientX, y: event.clientY };
    this.changePosition = {
      x: currentPosition.x - this.lastPosition.x,
      y: currentPosition.y - this.lastPosition.y,
    };

    this.updatePosition();

    this.lastPosition.x = currentPosition.x;
    this.lastPosition.y = currentPosition.y;
  }

  startMoving(event: MouseEvent) {
    const targetElement = event.target as HTMLElement
    if (targetElement.tagName !== "LI") {
      this.lastPosition.x = event.clientX;
      this.lastPosition.y = event.clientY;

      document.documentElement.addEventListener("mousemove", this.onMoving);
    }
  }

  endMoving() {
    document.documentElement.removeEventListener("mousemove", this.onMoving);
  }

}


// 样式部分

const headerHeight = 30;
const borderWidth = 2;

const containerStyle = computed(() => {
  return {
    left: position.x + 'px',
    top: position.y + 'px',
    width: position.width + 2 * borderWidth + 'px',
    height: position.height + 2 * borderWidth + headerHeight + 'px',
  }
})
const coreStyle = computed(() => {
  return {
    padding: options.padding ?? '20px',
    top: headerHeight + 'px',
    width: position.width + 'px',
    height: position.height + 'px',
  }
})
const headerStyle = computed(() => {
  return {
    width: position.width + 'px',
    height: headerHeight + 'px',
  }
})
const topStyle = computed(() => {
  return {
    left: - borderWidth + 'px',
    width: position.width + borderWidth + 'px',
    height: borderWidth + 'px',
  }
})
const bottomStyle = computed(() => {
  return {
    top: position.height + headerHeight + 'px',
    left: - borderWidth + 'px',
    width: position.width + borderWidth + 'px',
    height: borderWidth + 'px',
  }
})
const leftStyle = computed(() => {
  return {
    left: - borderWidth + 'px',
    width: borderWidth + 'px',
    height: position.height + headerHeight + borderWidth + 'px',
  }
})
const rightStyle = computed(() => {
  return {
    left: position.width + borderWidth + 'px',
    width: borderWidth + 'px',
    height: position.height + headerHeight + borderWidth + 'px',
  }
})


function initElements() {
  function generateInlineStyles(ele: HTMLElement) {
    let computedStyle = window.getComputedStyle(ele);
    ele.style.width = window.getComputedStyle(ele).width;
    ele.style.top = computedStyle.top;
    ele.style.left = computedStyle.left;
  }
  for (const element of [coreRef, headerRef]) {
    generateInlineStyles(element.value);
  }
}


// 初始化
onMounted(() => {
  initElements();
  new Drag(headerRef.value, DragType.header);
  if (options.allowResize === undefined || options.allowResize === true) {
    new Drag(topRef.value, DragType.top);
    new Drag(rightRef.value, DragType.right);
    new Drag(bottomRef.value, DragType.bottom);
    new Drag(leftRef.value, DragType.left);
  };
  emitter.on(`${props.windowKey}-show`, show);
})


onUnmounted(() => {
  /** 
   * 注意，一定要把这个解绑，不然会监听多个函数。
   * 而且这多个函数来自组件的不同生命周期，不是同一个函数。
   * 而且旧的show函数使用的containerRef已经被销毁。
   */
  emitter.off(`${props.windowKey}-show`, show);
})
</script>

<style lang="scss" scoped>
$light-image: url('https://h.pixiv.ddns-ip.net/128002790');
$dark-image: url('https://h.pixiv.ddns-ip.net/111306458');

.window-core {
  background: linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), $light-image;
  background-size: cover;
}

@media (prefers-color-scheme: dark) {
  .window-core {
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), $dark-image no-repeat top center / cover;
  }
}
</style>
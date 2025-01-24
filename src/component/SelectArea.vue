<script setup lang="ts">
  import { ref, computed, watch } from 'vue'

  const props = defineProps({
    initialDots: {
      type: Array,
      default: () => [],
    },
    initialHull: {
      type: Array,
      default: () => [],
    },
    onAreaChange: {
      type: Function,
    },
    size: {
      type: Number,
      default: 500,
    },
  })

  const dots = ref<any[]>([...props.initialDots])
  const hull = ref<any[]>([...props.initialHull])

  const modelValue = defineModel()

  watch(
    () => hull.value,
    (newVal) => {
      modelValue.value = newVal
    },
  )

  const canvasStyle = computed<any>(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    border: '2px solid black',
    position: 'relative',
    background: '#f0f0f0',
  }))

  const svgStyle: any = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  }

  const dotStyle = (dot): any => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'red',
    position: 'absolute',
    left: `${dot.x - 5}px`,
    top: `${dot.y - 5}px`,
  })

  const handleCanvasClick = (event) => {
    const rect = event.target.getBoundingClientRect()
    const x = Math.round(event.clientX - rect.left)
    const y = Math.round(event.clientY - rect.top)

    dots.value.push({ x, y })
    calculateConvexHull(dots.value)
  }

  const clearDots = () => {
    dots.value = []
    hull.value = []
    if (props.onAreaChange) props.onAreaChange([])
  }

  const calculateConvexHull = (points) => {
    if (points.length < 3) {
      hull.value = []
      if (props.onAreaChange) props.onAreaChange([])
      return
    }

    const sortedPoints = [...points].sort((a, b) => a.x - b.x || a.y - b.y)

    const crossProduct = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

    const lowerHull = []
    for (const dot of sortedPoints) {
      while (
        lowerHull.length >= 2 &&
        crossProduct(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], dot) <= 0
      ) {
        lowerHull.pop()
      }
      lowerHull.push(dot)
    }

    const upperHull = []
    for (let i = sortedPoints.length - 1; i >= 0; i--) {
      const dot = sortedPoints[i]
      while (
        upperHull.length >= 2 &&
        crossProduct(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], dot) <= 0
      ) {
        upperHull.pop()
      }
      upperHull.push(dot)
    }

    upperHull.pop()
    lowerHull.pop()

    hull.value = [...lowerHull, ...upperHull]
    if (props.onAreaChange) props.onAreaChange(hull.value)
  }
</script>

<template>
  <div class="selected-area p-5">
    <div @click="handleCanvasClick" :style="canvasStyle">
      <!-- Render các điểm -->
      <div v-for="(dot, index) in dots" :key="index" :style="dotStyle(dot)"></div>

      <!-- Render đường kết nối giữa các điểm -->
      <svg v-if="dots.length > 1 && hull.length === 0" :style="svgStyle">
        <polyline
          :points="dots.map((dot) => `${dot.x},${dot.y}`).join(' ')"
          fill="none"
          stroke="blue"
          stroke-width="2"
        />
      </svg>

      <!-- Render vùng bao convex hull -->
      <svg v-if="hull.length > 0" :style="svgStyle">
        <polygon
          :points="hull.map((dot) => `${dot.x},${dot.y}`).join(' ')"
          fill="rgba(0, 128, 255, 0.3)"
          stroke="blue"
          stroke-width="2"
        />
      </svg>
    </div>

    <button @click="clearDots" class="mt-3">Delete Area</button>
  </div>
</template>

<style scoped>
  .selected-area {
    caret-color: transparent;
  }
</style>

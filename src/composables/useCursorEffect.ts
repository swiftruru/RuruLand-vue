/**
 * 自訂游標與滑鼠追蹤效果 Composable
 * 提供鉛筆游標和粒子追蹤效果
 */
import { onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  life: number
  hue: number
}

export function useCursorEffect() {
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let particles: Particle[] = []
  let mouseX = 0
  let mouseY = 0
  let animationId: number | null = null

  // 創建粒子
  function createParticle(x: number, y: number): Particle {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 2 + 1

    return {
      x,
      y,
      size: Math.random() * 3 + 2,
      opacity: 1,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      hue: Math.random() * 60 + 140 // 140-200 範圍，綠色系
    }
  }

  // 更新粒子
  function updateParticles() {
    particles = particles.filter(p => p.life > 0)

    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life -= 0.02
      particle.opacity = particle.life
      particle.size *= 0.98
    })
  }

  // 繪製粒子
  function drawParticles() {
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 繪製光暈效果
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 50)
    gradient.addColorStop(0, 'rgba(26, 95, 63, 0.15)')
    gradient.addColorStop(0.5, 'rgba(45, 122, 82, 0.08)')
    gradient.addColorStop(1, 'rgba(58, 150, 100, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(mouseX - 50, mouseY - 50, 100, 100)

    // 繪製粒子
    particles.forEach(particle => {
      ctx!.save()
      ctx!.globalAlpha = particle.opacity

      // 粒子光暈
      const particleGradient = ctx!.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )
      particleGradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`)
      particleGradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`)

      ctx!.fillStyle = particleGradient
      ctx!.beginPath()
      ctx!.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      ctx!.fill()

      // 粒子核心
      ctx!.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`
      ctx!.beginPath()
      ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx!.fill()

      ctx!.restore()
    })
  }

  // 動畫循環
  function animate() {
    updateParticles()
    drawParticles()
    animationId = requestAnimationFrame(animate)
  }

  // 滑鼠移動處理
  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY // 不需要加 scrollY，因為 canvas 是 fixed

    // 每次移動創建 2-3 個粒子
    const particleCount = Math.floor(Math.random() * 2) + 2
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(mouseX, mouseY))
    }

    // 限制粒子數量
    if (particles.length > 100) {
      particles = particles.slice(-100)
    }
  }

  // 初始化
  function init() {
    // 創建 canvas
    canvas = document.createElement('canvas')
    canvas.id = 'cursor-canvas'
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(canvas)

    // 設置 canvas 尺寸
    const resizeCanvas = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    ctx = canvas.getContext('2d')

    // 添加事件監聽
    document.addEventListener('mousemove', handleMouseMove)

    // 開始動畫
    animate()
  }

  // 清理
  function cleanup() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
    document.removeEventListener('mousemove', handleMouseMove)
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas)
    }
    particles = []
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    particles
  }
}

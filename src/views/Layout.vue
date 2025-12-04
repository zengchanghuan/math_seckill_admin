<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">
        <h2>📐 数学秒杀</h2>
        <p>管理后台</p>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        class="sidebar-menu"
      >
        <el-menu-item
          v-for="route in menuRoutes"
          :key="route.path"
          :index="route.path"
        >
          <el-icon><component :is="route.meta?.icon" /></el-icon>
          <span>{{ route.meta?.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-content">
          <h3>{{ currentTitle }}</h3>
          <div class="header-right">
            <el-button :icon="Refresh" @click="refresh" circle />
          </div>
        </div>
      </el-header>

      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const menuRoutes = computed(() => {
  const layoutRoute = router.getRoutes().find(r => r.name === 'layout')
  const routes = layoutRoute?.children || []
  console.log('[菜单] 所有子路由:', routes.map(r => ({path: r.path, title: r.meta?.title, hidden: r.meta?.hidden})))
  return routes
})

const activeMenu = computed(() => route.path)

const currentTitle = computed(() => {
  return route.meta?.title as string || ''
})

const refresh = () => {
  router.go(0)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background: #304156;
  color: #fff;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 20px;
}

.logo p {
  margin: 5px 0 0;
  font-size: 12px;
  opacity: 0.7;
}

.sidebar-menu {
  border: none;
  background: #304156;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item:hover),
:deep(.el-menu-item.is-active) {
  background-color: #263445 !important;
  color: #409eff;
}

.el-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0;
  font-size: 18px;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.el-main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


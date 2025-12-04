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
        <template v-for="item in menuTree" :key="item.title">
          <!-- 带子菜单的项 -->
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.title">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children" :key="`${item.title}-${subItem.title}`">
              <!-- 二级子菜单 -->
              <el-sub-menu v-if="subItem.children && subItem.children.length > 0" :index="`${item.title}-${subItem.title}`">
                <template #title>
                  <el-icon><component :is="subItem.icon" /></el-icon>
                  <span>{{ subItem.title }}</span>
                </template>
                <template v-for="thirdItem in subItem.children" :key="`${item.title}-${subItem.title}-${thirdItem.title}`">
                  <!-- 三级子菜单 -->
                  <el-sub-menu v-if="thirdItem.children && thirdItem.children.length > 0" :index="`${item.title}-${subItem.title}-${thirdItem.title}`">
                    <template #title>
                      <el-icon><component :is="thirdItem.icon" /></el-icon>
                      <span>{{ thirdItem.title }}</span>
                    </template>
                    <el-menu-item
                      v-for="fourthItem in thirdItem.children"
                      :key="fourthItem.path"
                      :index="fourthItem.path"
                    >
                      <el-icon><component :is="fourthItem.icon" /></el-icon>
                      <span>{{ fourthItem.title }}</span>
                    </el-menu-item>
                  </el-sub-menu>
                  <!-- 三级菜单项 -->
                  <el-menu-item v-else-if="thirdItem.path" :index="thirdItem.path">
                    <el-icon><component :is="thirdItem.icon" /></el-icon>
                    <span>{{ thirdItem.title }}</span>
                  </el-menu-item>
                </template>
              </el-sub-menu>
              <!-- 二级菜单项 -->
              <el-menu-item v-else-if="subItem.path" :index="subItem.path">
                <el-icon><component :is="subItem.icon" /></el-icon>
                <span>{{ subItem.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <!-- 单独的菜单项 -->
          <el-menu-item v-else-if="item.path" :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
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
        <router-view />
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

interface MenuItem {
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
  order?: number
}

const menuRoutes = computed(() => {
  const layoutRoute = router.getRoutes().find(r => r.name === 'layout')
  const routes = layoutRoute?.children || []
  console.log('[菜单] 所有子路由:', routes.map(r => ({
    path: r.path,
    title: r.meta?.title,
    parent: r.meta?.parent,
    parentGroup: r.meta?.parentGroup,
    subGroup: r.meta?.subGroup
  })))
  return routes
})

const menuTree = computed(() => {
  const tree: MenuItem[] = []
  const parentMap = new Map<string, MenuItem>()

  // 定义年份列表（按时间排序）
  const years = ['2020年', '2021年', '2022年', '2023年', '2024年']

  menuRoutes.value.forEach(route => {
    const meta = route.meta as any

    // 如果有父级分组
    if (meta?.parent) {
      const parentTitle = meta.parent

      // 获取或创建父级菜单（题库）
      if (!parentMap.has(parentTitle)) {
        const parentItem: MenuItem = {
          title: parentTitle,
          icon: 'FolderOpened',
          children: []
        }
        parentMap.set(parentTitle, parentItem)
        tree.push(parentItem)
      }

      const parentItem = parentMap.get(parentTitle)!

      // 如果有二级分组（年份）
      if (meta?.parentGroup) {
        const groupTitle = meta.parentGroup
        let groupItem = parentItem.children?.find(c => c.title === groupTitle)

        if (!groupItem) {
          groupItem = {
            title: groupTitle,
            icon: 'Calendar',
            children: [],
            order: meta.order || 0
          }
          parentItem.children!.push(groupItem)
        }

        // 如果是试卷或答案，直接添加到年份下
        if (meta?.isPaper || meta?.isAnswer) {
          groupItem.children!.push({
            title: meta.title,
            icon: meta.icon,
            path: route.path
          })
        }
        // 其他情况，也直接添加到年份下
        else {
          groupItem.children!.push({
            title: meta.title,
            icon: meta.icon,
            path: route.path
          })
        }
      } else {
        // 直接添加到父级
        parentItem.children!.push({
          title: meta.title,
          icon: meta.icon,
          path: route.path
        })
      }
    } else {
      // 没有父级，直接添加到根级
      tree.push({
        title: meta?.title,
        icon: meta?.icon,
        path: route.path
      })
    }
  })

  // 对题库下的年份进行排序（按年份降序，最新的在上面）
  tree.forEach(parent => {
    if (parent.title === '题库' && parent.children) {
      // 为缺失的年份自动创建空目录
      years.forEach((year, index) => {
        if (!parent.children!.find(c => c.title === year)) {
          const yearOrder = 2024 - index // 2024, 2023, 2022, 2021, 2020
          parent.children!.push({
            title: year,
            icon: 'Calendar',
            order: yearOrder,
            children: []
          })
        }
      })

      // 排序确保年份顺序正确
      parent.children.sort((a, b) => (b.order || 0) - (a.order || 0))
    }
  })

  return tree
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

:deep(.el-sub-menu__title) {
  color: #bfcbd9;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
  color: #409eff;
}

:deep(.el-sub-menu .el-menu) {
  background-color: #1f2d3d;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #1f2d3d;
  min-width: 0;
  padding-left: 40px !important;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #001528 !important;
}

/* 二级子菜单 */
:deep(.el-sub-menu .el-sub-menu .el-sub-menu__title) {
  background-color: #1f2d3d;
  padding-left: 40px !important;
}

/* 三级子菜单 */
:deep(.el-sub-menu .el-sub-menu .el-sub-menu .el-sub-menu__title) {
  background-color: #0f1a28;
  padding-left: 50px !important;
}

/* 三级菜单项 */
:deep(.el-sub-menu .el-sub-menu .el-sub-menu .el-menu-item) {
  background-color: #0f1a28;
  padding-left: 60px !important;
}

/* 四级菜单项 */
:deep(.el-sub-menu .el-sub-menu .el-sub-menu .el-sub-menu .el-menu-item) {
  background-color: #0a0f1a;
  padding-left: 70px !important;
  font-size: 13px;
}

/* 空目录提示 */
:deep(.el-sub-menu .el-menu--inline) {
  min-height: auto;
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
</style>


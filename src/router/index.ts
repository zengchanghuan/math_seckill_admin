import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'layout',
            component: () => import('../views/Layout.vue'),
            redirect: '/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue'),
                    meta: { title: '仪表板', icon: 'DataAnalysis' }
                },
                {
                    path: '/questions',
                    name: 'questions',
                    component: () => import('../views/Questions.vue'),
                    meta: { title: '题目管理', icon: 'Document' }
                },
                {
                    path: '/tutorials',
                    name: 'tutorials',
                    component: () => import('../views/Tutorials.vue'),
                    meta: { title: '讲解内容', icon: 'Reading' }
                },
                {
                    path: '/students',
                    name: 'students',
                    component: () => import('../views/Students.vue'),
                    meta: { title: '学生数据', icon: 'User' }
                },
                {
                    path: '/pdf-import',
                    name: 'pdf-import',
                    component: () => import('../views/PDFImport.vue'),
                    meta: { title: 'PDF导入', icon: 'Upload' }
                },
                {
                    path: '/pdf-review',
                    name: 'pdf-review',
                    component: () => import('../views/PDFReview.vue'),
                    meta: { title: 'PDF校验', icon: 'View' }
                },
                {
                    path: '/exam-paper',
                    name: 'exam-paper',
                    component: () => import('../views/ExamPaper.vue'),
                    meta: {
                        title: '2020年广东专插本试卷',
                        icon: 'Document',
                        parent: '题库',
                        parentGroup: '2020年',
                        order: 2020,
                        isPaper: true // 标记为试卷，直接显示
                    }
                },
                {
                    path: '/exam-answer-2020',
                    name: 'exam-answer-2020',
                    component: () => import('../views/ExamAnswer2020.vue'),
                    meta: {
                        title: '2020年广东专插本答案',
                        icon: 'Tickets',
                        parent: '题库',
                        parentGroup: '2020年',
                        order: 2020,
                        isAnswer: true // 标记为答案，直接显示
                    }
                },
                {
                    path: '/exam-paper-2022',
                    name: 'exam-paper-2022',
                    component: () => import('../views/ExamPaper2022.vue'),
                    meta: {
                        title: '2022年广东专升本试卷',
                        icon: 'Document',
                        parent: '题库',
                        parentGroup: '2022年',
                        order: 2022,
                        isPaper: true
                    }
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('../views/Settings.vue'),
                    meta: { title: '系统设置', icon: 'Setting' }
                }
            ]
        }
    ]
})

export default router


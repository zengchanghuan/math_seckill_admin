import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// API接口
export const questionAPI = {
  // 获取题目统计
  getStats: () => api.get('/api/questions/stats'),

  // 获取单个题目
  getQuestion: (id: string) => api.get(`/api/questions/${id}`),

  // 创建题目
  createQuestion: (data: any) => api.post('/api/questions', data),

  // 更新题目
  updateQuestion: (id: string, data: any) => api.put(`/api/questions/${id}`, data),

  // 删除题目
  deleteQuestion: (id: string) => api.delete(`/api/questions/${id}`)
}

export const tutorialAPI = {
  // 获取所有讲解
  getAll: () => api.get('/api/tutorials'),

  // 获取章节讲解
  getChapter: (theme: string, chapter: string) =>
    api.get(`/api/tutorials/chapter/${theme}/${chapter}`)
}

export const studentAPI = {
  // 获取学生画像
  getProfile: (studentId: string) => api.get(`/api/student/${studentId}/profile`),

  // 获取答题记录
  getAnswers: (studentId: string) => api.get(`/api/answers/student/${studentId}`)
}

export const configAPI = {
  // 获取主题配置
  getThemes: () => api.get('/api/config/themes'),

  // 获取单个主题
  getTheme: (name: string) => api.get(`/api/config/theme/${name}`),

  // 获取版本
  getVersion: () => api.get('/api/config/version')
}

export default api


<template>
  <div class="exam-paper-page page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="paper-header">
          <h2>{{ paperTitle }}</h2>
          <el-tag type="primary" size="large">共 {{ totalQuestions }} 道题</el-tag>
        </div>
      </template>

      <!-- 单项选择题 -->
      <div class="section">
        <h3 class="section-title">一、单项选择题（本大题共 5 小题，每小题 3 分，共 15 分，每小题只有一项符合题目要求）</h3>

        <div v-for="q in choiceQuestions" :key="q.id" class="question-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="question-content">
            <MathFormula :formula="q.text" />
            <div class="options">
              <div v-for="opt in q.options" :key="opt.letter" class="option">
                <span class="option-letter">{{ opt.letter }}.</span>
                <MathFormula :formula="opt.content" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 填空题 -->
      <div class="section">
        <h3 class="section-title">二、填空题（本大题共5小题，每小题3分，共15分）</h3>

        <div v-for="q in fillQuestions" :key="q.id" class="question-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="question-content">
            <MathFormula :formula="q.text" />
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 计算题 -->
      <div class="section">
        <h3 class="section-title">三、计算题（本大题共8小题，每小题6分，共48分）</h3>

        <div v-for="q in calcQuestions" :key="q.id" class="question-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="question-content">
            <MathFormula :formula="q.text" />
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 综合题 -->
      <div class="section">
        <h3 class="section-title">四、综合题（本大题共2小题，第19题10分，第20题12分，共22分）</h3>

        <div v-for="q in comprehensiveQuestions" :key="q.id" class="question-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="question-content">
            <MathFormula :formula="q.text" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '../components/MathFormula.vue'

const paperTitle = '广东省2022年普通高等学校专升本考试 - 高等数学'

// 单项选择题
const choiceQuestions = [
  {
    id: 1,
    number: 1,
    text: '若函数 $ f(x) = \\begin{cases} x + 1, & x \\neq 1 \\\\ a, & x = 1 \\end{cases} $，在 $ x = 1 $ 处连续，则常数 $ a = ( ) $',
    options: [
      { letter: 'A', content: '$-1$' },
      { letter: 'B', content: '$0$' },
      { letter: 'C', content: '$1$' },
      { letter: 'D', content: '$2$' }
    ]
  },
  {
    id: 2,
    number: 2,
    text: '$$ \\lim_{x \\to 0} (1 - 3x)^x = ( ) $$',
    options: [
      { letter: 'A', content: '$e^{-3}$' },
      { letter: 'B', content: '$e^{\\frac{1}{3}}$' },
      { letter: 'C', content: '$1$' },
      { letter: 'D', content: '$e^3$' }
    ]
  },
  {
    id: 3,
    number: 3,
    text: '$$ \\lim_{n \\to \\infty} u_n = 0 $$ 是级数 $$ \\sum_{n=1}^{\\infty} u_n $$ 收敛的（ ）',
    options: [
      { letter: 'A', content: '充分条件' },
      { letter: 'B', content: '必要条件' },
      { letter: 'C', content: '充要条件' },
      { letter: 'D', content: '既非充分也非必要条件' }
    ]
  },
  {
    id: 4,
    number: 4,
    text: '已知 $$ \\frac{1}{x^2} $$ 是函数 $ f(x) $ 的一个原函数，则 $$ \\int_1^{+\\infty} f(x) dx = ( ) $$',
    options: [
      { letter: 'A', content: '$2$' },
      { letter: 'B', content: '$1$' },
      { letter: 'C', content: '$-1$' },
      { letter: 'D', content: '$-2$' }
    ]
  },
  {
    id: 5,
    number: 5,
    text: '将二次积分 $$ I = \\int_0^1 dx \\int_x^1 f(x^2 + y^2) dy $$ 化为极坐标系下的二次积分，则 $ I = ( ) $',
    options: [
      { letter: 'A', content: '$$ \\int_0^{\\frac{\\pi}{4}} d\\theta \\int_0^{\\sec \\theta} f(r^2) dr $$' },
      { letter: 'B', content: '$$ \\int_0^{\\frac{\\pi}{4}} d\\theta \\int_0^{\\sec \\theta} rf(r^2) dr $$' },
      { letter: 'C', content: '$$ \\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}} d\\theta \\int_0^{\\sec \\theta} f(r^2) dr $$' },
      { letter: 'D', content: '$$ \\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}} d\\theta \\int_0^{\\sec \\theta} rf(r^2) dr $$' }
    ]
  }
]

// 填空题
const fillQuestions = [
  {
    id: 6,
    number: 6,
    text: '若 $ x \\to 0 $ 时，无穷小量 $ 2x $ 与 $ 3x^2 + mx $ 等价，则常数 $ m = $ ___。'
  },
  {
    id: 7,
    number: 7,
    text: '设 $$ \\begin{cases} x = 5t - t^2, \\\\ y = \\log_2 t, \\end{cases} $$ 则 $$ \\frac{dy}{dx} \\bigg|_{t=2} = $$ ___。'
  },
  {
    id: 8,
    number: 8,
    text: '椭圆 $$ \\frac{x^2}{4} + \\frac{y^2}{3} = 1 $$ 所围成的图形绕 $ x $ 轴旋转一周而成的旋转体体积为 ___。'
  },
  {
    id: 9,
    number: 9,
    text: '微分方程 $ e^{-x} y\' = 2 $ 的通解是 ___。'
  },
  {
    id: 10,
    number: 10,
    text: '函数 $ z = x^{\\ln y} $ 在点 $ (e, e) $ 处的全微分为 $ dz \\bigg|_{(e, e)} = $ ___。'
  }
]

// 计算题
const calcQuestions = [
  {
    id: 11,
    number: 11,
    text: '求极限 $$ \\lim_{x \\to 1} \\frac{x^3 + 3x^2 - 9x + 5}{x^3 - 3x + 2} $$。'
  },
  {
    id: 12,
    number: 12,
    text: '设 $ y = \\arctan x^2 $，求 $$ \\frac{d^2 y}{dx^2} \\bigg|_{x=1} $$。'
  },
  {
    id: 13,
    number: 13,
    text: '设函数 $ f(x) = \\begin{cases} x^2 \\sin \\frac{1}{x} + 2x, & x \\neq 0 \\\\ 0, & x = 0 \\end{cases} $ 利用导数定义求 $ f\'(0) $。'
  },
  {
    id: 14,
    number: 14,
    text: '求不定积分 $$ \\int \\frac{2x^2 + 3x}{x\\sqrt{1-x^2}} dx $$。'
  },
  {
    id: 15,
    number: 15,
    text: '已知 $$ \\int \\tan x dx = -\\ln |\\cos x| + C $$，求定积分 $$ \\int_0^{\\pi/4} x \\sec^2 x dx $$。'
  },
  {
    id: 16,
    number: 16,
    text: '设 $ z = f(x, y) $ 是由方程 $ z = 2x - y^2 e^z $ 所确定的隐函数，计算 $$ \\frac{\\partial z}{\\partial x} - y \\frac{\\partial z}{\\partial y} $$。'
  },
  {
    id: 17,
    number: 17,
    text: '计算二重积分 $$ \\iint_D \\cos x d\\sigma $$，其中 $ D $ 是由曲线 $ y = \\sin x (0 \\leq x \\leq \\frac{\\pi}{2}) $ 和直线 $ y = 0, x = \\frac{\\pi}{2} $ 所围成的有界区域。'
  },
  {
    id: 18,
    number: 18,
    text: '判断级数 $$ \\sum_{n=1}^\\infty \\left(\\frac{n}{3^n} - \\frac{3}{2^n}\\right) $$ 的敛散性。'
  }
]

// 综合题
const comprehensiveQuestions = [
  {
    id: 19,
    number: 19,
    text: '设函数 $ f(x) = 2x \\ln x - x - \\frac{1}{x} + 2 $,\n\n(1) 求曲线 $ y = f(x) $ 的拐点；\n\n(2) 讨论曲线 $ y = f(x) $ 上是否存在经过坐标原点的切线？'
  },
  {
    id: 20,
    number: 20,
    text: '设函数 $ f(x) $ 连续，\n\n(1) 证明：$$ \\int_{0}^{x} f(x-t) dt = \\int_{0}^{x} f(t) dt $$；\n\n(2) 若 $ f(x) $ 满足 $ f(x) = 3x + 1 + \\int_{0}^{x} tf(t) dt - x \\int_{0}^{x} f(x-t) dt $，求 $ f(x) $。'
  }
]

const totalQuestions = computed(() =>
  choiceQuestions.length + fillQuestions.length + calcQuestions.length + comprehensiveQuestions.length
)
</script>

<style scoped>
.exam-paper-page {
  background-color: white;
}

.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 30px;
}

.paper-header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.section {
  margin-bottom: 50px;
}

.section-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 25px;
  line-height: 1.6;
}

.question-item {
  display: flex;
  margin-bottom: 30px;
  background-color: white;
}

.question-number {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-right: 8px;
  min-width: 20px;
}

.question-content {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

.options {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: all 0.2s;
}

.option:hover {
  border-color: #409EFF;
}

.option-letter {
  font-weight: 600;
  color: #409EFF;
  margin-right: 10px;
  min-width: 20px;
  flex-shrink: 0;
}

.el-divider {
  margin: 40px 0;
  border-color: #e4e7ed;
}

:deep(.el-card__body) {
  background-color: white;
}

/* 响应式 */
@media (max-width: 768px) {
  .paper-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .paper-header h2 {
    font-size: 20px;
  }

  .question-item {
    flex-direction: column;
  }

  .question-number {
    margin-bottom: 8px;
  }
}
</style>


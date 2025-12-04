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
        <h3 class="section-title">一、单项选择题（本大题共 5 小题，每小题 3 分，共 15 分。每小题只有一项符合题目要求）</h3>

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
        <h3 class="section-title">二、填空题（本大题共 5 小题，每小题 3 分，共 15 分）</h3>

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
        <h3 class="section-title">三、计算题（本大题共 8 小题，每小题 6 分，共 48 分）</h3>

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
        <h3 class="section-title">四、综合题（本大题共 2 小题，第 19 小题 10 分，第 20 小题 12 分，共 22 分）</h3>

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

const paperTitle = '广东省2023年普通高等学校专升本招生考试 - 高等数学'

// 单项选择题
const choiceQuestions = [
  {
    id: 1,
    number: 1,
    text: '$$ \\lim_{x \\to 0} (2^x + 1) = $$ （ ）',
    options: [
      { letter: 'A', content: '$0$' },
      { letter: 'B', content: '$1$' },
      { letter: 'C', content: '$2$' },
      { letter: 'D', content: '$3$' }
    ]
  },
  {
    id: 2,
    number: 2,
    text: '若函数 $ f(x) = \\begin{cases} (1 + x^2)^{\\frac{1}{x^2}}, & x \\neq 0, \\\\ a, & x = 0 \\end{cases} $ 在 $ x = 0 $ 处连续，则 $ a = $ （ ）',
    options: [
      { letter: 'A', content: '$0$' },
      { letter: 'B', content: '$1$' },
      { letter: 'C', content: '$e$' },
      { letter: 'D', content: '$e^2$' }
    ]
  },
  {
    id: 3,
    number: 3,
    text: '曲线 $ y = xe^{-x} $ 在点 $ (1, e^{-1}) $ 处的切线斜率是 （ ）',
    options: [
      { letter: 'A', content: '$-e^{-1}$' },
      { letter: 'B', content: '$0$' },
      { letter: 'C', content: '$e^{-1}$' },
      { letter: 'D', content: '$2e^{-1}$' }
    ]
  },
  {
    id: 4,
    number: 4,
    text: '设 $ 2x $ 是 $ f(x) $ 的一个原函数，则 $$ \\int_0^{\\pi/2} [f(x) - \\sin x] dx = $$ （ ）',
    options: [
      { letter: 'A', content: '$\\pi - 1$' },
      { letter: 'B', content: '$\\pi + 1$' },
      { letter: 'C', content: '$\\frac{\\pi^2}{4} - 1$' },
      { letter: 'D', content: '$\\frac{\\pi^2}{4} + 1$' }
    ]
  },
  {
    id: 5,
    number: 5,
    text: '设级数 $$ \\sum_{n=1}^{\\infty} u_n $$ 收敛，则下列级数发散的是 （ ）',
    options: [
      { letter: 'A', content: '$$ \\sum_{n=1}^{\\infty} 4u_n $$' },
      { letter: 'B', content: '$$ \\sum_{n=1}^{\\infty} u_{n+4} $$' },
      { letter: 'C', content: '$$ \\sum_{n=1}^{\\infty} (u_n - u_{n+1}) $$' },
      { letter: 'D', content: '$$ \\sum_{n=1}^{\\infty} (u_n - 1) $$' }
    ]
  }
]

// 填空题
const fillQuestions = [
  {
    id: 6,
    number: 6,
    text: '曲线 $ y = \\frac{\\sin x}{x} $ 的水平渐近线方程为 $ y = $ ___。'
  },
  {
    id: 7,
    number: 7,
    text: '已知常数 $ k > 0 $，若 $$ \\int_{k}^{\\infty} \\frac{1}{x^2} dx = 1 $$，则 $ k = $ ___。'
  },
  {
    id: 8,
    number: 8,
    text: '设二元函数 $ z = x^x + (x - y)^2 (x > 0) $，则 $$ \\frac{\\partial^2 z}{\\partial y \\partial x} = $$ ___。'
  },
  {
    id: 9,
    number: 9,
    text: '交换二次积分 $$ \\int_{0}^{1} dx \\int_{\\sqrt{x}}^{1} f(x, y) dy $$ 的积分次序，则 $$ \\int_{0}^{1} dx \\int_{\\sqrt{x}}^{1} f(x, y) dy = $$ ___。'
  },
  {
    id: 10,
    number: 10,
    text: '微分方程 $ y\'\' - 8y\' + 7y = 0 $ 的通解为 $ y = $ ___。'
  }
]

// 计算题
const calcQuestions = [
  {
    id: 11,
    number: 11,
    text: '求极限 $$ \\lim_{x \\to 2} \\frac{x^3 + 3x^2 - 20}{x^2 - 4} $$。'
  },
  {
    id: 12,
    number: 12,
    text: '求函数 $ y = \\sqrt{x + \\cos x} $ 在 $ x = 0 $ 处的微分 $ dy \\bigg|_{x=0} $。'
  },
  {
    id: 13,
    number: 13,
    text: '已知函数 $ f(x) $ 的导数 $ f\'(x) = \\frac{\\ln x}{x} $，求曲线 $ y = f(x) $ 在 $(0, +\\infty)$ 内的凹凸区间。'
  },
  {
    id: 14,
    number: 14,
    text: '求不定积分 $$ \\int (2x - 1)e^x dx $$。'
  },
  {
    id: 15,
    number: 15,
    text: '设函数 $ f(x) = \\begin{cases} \\frac{2x^3}{1+x^2}, & x \\leq 1, \\\\ 1, & x > 1, \\end{cases} $ 计算定积分 $\\int_{-1}^4 f(x) dx$.'
  },
  {
    id: 16,
    number: 16,
    text: '设 $ z = \\ln 3 - x^2 e^{y^2 z} $，求 $\\frac{\\partial z}{\\partial x}$ 及 $\\frac{\\partial z}{\\partial y}$.'
  },
  {
    id: 17,
    number: 17,
    text: '计算二重积分 $\\iint_D (x^2 + y^2)^2 d\\sigma$，其中 $D$ 是由圆周 $x^2 + y^2 = 1$ 所围成的区域.'
  },
  {
    id: 18,
    number: 18,
    text: '已知 $u_n$ 满足 $\\left(\\frac{1}{2}\\right)^n \\leq u_n \\leq \\frac{n^2}{2^n} (n = 1, 2, \\cdots)$，判定级数 $\\sum_{n=1}^{\\infty} u_n$ 的收敛性.'
  }
]

// 综合题
const comprehensiveQuestions = [
  {
    id: 19,
    number: 19,
    text: '证明：当 $ x > 0 $ 时，\n\n(1) $\\arctan x = \\frac{\\pi}{2} - \\arctan \\frac{1}{x}$；\n\n(2) $\\arctan x < \\ln(x + \\sqrt{1 + x^2})$。'
  },
  {
    id: 20,
    number: 20,
    text: '设定义在区间 $[0, +\\infty)$ 上的连续函数 $ f(x) $ 满足 $ f(x) \\geq \\sqrt{1 + x^4} $，且由曲线 $ y = f(x) $, $ y = \\sqrt{1 + x^4} $ 及直线 $ x = 0 $, $ x = t(t > 0) $ 围成的图形的面积为 $ t^3 $。\n\n(1) 求 $ f(x) $；\n\n(2) 若可导函数 $ g(x) $ 满足 $ f(x)g\'(x) + f\'(x)g(x) = 5x\\sqrt{x} $，且 $ g(0) = 1 $，求 $ g(x) $。'
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


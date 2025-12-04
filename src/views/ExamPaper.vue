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
        <h3 class="section-title">一、单项选择题（本大题共5小题，每小题3分，共15分。每小题只有一个选项符合题目要求）</h3>

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

const paperTitle = '广东省2020年普通高等学校高等数学试卷'

// 单项选择题
const choiceQuestions = [
  {
    id: 1,
    number: 1,
    text: '设 $\\lim_{x \\to 0} \\left[ \\cos x - f(x) \\right] = 1$，则下列等式正确的是',
    options: [
      { letter: 'A', content: '$\\lim_{x \\to 0} f(x) = 1$' },
      { letter: 'B', content: '$\\lim_{x \\to 0} f(x) \\cos x = 1$' },
      { letter: 'C', content: '$\\lim_{x \\to 0} f(x) = -1$' },
      { letter: 'D', content: '$\\lim_{x \\to 0} \\left[ f(x) + \\cos x \\right] = 1$' }
    ]
  },
  {
    id: 2,
    number: 2,
    text: '函数 $f(x) = 2x^3 - 3x^2$ 的极小值点是',
    options: [
      { letter: 'A', content: '$x = -1$' },
      { letter: 'B', content: '$x = 0$' },
      { letter: 'C', content: '$x = 1$' },
      { letter: 'D', content: '$x = 2$' }
    ]
  },
  {
    id: 3,
    number: 3,
    text: '已知 $3^x$ 是函数 $f(x)$ 的一个原函数，则 $f(x) =$',
    options: [
      { letter: 'A', content: '$3^x$' },
      { letter: 'B', content: '$3^x \\ln 3$' },
      { letter: 'C', content: '$x 3^{x-1}$' },
      { letter: 'D', content: '$\\frac{3^x}{\\ln 3}$' }
    ]
  },
  {
    id: 4,
    number: 4,
    text: '设平面区域 $D = \\{(x, y) | x^2 + y^2 \\leq 1, y \\geq 0\\}$，则 $\\iint\\limits_D (x^2 + y^2)^4 d\\sigma =$',
    options: [
      { letter: 'A', content: '$\\frac{\\pi}{10}$' },
      { letter: 'B', content: '$\\frac{\\pi}{9}$' },
      { letter: 'C', content: '$\\frac{\\pi}{5}$' },
      { letter: 'D', content: '$\\frac{2\\pi}{9}$' }
    ]
  },
  {
    id: 5,
    number: 5,
    text: '设级数 $\\sum_{n=1}^\\infty a_n$ 满足 $0 \\leq a_n \\leq \\frac{1}{5^n}$，则下列级数发散的是',
    options: [
      { letter: 'A', content: '$\\sum_{n=1}^\\infty 3a_n$' },
      { letter: 'B', content: '$\\sum_{n=1}^\\infty a_{n+3}$' },
      { letter: 'C', content: '$\\sum_{n=1}^\\infty \\left( a_n + \\frac{1}{\\sqrt{n^2}} \\right)$' },
      { letter: 'D', content: '$\\sum_{n=1}^\\infty \\left( a_n - \\frac{1}{\\sqrt{n^3}} \\right)$' }
    ]
  }
]

// 填空题
const fillQuestions = [
  {
    id: 6,
    number: 6,
    text: '若函数 $ f(x) = \\begin{cases} (1 + a)x^2, & x \\leq 1, \\\\ a(x - 2)^3 + 3, & x > 1 \\end{cases} $ 在 $ x = 1 $ 处连续，则常数 $ a = \\underline{\\quad } $。'
  },
  {
    id: 7,
    number: 7,
    text: '曲线 $ \\frac{x^2}{2} + y^2 = 3 $ 在点 $ (2, -1) $ 处的切线方程为 $ y = \\underline{\\quad } $。'
  },
  {
    id: 8,
    number: 8,
    text: '微分方程 $ y\'\' + 3y\' - 4y = 0 $ 的通解为 $ y = \\underline{\\quad } $。'
  },
  {
    id: 9,
    number: 9,
    text: '设二元函数 $ f(x, y) $ 在点 $ (0, 0) $ 的某个邻域内有定义，且当 $ x \\neq 0 $ 时，$$ \\frac{f(x, 0) - f(0, 0)}{x} = 3x + 2，$$ 则 $ f_x\'(0, 0) = \\underline{\\quad } $。'
  },
  {
    id: 10,
    number: 10,
    text: '设函数 $ f(x) $ 在 $(-\\infty, +\\infty)$ 内可导，且满足 $ f(x) = f\'(x), f(0) = m $。如果 $$ \\int_{-1}^{1} \\frac{f(x)}{e^x} dx = 8，$$ 则 $ m = \\underline{\\quad } $。'
  }
]

// 计算题
const calcQuestions = [
  {
    id: 11,
    number: 11,
    text: '求极限 $$ \\lim_{x \\to 0} \\frac{\\int_0^x t \\arctan t \\, dt}{x^3}。$$'
  },
  {
    id: 12,
    number: 12,
    text: '已知 $ y $ 是 $ x $ 的函数，且 $$ y\' = \\ln \\sqrt{x} + \\sqrt{\\ln x} + 2 \\ln 2，$$ 求 $$ \\frac{d^2 y}{dx^2} \\bigg|_{x=e}。$$'
  },
  {
    id: 13,
    number: 13,
    text: '求不定积分 $$ \\int (\\cos 2x - x \\sin x^2) \\, dx。$$'
  },
  {
    id: 14,
    number: 14,
    text: '设函数 $$ f(x) = \\begin{cases} \\frac{x^3}{1+x^2}, & x \\leq 1, \\\\ x, & x > 1. \\end{cases} $$ 求定积分 $$ \\int_{-3}^0 f(x+2) \\, dx。$$'
  },
  {
    id: 15,
    number: 15,
    text: '求二元函数 $$ z = 3xy^2 + \\frac{x^2}{y} $$ 的全微分 $ dz $，并求 $$ \\frac{\\partial^2 z}{\\partial x \\partial y}。$$'
  },
  {
    id: 16,
    number: 16,
    text: '计算 $$ \\iint_D y \\, d\\sigma，$$ 其中 $ D $ 是由直线 $ y = x, y = x-2 $ 与 $ y = 0, y = 2 $ 围成的有界闭区域。'
  },
  {
    id: 17,
    number: 17,
    text: '求微分方程 $$ \\frac{dy}{dx} = \\frac{\\sec^2 x}{y^2} $$ 满足初始条件 $$ y \\big|_{x=0} = 1 $$ 的特解。'
  },
  {
    id: 18,
    number: 18,
    text: '判定级数 $$ \\sum_{n=1}^{\\infty} \\frac{n^n}{2^n n!} $$ 的收敛性。'
  }
]

// 综合题
const comprehensiveQuestions = [
  {
    id: 19,
    number: 19,
    text: '设有界平面图形 $ G $ 由曲线 $ y = e^{ax} $ 和直线 $ y = e $，$ x = 0 $ 围成，其中常数 $ a > 0 $。若 $ G $ 的面积等于 1。\n\n(1) 求 $ a $ 的值；\n\n(2) 求 $ G $ 绕 $ y $ 轴旋转一周而成的旋转体的体积 $ V $。'
  },
  {
    id: 20,
    number: 20,
    text: '设函数 $ f(x) = \\frac{a}{1 + e^x} $，其中 $ a, b $ 为常数，且 $ ab \\neq 0 $。\n\n(1) 判别 $ f(x) $ 在区间 $(-\\infty, +\\infty)$ 内的单调性；\n\n(2) 求曲线 $ y = f(x) $ 的拐点；\n\n(3) 求曲线 $ y = f(x) $ 的水平渐近线方程。'
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

/* 移除卡片背景 */
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


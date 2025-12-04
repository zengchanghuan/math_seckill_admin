<template>
  <div class="exam-answer-page page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="paper-header">
          <h2>{{ paperTitle }}</h2>
          <el-tag type="success" size="large">参考答案</el-tag>
        </div>
      </template>

      <!-- 单项选择题 -->
      <div class="section">
        <h3 class="section-title">一、单项选择题（本大题共5小题，每小题3分，共15分。每小题只有一个选项符合题目要求）</h3>

        <div v-for="q in choiceAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="options">
              <div v-for="opt in q.options" :key="opt.letter" class="option">
                <span class="option-letter">{{ opt.letter }}.</span>
                <MathFormula :formula="opt.content" />
              </div>
            </div>
            <div class="answer-box">
              <el-tag type="success" size="large">答案：{{ q.answer }}</el-tag>
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 填空题 -->
      <div class="section">
        <h3 class="section-title">二、填空题（本大题共5小题，每小题3分，共15分）</h3>

        <div v-for="q in fillAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="answer-box">
              <el-tag type="success" size="large">答案：</el-tag>
              <MathFormula :formula="q.answer" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 计算题 -->
      <div class="section">
        <h3 class="section-title">三、计算题（本大题共8小题，每小题6分，共48分）</h3>

        <div v-for="q in calcAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="solution-box">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>解：</span>
              </div>
              <MathFormula :formula="q.solution" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 综合题 -->
      <div class="section">
        <h3 class="section-title">四、综合题（本大题共 2 小题，第 19 小题 10 分，第 20 小题 12 分，共 22 分）</h3>

        <div v-for="q in comprehensiveAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="solution-box">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>解：</span>
              </div>
              <MathFormula :formula="q.solution" />
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import MathFormula from '../components/MathFormula.vue'

const paperTitle = '2020年广东专插本高等数学参考答案'

// 单项选择题答案
const choiceAnswers = [
  {
    id: 1,
    number: 1,
    question: '设 $\\lim_{x \\to 0} \\left[ \\cos x - f(x) \\right] = 1$，则下列等式正确的是',
    options: [
      { letter: 'A', content: '$\\lim_{x \\to 0} f(x) = 1$' },
      { letter: 'B', content: '$\\lim_{x \\to 0} f(x) \\cos x = 1$' },
      { letter: 'C', content: '$\\lim_{x \\to 0} f(x) = -1$' },
      { letter: 'D', content: '$\\lim_{x \\to 0} \\left[ f(x) + \\cos x \\right] = 1$' }
    ],
    answer: 'D'
  },
  {
    id: 2,
    number: 2,
    question: '函数 $f(x) = 2x^3 - 3x^2$ 的极小值点是',
    options: [
      { letter: 'A', content: '$x = -1$' },
      { letter: 'B', content: '$x = 0$' },
      { letter: 'C', content: '$x = 1$' },
      { letter: 'D', content: '$x = 2$' }
    ],
    answer: 'C'
  },
  {
    id: 3,
    number: 3,
    question: '已知 $3^x$ 是函数 $f(x)$ 的一个原函数，则 $f(x) =$',
    options: [
      { letter: 'A', content: '$3^x$' },
      { letter: 'B', content: '$3^x \\ln 3$' },
      { letter: 'C', content: '$x 3^{x-1}$' },
      { letter: 'D', content: '$\\frac{3^x}{\\ln 3}$' }
    ],
    answer: 'B'
  },
  {
    id: 4,
    number: 4,
    question: '设平面区域 $D = \\{(x, y) | x^2 + y^2 \\leq 1, y \\geq 0\\}$，则 $\\iint\\limits_D (x^2 + y^2)^4 d\\sigma =$',
    options: [
      { letter: 'A', content: '$\\frac{\\pi}{10}$' },
      { letter: 'B', content: '$\\frac{\\pi}{9}$' },
      { letter: 'C', content: '$\\frac{\\pi}{5}$' },
      { letter: 'D', content: '$\\frac{2\\pi}{9}$' }
    ],
    answer: 'A'
  },
  {
    id: 5,
    number: 5,
    question: '设级数 $\\sum_{n=1}^\\infty a_n$ 满足 $0 \\leq a_n \\leq \\frac{1}{5^n}$，则下列级数发散的是',
    options: [
      { letter: 'A', content: '$\\sum_{n=1}^\\infty 3a_n$' },
      { letter: 'B', content: '$\\sum_{n=1}^\\infty a_{n+3}$' },
      { letter: 'C', content: '$\\sum_{n=1}^\\infty \\left( a_n + \\frac{1}{\\sqrt{n^2}} \\right)$' },
      { letter: 'D', content: '$\\sum_{n=1}^\\infty \\left( a_n - \\frac{1}{\\sqrt{n^3}} \\right)$' }
    ],
    answer: 'C'
  }
]

// 填空题答案
const fillAnswers = [
  {
    id: 6,
    number: 6,
    question: '若函数 $ f(x) = \\begin{cases} (1 + a)x^2, & x \\leq 1, \\\\ a(x - 2)^3 + 3, & x > 1 \\end{cases} $ 在 $ x = 1 $ 处连续，则常数 $ a = $ ___。',
    answer: '$1$'
  },
  {
    id: 7,
    number: 7,
    question: '曲线 $ \\frac{x^2}{2} + y^2 = 3 $ 在点 $ (2, -1) $ 处的切线方程为 $ y = $ ___。',
    answer: '$x - 3$'
  },
  {
    id: 8,
    number: 8,
    question: '微分方程 $ y\'\' + 3y\' - 4y = 0 $ 的通解为 $ y = $ ___。',
    answer: '$C_1 e^{-4x} + C_2 e^x$'
  },
  {
    id: 9,
    number: 9,
    question: '设二元函数 $ f(x, y) $ 在点 $ (0, 0) $ 的某个邻域内有定义，且当 $ x \\neq 0 $ 时，$$ \\frac{f(x, 0) - f(0, 0)}{x} = 3x + 2，$$ 则 $ f_x\'(0, 0) = $ ___。',
    answer: '$2$'
  },
  {
    id: 10,
    number: 10,
    question: '设函数 $ f(x) $ 在 $(-\\infty, +\\infty)$ 内可导，且满足 $ f(x) = f\'(x), f(0) = m $。如果 $$ \\int_{-1}^{1} \\frac{f(x)}{e^x} dx = 8，$$ 则 $ m = $ ___。',
    answer: '$4$'
  }
]

// 计算题答案
const calcAnswers = [
  {
    id: 11,
    number: 11,
    question: '求极限 $$ \\lim_{x \\to 0} \\frac{\\int_0^x t \\arctan t \\, dt}{x^3}。$$',
    solution: '$$ \\text{原式} = \\lim_{x \\to 0} \\frac{x \\arctan x}{3x^2} = \\lim_{x \\to 0} \\frac{\\arctan x}{3x} = \\lim_{x \\to 0} \\frac{1}{3(1+x^2)} = \\frac{1}{3}. $$'
  },
  {
    id: 12,
    number: 12,
    question: '已知 $ y $ 是 $ x $ 的函数，且 $$ y\' = \\ln \\sqrt{x} + \\sqrt{\\ln x} + 2 \\ln 2，$$ 求 $$ \\frac{d^2 y}{dx^2} \\bigg|_{x=e}。$$',
    solution: '$$ \\frac{d^2 y}{dx^2} = \\left( \\frac{1}{2} \\ln x + \\sqrt{\\ln x} + 2 \\ln 2 \\right)\' = \\frac{1}{2x} + \\frac{1}{2x \\sqrt{\\ln x}}, $$ $$ \\left. \\frac{d^2 y}{dx^2} \\right|_{x = e} = \\frac{1}{2e} + \\frac{1}{2e} = \\frac{1}{e}. $$'
  },
  {
    id: 13,
    number: 13,
    question: '求不定积分 $$ \\int (\\cos 2x - x \\sin x^2) \\, dx。$$',
    solution: '$$ \\text{原式} = \\int \\cos 2x \\, dx - \\int x \\sin x^2 \\, dx = \\frac{1}{2} \\int \\cos 2x \\, d(2x) - \\frac{1}{2} \\int \\sin x^2 \\, d(x^2) = \\frac{1}{2} \\sin 2x + \\frac{1}{2} \\cos x^2 + C. $$'
  },
  {
    id: 14,
    number: 14,
    question: '设函数 $$ f(x) = \\begin{cases} \\frac{x^3}{1+x^2}, & x \\leq 1, \\\\ x, & x > 1. \\end{cases} $$ 求定积分 $$ \\int_{-3}^0 f(x+2) \\, dx。$$',
    solution: '令 $ x + 2 = t $，则 $$ \\int_{-3}^0 f(x+2) \\, dx = \\int_{-1}^2 f(t) \\, dt = \\int_{-1}^1 \\frac{t^3}{1+t^2} \\, dt + \\int_1^2 t \\, dt. $$ 由于被积函数 $\\frac{t^3}{1+t^2}$ 是奇函数，在对称区间上积分为0，所以 $$ \\int_{-1}^1 \\frac{t^3}{1+t^2} \\, dt = 0, \\quad \\int_1^2 t \\, dt = \\left. \\frac{t^2}{2} \\right|_1^2 = 2 - \\frac{1}{2} = \\frac{3}{2}. $$ 因此，原积分 $ = \\frac{3}{2} $。'
  },
  {
    id: 15,
    number: 15,
    question: '求二元函数 $$ z = 3xy^2 + \\frac{x^2}{y} $$ 的全微分 $ dz $，并求 $$ \\frac{\\partial^2 z}{\\partial x \\partial y}。$$',
    solution: '$$ \\frac{\\partial z}{\\partial x} = 3y^2 + \\frac{2x}{y}, \\quad \\frac{\\partial z}{\\partial y} = 6xy - \\frac{x^2}{y^2}, $$ $$ dz = \\left( 3y^2 + \\frac{2x}{y} \\right) dx + \\left( 6xy - \\frac{x^2}{y^2} \\right) dy. $$ $$ \\frac{\\partial^2 z}{\\partial x \\partial y} = \\frac{\\partial}{\\partial y} \\left( 3y^2 + \\frac{2x}{y} \\right) = 6y - \\frac{2x}{y^2}. $$'
  },
  {
    id: 16,
    number: 16,
    question: '计算 $$ \\iint_D y \\, d\\sigma，$$ 其中 $ D $ 是由直线 $ y = x, y = x-2 $ 与 $ y = 0, y = 2 $ 围成的有界闭区域。',
    solution: '积分区域 $ D $ 可表示为：$ 0 \\leq y \\leq 2, \\; y \\leq x \\leq y+2 $。则 $$ \\iint_D y \\, d\\sigma = \\int_0^2 \\int_y^{y+2} y \\, dx \\, dy = \\int_0^2 y \\cdot (x|_{y}^{y+2}) \\, dy = \\int_0^2 y \\cdot 2 \\, dy = \\int_0^2 2y \\, dy = \\left. y^2 \\right|_0^2 = 4. $$'
  },
  {
    id: 17,
    number: 17,
    question: '求微分方程 $$ \\frac{dy}{dx} = \\frac{\\sec^2 x}{y^2} $$ 满足初始条件 $$ y \\big|_{x=0} = 1 $$ 的特解。',
    solution: '分离变量得 $ y^2 \\, dy = \\sec^2 x \\, dx $，积分得 $$ \\int y^2 \\, dy = \\int \\sec^2 x \\, dx \\quad \\Rightarrow \\quad \\frac{y^3}{3} = \\tan x + C. $$ 代入初始条件 $ x=0, y=1 $ 得 $ \\frac{1}{3} = 0 + C $，所以 $ C = \\frac{1}{3} $。故特解为 $ \\frac{y^3}{3} = \\tan x + \\frac{1}{3} $，即 $ y = \\sqrt[3]{3 \\tan x + 1} $。'
  },
  {
    id: 18,
    number: 18,
    question: '判定级数 $$ \\sum_{n=1}^{\\infty} \\frac{n^n}{2^n n!} $$ 的收敛性。',
    solution: '该级数为正项级数，用比值审敛法判别。$$ \\lim_{n \\to \\infty} \\frac{u_{n+1}}{u_n} = \\lim_{n \\to \\infty} \\frac{(n+1)^{n+1}}{2^{n+1}(n+1)!} \\cdot \\frac{2^n n!}{n^n} = \\lim_{n \\to \\infty} \\frac{(n+1)^{n+1}}{2(n+1)n^n} = \\lim_{n \\to \\infty} \\frac{1}{2} \\left( 1 + \\frac{1}{n} \\right)^n = \\frac{e}{2} > 1, $$ 所以级数发散。'
  }
]

// 综合题答案
const comprehensiveAnswers = [
  {
    id: 19,
    number: 19,
    question: '设有界平面图形 $ G $ 由曲线 $ y = e^{ax} $ 和直线 $ y = e $，$ x = 0 $ 围成，其中常数 $ a > 0 $。若 $ G $ 的面积等于 1。\n\n(1) 求 $ a $ 的值；\n\n(2) 求 $ G $ 绕 $ y $ 轴旋转一周而成的旋转体的体积 $ V $。',
    solution: '(1) 由方程组 $$ \\begin{cases} y = e^{ax} \\\\ y = e \\end{cases} $$ 得 $ ax = 1 $，即 $ x = \\frac{1}{a} $。因此，图形 $ G $ 的面积 $$ S_G = \\int_0^{\\frac{1}{a}} (e - e^{ax}) \\, dx = \\left[ ex - \\frac{1}{a} e^{ax} \\right]_0^{\\frac{1}{a}} = \\frac{e}{a} - \\frac{e}{a} + \\frac{1}{a} = \\frac{1}{a}. $$ 由题设 $ S_G = 1 $，得 $ \\frac{1}{a} = 1 $，所以 $ a = 1 $。\n\n(2) 由 (1) 知 $ a = 1 $，曲线为 $ y = e^x $。图形 $ G $ 绕 $ y $ 轴旋转，体积为 $$ V = \\pi \\int_1^e (\\ln y)^2 \\, dy. $$ 利用分部积分：$$ \\int (\\ln y)^2 \\, dy = y (\\ln y)^2 - 2 \\int \\ln y \\, dy = y (\\ln y)^2 - 2 (y \\ln y - y) + C. $$ 所以 $$ V = \\pi \\left[ y (\\ln y)^2 - 2y \\ln y + 2y \\right]_1^e = \\pi \\left[ e - 2e + 2e - (0 - 0 + 2) \\right] = \\pi (e - 2). $$'
  },
  {
    id: 20,
    number: 20,
    question: '设函数 $ f(x) = \\frac{a}{1 + e^{bx}} $，其中 $ a, b $ 为常数，且 $ ab \\neq 0 $。\n\n(1) 判别 $ f(x) $ 在区间 $(-\\infty, +\\infty)$ 内的单调性；\n\n(2) 求曲线 $ y = f(x) $ 的拐点；\n\n(3) 求曲线 $ y = f(x) $ 的水平渐近线方程。',
    solution: '(1) $$ f\'(x) = \\frac{-a b e^{bx}}{(1+e^{bx})^2}. $$ 由于 $ \\frac{e^{bx}}{(1+e^{bx})^2} > 0 $，所以当 $ ab < 0 $ 时，$ f\'(x) > 0 $，$ f(x) $ 在 $(-\\infty, +\\infty)$ 内单调递增；当 $ ab > 0 $ 时，$ f\'(x) < 0 $，$ f(x) $ 在 $(-\\infty, +\\infty)$ 内单调递减。\n\n(2) $$ f\'\'(x) = \\frac{-a b^2 e^{bx} (1 - e^{bx})}{(1+e^{bx})^3}. $$ 令 $ f\'\'(x) = 0 $，得 $ 1 - e^{bx} = 0 $，即 $ x = 0 $。当 $ x < 0 $ 时，$ e^{bx} < 1 $，当 $ x > 0 $ 时，$ e^{bx} > 1 $，所以 $ f\'\'(x) $ 在 $ x=0 $ 左右异号。因此点 $ \\left(0, \\frac{a}{2}\\right) $ 为曲线的拐点。\n\n(3) 计算极限：若 $ b > 0 $，则 $$ \\lim_{x \\to +\\infty} f(x) = \\lim_{x \\to +\\infty} \\frac{a}{1+e^{bx}} = 0, \\quad \\lim_{x \\to -\\infty} f(x) = \\lim_{x \\to -\\infty} \\frac{a}{1+e^{bx}} = a. $$ 若 $ b < 0 $，则 $$ \\lim_{x \\to +\\infty} f(x) = \\lim_{x \\to +\\infty} \\frac{a}{1+e^{bx}} = a, \\quad \\lim_{x \\to -\\infty} f(x) = \\lim_{x \\to -\\infty} \\frac{a}{1+e^{bx}} = 0. $$ 所以曲线 $ y = f(x) $ 有两条水平渐近线：$ y = 0 $ 和 $ y = a $。'
  }
]
</script>

<style scoped>
.exam-answer-page {
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

.answer-item {
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

.answer-content {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

.options {
  margin-top: 12px;
  padding-left: 10px;
}

.option {
  display: flex;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.option-letter {
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
  min-width: 25px;
}

.answer-box {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f9ff;
  border-left: 4px solid #67c23a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.solution-box {
  margin-top: 15px;
  padding: 20px;
  background-color: #f5f7fa;
  border-left: 4px solid #409eff;
  border-radius: 4px;
}

.solution-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 15px;
  font-size: 16px;
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

  .answer-item {
    flex-direction: column;
  }

  .question-number {
    margin-bottom: 8px;
  }
}
</style>


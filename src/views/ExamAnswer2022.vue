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
        <h3 class="section-title">一、单项选择题（本大题共 5 小题，每小题 3 分，共 15 分，每小题只有一项符合题目要求）</h3>

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
            <div class="solution-box" v-if="q.solution">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>解析：</span>
              </div>
              <MathFormula :formula="q.solution" />
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
            <div class="solution-box" v-if="q.solution">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>解析：</span>
              </div>
              <MathFormula :formula="q.solution" />
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
            <div class="answer-box" v-if="q.answer">
              <el-tag type="success" size="large">答案：</el-tag>
              <MathFormula :formula="q.answer" />
            </div>
            <div class="solution-box">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>解析：</span>
              </div>
              <MathFormula :formula="q.solution" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 综合题 -->
      <div class="section">
        <h3 class="section-title">四、综合题（本大题共2小题，第19题10分，第20题12分，共22分）</h3>

        <div v-for="q in comprehensiveAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="solution-box">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>解析：</span>
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

const paperTitle = '广东省2022年普通高等学校专升本考试高等数学参考答案'

// 单项选择题答案
const choiceAnswers = [
  {
    id: 1,
    number: 1,
    question: '若函数 $ f(x) = \\begin{cases} x + 1, & x \\neq 1 \\\\ a, & x = 1 \\end{cases} $，在 $ x = 1 $ 处连续，则常数 $ a = ( ) $',
    options: [
      { letter: 'A', content: '$-1$' },
      { letter: 'B', content: '$0$' },
      { letter: 'C', content: '$1$' },
      { letter: 'D', content: '$2$' }
    ],
    answer: 'D',
    solution: '函数 $ f(x) $ 在 $ x=1 $ 处连续，故 $$ \\lim_{x \\to 1} f(x) = \\lim_{x \\to 1} (x+1) = 2 = f(1) = a $$ 即 $ a = 2 $。'
  },
  {
    id: 2,
    number: 2,
    question: '$$ \\lim_{x \\to 0} (1 - 3x)^x = ( ) $$',
    options: [
      { letter: 'A', content: '$e^{-3}$' },
      { letter: 'B', content: '$e^{\\frac{1}{3}}$' },
      { letter: 'C', content: '$1$' },
      { letter: 'D', content: '$e^3$' }
    ],
    answer: 'A',
    solution: '$$ \\lim_{x \\to 0} (1 - 3x)^x = \\lim_{x \\to 0} \\left[ (1 - 3x)^{\\frac{1}{3x}} \\right]^{-(-3x)^\\frac{1}{x}} = e^{-3} $$'
  },
  {
    id: 3,
    number: 3,
    question: '$$ \\lim_{n \\to \\infty} u_n = 0 $$ 是级数 $$ \\sum_{n=1}^{\\infty} u_n $$ 收敛的（ ）',
    options: [
      { letter: 'A', content: '充分条件' },
      { letter: 'B', content: '必要条件' },
      { letter: 'C', content: '充要条件' },
      { letter: 'D', content: '既非充分也非必要条件' }
    ],
    answer: 'B',
    solution: '级数 $\\sum_{n=1}^{\\infty} u_n$ 收敛则必有 $\\lim_{n \\to \\infty} u_n = 0$，但反之不成立，如 $u_n = \\frac{1}{n}$ 时，有 $\\lim_{n \\to \\infty} u_n = 0$，但调和级数 $\\sum_{n=1}^{\\infty} \\frac{1}{n}$ 是发散的，因此 $\\lim_{n \\to \\infty} u_n = 0$ 是级数 $\\sum_{n=1}^{\\infty} u_n$ 收敛的必要条件，故选 B。'
  },
  {
    id: 4,
    number: 4,
    question: '已知 $$ \\frac{1}{x^2} $$ 是函数 $ f(x) $ 的一个原函数，则 $$ \\int_1^{+\\infty} f(x) dx = ( ) $$',
    options: [
      { letter: 'A', content: '$2$' },
      { letter: 'B', content: '$1$' },
      { letter: 'C', content: '$-1$' },
      { letter: 'D', content: '$-2$' }
    ],
    answer: 'C',
    solution: '由题意知 $\\int_0^{+\\infty} f(x) dx = \\frac{1}{x^2} \\bigg|_0^{+\\infty} = 0 - 1 = -1$。'
  },
  {
    id: 5,
    number: 5,
    question: '将二次积分 $$ I = \\int_0^1 dx \\int_x^1 f(x^2 + y^2) dy $$ 化为极坐标系下的二次积分，则 $ I = ( ) $',
    options: [
      { letter: 'A', content: '$$ \\int_0^{\\frac{\\pi}{4}} d\\theta \\int_0^{\\sec \\theta} f(r^2) dr $$' },
      { letter: 'B', content: '$$ \\int_0^{\\frac{\\pi}{4}} d\\theta \\int_0^{\\sec \\theta} rf(r^2) dr $$' },
      { letter: 'C', content: '$$ \\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}} d\\theta \\int_0^{\\sec \\theta} f(r^2) dr $$' },
      { letter: 'D', content: '$$ \\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}} d\\theta \\int_0^{\\sec \\theta} rf(r^2) dr $$' }
    ],
    answer: 'D',
    solution: '由题意知积分区域为 $\\begin{cases} 0 \\leq x \\leq 1, \\\\ x \\leq y \\leq 1, \\end{cases}$ 令 $x = r \\cos \\theta, y = r \\sin \\theta$，可知在极坐标系下积分区域为 $\\begin{cases} \\frac{\\pi}{4} \\leq \\theta \\leq \\frac{\\pi}{2}, \\\\ 0 \\leq r \\leq \\csc \\theta, \\end{cases}$ 则 $$I = \\int_0^1 dx \\int_0^1 f(x^2 + y^2) dy = \\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{2}} d\\theta \\int_0^{\\csc \\theta} rf(r^2) dr.$$'
  }
]

// 填空题答案
const fillAnswers = [
  {
    id: 6,
    number: 6,
    question: '若 $ x \\to 0 $ 时，无穷小量 $ 2x $ 与 $ 3x^2 + mx $ 等价，则常数 $ m = $ ___。',
    answer: '$2$',
    solution: '由题意得 $\\lim_{x \\to 0} \\frac{2x}{3x^2 + mx} = \\lim_{x \\to 0} \\frac{2}{3x + m} = \\frac{2}{m} = 1$，解得 $m = 2$.'
  },
  {
    id: 7,
    number: 7,
    question: '设 $$ \\begin{cases} x = 5t - t^2, \\\\ y = \\log_2 t, \\end{cases} $$ 则 $$ \\frac{dy}{dx} \\bigg|_{t=2} = $$ ___。',
    answer: '$\\frac{1}{2\\ln 2}$',
    solution: '$\\frac{dy}{dt} = \\frac{1}{t\\ln 2}, \\frac{dx}{dt} = 5 - 2t$, 则 $\\frac{dy}{dx}|_{t=2} = \\frac{t\\ln 2}{5 - 2t}|_{t=2} = \\frac{1}{2\\ln 2}$.'
  },
  {
    id: 8,
    number: 8,
    question: '椭圆 $$ \\frac{x^2}{4} + \\frac{y^2}{3} = 1 $$ 所围成的图形绕 $ x $ 轴旋转一周而成的旋转体体积为 ___。',
    answer: '$8\\pi$',
    solution: '椭圆 $\\frac{x^2}{4} + \\frac{y^2}{3} = 1$ 与 x 轴的交点为 $(-2, 0), (2, 0)$ 则该椭圆绕 x 轴旋转一周而成的旋转体的体积为 $$ V = \\int_{-2}^{2} \\pi y^2 dx = 3\\pi \\int_{-2}^{2} (1 - \\frac{1}{4}x^2) dx = 6\\pi \\int_{0}^{2} (1 - \\frac{1}{4}x^2) dx $$ $$ = 6\\pi (x - \\frac{1}{12}x^3) \\bigg|_{0}^{2} = 6\\pi (2 - \\frac{1}{12} \\times 8) = 8\\pi. $$'
  },
  {
    id: 9,
    number: 9,
    question: '微分方程 $ e^{-x} y\' = 2 $ 的通解是 ___。',
    answer: '$y = 2e^x + C$',
    solution: '微分方程 $e^{-x} y\' = 2$ 分离变量得 $dy = 2e^x dx$，两边积分得通解为 $y = 2e^x + C$.'
  },
  {
    id: 10,
    number: 10,
    question: '函数 $ z = x^{\\ln y} $ 在点 $ (e, e) $ 处的全微分为 $ dz \\bigg|_{(e, e)} = $ ___。',
    answer: '$dx + dy$',
    solution: '$z = x^{\\ln y} = e^{\\ln y \\ln x}$，则 $$ \\left. \\frac{\\partial z}{\\partial x} \\right|_{(e,e)} = \\left. (e^{\\ln y \\ln x} \\cdot \\frac{\\ln y}{x}) \\right|_{(e,e)} = 1, \\quad \\left. \\frac{\\partial z}{\\partial y} \\right|_{e,e} = \\left. (e^{\\ln y \\ln x}) \\cdot \\frac{\\ln x}{y} \\right|_{e,e} = 1, $$ 故 $dz|_{(e,e)} = dx + dy$.'
  }
]

// 计算题答案
const calcAnswers = [
  {
    id: 11,
    number: 11,
    question: '求极限 $$ \\lim_{x \\to 1} \\frac{x^3 + 3x^2 - 9x + 5}{x^3 - 3x + 2} $$。',
    answer: '$2$',
    solution: '$$ \\lim_{x \\to 1} \\frac{x^3 + 3x^2 - 9x + 5}{x^3 - 3x + 2} = \\lim_{x \\to 1} \\frac{3x^2 + 6x - 9}{3x^2 - 3} = \\lim_{x \\to 1} \\frac{6x + 6}{6x} = 2. $$'
  },
  {
    id: 12,
    number: 12,
    question: '设 $ y = \\arctan x^2 $，求 $$ \\frac{d^2 y}{dx^2} \\bigg|_{x=1} $$。',
    answer: '$-1$',
    solution: '$ y = \\arctan x^2, \\quad \\frac{dy}{dx} = \\frac{2x}{1 + x^4}, $ $$ \\frac{d^2 y}{dx^2} \\bigg|_{x=1} = \\frac{2(1 + x^4) - 4x^3 \\cdot 2x}{(1 + x^4)^2} \\bigg|_{x=1} = \\frac{-6x^4 + 2}{(1 + x^4)^2} \\bigg|_{x=1} = \\frac{-4}{4} = -1. $$'
  },
  {
    id: 13,
    number: 13,
    question: '设函数 $ f(x) = \\begin{cases} x^2 \\sin \\frac{1}{x} + 2x, & x \\neq 0 \\\\ 0, & x = 0 \\end{cases} $ 利用导数定义求 $ f\'(0) $。',
    answer: '$2$',
    solution: '$$ f\'(0) = \\lim_{x \\to 0} \\frac{f(x) - f(0)}{x - 0} = \\lim_{x \\to 0} \\frac{x^2 \\sin \\frac{1}{x} + 2x - 0}{x - 0} = \\lim_{x \\to 0} (x \\sin \\frac{1}{x} + 2) = 0 + 2 = 2. $$'
  },
  {
    id: 14,
    number: 14,
    question: '求不定积分 $$ \\int \\frac{2x^2 + 3x}{x\\sqrt{1-x^2}} dx $$。',
    answer: '$- 2 \\sqrt{1 - x^2} + 3 \\arcsin x + C$',
    solution: '$$ \\int \\frac{2x^2 + 3x}{x\\sqrt{1 - x^2}} dx = \\int \\frac{2x + 3}{\\sqrt{1 - x^2}} dx = \\int \\frac{2x}{\\sqrt{1 - x^2}} dx + \\int \\frac{3}{\\sqrt{1 - x^2}} dx $$ $$ = - \\int \\frac{1}{\\sqrt{1 - x^2}} d(1 - x^2) + 3 \\arcsin x $$ $$ = - 2 \\sqrt{1 - x^2} + 3 \\arcsin x + C. $$'
  },
  {
    id: 15,
    number: 15,
    question: '已知 $$ \\int \\tan x dx = -\\ln |\\cos x| + C $$，求定积分 $$ \\int_0^{\\pi/4} x \\sec^2 x dx $$。',
    answer: '$\\frac{\\pi}{4} + \\ln \\frac{\\sqrt{2}}{2}$',
    solution: '$$ \\int_0^{\\pi/4} x \\sec^2 x dx = \\int_0^{\\pi/4} x d \\tan x = x \\tan x \\bigg|_0^{\\pi/4} - \\int_0^{\\pi/4} \\tan x dx $$ $$ = \\frac{\\pi}{4} - (- \\ln |\\cos x|_0^{\\pi/4}) = \\frac{\\pi}{4} + (\\ln \\frac{\\sqrt{2}}{2} - \\ln 1) $$ $$ = \\frac{\\pi}{4} + \\ln \\frac{\\sqrt{2}}{2}. $$'
  },
  {
    id: 16,
    number: 16,
    question: '设 $ z = f(x, y) $ 是由方程 $ z = 2x - y^2 e^z $ 所确定的隐函数，计算 $$ \\frac{\\partial z}{\\partial x} - y \\frac{\\partial z}{\\partial y} $$。',
    answer: '$2$',
    solution: '令 $ F(x, y, z) = 2x - y^2 e^z - z $，则 $$ F_x = 2, \\quad F_y = -2y e^z, \\quad F_z = -y^2 e^z - 1, $$ 所以 $$ \\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z} = -\\frac{2}{-y^2 e^z - 1} = \\frac{2}{y^2 e^z + 1}, \\quad \\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z} = -\\frac{-2y e^z}{-y^2 e^z - 1} = -\\frac{2y e^z}{y^2 e^z + 1}, $$ 故 $$ \\frac{\\partial z}{\\partial x} - y \\frac{\\partial z}{\\partial y} = \\frac{2 + 2y^2 e^z}{y^2 e^z + 1} = 2. $$'
  },
  {
    id: 17,
    number: 17,
    question: '计算二重积分 $$ \\iint_D \\cos x d\\sigma $$，其中 $ D $ 是由曲线 $ y = \\sin x (0 \\leq x \\leq \\frac{\\pi}{2}) $ 和直线 $ y = 0, x = \\frac{\\pi}{2} $ 所围成的有界区域。',
    answer: '$\\frac{1}{2}$',
    solution: '$$ \\iint_D \\cos x d\\sigma = \\int_0^{\\frac{\\pi}{2}} dx \\int_0^{\\sin x} \\cos x dy = \\int_0^{\\frac{\\pi}{2}} y \\cos x \\bigg|_{0}^{\\sin x} dx $$ $$ = \\int_0^{\\frac{\\pi}{2}} (\\sin x \\cos x - 0) dx = \\int_0^{\\frac{\\pi}{2}} \\sin x d \\sin x $$ $$ = \\frac{1}{2} \\sin^2 x \\bigg|_{0}^{\\frac{\\pi}{2}} = \\frac{1}{2}. $$'
  },
  {
    id: 18,
    number: 18,
    question: '判断级数 $$ \\sum_{n=1}^\\infty \\left(\\frac{n}{3^n} - \\frac{3}{2^n}\\right) $$ 的敛散性。',
    answer: '收敛',
    solution: '级数 $\\sum_{n=1}^{\\infty} \\frac{n}{3^n}$ 是正项级数，又 $\\lim_{n \\to \\infty} \\frac{u_{n+1}}{u_n} = \\lim_{n \\to \\infty} \\frac{n+1}{3^{n+1}} \\cdot \\frac{3^n}{n} = \\frac{1}{3} < 1$，故由正项级数的比值审敛法知级数 $\\sum_{n=1}^{\\infty} \\frac{n}{3^n}$ 收敛。又 $\\sum_{n=1}^{\\infty} \\frac{3}{2^n}$ 是公比为 $\\frac{1}{2} < 1$ 的几何级数，故级数 $\\sum_{n=1}^{\\infty} \\frac{3}{2^n}$ 收敛，所以由收敛级数的基本性质知，级数 $\\sum_{n=1}^{\\infty} \\left( \\frac{n}{3^n} - \\frac{3}{2^n} \\right)$ 收敛。'
  }
]

// 综合题答案
const comprehensiveAnswers = [
  {
    id: 19,
    number: 19,
    question: '设函数 $ f(x) = 2x \\ln x - x - \\frac{1}{x} + 2 $,\n\n(1) 求曲线 $ y = f(x) $ 的拐点；\n\n(2) 讨论曲线 $ y = f(x) $ 上是否存在经过坐标原点的切线？',
    solution: '(1) $ f(x) $ 的定义域为 $(0, +\\infty)$，$$ f\'(x) = 2 \\ln x + 2x \\cdot \\frac{1}{x} - 1 + \\frac{1}{x^2} = 2 \\ln x + 1 + \\frac{1}{x^2} $$ $$ f\'\'(x) = 2 \\cdot \\frac{1}{x} - \\frac{2}{x^3} = \\frac{2x^2 - 2}{x^3} $$ 令 $ f\'\'(x) = 0 $，解得 $ x_1 = 1, x_2 = -1 $（舍），当 $ 0 < x < 1 $ 时，$ f\'\'(x) < 0 $，当 $ x > 1 $ 时，$ f\'\'(x) > 0 $，当 $ x = 1 $ 时，$ f(1) = 0 $，故点 $(1,0)$ 为 $ f(x) $ 的拐点；\n\n(2) 设 $ y = f(x) $ 在点 $(x_0, 2x_0 \\ln x_0 - x_0 - \\frac{1}{x_0} + 2)$ 处的切线过坐标原点，则切线方程为 $$ y - (2x_0 \\ln x_0 - x_0 - \\frac{1}{x_0} + 2) = (2 \\ln x_0 + 1 + \\frac{1}{x_0^2})(x - x_0) $$ 将点 $(0, 0)$ 代入上式并整理得 $ x_0 + \\frac{1}{x_0} = 1 $，又 $ x_0 > 0 $，则 $ x_0 + \\frac{1}{x_0} \\geq 2 \\sqrt{x_0 \\cdot \\frac{1}{x_0}} = 2 $，故 $ x_0 + \\frac{1}{x_0} = 1 $ 无解，所以 $ f(x) $ 不存在过原点的切线。'
  },
  {
    id: 20,
    number: 20,
    question: '设函数 $ f(x) $ 连续，\n\n(1) 证明：$$ \\int_{0}^{x} f(x-t) dt = \\int_{0}^{x} f(t) dt $$；\n\n(2) 若 $ f(x) $ 满足 $ f(x) = 3x + 1 + \\int_{0}^{x} tf(t) dt - x \\int_{0}^{x} f(x-t) dt $，求 $ f(x) $。',
    solution: '(1) $$ \\int_{0}^{x} f(x-t)dt = -\\int_{x}^{0} f(u)du = \\int_{0}^{x} f(u)du = \\int_{0}^{x} f(t)dt $$\n\n(2) 由 (1) 中结果可知，$$ f(x) = 3x + 1 + \\int_{0}^{x} tf(t)dt - x \\int_{0}^{x} f(x-t)dt $$ $$ = 3x + 1 + \\int_{0}^{x} tf(t)dt - x \\int_{0}^{x} f(t)dt, \\quad \\text{(1)} $$ ①式两边同时对 $ x $ 求导得 $$ f\'(x) = 3 + xf(x) - \\int_{0}^{x} f(t)dt - xf(x) = 3 - \\int_{0}^{x} f(t)dt, \\quad \\text{(2)} $$ ②式两边同时对 $ x $ 求导得 $$ f\'\'(x) = -f(x), $$ 即 $ f\'\'(x) + f(x) = 0 $，此式为二阶常系数齐次线性微分方程，其对应的特征方程为 $ r^2 + 1 = 0 $，解得特征根为 $ r_{1,2} = \\pm i $，故方程 $ f\'\'(x) + f(x) = 0 $ 的通解为 $ f(x) = C_1 \\cos x + C_2 \\sin x $, $$ f\'(x) = -C_1 \\sin x + C_2 \\cos x. $$ 又分别在①式和②式中令 $ x = 0 $ 得 $ f(0) = 1 $，$ f\'(0) = 3 $，即 $$ \\begin{cases} C_1 = 1, \\\\ C_2 = 3, \\end{cases} $$ 故 $ f(x) = \\cos x + 3 \\sin x $.'
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


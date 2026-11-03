// ============================================================
//  ARTICLES IN ENGLISH: Understand, Theory, Applications, Computation,
//  History and references, plus the texts of figures and scenario cards.
//  Same structure as lecture-fr.js.
// ============================================================

const tex = String.raw

export const LECTURE_EN = {
  comprendre: [
    {
      id: 'idee', titre: 'Drawing with circles', blocs: [
        { p: 'Take a circle turning at constant speed, and place a second, faster circle at the end of its radius. Then a third at the end of the second, and so on. The tip of the last radius draws a curve. With two circles you get an ellipse or a rosette; with a hundred, almost any shape: a heart, an aeroplane, your signature.' },
        { p: 'Greek astronomers already used this device, the *epicycles*, to describe the motion of the planets as seen from the Earth. In 1807, Joseph Fourier claimed something stronger: every periodic function is a sum of waves. For a closed curve in the plane, this means: every closed curve is traced by a chain of turning circles.' },
        { p: 'This project shows how to find those circles, how many are needed, and why some shapes need far more than others. The computation relies on the *fast Fourier transform*, one of the most widely used algorithms in the world.' },
      ],
    },
    {
      id: 'regle', titre: 'The rules of the game', blocs: [
        { p: 'The shape is traversed once, at a steady pace, during one “turn”. We record 2,048 points along it. The Fourier transform turns them into 2,048 coefficients: a centre and 2,047 circles:' },
        {
          liste: [
            'each circle has an integer *frequency* $k$: it makes $k$ turns while the tip goes once round the shape. Positive, it turns one way; negative, the other way;',
            'each circle has a radius and a starting angle, given by a complex number, its *coefficient* $c_k$;',
            'the coefficient $c_0$ does not turn: it is the centre of the shape, where the chain starts;',
            'we keep a certain number of circles, either from slowest to fastest (*by frequency*) or from largest to smallest (*by size*);',
            'with all the circles, the tip passes exactly through the 2,048 recorded points.',
          ],
        },
        { p: 'The rest is just addition: at every instant, the radii are placed end to end, and the tip sits at the end of the chain.' },
      ],
    },
    {
      id: 'lire', titre: 'Reading the explorer', blocs: [
        { p: 'The original shape is pale white. The circles are blue, their radii white; the tip traces in orange the curve obtained with the circles kept. The full curve, in pale orange, shows what the circles will draw over a whole turn.' },
        { p: 'The *Draw* tool lets you trace your own shape, in a single stroke. The *Number of circles* slider goes from 1 to 2,047. *By frequency* adds the circles from slowest to fastest; *by size*, from largest to smallest. *Smoothing* damps the fast circles, and the *parametrisation* changes the speed at which the shape is traversed.' },
        { p: 'Below the animation, the *spectrum* shows the size of each circle by frequency, on a logarithmic scale: each tick is ten times smaller than the previous one. Next to it, the *error* curve says how far the drawn shape is from the original depending on the number of circles, in both orders. In *3D*, time becomes depth: the tip leaves a spring behind it.' },
        { p: 'Here are the shapes, one by one: the question, the rules, what to look at, and what happens. The images are computed in the page.' },
      ],
    },
    { id: 'sc-dessin', titre: '1. Your drawing', blocs: [{ fiche: 'dessin' }] },
    { id: 'sc-ellipse', titre: '2. One circle, then two', blocs: [{ fiche: 'ellipse' }] },
    { id: 'sc-mars', titre: '3. Mars seen from the Earth', blocs: [{ fiche: 'mars' }] },
    { id: 'sc-coeur', titre: '4. The heart', blocs: [{ fiche: 'coeur' }] },
    { id: 'sc-infini', titre: '5. A smooth curve', blocs: [{ fiche: 'infini' }] },
    { id: 'sc-carre', titre: '6. The square', blocs: [{ fiche: 'carre' }] },
    { id: 'sc-etoile', titre: '7. The star', blocs: [{ fiche: 'etoile' }] },
    { id: 'sc-avion', titre: '8. The aeroplane', blocs: [{ fiche: 'avion' }] },
    { id: 'sc-koch', titre: '9. The Koch snowflake', blocs: [{ fiche: 'koch' }] },
    { id: 'sc-spirale', titre: '10. The open spiral', blocs: [{ fiche: 'spirale' }] },
    {
      id: 'retenir', titre: 'What to remember', blocs: [
        { p: 'Every closed curve is a sum of circles turning at integer speeds. The large slow circles give the overall outline; the small fast circles, the details.' },
        { p: 'The number of circles needed depends on how regular the shape is: a smooth curve needs few, a corner many more, a jump an enormous number, and a jump always leaves a 9% wiggle (the Gibbs phenomenon). The way the shape is traversed matters as much as the shape itself. The *Theory* tab explains all this.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'serie', titre: 'A curve is a sum of circles', blocs: [
        { p: 'A point $(x, y)$ of the plane is a complex number $z = x + iy$. A closed curve traversed once, during the time $t \\in [0, 1)$, is a function $z(t)$ with period 1. The simplest turning vector is $e^{2i\\pi t} = \\cos 2\\pi t + i \\sin 2\\pi t$: it makes one turn, with radius 1. With a complex coefficient $c$, $c\\,e^{2i\\pi k t}$ is a vector of length $|c|$, starting angle $\\arg c$, making $k$ turns. The *Fourier series* of the curve is the sum of these vectors:' },
        { tex: tex`z(t) = \sum_{k=-\infty}^{+\infty} c_k\, e^{2i\pi k t}, \qquad c_k = \int_0^1 z(t)\, e^{-2i\pi k t}\, dt` },
        { p: 'Why this formula for $c_k$? Because turning vectors are *orthogonal*: over one turn, the mean of $e^{2i\\pi k t}\\,\\overline{e^{2i\\pi m t}} = e^{2i\\pi (k - m) t}$ is zero as soon as $k \\ne m$ (a vector making a non-zero integer number of turns has mean zero).' },
        { tex: tex`\int_0^1 e^{2i\pi k t}\, e^{-2i\pi m t}\, dt = \begin{cases} 1 & \text{if } k = m \\ 0 & \text{otherwise} \end{cases}` },
        { p: 'Multiplying $z(t)$ by $e^{-2i\\pi k t}$ means spinning the whole drawing at speed $-k$: the circle of frequency $k$ stops, all the others keep turning. Averaging over one turn, the turning ones vanish; only $c_k$ remains.' },
        { figure: 'deuxcercles' },
        { p: 'Two circles are already enough for many shapes. With $k = 1$ and $k = -1$, we get an ellipse with semi-axes $|c_1| + |c_{-1}|$ and $\\big||c_1| - |c_{-1}|\\big|$. With $k = 3$ and $k = -1$ of equal radius, a four-leaf clover. A spirograph is two circles; so is Mars seen from the Earth (see *History*).' },
      ],
    },
    {
      id: 'hilbert', titre: 'A geometry of functions', blocs: [
        { p: 'Curves behave like vectors in an infinite-dimensional space. They can be added, multiplied by a number, and the angle between two of them can be measured with the *inner product*:' },
        { tex: tex`\langle f, g\rangle = \int_0^1 f(t)\,\overline{g(t)}\, dt, \qquad \|f\|^2 = \int_0^1 |f(t)|^2\, dt` },
        { p: 'Curves of finite “length” $\\|f\\|$ form the space $L^2$. The functions $e_k(t) = e^{2i\\pi k t}$ play the role of the axes of a frame: they have length 1 and are pairwise orthogonal, and $c_k = \\langle z, e_k\\rangle$ is the coordinate of $z$ along axis $k$. The partial sum $S_K = \\sum_{|k| \\le K} c_k e_k$ is then the *orthogonal projection* of the curve onto the subspace spanned by frequencies $-K \\dots K$.' },
        {
          preuve: 'The partial sum is the best approximation', source: 'Pythagoras’ theorem',
          paragraphes: [
            'Let $P(t) = \\sum_{|k| \\le K} a_k e^{2i\\pi k t}$ be any sum of circles with frequencies at most $K$. The difference $z - S_K$ is orthogonal to every $e_k$ with $|k| \\le K$ (its coordinates on those axes are $c_k - c_k = 0$), hence orthogonal to $S_K - P$.',
            'By Pythagoras’ theorem, $\\|z - P\\|^2 = \\|z - S_K\\|^2 + \\|S_K - P\\|^2 \\ge \\|z - S_K\\|^2$, with equality only if $P = S_K$. Among all sums of circles with frequency at most $K$, the Fourier partial sum is the closest to the curve, in the mean-square sense.',
            'The same argument shows that if we may use $M$ circles of any frequencies, the best choice is to keep the $M$ largest $|c_k|$: the error is the sum of the $|c_k|^2$ left out, and it is smallest when the smallest ones are left out. This is the explorer’s *by size* order.',
          ],
        },
        { p: 'Pythagoras’ theorem, extended to infinitely many axes, gives *Parseval’s identity*: the energy of the curve is the sum of the energies of its circles.' },
        { tex: tex`\int_0^1 |z(t)|^2\, dt = \sum_{k=-\infty}^{+\infty} |c_k|^2, \qquad \|z - S_K\|^2 = \sum_{|k| > K} |c_k|^2` },
        { p: 'This is what the explorer measures: the *energy kept* is the share of $\\sum |c_k|^2$ (excluding $c_0$) carried by the circles kept, and the *error* is the square root of the share left out. No need to compare the curves point by point: the radii are enough.' },
        {
          expert: 'completeness and the Riesz–Fischer theorem', blocs: [
            { p: 'Parseval assumes that the $e_k$ form a *complete* basis: no non-zero curve is orthogonal to all of them. This is a theorem, not a given. One proof goes through Fejér (below): the Fejér means of a continuous function converge uniformly to it, so trigonometric polynomials are dense in continuous functions, themselves dense in $L^2$.' },
            { p: 'Conversely, the Riesz–Fischer theorem (1907) states that every sequence $(c_k)$ with $\\sum |c_k|^2 < \\infty$ is the sequence of coefficients of a function in $L^2$. The map $z \\mapsto (c_k)$ is therefore a bijective isometry between $L^2$ and the space $\\ell^2$ of square-summable sequences: a curve and its spectrum are the same information, written in two frames.' },
          ],
        },
      ],
    },
    {
      id: 'convergence', titre: 'Does the series converge?', blocs: [
        { p: 'Parseval says that $S_K$ approaches $z$ *on average*. But at every point? The question occupied mathematicians for a century and a half. To answer it, we write the partial sum as a weighted average of the curve around the point, with the *Dirichlet kernel*:' },
        { tex: tex`S_K z(t) = \int_0^1 z(t - s)\, D_K(s)\, ds, \qquad D_K(s) = \sum_{|k| \le K} e^{2i\pi k s} = \frac{\sin\big((2K + 1)\pi s\big)}{\sin(\pi s)}`, etroit: tex`\begin{aligned}S_K z(t) &= \int_0^1 z(t - s)\, D_K(s)\, ds\\ D_K(s) &= \frac{\sin((2K + 1)\pi s)}{\sin(\pi s)}\end{aligned}` },
        { p: 'The Dirichlet kernel has a peak of height $2K + 1$ at 0, but it oscillates and takes negative values. Its mean absolute value, the *Lebesgue constant*, grows without bound, like $\\frac{4}{\\pi^2}\\ln K$. This is the source of all the trouble.' },
        { figure: 'noyaux' },
        { p: '*Dirichlet (1829).* If the curve is made of finitely many differentiable pieces, the series converges at every point, to the value of the curve where it is continuous, and to the midpoint of the jump where it jumps. This is the first rigorous theorem of the theory, twenty years after Fourier’s claim.' },
        { p: '*Du Bois-Reymond (1873).* There is a *continuous* function whose Fourier series diverges at a point. Continuity is not enough. *Kolmogorov* went further: an integrable function whose series diverges almost everywhere (1923), then everywhere (1926).' },
        { p: '*Carleson (1966).* For every function in $L^2$, hence every continuous curve, the series converges *almost everywhere*: the points where it diverges, if any, form a set of length zero. This theorem, conjectured by Lusin in 1915, is one of the hardest in analysis; Hunt extended it in 1968 to the spaces $L^p$, $p > 1$.' },
        { p: '*Fejér (1900).* It is enough to change the way we sum. Instead of $S_K$, take the mean of the partial sums, $\\sigma_K = (S_0 + S_1 + \\dots + S_K)/(K + 1)$. This amounts to weighting the coefficient of frequency $k$ by $1 - |k|/(K + 1)$, and the kernel becomes the *Fejér kernel*:' },
        { tex: tex`F_K(s) = \frac{1}{K + 1}\left(\frac{\sin\big((K + 1)\pi s\big)}{\sin(\pi s)}\right)^2 \ \ge\ 0`, etroit: tex`F_K(s) = \frac{1}{K + 1}\left(\frac{\sin((K + 1)\pi s)}{\sin(\pi s)}\right)^2` },
        { p: 'It is positive, has integral 1, and concentrates at 0: it is a genuine local average. Fejér deduced from it, aged 20, that for every continuous curve, $\\sigma_K$ converges *uniformly*. This is the explorer’s *Fejér smoothing*.' },
        {
          expert: 'why continuity is not enough', blocs: [
            { p: 'The modern argument uses the *uniform boundedness principle* (Banach–Steinhaus). The map sending a continuous function $f$ to $S_K f(0)$ is linear, and its norm is exactly the Lebesgue constant $L_K = \\int_0^1 |D_K|$, which tends to infinity. If $S_K f(0)$ stayed bounded for every continuous $f$, the principle would force the norms $L_K$ to stay bounded. Contradiction: there is a continuous $f$ with $\\sup_K |S_K f(0)| = +\\infty$.' },
            { tex: tex`L_K = \int_0^1 \big|D_K(s)\big|\, ds = \frac{4}{\pi^2}\ln K + O(1)` },
            { p: 'The proof does not construct the function: it shows that it exists, and even that continuous functions whose series diverges at 0 are “generic” (in Baire’s sense). Du Bois-Reymond had built one by hand.' },
          ],
        },
      ],
    },
    {
      id: 'gibbs', titre: 'The Gibbs phenomenon', blocs: [
        { p: 'When the curve jumps, the series converges to the midpoint of the jump, but not uniformly. On both sides, the partial sum overshoots, then oscillates. The peak moves closer to the jump as $K$ grows, but its height does not shrink: it tends to about 9% of the size of the jump.' },
        { p: 'Take the *square wave*, equal to $-1$ then $+1$: $f(x) = \\frac{4}{\\pi}\\sum_{k \\text{ odd}} \\frac{\\sin kx}{k}$. Near the jump, for large $K$, the partial sum reads' },
        { tex: tex`S_K(x) \approx \frac{2}{\pi}\, \mathrm{Si}\big((K + 1)\, x\big), \qquad \mathrm{Si}(u) = \int_0^u \frac{\sin s}{s}\, ds`, etroit: tex`S_K(x) \approx \tfrac{2}{\pi}\, \mathrm{Si}\big((K + 1)\, x\big)` },
        { p: 'The sine integral $\\mathrm{Si}$ reaches its maximum at $u = \\pi$, where it equals $1.851\\,937\\dots$ The sum therefore peaks at $\\frac{2}{\\pi}\\mathrm{Si}(\\pi) \\approx 1.178\\,98$ instead of 1: an overshoot of $0.179$ for a jump of 2, that is $8.949\\%$ of the jump, whatever $K$.' },
        { figure: 'creneau' },
        { p: 'In the plane, a curve jumps when it is not closed: the end does not meet the start, and the series has to bridge the gap. On the explorer’s *open spiral*, we measure an overshoot of 8.8 to 9.5% of the gap, from 30 to 400 circles (the spiral is not straight near the jump, hence these small variations). With Fejér smoothing it disappears: the kernel is positive, the sum becomes an average of points of the curve, and an average does not overshoot. With Lanczos’ $\\sigma$ factors, $\\mathrm{sinc}\\big(k/(K + 1)\\big)$, it falls to about 1% from some sixty circles on, while keeping a sharper shape.' },
        { p: 'A corner, on the other hand, produces no Gibbs phenomenon: the curve is continuous, only its direction jumps. The series converges uniformly; the corner is merely rounded.' },
      ],
    },
    {
      id: 'regularite', titre: 'Regularity and decay', blocs: [
        { p: 'How many circles are needed? It depends on how fast the $|c_k|$ decrease, and that speed is dictated by the *regularity* of the curve. Everything rests on an integration by parts:' },
        { tex: tex`c_k(z') = 2i\pi k\; c_k(z) \qquad\Longrightarrow\qquad |c_k(z)| = \frac{|c_k(z')|}{2\pi |k|}`, etroit: tex`c_k(z') = 2i\pi k\, c_k(z)` },
        { p: 'Differentiating multiplies the $k$-th coefficient by $2i\\pi k$. If the curve is $p$ times differentiable with an integrable $p$-th derivative, its coefficients are therefore divided by $|k|^p$:' },
        {
          liste: [
            '*a jump* (open curve): $|c_k| \\sim C/|k|$. The open spiral: measured slope $-1.1$;',
            '*a corner* (the direction jumps): $|c_k| \\sim C/k^2$. The square: $-1.9$; the star and the aeroplane: $-2.0$; the heart traversed at constant speed: $-2.1$;',
            '*corners at every scale*: the Koch snowflake, continuous but nowhere differentiable. Its Hölder regularity with exponent $\\alpha = \\ln 3/\\ln 4 \\approx 0.79$ guarantees at least $|c_k| = O(|k|^{-0.79})$; we measure a mean slope of $-1.3$, and along the frequencies $-1, -4, -16, -64$, the radius is divided by roughly 4 at each step (by 3.99, then 3.96, then 3.83);',
            '*an analytic curve* (no corner, expandable as a power series, like the lemniscate): $|c_k| \\le C e^{-a|k|}$, a decay faster than any power.',
          ],
        },
        { figure: 'decroissance' },
        {
          preuve: 'Why a corner gives 1/k²', source: 'integration by parts',
          paragraphes: [
            'Traversed at constant speed, a polygon has a velocity $z\'(t)$ that is constant on each side and jumps at each corner: $z\'$ is a step function.',
            'A jump of height $h$ at time $t_0$ contributes to the coefficient of $z\'$ a term of size $|h|/(2\\pi |k|)$ (like the square wave). So $|c_k(z\')| \\le C/|k|$, and by the differentiation formula $|c_k(z)| = |c_k(z\')|/(2\\pi|k|) \\le C\'/k^2$.',
            'Conversely, a corner is enough to prevent anything better: if $|c_k(z)|$ decreased faster than $1/k^2$ in the mean-square sense, $z\'$ would lie in a space that contains no step functions. We do measure a slope close to $-2$ on the square, the star and the aeroplane.',
          ],
        },
        { p: 'But the regularity in question is that of the *function* $z(t)$, not of the drawn shape. The heart is the striking example. Its formula, $x = 16\\sin^3 t$, $y = 13\\cos t - 5\\cos 2t - 2\\cos 3t - \\cos 4t$, is a trigonometric polynomial: following its formula, exactly 8 circles draw it, with no error at all. Yet the heart has a cusp at the top. The formula passes through it while slowing down to a stop: its speed vanishes, and the function stays smooth. Traversed at constant speed, on the contrary, one has to turn abruptly at the cusp, and the coefficients decrease like $1/k^2$.' },
        { figure: 'parametrage' },
      ],
    },
    {
      id: 'symetries', titre: 'Symmetries and invariances', blocs: [
        { p: 'What we do to the shape can be read directly on its coefficients:' },
        {
          liste: [
            '*moving it* changes only $c_0$, the centre;',
            '*scaling it* by a factor $\\lambda$ multiplies every $c_k$ by $\\lambda$;',
            '*rotating it* by an angle $\\varphi$ multiplies them all by $e^{i\\varphi}$: the radii do not change;',
            '*changing the starting point* (starting the turn at time $\\tau$) multiplies $c_k$ by $e^{2i\\pi k\\tau}$: the radii do not change either;',
            '*traversing it the other way round* swaps $c_k$ and $c_{-k}$.',
          ],
        },
        { p: 'A rotational symmetry imposes more. If the shape maps onto itself when rotated by one $m$-th of a turn, and one $m$-th of the time is enough for that, then $z(t + 1/m) = e^{2i\\pi/m}\\, z(t)$. Taking coefficients on both sides:' },
        { tex: tex`e^{2i\pi k/m}\, c_k = e^{2i\pi/m}\, c_k \qquad\Longrightarrow\qquad c_k = 0 \ \text{ unless } \ k \equiv 1 \pmod m`, etroit: tex`c_k = 0 \ \text{ unless } \ k \equiv 1 \pmod m` },
        { p: 'A five-pointed star uses only the frequencies $1, -4, 6, -9, 11, \\dots$; a square, $1, -3, 5, -7, \\dots$; a triangle, $1, -2, 4, -5, \\dots$ Four fifths of the star’s circles are zero, which explains why the *by frequency* order wastes so many circles on these shapes. The Koch snowflake, traversed the other way round, uses only the frequencies $k \\equiv -1 \\pmod 3$: $-1, 2, -4, 5, \\dots$' },
        { figure: 'symetrie' },
        { p: 'The radii $|c_k|$ therefore depend neither on position, nor on orientation, nor on the starting point; divided by the square root of the energy, they no longer depend on size either. They form a signature of the shape, the *Fourier descriptors*, used to recognise shapes (see *Applications*).' },
      ],
    },
    {
      id: 'discret', titre: 'From integral to sum: sampling', blocs: [
        { p: 'A computer does not know $z(t)$ for every $t$: it knows $N$ values, $z_n = z(n/N)$. It replaces the integral by an average, the *discrete Fourier transform*:' },
        { tex: tex`\hat c_k = \frac{1}{N}\sum_{n=0}^{N-1} z_n\, e^{-2i\pi k n / N}, \qquad z_n = \sum_{k} \hat c_k\, e^{2i\pi k n / N}`, etroit: tex`\begin{aligned}\hat c_k &= \tfrac{1}{N}\textstyle\sum_{n} z_n\, e^{-2i\pi k n / N}\\ z_n &= \textstyle\sum_{k} \hat c_k\, e^{2i\pi k n / N}\end{aligned}` },
        { p: 'Both formulas are exact: $N$ points, $N$ coefficients, and we go from one to the other without loss. But $\\hat c_k$ is not quite $c_k$. At the instants $n/N$, the frequencies $k$ and $k + N$ cannot be told apart, since $e^{2i\\pi (k + N) n/N} = e^{2i\\pi k n/N}$: this is *aliasing*. Replacing $z$ by its series:' },
        { tex: tex`\hat c_k = \sum_{j=-\infty}^{+\infty} c_{k + jN}` },
        { p: 'Each discrete coefficient is the true coefficient, plus all those that fold onto it. So the frequencies are taken from $-N/2$ to $N/2 - 1$, the slowest possible, and the aliasing error is small if the coefficients decay fast. If the curve has no frequency beyond $K$, $N > 2K$ points are enough to recover it exactly: this is the *sampling theorem* of Nyquist and Shannon.' },
        { figure: 'repliement' },
        { p: 'It is the same effect as the stagecoach wheels that seem to turn backwards in films: the camera takes 24 frames per second, and a wheel that makes almost a full turn between two frames seems to move back.' },
      ],
    },
    {
      id: 'fft', titre: 'The fast Fourier transform', blocs: [
        { p: 'Computed directly, the discrete transform takes $N$ multiplications for each of the $N$ coefficients: $N^2$ in all, more than four million for $N = 2{,}048$. The *fast transform* (FFT) separates the points with even and odd index. With $w = e^{-2i\\pi/N}$:' },
        { tex: tex`X_k = \underbrace{\sum_{m} z_{2m}\, w^{2mk}}_{E_k} + w^k \underbrace{\sum_{m} z_{2m+1}\, w^{2mk}}_{O_k}, \qquad X_{k + N/2} = E_k - w^k\, O_k`, etroit: tex`\begin{aligned}X_k &= E_k + w^k\, O_k\\ X_{k + N/2} &= E_k - w^k\, O_k\end{aligned}` },
        { p: '$E$ and $O$ are two transforms of size $N/2$, and each pair $(X_k, X_{k+N/2})$ follows from $(E_k, O_k)$ with a single multiplication: a *butterfly*. Repeating down to transforms of size 1, we get $\\log_2 N$ stages of $N/2$ butterflies. The cost satisfies $T(N) = 2\\,T(N/2) + O(N)$, hence $T(N) = O(N \\log N)$.' },
        { figure: 'papillon' },
        { p: 'For 2,048 points: 11,264 butterflies instead of 4,194,304 multiplications, nearly 400 times fewer. For a million points, the factor exceeds 100,000. Cooley and Tukey published the method in 1965; it was later found that Gauss had discovered it around 1805, to compute the orbits of the asteroids Pallas and Juno, without publishing it.' },
      ],
    },
    {
      id: 'transformee', titre: 'From series to transform', blocs: [
        { p: 'A closed curve is periodic; a signal that does not repeat is not. As the period tends to infinity, the frequencies $k$ crowd together until they fill the whole line, and the series becomes an integral, the *Fourier transform*:' },
        { tex: tex`\hat f(\xi) = \int_{-\infty}^{+\infty} f(x)\, e^{-2i\pi x \xi}\, dx, \qquad f(x) = \int_{-\infty}^{+\infty} \hat f(\xi)\, e^{2i\pi x \xi}\, d\xi`, etroit: tex`\hat f(\xi) = \int f(x)\, e^{-2i\pi x \xi}\, dx` },
        { p: 'Parseval becomes Plancherel’s theorem ($\\|\\hat f\\| = \\|f\\|$), and differentiation is still a multiplication, by $2i\\pi\\xi$. A new phenomenon appears: a function and its transform cannot both be very concentrated. Measuring their spread by their standard deviations, the *uncertainty principle* imposes' },
        { tex: tex`\sigma_x\, \sigma_\xi \ \ge\ \frac{1}{4\pi}` },
        { p: 'A very short note has no precise pitch; a precise pitch requires a long note. The same inequality, in quantum mechanics, links the position and the momentum of a particle. For our curves, the periodic version is what counts: a very fine detail (a corner, a cusp) cannot be made of a few frequencies.' },
        {
          expert: 'the Poisson summation formula', blocs: [
            { p: 'The link between series, transform and sampling fits in one formula: for a sufficiently regular function,' },
            { tex: tex`\sum_{n=-\infty}^{+\infty} f(n) = \sum_{k=-\infty}^{+\infty} \hat f(k)` },
            { p: 'Sampling at the integers on one side means periodising on the other. The aliasing formula of the previous section is its discrete version, and Shannon’s theorem follows: if $\\hat f$ vanishes outside $[-B, B]$, the periodised copies do not overlap as long as we sample faster than $2B$, and $f$ is recovered exactly.' },
          ],
        },
      ],
    },
  ],

  applications: [
    {
      id: 'compression', titre: 'Keeping the large circles: compression', blocs: [
        { p: 'Keeping the largest circles and forgetting the others is compression. The explorer’s aeroplane has 2,048 coefficients; ordered by size, 13 circles keep 99% of its energy, 29 keep 99.9%. Ordered by frequency, 17 and 40 are needed.' },
        { figure: 'compression' },
        { p: 'The JPEG image format (1992) does exactly this, in two dimensions. The image is cut into 8 × 8 pixel squares; each square goes through a *discrete cosine transform* (a real cousin of the Fourier transform, proposed by Ahmed, Natarajan and Rao in 1974); the coefficients are rounded, all the more coarsely as they correspond to fine details the eye barely notices. Most of them become zero and cost almost nothing to store.' },
        { p: 'Near sharp edges, an over-compressed image shows ripples: this is the Gibbs phenomenon, which appears as soon as the high frequencies of a jump are cut off.' },
      ],
    },
    {
      id: 'son', titre: 'Sound', blocs: [
        { p: 'A sound is a pressure varying in time. Its Fourier transform says which frequencies it contains: a piano note is a fundamental frequency and its harmonics, and their proportions make the timbre. Tuners, equalisers and spectrograms compute FFTs continuously.' },
        { p: 'The MP3 and AAC formats cut the sound into short slices, transform them (a modified cosine transform), and remove what the ear does not hear, for example a faint sound masked by a loud sound of nearby frequency. That is the principle of compression: keep the large coefficients, the ones that matter to us.' },
      ],
    },
    {
      id: 'irm', titre: 'MRI: an image measured in frequencies', blocs: [
        { p: 'An MRI scanner does not photograph the body. Using magnetic field gradients, each measurement gives a Fourier coefficient of the image: the signal of the hydrogen nuclei oscillates at a frequency that depends on their position. The machine thus scans the “frequency space”, then an inverse Fourier transform reconstructs the image.' },
        { p: 'Paul Lauterbur published the first image of this kind in 1973; Peter Mansfield invented fast ways to scan the frequencies. They shared the Nobel Prize in Physiology or Medicine in 2003. Cutting high frequencies to save time produces, here too, ripples along the edges.' },
      ],
    },
    {
      id: 'formes', titre: 'Recognising shapes', blocs: [
        { p: 'The radii of the circles depend neither on position, nor on orientation, nor on the starting point (see *Theory*). Divided by the square root of the energy, they no longer depend on size. Two similar shapes therefore have close signatures: these are the *Fourier descriptors*, used since the 1970s to recognise handwritten characters, outlines of machine parts or silhouettes (Granlund, 1972; Zahn and Roskies, 1972).' },
        { figure: 'descripteurs' },
        { p: 'In biology, the *elliptic descriptors* of Kuhl and Giardina (1982), a variant that decomposes $x(t)$ and $y(t)$ separately, are used to compare the outlines of leaves, shells, bones or seeds, and to measure their variation from one species to another.' },
      ],
    },
    {
      id: 'calculs', titre: 'The FFT everywhere', blocs: [
        { p: 'The FFT is one of the most executed algorithms in the world. Wi-Fi and 4G split their signal into hundreds of carrier frequencies, sent and received with FFTs. Multiplying two numbers with millions of digits amounts to multiplying their transforms (Schönhage and Strassen, 1971). “Spectral methods” solve the equations of physics by working on the coefficients, where differentiating amounts to multiplying. And every convolution, from blurring a photo to the reverberation of a room, is computed faster by going through frequencies.' },
      ],
    },
    {
      id: 'limites', titre: 'What Fourier does badly', blocs: [
        { p: 'A Fourier circle turns during the whole turn: each coefficient depends on the whole curve. A very local detail, a small hook in the middle of a straight stroke, therefore costs many circles, which cancel out almost everywhere else. *Wavelets*, developed in the 1980s, use short waves instead, localised in time and in frequency. The JPEG 2000 format uses them instead of the cosine transform.' },
        { p: 'And a jump always leaves its 9% of oscillation, as long as we simply cut the series. Fejér and Lanczos smoothing reduce it, at the cost of blunted details: you cannot win on every front.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'echantillonnage', titre: 'Recording 2,048 points', blocs: [
        { p: 'A famous shape is given by a formula, or by a polygon; a drawing, by the successive positions of the mouse, closer together where you go slowly. In every case, we record $N = 2{,}048$ points. *Following its formula*: at times $0, 1/N, 2/N \\dots$ *At constant speed*: at equal distances along the path. We compute the cumulative lengths of the segments, then, for each distance $s_n = nL/N$, find the segment that contains it and interpolate.' },
        { p: 'A freehand drawing is always traversed at constant speed: otherwise the places where the hand slowed down would carry more weight. If *Join the end to the start* is unticked, the curve is not closed: the points go from the start to the end, and the series has to jump from the end back to the start.' },
      ],
    },
    {
      id: 'fft', titre: 'The FFT, in place', blocs: [
        { p: 'The explorer’s FFT is iterative and works in place, on two arrays of 64-bit floating-point numbers (real and imaginary parts). It starts by putting the points in the order given by *reversing the bits* of their index (point 1 = 001 goes to 4 = 100), then runs the stages of butterflies of size 2, 4, 8… up to $N$. The rotations $w^k$ are obtained step by step by multiplication, without calling sine and cosine at each butterfly.' },
        { p: 'Compared with the direct transform, computed in $N^2$ operations, it agrees to $10^{-12}$ in relative terms; a round trip (transform then inverse transform) recovers the data to within $10^{-13}$. An FFT of 2,048 points takes less than a tenth of a millisecond, and preparing a whole shape (recording the points included) about a millisecond: everything happens in the page, with no Web Worker.' },
      ],
    },
    {
      id: 'dessin', titre: 'Drawing the chain and the curve', blocs: [
        { p: 'The curve obtained with $M$ circles is computed in one go: the coefficients not kept are set to zero (after weighting them, when smoothing), and an inverse FFT gives its 2,048 exact points. The orange trace is just the beginning of this array, up to the present instant.' },
        { p: 'The chain of circles, on the other hand, is recomputed at every frame: for each circle, a cosine, a sine and an addition. The circles are ordered from largest to smallest, which gives the most readable chain; the order of the addition does not change the position of the tip. Circles smaller than half a pixel are not drawn.' },
      ],
    },
    {
      id: 'ordres', titre: 'The two orders and the error curve', blocs: [
        { p: '*By frequency*, the list is $1, -1, 2, -2, 3, \\dots$ *By size*, it is the list of the 2,047 coefficients sorted by decreasing $|c_k|$. Thanks to Parseval, the error with $M$ circles can be read off the cumulative sums of $|c_k|^2$ in this order: the whole error curve is computed in a single pass, without redrawing a single shape.' },
        { p: '*Smoothing*: for a sum whose highest frequency is $K$, Fejér multiplies the coefficient of frequency $k$ by $1 - |k|/(K + 1)$, and Lanczos by $\\sin u / u$ with $u = \\pi k/(K + 1)$. Smoothing only makes sense by frequency, where $K$ is well defined.' },
      ],
    },
    {
      id: 'troisd', titre: 'The spring in 3D', blocs: [
        { p: 'In 3D, the point of the curve at time $t - a$ is placed at depth $-a$, for $a$ from 0 to one turn: the curve becomes a spring receding into the past. From the front, you see the shape; from the side, you see $x(t)$ or $y(t)$ as a wave. The spring is a single line of 2,048 points, updated at every frame; the circles are a single geometry of segments. three.js is only loaded when you switch to 3D.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'A history of circles and waves', blocs: [
        {
          frise: [
            ['c. 150', 'Claudius Ptolemy', 'gathers in the *Almagest* an astronomy of circles: each planet turns on an epicycle, whose centre turns on a deferent.'],
            ['1543', 'Nicolaus Copernicus', 'puts the Sun at the centre, but keeps circles and epicycles.'],
            ['1609', 'Johannes Kepler', 'replaces circles by ellipses (*Astronomia nova*).'],
            ['1753', 'Daniel Bernoulli', 'proposes writing the vibration of a string as a sum of sines; Euler and d’Alembert doubt it.'],
            ['c. 1805', 'Carl Friedrich Gauss', 'invents, without publishing it, the method of the fast transform, for the orbits of Pallas and Juno.'],
            ['1807', 'Joseph Fourier', 'presents his memoir on heat to the Institut: every function would be a sum of sines. Lagrange objects.'],
            ['1822', 'Joseph Fourier', 'publishes the *Théorie analytique de la chaleur*.'],
            ['1829', 'Peter Gustav Lejeune Dirichlet', 'proves the first rigorous convergence condition.'],
            ['1848', 'Henry Wilbraham', 'notices the overshoot near a jump, later called the Gibbs phenomenon.'],
            ['1873', 'Paul du Bois-Reymond', 'constructs a continuous function whose series diverges at a point.'],
            ['1898', 'Albert Michelson', 'builds with Samuel Stratton an 80-element mechanical harmonic analyser; its curves show the overshoot.'],
            ['1898–1899', 'Josiah Willard Gibbs', 'explains this overshoot in two letters to *Nature*.'],
            ['1900', 'Lipót Fejér', 'shows that the means of the partial sums converge for every continuous function.'],
            ['1906', 'Maxime Bôcher', 'analyses the phenomenon in detail and names it after Gibbs.'],
            ['1907', 'Frigyes Riesz and Ernst Fischer', 'identify square-integrable functions with square-summable sequences.'],
            ['1923', 'Andrey Kolmogorov', 'constructs an integrable function whose series diverges almost everywhere (everywhere in 1926).'],
            ['1960', 'Norwood Russell Hanson', 'shows that finitely many epicycles approximate any periodic plane motion.'],
            ['1965', 'James Cooley and John Tukey', 'publish the fast Fourier transform.'],
            ['1966', 'Lennart Carleson', 'proves that the series of a square-integrable function converges almost everywhere.'],
            ['1972', 'Charles Zahn and Ralph Roskies', 'describe the outlines of shapes by their Fourier coefficients.'],
            ['1973', 'Paul Lauterbur', 'publishes the first magnetic resonance image.'],
            ['1992', 'The JPEG committee', 'publishes the image compression standard that bears its name.'],
          ],
        },
      ],
    },
    {
      id: 'ptolemee', titre: 'The sky in circles', blocs: [
        { p: 'Seen from the Earth, the planets usually move from west to east among the stars, but from time to time they stop, move backwards, then go on again: this is *retrograde motion*. To describe it with circles, the Greek astronomers (Apollonius, Hipparchus, then Ptolemy) made the planet turn on a small circle, the *epicycle*, whose centre turns on a large circle, the *deferent*, around the Earth.' },
        { figure: 'ptolemee' },
        { p: 'Today we understand why this works. Mars and the Earth orbit the Sun; seen from the Earth, the position of Mars is the difference of the two: $z_{\\text{Mars}}(t) - z_{\\text{Earth}}(t)$, two turning vectors. The deferent is the orbit of Mars, the epicycle is that of the Earth, seen in reverse. In the explorer, the *Mars seen from Earth* scenario traces exactly this: eight turns of Mars during fifteen turns of the Earth, that is about fifteen years, and seven retrograde loops.' },
        { p: 'Real orbits are ellipses, and Ptolemy had to add adjustments (the eccentric, the equant) to follow the observations. In 1960, Norwood Russell Hanson pointed out that this was not a mathematical dead end: with enough epicycles, any periodic motion in the plane can be approximated. This is exactly Fourier’s theorem. The revolution of Copernicus and Kepler did not come from circles being powerless, but from their describing without explaining.' },
      ],
    },
    {
      id: 'fourier', titre: 'Fourier and heat', blocs: [
        { p: 'Joseph Fourier (1768–1830), mathematician, prefect of the Isère, who accompanied Bonaparte to Egypt, studied the propagation of heat in a metal bar or ring. He found that each sine cools down at its own speed, the faster the faster it oscillates. To solve the equation, it is therefore enough to write the initial temperature as a sum of sines.' },
        { p: 'But *every* function, even with corners or jumps? Lagrange, on the 1807 jury, refused to believe it: a sum of smooth functions seemed to him able to give only a smooth function. He was right to be wary and wrong to conclude: the series does converge, but not always as expected. It took a century and a half to know exactly when.' },
      ],
    },
    {
      id: 'heritage', titre: 'What Fourier changed', blocs: [
        { p: 'The questions raised by Fourier shaped modern mathematics. To define his coefficients, Riemann made the notion of integral precise (1854). Studying the uniqueness of trigonometric series, Cantor was led to infinite sets and to set theory. The Lebesgue integral (1902) and Hilbert spaces finally gave the framework in which Parseval becomes a geometric evidence. Later, Laurent Schwartz’s distributions extended the Fourier transform to objects that are no longer even functions.' },
        { p: 'On the other side, engineers made Fourier an everyday tool: vibration analysis, telecommunications, medical imaging, compression. And a chain of circles drawing a shape has become one of the most visual ways to explain it.' },
      ],
    },
    {
      id: 'refs', titre: 'References', blocs: [
        {
          refs: [
            ['J. Fourier, *Théorie analytique de la chaleur*, Paris, Firmin Didot, 1822.'],
            ['P. G. Lejeune Dirichlet, “Sur la convergence des séries trigonométriques qui servent à représenter une fonction arbitraire entre des limites données”, *Journal für die reine und angewandte Mathematik*, 4, 1829.'],
            ['L. Fejér, “Sur les fonctions bornées et intégrables”, *Comptes rendus de l’Académie des sciences*, 131, 1900.'],
            ['J. W. Gibbs, “Fourier’s series”, *Nature*, 59, 1898 and 1899.'],
            ['M. Bôcher, “Introduction to the theory of Fourier’s series”, *Annals of Mathematics*, 7, 1906.'],
            ['L. Carleson, “On convergence and growth of partial sums of Fourier series”, *Acta Mathematica*, 116, 1966.'],
            ['J. W. Cooley, J. W. Tukey, “An algorithm for the machine calculation of complex Fourier series”, *Mathematics of Computation*, 19, 1965.', 'https://doi.org/10.1090/S0025-5718-1965-0178586-1'],
            ['M. T. Heideman, D. H. Johnson, C. S. Burrus, “Gauss and the history of the fast Fourier transform”, *Archive for History of Exact Sciences*, 34, 1985.', 'https://doi.org/10.1007/BF00348431'],
            ['N. R. Hanson, “The mathematical power of epicyclical astronomy”, *Isis*, 51, 150–158, 1960.'],
            ['C. T. Zahn, R. Z. Roskies, “Fourier descriptors for plane closed curves”, *IEEE Transactions on Computers*, C-21, 1972.'],
            ['F. P. Kuhl, C. R. Giardina, “Elliptic Fourier features of a closed contour”, *Computer Graphics and Image Processing*, 18, 1982.'],
            ['N. Ahmed, T. Natarajan, K. R. Rao, “Discrete cosine transform”, *IEEE Transactions on Computers*, C-23, 1974.'],
            ['P. C. Lauterbur, “Image formation by induced local interactions”, *Nature*, 242, 1973.'],
            ['Y. Katznelson, *An Introduction to Harmonic Analysis*, Cambridge University Press (3rd ed. 2004).'],
            ['T. W. Körner, *Fourier Analysis*, Cambridge University Press, 1988: a lively history of the theory and of its applications.'],
            ['“Gibbs phenomenon”, Wikipedia: history and computations.', 'https://en.wikipedia.org/wiki/Gibbs_phenomenon'],
          ],
        },
      ],
    },
  ],

  /* ---------- Figure texts ---------- */

  figures: {
    deuxcercles: {
      titre: 'Two turning vectors',
      resume: 'An orange curve traced by two blue circles, one at the end of the other.',
      presets: { ellipse: 'Ellipse', trefle: 'Clover', spirographe: 'Spirograph', mars: 'Mars' },
      k1: 'Frequency of circle 1',
      r1: 'Radius of circle 1',
      k2: 'Frequency of circle 2',
      r2: 'Radius of circle 2',
      temps: 'Instant',
      note: 'A negative frequency makes the circle turn the other way; a negative radius shifts its start by half a turn. Two frequencies equal to ±1 give an ellipse; any two frequencies, a rosette that closes after one turn.',
    },
    creneau: {
      titre: 'The square wave and its partial sum',
      resume: 'A grey square wave equal to −1 then 1, and a green curve approaching it with oscillations, with a peak near each jump.',
      K: 'Highest frequency K',
      lissage: 'Smoothing',
      lissages: { aucun: 'None', fejer: 'Fejér', lanczos: 'Lanczos' },
      serieF: 'the square wave',
      serieS: (k) => `sum up to ${k}`,
      axeX: 'x',
      axeY: 'value',
      info: (x, v) => `x = ${x}: ${v}`,
      depassement: (p) => `Overshoot near the jump: ${p} of the jump.`,
      note: 'Increase K: the peak moves closer to the jump but its height tends to 8.95% of the jump. With Fejér it disappears; with Lanczos, less than 1.2% remains.',
    },
    noyaux: {
      titre: 'The Dirichlet and Fejér kernels',
      resume: 'A green kernel with a tall peak and negative oscillations, an orange kernel that is positive and wider.',
      K: 'K',
      dirichlet: 'Dirichlet D_K',
      fejer: 'Fejér F_K',
      axeX: 'offset x = 2πs',
      axeY: 'weight',
      info: (x, v) => `${x}: ${v}`,
      note: 'The partial sum is an average of the curve weighted by the Dirichlet kernel, which takes negative values: hence the oscillations. The Fejér kernel, always positive, makes a genuine local average.',
    },
    decroissance: {
      titre: 'The size of the circles by frequency (logarithmic scales)',
      resume: 'Five decreasing curves: very fast for the smooth curve, like 1/k² for corners, like 1/k for the jump.',
      noms: { infini: 'infinity (smooth)', coeur: 'heart (a cusp)', carre: 'square (corners)', koch: 'Koch (fractal)', spirale: 'spiral (a jump)' },
      serie: (nom, p) => (p ? `${nom} (slope ${p})` : nom),
      axeX: 'frequency |k|',
      axeY: 'typical radius',
      info: (x, v) => `|k| ≈ ${x}: ${v}`,
      note: 'Each point is the root mean square of the radii over one octave of frequencies (from 2^m to 2^(m+1)). The shapes are traversed at constant speed.',
    },
    parametrage: {
      titre: 'The same heart, two ways of traversing it',
      series: { formule: 'following its formula', vitesse: 'at constant speed' },
      axeX: 'circles (ordered by size)',
      axeY: 'error',
      info: (x, v) => `${x} circles: ${v}`,
      resume: 'Following its formula, the error drops to zero at 8 circles; at constant speed, it decreases slowly.',
      note: 'The formula slows down to a stop at the cusp of the heart: it stays smooth, and 8 circles are exactly enough. At constant speed, the cusp becomes a corner, and hundreds are needed.',
    },
    symetrie: {
      titre: 'Rotational symmetry and allowed frequencies',
      formes: { triangle: 'Triangle', carre: 'Square', etoile: 'Star' },
      note: (m) => `In green, the frequencies k such that k − 1 is a multiple of ${m}: they are the only non-zero ones (up to computing precision). The other bars touch the floor of the scale.`,
    },
    repliement: {
      titre: 'Eight frames per turn: aliasing',
      resume: 'A circle, eight points numbered 0 to 7, and the true path in pale orange.',
      k: 'True frequency k',
      etat: (k, a) => `True frequency ${k}, apparent frequency ${a}.`,
      note: 'A point turns k times per turn, but we only look at it eight times. The numbered points are all we see: they seem to turn at the apparent frequency, between −4 and 3.',
    },
    papillon: {
      titre: 'The FFT of 8 points: three stages of butterflies',
      resume: 'Eight horizontal lines linked by X-shaped crossings over three stages.',
      naive: 'direct transform (N²)',
      rapide: 'FFT butterflies ((N/2) log₂ N)',
      note: 'On the left, the points in bit-reversed order; on the right, the coefficients in order. Each X is a butterfly: one multiplication, one addition, one subtraction.',
    },
    compression: {
      titre: 'The aeroplane: error by number of circles',
      ordres: { frequence: 'by frequency', amplitude: 'by size' },
      axeX: 'circles kept',
      axeY: 'error',
      info: (x, v) => `${x} circles: ${v}`,
      resume: 'Two decreasing curves; ordered by size, fewer circles are needed for the same error.',
      note: 'The error is the square root of the share of energy left out, by Parseval’s identity. Logarithmic scales on both axes.',
    },
    ptolemee: {
      titre: 'Mars seen from the Sun and from the Earth',
      resume: 'On the left, two circular orbits around the Sun; on the right, the path of Mars seen from the Earth, with loops.',
      helio: 'seen from the Sun',
      geo: 'seen from the Earth',
      soleil: 'Sun',
      terre: 'Earth',
      mars: 'Mars',
      temps: 'Time',
      jours: (j) => `${j} days`,
      note: 'Circular orbits, radii 1 and 1.524 astronomical units, periods 365.25 and 686.98 days. When the Earth overtakes Mars, Mars seems to move backwards: a retrograde loop, about every 780 days.',
    },
    descripteurs: {
      titre: 'Which shape did you draw?',
      resume: 'A drawing area; draw a shape there and the figure names the closest known shapes.',
      consigne: 'Draw a shape in a single stroke inside the frame.',
      resultat: (l) => `Closest: ${l}.`,
      effacer: 'Clear',
      noms: { cercle: 'circle', ellipse: 'ellipse', trefle: 'clover', coeur: 'heart', infini: 'infinity', poisson: 'fish', carre: 'square', triangle: 'triangle', etoile: 'star', avion: 'aeroplane', koch: 'snowflake' },
      note: 'Signature: the radii of the first 24 circles (frequencies −12 to 12), divided by the square root of the energy, also compared in reverse. In brackets, the distance: the smaller, the more alike. Size, position, orientation and starting point make no difference.',
    },
  },

  /* ---------- Scenario cards ---------- */

  fiche: {
    regles: 'The rules',
    regarder: 'What to look at',
    pourquoi: 'What happens, and why',
    realite: 'Going further',
    ouvrir: 'Open in the explorer',
    ouvrirNom: (nom) => `Open “${nom}”`,
    calcul: 'Computing…',
    note: 'Computed in the page with the explorer’s engine. In pale white, the original shape; in orange, the curve of the circles kept; in blue, the circles at one instant of the turn.',
    mesures: (m, e) => `${m} circle${m === '1' ? '' : 's'} · energy kept ${e}`,
  },

  fiches: {
    dessin: {
      question: 'Can any shape be redrawn with circles?',
      regles: [
        'Choose *Your drawing*, or the *Draw* tool, and trace a shape in a single stroke, without lifting your finger.',
        'The shape is traversed at constant speed and recorded as 2,048 points; the end is joined to the start.',
        'The circles are ordered by size, and 60 are kept to begin with.',
      ],
      regarder: [
        'With 1 circle: a circle, roughly the size of your drawing.',
        'With 5 to 10 circles: the overall outline appears.',
        'With a hundred: the details, down to the trembling of the hand.',
      ],
      pourquoi: [
        'Your drawing is a closed curve: Fourier’s theorem guarantees that it is a sum of circles. The large slow circles carry most of the energy; the small fast circles add the details. Ordered by size, you get the best possible likeness for a given number of circles.',
        'Corners require many small circles: a drawing made of gentle curves is recognisable with fewer circles than one full of angles.',
      ],
      realite: 'Untick *Join the end to the start*: the curve then jumps from the end to the start, and the series oscillates near the jump. This is the Gibbs phenomenon (see the spiral’s card).',
    },
    ellipse: {
      question: 'What do one or two circles draw?',
      regles: [
        'A single circle, with frequency 1.',
        'Then two circles: frequencies 1 and −1 (ellipse), 3 and −1 (clover), 3 and −2 (spirograph).',
        'The shapes are traversed following their formula.',
      ],
      images: { cercle: 'One circle', ellipse: 'Ellipse: 1 and −1', trefle: 'Clover: 3 and −1', spirographe: 'Spirograph: 3 and −2' },
      regarder: [
        'Each shape is drawn exactly: the energy kept is 100%.',
        'The number of leaves or points depends on the gap between the two frequencies.',
      ],
      pourquoi: [
        'Two vectors turning at frequencies $a$ and $b$ come back to the same relative position every $1/|a - b|$ of a turn: the shape has a symmetry of order $|a - b|$. The clover (3 and −1) has four leaves; the spirograph (3 and −2), five points. The ellipse (1 and −1) has two axes of symmetry.',
        'The semi-axes of the ellipse are the sum and the difference of the two radii.',
      ],
      realite: 'The Spirograph, a toy invented in the 1960s, rolls one toothed wheel inside another: exactly a sum of two circles. Lissajous curves and harmonographs are cousins.',
      ouvrir: ['ellipse', 'trefle', 'spirographe'],
    },
    mars: {
      question: 'Why does Mars seem to move backwards in the sky?',
      regles: [
        'Mars orbits the Sun in 687 days, at 1.524 times the Earth–Sun distance; the Earth in 365 days.',
        'Seen from the Earth, the position of Mars is the difference of the two.',
        'Over one turn of the curve: eight turns of Mars, fifteen of the Earth, about fifteen years.',
      ],
      images: { un: 'One circle: the deferent', deux: 'Two circles: deferent and epicycle' },
      regarder: [
        'With one circle, Mars turns steadily.',
        'With two, it makes seven loops: in each loop, it moves backwards for a while.',
      ],
      pourquoi: [
        'When the Earth, faster and closer to the Sun, overtakes Mars, Mars seems to move backwards, like a car being overtaken on the motorway. In fifteen years, the Earth overtakes Mars seven times (15 − 8 = 7).',
        'The first circle (the orbit of Mars) carries 70% of the energy, the second (the Earth’s orbit, seen in reverse) the remaining 30%. Two circles draw the path exactly.',
      ],
      realite: 'This is Ptolemy’s system of deferent and epicycle (see *History*). Real orbits being ellipses, Ptolemy had to add adjustments; with enough circles, he could have followed them as closely as desired.',
    },
    coeur: {
      question: 'How many circles to draw a heart?',
      regles: [
        'The heart of the formula $x = 16\\sin^3 t$, $y = 13\\cos t - 5\\cos 2t - 2\\cos 3t - \\cos 4t$.',
        'Three images following its formula, with 2, 4 and 8 circles ordered by size.',
        'The last one at constant speed, with 8 circles.',
      ],
      images: { m2: 'Formula: 2 circles', m4: 'Formula: 4 circles', m8: 'Formula: 8 circles', v8: 'Constant speed: 8 circles' },
      regarder: [
        'Following its formula, 8 circles draw the heart exactly.',
        'At constant speed, 8 circles round off the top and bottom points.',
      ],
      pourquoi: [
        'The formula contains only sines and cosines of frequencies 1 to 4: in complex numbers, at most 8 turning vectors. It is a *trigonometric polynomial*: finitely many circles are enough.',
        'At constant speed, one has to turn abruptly at the points: they are corners, and a corner requires infinitely many circles whose radii decrease like $1/k^2$. With 8 circles, 4% error remains, and still 0.5% with 30.',
      ],
      realite: 'The same shape, two parametrisations, two very different spectra: the regularity that counts is that of the motion, not of the drawing. The formula passes the cusp by stopping (its speed vanishes).',
      ouvrir: ['coeur'],
    },
    infini: {
      question: 'How many circles for a perfectly smooth curve?',
      regles: [
        'Bernoulli’s lemniscate, shaped like ∞, following its formula.',
        'Circles added by frequency: 2, 4, then 6.',
      ],
      images: { m2: '2 circles', m4: '4 circles', m6: '6 circles' },
      regarder: [
        'With 2 circles: a mere segment.',
        'With 4: already a figure eight; with 6, the ∞ (99.5% of the energy).',
      ],
      pourquoi: [
        'The first two circles, with frequencies 1 and −1, have the same radius: they turn in opposite directions, their vertical motions cancel out, and what remains is a horizontal back-and-forth. The circles of frequencies 2 and −2 add the rise and fall of the two loops.',
        'The lemniscate is *analytic*: with no corner or cusp, it can be expanded as a power series. Its coefficients then decrease faster than any power of $k$, like $e^{-a|k|}$: each new circle is a fixed fraction of the previous one.',
      ],
      realite: 'Smooth curves are cheap, corners expensive. That is why compression formats keep soft gradients easily, and struggle with sharp edges.',
    },
    carre: {
      question: 'Why are corners expensive?',
      regles: [
        'A square, traversed at constant speed.',
        'Circles added by frequency: 2, 8, then 40.',
      ],
      images: { m2: '2 circles', m8: '8 circles', m40: '40 circles' },
      regarder: [
        'With 2 circles: a plain circle; the circle of frequency −1 is zero.',
        'The corners sharpen slowly; even with 40 circles, they stay rounded.',
        'In the spectrum, only one frequency in four is used.',
      ],
      pourquoi: [
        'At each corner, the direction of the velocity jumps: the coefficients decrease like $1/k^2$ (measured slope: −1.9). To divide the error by 10, about 10 times more circles are needed.',
        'The square maps onto itself after a quarter turn: only the frequencies $1, -3, 5, -7\\dots$ are non-zero. By frequency, 22 circles are needed for 99.99% of the energy; by size, 6, because the zero circles are skipped.',
      ],
      realite: 'No Gibbs phenomenon here: the curve is continuous, only its direction jumps. The corners are rounded, never overshot.',
    },
    etoile: {
      question: 'What does a star’s symmetry teach us?',
      regles: [
        'A five-pointed star, traversed at constant speed.',
        'Circles ordered by size: 1, 3, then 12.',
      ],
      images: { m1: '1 circle', m3: '3 circles', m12: '12 circles' },
      regarder: [
        'With 3 circles, the star is recognisable (99.9% of the energy).',
        'In the spectrum: only the frequencies 1, −4, 6, −9, 11… are non-zero.',
      ],
      pourquoi: [
        'Rotating the star by a fifth of a turn leaves it unchanged. On the coefficients, this forces $c_k = 0$ unless $k - 1$ is a multiple of 5. The three useful circles are the frequencies 1, −4 and 6: the overall shape, then the five points.',
      ],
      realite: 'This rule takes two lines to prove (see *Theory*). It explains why snowflakes, flowers and gears have such sparse spectra.',
    },
    avion: {
      question: 'How many circles to recognise an aeroplane?',
      regles: [
        'The outline of an airliner seen from above, a polygon with 23 vertices, traversed at constant speed.',
        'Circles ordered by size: 5, 15, then 30.',
      ],
      images: { m5: '5 circles', m15: '15 circles', m30: '30 circles' },
      regarder: [
        'With 5 circles: a soft cross.',
        'With 15: the wings and the tail are recognisable.',
        'With 30: the aeroplane, except for the corners.',
      ],
      pourquoi: [
        'Ordered by size, 13 circles keep 99% of the energy and 29 keep 99.9%; by frequency, 17 and 40 are needed. Out of 2,048 coefficients, 30 are enough for a recognisable shape: a compression of nearly 70 times.',
      ],
      realite: 'This is the principle of JPEG and MP3: transform, keep the large coefficients, forget the others (see *Applications*).',
    },
    koch: {
      question: 'What happens when there are corners at every scale?',
      regles: [
        'The Koch snowflake after four steps: each side is replaced by four sides three times shorter, four times in a row (768 sides).',
        'Circles ordered by size: 10, 50, then 400.',
      ],
      images: { m10: '10 circles', m50: '50 circles', m400: '400 circles' },
      regarder: [
        'With 10 circles: a bumpy triangle.',
        'Each step up in circles brings out a new level of points.',
      ],
      pourquoi: [
        'The complete snowflake is continuous but has no tangent anywhere. Its coefficients decrease slowly: measured mean slope −1.3. Along the frequencies −1, −4, −16, −64, the radius is divided by roughly 4 at each step: each level of details three times smaller requires four times more circles.',
        'The snowflake maps onto itself after a third of a turn, and it is traversed the other way round from the square and the star: only the frequencies −1, 2, −4, 5… are used.',
      ],
      realite: 'Helge von Koch published this curve in 1904, as an example of a continuous curve without tangents. Its perimeter is infinite, its area finite. See also the lab’s *Fractals* project.',
    },
    spirale: {
      question: 'What happens when the curve does not close?',
      regles: [
        'A spiral of two and a half turns, whose end does not meet its start.',
        'The circles are added by frequency: 30, then 200.',
        'The last image adds Fejér smoothing.',
      ],
      images: { m30: '30 circles', m200: '200 circles', fejer: '200 circles, Fejér smoothing' },
      regarder: [
        'The series joins the end to the start with a straight line… which overshoots at both ends, then oscillates.',
        'With 200 circles, the oscillations are tighter, but the overshoot has not decreased.',
        'With Fejér, no more overshoot, but a softer spiral.',
      ],
      pourquoi: [
        'For the series, the curve is periodic: it must jump from the end to the start. Near a jump, the partial sum overshoots by about 9% of the gap, whatever the number of circles: this is the *Gibbs phenomenon*. We measure 9.4% of the gap with 30 circles and 8.9% with 200.',
        'Fejér smoothing weights the fast circles towards zero; the sum becomes a genuine local average, which cannot overshoot.',
      ],
      realite: 'These oscillations can be seen around the sharp edges of over-compressed JPEG images, and in MRI images: it is the same phenomenon.',
    },
  },
}

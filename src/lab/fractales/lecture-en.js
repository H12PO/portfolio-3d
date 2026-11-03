// ============================================================
//  ARTICLES IN ENGLISH: Understand, Theory, Applications, Computation,
//  History and references, and the figure texts
//  Same structure as lecture-fr.js.
// ============================================================

const tex = String.raw

export const LECTURE_EN = {
  comprendre: [
    {
      id: 'formule', titre: 'One formula, repeated', blocs: [
        { p: 'Take a point c of the plane, seen as a complex number. Start from z = 0 and repeat the same operation forever: square z, then add c. Squaring a complex number doubles its angle and squares its distance to 0; adding c shifts it. Two things can happen: either the values of z stay in a bounded region, or they fly off to infinity.' },
        { p: 'The Mandelbrot set gathers the points c of the first kind. Click or drag on the map to choose c, and follow its *orbit*, the sequence z₀, z₁, z₂…:' },
        { figure: 'orbite' },
        { p: 'Only one thing needs watching: as soon as $|z|$ goes beyond 2, the sequence heads to infinity, and this is proven. To draw the set, the computation is repeated for every pixel, counting the steps before going beyond 2. Points that never do, within the chosen number of steps, are painted black.' },
      ],
    },
    {
      id: 'couleurs', titre: 'Where the colours come from', blocs: [
        { p: 'Black is the only colour with a mathematical meaning: it marks the set itself. Everything else is a choice. The colour of an outside point tells how many steps it needed to go beyond 2: few at the edge of the image, many close to the set.' },
        { figure: 'couleurs' },
        { p: 'Counting steps gives bands. For a continuous gradient, the count is corrected according to how fast $|z|$ crossed the limit. The explorer goes further: the derivative of the sequence lights the image like a relief, and an estimate of the distance to the border brings out filaments too thin for a pixel.' },
      ],
    },
    {
      id: 'julia', titre: 'Mandelbrot, the map of Julia sets', blocs: [
        { p: 'Keep the formula, but swap the roles. Fix c once and for all, and vary the starting point z₀: the starting points whose orbit stays bounded form the *Julia set* of c. Every point c has its own.' },
        { figure: 'julias' },
        { p: 'The Mandelbrot set works as a map: when c is inside, the Julia set is in one piece; when c is outside, it breaks into dust. In the explorer, hover over the set: the Julia set of the point under the pointer appears bottom right, and a click opens it full size.' },
      ],
    },
    {
      id: 'autres', titre: 'Other formulas', blocs: [
        { p: 'Almost anything in the formula can be changed, and each change gives another world. Here are six more; the first five open in the explorer, and the Theory tab explains them one by one:' },
        { figure: 'galerie' },
      ],
    },
    {
      id: 'plongee', titre: 'Diving in', blocs: [
        { p: 'The Mandelbrot set has no bottom. Everywhere on its border, zooming in reveals new spirals, new filaments, and shrunken copies of the whole set: the mini-Mandelbrots. The guided tour goes down to a zoom of 2.5 billion.' },
        { visite: 'Take the guided tour', aide: 'It opens in the explorer; “Continue” moves to the next step.' },
        { p: 'Why stop there? Because a computer’s numbers only have a finite number of digits. The explorer goes down to a zoom of a million million, $10^{12}$; the Computation tab tells how, and what it would take to go further.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'fractale', titre: 'What is a fractal?', blocs: [
        { p: 'The figures of classical geometry, lines, circles, polygons, become simple when looked at closely: a small piece of a circle looks like a segment. A fractal does the opposite. At whatever scale you look at it, it stays just as jagged, and often a piece looks like the whole. This is called *self-similarity*.' },
        { p: 'There is no single definition. Benoît Mandelbrot coined the word in 1975, from the Latin *fractus*, “broken”. In 1977 he proposed a precise definition: a fractal is a set whose Hausdorff dimension exceeds its topological dimension. He later found it too narrow himself. In practice, a fractal is recognised by three traits: detail at every scale, a shape too irregular for classical geometry, and a dimension that is often not a whole number.' },
        { p: 'The first examples are much older than the word. At the end of the nineteenth century, mathematicians built objects to defeat intuition: a continuous curve with a tangent nowhere (Karl Weierstrass, 1872), a dust of points as numerous as those of the whole line (Georg Cantor, 1883), a curve that fills an entire square (Giuseppe Peano, 1890). Charles Hermite wrote in 1893 that he turned away “with fright and horror from this lamentable plague of continuous functions which do not have derivatives”. Three of these “monsters” are built by repeating a single step:' },
        { figure: 'construction' },
        { p: 'At each step of the Koch snowflake (Helge von Koch, 1904), every segment is replaced by four segments a third as long: the length is multiplied by 4/3. After infinitely many steps the perimeter is infinite, yet the snowflake fits inside a disc. The Sierpiński triangle (Wacław Sierpiński, 1915) loses a quarter of its area at each step: it ends with zero area, without being a mere line. The Cantor set has zero length, but uncountably many points. Neither length nor area is the right way to measure these objects. Another notion is needed.' },
      ],
    },
    {
      id: 'dimension', titre: 'Measuring the irregular: dimension', blocs: [
        { p: 'Cut a segment into pieces three times smaller: you get 3. A square gives 9 small squares, a cube 27 small cubes. Dividing lengths by k gives $k^D$ copies, and the exponent D is the dimension: 1, 2 or 3. The Koch snowflake splits into 4 copies shrunk by a factor of 3. So we would need $3^D = 4$, that is' },
        { tex: tex`D = \frac{\log 4}{\log 3} \approx 1.262.` },
        { p: 'More than a line, less than a surface. The same rule gives $\\log 2/\\log 3 \\approx 0.631$ for the Cantor set and $\\log 3/\\log 2 \\approx 1.585$ for the Sierpiński triangle. This number measures how the shape fills space as you look at it more closely.' },
        { p: 'Shapes that are not made of exact copies, such as a coastline or a Julia set, are measured by counting boxes. Lay a grid of side ε over the shape and count the cells it touches, N(ε). If $N(\\varepsilon) \\approx C\\,\\varepsilon^{-D}$, the points $(\\log 1/\\varepsilon,\\, \\log N)$ line up on a straight line of slope D. Try it:' },
        { figure: 'boites' },
        { p: 'The computation recovers the exact values to within a few hundredths; the gap comes from the raster, which cannot go below the size of one dot. For the boundary of the rabbit Julia set, no simple formula gives the dimension: only computation estimates it.' },
        {
          expert: 'the Hausdorff dimension', blocs: [
            { p: 'Box counting has a flaw: a countable set, one that can be listed as a simple sequence of points, comes out with dimension 1 if it is present everywhere, like the rational numbers between 0 and 1. Felix Hausdorff proposed a finer definition in 1918. Cover the set E with pieces $U_i$ of all sizes, of diameter at most δ, and set' },
            { tex: tex`\mathcal{H}^s(E) = \lim_{\delta \to 0} \, \inf \Big\{ \sum_i (\operatorname{diam} U_i)^s \Big\}.` },
            { p: 'As s increases, this quantity jumps abruptly from infinity to zero. The threshold is the Hausdorff dimension. It is 0 for any countable set, the rationals included, and never exceeds the box dimension. For a figure made of N copies of itself shrunk by a factor k, which do not overlap too much, the two dimensions agree and equal $\\log N / \\log k$ (Patrick Moran, 1946).' },
          ],
        },
      ],
    },
    {
      id: 'ifs', titre: 'Shapes made of their own copies', blocs: [
        { p: 'The Sierpiński triangle is made of three copies of itself, half the size. Let us turn this around. Take three transformations of the plane: each one halves everything and pushes it towards one of the corners. Is there a shape that is exactly the union of its three images? John Hutchinson proved in 1981 that there is, and that it is unique: for any family of contracting transformations $f_1, \\dots, f_k$, there is exactly one compact set A such that' },
        { tex: tex`A = f_1(A) \cup f_2(A) \cup \dots \cup f_k(A).` },
        { p: 'A is called the *attractor* of this iterated function system. Michael Barnsley turned it into a drawing tool: four affine transformations are enough for a fern. To watch the attractor appear, it is enough to play at random. Start from any point, apply one of the transformations drawn by lot, then repeat, marking each point obtained. This is the *chaos game*:' },
        { figure: 'chaos' },
        { p: 'The very first points land anywhere; very quickly they no longer leave the attractor, which draws itself. The probabilities change how fast each part fills in, not the final shape.' },
        {
          expert: 'why there is only one attractor', blocs: [
            { p: 'The gap between two compact shapes A and B is measured by the *Hausdorff distance*: the smallest r such that each lies within the neighbourhood of radius r of the other. With this distance, the set of compact shapes of the plane is a complete space.' },
            { p: 'If each $f_i$ brings points closer by a factor of at least $r < 1$, the operator $W(A) = f_1(A) \\cup \\dots \\cup f_k(A)$ brings shapes closer by the same factor: $d(W(A), W(B)) \\le r\\, d(A, B)$. Banach’s fixed-point theorem does the rest. W has a unique fixed point, and iterating W from any shape converges to it. The chaos game is a random version of this iteration.' },
            { p: 'In the mid-1980s Barnsley derived from it the *collage theorem*: if the images of a shape under the $f_i$ cover it almost exactly, the attractor looks like it. This is the starting point of fractal image compression (Applications tab).' },
          ],
        },
      ],
    },
    {
      id: 'iterer', titre: 'Iterating a formula', blocs: [
        { p: 'The Mandelbrot set is not made of exact copies of itself, and no family of transformations builds it. It comes from another mechanism: repeating a function and watching what becomes of each point. This is the subject of *dynamics*.' },
        { p: 'Start from a function f and a point $z_0$. Its *orbit* is the sequence $z_1 = f(z_0)$, $z_2 = f(z_1)$, and so on. A *fixed point* $z^*$ satisfies $f(z^*) = z^*$. Near it, the distance to $z^*$ is multiplied at each step by about $|f\'(z^*)|$: the fixed point *attracts* nearby points if this number is less than 1, and *repels* them if it is greater than 1.' },
        { p: 'Take $f(z) = z^2$ in the complex plane. Squaring doubles the angle and squares the distance to 0. Points inside the circle of radius 1 fall towards 0, those outside fly off to infinity, and those on the circle go round it without ever leaving. The border between the two fates is a circle: nothing fractal. Now add a constant, $f_c(z) = z^2 + c$. As soon as c is not zero, the border starts to wave, to fold back on itself, and becomes fractal. It is the Julia set of c. The Mandelbrot set arranges all these sets on a single map. The following sections prove its first properties.' },
      ],
    },
    {
      id: 'echappement', titre: 'Why 2 is enough', blocs: [
        { p: 'To draw the Mandelbrot set, one must decide for each point c whether the orbit of 0 stays bounded. Write $f_c(z) = z^2 + c$, and $z_{n+1} = f_c(z_n)$ with $z_0 = 0$. The Mandelbrot set is' },
        { tex: tex`M = \big\{\, c \in \mathbb{C} \;:\; \text{the sequence } (z_n) \text{ is bounded} \,\big\}.` },
        { p: 'Computing infinitely many steps is impossible. Fortunately, there is a point of no return: as soon as $|z_n| > 2$, the sequence escapes to infinity.' },
        {
          expert: 'the proof, in three lines', blocs: [
            { p: 'Assume $|z| > 2$ and $|z| \\ge |c|$. By the triangle inequality,' },
            { tex: tex`|z^2 + c| \;\ge\; |z|^2 - |c| \;\ge\; |z|^2 - |z| \;=\; |z|\,(|z| - 1).` },
            { p: 'Write $|z| - 1 = 1 + \\varepsilon$ with $\\varepsilon > 0$: the next modulus exceeds $|z|\\,(1 + \\varepsilon)$, so it stays larger than 2 and than $|c|$, and the argument repeats. At each step, the modulus is multiplied by at least $1 + \\varepsilon$: the sequence heads to infinity.' },
            { p: 'It remains to see that both conditions eventually hold. If $|c| \\le 2$, as soon as $|z_n| > 2$ we also have $|z_n| > |c|$. If $|c| > 2$, this is true from $z_1 = c$ on. Hence' },
            { tex: tex`c \in M \iff |z_n| \le 2 \ \text{for all } n, \qquad M \subset \{\, |c| \le 2 \,\}.` },
          ],
        },
        { p: 'This test only works one way. A point that has not gone beyond 2 after a thousand steps may do so at step one thousand and one: the black in the images is always an approximation, better with more iterations. This is why the explorer does more of them as you zoom in.' },
      ],
    },
    {
      id: 'julia', titre: 'Julia: in one piece, or as dust', blocs: [
        { p: 'For a fixed c, the *filled Julia set* $K_c$ gathers the starting points whose orbit stays bounded; its border is the Julia set $J_c$. Gaston Julia and Pierre Fatou laid its foundations in the late 1910s, without a single picture. They proved a surprising result: everything depends on the orbit of a single point, 0.' },
        { p: '*Theorem* (Fatou, Julia). If the orbit of 0 stays bounded, that is if $c \\in M$, then $K_c$ is connected. Otherwise, $K_c$ is a Cantor set: a dust of points, without a single piece in one part.' },
        { figure: 'dichotomie' },
        { p: 'This is why the Mandelbrot set is the map of Julia sets. The link goes further: at some points of its border, the Misiurewicz points, the Mandelbrot set looks more and more like the Julia set of the same point as you zoom in (Tan Lei, 1990).' },
        {
          expert: 'why the point 0 decides everything', blocs: [
            { p: '0 is the only critical point of $f_c$, the only point where the derivative $f_c\'(z) = 2z$ vanishes. Fatou showed that every attracting cycle attracts the orbit of a critical point. There is only one here: $f_c$ has at most one attracting cycle, and the orbit of 0 finds it.' },
            { p: 'For connectedness, look at $K_c$ from afar. Far from the origin, $f_c$ looks like $z \\mapsto z^2$, and the height of a point is measured by the potential' },
            { tex: tex`G_c(z) = \lim_{n \to \infty} \frac{\log |f_c^{\,n}(z)|}{2^n},` },
            { p: 'which is zero exactly on $K_c$. Its level curves are closed curves around $K_c$. Going down towards $K_c$, they stay in one piece as long as they do not pass through a critical point. If the orbit of 0 escapes, one of them passes through 0 and pinches into a figure eight: $K_c$ splits in two, then each half in two, forever. Only dust is left.' },
            { p: 'The explorer’s smooth colouring is an approximation of this potential.' },
          ],
        },
      ],
    },
    {
      id: 'bulbes', titre: 'The numbers hidden in the shape', blocs: [
        { p: 'The large heart shape is the *main cardioid*: for these c, the orbit of 0 settles on a fixed point. The disc to its left, centred at −1 with radius 1/4, gathers the c for which the orbit cycles through 2 points. Each bulb attached to the cardioid has its period, and it can be read from its shape: it is the number of branches of the antenna on top of it. Hover over the map:' },
        { figure: 'bulbes' },
        { p: 'The bulbs are arranged around the cardioid by an arithmetic rule. Between the period-2 bulb and the period-3 bulb, the largest one has period 5; between those of period 3 and 5, period 8; then come 13, 21… This is the Fibonacci sequence, because each bulb carries a fraction $p/q$ and, between $p/q$ and $r/s$, the largest bulb carries the fraction $(p + r)/(q + s)$: this is *Farey addition*.' },
        {
          expert: 'the cardioid, in one line', blocs: [
            { p: 'A fixed point $z^*$ of $f_c$ satisfies $z^{*2} + c = z^*$, and it attracts nearby orbits when $|f_c\'(z^*)| = |2z^*| < 1$. Write $\\mu = 2z^*$ for this multiplier. Then $z^* = \\mu/2$ and' },
            { tex: tex`c = \frac{\mu}{2} - \frac{\mu^2}{4}, \qquad |\mu| < 1.` },
            { p: 'As $\\mu$ runs through the unit disc, c sweeps the inside of the cardioid. For $\\mu = e^{2i\\pi p/q}$, on the border, we find the point where the $p/q$ bulb, of period $q$, is attached. Likewise, the two points of a period-2 cycle have product $z_1 z_2 = c + 1$; the cycle attracts when $|f_c\'(z_1) f_c\'(z_2)| = |4(c + 1)| < 1$, that is $|c + 1| < 1/4$: the left disc.' },
          ],
        },
        { p: 'And π? In the early 1990s, David Boll tried to check that the neck joining the cardioid to the left disc, at $c = -3/4$, has zero thickness. He counted the iterations needed to escape from $c = -3/4 + i\\varepsilon$, just above the neck, and found that this number, multiplied by ε, tends to π. The computation runs here:' },
        { figure: 'pi' },
        { p: 'The same thing happens at the cusp of the cardioid, at $c = 1/4 + \\varepsilon$, this time with $N\\sqrt{\\varepsilon}$. Aaron Klebanoff published a proof in 2001.' },
      ],
    },
    {
      id: 'chaos', titre: 'The road to chaos', blocs: [
        { p: 'Stay on the real axis. For c between −2 and 1/4, the orbit of 0 stays bounded, but it does not always behave the same way. Between −3/4 and 1/4, it settles on a fixed point. From −3/4 to −5/4, it oscillates between 2 values, then between 4, then 8: the doublings come closer and closer, and around $c \\approx -1.401\\,155$ chaos begins.' },
        { figure: 'bifurcation' },
        { p: 'This diagram is famous: it is the one of the logistic map $x_{n+1} = r\\,x_n(1 - x_n)$, the simplest model of a population that grows, then saturates. The change of variable $z = r\\,(1/2 - x)$ turns one into the other, with $c = r/2 - r^2/4$: the real axis of the Mandelbrot set *is* the bifurcation diagram.' },
        { p: 'The doublings come closer in an almost geometric progression. The ratio of two successive gaps tends to a constant discovered by Mitchell Feigenbaum in 1975:' },
        { tex: tex`\delta = \lim_{k \to \infty} \frac{c_{k} - c_{k-1}}{c_{k+1} - c_{k}} = 4.669\,201\ldots` },
        { p: 'Feigenbaum showed that it does not depend on the formula: every family whose graph has a single rounded hump goes to chaos with the same constant. In 1982, Oscar Lanford proved it with the help of a computer.' },
        {
          expert: 'why the cycle doubles', blocs: [
            { p: 'An attracting fixed point becomes unstable when its multiplier crosses −1. On the real axis, the attracting fixed point of $f_c$ is $z^* = (1 - \\sqrt{1 - 4c})/2$, with multiplier $\\mu = 1 - \\sqrt{1 - 4c}$, which equals −1 at $c = -3/4$. At that moment, $f_c \\circ f_c$ gains two new fixed points: a cycle of period 2.' },
            { p: 'The same scenario repeats for $f_c^{\\,2}$, then $f_c^{\\,4}$, and so on. Each doubling is a copy of the previous one, shrunk by about 4.669 in width and about 2.503 in height: this is the idea of *renormalisation*, which explains why the constant is universal.' },
          ],
        },
      ],
    },
    {
      id: 'variantes', titre: 'Burning Ship, Tricorn, Multibrot: changing the formula', blocs: [
        { p: 'The explorer’s first three variants keep the same principle, a sequence starting from 0 and an escape test, and change a single detail of the formula. That detail is enough to change what can be proved.' },
        { figure: 'vignettes', ids: ['burning', 'tricorn', 'multibrot'] },
        { p: '*The Burning Ship* (Michael Michelitsch and Otto Rössler, 1992) makes both parts of z positive before squaring: $z_{n+1} = (|x_n| + i\\,|y_n|)^2 + c$. The absolute value folds the plane onto one quarter before each step. The formula is no longer *holomorphic*: it can no longer be differentiated as a function of the complex variable. Yet the theorems of Fatou and Julia, the connectedness proved by Douady and Hubbard, all rest on that property. Almost nothing can be proved about the Burning Ship. It owes its name to the burning ship that appears on its antenna, on the left.' },
        { p: '*The Tricorn* replaces z by its conjugate: $z_{n+1} = \\bar z_n^{\\,2} + c$. The formula is *antiholomorphic*, but two steps in a row give back a holomorphic function of z, so part of the theory survives: Shizuo Nakane proved in 1993 that the set is connected. The symmetry changes. Multiplying c by $\\omega = e^{2i\\pi/3}$ multiplies the whole orbit of 0 by ω, hence the three points. John Milnor, who named it in 1992, found copies of it in families of degree-3 polynomials. And John Hubbard and Dierk Schleicher showed in 2014 that it is not *path-connected*: although it is in one piece, it contains points that no path drawn inside the set can join.' },
        { p: '*The Multibrots* change the power: $z_{n+1} = z_n^d + c$. For a whole number d, almost all the theory carries over. The set is connected, and the orbit of 0 still decides everything, because 0 remains the only critical point. Replacing c by $e^{2i\\pi/(d-1)} c$ rotates the whole orbit by the same angle: hence $d - 1$ axes of symmetry. As d grows, the set rounds out and approaches the disc of radius 1. For a non-integer degree, the power of a complex number no longer has a single value: a cut must be chosen, and the image splits along that cut.' },
      ],
    },
    {
      id: 'newton', titre: 'Newton: in search of roots', blocs: [
        { p: 'To solve an equation $p(z) = 0$, Newton’s method starts from a guess and improves it by following the tangent:' },
        { tex: tex`z_{n+1} = z_n - \frac{p(z_n)}{p'(z_n)}.` },
        { p: 'Close to a root the method is formidable: the number of correct digits doubles at each step. But starting from far away, where do you end up? In 1879, Arthur Cayley asked the question in the complex plane. For a polynomial with two roots the answer is simple: each starting point goes to the nearest root, and the border between the two is a straight line. For three roots, Cayley admitted he did not know.' },
        { figure: 'vignettes', ids: ['newton', 'newtonZoom', 'cycle'] },
        { p: 'The image shows why. The explorer colours each starting point by the root it reaches. The three basins are not separated by lines: wherever two colours meet, the third slips in between, then the other two again, at every scale. This is a theorem of complex dynamics: the boundary of each basin is the Julia set of the function $z \\mapsto z - p(z)/p\'(z)$, the same for all three. Every point on the edge of one basin is therefore on the edge of all three at once.' },
        { p: 'It gets worse. For $p(z) = z^3 - 2z + 2$, the method started at 0 goes to 1, then back to 0, forever, and a whole neighbourhood of this cycle converges to no root at all: these are the black areas of the third image. Curtis McMullen showed in 1987 that no method of this kind, a fixed formula repeated, finds a root from almost every starting point for all polynomials of degree 4 or more. There is a way out all the same: in 2001 John Hubbard, Dierk Schleicher and Scott Sutherland gave an explicit list of starting points, about $1.1\\, d \\log^2 d$ for degree d, that are sure to find all the roots.' },
        {
          expert: 'why the correct digits double', blocs: [
            { p: 'Write $N(z) = z - p(z)/p\'(z)$, and let r be a simple root. Then $N(r) = r$ and $N\'(z) = p(z)\\,p\'\'(z)/p\'(z)^2$, so $N\'(r) = 0$: the root is a *superattracting* fixed point. Expanding near r,' },
            { tex: tex`N(z) - r \approx \frac{p''(r)}{2\,p'(r)}\,(z - r)^2.` },
            { p: 'The error is squared at each step: $10^{-3}$ becomes $10^{-6}$, then $10^{-12}$. The explorer’s “relaxation” setting replaces the step by $z - a\\,p(z)/p\'(z)$. For $a \\ne 1$, the root is no longer superattracting, convergence slows down and the borders change their look.' },
          ],
        },
      ],
    },
    {
      id: 'lyapunov', titre: 'Lyapunov: order and chaos on a map', blocs: [
        { p: 'The logistic map $x_{n+1} = r\\,x_n(1 - x_n)$, already met on the road to chaos, describes a population that grows at rate r and then saturates. Depending on r, it settles, oscillates or becomes chaotic. Mario Markus, who studied populations in a changing environment in the late 1980s, made the rate alternate between two values a and b following a fixed sequence, such as AB or AABAB. Each point (a, b) of the square $[0, 4]^2$ gets a colour, depending on whether the resulting sequence is orderly or chaotic.' },
        { figure: 'vignettes', ids: ['lyapunov', 'lyapunovB'] },
        { p: 'To decide, one measures the *Lyapunov exponent*, the average rate at which two almost identical populations drift apart:' },
        { tex: tex`\lambda = \lim_{N \to \infty} \frac{1}{N} \sum_{n=1}^{N} \log \big| r_n \,(1 - 2x_n) \big|.` },
        { p: 'If λ is negative, gaps die out and the sequence ends up repeating itself: the explorer colours these points. If it is positive, the slightest difference grows like $e^{\\lambda n}$: this is chaos, in black. On the diagonal a = b the rate no longer changes, and the ordinary logistic map returns, with its bifurcation diagram. The second image uses the sequence BBBBBBAAAAAA.' },
        {
          expert: 'where the formula comes from', blocs: [
            { p: 'Two nearby starts $x_0$ and $x_0 + \\varepsilon$ are, after n steps, about $\\varepsilon\\,|(f^n)\'(x_0)|$ apart. The derivative of a composition is the product of the derivatives: $(f^n)\'(x_0) = f\'(x_0)\\, f\'(x_1) \\cdots f\'(x_{n-1})$. For $f(x) = r\\,x(1 - x)$, $f\'(x) = r\\,(1 - 2x)$. The logarithm turns the product into a sum, and averaging per step gives λ. The name comes from Aleksandr Lyapunov, who studied the stability of motion in 1892.' },
          ],
        },
      ],
    },
    {
      id: 'bouddha', titre: 'The Buddhabrot: where orbits go', blocs: [
        { p: 'The previous images colour starting points. The Buddhabrot, described by Melinda Green in 1993, shows something else: paths. Millions of points c are drawn at random. For each c whose orbit of 0 escapes, the whole orbit $z_1, z_2, \\dots$ is replayed and 1 is added to every pixel it crosses. The image is a density map. It shows where the orbits that end up escaping pass, in the plane of z rather than that of c.' },
        { figure: 'vignettes', ids: ['buddha', 'nebula'] },
        { p: 'Turned a quarter turn, it suggests a seated Buddha. The *Nebulabrot* variant redoes the count with three iteration limits, here 2,000, 200 and 20, and puts them in red, green and blue, like false-colour images of nebulae. Long orbits come from points c very close to the edge of the Mandelbrot set, and draw the finest details.' },
        { p: 'It is also the most expensive of these images. A clean image takes millions of orbits, and as soon as you zoom in, most orbits drawn at random do not even cross the view. Computed live, it slowed the whole computer down, so it is not in the explorer. The Computation tab explains why it costs so much.' },
      ],
    },
    {
      id: 'inconnu', titre: 'What is known, and what is not', blocs: [
        { p: 'Despite its world-famous images, the Mandelbrot set is still an object of active research. In the early 1980s, Adrien Douady and John Hubbard proved that it is connected: all in one piece, even where its parts seem apart. In 1991, Mitsuhiro Shishikura showed that its boundary is as thick as a curve can be: its Hausdorff dimension is 2, like that of a surface.' },
        { p: 'The great open question is the *MLC* conjecture: is the set *locally connected*? In other words, can two nearby points of the set always be joined by a path that stays in the set and close to them? If so, Douady and Hubbard showed that its whole shape is described by explicit combinatorics, and *density of hyperbolicity* follows: every point c can be approached by points whose orbit of 0 falls onto an attracting cycle. Jean-Christophe Yoccoz proved MLC at every point that is not “infinitely renormalisable”, one of the works that earned him the Fields Medal in 1994. On the real axis, density of hyperbolicity was established in 1997, by Jacek Graczyk and Grzegorz Świątek on one side and by Mikhail Lyubich on the other. The general case still resists.' },
        { p: 'Other questions look simpler and are not. The area of the set is about 1.5066, according to ever finer pixel counts, but its exact value is unknown, and the proven bounds remain wide. Nobody knows whether its boundary, of dimension 2, has non-zero area. For Julia sets, the question was settled in 2012: Xavier Buff and Arnaud Chéritat built quadratic Julia sets with strictly positive area.' },
      ],
    },
  ],

  applications: [
    {
      id: 'nature', titre: 'The geometry of nature', blocs: [
        { p: 'In 1982, Benoît Mandelbrot opened *The Fractal Geometry of Nature* with an observation: clouds, mountains, coastlines or tree bark do not have the smooth shapes of Euclid’s geometry. For him, fractals were not mathematicians’ curiosities but the missing language for describing such shapes. The first example he studied, as early as 1967, was a coastline.' },
        { p: 'The English meteorologist Lewis Fry Richardson had wondered whether the length of the border between two countries affected their risk of going to war. Gathering the figures, he found that they did not agree: Spain gave 987 km for its border with Portugal, Portugal gave 1,214 km. The reason is geometric. A coast or a border is measured with a ruler; the shorter the ruler, the more detours it follows, and the longer the length. Measure this imaginary island:' },
        { figure: 'littoral' },
        { p: 'Richardson observed that the measured length follows a power law of the ruler size, with an exponent specific to each coast. In 1967 Mandelbrot read it as a fractal dimension: about 1.25 for the very jagged west coast of Britain, and 1.02 for the almost smooth coast of South Africa. The question “how long is this coast?” has no answer. The question “what is its dimension?” has one.' },
      ],
    },
    {
      id: 'vivant', titre: 'Living things: filling a volume with pipes', blocs: [
        { p: 'The human body is full of branching networks: bronchi, arteries, veins, nerves. In the lungs, the windpipe splits into two bronchi, which split in turn, about 23 times in a row, down to the alveoli. The resulting tree packs an exchange surface of several tens of square metres into the volume of the chest. Blood vessels follow the same logic: almost no cell is more than a few tenths of a millimetre from a capillary.' },
        { p: 'A fractal branching serves a whole volume with a network of limited length and volume. This is the argument Geoffrey West, James Brown and Brian Enquist put forward in 1997 to explain *Kleiber’s law*: in mammals, from the mouse to the elephant, resting energy use grows like body mass to the power 3/4. Their model is still debated, but it made fractal networks a central topic of theoretical biology.' },
        { p: 'Plants offer the most visible examples: the branches of a tree, the fronds of a fern, the spikes of Romanesco broccoli, which repeat the whole shape over five or six levels. In nature, self-similarity always stops at some scale, that of the cell or the leaf: a real fractal has only a finite number of storeys.' },
        { p: 'Medicine also uses it as a measure. A healthy heartbeat is not regular: its fluctuations look the same over a few seconds and over a few hours. Ary Goldberger’s team showed that this structure becomes poorer with age and with some heart diseases. The fractal dimension of the outline of a tumour, of the vessels of the retina or of the mesh of a bone is studied as an indicator; these measures remain mostly research tools.' },
      ],
    },
    {
      id: 'antennes', titre: 'Antennas in our pockets', blocs: [
        { p: 'In 1987, Nathan Cohen, a radio astronomer at Boston University and a radio amateur, attended a talk by Mandelbrot. Soon afterwards he cut a small antenna in the shape of a fractal curve out of aluminium foil, mounted it on the railing of his flat, and found that it worked as well as a much larger ordinary antenna. He filed a patent in 1995 and published his first results the same year.' },
        { p: 'Two properties make these antennas interesting. A fractal curve packs a long conductor into a small area, so the antenna is compact. And a shape that repeats at several scales resonates at several frequencies: the Sierpiński-triangle antenna of Carles Puente and colleagues (1996) works on several bands at once. A phone has to pick up mobile networks, wifi, Bluetooth and GPS at the same time. Antennas of this kind are found in phones, RFID tags and car radars.' },
      ],
    },
    {
      id: 'images', titre: 'Landscapes that do not exist', blocs: [
        { p: 'In 1980, Loren Carpenter, an engineer at Boeing, showed *Vol Libre* at the SIGGRAPH conference, a short film flying over mountains that were entirely computed. His method took up an idea of Mandelbrot’s. Start from a few large triangles, cut each side in two, move the midpoint at random, less so the shorter the side, and repeat. Lucasfilm hired him. Two years later his fractal mountains formed the planet of the Genesis sequence in *Star Trek II*, one of the first film scenes made entirely of computer graphics.' },
        { p: 'The decisive setting is how fast the displacements shrink from one scale to the next. It is written H, the *Hurst exponent*: each time the size is halved, the amplitude is multiplied by $2^{-H}$. A small H gives a spiky relief, a large H gentle hills, and the profile has dimension $2 - H$.' },
        { figure: 'relief' },
        { p: 'Ken Perlin, who had worked on the images of *Tron* (1982) and found them too smooth, invented the following year a “noise” that is random yet regular; it earned him a technical Oscar in 1997. Stacking this noise at several scales, each layer twice as fine and weaker than the previous one, gives a fractal relief. This recipe now produces the terrain of many video games, clouds, fire, and marble or wood textures.' },
      ],
    },
    {
      id: 'compression', titre: 'Compressing an image with its own copies', blocs: [
        { p: 'The collage theorem (Theory tab) suggests a bold idea: describe an image not by its pixels, but by a list of transformations of which it would roughly be the attractor. A few dozen numbers are enough for a whole fern. In 1987 Michael Barnsley founded the company Iterated Systems to exploit this idea.' },
        { p: 'A photograph is not the attractor of a small system of transformations. In 1992, Arnaud Jacquin, a former doctoral student of Barnsley’s, made the method practical: cut the image into small blocks, and for each one look for a larger block of the same image that, shrunk, lightened or flipped, resembles it. Decoding is fast, and the image can be enlarged at will: the invented details look like real ones. Microsoft’s Encarta encyclopedia used it for its pictures in the early 1990s.' },
        { p: 'Encoding, on the other hand, is very slow, since each block must be compared with all the others. JPEG, then wavelets, won the day. Fractal compression remains a fine example of an abstract theorem that became, for a while, a product.' },
      ],
    },
    {
      id: 'hasard', titre: 'Wild randomness: markets, networks and music', blocs: [
        { p: 'In 1963, Mandelbrot studied decades of cotton prices. The models of the time assumed that price changes follow a bell curve, where very large moves are extremely rare. The data said otherwise: crashes and surges are far more frequent than predicted, and a price chart looks the same whether you view a day, a month or a year. A series of numbers in time can be fractal too.' },
        { p: 'He called this behaviour “wild randomness”, and later proposed *multifractal* models of markets, long ignored by finance textbooks. The crashes of 1987 and 2008 gave him a new audience, without these models replacing the usual tools.' },
        { p: 'The same finding appeared in computer networks. In 1994, Will Leland and colleagues analysed millions of packets travelling over an Ethernet network. Traffic arrives in bursts, and these bursts cluster in turn into bursts, from milliseconds to hours. Classical models, which predicted traffic smoothing out at large scales, underestimated the peaks: network sizing had to be rethought.' },
        { p: 'And in music. In 1975, Richard Voss and John Clarke measured the fluctuations of loudness and pitch in recordings of classical music, jazz and rock. They follow a *1/f noise*, self-similar as well, halfway between pure chance and repetition. Melodies drawn at random from this noise sound more musical to listeners than melodies drawn purely at random.' },
      ],
    },
    {
      id: 'physique', titre: 'Growth and disorder', blocs: [
        { p: 'A particle wandering at random ends up hitting a cluster and sticks to it; another follows, then another. In 1981, Thomas Witten and Leonard Sander showed that this rule, *diffusion-limited aggregation*, grows branching trees with a dimension close to 1.71. The most advanced branches catch almost all the particles, and the hollows never fill in:' },
        { figure: 'agregation' },
        { p: 'These shapes appear in metal deposits grown by electrolysis, in the manganese oxide dendrites that cover some rocks and are sometimes mistaken for fossils, or in the Lichtenberg figures that an electrical discharge burns into an insulator. Lightning branches through a related mechanism.' },
        { p: 'In statistical physics, fractals appear at *critical points*, when a system hesitates between two states. Fill a grid at random: right at the threshold where a path of filled cells crosses the grid from one edge to the other, the cluster carrying it is a fractal of dimension 91/48, about 1.896, a value known exactly. Turbulence, finally, carries energy from large eddies to small ones through a cascade with no preferred scale. Richardson summed it up in 1922 with a rhyme: “Big whirls have little whirls that feed on their velocity, and little whirls have lesser whirls and so on to viscosity.”' },
      ],
    },
    {
      id: 'art', titre: 'In art', blocs: [
        { p: 'In 1999, the physicist Richard Taylor claimed in *Nature* that Jackson Pollock’s drip paintings have a fractal structure, and that their dimension increases over his career. He even proposed using it to authenticate paintings. In 2006, Katherine Jones-Smith and Harsh Mathur challenged the method in the same journal: drawings with no connection to Pollock passed the test. Above all, the debate showed how fragile a dimension measured over only a few scales is.' },
        { p: 'The researcher Ron Eglash found in many African cultures patterns that repeat at several scales: village layouts made of enclosures within enclosures, braided hairstyles, textiles, sculptures. His book *African Fractals* (1999) sees in them mathematical knowledge in its own right. Long before the word, M. C. Escher drew in the 1950s tilings whose motifs shrink endlessly towards the edge of a circle.' },
        { p: 'The images of this explorer have become an art form of their own, from the posters of the 1980s to the hours-long zooms published online. Each one is entirely determined by a formula of a few symbols and by the colour choices of whoever computed it.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'gpu', titre: 'One computation per pixel', blocs: [
        { p: 'A 1,920 × 1,080 image has over two million pixels. With a thousand iterations per pixel, that is two billion operations for a single image. But the computation has a precious property: each pixel is independent of its neighbours. This is exactly the work a graphics card is made for. It has thousands of small computing units, all running the same program, a *shader*, each one on its own pixel.' },
        { p: 'Measure it in your browser: the same image, computed in JavaScript by the processor, then by the graphics card.' },
        { figure: 'banc' },
        { p: 'The explorer computes in two passes. The first one writes, for each pixel, raw numbers into a texture: the smoothed iteration count, the relief lighting, the distance to the border. The second one turns them into colours. Changing the palette therefore needs no new computation. During a move, the image is computed at the highest resolution that keeps up with the screen, then enlarged with smoothing. Once still, full resolution arrives band by band, so as never to block the graphics card. Then the image sharpens: each new pass shifts the computation points by a fraction of a pixel, and the average of the passes smooths away the staircase edges. This is *anti-aliasing*.' },
        {
          expert: 'the heart of the program', blocs: [
            { p: 'The shader, in GLSL. gl_FragCoord is the position of the pixel; each pixel runs the loop on its own.' },
            { code: 'vec2 c = centre + (gl_FragCoord.xy - 0.5 * taille) * pas;\nvec2 z = vec2(0.0);\nfor (int i = 0; i < iterations; i++) {\n  z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;\n  if (dot(z, z) > 4.0) { n = i; break; }\n}' },
          ],
        },
      ],
    },
    {
      id: 'couleurs', titre: 'Colours that follow the zoom', blocs: [
        { p: 'The colour of an outside point comes from the number of iterations n it took to escape. To avoid staircase steps, this number is corrected according to the final size of z, which gives a real number that varies smoothly from one pixel to the next:' },
        { tex: tex`\nu = n + 2 - \log_2 \ln |z_n|.` },
        { p: 'Far from the set, $|z|$ is squared at each step, so $\\ln |z|$ doubles and $\\log_2 \\ln |z|$ grows by 1 per iteration: the two terms cancel, and ν does not depend on the step at which we stop. ν then goes through a palette, a periodic function that assigns a colour to each number. The explorer’s palette uses a formula by Inigo Quilez: three shifted cosines, $0.5 + 0.5\\cos(2\\pi t + \\varphi)$, one for red, one for green, one for blue.' },
        { p: 'It remains to choose how many turns of the palette per iteration. The deeper the zoom, the more iterations the points near the border need, and the more the gap between two neighbouring pixels is counted in tens of iterations. With a fixed density, the colours then cycle so fast that they blur into mush. The “zoom-adapted” scale, also borrowed from Quilez, divides ν by $1 + \\log_2 Z$ at zoom Z: the bands widen as you go down, and the image stays readable at every depth.' },
      ],
    },
    {
      id: 'precision', titre: 'Why the image ends up pixelated', blocs: [
        { p: 'The graphics card computes with 32-bit floating-point numbers. They have 24 binary digits, about 7 decimal digits: between 1/2 and 1, two neighbouring numbers are $2^{-24} \\approx 6 \\times 10^{-8}$ apart. When zooming in, two neighbouring pixels end up matching exactly the same number. They then get the same colour, and the image fills with big squares.' },
        { figure: 'precision' },
        { p: 'The limit comes quickly. If the image is 1,000 pixels high and covers a height $3/Z$ of the plane at zoom Z, two neighbouring pixels are $3 \\times 10^{-3}/Z$ apart. Near $|c| \\approx 0.7$, this gap must stay much larger than $2^{-24}$: zoom can hardly go beyond a few tens of thousands. This is still the limit for Newton, Lyapunov and the Multibrots in the explorer.' },
      ],
    },
    {
      id: 'perturbation', titre: 'A single precise computation: perturbation', blocs: [
        { p: 'Going further takes more digits. Consumer graphics cards compute very slowly in 64 bits, and WebGL does not allow it at all. A first workaround carries each coordinate as two 32-bit numbers, a high and a low part, whose sum is the desired value (Theodorus Dekker, 1971). Precision doubles, but each multiplication costs about twenty, and some shader compilers “simplify” the formulas to the point of destroying the low part. A previous version of this explorer used it; on some cards, it stopped at ×30,000.' },
        { p: 'The explorer now follows another idea: do only one precise computation. The processor, in JavaScript, computes with 64-bit numbers the orbit $Z_n$ of a single point C, the centre of the image. For each pixel $c = C + \\delta c$, the graphics card only follows the gap $\\delta_n = z_n - Z_n$ between the pixel’s orbit and the centre’s. Expand $(Z_n + \\delta_n)^2 + C + \\delta c$ and subtract $Z_{n+1} = Z_n^2 + C$:' },
        { tex: tex`\delta_{n+1} = 2 Z_n\, \delta_n + \delta_n^2 + \delta c.` },
        { p: 'The large, nearly equal numbers have vanished from the formula. Only products of small gaps remain, which 32-bit numbers carry with ease, because their precision is relative: $10^{-12}$ is written as accurately as 1. A zoom of $10^{12}$ is no longer a problem, on every graphics card, and the computation is faster than emulated double precision.' },
        { p: 'One trap remains. If a pixel’s orbit strays too far from the centre’s, the gap stops being small and the computation goes wrong without warning: this is called a *glitch*. In 2021, an enthusiast known by the pseudonym Zhuoran proposed a simple remedy. As soon as the pixel comes closer to 0 than to the reference orbit, restart from the beginning of that orbit, which precisely starts at 0. The explorer applies this rule at every iteration; it also helps when the centre’s orbit escapes before the pixel’s.' },
        {
          expert: 'Tricorn, Burning Ship and Julia sets', blocs: [
            { p: 'For the Tricorn, the gap is conjugated: $\\delta_{n+1} = \\overline{2 Z_n \\delta_n + \\delta_n^2} + \\delta c$. For the Burning Ship, the absolute value prevents a direct expansion. With $z = x + iy$ and $Z = X + iY$, the imaginary part of the gap is $2\\,(|xy| - |XY|) + \\delta c_y$. This difference of absolute values is computed without subtracting two large numbers, by looking at the signs:' },
            { tex: tex`|a + d| - |a| = \begin{cases} d & \text{if } a \ge 0 \text{ and } a + d \ge 0, \\ -2a - d & \text{if } a \ge 0 \text{ and } a + d < 0, \\ 2a + d & \text{if } a < 0 \text{ and } a + d > 0, \\ -d & \text{otherwise,} \end{cases}`, etroit: tex`\begin{gathered} |a + d| - |a| \in \{\, d,\; -2a - d,\; 2a + d,\; -d \,\} \\[4pt] \text{depending on the signs of } a \text{ and } a + d \end{gathered}` },
            { p: 'with $a = XY$ and $d = xy - XY = X\\,\\delta_y + \\delta_x\\,(Y + \\delta_y)$, which also contains only products with gaps. For a Julia set, c is fixed and the starting point varies: $\\delta c = 0$, and $\\delta_0$ is the pixel’s gap to the centre. Zhuoran’s rule then needs a second reference orbit, the one that starts at 0, since the centre’s orbit does not start at 0.' },
          ],
        },
        { p: 'Why stop at $10^{12}$? The centre itself is only known to 16 decimal digits, those of a 64-bit number. Specialised software such as Kalles Fraktaler computes the reference orbit with hundreds of digits, and carries the gaps with an extended exponent, because even the exponent of an ordinary number eventually runs out. It thus goes beyond zooms of $10^{1000}$. The idea of perturbation dates back at least to 1992; K. I. Martin popularised it in 2013 with his program SuperFractalThing.' },
      ],
    },
    {
      id: 'buddhabrot', titre: 'Why the Buddhabrot is not in the explorer', blocs: [
        { p: 'The Buddhabrot is not computed pixel by pixel: each point drawn at random leaves its trace on hundreds of pixels at once. This work suits a graphics card badly, since it is built for independent pixels; it has to run on the processor. A clean image takes hundreds of millions of computation steps, and everything must be redone at the slightest move.' },
        { p: 'A first version of the explorer computed it live, in a separate thread. Even so, the processor stayed fully busy and the whole computer slowed down. The images in the Theory tab are computed only once, at a small size, with a few hundred thousand points.' },
        { p: 'Zooming would be worse still: most points drawn at random have orbits that do not cross the small region shown. The points would have to be drawn cleverly, keeping those whose orbit crosses the view and looking for others close to them. This is the Metropolis algorithm, borrowed from statistical physics, which specialised programs use to zoom into the Buddhabrot.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'A short history', blocs: [
        {
          frise: [
            ['1872', 'Karl Weierstrass', 'presents a continuous function that is differentiable nowhere.'],
            ['1879', 'Arthur Cayley', 'suggests studying Newton’s method in the complex plane, and notes that the case of three roots resists.'],
            ['1883', 'Georg Cantor', 'describes the set that bears his name.'],
            ['1890', 'Giuseppe Peano', 'builds a curve that fills an entire square.'],
            ['1904', 'Helge von Koch', 'publishes his curve, continuous and without tangents.'],
            ['1915', 'Wacław Sierpiński', 'describes his triangle; the carpet follows in 1916.'],
            ['1918', 'Gaston Julia', 'publishes his memoir on the iteration of rational functions, awarded a prize by the French Academy of Sciences. Pierre Fatou carries out parallel research.'],
            ['1918', 'Felix Hausdorff', 'defines the dimension that now bears his name.'],
            ['1922', 'Lewis Fry Richardson', 'describes turbulence as a cascade of eddies.'],
            ['1961', 'Lewis Fry Richardson', 'notes, in a text published after his death, that the measured length of a coast depends on the ruler.'],
            ['1963', 'Benoît Mandelbrot', 'shows that cotton price changes do not follow the bell curve.'],
            ['1967', 'Benoît Mandelbrot', 'publishes “How long is the coast of Britain?” in *Science*.'],
            ['1975', 'Benoît Mandelbrot', 'coins the word “fractal”.'],
            ['1975', 'Mitchell Feigenbaum', 'discovers the constant 4.669…, published in 1978.'],
            ['1975', 'Richard Voss and John Clarke', 'find 1/f noise in music.'],
            ['1978', 'Robert Brooks and Peter Matelski', 'draw a first picture of the set, in a paper on Kleinian groups published in 1981.'],
            ['1980', 'Benoît Mandelbrot', 'visualises the set on 1 March, at IBM’s research centre in Yorktown Heights.'],
            ['1980', 'Loren Carpenter', 'shows *Vol Libre*, a flight over fractal mountains.'],
            ['1981', 'John Hutchinson', 'proves the existence and uniqueness of the attractor of an iterated function system.'],
            ['1981', 'Thomas Witten and Leonard Sander', 'introduce diffusion-limited aggregation.'],
            ['1982', 'Oscar Lanford', 'proves with the help of a computer the universality of Feigenbaum’s constant.'],
            ['1982', 'Star Trek II', 'shows a planet made of fractal mountains, computed at Lucasfilm.'],
            ['1980s', 'Adrien Douady and John Hubbard', 'prove that the set is connected, and name it after Mandelbrot.'],
            ['1985', 'A. K. Dewdney', 'presents in August, in Scientific American, the algorithm that lets anyone draw the set; a picture makes the cover.'],
            ['1985', 'Ken Perlin', 'publishes the noise that bears his name.'],
            ['1986', 'Heinz-Otto Peitgen and Peter Richter', 'publish *The Beauty of Fractals*.'],
            ['1987', 'Nathan Cohen', 'attends a talk by Mandelbrot and soon builds a fractal antenna.'],
            ['1988', 'Michael Barnsley', 'publishes *Fractals Everywhere*, with its fern.'],
            ['Late 1980s', 'Mario Markus', 'discovers Lyapunov fractals.'],
            ['1989', 'Crowe, Hasson, Rippon and Strain-Clark', 'study the Tricorn, which they call the “Mandelbar” set.'],
            ['1991', 'Mitsuhiro Shishikura', 'shows that the border of the set has Hausdorff dimension 2 (published in 1998).'],
            ['Early 1990s', 'David Boll', 'finds π in the iteration counts, near the neck of the cardioid.'],
            ['1992', 'Michael Michelitsch and Otto Rössler', 'describe the Burning Ship.'],
            ['1992', 'Arnaud Jacquin', 'makes fractal image compression practical.'],
            ['1993', 'Melinda Green', 'describes the Buddhabrot technique on the sci.fractals newsgroup.'],
            ['1994', 'Jean-Christophe Yoccoz', 'receives the Fields Medal, notably for his work on the local connectivity of the set.'],
            ['1994', 'Will Leland and colleagues', 'show that Ethernet network traffic is self-similar.'],
            ['1997', 'Geoffrey West, James Brown and Brian Enquist', 'explain Kleiber’s law with fractal networks.'],
            ['1999', 'Richard Taylor', 'measures the fractal dimension of Pollock’s paintings.'],
            ['2010', 'Benoît Mandelbrot', 'dies on 14 October.'],
            ['2012', 'Xavier Buff and Arnaud Chéritat', 'build Julia sets with non-zero area.'],
            ['2013', 'K. I. Martin', 'spreads perturbation theory with SuperFractalThing: very deep zooms become available to all.'],
            ['2021', 'Zhuoran', 'proposes the rebasing rule that removes most perturbation glitches.'],
          ],
        },
      ],
    },
    {
      id: 'refs', titre: 'References', blocs: [
        {
          refs: [
            ['A. Cayley, “The Newton-Fourier imaginary problem”, American Journal of Mathematics 2, 1879.'],
            ['G. Cantor, “Über unendliche, lineare Punktmannichfaltigkeiten”, Mathematische Annalen 21, 1883.'],
            ['H. von Koch, “Sur une courbe continue sans tangente, obtenue par une construction géométrique élémentaire”, Arkiv för matematik, astronomi och fysik 1, 1904.'],
            ['W. Sierpiński, “Sur une courbe dont tout point est un point de ramification”, Comptes rendus de l’Académie des sciences 160, 1915.'],
            ['G. Julia, “Mémoire sur l’itération des fonctions rationnelles”, Journal de mathématiques pures et appliquées, 1918.'],
            ['F. Hausdorff, “Dimension und äußeres Maß”, Mathematische Annalen 79, 1918.'],
            ['P. Fatou, “Sur les équations fonctionnelles”, Bulletin de la Société mathématique de France, 1919-1920.'],
            ['L. F. Richardson, *Weather Prediction by Numerical Process*, Cambridge University Press, 1922.'],
            ['P. A. P. Moran, “Additive functions of intervals and Hausdorff measure”, Proceedings of the Cambridge Philosophical Society 42, 1946.'],
            ['L. F. Richardson, “The problem of contiguity”, General Systems Yearbook 6, 1961.'],
            ['B. B. Mandelbrot, “The variation of certain speculative prices”, Journal of Business 36, 1963.'],
            ['B. B. Mandelbrot, “How long is the coast of Britain? Statistical self-similarity and fractional dimension”, Science 156, 1967.'],
            ['T. J. Dekker, “A floating-point technique for extending the available precision”, Numerische Mathematik 18, 1971.'],
            ['R. F. Voss and J. Clarke, “1/f noise in music and speech”, Nature 258, 1975.'],
            ['M. J. Feigenbaum, “Quantitative universality for a class of nonlinear transformations”, Journal of Statistical Physics 19, 1978.'],
            ['B. B. Mandelbrot, “Fractal aspects of the iteration of z ↦ λz(1 − z) for complex λ and z”, Annals of the New York Academy of Sciences 357, 1980.'],
            ['J. E. Hutchinson, “Fractals and self similarity”, Indiana University Mathematics Journal 30, 1981.'],
            ['T. A. Witten and L. M. Sander, “Diffusion-limited aggregation, a kinetic critical phenomenon”, Physical Review Letters 47, 1981.'],
            ['R. Brooks and J. P. Matelski, “The dynamics of 2-generator subgroups of PSL(2, C)”, Annals of Mathematics Studies 97, 1981.'],
            ['B. B. Mandelbrot, *The Fractal Geometry of Nature*, W. H. Freeman, 1982.'],
            ['A. Fournier, D. Fussell and L. Carpenter, “Computer rendering of stochastic models”, Communications of the ACM 25, 1982.'],
            ['O. E. Lanford, “A computer-assisted proof of the Feigenbaum conjectures”, Bulletin of the American Mathematical Society 6, 1982.'],
            ['A. Douady and J. H. Hubbard, “Itération des polynômes quadratiques complexes”, Comptes rendus de l’Académie des sciences 294, 1982.'],
            ['A. K. Dewdney, “Computer Recreations”, Scientific American, August 1985.'],
            ['K. Perlin, “An image synthesizer”, Computer Graphics 19 (SIGGRAPH), 1985.'],
            ['H.-O. Peitgen and P. H. Richter, *The Beauty of Fractals*, Springer, 1986.'],
            ['C. McMullen, “Families of rational maps and iterative root-finding algorithms”, Annals of Mathematics 125, 1987.'],
            ['M. F. Barnsley, *Fractals Everywhere*, Academic Press, 1988.'],
            ['M. Markus and B. Hess, “Lyapunov exponents of the logistic map with periodic forcing”, Computers & Graphics 13, 1989.'],
            ['W. D. Crowe, R. Hasson, P. J. Rippon and P. E. D. Strain-Clark, “On the structure of the Mandelbar set”, Nonlinearity 2, 1989.'],
            ['Tan Lei, “Similarity between the Mandelbrot set and Julia sets”, Communications in Mathematical Physics 134, 1990.'],
            ['M. Michelitsch and O. E. Rössler, “The “Burning Ship” and its quasi-Julia sets”, Computers & Graphics 16, 1992.'],
            ['J. Milnor, “Remarks on iterated cubic maps”, Experimental Mathematics 1, 1992.'],
            ['A. E. Jacquin, “Image coding based on a fractal theory of iterated contractive image transformations”, IEEE Transactions on Image Processing 1, 1992.'],
            ['S. Nakane, “Connectedness of the tricorn”, Ergodic Theory and Dynamical Systems 13, 1993.'],
            ['W. E. Leland, M. S. Taqqu, W. Willinger and D. V. Wilson, “On the self-similar nature of Ethernet traffic”, IEEE/ACM Transactions on Networking 2, 1994.'],
            ['N. Cohen, “Fractal antennas: Part 1”, Communications Quarterly, Summer 1995.'],
            ['C. Puente, J. Romeu, R. Pous, X. Garcia and F. Benítez, “Fractal multiband antenna based on the Sierpinski gasket”, Electronics Letters 32, 1996.'],
            ['G. B. West, J. H. Brown and B. J. Enquist, “A general model for the origin of allometric scaling laws in biology”, Science 276, 1997.'],
            ['J. Graczyk and G. Świątek, “Generic hyperbolicity in the logistic family”, Annals of Mathematics 146, 1997.'],
            ['M. Lyubich, “Dynamics of quadratic polynomials, I–II”, Acta Mathematica 178, 1997.'],
            ['M. Shishikura, “The Hausdorff dimension of the boundary of the Mandelbrot set and Julia sets”, Annals of Mathematics 147, 1998.'],
            ['R. Eglash, *African Fractals: Modern Computing and Indigenous Design*, Rutgers University Press, 1999.'],
            ['R. P. Taylor, A. P. Micolich and D. Jonas, “Fractal analysis of Pollock’s drip paintings”, Nature 399, 1999.'],
            ['R. L. Devaney, “The Mandelbrot set, the Farey tree, and the Fibonacci sequence”, American Mathematical Monthly 106, 1999.'],
            ['J. Hubbard, D. Schleicher and S. Sutherland, “How to find all roots of complex polynomials by Newton’s method”, Inventiones mathematicae 146, 2001.'],
            ['A. Klebanoff, “π in the Mandelbrot set”, Fractals 9, 2001.'],
            ['A. L. Goldberger and al., “Fractal dynamics in physiology: alterations with disease and aging”, PNAS 99, 2002.'],
            ['K. Jones-Smith and H. Mathur, “Revisiting Pollock’s drip paintings”, Nature 444, 2006.'],
            ['X. Buff and A. Chéritat, “Quadratic Julia sets with positive area”, Annals of Mathematics 176, 2012.'],
            ['J. H. Hubbard and D. Schleicher, “Multicorns are not path connected”, in *Frontiers in Complex Dynamics*, Princeton University Press, 2014.'],
            ['M. Green, “The Buddhabrot technique”.', 'https://superliminal.com/fractals/bbrot/'],
            ['I. Quilez, “Palettes”.', 'https://iquilezles.org/articles/palettes/'],
            ['IEEE History Center, “The invention of the fractal antenna”.', 'https://history.ieee.org/why-mobile-phones-can-do-so-many-things-the-invention-of-the-fractal-antenna/'],
            ['R. Munafo, *Mu-Ency*, the encyclopedia of the Mandelbrot set.', 'https://mrob.com/pub/muency.html'],
            ['luma.gl, “GPU floating-point precision techniques”.', 'https://luma.gl/docs/api-guide/shaders/gpu-floating-point-precision'],
            ['Wikipedia, “Mandelbrot set”.', 'https://en.wikipedia.org/wiki/Mandelbrot_set'],
            ['Wikipedia, “Julia set”.', 'https://en.wikipedia.org/wiki/Julia_set'],
            ['Wikipedia, “Fractal dimension”.', 'https://en.wikipedia.org/wiki/Fractal_dimension'],
            ['Wikipedia, “Coastline paradox”.', 'https://en.wikipedia.org/wiki/Coastline_paradox'],
            ['Wikipedia, “Feigenbaum constants”.', 'https://en.wikipedia.org/wiki/Feigenbaum_constants'],
            ['Wikipedia, “Burning Ship fractal”.', 'https://en.wikipedia.org/wiki/Burning_Ship_fractal'],
            ['Wikipedia, “Newton fractal”.', 'https://en.wikipedia.org/wiki/Newton_fractal'],
            ['Wikipedia, “Lyapunov fractal”.', 'https://en.wikipedia.org/wiki/Lyapunov_fractal'],
            ['Wikipedia, “Buddhabrot”.', 'https://en.wikipedia.org/wiki/Buddhabrot'],
            ['Wikipedia, “Diffusion-limited aggregation”.', 'https://en.wikipedia.org/wiki/Diffusion-limited_aggregation'],
          ],
        },
      ],
    },
  ],

  figures: {
    orbite: {
      label: 'Map of the Mandelbrot set; the orbit of the chosen point is drawn in white.',
      legende: 'In black, the Mandelbrot set. The dashed circle has radius 2: an orbit that leaves it never comes back.',
      point: (c) => `c = ${c}`,
      echappe: (n) => `The orbit goes beyond 2 after ${n} step${n > 1 ? 's' : ''}: c is outside the set.`,
      cycle: (p) => (p === 1 ? 'The orbit settles on a fixed point: c is in the set.' : `The orbit cycles through ${p} points: c is in the set.`),
      bornee: 'The orbit stays bounded: c is in the set.',
    },
    couleurs: {
      titres: ['The step count, as is', 'The step count, smoothed'],
      legende: 'Seahorse valley, zoom ×50. On the left, each band matches a whole number of steps; on the right, the count is corrected to become continuous.',
    },
    julias: {
      legende: 'Five points c, five Julia sets. The first four c are in the Mandelbrot set; the last one is just outside.',
      noms: { lapin: 'Douady’s rabbit', dendrite: 'The dendrite', sanmarco: 'San Marco', siegel: 'Siegel disc', poussiere: 'Dust' },
    },
    galerie: {
      ouvrir: 'Open in the explorer',
      cartes: {
        burning: 'Like Mandelbrot, making both parts of z positive before squaring. On its antenna, a ship on fire.',
        tricorn: 'With the conjugate of z: the symmetry goes to three branches.',
        multibrot: 'z³ + c instead of z² + c: two axes of symmetry instead of one. The degree can be set in the explorer.',
        newton: 'Newton’s method for z³ − 1. Each colour is the basin of a root; their borders are fractal.',
        lyapunov: 'The logistic map, its rate alternating between a and b. Colour: order; black: chaos.',
        buddha: 'The paths of millions of escaping points, piled up: a seated Buddha appears. Too slow to compute live, it is only shown as a picture.',
      },
    },
    dichotomie: {
      carte: 'Map of the Mandelbrot set: click to choose c.',
      julia: (c) => `Julia set for c = ${c}`,
      dedans: 'c is in the Mandelbrot set: the Julia set is in one piece.',
      dehors: 'c is outside the Mandelbrot set: the Julia set is dust.',
      legende: 'Click or drag on the left map. On the right, the Julia set of the chosen point.',
    },
    bulbes: {
      label: 'Map of the Mandelbrot set: hover to read the period.',
      attente: 'Hover over a bulb to read its period.',
      periode: (p) => (p === 1 ? 'Main cardioid: a fixed point.' : `Bulb of period ${p}: the orbit cycles through ${p} points.`),
      dehors: 'Outside the set.',
      inconnue: 'Very close to the border: the period cannot be read in 4,000 steps.',
    },
    pi: {
      titreCou: 'Above the neck: c = −3/4 + iε',
      titrePointe: 'At the cusp: c = 1/4 + ε',
      colEps: 'ε',
      colN: 'Iterations N',
      colProduit: 'N × ε',
      colRacine: 'N × √ε',
      enCours: 'Computing…',
      legende: 'Computed in your browser. π = 3.141 592 65…',
    },
    bifurcation: {
      label: 'Bifurcation diagram of z → z² + c for real c, aligned above the Mandelbrot set.',
      legende: 'At the top, the values taken by z after hundreds of steps, for each real c; at the bottom, the Mandelbrot set around the real axis, at the same scale.',
      titre: 'Period doublings, closer and closer',
      colK: 'Period',
      colC: 'Centre of the bulb',
      colRapport: 'Ratio of gaps',
      donnees: 'Show the computation',
    },
    banc: {
      bouton: 'Measure',
      encore: 'Measure again',
      enCours: 'Measuring…',
      attente: 'The whole set, 512 × 512 pixels, at most 1,000 iterations per pixel. The processor may take a second or two.',
      cpu: 'Processor (JavaScript)',
      gpu: 'Graphics card (WebGL2)',
      rapport: (r) => `The graphics card is ${r} times faster.`,
      ms: (n) => `${n} ms`,
      sansGpu: 'WebGL2 is not available in this browser.',
    },
    precision: {
      titres: ['32 bits, like a graphics card', '64 bits'],
      zoom: 'Zoom',
      legende: 'The same mini-Mandelbrot, computed with 32-bit numbers (left) and 64-bit numbers (right). Turn up the zoom: on the left, the image turns into squares.',
    },
    construction: {
      choix: 'Figure',
      noms: { cantor: 'Cantor', koch: 'Koch', sierpinski: 'Sierpiński' },
      etape: 'Step',
      mesure: {
        cantor: (n, l) => `${n} segments, total length ${l}`,
        koch: (n, l) => `${n} segments, perimeter multiplied by ${l}`,
        sierpinski: (n, a) => `${n} triangles, area multiplied by ${a}`,
      },
      dimension: (N, k, d) => `Dimension: log ${N} / log ${k} ≈ ${d}`,
      legende: {
        cantor: 'At each step, the middle third of every segment is removed. The rows show the successive steps.',
        koch: 'At each step, the middle third of every segment is replaced by the other two sides of a triangle.',
        sierpinski: 'At each step, every triangle is replaced by its three corners, half the size.',
      },
    },
    boites: {
      choix: 'Shape',
      noms: { koch: 'Koch curve', sierpinski: 'Sierpiński triangle', julia: 'Edge of Douady’s rabbit' },
      label: (nom) => `${nom}, covered by a grid of boxes`,
      taille: 'Side ε',
      compte: (n, e) => `${n} boxes of side ${e} touch the shape`,
      calcul: 'Computing…',
      titreGraphe: 'Number of boxes touched by box size, on logarithmic scales',
      serie: 'Boxes touched',
      droite: 'Fitted line',
      axeX: '1 / ε',
      axeY: 'Boxes touched',
      info: (x, n) => `1/ε = ${x}: ${n} boxes`,
      resume: (p) => `The points line up on a straight line of slope ${p}.`,
      pente: (p) => `Slope of the line: ${p}`,
      exacte: (d) => `exact value: ${d}`,
      legende: 'The shape is drawn on a raster of 1,024 × 1,024 dots; boxes that touch it are tinted. Each time the side of the boxes is halved, their number is multiplied by about 2 to the power D. The slope is measured over the intermediate sizes.',
    },
    chaos: {
      choix: 'System',
      noms: { sierpinski: 'Sierpiński', fougere: 'Fern', dragon: 'Dragon' },
      label: (nom) => `Chaos game: ${nom}`,
      recommencer: 'Restart',
      points: (n) => `${n} points`,
      regles: {
        sierpinski: 'Three transformations drawn with equal probability: each one halves and moves towards a corner of the triangle.',
        fougere: 'Four affine transformations (Barnsley, 1988). One, drawn 85 times out of 100, moves the frond upwards while shrinking it a little; two others produce the first leaflets, left and right; the last, rare, squashes everything onto the stem.',
        dragon: 'Two similarities of ratio 1/√2; one turns by 45°, the other by 135°. Their attractor is the Heighway dragon curve.',
      },
    },
    littoral: {
      label: 'An imaginary island, and the polygon obtained by measuring its coast with a ruler.',
      regle: 'Ruler',
      mesure: (n, l) => `${n} ruler steps: ${l} km`,
      autre: 'Another island',
      titreGraphe: 'Measured length by ruler size, on logarithmic scales',
      serie: 'Measured length',
      axeX: 'Ruler (km)',
      axeY: 'Length (km)',
      info: (r, l) => `Ruler of ${r} km: ${l} km`,
      resume: (d) => `The shorter the ruler, the longer the coast. Estimated dimension: ${d}.`,
      dimension: (d) => `Estimated dimension: ${d}`,
      legende: 'The island is about 1,000 km across. We move along the coast one ruler step at a time, as with a pair of dividers. Halving the ruler lengthens the coast by a roughly constant factor, 2 to the power (D − 1): this is the law Richardson had observed.',
    },
    relief: {
      label: (h, d) => `Random mountain profile; Hurst exponent ${h}, dimension ${d}`,
      rugosite: 'Exponent H',
      valeurs: (h, d) => `H = ${h} · D = ${d}`,
      autre: 'Another draw',
      legende: 'The midpoint of a segment is moved at random, then the midpoint of each half, and so on, nine times. The random draws do not change when you move the slider: only the speed at which the displacements shrink changes.',
    },
    agregation: {
      label: 'A cluster growing by aggregation of wandering particles.',
      recommencer: 'Restart',
      particules: (n) => `${n} particles`,
      dimension: (d) => `estimated dimension: ${d}`,
      legende: 'Each particle starts from a circle around the cluster and walks at random, one cell at a time, until it touches it. The dimension is estimated by counting the particles within r of the centre: their number grows like r to the power D. With a few thousand particles, the estimate falls between 1.5 and 1.7; millions are needed to approach the limiting value, 1.71.',
    },
    vignettes: {
      ouvrir: 'Open in the explorer',
      noms: {
        burning: 'Burning Ship',
        tricorn: 'Tricorn',
        multibrot: 'Multibrot of degree 4',
        newton: 'Newton for z³ − 1',
        newtonZoom: 'Where the basins meet, ×6',
        cycle: 'z³ − 2z + 2: areas with no root',
        lyapunov: 'Lyapunov, sequence AB',
        lyapunovB: 'Sequence BBBBBBAAAAAA',
        buddha: 'Buddhabrot',
        nebula: 'Orbits of fewer than 40 steps',
      },
      formules: {
        burning: 'z → (|x| + i|y|)² + c',
        tricorn: 'z → z̄² + c',
        multibrot: 'z → z⁴ + c',
        newton: 'z → z − p(z) / p′(z)',
        lyapunov: 'x → rₙ x (1 − x)',
      },
    },
  },
}

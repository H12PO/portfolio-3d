// ============================================================
//  ARTICLES IN ENGLISH: Theory, Computation, History and references, figures
//  Same structure as lecture-fr.js.
// ============================================================

const tex = String.raw

export const LECTURE_EN = {
  theorie: [
    {
      id: 'regle', titre: 'The rule, in one formula', blocs: [
        { p: 'Write $s_t(x) \\in \\{0, 1\\}$ for the state of cell $x$ at generation $t$ (1 for alive) and $N_t(x)$ for its number of live neighbours. The two rules fit on one line:' },
        { tex: tex`s_{t+1}(x) = \begin{cases} 1 & \text{if } N_t(x) = 3, \\ s_t(x) & \text{if } N_t(x) = 2, \\ 0 & \text{otherwise.} \end{cases}` },
        { p: 'With 2 neighbours, nothing changes; with 3, the cell is alive no matter what; in every other case, it is dead. Click the cells to try:' },
        { figure: 'voisinage' },
        { p: 'The same rule applies everywhere, and every cell changes at the same time: this is what is called a *cellular automaton*.' },
        {
          expert: 'formal definition', blocs: [
            { p: 'A cellular automaton on the grid $\\mathbb{Z}^2$ is given by a set of states $S$, a finite neighbourhood $V$ and a local rule $f : S^V \\to S$. It defines the global map $F$, which moves any configuration $c : \\mathbb{Z}^2 \\to S$ forward by one generation:' },
            { tex: tex`F(c)(x) = f\big((c(x + v))_{v \in V}\big), \qquad V = \{-1, 0, 1\}^2 \ \text{(Moore neighbourhood)}.`, etroit: tex`\begin{gathered} F(c)(x) = f\big((c(x + v))_{v \in V}\big) \\[4pt] V = \{-1, 0, 1\}^2 \end{gathered}` },
            { p: 'Conway’s rule is *outer totalistic*: it only depends on the state of the cell and on its number of live neighbours, not on where they are. Such a rule is described by two subsets of $\\{0, \\dots, 8\\}$: the neighbour counts that cause a birth ($B$) and those that allow survival ($S$). So there are' },
            { tex: tex`2^9 \times 2^9 = 2^{18} = 262{,}144` },
            { p: 'of them, the Game of Life being B3/S23. Rules containing B0, where an empty cell with no neighbour at all is born, make the whole background flash; the simulation does not offer them.' },
          ],
        },
      ],
    },
    {
      id: 'zoo', titre: 'The pattern zoo', blocs: [
        { p: 'Life enthusiasts sort patterns by behaviour. A *still life* never changes again: the block, the beehive. An *oscillator* comes back identical after a fixed number of generations, its period: 2 for the blinker, 3 for the pulsar. A *spaceship* comes back identical but shifted: it travels.' },
        { p: 'The smallest spaceship is the glider: five cells that shift one cell diagonally every four generations. Halfway through, it is its own mirror image.' },
        { figure: 'planeur' },
        { p: 'The simulation’s automatic analysis recognizes these three families: generation after generation, it looks for a configuration it has already seen, in the same place or shifted.' },
        { p: 'In 2023, Mitchell Riley and Nico Brown found oscillators of period 19 and 41, the last two that were missing. In a December 2023 paper, with their five co-authors, they concluded that the Game of Life is *omniperiodic*: for every integer $p \\ge 1$, there is an oscillator of period $p$.' },
        {
          expert: 'the speed of light', blocs: [
            { p: 'A cell only sees its immediate neighbours: no information can travel more than one cell per generation. This top speed is written $c$, the “speed of light” of the Game of Life. A spaceship that shifts by $(\\Delta x, \\Delta y)$ in $p$ generations travels at' },
            { tex: tex`v = \frac{\max(|\Delta x|, |\Delta y|)}{p}\, c, \qquad \text{glider: } \frac{c}{4}, \qquad \text{lightweight spaceship: } \frac{2}{4}\,c = \frac{c}{2}.`, etroit: tex`\begin{gathered} v = \frac{\max(|\Delta x|, |\Delta y|)}{p}\, c \\[4pt] \text{glider: } \frac{c}{4}, \quad \text{lightweight: } \frac{c}{2} \end{gathered}` },
            { p: '*Theorem* (Conway, 1970). In an empty universe, no spaceship travels faster than $c/2$ orthogonally, or $c/4$ diagonally.' },
            { p: '*Idea of the proof*, for the diagonal. Put the spaceship on one side of a diagonal. For a cell two diagonals further on to be alive two generations later, its only three possible neighbours must be alive at generation 1: two on the intermediate diagonal, one on the first. The first two must be born, so each needs three live neighbours at the start; that gives at least four live neighbours around the third one, which dies of overcrowding. Contradiction: the edge of the spaceship advances by at most one diagonal every two generations, that is $c/4$. The same reasoning, on two crossing diagonals, gives the orthogonal bound.' },
          ],
        },
      ],
    },
    {
      id: 'croissance', titre: 'Growing forever', blocs: [
        { p: 'Conway believed that no finite pattern could grow without limit. In the October 1970 article by Martin Gardner that made the game famous, he offered 50 dollars to whoever could prove or disprove this conjecture before the end of the year. The prize was won in November by an MIT team led by Bill Gosper, with a *gun*: a period-30 oscillator that fires a glider every period.' },
        { figure: 'canon' },
        { p: 'Each glider carries five cells away: the population grows by about five cells every thirty generations, and never stops.' },
        { p: 'How many cells after a billion generations? Simulating generation by generation would take hours. In 1984, Gosper published *Hashlife*, an algorithm that cuts the universe into nested squares and remembers the future of every square it has already met. On a regular pattern such as a gun, where the same computation is reused over and over, it skips billions of generations at once. It runs here in your browser:' },
        { figure: 'saut' },
        {
          expert: 'how fast can a pattern grow?', blocs: [
            { p: 'The speed of light bounds growth. A pattern that fits in an $L \\times H$ rectangle cannot spread by more than $t$ cells in each direction in $t$ generations. Its population therefore satisfies' },
            { tex: tex`P(t) \le (L + 2t)(H + 2t) = O(t^2).` },
            { p: 'A gun gives linear growth: $P(t) \\approx P_0 + t/6$ for Gosper’s, five cells every thirty generations. Gosper also built the first *breeder*, a pattern that leaves guns behind it, each firing its own gliders. Its population grows like $t^2$: up to a constant, this is the fastest growth possible.' },
            { p: 'Hashlife rests on the same bound. A square of $2^k \\times 2^k$ cells fully determines its central $2^{k-1} \\times 2^{k-1}$ square for $2^{k-2}$ generations, since nothing from outside has time to reach it. The algorithm computes this jump recursively, from nine sub-squares, and remembers it:' },
            { tex: tex`\text{centre}\big(F^{2^{k-2}}(Q)\big) = \operatorname{next}(Q), \qquad \text{computed only once for each distinct square } Q.`, etroit: tex`\begin{gathered} \text{centre}\big(F^{2^{k-2}}(Q)\big) = \operatorname{next}(Q) \\[4pt] \text{once for each distinct square } Q \end{gathered}` },
            { p: 'This site’s Hashlife engine gives the same results, cell by cell, as the ordinary engine on the glider, the pulsar, the R-pentomino, Gosper’s gun, the acorn and the copperhead.' },
          ],
        },
      ],
    },
    {
      id: 'eden', titre: 'Gardens of Eden', blocs: [
        { p: 'Every configuration has a future. But not every one has a past: a *Garden of Eden* is a configuration that no other configuration can produce. The only way to get one is to draw it.' },
        { p: 'They exist because of something Langton’s ant never does: two different pasts can lead to the same present. The two grids below differ only by their central cell; whatever surrounds them, they have exactly the same future.' },
        { figure: 'jumeaux' },
        { p: 'These two patterns are *twins*. The Garden of Eden theorem, proved by Edward Moore in 1962 and John Myhill in 1963, says that a cellular automaton has Gardens of Eden if and only if it has twins. So the Game of Life has them.' },
        { p: 'The first explicit example was proposed by Roger Banks in 1971: its cells fit in a 9 × 33 rectangle, and an exhaustive search confirmed that it has no predecessor. In April 2016, Steven Eker found the smallest known pattern with no predecessor: 57 cells in an 8 × 12 rectangle.' },
        {
          expert: 'the theorem, and a counting proof', blocs: [
            { p: 'Write $F$ for the map that moves a configuration $c : \\mathbb{Z}^2 \\to \\{0, 1\\}$ forward by one generation. Two finite patterns are *twins* if they are different but always give the same successor, whatever the rest of the grid.' },
            { p: '*Theorem* (Moore, 1962; Myhill, 1963). $F$ is surjective, that is, without Gardens of Eden, if and only if it has no twins.' },
            { p: 'The direction we need, Moore’s, is proved by counting. Assume twins of size $n \\times n$, and take a square of $k \\times k$ blocks of that size. At the next generation, the inside of this square, minus a one-cell border, depends only on the square itself. In each block, one of the two twins is useless: the other one has the same effect. So the starting squares give at most $(2^{n^2} - 1)^{k^2}$ different insides, while there are $2^{(kn-2)^2}$ possible insides. For $k$ large enough,' },
            { tex: tex`\big(2^{n^2} - 1\big)^{k^2} < 2^{(kn-2)^2},` },
            { p: 'and some insides have no predecessor at all: they are *orphans*, and any configuration containing one is a Garden of Eden.' },
            { p: 'For the Game of Life, the twins in the figure give $n = 5$. The inequality only holds from $k \\approx 4.65 \\times 10^8$: the argument guarantees orphans about 2.3 billion cells wide. The smallest known one fits in 8 × 12 cells.' },
            { p: 'Langton’s ant, on the other hand, is reversible: every state has exactly one past. No twins, no Gardens of Eden.' },
          ],
        },
      ],
    },
    {
      id: 'soupes', titre: 'Random soups', blocs: [
        { p: 'Fill a grid at random, each cell alive with probability $p$, and let it run. After a few thousand generations, only “ash” remains: still lifes, blinkers, a few gliders. What density is left?' },
        { figure: 'soupes' },
        { p: 'Between 20% and 70% of live cells at the start, the final density stays around 3%, almost regardless of the starting density. With very few cells, most die of loneliness; with too many, almost all die of overcrowding at the very first generation.' },
        {
          expert: 'the mean-field approximation, and why it fails', blocs: [
            { p: 'First idea: pretend the cells are independent, all alive with the same probability $p_t$. A dead cell is born if exactly 3 of its 8 neighbours are alive; a live cell survives with 2 or 3. The next density would then be, with $q_t = 1 - p_t$:' },
            { tex: tex`p_{t+1} = p_t \left[\binom{8}{2} p_t^2 q_t^6 + \binom{8}{3} p_t^3 q_t^5\right] + q_t \binom{8}{3} p_t^3 q_t^5.`, etroit: tex`\begin{gathered} p_{t+1} = p_t \left[\binom{8}{2} p_t^2 q_t^6 + \binom{8}{3} p_t^3 q_t^5\right] \\[4pt] + \; q_t \binom{8}{3} p_t^3 q_t^5 \end{gathered}` },
            { p: 'This sequence has two non-zero fixed points: $p \\approx 0.19$, unstable, and $p \\approx 0.37$, stable. Starting from a density between about 19% and 56%, a soup would thus settle at 37% live cells; outside that range, it would die out. The simulation finds more than ten times less.' },
            { p: 'The error comes from the independence assumption. Ash is made of small, highly organized patterns: in a block, every cell has exactly three live neighbours, and no cell around it has three. These correlations, which the mean field ignores, decide everything.' },
          ],
        },
      ],
    },
    {
      id: 'chaos', titre: 'At the edge of chaos', blocs: [
        { p: 'Why this rule? Among the 262,144 B/S rules, most give uneventful worlds: everything dies, everything freezes, or everything boils. In 1984, Stephen Wolfram sorted cellular automata into four classes. In class I, everything becomes uniform; in class II, everything settles into fixed or periodic structures; in class III, the turmoil never ends. Class IV, rarer, is the one where localised structures are born, travel and interact for a long time. The Game of Life is its textbook example.' },
        { p: 'In 1990, Christopher Langton, the inventor of the ant, proposed a measure to find one’s way: the parameter $\\lambda$, the share of possible neighbourhoods that yield a live cell. On randomly drawn rules, he observed that order dominates when $\\lambda$ is small, chaos when it nears 1/2, and that complex behaviour gathers near the transition, at the *edge of chaos*. The Game of Life has $\\lambda = 140/512 \\approx 0.273$, and Langton places it in that transition zone.' },
        { figure: 'lambda' },
        { p: 'The figure also shows the limits of the idea. Seeds has the smallest $\\lambda$ in the list, and almost everything explodes in it. Day & Night and Replicator have exactly the same one, 1/2: in the first, the soup shrinks away; in the second, it takes over everything. The parameter describes an average trend over randomly drawn rules, not the fate of a given rule.' },
        { p: 'The idea has also been questioned on substance. In 1988, Norman Packard believed he had shown that automata taught to compute evolve towards the edge of chaos. In 1993, Melanie Mitchell, Peter Hraber and James Crutchfield redid the experiment and did not find the same result. The edge of chaos remains a fertile image, but not a law.' },
        {
          expert: 'the λ parameter of a B/S rule', blocs: [
            { p: 'A B/S rule can be read off the $2^9 = 512$ possible neighbourhoods: the cell and its 8 neighbours. A neighbourhood where the cell is dead and has $k$ live neighbours gives a birth if $k \\in B$; there are $\\binom{8}{k}$ such neighbourhoods. Likewise for survival, with $S$. Hence' },
            { tex: tex`\lambda = \frac{1}{512}\Big(\sum_{k \in B} \binom{8}{k} + \sum_{k \in S} \binom{8}{k}\Big), \qquad \text{Game of Life: } \frac{56 + 28 + 56}{512} = \frac{140}{512}.`, etroit: tex`\begin{gathered} \lambda = \frac{1}{512}\Big(\sum_{k \in B} \binom{8}{k} + \sum_{k \in S} \binom{8}{k}\Big) \\[6pt] \text{Game of Life: } \frac{56 + 28 + 56}{512} = \frac{140}{512} \end{gathered}` },
            { p: 'Swapping live and dead cells gives a rule with parameter $1 - \\lambda$. Beyond 1/2, order therefore returns, this time with grids that fill up: Life without death and Maze are on that side.' },
            { p: 'The count weighs all neighbourhoods equally, as in a half-full grid. Yet a real world is often almost empty, and that is where Seeds strikes: its only rule, B2, weighs just $\\binom{8}{2} = 28$ neighbourhoods out of 512, but they are precisely the ones that abound around scattered cells.' },
          ],
        },
      ],
    },
    {
      id: 'replication', titre: 'Patterns that copy themselves', blocs: [
        { p: 'In the late 1940s, John von Neumann asked what it takes, at the very least, for a machine to reproduce. His answer has two parts: a *universal constructor*, able to build any machine whose description it is given, and a tape that carries that description. The constructor reads the tape to build its offspring, then copies the tape and hands it over. The tape is used twice, first as a program, then as plain data. This is the logic biology found in DNA, whose structure James Watson and Francis Crick published in 1953.' },
        { p: 'Von Neumann designed his machine on a 29-state grid; his work was published in 1966, after his death, completed by Arthur Burks. Edgar Codd brought the number of states down to 8 in 1968. In 1984, Christopher Langton gave up universality and obtained, on an 8-state grid, a loop of about 86 cells that copies itself in about 151 generations. Von Neumann’s machine itself only ran in 1994, built by Renato Nobili and Umberto Pesavento on a slightly extended version of his grid.' },
        { p: 'In the Game of Life, Andrew J. Wade built Gemini in 2010, a pattern that keeps rebuilding itself a little further on. Its two halves pass back and forth a tape of gliders that tells them what to do: each one erases its ancestor and builds a copy. The whole thing moves 5,120 cells up and 1,024 sideways every 33,699,586 generations. Gemini remains a spaceship, with a single copy at a time. On 23 November 2013, Dave Greene built the first true replicator in the Game of Life: its number of copies grows with every cycle, of about 237 million generations.' },
        { p: 'In neighbouring rules, it is much simpler. In 1994, Nathan Thompson invented HighLife, B36/S23, where a 12-cell pattern copies itself on its own. And in the Replicator rule, every pattern copies itself:' },
        { figure: 'replicateurs' },
        {
          expert: 'why everything copies itself in Replicator', blocs: [
            { p: 'The rule B1357/S1357 says: a cell is alive at the next generation if and only if it has an odd number of live neighbours, whether it is alive or not. Its new state is therefore the sum of its 8 neighbours, modulo 2. Write $\\tau_v$ for the shift of the whole grid by the vector $v$. In arithmetic modulo 2, the map $F$ is a sum of shifts:' },
            { tex: tex`F = \sum_{v \in V^*} \tau_v, \qquad V^* = \{-1, 0, 1\}^2 \setminus \{(0, 0)\}.` },
            { p: 'Shifts commute with one another and, modulo 2, $(a + b)^2 = a^2 + 2ab + b^2 = a^2 + b^2$: the square of a sum is the sum of the squares. Squaring $k$ times,' },
            { tex: tex`F^{2^k} = \sum_{v \in V^*} \tau_v^{\,2^k} = \sum_{v \in V^*} \tau_{2^k v}.` },
            { p: 'After $2^k$ generations, a pattern less than $2^k$ cells across therefore reappears as 8 copies, shifted by $2^k$ cells in the 8 directions, without overlapping. This is what the figure shows at generation $16 = 2^4$. Between two powers of 2, the copies overlap, and two cells on top of each other cancel out: that is the disorder you see going by.' },
          ],
        },
      ],
    },
    {
      id: 'ouvert', titre: 'What we do not know', blocs: [
        { p: 'Some questions held out for a long time. In 1970, Conway asked whether a pattern could grow forever: settled within a month. In 1972, he asked whether there is a pattern with a parent but no grandparent: settled in 2016. It took until 2023 to know that every oscillator period exists. Others are still open:' },
        {
          liste: [
            '*The immovable object.* Is there a finite pattern whose central cell will never change state, whatever is placed around it? Conway asked in 1972.',
            '*The glider-proof object.* Is there a finite pattern that destroys any glider coming from infinity, from any direction, without its own evolution being changed?',
            '*The smallest orphan.* The smallest known pattern with no predecessor has 57 cells; nobody knows whether smaller ones exist.',
          ],
        },
        {
          expert: 'grandparents, formally', blocs: [
            { p: 'Write $X = \\{0, 1\\}^{\\mathbb{Z}^2}$ for the set of configurations. A finite pattern has a parent if it appears in a configuration of $F(X)$, a grandparent if it appears in $F^2(X)$, and so on. In May 2016, an enthusiast known as mtve found a pattern with a parent but no grandparent. In 2022, Ilkka Törmä and Ville Salo proved something much stronger:' },
            { tex: tex`\forall n \in \mathbb{N},\ \exists P : \quad P \text{ appears in } F^n(X) \text{ but not in } F^{n+1}(X).`, etroit: tex`\begin{gathered} \forall n \in \mathbb{N},\ \exists P : \\[4pt] P \text{ appears in } F^n(X) \\ \text{but not in } F^{n+1}(X) \end{gathered}` },
            { p: 'In other words, the decreasing sequence $X \\supseteq F(X) \\supseteq F^2(X) \\supseteq \\cdots$ never settles: every extra generation rules out new patterns.' },
          ],
        },
      ],
    },
  ],

  calcul: [
    {
      id: 'signaux', titre: 'Gliders as signals', blocs: [
        { p: 'To compute, you need signals that travel and gates that combine them. In the Game of Life, the simplest signal is a stream of gliders: a glider present means 1, a glider missing means 0. A Gosper gun fires one every 30 generations. It is both a clock and a source of 1s that never stops.' },
        { p: 'Two gliders crossing at right angles can annihilate each other without a trace, if they meet at the right moment. Let a gun’s stream cross a signal A. Where A carries a glider, both vanish; where A has none, the gun’s glider goes through. What comes out is the opposite of A: a NOT gate.' },
        { figure: 'porte' },
        { p: 'The figure runs on the same engine as the simulation. The positions of the two guns were found by a systematic search, then checked on nearly 200 random bits. The *eater*, a 7-cell still life, swallows every glider that hits it and rebuilds itself within a few generations.' },
        { p: 'The same collision gives the other gates: you only need to change what crosses what.' },
        {
          expert: 'the algebra of collisions', blocs: [
            { p: 'Write $x$ and $y$ for the presence (1) or absence (0) of a glider in two streams, in the same slot. After the crossing, each stream keeps only the gliders that found no partner:' },
            { tex: tex`x' = x \wedge \neg y, \qquad y' = y \wedge \neg x.` },
            { p: 'A gun supplies the constant stream $1$. Crossed with $x$, it outputs $\\neg x$ on its own lane: this is the figure. Now let this stream $\\neg x$ cross a third stream $y$. What is left of $y$ is' },
            { tex: tex`y \wedge \neg(\neg x) = x \wedge y,` },
            { p: 'an AND gate. With NOT and AND, every logical function can be written, for instance $x \\lor y = \\neg(\\neg x \\wedge \\neg y)$. To assemble a real circuit, you still need to duplicate a signal, delay it, and let two streams cross without touching. Other collisions and other patterns take care of that.' },
          ],
        },
      ],
    },
    {
      id: 'memoire', titre: 'A sliding memory', blocs: [
        { p: 'Gates are not enough: a computer must also store numbers, as large as needed. Conway keeps them in a block, the 2 × 2 still life. The number is the distance from the block to a fixed point, counted diagonally. A well-tuned salvo of gliders pushes the block one step; another pulls it back one step.' },
        { p: 'In Conway’s construction, 2 gliders pulled the block by three cells, and it took 30 to push it back as far. On 1 March 1990, Dean Hickerson described something far cheaper: a salvo of 2 gliders pulls the block by one cell, a salvo of 3 pushes it by one cell. This is the *sliding block memory*. To know whether the counter is zero, a glider is fired across the zero position: it either hits the block or goes through.' },
        { p: 'With counters, anything can be computed. Marvin Minsky showed it in the 1960s: a machine that can only add 1 to a counter, or take 1 away and jump elsewhere if it is zero, does everything a Turing machine does, and two counters are enough. Here is one. Each counter is a block on its rail:' },
        { figure: 'minsky' },
        { p: 'All that is left is to translate everything into gliders. Each counter becomes a sliding block, each instruction a salvo, and the program a circuit of gates that picks the next salvo according to the answer of the zero test. This is the argument of the last chapter of *Winning Ways for your Mathematical Plays*, in 1982: the Game of Life contains a universal computer.' },
        {
          expert: 'from the Turing machine to the Game of Life', blocs: [
            { p: 'The proof is a chain of simulations. Each arrow reads “can be simulated by”:' },
            { tex: tex`\text{Turing machine} \to \text{2 stacks} \to \text{3 counters} \to \text{2 counters} \to \text{Game of Life}`, etroit: tex`\begin{gathered} \text{Turing machine} \to \text{2 stacks} \\[2pt] \to \text{3 counters} \to \text{2 counters} \\[2pt] \to \text{Game of Life} \end{gathered}` },
            { p: '*From tape to stacks.* Cut the tape in two where the head is. Each half is a stack of symbols; moving the head means taking a symbol off one stack and putting it on the other.' },
            { p: '*From stacks to counters.* A stack of symbols drawn from $k$ can be written as a number $n$ in base $k$. Pushing symbol $s$ replaces $n$ with $kn + s$; popping the top symbol means dividing by $k$ and keeping the remainder. These operations can be programmed with a third counter, used as scratch.' },
            { p: '*From three counters to two.* Store the three values $a$, $b$ and $c$ in a single number,' },
            { tex: tex`n = 2^a \, 3^b \, 5^c,` },
            { p: 'and use the second counter as scratch. Adding 1 to $a$ means multiplying $n$ by 2: empty the first counter into the second, adding 2 at each step, then bring it back. Testing whether $b = 0$ means testing whether $n$ is divisible by 3. It is extraordinarily slow, but exact.' },
            { p: '*From two counters to the Game of Life.* Two sliding blocks and a finite circuit of gates. The starting pattern is finite, but the blocks can move away without limit: the space used grows with the computation, like the tape of a Turing machine.' },
          ],
        },
      ],
    },
    {
      id: 'machines', titre: 'Computers in the grid', blocs: [
        { p: 'Conway’s argument proves that a computer exists; it does not draw one. Enthusiasts took over, and their machines grew with the power of the computers that simulate them.' },
        {
          frise: [
            ['1991', 'Dean Hickerson', 'builds *Primer*, a gun that fires lightweight spaceships. Other guns act as the sieve of Eratosthenes and destroy the extra spaceships: a spaceship passes the edge of the pattern at generation $120n$ if and only if $n$ is prime.'],
            ['2000', 'Paul Rendell', 'gets a Turing machine running in April, with its states, its tape and its read head.'],
            ['2002', 'Paul Chapman', 'builds a Minsky machine on Hickerson’s memory, then extends it into a universal register machine.'],
            ['2006', 'Brice Due', 'completes the *OTCA metapixel*: a 2,048 × 2,048 square that behaves like a single cell of the Game of Life, or of any rule of the same kind. It takes 35,328 generations to simulate one.'],
            ['2009', 'Adam P. Goucher', 'builds a universal computer-constructor with three infinite memory tapes.'],
            ['2010', 'Paul Rendell', 'makes his machine universal: it reads on its tape the description of another machine, and runs it.'],
            ['2011', 'Paul Rendell', 'gives it an unlimited tape: two stacks built by glider collisions, which grow as long as the computation needs.'],
            ['2017', 'A team from Code Golf Stack Exchange', 'completes *Quest for Tetris*: a 16-bit processor, with its assembler and compiler, that runs a game of Tetris. The pattern measures nearly 3 million cells by over 10 million.'],
          ],
        },
        { p: 'The Tetris is built in layers. OTCA metapixels simulate a variant of the Game of Life where each cell can follow its own rule. In that variant, logic gates are built; with the gates, a processor; for the processor, an assembly language, then a small programming language, in which the game is written.' },
        { p: 'The metapixel also lets the Game of Life simulate itself: a grid of metapixels behaves like a Game of Life grid, 2,048 times larger and 35,328 times slower. You can start again with that grid, and so on.' },
      ],
    },
    {
      id: 'limites', titre: 'What can never be predicted', blocs: [
        { p: 'A universal computer inherits a famous limit. In 1936, Alan Turing proved that no program can tell, for every program and every input, whether the computation will eventually stop. The Game of Life inherits it in turn.' },
        { p: 'Take any Turing machine and build the pattern that simulates it, with one addition: when the machine stops, the pattern fires a glider towards a distant cell that nothing else touches. That cell will light up one day if and only if the machine stops. An algorithm that predicted the future of any cell would solve the halting problem: so none exists. The same trick shows that one cannot tell, in general, whether a given pattern will ever appear.' },
        { p: 'Mind what this means. Each generation is easy to compute, and if the cell lights up, the simulation will eventually see it. What is impossible is to certify, in general, that it never will. Methuselahs give a foretaste: nothing in the 5 cells of the R-pentomino announces the 1,103 generations of turmoil that follow.' },
        { p: 'The Game of Life also resists shortcuts. Hashlife skips billions of generations, but only when the pattern repeats itself. In general, it is believed that no computer, even a massively parallel one, can predict the state of a cell much faster than by running the generations.' },
        {
          expert: 'undecidable, semi-decidable, P-complete', blocs: [
            { p: 'Write $F$ for the map that advances one generation. Knowing whether a finite pattern $P$ eventually becomes exactly the pattern $Q$,' },
            { tex: tex`\mathcal{A} = \big\{ (P, Q) \;:\; \exists\, t \ge 0,\ F^t(P) = Q \big\},` },
            { p: 'is *semi-decidable*: if it does, the simulation eventually shows it. But it is not decidable, and it is even a $\\Sigma^0_1$-complete problem: exactly as hard as the halting problem.' },
            { p: 'In computer science, Rice’s theorem (1953) goes further than the halting problem: every non-trivial property of the function a program computes is undecidable. The Game of Life has an informal counterpart: as soon as a question about the distant future of a pattern can read out the result of a simulated machine, it is undecidable.' },
            { p: 'With a fixed horizon, the question becomes decidable, but stays hard to parallelise. The problem “is cell $x$ alive at generation $T$?”, with $T$ written in unary, is *P-complete*. If, as conjectured, $\\mathsf{P} \\neq \\mathsf{NC}$, no parallel algorithm using a polynomial number of processors solves it in polylogarithmic time.' },
          ],
        },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'A short history', blocs: [
        {
          frise: [
            ['1940s', 'Stanisław Ulam and John von Neumann', 'lay the foundations of cellular automata. Von Neumann designs, on a 29-state grid, a machine able to reproduce itself; his work is published in 1966, completed by Arthur Burks.'],
            ['1970', 'Martin Gardner', 'presents in October, in his “Mathematical Games” column in Scientific American, the game invented by John Conway. Conway promises 50 dollars to whoever can tell whether a pattern can grow forever.'],
            ['1970', 'Bill Gosper and his MIT team', 'win the prize in November with the first glider gun.'],
            ['1971', 'Roger Banks', 'proposes the first explicit Garden of Eden, later confirmed by an exhaustive search.'],
            ['1972', 'John Conway', 'poses the grandfather problem in the newsletter *Lifeline*.'],
            ['1982', 'Berlekamp, Conway and Guy', 'sketch in *Winning Ways for your Mathematical Plays* the proof that the Game of Life can compute anything.'],
            ['1984', 'Bill Gosper', 'publishes Hashlife, which skips billions of generations on regular patterns.'],
            ['1984', 'Stephen Wolfram', 'sorts cellular automata into four classes, from order to chaos.'],
            ['1990', 'Christopher Langton', 'proposes the $\\lambda$ parameter and the image of the “edge of chaos”.'],
            ['2000', 'Paul Rendell', 'builds a working Turing machine; he turns it into a universal one in 2010.'],
            ['2006', 'Brice Due', 'completes the OTCA metapixel: the Game of Life simulated inside itself.'],
            ['2010', 'Andrew J. Wade', 'announces Gemini, a pattern that keeps rebuilding itself further on: the first spaceship to travel obliquely.'],
            ['2013', 'Dave Greene', 'builds on 23 November the first replicator in the Game of Life.'],
            ['2016', 'Steven Eker', 'finds in April the smallest known orphan: 57 cells, in an 8 × 12 rectangle.'],
            ['2016', 'mtve', 'solves in May the grandfather problem: a pattern with a parent but no grandparent.'],
            ['2017', 'A team from Code Golf Stack Exchange', 'runs Tetris on a processor built inside the Game of Life.'],
            ['2018', 'Adam P. Goucher', 'discovers Sir Robin, the first elementary spaceship that moves like a chess knight.'],
            ['2020', 'John Conway', 'dies on 11 April, of complications from Covid-19.'],
            ['2023', 'Nico Brown, Mitchell Riley and their co-authors', 'find oscillators of period 19 and 41: the Game of Life has an oscillator of every period.'],
          ],
        },
      ],
    },
    {
      id: 'refs', titre: 'References', blocs: [
        {
          refs: [
            ['A. M. Turing, “On computable numbers, with an application to the Entscheidungsproblem”, Proceedings of the London Mathematical Society, 1936.'],
            ['H. G. Rice, “Classes of recursively enumerable sets and their decision problems”, Transactions of the American Mathematical Society 74, 1953.'],
            ['E. F. Moore, “Machine models of self-reproduction”, Proceedings of Symposia in Applied Mathematics 14, 1962.'],
            ['J. Myhill, “The converse of Moore’s Garden-of-Eden theorem”, Proceedings of the American Mathematical Society 14, 1963.'],
            ['J. von Neumann, *Theory of Self-Reproducing Automata*, ed. A. W. Burks, University of Illinois Press, 1966.'],
            ['M. L. Minsky, *Computation: Finite and Infinite Machines*, Prentice-Hall, 1967.'],
            ['E. F. Codd, *Cellular Automata*, Academic Press, 1968.'],
            ['M. Gardner, “Mathematical Games: the fantastic combinations of John Conway’s new solitaire game ‘life’”, Scientific American 223, October 1970.'],
            ['E. R. Berlekamp, J. H. Conway and R. K. Guy, *Winning Ways for your Mathematical Plays*, Academic Press, 1982.'],
            ['R. W. Gosper, “Exploiting regularities in large cellular spaces”, Physica D 10, 1984.'],
            ['S. Wolfram, “Universality and complexity in cellular automata”, Physica D 10, 1984.'],
            ['C. G. Langton, “Self-reproduction in cellular automata”, Physica D 10, 1984.'],
            ['D. Hickerson, “Description of sliding block memory”, 1990.', 'https://conwaylife.com/ref/lifepage/patterns/sbm/sbm.html'],
            ['C. G. Langton, “Computation at the edge of chaos: phase transitions and emergent computation”, Physica D 42, 1990.'],
            ['M. Mitchell, P. Hraber and J. P. Crutchfield, “Revisiting the edge of chaos: evolving cellular automata to perform computations”, 1993.', 'https://arxiv.org/abs/adap-org/9303003'],
            ['U. Pesavento, “An implementation of von Neumann’s self-reproducing machine”, Artificial Life 2, 1995.'],
            ['P. Rendell, “A fully universal Turing machine in Conway’s Game of Life”, Journal of Cellular Automata 8, 2013.'],
            ['P. Rendell, *Turing Machine Universality of the Game of Life*, Springer, 2015.'],
            ['T. Rokicki, “An algorithm for compressing space and time”, Dr. Dobb’s Journal, 2006.', 'https://www.drdobbs.com/cpp/an-algorithm-for-compressing-space-and-t/184406478'],
            ['N. Johnston, “Generating sequences of primes in Conway’s Game of Life”, 2009.', 'https://njohnston.ca/2009/08/generating-sequences-of-primes-in-conways-game-of-life/'],
            ['N. Johnston, “Spaceship speed limits in ‘B3’ Life-like cellular automata”, 2009.', 'https://njohnston.ca/2009/10/spaceship-speed-limits-in-life-like-cellular-automata/'],
            ['“Build a working game of Tetris in Conway’s Game of Life”, Code Golf Stack Exchange, 2017.', 'https://codegolf.stackexchange.com/questions/11880/build-a-working-game-of-tetris-in-conways-game-of-life'],
            ['V. Salo and I. Törmä, “What can oracles teach us about the ultimate fate of life?”, 2022.', 'https://arxiv.org/abs/2202.07346'],
            ['N. Brown, C. Cheng, T. Jacobi, M. Karpovich, M. Merzenich, D. Raucci and M. Riley, “Conway’s Game of Life is omniperiodic”, 2023.', 'https://arxiv.org/abs/2312.02799'],
            ['Wikipedia, “Conway’s Game of Life”.', 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'],
            ['Wikipedia, “Garden of Eden (cellular automaton)”.', 'https://en.wikipedia.org/wiki/Garden_of_Eden_(cellular_automaton)'],
            ['Wikipedia, “Life-like cellular automaton”.', 'https://en.wikipedia.org/wiki/Life-like_cellular_automaton'],
            ['Wikipedia, “Replicator (cellular automaton)”.', 'https://en.wikipedia.org/wiki/Replicator_(cellular_automaton)'],
            ['Wikipedia, “P-complete”.', 'https://en.wikipedia.org/wiki/P-complete'],
            ['D. Eppstein, “Replicators: B36/S23 (HighLife)”.', 'https://ics.uci.edu/~eppstein/ca/replicators/b36s23.html'],
            ['LifeWiki, “Gemini”.', 'https://conwaylife.com/wiki/Gemini'],
            ['LifeWiki, “R-pentomino”.', 'https://conwaylife.com/wiki/R-pentomino'],
            ['LifeWiki, “Problem” (open questions).', 'https://conwaylife.com/wiki/Problem'],
          ],
        },
      ],
    },
  ],

  figures: {
    destins: [
      ['It dies', 'Seven cells, gone in 45 generations.'],
      ['It settles', 'Nine cells, frozen after 53 generations.'],
      ['It oscillates', 'The pulsar comes back identical every 3 generations.'],
      ['It travels', 'The glider moves one cell diagonally every 4 generations.'],
    ],
    voisinage: {
      groupe: 'The central cell and its eight neighbours',
      centre: 'Central cell',
      voisine: 'Neighbour',
      legende: 'The circled cell and its eight neighbours. Click to bring a cell to life or kill it.',
      compte: (n) => (n === 1 ? '1 live neighbour' : `${n} live neighbours`),
      verdict: (centre, n, suivant) => {
        if (centre && suivant) return 'Alive, it survives.'
        if (centre) return n < 2 ? 'Alive, it dies of loneliness.' : 'Alive, it dies of overcrowding.'
        return suivant ? 'Dead, it is born.' : 'Dead, it stays dead.'
      },
    },
    planeur: {
      legende: 'The glider’s first five generations. At generation 2, it is the mirror image of generation 0 across a diagonal; at generation 4, it is back to its shape, shifted one cell diagonally (dashed: its starting position).',
      phase: (g) => `Glider, generation ${g}`,
      gen: (g) => `gen ${g}`,
    },
    canon: {
      label: 'Gosper’s gun at work: a glider comes out every 30 generations.',
      legende: 'Gosper’s glider gun: two shuttles go back and forth between two blocks, and fire a glider every 30 generations.',
      titre: 'Population of Gosper’s gun',
      axeX: 'generations',
      axeY: 'cells',
      premier: 'first glider (gen 15)',
      info: (g, p) => `generation ${g}: ${p} cells`,
      resume: 'Curve of the population of Gosper’s gun over 600 generations: it oscillates but climbs steadily, by about 5 cells every 30 generations.',
      donnees: 'Show the data',
      colGen: 'Generation',
      colPop: 'Cells',
    },
    saut: {
      titre: 'Jumping ahead in time with Hashlife',
      motif: 'Pattern',
      noms: { gosper: 'Gosper glider gun', gland: 'Acorn', ligne39: '39-cell line' },
      generations: 'Generations',
      calculer: 'Compute',
      enCours: 'Computing…',
      attente: 'Pick a pattern and a number of generations, then run the computation.',
      resume: (nom, gen, pop) => `${nom} at generation ${gen}: ${pop} cells, seen in full.`,
      colGen: 'Generation',
      colPop: 'Live cells',
      colTemps: 'Computation time',
      colNoeuds: 'Distinct squares in memory',
      ms: (n) => `${n} ms`,
    },
    jumeaux: {
      titres: ['The central square is empty', 'A single cell in the centre'],
      legende: 'Same random surroundings, and a 5 × 5 square in the centre: empty on the left, with a single cell on the right (in green).',
      depart: 'Generation 0: the two grids differ by a single cell.',
      identiques: (g) => (g > 1 ? `Generation ${g}: the two grids are still identical.` : 'Generation 1: the two grids are identical, everywhere.'),
      differentes: (g) => `Generation ${g}: the grids differ.`,
      unPas: 'One generation',
      autre: 'Other surroundings',
    },
    soupes: {
      titre: 'Final density of a random soup',
      champ: 'Mean field (independent cells)',
      mesure: 'Simulation',
      axeX: 'starting density',
      axeY: 'final density',
      info: (p, valeurs) => `start ${p}: ${valeurs.map(([nom, v]) => `${nom.split(' (')[0].toLowerCase()} ${v}`).join(', ')}`,
      resume: 'Final density against starting density: the mean field predicts 37% in the middle, the simulation gives about 3%.',
      lancer: 'Run the experiment',
      relancer: 'Run again',
      attente: '38 soups of 128 × 128 cells on a torus, 2,000 generations each: a few seconds, in your browser.',
      calcul: (k, n) => `Computing: ${k} soups out of ${n}`,
      donnees: 'Show the data',
      colDepart: 'Starting density',
      colMesure: 'Simulation',
      colChamp: 'Mean field',
    },
    lambda: {
      titre: 'The λ parameter of two-state rules',
      valeur: (n, v) => `${n}/512 ≈ ${v}`,
      label: (nom) => `A 40 × 40 random soup under the ${nom} rule`,
      etat: (nom, texte) => `${nom}, ${texte}`,
      legende: 'Click a rule to see it at work. The starting soup is the same for all of them: 40 × 40 cells, 40% of them alive. The bar shows λ, from 0 to 1.',
    },
    replicateurs: {
      titres: ['HighLife (B36/S23): a 12-cell pattern', 'Replicator (B1357/S1357): the R-pentomino'],
      legende: 'On the left, the pattern splits in two in 12 generations, then each copy copies itself in turn: 8 copies at generation 84. On the right, at generation 16, the R-pentomino is there 8 times, 16 cells away in each direction.',
    },
    porte: {
      label: 'A NOT gate made of gliders: a gun’s stream crosses signal A and only goes through where A is empty.',
      reperes: { canon: 'gun: only 1s', signal: 'signal A', sortie: 'output: NOT A', mangeur: 'eater' },
      entree: 'Input A',
      lue: 'Output read',
      bit: (i, b) => `Input bit ${i}: ${b}. Click to change it.`,
      bitLu: (i, b) => `Output bit ${i}: ${b}`,
      attente: 'Waiting for the next pass',
      legende: 'Top left, a Gosper gun; top right, its mirror image, which carries signal A. The 8 input bits loop around; click to change them. To send a 0, the glider is removed as it leaves its gun. The output is read in the dashed square, then swallowed by the eater. After a change, the new bit takes a few seconds to arrive.',
    },
    minsky: {
      programme: 'Program',
      noms: { doubler: 'Double A', parite: 'Is A even?' },
      depart: 'At the start',
      moins: 'Decrease A',
      plus: 'Increase A',
      code: 'The program',
      rail: (r, n) => `Counter ${r}: the block is ${n} cells from zero`,
      instruction: (i) => (i.op === 'inc'
        ? `INC ${i.r}, then q${i.suite + 1}`
        : `DEC ${i.r}, then q${i.suite + 1}; if ${i.r} = 0: ${ARRETS[i.siZero]}`),
      action: (e, id, a) => {
        if (!e.dernier) return `Ready: A = ${a}, B = 0. The program starts at q1.`
        if (e.fin && id === 'doubler') return `Zero test: A = 0, the machine stops. B = ${e.B}, twice ${a}, in ${e.pas} instructions.`
        if (e.fin) return `Zero test: A = 0 at q${e.dernier.pc + 1}, halt on “${ETATS[e.fin]}”: ${a} is ${ETATS[e.fin]}.`
        const { pc, op, r } = e.dernier
        return op === 'inc'
          ? `q${pc + 1}, INC ${r}: a salvo of 3 gliders pushes block ${r} one cell.`
          : `q${pc + 1}, DEC ${r}: a salvo of 2 gliders pulls block ${r} one cell.`
      },
      unPas: 'One instruction',
      lancer: 'Run',
      pause: 'Pause',
      recommencer: 'Start over',
      legende: 'Two instructions only: INC adds 1 to a counter; DEC takes 1 away, or jumps elsewhere if it is already 0. The dark cell marks the position of the block, counted from the leftmost cell. The salvos shown are those of Dean Hickerson’s memory.',
    },
  },
}

// How counter machines can halt
const ARRETS = { fin: 'halt', pair: 'halt, “even”', impair: 'halt, “odd”' }
const ETATS = { pair: 'even', impair: 'odd' }
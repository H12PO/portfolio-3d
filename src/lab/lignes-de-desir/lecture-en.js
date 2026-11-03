// ============================================================
//  ARTICLES IN ENGLISH: Understand, Theory, Applications, Computation,
//  History and references, plus the texts of figures and scenario cards.
//  Same structure as lecture-fr.js.
// ============================================================

const tex = String.raw

export const LECTURE_EN = {
  comprendre: [
    {
      id: 'idee', titre: 'Trails nobody drew', blocs: [
        { p: 'On almost every park or campus lawn, a strip of bare earth cuts diagonally across what the architect laid out at right angles. Planners call it a *desire line*: the route people really want to take, drawn by their feet.' },
        { p: 'Nobody drew it. Each passer-by only wants to get where they are going without too much effort. But their steps wear the grass, and worn grass attracts the next passer-by: people walk more readily where others have already walked. Within a few days, a trail exists. It is a loop that reinforces itself, held back by grass growing back.' },
        { p: 'In 1997, the physicist Dirk Helbing and his colleagues put this loop into equations, with *active walkers*: walkers who change the ground, and whom the ground changes in return. Their model reproduces the trails of real campuses, and shows that these networks are neither the shortest nor the most direct: they are compromises.' },
        { p: 'The same loop exists in ants, which mark the ground with a scented substance, a *pheromone*, and follow that of others. The explorer brings together three models: Helbing’s active walkers, walkers who compute the least tiring route, and ants.' },
      ],
    },
    {
      id: 'regle', titre: 'The rules of the game', blocs: [
        { p: 'The ground is cut into 50 cm cells: grass, paved paths, buildings, fences, trees. Walkers enter through a door and head for another, drawn at random according to how popular each one is. Then, at each step:' },
        {
          liste: [
            'the walker turns towards their destination: straight ahead if they can see it, otherwise along the shortest route around obstacles;',
            'they look around, up to a distance σ (3 m by default), and the trails they see attract them, all the more as the *attraction* A is large. Their direction is a compromise between their goal and the comfort of a trail;',
            'they never walk back to reach a trail: attraction can push them sideways, not make them retreat;',
            'each of their steps wears the grass under them a little (the *wear* I); a heavily trodden cell becomes bare earth;',
            'everywhere, the grass grows back: without traffic, a trace fades within a few days (the *regrowth* T).',
          ],
        },
        { p: 'Paved paths are comfortable and also attract walkers, but they do not wear out. Buildings, fences and trees block the way. One simulated day packs all the day’s passages into a thousand computation steps.' },
      ],
    },
    {
      id: 'lire', titre: 'Reading the explorer', blocs: [
        { p: 'Seen from above, fresh grass is green and bare earth brown; paths are grey, buildings dark, fences pale. The yellow squares are doors, with their names. The small dots are walkers. The *Walkers* button colours them by type: hurried in orange, ordinary in white, strollers in blue.' },
        { p: 'With ants, the nest is a blue square and the food an orange square. The ground shows both pheromones: in blue the trail that leads to the nest, in orange the one that leads to the food. Loaded ants are yellow.' },
        { p: 'The curves track four measures. *Trails*: the area of grass worn down to the earth. *Detour*: how much further than the shortest route the latest arrivals walked. *Comfort*: the share of their trip made on a trail or a path. *Walking*: the walkers on the ground. With ants: loads brought back to the nest, the share of loaded ants and, on the double bridge, the share of passages through branch A.' },
        { p: '*3D* shows the same ground in relief: grass bends where people walk. The tools (in 2D) let you place doors and draw paths, buildings or fences, and *Pave the trails* does what an architect does who waits to see where people walk before building the paths.' },
        { p: 'Here are the scenarios, one by one: the question, the rules, what to watch, and what happens. The images were computed in advance with the explorer’s engine.' },
      ],
    },
    { id: 'sc-square', titre: '1. The square', blocs: [{ fiche: 'square' }] },
    { id: 'sc-campus', titre: '2. The campus', blocs: [{ fiche: 'campus' }] },
    { id: 'sc-trois', titre: '3. Three doors', blocs: [{ fiche: 'trois' }] },
    { id: 'sc-quatre', titre: '4. Four doors', blocs: [{ fiche: 'quatre' }] },
    { id: 'sc-anneau', titre: '5. Ten points on a circle', blocs: [{ fiche: 'anneau' }] },
    { id: 'sc-repousse', titre: '6. The grass grows back', blocs: [{ fiche: 'repousse' }] },
    { id: 'sc-types', titre: '7. Hurried and strollers', blocs: [{ fiche: 'types' }] },
    { id: 'sc-pointe', titre: '8. Rush hours', blocs: [{ fiche: 'pointe' }] },
    { id: 'sc-aeroport', titre: '9. The airport hall', blocs: [{ fiche: 'aeroport' }] },
    { id: 'sc-effort', titre: '10. Least effort', blocs: [{ fiche: 'effort' }] },
    { id: 'sc-pont', titre: '11. The double bridge', blocs: [{ fiche: 'pont' }] },
    { id: 'sc-pontInegal', titre: '12. The unequal bridge', blocs: [{ fiche: 'pontInegal' }] },
    { id: 'sc-fourragement', titre: '13. Foraging', blocs: [{ fiche: 'fourragement' }] },
    {
      id: 'retenir', titre: 'What to remember', blocs: [
        { p: 'A trail is born from a loop: people walk where others have walked, and by walking they make the way more attractive. Regrowing grass does the sorting: only trails used often enough survive.' },
        { p: 'The resulting network is neither that of direct routes (too much trampled area) nor the shortest possible network (too many detours): it is a compromise, set by the strength of attraction against regrowth. In ants, the same loop picks one branch of a bridge, most often the shortest. The *Theory* tab explains why.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'helbing', titre: 'The active walker model', blocs: [
        { p: 'Helbing, Keltsch and Molnár (1997) describe the ground by a field $G(\\mathbf r, t)$: the “ground structure”, which measures how trampled the grass is at each point. It returns to its natural state $G_0$ with a characteristic time $T$ (regrowth), and each walker $\\alpha$ marks it where they pass, less so the closer it already is to its maximum value $G_{\\max}$:' },
        { tex: tex`\frac{dG(\mathbf r,t)}{dt} = \frac{1}{T(\mathbf r)}\big[G_0(\mathbf r) - G(\mathbf r,t)\big] + I(\mathbf r)\Big[1 - \frac{G(\mathbf r,t)}{G_{\max}(\mathbf r)}\Big]\sum_\alpha \delta\big(\mathbf r - \mathbf r_\alpha(t)\big)`, etroit: tex`\begin{aligned}\frac{dG}{dt} =\ & \frac{1}{T}\big[G_0 - G\big]\\ & + I\Big[1 - \frac{G}{G_{\max}}\Big]\sum_\alpha \delta(\mathbf r - \mathbf r_\alpha)\end{aligned}` },
        { p: 'A walker does not see the ground cell by cell: they see the trails around them, less sharply the further away they are. The *trail potential* is the ground seen at distance $\\sigma$:' },
        { tex: tex`V_{\text{tr}}(\mathbf r_\alpha, t) = \int d^2 r\ e^{-\|\mathbf r - \mathbf r_\alpha\|/\sigma}\ G(\mathbf r, t)` },
        { p: 'Their walking direction combines the direction of their goal $\\mathbf d_\\alpha$ and the slope of this potential, which pulls them towards nearby trails:' },
        { tex: tex`\mathbf e_\alpha = \frac{\hat{\mathbf u}_\alpha + \nabla V_{\text{tr}}(\mathbf r_\alpha, t)}{\big\|\hat{\mathbf u}_\alpha + \nabla V_{\text{tr}}(\mathbf r_\alpha, t)\big\|}, \qquad \hat{\mathbf u}_\alpha = \frac{\mathbf d_\alpha - \mathbf r_\alpha}{\|\mathbf d_\alpha - \mathbf r_\alpha\|}, \qquad \frac{d\mathbf r_\alpha}{dt} = v_\alpha^0\, \mathbf e_\alpha`, etroit: tex`\begin{aligned}\mathbf e_\alpha &\propto \hat{\mathbf u}_\alpha + \nabla V_{\text{tr}}(\mathbf r_\alpha, t)\\ \hat{\mathbf u}_\alpha &= \frac{\mathbf d_\alpha - \mathbf r_\alpha}{\|\mathbf d_\alpha - \mathbf r_\alpha\|}, \quad \dot{\mathbf r}_\alpha = v_\alpha^0\, \mathbf e_\alpha\end{aligned}` },
        { figure: 'regle' },
        { p: 'In the explorer, $G$ goes from 0 (fresh grass) to 1 (bare earth). The *comfort* of a cell is $G$ on grass and 1 on a paved path: a path attracts like a perfect trail. The potential is the average comfort weighted by a bell of width $\\sigma$ (a Gaussian rather than an exponential, see *Computation*), and the attraction $A$ sets the weight of its slope against the goal:' },
        { tex: tex`\mathbf e_\alpha \propto \hat{\mathbf u}_\alpha + A\,\sigma\,\nabla \tilde V(\mathbf r_\alpha), \qquad \tilde V = \text{comfort seen at distance } \sigma`, etroit: tex`\mathbf e_\alpha \propto \hat{\mathbf u}_\alpha + A\,\sigma\,\nabla \tilde V(\mathbf r_\alpha)` },
        { p: 'How many passages does it take for a trail to hold? Each day the grass grows back, then $n$ passers-by each wear the share $I$ of what is left. Wear settles where the two balance:' },
        { tex: tex`G^\ast = \frac{1 - (1-I)^n}{1 - (1-I)^n\, e^{-1/T}}`, etroit: tex`G^\ast = \frac{1 - (1-I)^n}{1 - (1-I)^n e^{-1/T}}` },
        { figure: 'usure' },
        { p: 'The potential explains why a trail attracts from a distance. In cross-section, a 1.5 m trail is a step; seen at distance $\\sigma$, it becomes a gentle bump, and its slope pushes towards it from both sides.' },
        { figure: 'potentiel' },
      ],
    },
    {
      id: 'regimes', titre: 'Direct, minimal, or in between', blocs: [
        { p: 'Helbing and his colleagues show that, after rescaling, the model depends on only two dimensionless numbers. The first, written $\\kappa$, measures the strength of the ground’s memory: it grows with the wear $I$ and the lifetime $T$ of traces, and decreases as the visibility $\\sigma$ increases. The second compares walking speed with $\\sigma / T$; they keep it fixed.' },
        {
          liste: [
            '*small κ*: traces fade before they count. Everyone follows their direct route: a *direct way system*, which tramples a lot of area.',
            '*large κ*: traces last and attract strongly. Routes bundle into the shortest network linking all the doors, a *minimal way system*, at the cost of large detours.',
            '*in between*: a *minimal detour system*, a compromise. According to the authors, this is what forms for realistic parameters: the evolution stops before the minimal network.',
          ],
        },
        { figure: 'regimes' },
        { p: 'To measure this compromise, we thin the trails down to a one-cell line and measure their total length, along with the walkers’ average detour. The result is compared with two geometric networks linking the three doors: the *minimum spanning tree* (two of the three sides) and the *Steiner tree* (three branches meeting at one point).' },
        { figure: 'compromis' },
        { p: 'In our simulations (10 days, 500 passages a day, 2 runs per point), from attraction 0 to attraction 12, the trail network gets about 13% shorter, while the average detour goes from 0 to 8.5%. The Steiner tree would be 42% shorter than the direct routes, but would impose a 15.5% detour on average; the minimum spanning tree, 33% shorter, a 33% detour. Our walkers stay much closer to the direct routes: they accept a small detour, not a large one.' },
        { p: 'With four doors, the length does not fall steadily: around an attraction of 2 or 3, parallel trails coexist before merging, and the network grows longer (426 m against 301 m without attraction); beyond that, it gets shorter (255 m at attraction 12), for a 14% detour. The authors sum up this behaviour with a conjecture: the network that forms would be the shortest among those that respect a certain accepted detour.' },
      ],
    },
    {
      id: 'reseaux', titre: 'What trails optimise', blocs: [
        { p: 'Linking three points by the shortest network is an old problem. Pierre de Fermat put it to Evangelista Torricelli around 1640: where should one place a point whose sum of distances to the three vertices of a triangle is smallest? Answer: at the point where the three segments make 120° angles with one another (if no angle of the triangle exceeds 120°).' },
        { figure: 'steiner' },
        { p: 'With more points, the shortest network may need several junction points, always at 120°: this is the *Steiner tree*. Finding it is very hard: the problem is *NP-hard*, and no known algorithm solves it quickly for many points. Trails compute nothing: they approach a compromise by trial and reinforcement.' },
        {
          expert: 'the Steiner ratio', blocs: [
            { p: 'The minimum spanning tree (linking the points by segments between them, with no added point) is easy to compute. How much shorter can the Steiner tree be? Gilbert and Pollak conjectured in 1968 that the ratio never falls below $\\sqrt 3/2 \\approx 0.866$, the value reached by the equilateral triangle:' },
            { tex: tex`\frac{L_{\text{Steiner}}}{L_{\text{spanning tree}}} \ \ge\ \frac{\sqrt 3}{2}` },
            { p: 'A proof was announced in 1990, but Ivanov and Tuzhilin showed in 2012 that it had a gap: the conjecture remains open. For our three doors, almost an equilateral triangle, the ratio is 0.867.' },
          ],
        },
        { p: 'But the shortest network is not what walkers want. Each pays the detour of their own trip; total length only matters to the gardener. A real trail network arbitrates between two costs: the trampled area (or the area to maintain) and the time each person loses. It is a two-objective problem, and attraction sets the price each walker is willing to pay for more comfortable ground.' },
        { p: 'The German architect Frei Otto studied such networks with wet wool threads: stretched between points with a little slack, the soaked threads stick to one another as they come out of the water, and draw a network that bundles routes without lengthening them too much. The *Ten points on a circle* scenario is inspired by this.' },
      ],
    },
    {
      id: 'effort', titre: 'Least effort and the eikonal equation', blocs: [
        { p: 'Helbing’s walkers only see nearby trails. Imagine instead walkers who know the whole ground, and choose the least tiring route. Walking in grass costs 1 per metre; on a well-worn trail or a path, a little less: $1 - e$, where $e$ is the *saving on trails* (25% by default). The cost of a route is the sum of these costs along the way.' },
        { p: 'The minimal cost $T(\\mathbf r)$ to reach a door from point $\\mathbf r$ obeys the *eikonal equation*, the same as that of a light front moving more slowly through a denser medium:' },
        { tex: tex`\big\|\nabla T(\mathbf r)\big\| = c(\mathbf r), \qquad T = 0 \text{ at the door}, \qquad c(\mathbf r) = 1 - e\,\text{comfort}(\mathbf r)`, etroit: tex`\begin{aligned}\|\nabla T(\mathbf r)\| &= c(\mathbf r), \quad T = 0 \text{ at the door}\\ c(\mathbf r) &= 1 - e\,\text{comfort}(\mathbf r)\end{aligned}` },
        { p: 'The best route goes down the slope of $T$. *Fast marching* (see *Computation*) solves this equation over the whole grid at once. As trails deepen, the cost drops on them, $T$ changes, and routes reorganise: the same loop, but with walkers who know everything.' },
        { p: 'This model accepts a detour if, and only if, it pays: with a 25% saving, a trip made entirely on trails can be a third longer than the straight line and still be worth it. In our campus simulations, these walkers wear half as many trails as Helbing’s (306 m² against 590 m²), sharper and straighter, for a 3% detour against 10%. Hughes (2002) used the same equation to describe crowds trying to arrive as early as possible.' },
      ],
    },
    {
      id: 'fourmis', titre: 'Ants and pheromones', blocs: [
        { p: 'In 1959, the biologist Pierre-Paul Grassé described how termites coordinate their building without talking to each other: work already done guides the next. He called it *stigmergy*. Ant trails are its most famous example: an ant lays a pheromone, the next ones smell it, follow it, and reinforce it.' },
        { p: 'Around 1990, Jean-Louis Deneubourg, Simon Goss and their colleagues placed a nest of Argentine ants (*Linepithema humile*) and a food source on either side of a *double bridge*: two branches between them. When the branches are equal, the ants first take both about equally, then end up using only one, at random from one trial to the next. When one is shorter, most ants end up taking it.' },
        { p: 'They describe an ant’s choice by a simple function: if $A$ and $B$ ants have already used each branch, the next one takes branch A with probability' },
        { tex: tex`P_A = \frac{(k + A)^n}{(k + A)^n + (k + B)^n}` },
        { p: 'The parameter $k$ is a threshold: while few ants have passed, the choice stays almost random. The exponent $n$ says how much a small lead counts. With $n = 1$, each branch’s share drifts without ever settling; with $n > 1$, the leading branch attracts more than its share, and the system tips over. The Argentine ant data are well reproduced with $k \\approx 20$ and $n \\approx 2$.' },
        { figure: 'choix' },
        { p: 'Why does the short branch win? Ants that take it reach the food first and come back first: their trail is marked both ways before that of the long branch. The initial lead is small, but the loop amplifies it. In the explorer, an ant marks more strongly the more recently it left the nest (or the food), as in the model of Helbing, Schweitzer and their colleagues (1997): short routes receive the strongest marks.' },
        { figure: 'pont' },
        { p: 'In our simulations (12 trials per bridge), on equal branches, 6 trials chose branch A, 5 branch B, and one was still hesitating at the end. On the unequal bridge, all 12 trials chose the short branch, most in fewer than 800 steps. On open ground with several sources (*Foraging*), trails branch out from the nest like a tree, as the foraging trails of many species do.' },
      ],
    },
    {
      id: 'keller-segel', titre: 'Chemotaxis: the loop in equations', blocs: [
        { p: 'Cells that move towards a substance they produce themselves: this is *chemotaxis*. Keller and Segel (1970) described it with two equations, one for the density $\\rho$ of cells, the other for the concentration $c$ of the substance:' },
        { tex: tex`\frac{\partial \rho}{\partial t} = D_\rho \nabla^2 \rho - \chi\, \nabla\!\cdot\!\big(\rho\, \nabla c\big), \qquad \frac{\partial c}{\partial t} = D_c \nabla^2 c + \alpha \rho - \beta c`, etroit: tex`\begin{aligned}\partial_t \rho &= D_\rho \nabla^2 \rho - \chi\, \nabla\!\cdot\!(\rho\, \nabla c)\\ \partial_t c &= D_c \nabla^2 c + \alpha \rho - \beta c\end{aligned}` },
        { p: 'Cells wander ($D_\\rho$) and climb the slope of $c$ ($\\chi$); they produce the substance ($\\alpha$), which spreads ($D_c$) and disappears ($\\beta$). These are exactly the ingredients of our trails: walkers who follow the slope of a field ($\\chi$, our attraction), which they create as they pass ($\\alpha$, our wear), and which fades ($\\beta$, the inverse of our regrowth time).' },
        {
          expert: 'when the loop wins', blocs: [
            { p: 'Start from a uniform state $\\rho_0$, $c_0 = \\alpha \\rho_0 / \\beta$, and perturb it with a small wave $e^{i k x + \\lambda t}$. Linearising gives:' },
            { tex: tex`(\lambda + D_\rho k^2)(\lambda + D_c k^2 + \beta) = \chi\, \rho_0\, \alpha\, k^2` },
            { p: 'A perturbation grows ($\\lambda > 0$) if, and only if, $\\chi \\rho_0 \\alpha > D_\\rho (D_c k^2 + \\beta)$. For long wavelengths ($k \\to 0$), the condition becomes' },
            { tex: tex`\chi\, \alpha\, \rho_0 \ >\ D_\rho\, \beta` },
            { p: 'The loop (attraction × production × density) must beat wandering and forgetting. Otherwise, everything stays uniform; beyond it, the cells aggregate. This is the analogue of Helbing’s number $\\kappa$: below a threshold, no trail; above it, the loop carves out routes.' },
          ],
        },
      ],
    },
    {
      id: 'boucle', titre: 'The same loop, everywhere', blocs: [
        { p: 'Trails, ant trails, clusters of cells: each time, individuals leave a trace, the trace guides the next ones, and forgetting (regrowth, evaporation, decay) erases what is no longer used. Reinforcement amplifies small differences; forgetting makes it possible to change one’s mind. Without forgetting, the first trail to appear would stay forever; without reinforcement, none would form.' },
        { p: 'This loop solves problems. The slime mould *Physarum polycephalum* reinforces the tubes where its protoplasm flows most and lets the others wither; Tero and his colleagues (2010) grew it between oat flakes placed like the cities around Tokyo, and it wove a network comparable to the rail network, in efficiency as in robustness. It will be a separate project in this lab.' },
        { p: 'Computer scientists copied the loop: *ant colony optimisation* algorithms (Dorigo and his colleagues, from 1991) send virtual ants across a graph, reinforce the edges of good routes and let the others evaporate. They find good solutions to the travelling salesman problem and to routing problems.' },
      ],
    },
  ],

  applications: [
    {
      id: 'urbanisme', titre: 'Drawing the paths afterwards', blocs: [
        { p: 'An idea often comes back among landscape designers: sow grass everywhere, wait, then pave where people have walked. Several universities are said to have done so; it is in any case the explorer’s *Pave the trails* button. Helbing and his colleagues proposed their model as a tool for planners: knowing the entrances, destinations and how busy they are is enough to predict desire lines before building anything.' },
        { p: 'Trails appear quickly. A 1988 hiking guide (*Soft Paths*, by Hampton and Cole) estimates that around fifteen passages can be enough to mark a visible trail. In 2014, Virginia Tech decided to pave the dirt paths worn across the *Drillfield*, its large central lawn. In Detroit, where whole neighbourhoods emptied, more than 240 km of desire lines were counted across abandoned lots.' },
        { p: 'The model also explains why a badly placed path is not enough to protect a lawn: if it imposes too large a detour, the attraction of its comfort does not make up for it, and the shortcut gets carved next to it. A fence moves the problem more than it solves it: people go through its gaps.' },
      ],
    },
    {
      id: 'campus', titre: 'Helbing’s campuses', blocs: [
        { p: 'The 1997 article opens with a photo of the University of Stuttgart campus at Vaihingen: straight or slightly curved trails between paved paths at right angles. The authors note two kinds of nodes: crossings of straight trails, and junctions where trails merge smoothly. They also compare their simulation with the trails of the Brasília campus, and the resemblance is striking.' },
        { p: 'The explorer’s *Campus* scenario takes up this situation: buildings, orthogonal paths, a station in a corner. Walkers cut corners and draw diagonals the architect had not planned.' },
      ],
    },
    {
      id: 'foules', titre: 'Stations, airports and crowds', blocs: [
        { p: 'Inside a building, the floor does not wear out in a few days, but the question is the same: where do people walk, and does the layout help or hinder them? Station and airport operators measure passenger flows to place signs, shops and queues. In the *Airport hall* scenario, floor wear plays the role of a heat map of passages.' },
        { p: 'The explorer’s walkers ignore one another: they do not jostle. For a dense crowd, forces between pedestrians must be added, the *social force model* of Helbing and Molnár (1995). That will be the subject of the *Airport crowd* project, which will reuse this one’s trails.' },
      ],
    },
    {
      id: 'algorithmes', titre: 'Ants inside computers', blocs: [
        { p: 'Ant colony algorithms transpose the double bridge: virtual ants walk across a graph, lay a pheromone that is stronger the shorter their route, and the pheromone evaporates. They are used for delivery rounds, task scheduling, or routing in telecommunication networks (AntNet, Di Caro and Dorigo, 1998).' },
        { p: 'In swarm robotics, robots imitate trails with light marks or beacons: with no map and no leader, they find and maintain routes between points of interest.' },
      ],
    },
    {
      id: 'limites', titre: 'What these models don’t say', blocs: [
        { p: 'Real passers-by do not walk on a uniform lawn: slope, mud, puddles, the view, and the fear of being noticed on forbidden grass all matter. They do not cross without seeing each other, sometimes walk in groups, and do not put their feet in exactly the same place. The model ignores all of this.' },
        { p: 'Its strength lies elsewhere: it shows that two ingredients are enough, the wish to go straight and the attraction of ground already trodden, to obtain networks that look like real ones, and that their shape depends mostly on a balance between memory and forgetting. That balance is what you set by playing with attraction and regrowth.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'grille', titre: 'The ground in cells', blocs: [
        { p: 'The ground is a grid of 50 cm cells (2.5 mm for ants): 140 × 100 cells for the square, 220 × 160 for the campus. Each cell has a type (grass, path, building, fence, tree) and a wear $G$ between 0 and 1, stored in an array of floating-point numbers.' },
        { p: 'A walker moves continuously (its coordinates are real numbers), but it wears the four cells around it, each in proportion to its closeness (*bilinear interpolation*). Without this, trails would follow the grid lines. A step wears the share $I$ of the remaining grass, in proportion to its length: $G \\leftarrow G + I\\,(1 - G)$ for an ordinary 65 cm step.' },
        { p: 'Regrowth is applied every four steps, all at once: $G \\leftarrow G\\, e^{-4/(T \\cdot 1000)}$, since a day has a thousand steps. This is exact (exponential decay composes) and four times cheaper.' },
      ],
    },
    {
      id: 'flou', titre: 'Seeing trails from afar: three box blurs', blocs: [
        { p: 'The trail potential is a weighted average of comfort around each point. Computed directly, it would cost, for each cell, a sum over all cells within a few σ: millions of operations, to be redone often. It is replaced by three successive *box blurs*: each replaces a cell by the average of its $2r + 1$ neighbours, first along rows, then along columns.' },
        { p: 'A box blur is computed with a running sum: add the cell coming in, subtract the one going out, whatever $r$ is. And three successive boxes give almost a Gaussian, by the central limit theorem: the standard deviation of three boxes of width $2r + 1$ is $\\sqrt{3\\,((2r+1)^2 - 1)/12}$, which sets $r$ to obtain $\\sigma$.' },
        { figure: 'flou' },
        { p: 'The potential is only recomputed every eight steps: trails change slowly. Its slope at the walker’s position is read by finite differences on interpolated values.' },
      ],
    },
    {
      id: 'eikonale', titre: 'The shortest route around obstacles', blocs: [
        { p: 'A walker who cannot see their door must go around the buildings. For each door, the shortest distance from every cell, avoiding obstacles, is computed once: the solution of the eikonal equation $\\|\\nabla T\\| = c$ with $c = 1$ wherever one can walk. The direction towards the door is then the downhill slope of $T$.' },
        { p: 'Sethian’s *fast marching* method (1996) computes it the way Dijkstra’s algorithm computes distances in a graph: starting from the door, always freeze the closest cell not yet frozen (a binary heap gives the smallest in $O(\\log N)$), and update its neighbours. For a cell whose two known neighbours are $a$ (along the row) and $b$ (along the column), the update solves a small quadratic:' },
        { tex: tex`T = \begin{cases} \dfrac{a + b + \sqrt{2c^2 - (a-b)^2}}{2} & \text{if } |a - b| < c \\[2mm] \min(a, b) + c & \text{otherwise} \end{cases}` },
        { p: 'Unlike Dijkstra on a grid, which only knows horizontal, vertical or diagonal steps, fast marching gives almost Euclidean distances: a circular front stays circular.' },
        { figure: 'eikonale' },
        { p: 'In the least effort model, the cost depends on comfort, which keeps changing: each door’s map is redone every 25 steps, in turn. When a door is in sight (no obstacle on the straight line, tested once and for all), the walker goes straight to it: more accurate than the map’s slope, which keeps a trace of the cells.' },
      ],
    },
    {
      id: 'fourmis', titre: 'Ants, step by step', blocs: [
        { p: 'Each ant has a position and a heading. It smells the pheromone it needs at three points in front of it: straight ahead, and 40° to the left and right, four cells away. It turns 25° towards the most marked side (at random in case of a tie), adds a little wandering, and moves one cell. Against a wall, it sets off in another direction.' },
        { p: 'While searching, it lays the “to the nest” pheromone; when returning loaded, the “to the food” pheromone. The mark is worth $e^{-\\beta t}$, where $t$ is the time since it left the nest or the food, and it only raises the cell’s value (it does not add to it). Both pheromones evaporate by 0.2% per step and spread a little to neighbouring cells every four steps.' },
        { p: 'On the double bridge, two counting zones, in the middle of each branch, record passages; the *Branch A* measure is A’s share among the last 200.' },
      ],
    },
    {
      id: 'mesures', titre: 'The measures', blocs: [
        { p: '*Trails*: the area of grass cells whose wear exceeds 45%; *Damaged grass*: those above 15%. *Detour*: for each of the latest 120 arrivals, the length walked divided by the shortest distance from their starting point (around obstacles), minus 1. *Comfort*: the share of their steps made on a comfortable cell (a path, or grass worn above 50%).' },
        { p: 'The length of a trail network (compromise figure) requires reducing each trail to a line: the mask of worn cells is thinned with the Zhang–Suen algorithm (1984), which erodes the edges of a shape without cutting it, then the steps between neighbouring skeleton cells are counted (50 cm in a straight line, 71 cm diagonally).' },
      ],
    },
    {
      id: 'worker', titre: 'Computing beside the page', blocs: [
        { p: 'The engine runs in a *Web Worker*. At each frame, the page asks for a state; the Worker advances a few steps and sends back the ground wear (one byte per cell), the walkers and the doors. Each cell’s type is only sent back when it has changed (a brush stroke, paving). Arrays pass from one thread to the other without copying (transferable objects).' },
        { p: 'The 2D drawing paints the ground into a small image of one pixel per cell, which the browser enlarges with smoothing: trails get soft edges at no extra cost. In 3D, the same image is used as the ground’s texture, and blades of grass bend where wear is high.' },
        { p: 'The scenario card images were computed in advance in Node.js with the same engine and the same seed, then compressed (*deflate*, the algorithm of .zip files): each cell’s type, wear on 4 bits, a few walkers. The page decompresses them with the browser’s own tool (*DecompressionStream*) and draws them at once. The figures marked “precomputed” (compromise, double bridge) also come from the engine, run in Node.js.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'A history of routes that draw themselves', blocs: [
        {
          frise: [
            ['around 1640', 'Pierre de Fermat', 'puts to Torricelli the problem of the point that minimises the sum of distances to the three vertices of a triangle.'],
            ['1959', 'Pierre-Paul Grassé', 'names *stigmergy* the coordination of termites through work already done.'],
            ['1968', 'Edgar Gilbert and Henry Pollak', 'study Steiner trees and conjecture the $\\sqrt 3/2$ ratio.'],
            ['1970', 'Evelyn Keller and Lee Segel', 'put the aggregation of amoebae by chemotaxis into equations.'],
            ['1989', 'Simon Goss et al.', 'show that Argentine ants find the shorter of two routes.'],
            ['1990', 'Jean-Louis Deneubourg et al.', 'describe the double bridge and the ants’ choice function.'],
            ['1991', 'Marco Dorigo et al.', 'propose the first ant colony algorithm.'],
            ['1995', 'Dirk Helbing and Péter Molnár', 'describe pedestrians with social forces.'],
            ['1996', 'James Sethian', 'publishes fast marching for tracking fronts.'],
            ['1997', 'Helbing, Keltsch and Molnár', 'model the evolution of human trail systems (*Nature*); Helbing, Schweitzer et al. extend active walkers to ants.'],
            ['2002', 'Roger Hughes', 'describes crowds as a fluid trying to arrive as early as possible (eikonal equation).'],
            ['2010', 'Atsushi Tero et al.', 'get *Physarum* to redraw the Tokyo rail network.'],
            ['2012', 'Alexander Ivanov and Alexey Tuzhilin', 'show that the 1990 proof of the Steiner ratio is incomplete.'],
            ['2014', '', 'Virginia Tech decides to pave the dirt trails worn across its *Drillfield*.'],
          ],
        },
      ],
    },
    {
      id: 'quatre-regards', titre: 'Four ways of looking at a trail', blocs: [
        { p: '*Planning and landscape.* Desire lines are a message from users to designers. Some fight them (fences, hedges), others follow them (paving afterwards). Frei Otto saw in them a design principle: let routes find themselves, then build.' },
        { p: '*Physics.* Helbing and his colleagues see systems that organise themselves, far from equilibrium, like dunes or sand ripples. They look for the few dimensionless numbers that decide the shape: here, $\\kappa$.' },
        { p: '*Biology.* Grassé, Deneubourg, Goss and others study how insects with no collective plan build nests, lay trails, choose sources. Stigmergy there is a strategy selected by evolution.' },
        { p: '*Computer science.* Dorigo and his successors turned the trace–reinforcement–forgetting loop into an optimisation method. Geometers, for their part, know that the shortest network is very hard to compute, and look with interest at these systems that find good compromises without computing anything.' },
      ],
    },
    {
      id: 'refs', titre: 'References', blocs: [
        {
          refs: [
            ['D. Helbing, J. Keltsch, P. Molnár, “Modelling the evolution of human trail systems”, *Nature*, 388, 47–50, 1997.', 'https://arxiv.org/abs/cond-mat/9805158'],
            ['D. Helbing, F. Schweitzer, J. Keltsch, P. Molnár, “Active walker model for the formation of human and animal trail systems”, *Physical Review E*, 56, 2527, 1997.', 'https://arxiv.org/abs/cond-mat/9806097'],
            ['D. Helbing, P. Molnár, “Social force model for pedestrian dynamics”, *Physical Review E*, 51, 4282, 1995.', 'https://doi.org/10.1103/PhysRevE.51.4282'],
            ['P.-P. Grassé, “La reconstruction du nid et les coordinations interindividuelles chez *Bellicositermes natalensis* et *Cubitermes* sp. La théorie de la stigmergie”, *Insectes Sociaux*, 6, 1959.'],
            ['S. Goss, S. Aron, J.-L. Deneubourg, J. M. Pasteels, “Self-organized shortcuts in the Argentine ant”, *Naturwissenschaften*, 76, 1989.'],
            ['J.-L. Deneubourg, S. Aron, S. Goss, J. M. Pasteels, “The self-organizing exploratory pattern of the Argentine ant”, *Journal of Insect Behavior*, 3, 1990.'],
            ['M. Dorigo, V. Maniezzo, A. Colorni, “Ant system: optimization by a colony of cooperating agents”, *IEEE Transactions on Systems, Man, and Cybernetics B*, 26(1), 1996.', 'https://doi.org/10.1109/3477.484436'],
            ['G. Di Caro, M. Dorigo, “AntNet: distributed stigmergetic control for communications networks”, *Journal of Artificial Intelligence Research*, 9, 1998.'],
            ['E. F. Keller, L. A. Segel, “Initiation of slime mold aggregation viewed as an instability”, *Journal of Theoretical Biology*, 26, 1970.'],
            ['J. A. Sethian, “A fast marching level set method for monotonically advancing fronts”, *PNAS*, 93, 1591–1595, 1996.', 'https://doi.org/10.1073/pnas.93.4.1591'],
            ['R. L. Hughes, “A continuum theory for the flow of pedestrians”, *Transportation Research B*, 36, 2002.'],
            ['E. N. Gilbert, H. O. Pollak, “Steiner minimal trees”, *SIAM Journal on Applied Mathematics*, 16(1), 1968.', 'https://doi.org/10.1137/0116001'],
            ['A. O. Ivanov, A. A. Tuzhilin, “The Steiner ratio Gilbert–Pollak conjecture is still open”, *Algorithmica*, 62, 2012.'],
            ['A. Tero et al., “Rules for biologically inspired adaptive network design”, *Science*, 327, 439–442, 2010.', 'https://doi.org/10.1126/science.1177894'],
            ['T. Y. Zhang, C. Y. Suen, “A fast parallel algorithm for thinning digital patterns”, *Communications of the ACM*, 27(3), 1984.', 'https://doi.org/10.1145/357994.358023'],
            ['B. Hampton, D. Cole, *Soft Paths: How to Enjoy the Wilderness Without Harming It*, 1988.'],
            ['“Desire path”, Wikipedia: examples, figures and sources on desire lines.', 'https://en.wikipedia.org/wiki/Desire_path'],
          ],
        },
      ],
    },
  ],

  /* ---------- Figure texts ---------- */

  figures: {
    regle: {
      titre: 'Between the goal and the trail',
      resume: 'A walker on a lawn, a trail passing above them, and the arrows of their direction.',
      but: 'goal',
      versBut: 'towards the goal',
      versSentier: 'pull of the trail',
      resultat: 'direction taken',
      attrait: 'Attraction A',
      sigma: 'Visibility σ',
      metres: (x) => `${x} m`,
      note: 'Drag the walker (the white circle). The yellow arrow aims at the goal, the orange one pulls towards the trail, the white one is the direction taken; the dots show the route they will follow. With zero attraction, they go straight; with strong attraction, they join the trail and follow it, then leave it when it no longer heads for their goal.',
    },
    usure: {
      titre: 'Equilibrium wear versus the number of passages',
      serie: (t) => `regrowth T = ${t} d`,
      seuil: 'trail threshold (45%)',
      axeX: 'passages per day on the same cell',
      axeY: 'equilibrium wear',
      info: (x, v) => `${x} passages per day: ${v}`,
      resume: 'Three curves rising from 0 towards 100%; the slower the regrowth, the faster they rise.',
      usure: 'Wear per passage I',
      note: 'With the default regrowth (4 days) and a wear of 0.05 per passage, about three passages a day on the same cell are enough to cross the threshold. In reality, passers-by do not put their feet in the same place: a whole trail takes many more.',
    },
    potentiel: {
      titre: 'A trail in cross-section, seen at distance σ',
      G: 'the trail (wear)',
      V: 'the trail seen at σ (potential)',
      A: 'attraction (slope of the potential)',
      axeX: 'distance from the middle of the trail (m)',
      axeY: 'value',
      info: (x, v) => `${x} m: ${v}`,
      resume: 'A step (the trail), a gentle bump (the potential), and a curve positive on the left, negative on the right (the attraction).',
      sigma: 'Visibility σ',
      metres: (x) => `${x} m`,
      note: 'The attraction is positive to the left of the trail and negative to the right: on both sides, it pushes towards it. It is strongest at about σ from the middle and vanishes on the trail. Increase σ: the trail attracts from further away, but less strongly.',
    },
    regimes: {},
    compromis: {
      titre: 'Three doors: network length versus detour',
      simulations: 'our trails (attraction 0 to 12)',
      directs: 'direct routes',
      arbre: 'minimum spanning tree',
      steiner: 'Steiner tree',
      axeX: 'network length (share of direct routes)',
      axeY: 'average detour',
      info: (x, v) => `length ${x}: ${v}`,
      resume: 'Our simulations stay close to the direct routes; the Steiner tree and the minimum spanning tree are much shorter but impose large detours.',
    },
    steiner: {
      titre: 'Linking three doors: direct, tree, Steiner',
      resume: 'Three yellow squares linked to an orange point by three trails; the sides of the triangle dashed.',
      directs: 'Direct routes',
      sansDetour: 'no detour',
      arbre: 'Minimum spanning tree',
      economie: (p) => `${p} shorter`,
      steiner: 'Steiner tree',
      detour: (p) => `average detour ${p}`,
      metres: (x) => `${x} m`,
      note: 'Drag the doors. The orange point is the Fermat point: the three trails meet there at 120°. If an angle of the triangle exceeds 120°, it sits on the door at that angle. The drawing is 40 m wide.',
    },
    choix: {
      titre: 'The ants’ choice function, trial by trial',
      resume: 'Sixteen curves starting at 50%; with n = 2, they end near 0 or 100%.',
      axeX: 'ants passed (1,000 in all)',
      finales: 'final shares',
      k: 'Threshold k',
      n: 'Non-linearity n',
      nouveau: 'Other draws',
      note: 'Each curve follows branch A’s share as ants pass, for sixteen trials; the histogram shows the final shares. With n = 1, the trials spread out without settling; with n = 2, each trial picks a branch. A larger threshold k delays the choice.',
    },
    pont: {
      titre: 'The double bridge in the explorer (12 trials per bridge)',
      resume: 'On the left, curves ending at 0 or 100%; on the right, all rising to 100%.',
      panneaux: { pont: 'Equal branches', pontInegal: 'Branch A shorter' },
      axeX: 'time (4,800 steps)',
      note: 'Share of the last 200 passages through branch A, measured every 400 steps. In green, the trials that end on A; in orange, those that end on B.',
    },
    eikonale: {
      titre: 'Fast marching: distances around obstacles',
      resume: 'A map coloured by distance to the goal, concentric bands bent by walls, and five white routes running down to it.',
      note: (max) => `Click to move the goal (the yellow square). Each colour band covers 5 cells of distance; the furthest point is ${max} cells away. The white routes go down the slope of the distance: they go around walls by the shortest way.`,
    },
    flou: {
      titre: 'Three box blurs are almost a Gaussian',
      passes: (n) => `${n} box${n > 1 ? 'es' : ''}`,
      gauss: 'Gaussian with the same standard deviation',
      axeX: 'cells',
      axeY: 'weight',
      info: (x, v) => `cell ${x}: ${v}`,
      resume: 'A rectangular box, then a triangle, then a bell almost indistinguishable from the Gaussian.',
    },
  },

  /* ---------- Scenario cards ---------- */

  fiche: {
    regles: 'The rules',
    regarder: 'What to watch',
    pourquoi: 'What happens, and why',
    realite: 'In reality',
    ouvrir: 'Open this scenario in the explorer',
    ouvrirNom: (nom) => `Open “${nom}”`,
    chargement: 'Loading…',
    erreur: 'Image unavailable in this browser.',
    note: 'Computed in advance with the explorer’s engine, seen from above. Under each image: the area of trails and the average detour of the latest arrivals (for ants: loads brought back and branch A’s share).',
    mesures: {
      sentiers: (v) => `${v} m² of trails`,
      detour: (v) => `average detour ${v}`,
      livrees: (v) => `${v} loads brought back`,
      partA: (v) => `branch A: ${v} of passages`,
    },
  },

  fiches: {
    square: {
      question: 'How long does it take for diagonals to appear?',
      regles: [
        'A 70 × 50 m lawn, edged with a path and crossed by an axis up to a fountain. A hedge all around, seven entrances.',
        '900 passages a day, from every entrance to every other, more of them through the south-east.',
        'The grass grows back in about 6 days.',
      ],
      images: { j1: 'Day 1', j6: 'Day 6' },
      regarder: [
        'On the first day, faint traces almost everywhere: everyone cuts across in their own way.',
        'Then a few diagonals deepen and attract the others: nearby traces fade.',
        'The planned paths stay in use when they go in the right direction.',
      ],
      pourquoi: [
        'The path goes around the lawn: to get from one corner to another, it imposes a detour. The first passers-by cut across, each a little differently. Overlapping traces are slightly more marked, hence slightly more attractive: they capture the next passers-by and reinforce themselves, while the others grow back.',
        'In six days, the area of trails goes from 76 to 699 m², and the average detour stays under 3%: the diagonals almost follow the straight line.',
      ],
      realite: 'This is the most common situation: squares and residential lawns where the path goes around. Gardeners then put up low chains or hedges… or end up paving the diagonal.',
    },
    campus: {
      question: 'What happens if the architect paves the desire lines?',
      regles: [
        'A 110 × 80 m campus: four buildings, paths at right angles, a station in a corner, a car park, halls of residence.',
        '700 passages a day, according to how busy each building is.',
        'After six days, the well-marked trails are paved (*Pave the trails* button), and the simulation goes on.',
      ],
      images: { avant: 'Day 6, before paving', apres: 'Day 10, four days after paving' },
      regarder: [
        'Before: diagonals between the station, the cafeteria and the lecture halls cut across the lawns.',
        'After: these diagonals have become grey paths; few new traces remain.',
      ],
      pourquoi: [
        'The original paths follow the façades, not the trips: to go from the station to the lecture halls, they impose a large detour. The trails show the real trips, with a compromise: they bundle into a few trunks rather than linking every door to every other.',
        'Once paved, they are comfortable forever and no longer grow back: walkers stay on them. The area of trails on the grass falls from 573 to 185 m², for the same detour (nearly 10%, due to the buildings that must be walked around).',
      ],
      realite: 'Helbing and his colleagues proposed to use their model this way: simulate trips before building, and place paths where people will want to walk. Their article opens with the trails of the University of Stuttgart campus at Vaihingen.',
    },
    trois: {
      question: 'What does a trail network between three doors connect?',
      regles: [
        'A bare lawn, three doors placed almost in an equilateral triangle.',
        '500 passages a day, from each door to the two others.',
        'Three identical worlds, except for the trail attraction: 0, 3 and 10.',
      ],
      images: { a0: 'Attraction 0', a3: 'Attraction 3', a10: 'Attraction 10' },
      regarder: [
        'Without attraction: three straight routes, the sides of the triangle.',
        'With medium attraction: the routes bend inwards and move closer.',
        'With strong attraction: they merge in the centre into a Y-shaped network.',
      ],
      pourquoi: [
        'Without attraction, everyone goes straight to their goal: the direct way system. With attraction, a walker who sees a nearby trail moves towards it, even if that trail goes slightly elsewhere; trails attract one another and end up sharing a common trunk. The network tends towards Steiner’s Y, which links three points by the shortest route, with branches at 120°.',
        'The price: a detour. It goes from 0 to 4%, then to 8%; the area of trails shrinks by about 17%.',
      ],
      realite: 'This is the basic thought experiment of Helbing and his colleagues: depending on the parameters, a direct system, a minimal system, or a compromise. Real lawns are most often in the compromise.',
    },
    quatre: {
      question: 'With four corners, do trails form a cross or something else?',
      regles: [
        'A bare lawn, four doors at the corners of a 48 × 40 m rectangle.',
        '500 passages a day between every pair of doors.',
        'Attraction 0, 3 and 8.',
      ],
      images: { a0: 'Attraction 0', a3: 'Attraction 3', a8: 'Attraction 8' },
      regarder: [
        'Without attraction: the four sides and the two diagonals, six straight routes.',
        'With attraction: neighbouring routes bundle; near the doors, forks appear.',
        'Y-shaped forks and X-shaped crossings: Helbing’s two kinds of nodes.',
      ],
      pourquoi: [
        'When two trips leave the same door in similar directions, they first share the same trail, then separate: a fork. When two trips cross almost at right angles, sharing gains nothing: they cross in an X.',
        'The detour rises to 7.5%, then 12%. The area does not always decrease: at attraction 3, parallel trails are still hesitating to merge.',
      ],
      realite: 'On campus photos, both shapes appear: crossings of straight trails, and junctions that merge smoothly, like tributaries.',
    },
    anneau: {
      question: 'What happens to routes between ten points arranged in a circle?',
      regles: [
        'Ten doors on a circle 54 m across, each linked to all the others.',
        '900 passages a day, attraction 2.',
      ],
      images: { j1: 'Day 1', j10: 'Day 10' },
      regarder: [
        'On the first day, a tangle of straight lines crossing everywhere.',
        'By the tenth day, a network: trunks that bundle several routes, loops, a centre often avoided.',
      ],
      pourquoi: [
        'Forty-five pairs of doors, forty-five straight lines: that would trample a lot of grass. Attraction bundles neighbouring routes into common trunks; the resulting network tramples less area per trip, at the cost of a detour of about 15%.',
      ],
      realite: 'The architect Frei Otto looked for such networks with wool threads: stretched between points with a little slack, then dipped in water, they stick to one another and draw a network that bundles routes without lengthening them too much.',
    },
    repousse: {
      question: 'Which trails survive when the grass grows back fast?',
      regles: [
        'A park with five entrances: the underground station and the school, very busy, and three quiet entrances (a kiosk, a bench, a playground).',
        '400 passages a day.',
        'Two worlds: the grass grows back in 8 days in one, in 1.5 days in the other.',
      ],
      images: { lente: 'Slow regrowth (8 days)', rapide: 'Fast regrowth (1.5 days)' },
      regarder: [
        'Slow regrowth: a complete network, down to the quiet entrances.',
        'Fast regrowth: the main trail between the station and the school, and almost nothing else.',
      ],
      pourquoi: [
        'A trail only holds if passages wear it faster than the grass grows back. Between the station and the school, passages are many: the trail always holds. Towards the bench, a few passages a day are not enough if the grass grows back fast: the trace fades before the next passage.',
        'The area of trails goes from 383 to 125 m². Regrowth does the sorting: only useful routes survive.',
      ],
      realite: 'This is why trails are sharper in a dry summer than in spring, and why a lawn closed for a few weeks erases the secondary traces, not the main ones.',
    },
    types: {
      question: 'Do the hurried and strollers wear the same trails?',
      regles: [
        'The square, with half hurried walkers (orange) and half strollers (blue).',
        'The hurried walk at 1.6 m/s, pay little attention to trails and hesitate little; strollers, at 0.9 m/s, are nearly four times more attracted by trails and hesitate more.',
      ],
      images: { types: 'Day 6: hurried (orange) and strollers (blue)' },
      regarder: [
        'The hurried cut across by the shortest route, sometimes beside the trails.',
        'Strollers follow the trails, even at the cost of a detour.',
      ],
      pourquoi: [
        'In our measurements, on the way, the hurried make about a 1% detour, strollers 6%. The former carve the shortcuts, the latter maintain them.',
        'With hurried walkers only, the square gets 748 m² of almost straight trails (0.5% detour); with strollers only, 532 m² of bundled trails, at the cost of an 8% detour.',
      ],
      realite: 'Pedestrian studies do distinguish different behaviours (hurried commuters, strollers, groups), but the explorer’s figures are modelling choices, not measurements.',
    },
    pointe: {
      question: 'Do trails change through the day?',
      regles: [
        'The campus, with varying flows: in the morning, people arrive from the station, the car park and the halls towards lectures; at noon, they go to the cafeteria; in the evening, they leave.',
        '800 passages a day, mostly at rush hours.',
      ],
      images: { matin: 'Sixth day, morning', midi: 'Sixth day, noon', soir: 'Sixth day, evening' },
      regarder: [
        'The walkers change: many in the morning and evening, in opposite directions; at noon, towards the cafeteria.',
        'The ground itself hardly changes.',
      ],
      pourquoi: [
        'Grass takes days to grow back: the ground keeps the memory of all the day’s trips, and even of previous days. Trails are the average of flows, not a snapshot of them. Their area only varies from 532 to 565 m² between morning and evening.',
      ],
      realite: 'A campus trail serves for the way there as well as the way back: it links places, not hours. That is why it can be paved once and for all.',
    },
    aeroport: {
      question: 'Where do travellers walk in an airport hall?',
      regles: [
        'A 100 × 56 m terminal: three entrances at the bottom, check-in desks, a security checkpoint with four passages, a bookshop, a café, six boarding gates at the top.',
        '1,200 passages a day, with rush hours.',
        'No grass: the floor “wears” where people walk, like a heat map.',
      ],
      images: { hall: 'Day 5' },
      regarder: [
        'Sharp corridors between the entrances and the checkpoint passages.',
        'Beyond the checkpoint, fans towards the gates, the bookshop and the café.',
      ],
      pourquoi: [
        'Obstacles decide almost everything: one has to go around the desks and through one of the four checkpoint passages. The measured detour is almost zero, because it is counted against the shortest route around obstacles: in a hall, the architecture imposes the detours, not the trails.',
      ],
      realite: 'A real terminal floor does not wear out in five days, but the question is the same for designers: placing checkpoints, shops and signs on the flows. The *Airport crowd* project will add jostling.',
    },
    effort: {
      question: 'What if walkers knew the whole ground?',
      regles: [
        'The campus, twice.',
        'On the left, Helbing’s active walkers: they see trails up to 3 m away.',
        'On the right, least effort: everyone computes the least tiring route over the whole ground, knowing that a well-worn trail costs 25% less than grass.',
      ],
      images: { helbing: 'Active walkers, day 8', effort: 'Least effort, day 8' },
      regarder: [
        'Least effort: sharper, straighter, fewer shortcuts.',
        'Active walkers: wider trails, which wave and bundle.',
      ],
      pourquoi: [
        'Active walkers only see nearby trails: they let themselves be drawn to a trail that does not quite go their way, then leave it. Least effort walkers only take a trail if it saves something over the whole trip.',
        'Result: 306 m² of trails instead of 590, and a 3% detour instead of 10%, with almost the whole trip on comfortable ground.',
      ],
      realite: 'Real passers-by are in between: they often know their route, but not the whole ground, and react to what they see. Least effort is also the basis of crowd models such as that of Hughes (2002).',
      ouvrir: ['campus', 'effort'],
    },
    pont: {
      question: 'Two identical routes: do the ants share them?',
      regles: [
        'A nest at the bottom, food at the top, two identical branches between them (A on the left, B on the right).',
        '500 ants leave the nest gradually. While searching, they mark the ground with one pheromone; when returning loaded, with another, and each follows the one that leads where it is going.',
      ],
      images: { essai1: 'First trial, after 3,000 steps', essai2: 'Second trial, after 3,000 steps' },
      regarder: [
        'At first, both branches are used about equally.',
        'Then one takes the lead, and the ants abandon the other.',
        'From one trial to the next, it is not always the same one.',
      ],
      pourquoi: [
        'A slightly more marked branch attracts slightly more ants, which mark it more: the small difference at the start, due to chance, is amplified until only one branch remains. This is *symmetry breaking*: the system is symmetric, its final state is not.',
      ],
      realite: 'This is the experiment of Deneubourg and his colleagues with Argentine ants: the ants end up converging on one branch, at random from one trial to the next.',
    },
    pontInegal: {
      question: 'If one branch is shorter, do the ants find it?',
      regles: [
        'The same bridge, but branch B makes a long detour to the right; branch A stays short.',
        'The ants measure nothing: they only follow pheromones.',
      ],
      images: { debut: 'After 400 steps', fin: 'After 3,000 steps' },
      regarder: [
        'At first, the ants take both branches.',
        'Soon, almost all go through the short branch.',
      ],
      pourquoi: [
        'Ants that took the short branch reach the food first and come back first: their return trail is marked before that of the long branch, and the outward trail more strongly, since an ant marks more the more recently it left. The loop does the rest.',
        'In our 12 trials, the short branch won 12 times.',
      ],
      realite: 'Goss and his colleagues (1989) observed that Argentine ants most often end up taking the shorter of the two branches. This result inspired ant colony algorithms.',
    },
    fourragement: {
      question: 'How do trails arise on open ground?',
      regles: [
        'A nest in the centre, three food sources, a few pebbles.',
        '700 ants, the same rules as on the bridge.',
      ],
      images: { debut: 'After 500 steps', fin: 'After 4,000 steps' },
      regarder: [
        'At first, exploration: the ants radiate around the nest.',
        'Then sharp trails towards the three sources, which go around the pebbles and sometimes share a common trunk.',
      ],
      pourquoi: [
        'The first ants to find a source come back marking their route; the next ones follow it and straighten it, since short routes are better marked. Between 500 and 4,000 steps, the loads brought back go from 265 to nearly 12,000.',
      ],
      realite: 'Many ant species form such tree-like networks of trails branching out from the nest. Helbing and his colleagues obtain trails of this kind with their active walker model applied to ants.',
    },
  },
}

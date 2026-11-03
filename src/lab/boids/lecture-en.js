// ============================================================
//  ARTICLES IN ENGLISH: Understand, Theory, Applications, Computation,
//  History and references, plus the texts of figures and scenario cards
//  Same structure as lecture-fr.js.
// ============================================================

const tex = String.raw

export const LECTURE_EN = {
  comprendre: [
    {
      id: 'idee', titre: 'Thousands, and no leader', blocs: [
        { p: 'In the evening, above cities, flocks of thousands of starlings draw shapes in the sky that fold, hollow out, tear and mend in a second. No bird sees the whole flock, and none leads it. Each one only watches a few neighbours.' },
        { p: 'In 1986, the computer scientist Craig Reynolds wanted to animate such a flight on a computer without drawing every trajectory. His answer: give each virtual bird, which he called a *boid* (from *bird-oid*, “bird-like”), three very simple rules that only concern its immediate neighbours.' },
        { figure: 'regles' },
        { p: '*Separation*: don’t bump into neighbours that are too close. *Alignment*: fly in the same direction as them. *Cohesion*: stay near them. Nothing else. No rule mentions the flock, its shape or its direction. Yet when hundreds of boids apply these three rules, a flock appears, flies off, splits around an obstacle and reforms behind it: a collective behaviour *emerges*.' },
        { p: 'Physicists, biologists and mathematicians took up the idea in other forms. Tamás Vicsek, in 1995, with the simplest possible model, to study the passage from disorder to order. Iain Couzin, in 2002, for fish schools, and groups that remember their past. Felipe Cucker and Steve Smale, in 2007, with a model built for proving theorems. The explorer brings all four together.' },
      ],
    },
    {
      id: 'regle', titre: 'The rules of the game', blocs: [
        { p: 'In the explorer, each bird has a position and a velocity. At each step it looks at its neighbours: those closer than a certain distance (the *perception radius*, which is the unit of length), except those behind it, in a 90° blind spot. Then:' },
        {
          liste: [
            '*separation*: it wants to move away from every neighbour closer than 0.6, all the more strongly as that neighbour is close;',
            '*alignment*: it wants to take its neighbours’ average velocity;',
            '*cohesion*: it wants to head towards their centre;',
            'each urge becomes a small, bounded correction to its velocity: a bird can’t turn around at once. The three corrections add up, each with its own weight (2.5, 1 and 0.6 by default), plus a small random push;',
            'its speed stays between a minimum and a maximum, then it moves.',
          ],
        },
        { p: 'All birds decide at the same time, based on what they see at the start of the step. Nobody has a plan, nobody knows where the group is, and yet the group exists.' },
      ],
    },
    {
      id: 'lire', titre: 'Reading the explorer', blocs: [
        { p: 'Each small triangle is a bird, pointing in its direction of flight. The buttons at the top change the colours: *Species* (white when there is only one, then orange, blue and green), *Heading* (one hue per flight direction: a well-aligned flock is a single colour) and *Fear* (from grey to red, panic in front of a predator). In Couzin’s model, *Leaders* colours the individuals who know a direction. Grey discs are obstacles, large red triangles are predators.' },
        { p: '*2D* and *3D* change the world itself: in 3D, birds fly in a volume, and you orbit around them with the mouse. The world wraps around: a bird leaving on the right comes back on the left. In Couzin’s and in Cucker and Smale’s models the world is open, and the view follows the group (in Couzin’s model, the largest one: those who break away leave the frame); the grid shows that it moves.' },
        { p: 'The curves track four measures. *Polarisation* is 0 when everyone flies their own way and 1 when all fly the same way. *Rotation* is 1 for a group circling around its centre. *Groups* counts separate groups, *Nearest neighbour* gives the average distance between neighbours. Depending on the model, others appear: *catches* when there are predators, *velocity spread* in Cucker and Smale’s model.' },
        { p: 'Here are the scenarios, one by one: the question, the rules, what to watch, and what happens. The images were computed in advance with the explorer’s engine, on smaller groups.' },
      ],
    },
    { id: 'sc-reynolds', titre: '1. The three rules', blocs: [{ fiche: 'reynolds' }] },
    { id: 'sc-sans-alignement', titre: '2. No alignment', blocs: [{ fiche: 'sans-alignement' }] },
    { id: 'sc-etourneaux', titre: '3. Starlings count their neighbours', blocs: [{ fiche: 'etourneaux' }] },
    { id: 'sc-faucons', titre: '4. Falcons', blocs: [{ fiche: 'faucons' }] },
    { id: 'sc-foret', titre: '5. The forest', blocs: [{ fiche: 'foret' }] },
    { id: 'sc-vent', titre: '6. Wind', blocs: [{ fiche: 'vent' }] },
    { id: 'sc-especes', titre: '7. Three species', blocs: [{ fiche: 'especes' }] },
    { id: 'sc-vicsek', titre: '8. The Vicsek model', blocs: [{ fiche: 'vicsek' }] },
    { id: 'sc-bandes', titre: '9. Bands', blocs: [{ fiche: 'bandes' }] },
    { id: 'sc-couzin', titre: '10. Swarm, torus, migration', blocs: [{ fiche: 'couzin' }] },
    { id: 'sc-meneurs', titre: '11. Leaders nobody knows', blocs: [{ fiche: 'meneurs' }] },
    { id: 'sc-conflit', titre: '12. Compromise or choice', blocs: [{ fiche: 'conflit' }] },
    { id: 'sc-cucker', titre: '13. A flocking theorem', blocs: [{ fiche: 'cucker' }] },
    {
      id: 'retenir', titre: 'What to remember', blocs: [
        { p: 'Collective flight needs no leader, no plan and no overview: local rules are enough, as long as they include some form of alignment. Without alignment you get clusters; with it, a flock that goes somewhere.' },
        { p: 'The same rules give very different shapes depending on small settings: swarm, torus or migration in Couzin’s model, disorder or bands in Vicsek’s. A group’s shape can even depend on its history. The *Theory* tab explains why.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'agents', titre: 'An agent-based model', blocs: [
        { p: 'Reynolds’ model is an *agent-based model*: you describe each individual and its rules, let it run, and look at what happens at the scale of the group. Boid $i$ has a position $\\mathbf x_i$ and a velocity $\\mathbf v_i$; its neighbours $\\mathcal N_i$ are those within $R$ and outside its blind spot.' },
        { p: 'Reynolds writes each rule as a *steering force*: the velocity the bird would like to have, minus its current velocity, capped at a maximum force $F$. For alignment, the desired velocity points along the neighbours’ average velocity, at maximum speed $v_{\\max}$:' },
        { tex: tex`\mathbf f^{\,\text{ali}}_i = \operatorname{cap}_F\!\Big( v_{\max}\,\frac{\sum_{j\in\mathcal N_i}\mathbf v_j}{\big\|\sum_{j\in\mathcal N_i}\mathbf v_j\big\|} - \mathbf v_i \Big)`, etroit: tex`\begin{aligned}\mathbf f^{\,\text{ali}}_i = \operatorname{cap}_F\!\Big(& v_{\max}\,\hat{\mathbf u}_i - \mathbf v_i\Big),\\ \hat{\mathbf u}_i =\ & \frac{\sum_{j}\mathbf v_j}{\|\sum_{j}\mathbf v_j\|}\end{aligned}` },
        { p: 'Likewise, cohesion aims at the neighbours’ centre, and separation moves away from every neighbour that is too close (within $r_s$), with a $1/d$ weight:' },
        { tex: tex`\mathbf d^{\,\text{coh}}_i = \frac{1}{|\mathcal N_i|}\sum_{j\in\mathcal N_i}(\mathbf x_j - \mathbf x_i), \qquad \mathbf d^{\,\text{sep}}_i = -\sum_{j:\ d_{ij}<r_s} \frac{\mathbf x_j - \mathbf x_i}{d_{ij}^2}`, etroit: tex`\begin{aligned}\mathbf d^{\,\text{coh}}_i &= \tfrac{1}{|\mathcal N_i|}\textstyle\sum_{j}(\mathbf x_j - \mathbf x_i)\\ \mathbf d^{\,\text{sep}}_i &= -\textstyle\sum_{d_{ij}<r_s} \frac{\mathbf x_j - \mathbf x_i}{d_{ij}^2}\end{aligned}` },
        { p: 'The three forces add up with weights $w$, plus a noise $\\boldsymbol\\xi_i$; speed is kept between $v_{\\max}/2$ and $v_{\\max}$, then the bird moves:' },
        { tex: tex`\mathbf v_i \leftarrow \operatorname{clip}\big(\mathbf v_i + w_s\,\mathbf f^{\,\text{sep}}_i + w_a\,\mathbf f^{\,\text{ali}}_i + w_c\,\mathbf f^{\,\text{coh}}_i + \boldsymbol\xi_i\big), \qquad \mathbf x_i \leftarrow \mathbf x_i + \mathbf v_i`, etroit: tex`\begin{aligned}\mathbf v_i &\leftarrow \operatorname{clip}\big(\mathbf v_i + \textstyle\sum_r w_r\,\mathbf f^{\,r}_i + \boldsymbol\xi_i\big)\\ \mathbf x_i &\leftarrow \mathbf x_i + \mathbf v_i\end{aligned}` },
        { p: 'Two choices matter more than they seem. *The capped force*: a bird cannot change direction at once, which gives flocks their suppleness. *The synchronous update*: everyone decides from the same snapshot. The whole thing is a dynamical system of dimension $4N$ (or $6N$ in 3D), nonlinear, with no energy to minimise: nothing guarantees it converges to anything. That is why physicists looked for simpler models.' },
      ],
    },
    {
      id: 'voisinage', titre: 'Metric or topological', blocs: [
        { p: 'Who is whose neighbour? In the *metric* model, everyone within $R$: on average $\\rho\\pi R^2$ of them in 2D, a number that follows density. In the *topological* model, the $k$ nearest, wherever they are: their number is fixed, and it is the distance that follows density.' },
        { figure: 'voisinage' },
        { p: 'Ballerini and colleagues (2008) settled the question for starlings. They reconstructed in three dimensions ten flocks of 450 to 2,600 birds, photographed stereoscopically above Rome. The idea: a bird that reacts to its neighbours does not have them spread equally in all directions; it has fewer in front and behind than on the sides. This anisotropy fades as you look at more and more distant neighbours: where it vanishes lies the *last neighbour it interacts with*.' },
        { p: 'Result: that range is $n_c = 6.5 \\pm 0.9$ neighbours, with no link at all to the flock’s density, whereas the same range expressed in metres varies with it. Starlings count their neighbours; they do not measure distances.' },
        { p: 'Why? Their simulations give a hint: attacked by a predator, metric flocks most often broke into several pieces and left many stragglers (43% of the pieces), whereas topological flocks most often stayed in one piece (5% stragglers). A topological rule keeps the flock together when its density changes abruptly.' },
        {
          expert: 'interaction range versus correlation range', blocs: [
            { p: 'Don’t confuse them: $n_c \\approx 7$ is the number of neighbours a bird *interacts* with. Directions, by contrast, are *correlated* across the whole flock (see below, Cavagna et al., 2010). And a maximum-entropy model fitted to the same kind of data (Bialek et al., 2012) finds an effective interaction reaching about twenty neighbours on average ($n_c = 21.2 \\pm 1.7$), also independent of density. The numbers depend on the method; the topological conclusion does not.' },
          ],
        },
      ],
    },
    {
      id: 'vicsek', titre: 'The Vicsek model', blocs: [
        { p: 'In 1995, Tamás Vicsek and colleagues removed everything that was not essential. No more separation or cohesion, a constant speed $v_0$, and a single rule: each particle takes the average heading of its neighbours within a radius $r = 1$, itself included, plus noise.' },
        { tex: tex`\theta_i(t+1) = \arg\Big(\sum_{j:\ \|\mathbf x_j - \mathbf x_i\|<r} e^{\mathrm i\,\theta_j(t)}\Big) + \eta\,\xi_i(t), \qquad \xi_i \sim \mathcal U\big[-\tfrac12, \tfrac12\big]`, etroit: tex`\begin{aligned}\theta_i(t+1) &= \arg\Big(\textstyle\sum_{j} e^{\mathrm i\,\theta_j(t)}\Big) + \eta\,\xi_i(t)\\ \xi_i &\sim \mathcal U\big[-\tfrac12, \tfrac12\big]\end{aligned}` },
        { tex: tex`\mathbf x_i(t+1) = \mathbf x_i(t) + v_0\,\big(\cos\theta_i(t),\ \sin\theta_i(t)\big)\,\Delta t` },
        { p: 'Noise $\\eta$ plays the role of temperature, and density $\\rho = N/L^2$ that of the density of magnets: it is a magnet whose little magnets move forward. To measure order, take the length of the average velocity, scaled between 0 and 1:' },
        { tex: tex`\varphi = \frac{1}{N v_0}\,\Big\| \sum_{i=1}^N \mathbf v_i \Big\|` },
        { figure: 'vicsekvivant' },
        { p: 'With $v_0 = 0.03$ and systems of 40 to 10,000 particles, Vicsek et al. found a transition: $\\varphi$ is almost 1 at low noise and drops towards 0 beyond a critical noise, which they estimated at $\\eta_c \\approx 2.9$ for an infinite system. Near the threshold, $\\varphi$ vanishes as a power law, $\\varphi \\sim (\\eta_c - \\eta)^\\beta$ with $\\beta \\approx 0.45$: they concluded the transition was *continuous*, like that of a heated magnet.' },
        { figure: 'transition' },
        { p: 'The figure redoes the computation with the explorer’s engine, at the density of their figure (4 particles per unit area). Their curves reappear: the larger the system, the sharper the drop and the earlier it comes. Small systems keep a little order even at very high noise, because the average of $N$ random directions is not exactly zero but about $1/\\sqrt N$: 0.1 for 100 particles.' },
      ],
    },
    {
      id: 'nature', titre: 'Continuous or discontinuous? The band controversy', blocs: [
        { p: 'In 2004, Guillaume Grégoire and Hugues Chaté reopened the debate: in large enough systems, the transition is *discontinuous*. Near the threshold, order does not appear gradually: it concentrates in dense, aligned *bands* that sweep across the system, perpendicular to their direction of flight, in the middle of a disordered gas (*Bands* scenario).' },
        { p: 'Why had Vicsek not seen them? Because they only appear beyond a system size $L^*$ that grows a lot as speed decreases. With $v_0 = 0.03$ you would need enormous systems; with $v_0 = 0.5$ and density 2, $L^*$ is about 128 for the original noise, and much smaller for Grégoire and Chaté’s “vectorial” noise (Chaté et al., 2008). Below $L^*$, the transition *looks* continuous.' },
        { p: 'A discontinuous transition has two classic signatures: a *jump* in the order parameter, and *hysteresis* (the system does not switch state at the same place depending on whether the parameter goes up or down). The figure follows one system of 2,048 particles, with vectorial noise, slowly raising the noise, then lowering it again.' },
        { figure: 'hysteresis' },
        { p: 'The jump is sharp: going up, $\\varphi$ is still 0.62 at $\\eta = 4.02$, then drops to 0.05 at $\\eta = 4.08$. Coming down, disorder holds down to $\\eta \\approx 3.9$, and order only clearly returns at $\\eta = 3.83$. In between, the system is ordered or disordered depending on where it comes from: a small hysteresis loop, the signature of a discontinuous transition. On larger systems, Chaté et al. also see two-humped distributions of $\\varphi$ and sudden jumps over time.' },
        {
          expert: 'why bands', blocs: [
            { p: 'The mechanism is a loop. Alignment works better where local density is high: more neighbours, less effect of noise. But an aligned region moves as a block, picks up the particles it meets, and becomes denser. Density and order reinforce each other: just above the threshold, the homogeneous state is *unstable*, and the system separates into a dense ordered phase (the bands) and a dilute disordered one, like a liquid and its vapour. Solon, Chaté and Tailleur (2015) showed that the Vicsek transition is indeed a phase separation of this kind, with bands playing the role of droplets.' },
            { p: 'Vectorial noise: instead of adding an error to the final heading, a random vector is added to the sum of the neighbours’ directions, with a weight proportional to the number of neighbours $n_i$. An individual surrounded by agreement is less perturbed. Bands and the discontinuous character are easier to see.' },
            { tex: tex`\hat{\mathbf u}_i(t+1) = \frac{\sum_{j\in\mathcal N_i}\hat{\mathbf u}_j(t) + \eta\, n_i(t)\, \boldsymbol\xi_i(t)}{\big\|\sum_{j\in\mathcal N_i}\hat{\mathbf u}_j(t) + \eta\, n_i(t)\, \boldsymbol\xi_i(t)\big\|}`, etroit: tex`\hat{\mathbf u}_i(t+1) \propto \textstyle\sum_{j}\hat{\mathbf u}_j(t) + \eta\, n_i(t)\, \boldsymbol\xi_i(t)` },
          ],
        },
      ],
    },
    {
      id: 'toner-tu', titre: 'An order forbidden at equilibrium', blocs: [
        { p: 'The Vicsek model hides a deeper surprise. In 2D, for *motionless* magnets whose directions rotate in the plane (the XY model), the Mermin–Wagner theorem (1966) forbids any long-range order: at any non-zero temperature, very long-wavelength orientation waves cost so little energy that they end up disordering everything. A 2D flock is the analogue of this model, except that its “magnets” move.' },
        { p: 'John Toner and Yuhai Tu (1995) showed that this detail changes everything. They describe a flock seen from afar as a fluid: a velocity field $\\mathbf v(\\mathbf x, t)$ and a density field $\\rho(\\mathbf x, t)$, with every term the symmetries allow.' },
        { tex: tex`\partial_t \mathbf v + (\mathbf v\cdot\nabla)\mathbf v = \alpha\mathbf v - \beta|\mathbf v|^2\mathbf v - \nabla P + D_L\nabla(\nabla\cdot\mathbf v) + D_1\nabla^2\mathbf v + D_2(\mathbf v\cdot\nabla)^2\mathbf v + \mathbf f`, etroit: tex`\begin{aligned}\partial_t \mathbf v + (\mathbf v\cdot\nabla)\mathbf v =\ & \alpha\mathbf v - \beta|\mathbf v|^2\mathbf v - \nabla P\\ & + D_L\nabla(\nabla\cdot\mathbf v) + D_1\nabla^2\mathbf v\\ & + D_2(\mathbf v\cdot\nabla)^2\mathbf v + \mathbf f\end{aligned}` },
        { tex: tex`\partial_t\rho + \nabla\cdot(\rho\,\mathbf v) = 0` },
        { p: 'With $\\alpha < 0$ the fluid is disordered; with $\\alpha > 0$ it takes a mean velocity of magnitude $\\sqrt{\\alpha/\\beta}$, in a randomly chosen direction. $P$ is a density-dependent pressure, $\\mathbf f$ a noise. The term $(\\mathbf v\\cdot\\nabla)\\mathbf v$ does not exist for motionless magnets: it says that order is *carried* by motion. Two birds initially far apart eventually meet and influence each other: information spreads far more efficiently than from neighbour to neighbour.' },
        { p: 'Toner and Tu show that this is enough to stabilise true long-range order in 2D, and compute exact exponents for the fluctuations ($z = 6/5$, $\\zeta = 3/5$, $\\chi = -1/5$), under an assumption they do not fully prove. In 1998 they generalised the equations with free coefficients in front of the transport terms: unlike an ordinary fluid, a flock has no reason to be invariant under a change of reference frame, since birds fly relative to the air.' },
        {
          expert: 'Mermin–Wagner in a few lines', blocs: [
            { p: 'In an XY magnet at equilibrium, the energy of an orientation ripple with wave vector $q$ is proportional to $q^2$. At temperature $T$, each mode therefore has a mean amplitude $\\langle|\\delta\\theta_q|^2\\rangle \\propto T/q^2$, and the total orientation fluctuation is, in dimension $d$:' },
            { tex: tex`\langle \delta\theta^2\rangle \propto T\int \frac{d^d q}{q^2}` },
            { p: 'In dimension 2 this integral diverges (logarithmically) at long wavelengths: in a large enough system the orientation wanders without bound, and long-range order is impossible. In Toner and Tu’s theory, the nonlinear transport terms change how the coefficients depend on scale, and the divergence disappears: that is the meaning of $\\chi = -1/5 < 0$, which says that velocity fluctuations stay finite as the flock grows.' },
          ],
        },
        { p: 'Another prediction can be checked in the explorer: *giant number fluctuations*. In an ordinary gas, if a box contains $n$ particles on average, the standard deviation of that number is $\\sqrt n$: $\\sigma \\propto n^{1/2}$. In an ordered flock, particles arrive in packets, and fluctuations grow faster: $\\sigma \\propto n^{\\alpha}$ with $\\alpha > 1/2$. Chaté et al. (2008) measure $\\alpha \\approx 0.8$, in 2D as in 3D (a theory by Ramaswamy et al. predicted $1/2 + 1/d$, that is 1 in 2D, which does not fit).' },
        { figure: 'fluctuations' },
        { p: 'With the explorer’s engine (8,192 particles, $v_0 = 0.5$, $\\rho = 2$), we measure a slope of about 0.78 in the ordered phase, and about 0.48 in the disordered phase, very close to the value 1/2 of an ordinary gas.' },
      ],
    },
    {
      id: 'couzin', titre: 'Couzin’s zones', blocs: [
        { p: 'Couzin, Krause, James, Ruxton and Franks (2002) divide the space around each individual into three nested zones. In the *zone of repulsion*, of radius $r_r = 1$, it avoids its neighbours, and nothing else matters:' },
        { tex: tex`\mathbf d_i = -\sum_{j \in \text{rep.}} \frac{\mathbf r_{ij}}{\|\mathbf r_{ij}\|}` },
        { p: 'Otherwise, it aligns with the neighbours in the *zone of orientation* (up to $r_o = r_r + \\Delta r_o$) and heads towards those in the *zone of attraction* (up to $r_a = r_o + \\Delta r_a$), averaging the two directions if both zones are occupied:' },
        { tex: tex`\mathbf d_o = \sum_{j\in\text{or.}} \frac{\mathbf v_j}{\|\mathbf v_j\|}, \qquad \mathbf d_a = \sum_{j\in\text{att.}}\frac{\mathbf r_{ij}}{\|\mathbf r_{ij}\|}, \qquad \mathbf d_i = \frac12\Big(\frac{\mathbf d_o}{\|\mathbf d_o\|} + \frac{\mathbf d_a}{\|\mathbf d_a\|}\Big)`, etroit: tex`\begin{aligned}\mathbf d_o &= \textstyle\sum_{\text{or.}} \hat{\mathbf v}_j, \quad \mathbf d_a = \textstyle\sum_{\text{att.}}\hat{\mathbf r}_{ij}\\ \mathbf d_i &= \tfrac12\big(\hat{\mathbf d}_o + \hat{\mathbf d}_a\big)\end{aligned}` },
        { p: 'It moves at constant speed $s$, cannot see behind (a blind spot of $360° - \\alpha$), turns at most $\\theta\\tau$ per time step $\\tau$, and its desired direction is perturbed by noise with standard deviation $\\sigma$. The paper’s values: 100 individuals, $s = 3$, $\\alpha = 270°$, $\\theta = 40°$ per second, $\\tau = 0.1$ s, $\\sigma = 0.05$. These are the explorer’s.' },
        { p: 'Two measures identify the states: *polarisation* $p = \\|\\frac1N\\sum_i \\hat{\\mathbf v}_i\\|$, and *angular momentum* $m = \\|\\frac1N\\sum_i \\hat{\\mathbf r}_{ic}\\times\\hat{\\mathbf v}_i\\|$, where $\\hat{\\mathbf r}_{ic}$ points from the group’s centre to individual $i$. A swarm has low $p$ and $m$, a torus a high $m$, a parallel group a high $p$.' },
        { figure: 'couzin' },
        { p: 'The figure redoes the diagram with the explorer’s engine, in 3D as in the paper: for each pair $(\\Delta r_o, \\Delta r_a)$, three groups of 100 fish, 1,500 steps. Couzin’s regions reappear: the swarm without orientation, the torus for a narrow orientation zone and a wide attraction zone, parallel groups as soon as orientation widens, and fragmentation when attraction is too short to hold the group together.' },
        { p: 'The most surprising result lies elsewhere: *collective memory*. Fix $r_a = 14$ and vary $r_o$ slowly, first upwards, then downwards, without ever recreating the group.' },
        { figure: 'memoire' },
        { p: 'In our simulations, going up, the group is a swarm, becomes a torus from $r_o \\approx 1.25$ and stays one until $r_o \\approx 3.5$, then aligns. Coming down, it stays aligned until $r_o \\approx 1.5$ and never passes through the torus again (the paper finds the torus between about 1.5 and 2.5 on the way up, and the same refusal of the torus on the way down). Between these bounds, with exactly the same rules, the group is a torus or a column depending on its *past*. No individual keeps the slightest memory: the memory lies in the group’s configuration.' },
      ],
    },
    {
      id: 'meneurs', titre: 'Leaders nobody knows', blocs: [
        { p: 'Couzin, Krause, Franks and Levin (2005) add *informed* individuals who know a preferred direction $\\mathbf g$. Their desired direction becomes a compromise between the group and their preference, with weight $\\omega$:' },
        { tex: tex`\mathbf d'_i = \frac{\mathbf d_i + \omega\,\mathbf g_i}{\|\mathbf d_i + \omega\,\mathbf g_i\|}` },
        { p: 'Nobody knows who is informed, and there is no signal. Their first result: the group’s accuracy, that is, how closely it follows $\\mathbf g$, increases with the proportion $p$ of informed individuals, and *the larger the group, the smaller the proportion needed*: in a large group, a few percent are enough.' },
        { figure: 'meneurs' },
        { p: 'In our simulations (in 3D, 6 runs per point, 200 seconds of swimming), with no informed individual the group heads anywhere: the mean gap with the preferred direction is 85 to 120°. A single informed individual is enough to guide a group of 20 (gap below 1°). For 100 and 200 individuals, the gap falls to about 25° with 5% informed and below 20° with 10%. At equal proportion, the group of 200 is a bit more accurate than the group of 100 (13° against 17° with 10% informed, 3° against 7° with 20%), in line with the paper.' },
        { p: 'Their second result concerns conflicts. Two equally sized minorities prefer two directions separated by some angle. If the gap is small, the group follows the average; beyond a threshold, it picks one of the two, at random from one run to the next. And if one of the two minorities is larger, even slightly (6 against 5), the group follows it.' },
        { figure: 'conflit' },
        { p: 'In our simulations (ω = 1, 8 runs per gap), up to a gap of about 90°, the group heads in between, within a few degrees: that is the compromise. From 105° on, it joins one of the two preferred directions, sometimes one, sometimes the other: the curve splits in two. This is a *bifurcation*, the same as that of any system that must decide between two options. But the choice comes at a price: the informed individuals on the losing side, too attached to their direction, leave the group and go off alone (10 individuals out of 100). Orange points mark the runs where part of the group left; the figure then gives the direction of the main group. With a weaker preference (ω = 0.5), nobody leaves, but our groups compromise up to a 150° gap. The stronger the convictions, the more the group decides, and the more it risks falling apart.' },
        { p: 'An honest caveat: the paper uses a slightly different model (a zone of repulsion, and a single zone where individuals both align and attract). The explorer grafts their informed-individual rule onto the 2002 model, in 3D, where the group forms a well-aligned column. The trends are the same; the numbers are not.' },
      ],
    },
    {
      id: 'consensus', titre: 'Agreeing on a changing graph', blocs: [
        { p: 'The noiseless Vicsek model raises a mathematician’s question. If everyone averages their neighbours’ headings, but neighbours keep changing (since everybody moves), can we be sure everyone will end up with the same heading? Jadbabaie, Lin and Morse (2003) answered for the linearised version of the model:' },
        { tex: tex`\theta_i(t+1) = \frac{1}{1 + n_i(t)}\Big(\theta_i(t) + \sum_{j\in\mathcal N_i(t)} \theta_j(t)\Big)` },
        { p: 'In vector form, $\\boldsymbol\\theta(t+1) = F(t)\\,\\boldsymbol\\theta(t)$, where $F(t)$ is a *stochastic matrix* (non-negative, each row summing to 1) that depends on the neighbourhood graph at time $t$. Their theorem: if time can be split into successive intervals of bounded length, on each of which the union of the graphs is *connected* (everyone is linked to everyone, step by step, at least once in the interval), then all headings converge to a common value. The graph may be disconnected at every instant: it only needs to be connected *overall*, regularly.' },
        { figure: 'consensus' },
        {
          expert: 'the idea of the proof', blocs: [
            { p: 'An average never leaves the range of what it averages: the largest heading can only decrease, the smallest only increase. The gap $\\max_i\\theta_i - \\min_i\\theta_i$ therefore shrinks. But nothing yet says it goes to zero.' },
            { p: 'Connectivity is what forces contraction. On an interval where the united graph is connected, every individual’s influence eventually reaches all the others: the product of the matrices $F$ over enough such intervals has all its entries strictly positive and bounded from below. Such a matrix reduces the gap by a factor strictly less than 1. Chaining them, the gap decreases geometrically.' },
            { p: 'Jadbabaie et al.’s proof relies on a result by Wolfowitz (1963) on infinite products of stochastic matrices. The same reasoning applies to consensus among sensors, robots or opinions. Without connectivity the theorem fails: two groups that never see each other each converge to their own heading (*Two separate groups* button).' },
          ],
        },
      ],
    },
    {
      id: 'cucker', titre: 'Cucker and Smale: a flocking theorem', blocs: [
        { p: 'The previous theorem *assumes* the graph stays connected, which is precisely what we would like to prove: a group that disperses loses its links. Cucker and Smale (2007) closed the loop with a model in which *everyone* influences everyone, less so the further away they are:' },
        { tex: tex`\dot{\mathbf x}_i = \mathbf v_i, \qquad \dot{\mathbf v}_i = \frac{K}{N}\sum_{j=1}^N \psi\big(\|\mathbf x_j - \mathbf x_i\|\big)\,(\mathbf v_j - \mathbf v_i), \qquad \psi(r) = \frac{1}{(1+r^2)^\beta}`, etroit: tex`\begin{aligned}\dot{\mathbf x}_i &= \mathbf v_i\\ \dot{\mathbf v}_i &= \tfrac{K}{N}\textstyle\sum_{j} \psi(\|\mathbf x_j - \mathbf x_i\|)\,(\mathbf v_j - \mathbf v_i)\\ \psi(r) &= (1+r^2)^{-\beta}\end{aligned}` },
        { p: '*Flocking* has a precise definition: velocities agree ($\\mathbf v_i - \\mathbf v_j \\to 0$) and the group stays bounded ($\\sup_t \\|\\mathbf x_i - \\mathbf x_j\\| < \\infty$). The theorem: if $\\beta < 1/2$, flocking *always* happens, whatever the initial positions and velocities, and exponentially fast (Cucker and Smale, 2007); the case $\\beta = 1/2$ was added later (Ha and Tadmor, 2008; Ha and Liu, 2009). If $\\beta > 1/2$, it only happens for some initial conditions: tight enough, with close enough velocities.' },
        { figure: 'cucker' },
        { p: 'In the figure, with 60 individuals starting from the same draw, the velocity spread collapses exponentially for $\\beta = 0.25$ and $0.5$, much more slowly for $0.75$, and stays high for $1.5$: the group dispersed before it could agree. The sum of the velocities never changes (each pair exchanges opposite amounts): the group ends up flying at the initial average velocity.' },
        {
          preuve: 'The proof, in two inequalities', source: 'Ha and Liu, 2009',
          paragraphes: [
            'Let $X(t)$ be the largest position gap and $V(t)$ the largest velocity gap in the group. Two inequalities suffice, up to constants. Positions can only drift apart at the speed of velocity gaps: $\\dot X \\le V$. And alignment reduces velocity gaps, less so the more spread out the group is, since $\\psi$ decreases: $\\dot V \\le -K\\,\\psi(X)\\,V$.',
            'Now set $\\mathcal L(t) = V(t) + K\\int_0^{X(t)}\\psi(s)\\,ds$. Its derivative is $\\dot V + K\\psi(X)\\dot X \\le -K\\psi(X)V + K\\psi(X)V = 0$: $\\mathcal L$ can only decrease. Hence $K\\int_{X(0)}^{X(t)}\\psi(s)\\,ds \\le V(0)$ for all $t$.',
            'If $\\int_0^\\infty \\psi = \\infty$, this inequality bounds $X(t)$ by some number $X^*$: the group stays bounded. Then $\\psi(X) \\ge \\psi(X^*) > 0$, and $\\dot V \\le -K\\psi(X^*)V$ gives $V(t) \\le V(0)\\,e^{-K\\psi(X^*)t}$: velocities agree exponentially fast.',
            'Now $\\psi(r) \\sim r^{-2\\beta}$ at infinity: its integral diverges if and only if $2\\beta \\le 1$. That is the whole threshold $\\beta = 1/2$. Beyond it, the “reserve of attraction” $K\\int_{X(0)}^\\infty \\psi$ is finite, and if the initial velocity gap exceeds it, nothing stops the group from dispersing for good.',
          ],
        },
      ],
    },
    {
      id: 'nuees-reelles', titre: 'Real flocks', blocs: [
        { p: 'For about fifteen years, real flocks have been measured with the precision of a physics experiment. In Rome, Andrea Cavagna and Irene Giardina’s team photographs starling flocks stereoscopically and reconstructs every bird’s trajectory.' },
        { p: '*Scale-free correlations* (Cavagna et al., 2010). Over 24 flocks of 122 to 4,268 birds, highly ordered (mean polarisation 0.96), they look at *fluctuations*: each bird’s velocity minus the flock’s mean velocity. These are correlated over huge distances: the correlation length $\\xi$ grows with flock size, $\\xi \\approx 0.35\\,L$, for flocks from 9 to 86 metres across. There is no characteristic distance: in practice each bird is connected to the whole flock, even though it only interacts with a few neighbours.' },
        { tex: tex`C(r) = \frac{\sum_{i,j} \mathbf u_i\cdot\mathbf u_j\;\delta(r - r_{ij})}{\sum_{i,j}\delta(r - r_{ij})}, \qquad \mathbf u_i = \mathbf v_i - \frac1N\sum_k \mathbf v_k`, etroit: tex`\begin{aligned}C(r) &= \frac{\sum_{i,j} \mathbf u_i\cdot\mathbf u_j\,\delta(r - r_{ij})}{\sum_{i,j}\delta(r - r_{ij})}\\ \mathbf u_i &= \mathbf v_i - \tfrac1N\textstyle\sum_k \mathbf v_k\end{aligned}` },
        { p: 'For orientation this is not so surprising: breaking a continuous symmetry (every flight direction is possible, the flock picks one) leaves “soft” modes that cost almost nothing and reach far, Goldstone modes. For the birds’ *speed*, however, no symmetry is broken: that its fluctuations are also scale-free ($\\xi_{sp} \\approx 0.36\\,L$) suggests that flocks live near a critical point, where a system responds most strongly to perturbations. The authors remain cautious: other explanations are not ruled out.' },
        { p: '*A model drawn from data* (Bialek et al., 2012). Instead of guessing the rules, one looks for the least arbitrary probability law (of maximum entropy) that reproduces the measured correlations between neighbours. It takes exactly the form of a Heisenberg model of magnets, with interactions limited to a fixed number of neighbours. Fed only with local correlations, this model predicts, with no free parameter, the correlations across the whole flock.' },
        { p: '*Turns propagate like waves* (Attanasi et al., 2014). When a flock turns, the turn starts with a few birds and crosses the flock at constant speed, with almost no damping. Vicsek-type models predict diffusive propagation instead, which spreads and fades. Each bird’s behaviour needs *inertia* to reproduce the measurements. The theory also predicts that information travels faster in a more ordered flock, which the data confirm.' },
      ],
    },
    {
      id: 'predateurs', titre: 'Why group together', blocs: [
        { p: 'In 1971, William D. Hamilton proposed a selfish explanation for groups. Each individual has a *domain of danger*: the area where a predator appearing would be closer to it than to anyone else. Slipping between conspecifics shrinks that domain. If everyone does it, the group tightens, without anyone seeking the common good: the *selfish herd*.' },
        { p: 'Other advantages add up. The *dilution effect*: a predator that catches one prey at a time is less likely to pick you in a large group. The *confusion effect*: facing dozens of similar shapes moving together, a predator struggles to follow a target. And vigilance: a thousand eyes spot danger sooner, and the flight of a few warns all the others.' },
        { figure: 'predateur' },
        { p: 'In our simulations (one predator, a fixed-size world, 12,000 steps, 3 runs), without confusion the predator makes 31 to 35 catches per 10,000 steps, whatever the flock’s size: it is limited by its chases and rest times. With confusion, its catches fall as the flock grows, from 28 to 24. For each bird, the risk drops with group size: with 1,000 birds rather than 30, it is about 30 times lower without confusion, and nearly 40 times lower with it. That is the dilution effect, reinforced by confusion.' },
        { p: 'In real flocks, escape produces typical figures: a gap opening in front of the predator, a “fountain” where the group splits and closes behind it, agitation waves running through thousands of starlings (Procaccini et al., 2011). Experiments in which predatory fish hunt virtual prey showed that predation directly favours prey that move in a coordinated way (Ioannou, Guttal and Couzin, 2012).' },
      ],
    },
    {
      id: 'matiere-active', titre: 'Active matter', blocs: [
        { p: 'Flocking models gave birth to a field of physics: *active matter*, the study of systems whose every element draws energy to move. Birds and fish, but also bacteria, cells, cytoskeletal filaments pushed by molecular motors, robots, shaken grains (Marchetti et al., 2013). These systems escape the laws of equilibrium: Toner and Tu’s 2D order, giant fluctuations and phase separations without attraction are signatures of this.' },
        { p: 'In 2013, Bricard and colleagues built a laboratory flock: plastic beads a few micrometres across, by the million, that roll by themselves in an electric field (“Quincke rollers”). Above a threshold density they start rolling together, in propagating bands: a Vicsek-type transition, in a real material.' },
      ],
    },
  ],

  applications: [
    {
      id: 'cinema', titre: 'Cinema and games', blocs: [
        { p: 'Boids were born for cinema. The first film to use them is a 1987 short, *Stanley and Stella in: Breaking the Ice*. In 1992, *Batman Returns* used them for swarms of bats and an army of penguins marching through Gotham City. In 1998, Reynolds received a scientific and technical award from the Academy of Motion Picture Arts and Sciences “for his pioneering contributions to the development of three-dimensional computer animation for motion picture production”.' },
        { p: 'The principle has stayed: to animate a crowd, a herd or a school, you don’t draw each individual, you give it rules. The crowd software of major films descends from it, with much richer rules. Video games too: the birds of *Half-Life* (1998) were called “boid” in the game files.' },
      ],
    },
    {
      id: 'drones', titre: 'Drone swarms', blocs: [
        { p: 'Flying drones in a group without a central pilot raises exactly Reynolds’ question: which local rules produce stable collective flight? Vásárhelyi and colleagues (2018) flew 30 drones outdoors, without central control, as a flock, avoiding collisions and obstacles. The parameters of their flocking model were tuned by an evolutionary algorithm, in simulation, before the real flights.' },
        { p: 'Not to be confused with drone light shows: there, each drone follows a trajectory computed in advance by a central computer. They draw figures; they do not form a flock.' },
      ],
    },
    {
      id: 'biologie', titre: 'Locusts, fish, bacteria', blocs: [
        { p: '*Locusts.* Buhl and colleagues (2006) filmed desert locusts marching in a ring-shaped arena. At low density (5 to 17 locusts per square metre), their movements are disordered. Between 25 and 62 per square metre, they march together but abruptly change direction from time to time. Above 74 per square metre, they all march the same way, persistently. That is the Vicsek transition, in an insect that ravages crops: knowing at what density a swarm starts marching helps to prevent it.' },
        { p: '*Fish.* Schools switch between a compact swarm, a torus and a column depending on danger and current, as in Couzin’s model. In the laboratory, each fish is tracked on video to fit the rules.' },
        { p: '*Bacteria and cells.* Swimming bacteria form collective vortices and streams; cells closing a wound migrate as a sheet, aligned with their neighbours. Toner and Tu’s equations, with a few extra terms, are used to describe them.' },
        { p: '*Leaders, sometimes.* Not all flocks are egalitarian. By fitting pigeons with GPS loggers, Nagy and colleagues (2010) showed that a pigeon flock follows a hierarchy: some birds influence the others more. Leaderless models are a starting point, not a universal law.' },
      ],
    },
    {
      id: 'foules', titre: 'Human crowds', blocs: [
        { p: 'A crowd of pedestrians is not a flock: people don’t align with their neighbours, each heads for their own goal, avoiding others. But the spirit is the same: local rules (keep your distance, go around, follow whoever goes your way) produce lanes of walkers, jams at doors, compression waves in dense crowds. That is the subject of an upcoming project in this lab: the airport crowd.' },
      ],
    },
    {
      id: 'limites', titre: 'What these models don’t say', blocs: [
        { p: 'They are caricatures, and they own it. A real bird has aerodynamics, inertia, a field of view blocked by its neighbours, fatigue, preferences, ties with certain individuals. Our boids see perfectly through the crowd, all decide at the same time, and never tire.' },
        { p: 'Their strength lies elsewhere: they show *what is enough*. If three rules produce a flock, there is no need to assume a leader, a plan or some mysterious collective intelligence. They also show what is *robust*: Couzin’s states, Vicsek’s transition and Toner and Tu’s order don’t depend on the details, which is why they turn up in locusts, fish and plastic beads.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'grille', titre: 'Finding neighbours fast: the grid', blocs: [
        { p: 'The first difficulty is mundane: finding neighbours. Comparing each bird with all others costs $N(N-1)/2$ comparisons per step: 200 million for 20,000 birds. Yet each bird only looks at those within $R$.' },
        { p: 'The explorer cuts the world into cells at least $R$ wide. A neighbour within $R$ is necessarily in the same cell or in one of the 8 surrounding cells (26 in 3D). At each step the birds are sorted by cell with a *counting sort*: a first pass counts the birds in each cell, a cumulative sum gives where each cell starts in an array, a second pass stores the indices there. Everything fits in three integer arrays, with no allocation.' },
        { figure: 'grille' },
        { p: 'The cost of a step becomes proportional to $N$ times the average number of birds per cell, instead of $N^2$. The list of neighbouring cells of each cell is computed once and for all, since the grid does not change on a torus.' },
        { figure: 'cout' },
        { p: 'The figure compares, on the same machine, the full step with the grid and the neighbour search alone by comparing all pairs. At 16,000 birds there is a factor of about 150. The grid follows a slope of $N$; the naive method, that of $N^2$.' },
      ],
    },
    {
      id: 'topologique', titre: 'The k nearest neighbours', blocs: [
        { p: 'For the topological rule, the distance is not known in advance. Cells are scanned in concentric rings: the bird’s cell and its neighbours, then the next ring, and so on. The $k$ nearest are kept in a small sorted array (insertion, like sorting playing cards).' },
        { p: 'When to stop? Every bird in a ring of rank $r + 1$ is at least $r$ cell widths away. As soon as the $k$-th neighbour found is closer than that, no bird further out can beat it: stop. In a dense flock, one or two rings are enough.' },
      ],
    },
    {
      id: 'tore', titre: 'A world that wraps around', blocs: [
        { p: 'On a torus of side $L$, the gap between two birds is the shortest possible gap, going through the edge or not: the *minimum image convention*. Rather than $dx - L\\,\\operatorname{round}(dx/L)$, the explorer does a simple comparison: if $dx > L/2$, subtract $L$; if $dx < -L/2$, add it. This is exact as long as positions stay inside the world, and noticeably faster.' },
        { p: 'The rotation of a group requires its centre. But the average of positions makes no sense on a torus (a group straddling the edge would have its “centre” in the middle of the world). A *circular mean* is used: each coordinate is seen as an angle, the $(\\cos, \\sin)$ vectors are averaged, and converted back to a position.' },
      ],
    },
    {
      id: 'pas', titre: 'One time step', blocs: [
        { p: '*Boids.* New velocities are computed into a second array, then copied back: everyone decides from the same snapshot (synchronous update). Each rule is a capped steering force, the sum is added to the velocity, the speed is brought back between $v_{\\max}/2$ and $v_{\\max}$ (more in case of panic), then the position moves.' },
        { p: '*Vicsek.* The order of operations follows the paper: move with the old velocity, then compute the new heading. In 3D, the noise is a rotation by an angle drawn between $-\\eta/2$ and $\\eta/2$, around a random perpendicular axis.' },
        { p: '*Couzin.* To turn at most $\\theta\\tau$ towards the desired direction $\\mathbf d$, $\\mathbf d$ is split along the current direction $\\mathbf u$ and its perpendicular part $\\mathbf w$, then $\\cos(\\theta\\tau)\\,\\mathbf u + \\sin(\\theta\\tau)\\,\\mathbf w$ is taken.' },
        { p: '*Cucker and Smale.* Everyone looks at everyone: $N^2$ terms per step. Since $\\psi(r_{ij}) = \\psi(r_{ji})$, each pair is computed once, adding to $i$ what is subtracted from $j$. The computation is twice as fast, and the sum of velocities is exactly conserved.' },
      ],
    },
    {
      id: 'worker', titre: 'Computing beside the page', blocs: [
        { p: 'The engine runs in a *Web Worker*, a separate thread: the page stays smooth even when a step takes 20 milliseconds. At each screen refresh the page asks for a frame; the Worker advances a few steps (never more than 35 milliseconds) and sends back each bird’s state in an array of floating-point numbers. That array is *transferred*, not copied: it passes from one thread to the other without copying, and returns to the Worker on the next frame. Two arrays thus circulate continuously, without ever allocating new ones.' },
        { p: 'The 2D drawing groups birds by colour and fills a single path per colour: a handful of draw calls for 5,000 triangles. In 3D, three.js draws all the birds in a single call (an *InstancedMesh*): the same little cone, repeated with one matrix per bird. To orient the cone along the velocity $\\mathbf d$, three perpendicular axes are built directly (a vector $\\mathbf e_1 \\perp \\mathbf d$, then $\\mathbf e_1\\times\\mathbf d$) rather than going through quaternions.' },
      ],
    },
    {
      id: 'mesures', titre: 'The measures', blocs: [
        { tex: tex`p = \Big\|\frac1N\sum_i \hat{\mathbf v}_i\Big\|, \qquad m = \Big\|\frac1N\sum_i \hat{\mathbf r}_{ic}\times\hat{\mathbf v}_i\Big\|`, etroit: tex`\begin{aligned}p &= \big\|\tfrac1N\textstyle\sum_i \hat{\mathbf v}_i\big\|\\ m &= \big\|\tfrac1N\textstyle\sum_i \hat{\mathbf r}_{ic}\times\hat{\mathbf v}_i\big\|\end{aligned}` },
        { p: 'Polarisation and rotation are Couzin’s; rotation is computed around the centre of the largest group. Groups are found by *union–find*: each pair of neighbours within $R$ merges their two sets, and the sets are counted at the end. Velocity spread is the standard deviation of velocities, relative to the mean speed. Measures are taken four times per second.' },
      ],
    },
    {
      id: 'hasard', titre: 'Randomness, and the figures', blocs: [
        { p: 'Randomness comes from a seeded generator (*mulberry32*): same seed, same draws, same flock. The *Restart* button draws a new seed; changing an initial setting recreates the world with the same seed, so that the comparison is fair.' },
        { p: 'The figures marked “precomputed” come from the same engine, run in Node.js: the Vicsek transition (three sizes, 21 noise values, up to 6 runs each), the hysteresis, giant fluctuations, Couzin’s diagram (100 cells, 3 runs, 1,500 steps each), collective memory, leaders, conflicts, Cucker and Smale, predators and the cost of a step. So are the images of the scenario cards in the *Understand* tab (4 bytes per bird: position, direction, colour). They are stored in data files, so the page doesn’t have to recompute them.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'A history of collective flight', blocs: [
        {
          frise: [
            ['1971', 'William D. Hamilton', 'proposes the *selfish herd*: grouping to shrink one’s own domain of danger.'],
            ['1982', 'Ichiro Aoki', 'simulates fish schools on a computer with local rules of repulsion, alignment and attraction.'],
            ['1987', 'Craig Reynolds', 'presents *boids* at the SIGGRAPH conference; the short film *Breaking the Ice* puts them on screen.'],
            ['1992', '', '*Batman Returns*: bats and penguins animated with boids.'],
            ['1995', 'Tamás Vicsek et al.', 'propose the minimal model and its transition between disorder and order.'],
            ['1995', 'John Toner and Yuhai Tu', 'show that a flock can have long-range order in 2D, forbidden at equilibrium.'],
            ['1998', 'Craig Reynolds', 'receives a scientific and technical award from the Academy of Motion Picture Arts and Sciences.'],
            ['2002', 'Iain Couzin et al.', 'describe swarm, torus and migration, and collective memory.'],
            ['2003', 'Ali Jadbabaie, Jie Lin and A. Stephen Morse', 'prove consensus on a changing graph.'],
            ['2004', 'Guillaume Grégoire and Hugues Chaté', 'show that the Vicsek transition is discontinuous, with bands.'],
            ['2005', 'Couzin, Krause, Franks and Levin', 'show that a small informed minority can guide a large group.'],
            ['2006', 'Jerome Buhl et al.', 'observe the order–disorder transition in marching locusts.'],
            ['2007', 'Felipe Cucker and Steve Smale', 'prove when a group ends up flying together.'],
            ['2008', 'Michele Ballerini et al.', 'show that starlings follow 6 to 7 neighbours, whatever the distance.'],
            ['2010', 'Andrea Cavagna et al.', 'measure scale-free correlations in starling flocks.'],
            ['2013', 'Antoine Bricard et al.', 'create a flock of self-rolling colloidal beads.'],
            ['2014', 'Alessandro Attanasi et al.', 'show that turns cross the flock like waves.'],
            ['2018', 'Gábor Vásárhelyi et al.', 'fly 30 drones as a flock, outdoors, without central control.'],
          ],
        },
      ],
    },
    {
      id: 'quatre-regards', titre: 'Four ways of looking at a flock', blocs: [
        { p: '*Animation.* Reynolds wants believable images. His rules are pragmatic, tuned by eye, and he keeps enriching them (avoid obstacles, follow a path, flee). This is behaviour engineering.' },
        { p: '*Statistical physics.* Vicsek, Toner, Tu, Chaté and others look for what is *universal*: what does not depend on details, such as the nature of a transition or exponents. They strip the model to the bone to understand it better.' },
        { p: '*Biology.* Aoki, Couzin, Krause, Cavagna, Giardina and others want the real rules of real animals, and measure them. They also ask *why* these rules were selected: defence, feeding, decision-making.' },
        { p: '*Mathematics.* Jadbabaie, Cucker, Smale, Ha, Tadmor and others want theorems: under what conditions is a group sure to agree? Their results are now used to design robot swarms that must work every time.' },
      ],
    },
    {
      id: 'refs', titre: 'References', blocs: [
        {
          refs: [
            ['C. W. Reynolds, “Flocks, herds and schools: A distributed behavioral model”, *Computer Graphics* (SIGGRAPH ’87), 21(4), 1987.', 'https://www.red3d.com/cwr/boids/'],
            ['I. Aoki, “A simulation study on the schooling mechanism in fish”, *Bulletin of the Japanese Society of Scientific Fisheries*, 48, 1982.'],
            ['W. D. Hamilton, “Geometry for the selfish herd”, *Journal of Theoretical Biology*, 31, 1971.', 'https://doi.org/10.1016/0022-5193(71)90189-5'],
            ['T. Vicsek, A. Czirók, E. Ben-Jacob, I. Cohen, O. Shochet, “Novel type of phase transition in a system of self-driven particles”, *Physical Review Letters*, 75, 1995.', 'https://arxiv.org/abs/cond-mat/0611743'],
            ['J. Toner, Y. Tu, “Long-range order in a two-dimensional dynamical XY model: how birds fly together”, *Physical Review Letters*, 75, 1995.', 'https://arxiv.org/abs/adap-org/9506001'],
            ['N. D. Mermin, H. Wagner, “Absence of ferromagnetism or antiferromagnetism in one- or two-dimensional isotropic Heisenberg models”, *Physical Review Letters*, 17, 1966.', 'https://doi.org/10.1103/PhysRevLett.17.1133'],
            ['G. Grégoire, H. Chaté, “Onset of collective and cohesive motion”, *Physical Review Letters*, 92, 2004.', 'https://arxiv.org/abs/cond-mat/0401208'],
            ['H. Chaté, F. Ginelli, G. Grégoire, F. Raynaud, “Collective motion of self-propelled particles interacting without cohesion”, *Physical Review E*, 77, 2008.', 'https://arxiv.org/abs/0712.2062'],
            ['A. P. Solon, H. Chaté, J. Tailleur, “From phase to microphase separation in flocking models: the essential role of nonequilibrium fluctuations”, *Physical Review Letters*, 114, 2015.'],
            ['I. D. Couzin, J. Krause, R. James, G. D. Ruxton, N. R. Franks, “Collective memory and spatial sorting in animal groups”, *Journal of Theoretical Biology*, 218, 2002.', 'https://doi.org/10.1006/jtbi.2002.3065'],
            ['I. D. Couzin, J. Krause, N. R. Franks, S. A. Levin, “Effective leadership and decision-making in animal groups on the move”, *Nature*, 433, 2005.', 'https://doi.org/10.1038/nature03236'],
            ['A. Jadbabaie, J. Lin, A. S. Morse, “Coordination of groups of mobile autonomous agents using nearest neighbor rules”, *IEEE Transactions on Automatic Control*, 48(6), 2003.', 'https://doi.org/10.1109/TAC.2003.812781'],
            ['F. Cucker, S. Smale, “Emergent behavior in flocks”, *IEEE Transactions on Automatic Control*, 52(5), 2007.', 'https://doi.org/10.1109/TAC.2007.895842'],
            ['S.-Y. Ha, J.-G. Liu, “A simple proof of the Cucker-Smale flocking dynamics and mean-field limit”, *Communications in Mathematical Sciences*, 7(2), 2009.'],
            ['M. Ballerini et al., “Interaction ruling animal collective behavior depends on topological rather than metric distance: Evidence from a field study”, *PNAS*, 105, 2008.', 'https://arxiv.org/abs/0709.1916'],
            ['A. Cavagna et al., “Scale-free correlations in starling flocks”, *PNAS*, 107, 2010.', 'https://arxiv.org/abs/0911.4393'],
            ['W. Bialek et al., “Statistical mechanics for natural flocks of birds”, *PNAS*, 109, 2012.', 'https://doi.org/10.1073/pnas.1118633109'],
            ['A. Attanasi et al., “Information transfer and behavioural inertia in starling flocks”, *Nature Physics*, 10, 2014.', 'https://doi.org/10.1038/nphys3035'],
            ['M. Procaccini et al., “Propagating waves in starling, *Sturnus vulgaris*, flocks under predation”, *Animal Behaviour*, 82, 2011.'],
            ['C. C. Ioannou, V. Guttal, I. D. Couzin, “Predatory fish select for coordinated collective motion in virtual prey”, *Science*, 337, 2012.'],
            ['J. Buhl et al., “From disorder to order in marching locusts”, *Science*, 312, 2006.', 'https://doi.org/10.1126/science.1125142'],
            ['M. Nagy, Z. Ákos, D. Biro, T. Vicsek, “Hierarchical group dynamics in pigeon flocks”, *Nature*, 464, 2010.', 'https://doi.org/10.1038/nature08891'],
            ['A. Bricard, J.-B. Caussin, N. Desreumaux, O. Dauchot, D. Bartolo, “Emergence of macroscopic directed motion in populations of motile colloids”, *Nature*, 503, 2013.', 'https://doi.org/10.1038/nature12673'],
            ['M. C. Marchetti et al., “Hydrodynamics of soft active matter”, *Reviews of Modern Physics*, 85, 2013.', 'https://doi.org/10.1103/RevModPhys.85.1143'],
            ['T. Vicsek, A. Zafeiris, “Collective motion”, *Physics Reports*, 517, 2012 (a review).', 'https://arxiv.org/abs/1010.5017'],
            ['G. Vásárhelyi et al., “Optimized flocking of autonomous drones in confined environments”, *Science Robotics*, 3, 2018.', 'https://hal.elte.hu/drones/scirob2018.html'],
          ],
        },
      ],
    },
  ],

  /* ---------- Figure texts ---------- */

  figures: {
    regles: {
      titre: 'The three rules, around one bird',
      resume: 'A white bird in the middle, its neighbours around, and the directions wanted by each rule.',
      regle: 'Rule shown',
      regles: { separation: 'Separation', alignement: 'Alignment', cohesion: 'Cohesion', tout: 'All three' },
      nouveau: 'Other neighbours',
      legendes: {
        separation: 'Separation (red): move away from neighbours that are too close, inside the red disc. The closest count most.',
        alignement: 'Alignment (blue): take the neighbours’ average direction, inside the dashed circle.',
        cohesion: 'Cohesion (green): head towards the neighbours’ centre (the small green circle).',
        tout: 'The three urges add up, each with its weight: the white arrow is the turn the bird will take. The grey area behind it is its blind spot.',
      },
    },
    voisinage: {
      titre: 'Within a radius, or the 7 nearest',
      resumes: { metrique: 'Neighbours within a fixed radius around the white dot.', topologique: 'The 7 nearest neighbours of the white dot.' },
      metrique: (n) => `Within a radius of 1: ${n} neighbours`,
      topologique: (k, r) => `The ${k} nearest: up to a distance of ${r}`,
      densite: 'Density',
      note: 'Change the density: the number of neighbours “within a radius” follows density; the number of “topological” neighbours stays 7, and it is their distance that changes.',
    },
    vicsekvivant: {
      titre: 'A small Vicsek model',
      resume: '400 particles taking their neighbours’ average heading, coloured by direction.',
      eta: 'Noise η',
      lancer: 'Run',
      pause: 'Pause',
      nouveau: 'Shuffle',
      etat: (phi) => `polarisation φ = ${phi}`,
      note: '400 particles, density 4, speed 0.05. One colour per direction: when everything is one colour, φ is close to 1. Raise the noise above about 4: the colours mix.',
    },
    transition: {
      titre: 'Polarisation versus noise, for three sizes',
      serie: (n) => `${n} particles`,
      axeX: 'noise η',
      axeY: 'polarisation φ',
      repere: 'η_c ≈ 2.9 (infinite size)',
      info: (x, v) => `η = ${x}: ${v}`,
      resume: 'Three curves falling from 1 towards 0 as noise increases; the drop is sharper for large systems.',
      tableau: 'See the values',
    },
    hysteresis: {
      titre: 'Vectorial noise: going up, then down',
      montee: 'raising the noise',
      descente: 'lowering it again',
      axeX: 'noise η (radians)',
      axeY: 'polarisation φ',
      info: (x, v) => `η = ${x}: ${v}`,
      resume: 'Polarisation drops at once when noise passes a threshold, and jumps back when it goes below again.',
    },
    fluctuations: {
      titre: 'Fluctuations of the number of particles in a box',
      ordonne: (p) => `ordered phase (slope ${p})`,
      desordonne: (p) => `disordered phase (slope ${p})`,
      axeX: 'mean number n in the box',
      axeY: 'standard deviation σ',
      info: (x, v) => `n ≈ ${x}: ${v}`,
      resume: (a, b) => `On a log scale, two straight lines: slope ${a} for the ordered phase, ${b} for the disordered phase.`,
    },
    couzin: {
      titre: 'The states of Couzin’s model (3D, 100 individuals)',
      axeX: 'Δr_o (orientation)',
      axeY: 'Δr_a',
      etats: { essaim: 'swarm', tore: 'torus', dynamique: 'dynamic parallel', parallele: 'highly parallel', fragmente: 'fragmented' },
      case: (o, a, etat, p, m) => `Δr_o = ${o}, Δr_a = ${a}: ${etat} (p = ${p}, m = ${m})`,
      resume: 'A grid of cells coloured by the group’s state; the torus occupies a narrow band on the left, at the top.',
      note: 'Hover a cell to see polarisation p and rotation m. States: rotation > 0.5 → torus; otherwise p < 0.5 → swarm; p ≥ 0.9 → highly parallel; in between → dynamic parallel; group broken in at least two runs out of three → fragmented.',
    },
    memoire: {
      titre: 'Collective memory (r_a = 14)',
      pMontee: 'polarisation, going up',
      pDescente: 'polarisation, going down',
      mMontee: 'rotation, going up',
      mDescente: 'rotation, going down',
      axeX: 'orientation radius r_o',
      axeY: 'p or m',
      info: (x, v) => `r_o = ${x}: ${v}`,
      resume: 'Going up, rotation is strong between 1.25 and 3.5 (a torus); going down, it stays low and polarisation stays high down to 1.5.',
    },
    meneurs: {
      titre: 'Gap between the group’s direction and the informed direction',
      serie: (n) => `${n} individuals`,
      axeX: 'proportion informed',
      axeY: 'gap (degrees)',
      info: (x, v) => `${x} informed: ${v}`,
      resume: 'The gap falls from around 90° or more (chance) towards 0 as the proportion of informed individuals increases.',
      tableau: 'See the values (number of informed individuals in brackets)',
    },
    conflit: {
      titre: 'Two minorities, two directions: where does the group go?',
      uni: 'group stayed whole',
      scinde: 'part of it left',
      pref1: 'preference 1',
      pref2: 'preference 2',
      axeX: 'gap between the two preferences',
      axeY: 'direction of the main group',
      info: (x, v) => `gap ${x}°: ${v}`,
      resume: 'For small gaps the points sit in the middle (compromise); for large gaps they join one preference or the other (choice), and part of the group leaves.',
    },
    consensus: {
      titre: 'Twelve headings coming into agreement',
      mode: 'Configuration',
      modes: { un: 'One mixing group', deux: 'Two separate groups' },
      nouveau: 'Another draw',
      axeX: 'step',
      resume: (mode) => (mode === 'un' ? 'Twelve heading curves converging to a single value.' : 'Two bundles of six curves converging to two different values.'),
      etat: (mode, v) => (mode === 'un' ? `Final headings: ${v.join('°, ')}° — a single common heading.` : `Final headings: ${v.join('°, ')}° — one heading per group.`),
    },
    cucker: {
      titre: 'Cucker and Smale: velocity spread over time',
      serie: (b) => `β = ${b}`,
      axeX: 'time',
      axeY: 'velocity spread',
      info: (x, v) => `t = ${x}: ${v}`,
      resume: 'On a log scale, the velocity spread plunges for β ≤ 0.5, decreases slowly for 0.75 and stays high for 1.5.',
      note: '60 individuals, the same initial draw for all four curves. The curves stop around 10⁻⁵: below that, we reach the precision of the computation.',
    },
    predateur: {
      titre: 'Catches by one predator versus flock size',
      sans: 'without confusion',
      avec: 'with confusion',
      axeX: 'birds in the world',
      axeY: 'catches per 10,000 steps',
      info: (x, v) => `${x} birds: ${v}`,
      resume: 'Without confusion, catches barely depend on flock size; with confusion, they drop as the flock grows.',
    },
    cout: {
      titre: 'Cost of a step versus the number of birds (measured)',
      grille: 'full step, with the grid',
      naif: 'neighbour search, all pairs',
      axeX: 'birds',
      axeY: 'milliseconds',
      info: (x, v) => `${x} birds: ${v}`,
      resume: 'On a log scale, the grid follows a slope of 1, the naive method a slope of 2.',
    },
    grille: {
      titre: 'The grid: only search the neighbouring cells',
      resume: 'Points on a grid; only those in the 9 cells around the white dot are examined.',
      nouveau: 'Other points',
      etat: (n, c, v) => `${n} birds; ${c} examined in the 9 cells; ${v} neighbours within R.`,
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
    depart: 'Start',
    apres: (n, modele) => (modele === 'couzin' ? `After ${(n / 10).toLocaleString('en-GB')} s` : `After ${n.toLocaleString('en-GB')} steps`),
    calcul: 'Loading…',
    note: (vue) => `Computed in advance with the explorer’s engine, on a smaller group (seen from above in 3D). Colours: ${vue.toLowerCase()}.`,
    mesures: {
      polarisation: (v) => `polarisation ${v}`,
      rotation: (v) => `rotation ${v}`,
      groupes: (v) => `${v} group${v === '1' ? '' : 's'}`,
      captures: (v) => `${v} catches`,
      dispersion: (v) => `velocity spread ${v}`,
      cap: (v) => `group direction: ${v}°`,
    },
  },

  fiches: {
    reynolds: {
      question: 'Are three local rules enough to make a flock?',
      regles: [
        '1,500 birds (700 in the images), placed at random, each in a random direction.',
        'Each applies the three rules to its neighbours within a radius of 1: move apart (below 0.6), align, move closer.',
        'The world wraps around: there is no edge.',
      ],
      images: {},
      regarder: [
        'The first seconds: small groups of a few birds form everywhere, each in its own direction.',
        'Then these groups meet and merge, and *polarisation* climbs towards 0.9: almost everyone flies the same way.',
        '*Heading* view: each group takes on a colour, then the colours merge.',
      ],
      pourquoi: [
        'Alignment does most of the work: two birds that see each other end up flying in parallel. Since each has several neighbours, who have others, agreement spreads step by step. Cohesion stops the group from dispersing, separation stops it from collapsing to a point.',
        'When two groups cross, each aligns the other a little: they merge in an intermediate direction. Over time, only a few large flocks remain.',
      ],
      realite: 'Reynolds wrote these rules for cinema, not for biology. But they gave biologists a vocabulary: ever since, they have been looking in real schools and flocks for whatever plays the role of separation, alignment and cohesion.',
    },
    'sans-alignement': {
      question: 'What if alignment is removed?',
      regles: [
        'The same birds, the same separation, a slightly stronger cohesion (1.5).',
        'The weight of alignment is set to zero: each ignores its neighbours’ direction.',
      ],
      images: { avec: 'With alignment, after 1,500 steps', sans: 'Without alignment, after 1,500 steps' },
      regarder: [
        '*Heading* view: without alignment, each cluster stays multicoloured, its members fly every which way.',
        '*Polarisation* stays around 0.05, against 0.9 with alignment.',
        'Clusters swarm on the spot and go nowhere.',
      ],
      pourquoi: [
        'Cohesion gathers, separation spaces out: you get clusters, like a swarm of midges. But for the group to *go somewhere*, directions must agree, and neither of these two rules says anything about direction.',
        'This is the heart of almost every collective flight model: alignment, or something like it, turns a cluster into a flock.',
      ],
      realite: 'Midge swarms resemble this scenario: a compact cluster with no common direction. Yet their movements are strongly correlated, as if they sat near a critical point (Attanasi et al., 2014, on wild midges).',
    },
    etourneaux: {
      question: 'Why do starlings follow a fixed number of neighbours rather than all those nearby?',
      regles: [
        '1,200 birds in the images (4,000 in the explorer), and a falcon hunting them.',
        'Left image: each follows its neighbours within a radius of 1 (*metric* rule).',
        'Right image: each follows its 7 nearest neighbours, wherever they are (*topological* rule).',
      ],
      images: { metrique: 'Within a radius, after 1,200 steps', topologique: '7 nearest, after 1,200 steps' },
      regarder: [
        '*Fear* view: panic, in red, starts from the falcon and spreads through the flock.',
        'With the metric rule, a bird that strays a bit too far loses all contact with the group; with the topological rule, it keeps following its 7 neighbours, even distant ones, and comes back.',
        'The *Groups* curve is usually lower with the topological rule.',
      ],
      pourquoi: [
        'With a fixed radius, the number of neighbours depends on density: in a stretching flock it drops to zero and the flock breaks. With a fixed number of neighbours, each bird stays linked to the group whatever the density. A flock that expands in front of a falcon and then tightens thus keeps its cohesion.',
      ],
      realite: 'By photographing starling flocks stereoscopically above Rome, Michele Ballerini and colleagues (2008) showed that each bird interacts with 6 to 7 neighbours, whatever the flock’s density. In their simulations, attacked “metric” flocks often broke into several pieces; “topological” flocks most often stayed in one piece.',
    },
    faucons: {
      question: 'What does a flock do in front of predators?',
      regles: [
        '900 birds in the images (2,000 in the explorer), and three falcons, 1.6 times faster than them.',
        'A falcon dives at the nearest bird. Birds that see it within 3 flee, faster than usual.',
        'After a catch, the bird reappears elsewhere and the falcon rests.',
      ],
      images: {},
      regarder: [
        '*Fear* view: a gap opens in front of each falcon, then the flock closes behind it.',
        'The flock sometimes splits in two around a falcon, and the halves rejoin further on.',
        'The *Catches* curve: a few catches, mostly when an isolated bird crosses a falcon’s path.',
      ],
      pourquoi: [
        'Each bird only reacts to the falcon it sees, but its neighbours react to its turn, through alignment: the escape spreads far beyond the falcon’s sight. It is a wave of panic.',
        'A falcon aims at one particular bird. In the middle of a crowd of similar shapes it may lose its target for another and hesitate (*Confusion* setting): one of the advantages of the group.',
      ],
      realite: 'Real flocks show these figures: sudden openings, “fountains” where the flock splits and closes behind the predator, dark waves running through thousands of birds (Procaccini et al., 2011).',
    },
    foret: {
      question: 'Can a flock go around obstacles?',
      regles: [
        '800 birds in the images, in a forest of columns.',
        'A bird heading towards a nearby column turns to avoid it, all the more strongly as it is close.',
        'Nobody sees the whole forest.',
      ],
      images: {},
      regarder: [
        'The flock splits into streams that pass between the columns, then reunite behind.',
        'With the *Obstacle* tool, draw a wall across the flock.',
      ],
      pourquoi: [
        'Only birds close to a column see it; the others follow their turning neighbours. The flock flows around obstacles like a fluid, and cohesion reunites the streams behind them.',
      ],
      realite: 'This is the addition Reynolds proposed as early as 1987: avoidance rules on top of the other three. Drone swarms use the same principle to get through narrow passages.',
    },
    vent: {
      question: 'Does wind break up the flock?',
      regles: [
        '700 birds, a wind of 60% of their speed, strengthening and veering in gusts.',
        'The wind moves everyone the same way; it does not change the direction each bird points to.',
      ],
      images: { calme: 'No wind, after 1,500 steps', vent: 'With wind and gusts, after 1,500 steps' },
      regarder: [
        'The flock drifts, but stays in one piece.',
        'The wind changes neither polarisation nor the number of groups.',
      ],
      pourquoi: [
        'All the rules speak of *relative* positions and velocities: the gap with one’s neighbours. A uniform wind moves everyone the same way; it changes no gap. The rules don’t see it, and neither does the flock: in the air’s frame of reference, nothing new happens.',
        'This stops being true as soon as the wind is not the same everywhere, or as soon as there are obstacles, fixed relative to the ground: the flock is then pushed against them.',
      ],
      realite: 'Real birds correct their heading to compensate for wind, which our boids don’t. But the principle holds: a perturbation that affects everyone the same way does not break a group. Differences do.',
    },
    especes: {
      question: 'Do three species that avoid each other end up separated?',
      regles: [
        '900 birds, three equally sized species. Orange flies at normal speed, blue 20% faster, green 15% slower.',
        'Left image: the species mix, everyone aligns with everyone.',
        'Right image: each follows only its own kind and flees the other species it sees.',
      ],
      images: { melent: 'They mix', evitent: 'They avoid each other' },
      regarder: [
        'When they mix, flocks are multicoloured; when they avoid each other, each flock is a single colour, and flocks move apart as they cross.',
      ],
      pourquoi: [
        'This is a cousin of Schelling’s model: a local rule, “move away from what doesn’t look like me”, produces complete separation. Even without fleeing, species that don’t fly at the same speed gradually separate: the fastest take the lead and end up forming their own flocks.',
      ],
      realite: 'Different species sometimes fly together, like mixed flocks of small songbirds in winter, and sometimes avoid each other. In fish schools, individuals of different sizes, which don’t swim at the same speed, tend to sort themselves.',
    },
    vicsek: {
      question: 'At what noise level does order disappear?',
      regles: [
        '600 particles in the images (2,000 in the explorer), all moving at the same speed, at density 4.',
        'At each step, each takes the average direction of its neighbours within 1 (itself included), then deviates by an angle drawn at random between −η/2 and +η/2.',
        'Nothing else: no separation, no cohesion.',
      ],
      images: { faible: 'Low noise (η = 1)', moyen: 'Medium noise (η = 3)', fort: 'High noise (η = 5)' },
      regarder: [
        '*Heading* view: with little noise, a single colour takes over; with a lot of noise, colours stay mixed.',
        'In between, aligned islands form, drift and fall apart.',
        'In the explorer, vary η and watch polarisation.',
      ],
      pourquoi: [
        'Two forces compete: alignment, which spreads agreement, and noise, which destroys it. When noise is low, agreement wins and spreads to the whole system; when it is high, noise wins. In between there is a threshold, a *phase transition*, like the magnetisation of a magnet that disappears when heated.',
      ],
      realite: 'Vicsek and colleagues proposed this model in 1995 to show that such a transition exists among self-propelled particles. It became the basic model of *active matter*, the physics of systems whose elements consume energy to move.',
    },
    bandes: {
      question: 'How does order appear in a large system?',
      regles: [
        '2,048 particles in the images (4,608 in the explorer), faster (v₀ = 0.5), at density 2.',
        'The noise is “vectorial”: it is added to each interaction rather than to the final heading (Grégoire and Chaté, 2004).',
        'It is set just below the threshold.',
      ],
      images: {},
      regarder: [
        'A dense, aligned band forms and sweeps across the world, perpendicular to its direction of flight.',
        'Around it, a sparse gas of particles going every which way.',
        'Raise the noise a little: the band vanishes at once.',
      ],
      pourquoi: [
        'Order and density sustain each other: where particles are numerous they align better; where they are aligned they move together and stay packed. The system then splits into a dense ordered region and a sparse disordered one, like a liquid and its vapour.',
        'That is why the Vicsek transition is actually *discontinuous*: order appears all at once, in bands, not gradually. It took large systems, and nearly ten years, to notice.',
      ],
      realite: 'Bands of this kind have been seen in the laboratory, in populations of self-rolling beads (Bricard et al., 2013), or in protein filaments pushed by molecular motors.',
    },
    couzin: {
      question: 'How can the same fish school form a swarm, a torus or a marching column?',
      regles: [
        '100 fish; the view follows the group. Around each, three nested zones: it avoids those too close (within 1), aligns with those in the next zone (width Δr_o), moves towards those in the last one (width Δr_a = 12).',
        'It turns at most 40° per second, and cannot see behind itself.',
        'Only one setting changes: the width of the orientation zone.',
      ],
      images: { essaim: 'Δr_o = 0: swarm', tore: 'Δr_o = 1: torus', migration: 'Δr_o = 8: migration' },
      regarder: [
        'With no orientation zone: a compact swarm, with low polarisation (about 0.15).',
        'With a narrow orientation zone: a torus, a ring circling around an empty core (rotation about 0.9).',
        'With a wide orientation zone: everyone heads the same way (polarisation close to 1).',
      ],
      pourquoi: [
        'Without alignment, attraction gathers and repulsion spaces out: a swarm. With a little alignment, close neighbours agree, but attraction pulls everyone towards the centre; at constant speed you can’t head for the centre without overshooting it, and local agreement starts circling around. With a lot of alignment, agreement spreads to the whole group, which sets off in a straight line.',
      ],
      realite: 'All three shapes exist in nature: midge swarms, schools circling in a torus (seen in barracudas and jacks), migrating columns. Couzin and colleagues (2002) showed that the same group can switch from one to another by slightly changing its rules, and that its shape also depends on its past (see *Theory*).',
      ouvrir: ['essaim', 'tore', 'migration'],
    },
    meneurs: {
      question: 'Are a few informed individuals enough to guide a whole group?',
      regles: [
        '100 fish, in 3D (where the group forms a well-aligned column), with Couzin’s model.',
        '10% of them (in orange) know a direction, to the right: their desired heading is pulled towards it, with weight ω = 0.5.',
        'Nobody knows who is informed, and there is no signal.',
      ],
      images: {},
      regarder: [
        'The group forms, then heads right. Informed individuals often end up at the front.',
        'In the explorer, lower the proportion of informed individuals: below a few percent, the group heads in any direction.',
      ],
      pourquoi: [
        'Uninformed individuals follow their neighbours; informed ones follow their neighbours *and* their direction. Their small bias, repeated at every step, spreads through alignment to the whole group.',
      ],
      realite: 'Couzin, Krause, Franks and Levin (2005) propose this mechanism for honeybee swarms on the move: a small minority of scouts knows where the new nest is, and the whole swarm follows them without recognising them.',
    },
    conflit: {
      question: 'If two minorities want to go in two different directions, does the group compromise?',
      regles: [
        '100 fish in 3D; 10 informed individuals want to go one way, 10 others another way, and each holds to it strongly (ω = 1).',
        'The two directions are separated by a given angle, on either side of rightwards.',
      ],
      images: { petit: '40° gap, after 150 s', grand: '140° gap, after 150 s' },
      regarder: [
        'Small gap: the group heads in between, in the average direction.',
        'Large gap: most of the group chooses one of the two directions (at random from one run to the next). The 10 informed individuals of the other side leave alone and exit the frame: the view follows the main group.',
      ],
      pourquoi: [
        'When the two directions are close, the average roughly satisfies everyone: each minority pulls a little, the group follows the sum. When they are far apart, the average suits no one: as soon as one side gains a slight advantage, the group tips towards it. A collective decision emerges, with no vote and no leader.',
        'The losers hold too strongly to their direction (ω = 1) to follow: they leave. Lower their conviction in the explorer (ω = 0.5), then restart: nobody leaves any more, but the group then compromises, even at 140°.',
      ],
      realite: 'This is Couzin et al.’s (2005) result: below a certain gap, compromise; above it, choice. If one side is slightly larger, the group follows it, even when the gap is small.',
    },
    cucker: {
      question: 'Can we prove that a group will end up flying together?',
      regles: [
        '150 individuals in the images, with no noise or obstacle.',
        'Each adjusts its velocity towards that of *all* the others, with a weight that decreases with distance: 1 / (1 + r²)^β.',
        'Left image: β = 0.3; right image: β = 1.5.',
      ],
      images: { faible: 'β = 0.3: influence decays slowly', fort: 'β = 1.5: it decays fast' },
      regarder: [
        'With β = 0.3, the velocity spread falls to zero: everyone ends up flying at the same velocity, as a group.',
        'With β = 1.5, small groups go their own way and never meet again.',
      ],
      pourquoi: [
        'If a distant neighbour’s influence decreases slowly (β ≤ 1/2), it never quite disappears: even an individual moving away stays linked enough to come back, and agreement always wins in the end. If it decreases fast, two individuals moving apart soon stop seeing each other at all, and may never agree. Cucker and Smale proved it: it is a theorem, not an observation.',
      ],
      realite: 'The model is not meant to imitate birds, but to be proved. It launched a whole branch of applied mathematics, and its variants are used to prove that swarms of drones or robots will coordinate.',
    },
  },
}

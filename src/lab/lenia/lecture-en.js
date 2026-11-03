// ============================================================
//  ARTICLES IN ENGLISH: Understand, Theory, Applications, Computation,
//  History and references, and the figure texts
//  Same structure as lecture-fr.js.
// ============================================================

const tex = String.raw

export const LECTURE_EN = {
  comprendre: [
    {
      id: 'continu', titre: 'The Game of Life, made continuous', blocs: [
        { p: 'In John Conway’s Game of Life, each cell of a grid is alive or dead, and looks at its eight neighbours. Three live neighbours bring a cell to life; two or three keep it alive; otherwise it dies. Time moves in jumps, all at once.' },
        { p: 'Bert Chan wondered what happens if everything is made continuous. A cell is no longer alive or dead: it holds an amount of matter between 0 and 1. It no longer looks at eight neighbours but at a disc of several dozen cells, with weights that vary smoothly. And time moves in small steps. He called the result *Lenia*, from the Latin *lenis*, “smooth”, and published it in 2018.' },
        { p: 'What appears no longer looks like pixel patterns but like beings: blobs that swim, spin, pulse, and repair themselves when damaged. The most famous is called Orbium.' },
        { ouvrir: 'orbium', libelle: 'See Orbium in the explorer', aide: 'Then click in the world to add more.' },
      ],
    },
    {
      id: 'regle', titre: 'A rule in two stages', blocs: [
        { p: 'At each step, each cell does two things. First, it looks around: it averages the matter of its neighbours, weighted by a ring-shaped *kernel*. This gives a number between 0 and 1, the *potential* U. Then it applies the *growth*: if U is close to an ideal value, the cell gains a little matter; if it is far from it, too lonely or too crowded, it loses some.' },
        { p: 'Here is an Orbium up close, with these three quantities side by side:' },
        { figure: 'mecanisme' },
        { p: 'The potential is a blurred version of the creature. The growth shows the secret of its motion: matter grows at the front, in green, and vanishes at the back, in magenta. Orbium does not move like an object being pushed. It keeps rebuilding itself a little further on.' },
      ],
    },
    {
      id: 'bestiaire', titre: 'A bestiary', blocs: [
        { p: 'Bert Chan has recorded more than 400 species in 18 families, which he classifies like a naturalist, with Latin names: Orbium, Scutium, Gyrorbium, Hydrogeminium… Many were found by *interactive evolution*: the computer proposes variants, a human picks the ones they like. Each one corresponds to a rule and a starting shape. Some move ahead, others spin on the spot or stay still. Here are a few:' },
        { figure: 'galerie' },
      ],
    },
    {
      id: 'modeles', titre: 'Four models', blocs: [
        { p: 'The explorer offers four variants of the same idea.' },
        {
          liste: [
            '*Lenia*, the 2019 version: a single channel of matter, a kernel made of rings. The classic bestiary.',
            '*Expanded Lenia* (2020): three channels, red, green and blue, linked by about fifteen kernels. Creatures have organs, and several species share the same rule.',
            '*SmoothLife* (2011): the ancestor, invented by Stephan Rafler. A disc, a ring, and doughnut-shaped gliders.',
            '*Flow Lenia* (2023): matter is no longer created or destroyed, it flows. Individuals form and divide, and several species can compete for the same world.',
          ],
        },
        { ouvrir: 'limus', libelle: 'Open the Expanded Lenia aquarium' },
      ],
    },
    {
      id: 'mutants', titre: 'Playing at evolution', blocs: [
        { p: 'Creatures live on narrow ridges. Change the centre μ or the width σ of the growth a little, and Orbium dies out or overflows into a blob that invades everything. The explorer’s *Mutations* panel varies the rule at random and shows four mutants side by side, started from the same creature. Most die. Keep a survivor, start again from it: this is artificial selection by hand, the very method that let Bert Chan discover a good part of his bestiary.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'pas-a-pas', titre: 'From the Game of Life to Lenia, step by step', blocs: [
        { p: 'Let us write the Game of Life with tools that generalise. Write $A^t$ for the grid at time t, with $A = 1$ for a live cell and 0 for a dead one. Counting a cell’s live neighbours amounts to a *convolution*: a mask K slides over the grid, and the cells it covers are added up, weighted by its values. The whole rule then fits on one line:' },
        { tex: tex`A^{t+1} = \big[\, A^t + G(K * A^t) \,\big]_0^1,` },
        { p: 'where G is +1 (be born or survive) or −1 (die), and $[\\,\\cdot\\,]_0^1$ brings the result back between 0 and 1. Lenia makes each of the three ingredients continuous.' },
        {
          liste: [
            '*States*: $A$ takes every value between 0 and 1, and G becomes a smooth bell curve instead of all or nothing.',
            '*Space*: the 3 × 3 mask becomes a ring-shaped kernel K of radius R, dozens of cells wide, with smooth weights. It sums to 1, so $U = K * A$ is an average.',
            '*Time*: instead of jumping, we advance by a small step $\\Delta t = 1/T$.',
          ],
        },
        { tex: tex`A^{t+\Delta t} = \big[\, A^t + \Delta t \; G(K * A^t) \,\big]_0^1.` },
        { p: 'As the time step goes to 0 and the cells become infinitely fine, we get a continuous evolution equation, $\\partial A/\\partial t = G(K * A)$, as long as A stays between 0 and 1. Lenia is the computable version of this equation.' },
        {
          expert: 'the Game of Life as a special case of Lenia', blocs: [
            { p: 'Take a kernel of radius 2 equal to 1 on the eight neighbours and 1/2 on the cell itself; it sums to 8.5. With n live neighbours, the potential is $U = (n + A/2)/8.5$. A live cell survives if n is 2 or 3, that is $U \\in \\{0.294,\\ 0.412\\}$; a dead cell is born if n is 3, that is $U = 0.353$. All other combinations fall outside the interval [0.29, 0.42]. Conway’s rule therefore reads' },
            { tex: tex`G(U) = \begin{cases} +1 & \text{if } |U - 0.35| \le 0.07, \\ -1 & \text{otherwise,} \end{cases} \qquad \Delta t = 1.` },
            { p: 'This is exactly the rule of the explorer’s “Game of Life glider”: Lenia contains the Game of Life as an extreme case, with a tiny kernel, a staircase growth and a whole time step.' },
          ],
        },
        { ouvrir: 'planeur', libelle: 'See Conway’s glider in Lenia' },
      ],
    },
    {
      id: 'noyau', titre: 'The kernel and the growth', blocs: [
        { p: 'The kernel describes what a cell “sees”. It is made of one or more concentric rings: the distance r to the centre, divided by the radius R, is cut into B bands, and each band gets a bump profile multiplied by a height $b_i$. The most common profiles are exponential or polynomial:' },
        { tex: tex`K_C(\rho) = \exp\!\Big(4 - \frac{1}{\rho(1 - \rho)}\Big) \quad \text{or} \quad K_C(\rho) = \big(4\rho(1 - \rho)\big)^4, \qquad \rho \in\ ]0, 1[.` },
        { p: 'Neighbourhoods are easier to see than to describe:' },
        { figure: 'voisinages' },
        { p: 'The growth turns the potential into a gain or loss of matter. It is a bell curve of centre μ and width σ, brought back between −1 and 1:' },
        { tex: tex`G(U) = 2\exp\!\Big(-\frac{(U - \mu)^2}{2\sigma^2}\Big) - 1.` },
        { p: 'μ is the ideal neighbourhood density, σ the tolerance. For Orbium, μ = 0.15 and σ = 0.015: a cell only gains matter if the weighted average of its ring is very close to 15%. Vary both numbers:' },
        { figure: 'regle' },
        { p: 'With σ a little too small, almost no cell finds what it needs: the creature dies out. With σ a little too large, too many cells grow: it overflows and invades the world. Creatures live in the narrow band between the two.' },
      ],
    },
    {
      id: 'creature', titre: 'What is a creature?', blocs: [
        { p: 'For Bert Chan, a creature is a localised shape that persists: it keeps its look over time, whether it stays put, spins, oscillates or moves. In the language of dynamical systems, it is an *attractor*: disturb it a little, and the dynamics bring it back to its shape. Try shaking an Orbium, or cutting a piece off:' },
        { figure: 'robustesse' },
        { p: 'The kernel is round: the rule favours no direction. A creature can therefore head off in any direction, whereas Game of Life gliders only know four diagonals. Its shape decides its motion. A creature that is symmetric about an axis moves along that axis; a creature whose shape is unchanged by a rotation spins on the spot; a shape with no symmetry goes round in circles, like Gyrorbium.' },
        { p: 'Bert Chan classified his finds like a naturalist: more than 400 species in 18 families, Orbidae, Scutidae, Pterifera, Helicidae, Kronidae, Dentidae… A species occupies a small island in parameter space. Around it there are only empty worlds or overflowing blobs. The explorer’s *Mutations* panel lets you feel the edges of these islands.' },
      ],
    },
    {
      id: 'smooth', titre: 'SmoothLife, the ancestor', blocs: [
        { p: 'In 2011, Stephan Rafler published SmoothLife, the first truly smooth Game of Life. Each cell measures two averages: m over a small disc around it, which tells whether it is “alive”, and n over the surrounding ring, which plays the role of the neighbours. The new state is a smooth function $s(n, m)$: an empty cell is born if n falls between $b_1$ and $b_2$, a full cell survives if n falls between $d_1$ and $d_2$, and sigmoids soften all these boundaries.' },
        { tex: tex`f^{t+1} = s(n, m) = \sigma\big(n - a(m)\big)\,\big(1 - \sigma\big(n - c(m)\big)\big),` },
        { p: 'where $a(m)$ goes from $b_1$ to $d_1$ and $c(m)$ from $b_2$ to $d_2$ as the cell fills up. Rafler’s values, $b = [0.278, 0.365]$ and $d = [0.267, 0.445]$, echo those of the Game of Life: birth with 3 neighbours out of 8 is 0.375; survival with 2 or 3 lies between 0.25 and 0.375. Rings glide across it, the first smooth gliders.' },
        { ouvrir: 'smooth', libelle: 'Open SmoothLife' },
        { p: 'Rafler also proposes continuous time: instead of replacing f by s all at once, time moves forward by a small step dt, $f \\leftarrow f + dt\\,(2s - 1)$. Other variants simply move f towards s, $f \\leftarrow f + dt\\,(s - f)$. Gliders still exist there, but for other thresholds. With $b = [0.245, 0.293]$ and $d = [0.259, 0.414]$, found here by a random search, they slide along without jolts, at the same speed whatever dt.' },
        { ouvrir: 'smooth_planeurs', libelle: 'Open the smooth gliders' },
      ],
    },
    {
      id: 'etendu', titre: 'Several channels, several kernels', blocs: [
        { p: 'In 2020, Bert Chan extended Lenia to several channels, like several chemical substances coexisting, and to several kernels, each reading one channel and acting on another. Each kernel k has its source $c_0$, its target $c_1$, its growth $G_k$ and a weight $h_k$:' },
        { tex: tex`A_c^{t+\Delta t} = \Big[\, A_c^t + \Delta t \, \frac{\sum_{k \,:\, c_1(k) = c} h_k\, G_k\big(K_k * A_{c_0(k)}^t\big)}{\sum_{k \,:\, c_1(k) = c} h_k} \,\Big]_0^1.`, etroit: tex`\begin{gathered} A_c^{t+\Delta t} = \big[\, A_c^t + \Delta t \, D_c \,\big]_0^1 \\[4pt] D_c = \frac{\sum_{c_1(k) = c} h_k\, G_k\big(K_k * A_{c_0(k)}^t\big)}{\sum_{c_1(k) = c} h_k} \end{gathered}` },
        { p: 'Creatures differentiate: one channel forms a membrane, another a nucleus, a third a tail. Some divide; others react when they meet another. And several species can share exactly the same rule: this is the explorer’s *aquarium*, where six very different creatures live together.' },
      ],
    },
    {
      id: 'flow', titre: 'Flow Lenia: matter is conserved', blocs: [
        { p: 'In Lenia, matter appears and disappears: the total mass keeps changing. A creature therefore takes nothing from its neighbours, and there is neither resource nor competition. In 2023, Erwan Plantec, Bert Chan and colleagues proposed *Flow Lenia*: the potential no longer makes matter grow on the spot, it tells it where to go.' },
        { tex: tex`F = (1 - \alpha)\,\nabla U - \alpha\, \nabla A, \qquad \alpha = \min\big(1, (A/\theta)^2\big).` },
        { p: 'Matter climbs the slope of U, the *affinity*, but flees places that are already too full, where α approaches 1. It is then moved without losing or gaining anything: the total mass never changes. As a result, a blob of matter breaks up into well-separated individuals, which move, merge or divide.' },
        { p: 'Second idea: each cell carries its own parameters, here the kernel weights, and transports them with its matter. Where two flows mix, the cell takes the parameters of one of its sources, drawn at random according to the mass it brings. Several species then compete for the same world, and a local mutation can spread through it: evolution happens inside the simulation itself. This is the explorer’s *Several species* option.' },
        {
          expert: 'redistributing matter', blocs: [
            { p: 'The move uses *reintegration tracking*, a fluid simulation technique devised by Mykhailo Moroz. The matter of a cell p′ is spread over a square of side 2s centred on its arrival position $\\mu(p\') = p\' + \\Delta t\\, F(p\')$. Cell p receives the share of this square that covers it:' },
            { tex: tex`A'(p) = \sum_{p'} A(p')\, \frac{\big|\,[p]\, \cap\, \mathcal{C}_{2s}(\mu(p'))\,\big|}{(2s)^2}.` },
            { p: 'The shares received by all cells exactly cover the original square: they sum to 1, and the total mass is conserved. The explorer takes s = 0.65 and limits the displacement so that the search for sources stays within a 7 × 7 square.' },
          ],
        },
        { ouvrir: 'flow_division', libelle: 'Watch a Flow Lenia cell divide' },
      ],
    },
    {
      id: 'ouvert', titre: 'Open questions', blocs: [
        { p: 'The Game of Life can compute: logic gates, then complete Turing machines, have been built in it. For Lenia, nobody knows. Its creatures are robust and varied, but no one has yet shown that they can be assembled into circuits that compute anything at all.' },
        { p: 'Another question is open-ended evolution. In living things, evolution keeps inventing ever more complex forms. In artificial worlds, it almost always runs out of steam. Flow Lenia, with its species competing for matter, is one attempt to restart it. Researchers are also automating discovery: exploration algorithms, then artificial intelligence models able to judge whether a pattern “looks alive”, roam the space of rules in search of new creatures. The Applications tab tells more.' },
      ],
    },
  ],

  applications: [
    {
      id: 'morphogenese', titre: 'The patterns of living things', blocs: [
        { p: 'In 1952, Alan Turing published *The Chemical Basis of Morphogenesis*. Two substances diffuse and react: an *activator*, which reinforces itself, and a faster *inhibitor*, which smothers it at a distance. Spots and stripes arise spontaneously from this duel. In 1995, Shigeru Kondo and Rihito Asai showed that the stripes of an angelfish, *Pomacanthus*, move and rearrange as it grows, just as such a model predicts.' },
        { p: 'Lenia’s ring-shaped kernel plays the same game: growth favours a moderate density close by, and punishes excess further away. Reaction-diffusion models such as Gray and Scott’s produce spots that move and divide, close cousins of Lenia’s creatures.' },
      ],
    },
    {
      id: 'solitons', titre: 'Particles without particles', blocs: [
        { p: 'In 1834, the Scottish engineer John Scott Russell followed on horseback a solitary wave travelling up a canal for kilometres without changing shape. Such *solitons* have since been found in optics, in plasmas and in telecommunication fibres. In 1996, Paul Umbanhowar, Francisco Melo and Harry Swinney observed *oscillons* in a vertically shaken layer of sand: small isolated bumps that beat on the spot and can bind into molecules.' },
        { p: 'Lenia’s creatures belong to the same family: patterns, not objects. No cell “belongs” to Orbium; it persists because the dynamics keep recreating it. This makes it a laboratory for the question: what is an individual?' },
      ],
    },
    {
      id: 'neuronaux', titre: 'Neural cellular automata', blocs: [
        { p: 'A Lenia step is a convolution followed by a non-linear function: exactly one layer of a convolutional neural network. In 2020, Alexander Mordvintsev, Ettore Randazzo, Eyvind Niklasson and Michael Levin replaced the hand-written rule with a small neural network, trained by gradient descent. Their automaton grows a lizard from a single cell, and repairs it when a piece is torn off.' },
        { p: 'In 2022 the same team proposed *Particle Lenia*, where matter is made of particles that move to lower an energy. This work is followed closely by biologists who study regeneration: how do cells with no overall plan find the shape of an organ again?' },
      ],
    },
    {
      id: 'ia', titre: 'Searching for life with machines', blocs: [
        { p: 'Lenia’s space of rules is immense, and creatures are rare in it. In 2020, Chris Reinke, Mayalen Etcheverry and Pierre-Yves Oudeyer, at Inria, let loose in Lenia an exploration algorithm driven by curiosity: it sets its own goals and keeps the patterns most different from those it already knows. It discovers a wide variety of creatures without being told what they should look like.' },
        { p: 'In 2024, a team around Akarsh Kumar, from Sakana AI and MIT, went further. A model linking images and text judges whether a simulation evokes “a cell dividing” or simply something new. It roams Lenia, boids or the Game of Life this way. This research aims at *open-ended evolution*, the kind that never stops inventing: a path towards truly creative machines.' },
      ],
    },
    {
      id: 'possible', titre: 'Life as it could be', blocs: [
        { p: 'Lenia is not a model of real organisms: no chemistry, no metabolism, and in its classic version not even conservation of matter. Christopher Langton, who launched *artificial life* as a discipline in 1987, defined it as the study of “life as it could be”, not only life as it is.' },
        { p: 'Lenia is a fine example: moving, repairing, staying an individual, sometimes dividing, all emerge from very simple local rules. The model does not say how life arose; it shows what a little dynamics is enough to produce.' },
      ],
    },
    {
      id: 'convolutions', titre: 'Convolutions everywhere', blocs: [
        { p: 'The operation at the heart of Lenia, convolution, is everywhere. Blurring an image is a convolution by a small bell curve; detecting the edges of a photo is a convolution by a kernel that measures slope. Spreading heat follows a convolution by a widening Gaussian. The echo of a cathedral added to a recording is the convolution of the sound by the room’s response. And the neural networks that recognise images, since Yann LeCun’s in the late 1980s, chain dozens of them.' },
        { p: 'This is why graphics cards and the fast Fourier transform, which make Lenia possible live, also serve all these applications. The Computation tab explains how.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'cout', titre: 'The cost of a step', blocs: [
        { p: 'For one Lenia step, each cell must compute its potential: a sum over all the cells of the kernel. With a radius R = 13, the kernel fits in a 27 × 27 square, that is 729 multiplications per cell. A 256 × 256 world has 65,536 cells: nearly 48 million multiplications for a single step, and dozens of steps are needed per second.' },
        { p: 'For the Expanded Lenia aquarium it is much worse: fifteen kernels of radius 24, that is 15 × 49 × 49 ≈ 36,000 multiplications per cell, and 2.4 billion per step.' },
      ],
    },
    {
      id: 'fourier', titre: 'The detour through Fourier', blocs: [
        { p: 'The Fourier transform turns a convolution into a simple cell-by-cell multiplication:' },
        { tex: tex`\widehat{K * A} = \widehat{K} \cdot \widehat{A}.` },
        { p: 'We transform the state, multiply it by the kernel’s transform, computed once and for all, and come back with the inverse transform. With the *fast Fourier transform* algorithm, published by James Cooley and John Tukey in 1965 but already known to Gauss in 1805, a transform of N × N cells costs on the order of $N^2 \\log_2 N$ operations, whatever the kernel radius. Measure the difference on your processor:' },
        { figure: 'banc' },
        {
          expert: 'why the FFT is so fast', blocs: [
            { p: 'The discrete Fourier transform of N values splits into two transforms of N/2 values, one over the even indices, the other over the odd ones:' },
            { tex: tex`\hat x_k = \hat e_k + \omega^k\, \hat o_k, \qquad \hat x_{k + N/2} = \hat e_k - \omega^k\, \hat o_k, \qquad \omega = e^{-2i\pi/N}.` },
            { p: 'Each level costs N operations, and there are $\\log_2 N$ levels: $N \\log_2 N$ instead of $N^2$. A 2D transform is done by transforming the rows, then the columns.' },
          ],
        },
      ],
    },
    {
      id: 'gpu', titre: 'On the graphics card', blocs: [
        { p: 'The explorer does everything on the graphics card. The state of the world lives in a texture of 32-bit floating-point numbers; each Fourier transform is cut into $2\\log_2 N$ passes, one per level, first along the rows, then along the columns. In each pass, a small program, a *shader*, computes each cell from two values of the previous pass. An RGBA texture carries two complex numbers: two channels, or two kernels, are processed at once.' },
        { p: 'A classic Lenia step on a 256 × 256 world thus takes about thirty passes: forward transform, product with the kernel, inverse transform, growth. The aquarium, with its fifteen kernels, takes nearly two hundred, which the graphics card runs through in a few milliseconds. The kernels’ transforms are only recomputed when the rule changes.' },
        { p: 'Real 32-bit numbers are needed: in 16 bits, the rounding errors of the transforms scramble the creatures within a few steps. This is why the explorer refuses to start on the rare graphics cards that cannot write them.' },
        {
          expert: 'the FFT without permutation', blocs: [
            { p: 'The classic version of the algorithm starts by permuting the data into bit-reversed order. On a graphics card, the Stockham variant is preferred: each pass rereads the data in an order that makes the permutation unnecessary. At pass s, with $L = 2^{s+1}$, cell k reads two values:' },
            { tex: tex`e = \Big\lfloor \frac{k}{L} \Big\rfloor \frac{L}{2} + \Big(k \bmod \frac{L}{2}\Big), \quad x'_k = x_e + e^{-2i\pi (k \bmod L)/L}\; x_{e + N/2}.` },
            { p: 'This indexing was checked against a directly computed transform before being written in GLSL.' },
          ],
        },
      ],
    },
    {
      id: 'flow', titre: 'Conserving mass', blocs: [
        { p: 'For Flow Lenia, each step adds two passes. The first computes the flow at each cell, with a Sobel filter, which estimates a slope from the eight neighbours. The second redistributes matter: each cell looks, within a 7 × 7 square around it, for all those whose matter lands on it, and adds up their shares. Since a source cell’s shares split exactly, the total mass only changes because of floating-point rounding.' },
        { p: 'With several species, three more passes carry the kernel weights. So that all three choose the same source, they share the same random draw, fixed by the cell’s position and the step number.' },
      ],
    },
    {
      id: 'bestiaire', titre: 'Where the creatures come from', blocs: [
        { p: 'The Lenia and Expanded Lenia creatures come from the catalogue Bert Chan published with his programs, under a free licence. They are encoded in a compact format, each value from 1 to 255 being written as one or two letters. Before being included, each one was simulated in Python, with the same kernels and growths, to check that it keeps its mass and its shape. The Flow Lenia rules were found by random search: some sixty rules drawn from the intervals of the original paper, simulated, and four kept for their behaviour.' },
        { p: 'Mutants are drawn live: each parameter of the rule is multiplied by a random factor close to 1. The four 128 × 128 worlds run at the same time. Every 0.4 seconds, the explorer measures their mass: below 15% of the starting mass, the mutant is extinct; above four times, it overflows.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'A short history', blocs: [
        {
          frise: [
            ['1805', 'Carl Friedrich Gauss', 'uses a fast Fourier transform to compute orbits; his notes are only published after his death.'],
            ['1834', 'John Scott Russell', 'observes a solitary wave in a canal near Edinburgh.'],
            ['1940s', 'John von Neumann and Stanisław Ulam', 'invent cellular automata to study self-reproduction.'],
            ['1952', 'Alan Turing', 'publishes *The Chemical Basis of Morphogenesis*.'],
            ['1965', 'James Cooley and John Tukey', 'publish the fast Fourier transform algorithm.'],
            ['1970', 'John Conway', 'invents the Game of Life, presented in October by Martin Gardner in Scientific American.'],
            ['1987', 'Christopher Langton', 'organises the first artificial life workshop at Los Alamos.'],
            ['1995', 'Shigeru Kondo and Rihito Asai', 'show that the angelfish’s stripes follow a Turing model.'],
            ['1996', 'Paul Umbanhowar, Francisco Melo and Harry Swinney', 'observe oscillons in vibrated sand.'],
            ['Around 2005', 'Bert Chan', 'writes Primordia, a program that foreshadows Lenia.'],
            ['2011', 'Stephan Rafler', 'publishes SmoothLife.'],
            ['2018', 'Bert Chan', 'puts Lenia online, then publishes *Lenia: Biology of Artificial Life* (Complex Systems, 2019).'],
            ['2020', 'Bert Chan', 'presents Expanded Lenia at the ALIFE conference: several channels, several kernels.'],
            ['2020', 'Chris Reinke, Mayalen Etcheverry and Pierre-Yves Oudeyer', 'explore Lenia with a curiosity-driven algorithm.'],
            ['2020', 'Alexander Mordvintsev and colleagues', 'publish the neural cellular automata that grow and repair themselves.'],
            ['2022', 'Alexander Mordvintsev, Eyvind Niklasson and Ettore Randazzo', 'propose Particle Lenia.'],
            ['2023', 'Erwan Plantec, Bert Chan and colleagues', 'present Flow Lenia, where matter is conserved.'],
            ['2024', 'Akarsh Kumar and colleagues', 'search for artificial life with models linking images and text.'],
          ],
        },
      ],
    },
    {
      id: 'refs', titre: 'References', blocs: [
        {
          refs: [
            ['A. M. Turing, “The chemical basis of morphogenesis”, Philosophical Transactions of the Royal Society B 237, 1952.'],
            ['J. W. Cooley and J. W. Tukey, “An algorithm for the machine calculation of complex Fourier series”, Mathematics of Computation 19, 1965.'],
            ['J. von Neumann, *Theory of Self-Reproducing Automata*, edited by A. W. Burks, University of Illinois Press, 1966.'],
            ['M. Gardner, “Mathematical Games: The fantastic combinations of John Conway’s new solitaire game “life””, Scientific American 223, October 1970.'],
            ['M. T. Heideman, D. H. Johnson and C. S. Burrus, “Gauss and the history of the fast Fourier transform”, IEEE ASSP Magazine 1, 1984.'],
            ['C. G. Langton (ed.), *Artificial Life*, Addison-Wesley, 1989.'],
            ['J. E. Pearson, “Complex patterns in a simple system”, Science 261, 1993.'],
            ['S. Kondo and R. Asai, “A reaction–diffusion wave on the skin of the marine angelfish Pomacanthus”, Nature 376, 1995.'],
            ['P. B. Umbanhowar, F. Melo and H. L. Swinney, “Localized excitations in a vertically vibrated granular layer”, Nature 382, 1996.'],
            ['S. Rafler, “Generalization of Conway’s “Game of Life” to a continuous domain – SmoothLife”, arXiv:1111.1567, 2011.', 'https://arxiv.org/abs/1111.1567'],
            ['B. W.-C. Chan, “Lenia: Biology of Artificial Life”, Complex Systems 28, 2019.', 'https://arxiv.org/abs/1812.05433'],
            ['B. W.-C. Chan, “Lenia and Expanded Universe”, ALIFE 2020.', 'https://arxiv.org/abs/2005.03742'],
            ['C. Reinke, M. Etcheverry and P.-Y. Oudeyer, “Intrinsically Motivated Discovery of Diverse Patterns in Self-Organizing Systems”, ICLR 2020.', 'https://arxiv.org/abs/1908.06663'],
            ['A. Mordvintsev, E. Randazzo, E. Niklasson and M. Levin, “Growing Neural Cellular Automata”, Distill, 2020.', 'https://distill.pub/2020/growing-ca/'],
            ['M. Moroz, “Reintegration tracking”, 2020.', 'https://michaelmoroz.github.io/Reintegration-Tracking/'],
            ['A. Mordvintsev, E. Niklasson and E. Randazzo, “Particle Lenia and the energy-based formulation”, 2022.', 'https://google-research.github.io/self-organising-systems/particle-lenia/'],
            ['E. Plantec, G. Hamon, M. Etcheverry, P.-Y. Oudeyer, C. Moulin-Frier and B. W.-C. Chan, “Flow-Lenia: Towards open-ended evolution in cellular automata through mass conservation and parameter localization”, ALIFE 2023.', 'https://arxiv.org/abs/2212.07906'],
            ['A. Kumar et al., “Automating the Search for Artificial Life with Foundation Models”, 2024.', 'https://arxiv.org/abs/2412.17799'],
            ['B. Chan, Lenia repository (programs and creature catalogue, MIT licence).', 'https://github.com/Chakazul/Lenia'],
            ['E. Plantec, FlowLenia repository.', 'https://github.com/erwanplantec/FlowLenia'],
          ],
        },
      ],
    },
  ],

  figures: {
    mecanisme: {
      titres: ['The state A', 'The potential U = K * A', 'The growth G(U)'],
      pause: 'Pause',
      reprendre: 'Resume',
      recommencer: 'Restart',
      temps: (t) => `t = ${t}`,
      legende: 'An Orbium in a 64 × 64 world, computed in your browser. In the middle, the potential is stretched to be visible. On the right, in green, the cells gaining matter; in magenta, those losing it.',
    },
    voisinages: {
      choix: 'Neighbourhood',
      noms: { vie: 'Game of Life', un: 'One ring', deux: 'Two rings', trois: 'Three rings' },
      descriptions: {
        vie: 'Conway’s eight neighbours, all with the same weight.',
        un: 'Orbium’s kernel: a smooth ring of radius 13.',
        deux: 'Two rings, the second three times weaker: the Kronium family.',
        trois: 'Three rings of heights 1/2, 1 and 2/3: Hydrogeminium.',
      },
      legende: 'The brighter the cell, the more that neighbour counts in the average. The centre does not count: a cell does not see itself.',
    },
    regle: {
      legende: 'On the left, Orbium’s kernel; on the right, its growth. The centre μ says where the ideal density lies, the width σ how much deviation is tolerated.',
    },
    robustesse: {
      label: 'An Orbium you can shake or cut',
      bousculer: 'Shake',
      couper: 'Cut a piece off',
      recommencer: 'Restart',
      masse: (m) => `mass ${m}`,
      legende: 'Shaking adds noise around the creature; cutting erases its front half. As long as the damage is not too large, Orbium recovers its shape and its mass, around 70.',
    },
    galerie: {
      ouvrir: 'Open in the explorer',
      cartes: {
        orbium: 'The most famous glider.',
        scutium: 'A fast shield.',
        gyrorbium: 'Goes round in circles.',
        hydrogeminium: 'Three rings, a slow swim.',
        hexadentium: 'A six-toothed wheel.',
        asterium: 'A star on the move.',
        limus: 'Three channels, fifteen kernels.',
        gyrans: 'The aquarium, in colour.',
        planeur: 'Conway, replayed by Lenia.',
      },
    },
    banc: {
      bouton: 'Measure',
      encore: 'Measure again',
      enCours: 'Measuring…',
      attente: 'A convolution by Orbium’s kernel (R = 13), computed directly and then through the Fourier transform, for three world sizes.',
      monde: 'World',
      directe: 'Direct',
      fourier: 'Fourier',
      rapport: 'Gain',
      ms: (n) => `${n} ms`,
      legende: 'In JavaScript, on the processor. The direct cost grows with the number of cells in the kernel; Fourier’s does not. The gap grows further for the large kernels of Expanded Lenia.',
    },
  },
}

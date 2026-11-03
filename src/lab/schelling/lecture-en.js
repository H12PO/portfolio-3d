// ============================================================
//  ARTICLES IN ENGLISH: Understand, Theory, Applications, Computing,
//  History and references, and the figure texts
//  Same structure as lecture-fr.js.
// ============================================================

const tex = String.raw

export const LECTURE_EN = {
  comprendre: [
    {
      id: 'idee', titre: 'Modest preferences, a divided city', blocs: [
        { p: 'Take a checkerboard. Scatter tokens of two colours at random, and leave a few squares empty. Each token has a single, modest demand: that at least a third of its neighbours share its colour. So it is quite willing to be a minority. If it is not satisfied, it moves to an empty square.' },
        { p: 'You would expect a mixed city, since nobody asks to live among their own. Yet a divided city appears within a few rounds: single-colour neighbourhoods with sharp borders. At the start, one neighbour in two is alike; at the end, three in four.' },
        { figure: 'damier' },
        { p: 'This is the experiment the economist Thomas Schelling ran by hand in the late 1960s, with coins on a checkerboard. It shows an idea that goes far beyond cities: reasonable individual choices can produce a collective outcome that nobody wanted. Schelling turned it into the title of a book: *Micromotives and Macrobehavior*.' },
      ],
    },
    {
      id: 'regle', titre: 'The rules of the game', blocs: [
        { p: 'In the explorer, the city is a grid of 100 × 100 cells. Each cell is a home, occupied or empty. A resident’s neighbours are the eight surrounding cells. Each round, every resident is woken once on average, in random order:' },
        {
          liste: [
            'they count the share of their occupied neighbours who belong to their group;',
            'if this share reaches their *tolerance* (a third, a half…), they are satisfied and stay put;',
            'otherwise they visit sixteen empty homes drawn at random, and move into one that satisfies them, if there is one.',
          ],
        },
        { p: 'That is all. Nobody sees the whole city, nobody plans a neighbourhood. Segregation is written into no rule: it *emerges* from successive moves, each one making the next a little more likely.' },
      ],
    },
    {
      id: 'lire-ville', titre: 'Reading a city', blocs: [
        { p: 'Each small square is a home. Its colour tells who lives there: orange for group 1, blue for group 2, then green, pink and yellow when there are more groups. Dark squares are empty homes. In the invented city, the dark blue band is a river and the dark green patches are parks: nobody lives there.' },
        { p: 'The *views*, at the top of the explorer, change what the colours say. *Satisfaction*: blue for a satisfied resident, vermilion for a dissatisfied one, yellow for a resident whose rent has become too high. *Incomes*, *Rents* and *Appeal*: from purple (low) to yellow (high).' },
        { p: 'The curves, under the city, follow it round after round. The easiest to read is *Similar neighbours*: the average share of neighbours who belong to the same group. If residents were placed at random, it would equal their group’s share of the city, 50% for two equal groups. The higher it climbs above that, the more divided the city.' },
        { p: 'A *round* is the time it takes for each resident to have had, on average, one chance to move. Seven of the twelve scenarios compare two cities side by side: they start from exactly the same draw and differ by a single setting. Any difference that appears therefore comes from that setting.' },
        { p: 'Here are the twelve scenarios, one by one. For each: the question asked, the rules, what to watch, and what happens. The pictures are computed in your browser, on a small city, with the same engine as the explorer.' },
      ],
    },
    { id: 'sc-damier', titre: '1. Schelling’s checkerboard', blocs: [{ fiche: 'damier' }] },
    { id: 'sc-seuil', titre: '2. The threshold', blocs: [{ fiche: 'seuil' }] },
    { id: 'sc-mixite', titre: '3. Everyone wants diversity', blocs: [{ fiche: 'mixite' }] },
    { id: 'sc-bruit', titre: '4. Randomness', blocs: [{ fiche: 'bruit' }] },
    { id: 'sc-revenus', titre: '5. Rich and poor', blocs: [{ fiche: 'revenus' }] },
    { id: 'sc-gentrification', titre: '6. The centre gentrifies', blocs: [{ fiche: 'gentrification' }] },
    { id: 'sc-social', titre: '7. Social housing', blocs: [{ fiche: 'social' }] },
    { id: 'sc-discrimination', titre: '8. Discrimination', blocs: [{ fiche: 'discrimination' }] },
    { id: 'sc-amis', titre: '9. Friends', blocs: [{ fiche: 'amis' }] },
    { id: 'sc-attachement', titre: '10. Attachment', blocs: [{ fiche: 'attachement' }] },
    { id: 'sc-arrivees', titre: '11. A changing city', blocs: [{ fiche: 'arrivees' }] },
    { id: 'sc-quatre', titre: '12. A small minority', blocs: [{ fiche: 'quatre' }] },
    {
      id: 'lire', titre: 'What the model says, and what it does not', blocs: [
        { p: 'The twelve scenarios show the same thing from twelve angles: a city can become strongly divided without anyone wanting it. Modest preferences are enough (scenarios 1 and 2), so are preferences for diversity (3), and even no preference at all, when prices (5, 6) or discrimination (8) do the sorting.' },
        { p: 'Still, the model does not say why a real city is divided: in the real world all these mechanisms act together, along with the history of neighbourhoods and housing policies. It says something else, more unsettling: you cannot read individual intentions in the collective outcome. A very divided city can arise from people who ask for little, and a mixed city can hide unhappy residents. The Theory and Applications tabs go further.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'modele', titre: 'The model, precisely', blocs: [
        { p: 'A city is a set of cells $x$, each either empty or occupied by a resident $i$ of a group $g_i \\in \\{1, \\dots, G\\}$. The neighbours of a cell are the 8 surrounding cells (the *Moore neighbourhood*). For a resident $i$ living in $x$, let $n_i$ be the number of occupied neighbours and $n_i^{=}$ the number of neighbours from their group. The share of similar neighbours is' },
        { tex: tex`s_i = \frac{n_i^{=}}{n_i}, \qquad \text{and the resident is satisfied if } \; s_i \geq \tau_{g_i},` },
        { p: 'where $\\tau_g$ is the tolerance of group $g$ (a resident with no neighbour is satisfied). The dynamics is *asynchronous*: at each instant, a single resident, drawn at random, may move. A “round” counts as many activations as there are residents. Activated and dissatisfied, a resident visits $k = 16$ empty homes drawn at random and moves into one that satisfies them, if they find one.' },
        { p: 'Schelling moved the discontented in a fixed order, to the *nearest* satisfying cell. Our rule, closer to modern computer versions, mixes more: at equal tolerance, it separates a little more. Both give the same qualitative picture.' },
        {
          expert: 'tolerances only count in steps', blocs: [
            { p: 'With $n_i \\leq 8$, the share $s_i$ only takes a few values: 0, 1/8, 1/7, 1/6… A tolerance of 0.26 and one of 0.33 impose exactly the same condition on a resident with 8 neighbours (at least 3 alike). Gauvin, Vannimenus and Nadal (2009) point this out: only values of the form $k/n$ matter, the others fall back to the nearest one below. That is why the curve in the next section moves in steps.' },
          ],
        },
      ],
    },
    {
      id: 'ligne', titre: 'The linear model of 1971', blocs: [
        { p: 'The 1971 paper begins with a line: 70 people, 35 from each group, in random order. Each looks at their 4 neighbours on the left and 4 on the right, and wants at least half of them to be alike. The discontented move in turn, from left to right, to the nearest place where they would be satisfied, slipping in between two people.' },
        { figure: 'ligne' },
        { p: 'In Schelling’s example, two passes are enough: the line sorts itself into six clusters, and 81.5% of neighbour relations (440 out of 540) link two people from the same group, against about half at the start. The result varies from one draw to the next, but the mechanism is always the same: each departure makes a neighbour discontented, and the clusters reinforce themselves.' },
      ],
    },
    {
      id: 'balayage', titre: 'Three regimes', blocs: [
        { p: 'On the checkerboard, let us vary the tolerance from 0 to 90% and measure, once the city has stopped, the average share of similar neighbours and the share of satisfied residents:' },
        { figure: 'balayage' },
        {
          liste: [
            '*Up to 25%*: almost nothing moves. Residents are happy with two similar neighbours out of eight, which chance nearly always gives them already.',
            '*From 30 to 60%*: the city splits, more and more as tolerance rises, and everyone ends up satisfied. At 60%, 96% of neighbours are alike.',
            '*Beyond 65%*: the city *freezes*. Everyone would want at least six similar neighbours out of eight; almost no empty home offers that, so nobody moves. The city stays mixed, and most residents stay unhappy.',
          ],
        },
        { p: 'This third regime is a reminder that a low segregation index says nothing about well-being: it can hide a city where hardly anyone is happy. Gauvin, Vannimenus and Nadal (2009) find these regimes, and a few others, in a complete phase diagram that also depends on the share of empty homes.' },
        {
          expert: 'what Schelling said', blocs: [
            { p: 'In the 1971 paper, with his “nearest satisfying home” rule and a small 13 × 16 board, Schelling finds *slight* segregation for a demand of one third and *striking* segregation for a demand of one half: beyond one half, more than four neighbours in five are alike. So the moving rule matters. What does not change is the strong non-linearity: a small change in individual demands can transform the whole.' },
          ],
        },
      ],
    },
    {
      id: 'bascule', titre: 'The bounded neighbourhood and the tipping point', blocs: [
        { p: 'The same paper contains a second model, less known yet closer to real neighbourhoods: the *bounded neighbourhood*. There is no geography any more, just one neighbourhood, where one is either inside or outside. Everyone only looks at the proportion of the two groups in it. Within each group, tolerances vary from person to person: the most tolerant accepts, say, twice as many “others” as “own”, the median as many, the least tolerant none.' },
        { p: 'Rank the members of group 1 from the most to the least tolerant. The $n$-th tolerates a ratio $R(n)$ of others to own, which decreases with $n$. If $W$ members of group 1 are present, the least tolerant among them stays as long as $B / W \\leq R(W)$, where $B$ is the number of group 2 members. The boundary' },
        { tex: tex`B = W \, R(W), \qquad R(n) = R_{\max} \left( 1 - \frac{n - 1}{N} \right)` },
        { p: 'is a parabola in the $(W, B)$ plane: below it, group 1 finds the neighbourhood acceptable and moves in; above it, it moves out. Group 2 has its own parabola. Each starting point follows the arrows to an equilibrium. Click in the figure to choose the start:' },
        { figure: 'bascule' },
        { p: 'With Schelling’s base tolerances ($R_{\\max} = 2$) and a group 2 half as large, there are only two stable equilibria: the neighbourhood entirely group 1, or entirely group 2. Any mix is unstable: a few departures are enough for the neighbourhood to *tip*. With two groups of equal size and wider tolerances ($R_{\\max} = 5$), a stable mix appears, around 80 and 80 people, reached from a wide range of starts. With groups of different sizes it disappears again, even with wide tolerances. Schelling draws a few general rules: stable mixes are fragile, they require the minority to be the more tolerant group, and limiting the total number present (the number of homes, say) can help stabilise a mix.' },
        { p: 'This is where the phrase *tipping point*, which Schelling popularised, comes from: a composition threshold beyond which a neighbourhood empties of one group. The Applications tab shows that people looked for it, and found it, in the data of American cities.' },
      ],
    },
    {
      id: 'potentiel', titre: 'Why segregation wins: a potential function', blocs: [
        { p: 'Why is the divided city so robust? In physics, one answers with an energy that the system lowers. Junfu Zhang (2004) shows that a variant of the model has one. In his city, with no empty home, two residents of different groups swap homes when the swap suits them. Everyone prefers a half-and-half neighbourhood, but suffers more from being a minority than from being a majority. The number of pairs of neighbours from different groups then acts as a *potential*: a swap that benefits both residents lowers it.' },
        { p: 'Zhang adds a little randomness: a swap happens with a probability that grows with the gain, following a *log-linear* rule with parameter $\\beta$. He then shows that the *stochastically stable* states, where the system spends almost all its time when $\\beta$ is large, are those that minimise the number of mixed pairs: segregated states, whatever the start, even though everyone prefers integration.' },
        {
          expert: 'potential games and the Gibbs distribution', blocs: [
            { p: 'A game is a *potential game* if there is a function $\\Phi$ of the configuration such that the gain of a player who changes strategy is exactly the change in $\\Phi$. With the asynchronous log-linear rule (a random player picks an option with probability proportional to $e^{\\beta u}$), the Markov chain is reversible and its stationary distribution is a Gibbs distribution:' },
            { tex: tex`\pi(\sigma) \propto e^{\beta\, \Phi(\sigma)} .` },
            { p: 'As $\\beta \\to \\infty$, all the probability concentrates on the global maxima of $\\Phi$: these are Peyton Young’s stochastically stable states (1993, 1998). They are not the same as Nash equilibria, many of which are local traps: they are what remains once randomness has had time to escape the traps.' },
          ],
        },
        { p: 'Sebastian Grauwin, Éric Bertin, Rémi Lemoy and Pablo Jensen (2009) go further. They divide the city into blocks and give each the same utility $u(\\rho)$, a function of the density $\\rho$ of its block, highest when the block is half full. A random resident considers an empty home in another block, and accepts it with probability' },
        { tex: tex`P = \frac{1}{1 + e^{-G/T}}, \qquad G = \Delta u + \alpha \left( \Delta U - \Delta u \right),` },
        { p: 'where $\\Delta u$ is their own gain, $\\Delta U$ the gain of the whole city, and $\\alpha \\in [0, 1]$ their degree of *altruism*. They build a link function that turns individual gains into the change of a global quantity, and derive the equivalent of a free energy. Per block, it reads' },
        {
          tex: tex`f(\rho) = -T \left[ \rho \ln \rho + (1 - \rho) \ln (1 - \rho) \right] + \alpha\, \rho\, u(\rho) + (1 - \alpha) \int_0^{\rho} u(\rho')\, \mathrm{d}\rho'`,
          etroit: tex`\begin{aligned} f(\rho) = &-T \left[ \rho \ln \rho + (1 - \rho) \ln (1 - \rho) \right] \\ &+ \alpha\, \rho\, u(\rho) + (1 - \alpha) \int_0^{\rho} u(\rho')\, \mathrm{d}\rho' \end{aligned}`,
        },
        { p: 'and the city organises itself to maximise $\\sum_q f(\\rho_q)$ at fixed mean density. As for a liquid and its vapour, the answer is read off the *concave hull* of $f$: if $f$ touches its hull at the mean density, the city stays homogeneous; otherwise it splits into empty blocks and overcrowded ones. In the figure the temperature is zero, and utility rises from 0 to 1 up to half full, then falls to $m$ when the block is full:' },
        { figure: 'potentiel' },
        { p: 'With purely selfish residents ($\\alpha = 0$), the city splits, and total utility is low even though everyone tries to improve it. With residents who think of the collective ($\\alpha = 1$), it stays mixed. The transition happens at $\\alpha_c = 1/(3 - 2m)$: a third of altruism is enough when $m = 0$. The moral is precise: what divides is not individual preference, but the gap between what the mover gains and what those left behind lose.' },
      ],
    },
    {
      id: 'mixite', titre: 'Wanting diversity is not enough', blocs: [
        { p: 'Romans Pancs and Nicolaas Vriend (2007) ask the most disturbing question: what happens if everyone *prefers* integration? In their model, each resident’s utility peaks for a half-and-half neighbourhood and decreases on both sides. Everyone picks the best home available. The city splits anyway.' },
        { p: 'The explorer reproduces this result with the *wish for diversity*: satisfaction becomes a score between 0 and 1, highest between the tolerance and the ceiling, dropping fast as a minority and slowly as a majority, as in Zhang. With a ceiling and a tolerance of 50%, everyone wants exactly half-and-half; with a little noise, one still ends up with 88% similar neighbours in our simulations, and fewer than one resident in ten is fully satisfied.' },
        { p: 'The mechanism is that of the previous section. When a resident leaves a neighbourhood where they were a minority, they improve their lot, but they make their former same-group neighbours even more of a minority: those leave in turn. Everyone does their best; nobody pays for the effect of their choices on others. Economists call this an *externality*.' },
        { ouvrir: 'mixite', libelle: 'Open “Everyone wants diversity”' },
      ],
    },
    {
      id: 'physique', titre: 'A cousin of the Ising model', blocs: [
        { p: 'Physicists recognise an old companion in Schelling’s checkerboard. Give each cell a value $c_x$: $+1$ for group 1, $-1$ for group 2, $0$ for an empty home. A configuration where neighbours are alike is one where the products $c_x c_y$ of neighbours are often $+1$: that is a *magnet* in the Ising model, where neighbouring little magnets prefer to align.' },
        { p: 'With empty homes, the right cousin is the Blume–Emery–Griffiths model (1971), designed for mixtures of helium-3 and helium-4. Gauvin, Vannimenus and Nadal (2009) show that Schelling’s rule resembles a search for a minimum of the energy' },
        { tex: tex`E = -\sum_{\langle x, y \rangle} c_x c_y \; - \; K \sum_{\langle x, y \rangle} c_x^2 c_y^2, \qquad K = 1 - 2\tau,` },
        { p: 'where the sums run over pairs of neighbours and $\\tau$ is the tolerance (they write theirs $1 - \\tau$). It is only an analogy: the authors note that $E$ is guaranteed to decrease only if the discontented alone move, which is no longer true once satisfied residents move too. But it guides intuition: segregation is an *ordering*, like magnetisation.' },
        { p: 'In a magnet, temperature opposes order: above a critical temperature, thermal agitation destroys magnetisation (for the Ising model on a square lattice, $T_c = 2 / \\ln(1 + \\sqrt 2) \\approx 2.269$ in natural units). Dietrich Stauffer and Sorin Solomon (2007) thus add a temperature to Schelling’s model: a resident accepts an unfavourable move with a probability that grows with $T$. Above a threshold, the groups mix completely, whatever the composition of the city.' },
        { p: 'The explorer’s *noise* plays this role. It holds a surprise: a little randomness *strengthens* separation before a lot of it dissolves it.' },
        { figure: 'temperature' },
        { p: 'Without noise, the city freezes as soon as everyone is satisfied: its neighbourhoods stay small and irregular. With a little noise, satisfied residents keep moving now and then; small neighbourhoods dissolve in favour of large ones, and separation rises to 97%. With a lot of noise, moves become almost random and the groups mix: the curve falls back towards 50%. In between, the transition is smooth in our simulations, between $T = 0.5$ and $T = 2$.' },
      ],
    },
    {
      id: 'grossissement', titre: 'Neighbourhoods that grow like droplets', blocs: [
        { p: 'Watch a noisy city in the explorer: neighbourhoods grow, small ones are swallowed by large ones, borders round off. This is *coarsening*, as seen in a vinaigrette that separates, or an alloy that cools.' },
        { p: 'Dejan Vinković and Alan Kirman (2006) give it a physical reading: the satisfaction rule creates a *surface tension* along the borders between groups. A resident sitting on a convex border has fewer similar neighbours than one at the bottom of a hollow; borders therefore tend to shorten, and small clusters, which have a lot of border for few residents, disappear in favour of large ones. Empty homes form a layer that insulates clusters from one another.' },
        { p: 'Luca Dall’Asta, Claudio Castellano and Matteo Marsili (2008) measure the speed of this coarsening: the typical size $L$ of the clusters grows as' },
        { tex: tex`L(t) \sim t^{1/z}, \qquad z = 2,` },
        { p: 'the law of systems where order is not locally conserved. The density of borders decreases as $1/L$, hence as $t^{-1/2}$. On a log-log plot, that gives a straight line of slope $-1/2$:' },
        { figure: 'grossissement' },
        { p: 'In our simulations with a little noise, the slope is about $-0.47$ beyond 20 rounds, close to the theoretical value. Without noise the curve stops dead: the city freezes and its borders no longer move. Dall’Asta and colleagues also show that beyond a certain share of empty homes, the vacancies form a connected network and clusters stop growing.' },
      ],
    },
    {
      id: 'mesures', titre: 'Measuring segregation', blocs: [
        { p: 'To compare cities, one needs a number. The oldest is the *dissimilarity index* of Otis and Beverly Duncan (1955). Divide the city into districts; if district $q$ has $a_q$ residents of group A and $b_q$ of group B, out of totals $A$ and $B$,' },
        { tex: tex`D = \frac{1}{2} \sum_q \left| \frac{a_q}{A} - \frac{b_q}{B} \right| .` },
        { p: '$D$ is the share of one group that would have to move for every district to have the city’s composition. Henri Theil’s *entropy index* extends to several groups: if $E$ is the entropy of the city’s composition and $E_q$ that of district $q$, with population $t_q$ out of $T$,' },
        { tex: tex`H = \sum_q \frac{t_q}{T} \, \frac{E - E_q}{E}, \qquad E = -\sum_g \pi_g \ln \pi_g .` },
        { p: '$H$ is 0 if every district looks like the city, 1 if every district holds a single group. It is the index the explorer’s curves follow, and the one INSEE uses for incomes. The *isolation index* measures something else: the average share of one’s own group in the district of a member of B, $P^* = \\sum_q (b_q / B)(b_q / t_q)$.' },
        { p: 'Douglas Massey and Nancy Denton (1988) distinguish five dimensions of segregation: *evenness* (the $D$ and $H$), *exposure* (isolation), *concentration* in little space, *centralisation* near the centre, and *clustering* of a group’s districts. No index sums them all up. The figure shows a deeper trap, known as the *checkerboard problem*: district-based indices depend on the size of districts and ignore their arrangement.' },
        { figure: 'mesures' },
        { p: 'Stripes 3 cells wide give $D = 0$ with 6 × 6 districts (each district is half-and-half) and $D = 1$ with 3 × 3 districts. A perfect checkerboard gives an almost zero $D$ at every scale. The share of similar neighbours, measured at street level, sees something else again. That is why the explorer shows several measures at once.' },
      ],
    },
    {
      id: 'economie', titre: 'Prices, incomes and rules', blocs: [
        { p: 'Economists add what the model lacks most: a price. Since Charles Tiebout (1956), we know that households “vote with their feet” and sort themselves by what they can and want to pay. In the explorer, the rent of a home $c$ follows a target that depends on its appeal $A_c$ and on the mean income $\\bar y_c$ of the residents of the surrounding 5 × 5 cells:' },
        { tex: tex`L_c^{\star} = \lambda \cdot \min\!\left( 0.98,\; \max\!\left( 0.02,\; 0.22 + 0.5\, A_c + 0.9 \left( \bar y_c - \tfrac{1}{2} \right) \right) \right),` },
        { p: 'where $\\lambda$ is the strength of the market (the Rents slider). A resident with income $y_i$ can only move in if $L_c \\leq y_i$, and must leave if the rent exceeds their means by more than 8%. The loop is closed: the rich settle in nice places, rents rise there, the poor can no longer get in, and rents rise further.' },
        { p: 'If groups have different mean incomes, this loop also separates *groups*, without anyone looking at their neighbours’ group: in our simulations, 66% similar neighbours with unequal incomes, against 50% with equal incomes. William Clark and Mark Fossett (2008) find that incomes weigh heavily on social separation but rather little on ethnic separation: the income gap is only one possible channel.' },
        { p: 'The last two factors are *rules*. Social housing breaks the rent loop: scattered across the city, it halves income segregation in our simulations; grouped in large estates, it changes almost nothing. Discrimination acts as a constraint: landlords who refuse a group in some districts are enough, over successive moves, to divide a city where nobody has any preference.' },
        { ouvrir: 'social', libelle: 'Compare scattered and grouped social housing' },
      ],
    },
  ],

  applications: [
    {
      id: 'bascule-reelle', titre: 'The tipping point exists', blocs: [
        { p: 'If the bounded-neighbourhood model is right, neighbourhoods should tip: below a certain share of minorities, the majority population stays; above it, it leaves. David Card, Alexandre Mas and Jesse Rothstein (2008) looked for these thresholds in US censuses from 1970 to 2000, tract by tract, with discontinuity methods.' },
        { p: 'They find them in most cities: white population flows show a sharp break when the minority share exceeds a threshold, between about 5 and 20% depending on the city. These thresholds are higher in cities whose residents report being more tolerant. Rents and housing prices, on the other hand, show no break at the same point.' },
      ],
    },
    {
      id: 'preferences', titre: 'What surveys say', blocs: [
        { p: 'The model needs preferences. Surveys measure them: people are shown drawings of neighbourhoods of various compositions and asked where they would like to live. A survey conducted in Detroit in the 1970s found that most Black residents preferred neighbourhoods roughly half-and-half, and most white residents almost entirely white neighbourhoods.' },
        { p: 'Clark and Fossett (2008) summarise more recent data from Los Angeles: all four groups studied want a majority, or close to it, of their neighbours to be from their group. The share of people wanting at least 3 neighbours in 8 from their group ranges from 60% (Black residents) to 75% (residents of Asian origin). These are precisely the levels which, in the model, are enough to divide a city. The authors conclude that removing discrimination would not, by itself, quickly produce a mixed city; they do not say that discrimination does not matter.' },
      ],
    },
    {
      id: 'france', titre: 'In France: incomes, housing, discrimination', blocs: [
        { p: 'In France, separation is mostly measured by income. A study by INSEE, the French statistics office (Mathilde Gerardin and Julien Pramil, 2023), applies Theil’s index to five income brackets, on 200-metre grid squares, in the dense areas of the 53 largest cities. Between 2004 and 2019, income segregation rose in more than 30 of the 50 cities studied. The richest 20% and the poorest 20% are the most concentrated; middle-income households are the most evenly spread. Paris and Marseille are among the most divided cities; Lyon, Toulouse, Nice and Montpellier among the most homogeneous.' },
        { p: 'The same study notes that the share of social housing is higher in the least homogeneous cities, and puts forward a hypothesis: the concentration of social housing in the large estates of the 1960s. This is exactly the difference the explorer’s “Social housing” scenario shows between scattered and grouped homes. Since the SRU law of 13 December 2000 (article 55), the municipalities concerned must have 20 or 25% social housing, depending on how tight the local market is.' },
        { p: 'Discrimination, finally, is measured by *field experiments*: one answers ads with fictitious applications that are identical except for one detail. Julie Le Gallo, Yannick L’Horty, Loïc du Parquet and Pascale Petit sent five applications to each of 5,000 rental ads, in the 50 largest urban areas, in 2016. They find no discrimination by age, but substantial discrimination by origin: applicants whose name suggests a North African or sub-Saharan African origin are penalised.' },
        { ouvrir: 'discrimination', libelle: 'See the effect of discrimination in the explorer' },
      ],
    },
    {
      id: 'ailleurs', titre: 'Far beyond cities', blocs: [
        { p: 'Schelling’s model has become a textbook example of *emergence*: a collective phenomenon that nobody wants and that cannot be read in any individual rule. It applies wherever individuals choose their surroundings: schools, firms, friendship networks, places to meet. It also launched a whole tradition of *agent-based models* in economics and sociology, and a bridge between those fields and statistical physics.' },
        { p: 'In 2014, Vi Hart and Nicky Case turned it into a short interactive story, *Parable of the Polygons*, released into the public domain. Slightly biased triangles and squares build a divided city; the moral of the story is that undoing separation takes deliberate action, whereas a little bias is enough to create it.' },
      ],
    },
    {
      id: 'limites', titre: 'The limits', blocs: [
        { p: 'The model is a caricature, and that is its strength: it isolates one mechanism. But it cannot say what divided a real city. Cities have a history: public policies, practices of banks and estate agents (such as *redlining* in the United States in the 1930s), large estates built all at once, inherited income gaps. The model shows that a weak preference is *enough*; it does not show that it is the cause.' },
        { p: 'Preferences themselves are not facts of nature: they depend on experience, on the fear of seeing one’s home lose value, on schools, safety, the image of a neighbourhood. The model takes them as fixed; yet they change with the city. Finally, the checkerboard ignores distances, transport, jobs. The explorer’s invented city brings a little of that back, and the next step would be a real city map.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'tableaux', titre: 'The city as arrays', blocs: [
        { p: 'The whole city fits in JavaScript typed arrays, one element per cell: the ground (habitable, water, park, wall), the resident present or $-1$, the rent, the appeal, social housing, the landlord’s possible refusal. Residents have their own arrays: group, income, position, moving-in date, friends. An array of 100 × 100 32-bit integers weighs 40 kB: the whole city fits comfortably in the processor’s caches.' },
        { p: 'Two lists make every operation instantaneous: the list of residents and the list of empty homes, each paired with an index giving the position of every element in the list. Drawing an empty home at random, removing one, adding one, all take constant time: the removed element is swapped with the last one of the list. The eight neighbours of each cell are computed once and for all, with edges or with the checkerboard wrapped around.' },
      ],
    },
    {
      id: 'tour', titre: 'One round, step by step', blocs: [
        { p: 'A round is as many activations as there are residents, each on a resident drawn at random: some move twice, others not at all. This *asynchronous* update avoids a flaw of simultaneous updates: if all the discontented moved at once, they would target the same homes and create new discontent en masse.' },
        { p: 'Once activated, a resident $i$ computes the utility of their current home $c_0$, then of $k$ empty homes drawn at random ($k = 16$ if they are discontented, $k = 4$ if they are satisfied and only looking for better). The utility of a home $c$ is' },
        { tex: tex`u_i(c) = S_i(c) + w_A \, A_c + w_F \, F_i(c),` },
        { p: 'where $S_i$ is social satisfaction (0 or 1, or a score with the wish for diversity), $A_c$ the appeal of the place and $F_i(c)$ the share of their friends within 6 cells. Without noise, they keep the best home $c^{\\star}$; with noise $T > 0$, they draw a home with probability proportional to $e^{u_i(c)/T}$. They then move with probability' },
        { tex: tex`P = \frac{1}{1 + e^{-G/T}}, \qquad G = u_i(c^{\star}) - u_i(c_0) - \kappa_i,` },
        { p: 'where $\\kappa_i$ is the cost of moving: 0.04, plus attachment, which grows over the first 10 rounds spent in the same place. Without noise, they move if $G > 0$. Rents are revised at the same pace: each cell once per round on average, halfway towards its target.' },
      ],
    },
    {
      id: 'mesures-calcul', titre: 'Measuring in a single pass', blocs: [
        { p: 'The curves are updated four times per second. Each measurement goes once through the list of residents: it counts similar neighbours, satisfied residents, pairs of neighbours from different groups, and fills an array of counts per district and per group, from which Theil’s index is derived. For income segregation, the thresholds of the five brackets come first: incomes are sorted, which costs $O(n \\log n)$, about a millisecond for 10,000 residents.' },
        { p: 'The number of moves is a counter, reset at each measurement and divided by the time elapsed in rounds. When the history exceeds 240 points, only one in two is kept: the curves cover the whole simulation without their cost growing.' },
      ],
    },
    {
      id: 'cout', titre: 'What a round costs', blocs: [
        { p: 'How long does a round take? It depends enormously on the settings, because satisfied residents of the classic model do nothing, whereas with noise or the wish for diversity everyone searches. Here is the mean duration of a round on a 100 × 100 city, measured over 150 rounds with the explorer’s engine:' },
        { figure: 'cout' },
        { p: 'Even the worst case fits in about twenty milliseconds. The computation therefore stays on the browser’s main thread, without a *Web Worker*: the animation loop advances in slices of 0.05 round and stops as soon as it has spent 10 milliseconds in a frame. If the city is too heavy, the simulation slows down instead of freezing the page.' },
        { p: 'The drawing is an image painted pixel by pixel: each cell becomes a square of $s \\times s$ pixels, with $s$ an integer to keep sharp edges. Colours are written directly into an array of 32-bit integers sharing the image’s memory, which is then pasted into the canvas in one go.' },
      ],
    },
    {
      id: 'hasard', titre: 'The same randomness for two cities', blocs: [
        { p: 'The whole simulation draws its numbers from a seeded pseudo-random generator (*mulberry32*). Two cities created with the same seed and the same terrain start from exactly the same state: that is what makes the side-by-side comparison fair. They then diverge, of course, since their rules differ.' },
        { p: 'The figures quoted in these tabs come from the same engine, run in Node.js on 100 × 100 grids, often averaged over several seeds. The curves in the Theory tab are precomputed that way and stored in a small data file.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Landmarks', blocs: [
        {
          frise: [
            ['1949', 'James Sakoda', 'defends at Berkeley a thesis on the Minidoka incarceration camp, where he himself had been held; its appendix contains an early checkerboard model.'],
            ['1955', 'Otis and Beverly Duncan', 'compare segregation indices, among them the dissimilarity index.'],
            ['1956', 'Charles Tiebout', 'describes households that “vote with their feet” by choosing their municipality.'],
            ['1969', 'Thomas Schelling', 'publishes *Models of Segregation*, a RAND memorandum, and a short article in the *American Economic Review*.'],
            ['1971', 'Sakoda, then Schelling', 'publish their checkerboard models in the first two issues of the *Journal of Mathematical Sociology*. Schelling’s would become the journal’s most cited article.'],
            ['1971', 'Blume, Emery and Griffiths', 'propose, for helium mixtures, the physics model of which Schelling’s is a cousin.'],
            ['1978', 'Thomas Schelling', 'publishes *Micromotives and Macrobehavior*.'],
            ['1988', 'Douglas Massey and Nancy Denton', 'distinguish five dimensions of segregation.'],
            ['1996', 'Joshua Epstein and Robert Axtell', 'grow artificial societies (*Sugarscape*): agent-based models become a method.'],
            ['1998', 'H. Peyton Young', 'publishes *Individual Strategy and Social Structure*: stochastic stability.'],
            ['2000', 'SRU law', 'requires the French municipalities concerned to have a minimum share of social housing.'],
            ['2004', 'Junfu Zhang', 'shows segregation in a world where everyone wants integration.'],
            ['2005', 'Thomas Schelling', 'receives the Prize in Economic Sciences in Memory of Alfred Nobel, with Robert Aumann.'],
            ['2006', 'Dejan Vinković and Alan Kirman', 'propose the analogy with liquids and surface tension.'],
            ['2007', 'Pancs and Vriend; Stauffer and Solomon', 'revisit the model: preference for integration, temperature and the Ising model.'],
            ['2008', 'Card, Mas and Rothstein', 'find tipping points in American neighbourhoods.'],
            ['2008', 'Dall’Asta, Castellano and Marsili', 'measure the coarsening of neighbourhoods.'],
            ['2009', 'Grauwin, Bertin, Lemoy and Jensen', 'link individual and collective behaviour through a potential function.'],
            ['2009', 'Gauvin, Vannimenus and Nadal', 'draw the model’s phase diagram.'],
            ['2014', 'Vi Hart and Nicky Case', 'publish *Parable of the Polygons*.'],
            ['2017', 'Rainer Hegselmann', 'traces the intertwined history of Sakoda’s and Schelling’s models.'],
            ['2023', 'INSEE', 'measures the rise of income segregation in most large French cities.'],
          ],
        },
      ],
    },
    {
      id: 'deux-peres', titre: 'One model, two fathers', blocs: [
        { p: 'Thomas Schelling ran his simulations by hand, with coins, counters or whatever came to hand, on a checkerboard. It was a choice: a model anyone can redo on their kitchen table. James Minoru Sakoda, on the other hand, was a pioneer of computer simulation. His 1971 model, published one issue before Schelling’s in the same journal, moved two groups on a checkerboard according to their attitudes, attraction, indifference or rejection, towards their own group and the other.' },
        { p: 'Rainer Hegselmann (2017) shows that, in a sense, Schelling’s model is a special case of Sakoda’s. Yet Sakoda’s article went almost unnoticed, while Schelling’s became a classic. Hegselmann sees in this a combination of technical factors (a model one can run by hand, easy to show) and social ones (the reputation of a famous author), with nobody at fault.' },
      ],
    },
    {
      id: 'refs', titre: 'References', blocs: [
        {
          refs: [
            ['T. C. Schelling, “Dynamic Models of Segregation”, *Journal of Mathematical Sociology*, 1 (2), 143–186, 1971.', 'https://doi.org/10.1080/0022250X.1971.9989794'],
            ['T. C. Schelling, “Models of Segregation”, *American Economic Review*, 59 (2), 488–493, 1969.'],
            ['T. C. Schelling, *Micromotives and Macrobehavior*, W. W. Norton, 1978.'],
            ['J. M. Sakoda, “The Checkerboard Model of Social Interaction”, *Journal of Mathematical Sociology*, 1 (1), 1971.'],
            ['R. Hegselmann, “Thomas C. Schelling and James M. Sakoda: The Intellectual, Technical, and Social History of a Model”, *JASSS*, 20 (3), 15, 2017.', 'https://www.jasss.org/20/3/15.html'],
            ['J. Zhang, “Residential segregation in an all-integrationist world”, *Journal of Economic Behavior & Organization*, 54 (4), 533–550, 2004.', 'https://ideas.repec.org/a/eee/jeborg/v54y2004i4p533-550.html'],
            ['R. Pancs and N. J. Vriend, “Schelling’s spatial proximity model of segregation revisited”, *Journal of Public Economics*, 91, 1–24, 2007.', 'https://nvriend.econ.qmul.ac.uk/abs/abs.pubec.html'],
            ['H. P. Young, *Individual Strategy and Social Structure*, Princeton University Press, 1998.'],
            ['S. Grauwin, É. Bertin, R. Lemoy and P. Jensen, “Competition between collective and individual dynamics”, *PNAS*, 106, 2009.', 'https://www.arxiv.org/abs/0907.2167'],
            ['L. Gauvin, J. Vannimenus and J.-P. Nadal, “Phase diagram of a Schelling segregation model”, *European Physical Journal B*, 70, 293–304, 2009.', 'https://ar5iv.arxiv.org/html/0903.4694'],
            ['L. Dall’Asta, C. Castellano and M. Marsili, “Statistical physics of the Schelling model of segregation”, *Journal of Statistical Mechanics*, 2008.', 'https://arxiv.org/abs/0707.1681'],
            ['D. Stauffer and S. Solomon, “Ising, Schelling and self-organising segregation”, *European Physical Journal B*, 2007.', 'https://arxiv.org/abs/physics/0701051'],
            ['D. Vinković and A. Kirman, “A physical analogue of the Schelling model”, *PNAS*, 103, 2006.', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1748214'],
            ['M. Blume, V. J. Emery and R. B. Griffiths, “Ising model for the λ transition and phase separation in He³-He⁴ mixtures”, *Physical Review A*, 4, 1971.'],
            ['O. D. Duncan and B. Duncan, “A methodological analysis of segregation indexes”, *American Sociological Review*, 20 (2), 210–217, 1955.'],
            ['D. S. Massey and N. A. Denton, “The Dimensions of Residential Segregation”, *Social Forces*, 67 (2), 1988.', 'https://collaborate.princeton.edu/en/publications/the-dimensions-of-residential-segregation/'],
            ['C. M. Tiebout, “A Pure Theory of Local Expenditures”, *Journal of Political Economy*, 64 (5), 416–424, 1956.'],
            ['D. Card, A. Mas and J. Rothstein, “Tipping and the Dynamics of Segregation”, *Quarterly Journal of Economics*, 123 (1), 177–218, 2008.', 'https://nber.org/papers/w13052'],
            ['W. A. V. Clark and M. Fossett, “Understanding the social context of the Schelling segregation model”, *PNAS*, 105 (11), 4109–4114, 2008.', 'https://ccpr.ucla.edu/wp-content/uploads/2024/04/Understanding-the-social-context-of-the-Schelling-segregation-model.pdf'],
            ['M. Gerardin and J. Pramil, “En 15 ans, les disparités entre quartiers, mesurées selon le revenu, se sont accentuées dans la plupart des grandes villes”, *Insee Analyses*, 79, 2023 (in French).', 'https://www.insee.fr/fr/statistiques/6680439'],
            ['J. Le Gallo, Y. L’Horty, L. du Parquet and P. Petit, “Les discriminations dans l’accès au logement en France : un testing sur les aires urbaines métropolitaines”, *Économie et Statistique*, 513, 2019 (in French).', 'https://www.insee.fr/fr/statistiques/4467358'],
            ['ANIL, “Production de logements sociaux : obligations des communes” (article 55 of the SRU law, in French).', 'https://www.anil.org/aj-logement-production-logement-social-obligation-commune/'],
            ['J. M. Epstein and R. Axtell, *Growing Artificial Societies*, Brookings Institution Press and MIT Press, 1996.'],
            ['V. Hart and N. Case, *Parable of the Polygons*, 2014 (public domain).', 'https://ncase.me/polygons/'],
          ],
        },
      ],
    },
  ],

  fiche: {
    regles: 'The rules',
    regarder: 'What to watch',
    pourquoi: 'What happens, and why',
    realite: 'In the real world',
    ouvrir: 'Open this scenario in the explorer',
    depart: 'Start',
    apres: (n) => `After ${n} rounds`,
    ville: (c, n, nom) => `City ${c.toUpperCase()} (${nom}), after ${n} rounds`,
    calcul: 'Computing…',
    note: (vue) => `A small 60 × 60 city, computed in your browser with the explorer’s engine. View: ${vue.toLowerCase()}.`,
    mesures: {
      semblables: (v) => `${v} similar neighbours`,
      satisfaits: (v) => `${v} satisfied`,
      theilRevenus: (v) => `income segregation: ${v}`,
      minorite: (v) => `minority: ${v} similar neighbours`,
    },
  },

  fiches: {
    damier: {
      question: 'If everyone accepts being a minority, does the city stay mixed?',
      regles: [
        'Two groups of equal size, orange and blue, placed at random; 10% empty homes.',
        'Each resident wants at least a third of their neighbours to be like them, that is 3 out of 8. So they accept being a minority.',
        'A dissatisfied resident moves to an empty home where they would be satisfied.',
      ],
      regarder: [
        'At the start, *Satisfaction* view: about one resident in five is dissatisfied (vermilion), scattered everywhere.',
        'The *Similar neighbours* curve: it starts at 50% (chance), climbs towards 75% in about ten rounds, then stops.',
      ],
      pourquoi: [
        'Each move has two effects. By leaving, an orange resident leaves their former orange neighbours a little more alone among the blues: some fall below their threshold and leave in turn. By arriving, they strengthen an orange corner, which becomes more welcoming to the next oranges.',
        'These two effects drive each other: it is a cascade. It stops when nobody is dissatisfied any more. By then, everyone lives surrounded three quarters by their own group, although a third was enough for them. The city is far more divided than anyone asked for.',
      ],
      realite: 'This is the experiment Schelling ran by hand, with coins. His lesson: you cannot read residents’ intentions in the map of a city. Strong separation can arise from modest preferences.',
    },
    seuil: {
      question: 'Does a small difference in tolerance make a small difference in the city?',
      regles: [
        'Two twin cities: same starting draw, same rules, a single difference.',
        'City A: everyone wants at least 25% similar neighbours, that is 2 out of 8.',
        'City B: at least 30%, that is 3 out of 8.',
      ],
      regarder: [
        'At the very start, *Satisfaction* view: city A has far fewer vermilion cells than city B.',
        'The two *Similar neighbours* curves: they quickly move apart, then freeze around 57% and 74%.',
      ],
      pourquoi: [
        'With eight neighbours, a tolerance counts in whole neighbours. 20% or 25% is the same thing: 2 similar neighbours are needed. 30% or 35% is the same too: 3 are needed. The real difference between A and B is a single neighbour.',
        'Now, at random, almost everyone already has 2 similar neighbours: in city A, 94% of residents are satisfied from the start, and the few moves do not trigger a cascade. In city B, 18% of residents are dissatisfied at the start: enough to set off a cascade, and the city splits.',
        'It is a threshold effect: below, almost nothing; above, almost everything.',
      ],
      realite: 'These thresholds show up in real cities. In the United States, Card, Mas and Rothstein (2008) measured that neighbourhoods tip when the share of a minority exceeds a threshold, between 5 and 20% depending on the city.',
    },
    mixite: {
      question: 'If everyone prefers a mixed neighbourhood, does the city stay mixed?',
      regles: [
        'Two groups. Everyone would like exactly half similar neighbours, half others.',
        'Satisfaction becomes a score: it drops fast when one is a minority, and slowly when one is a majority. Being a minority is worse than being a majority.',
        'A little randomness: now and then, a resident makes a mistake or moves for no reason.',
      ],
      regarder: [
        '*Satisfaction* view: almost everything is vermilion, and stays so. Fewer than one resident in ten is fully satisfied.',
        '*Groups* view, at high speed: single-group neighbourhoods gradually form. The *Similar neighbours* curve climbs towards 90%.',
      ],
      pourquoi: [
        'An exactly half-and-half neighbourhood is rare, and fragile: one neighbour leaving is enough to break it.',
        'A resident in a minority is the unhappiest, so the first to leave. They look for a place where they will be at least even, and often find one where their group already dominates. By leaving, they make their former same-group neighbours even more of a minority: those leave in turn.',
        'Everyone does their best for themselves, but nobody takes into account what their departure does to others. Economists call this an *externality*. The result: a divided city that nobody wanted, where hardly anyone is happy.',
      ],
      realite: 'This is the result of Zhang (2004) and of Pancs and Vriend (2007): wanting diversity is not enough to produce it. The Theory tab shows what saves it: that everyone takes into account, at least a little, the effect of their choices on others.',
    },
    bruit: {
      question: 'Does a little randomness in moves mix the city?',
      regles: [
        'Two cities with the same rule: at least 50% similar neighbours.',
        'City A: a little randomness (T = 0.05). Now and then, a satisfied resident moves anyway, or picks a slightly worse home.',
        'City B: a lot of randomness (T = 1). Choices become almost random.',
      ],
      regarder: [
        'Set the speed to maximum: randomness works slowly, over hundreds of rounds.',
        'City A: small neighbourhoods disappear, large ones grow. City B: the city stays a patchwork.',
        'The *Segregation* curve: it climbs high on the left, and stays low on the right.',
      ],
      pourquoi: [
        'Without randomness, the city stops as soon as everyone is satisfied, with small, irregular neighbourhoods.',
        'A little randomness shakes the city. And the residents who move most are those on the edges of small neighbourhoods: they have fewer similar neighbours and are more often dissatisfied. Small neighbourhoods therefore melt away in favour of large ones, like drops of oil merging in water. A little randomness *strengthens* separation.',
        'A lot of randomness, on the other hand, stops anyone from following their preferences: moves become almost random, and chance mixes everything.',
      ],
      realite: 'Physicists know this behaviour well: a magnet loses its magnetisation when heated. Randomness plays the role of temperature here. The Theory tab details it, with the Ising model.',
    },
    revenus: {
      question: 'Can groups separate without anyone looking at their neighbours’ group?',
      regles: [
        'Nobody has a group preference: tolerance is 0.',
        'The invented city has an attractive centre. Rents follow the appeal of the place and the neighbours’ incomes. People only move where they can pay.',
        'City A: group 1 (orange) is on average richer than group 2 (blue). City B: both groups have the same incomes.',
      ],
      regarder: [
        '*Incomes* view: in both cities, the wealthy (yellow) occupy the centre, and the poorer (purple) the outskirts.',
        '*Groups* view: on the left, the centre turns orange and the outskirts blue. On the right, the colours stay mixed.',
        'The curves: *Income segregation* rises in both cities, group *Segregation* only on the left.',
      ],
      pourquoi: [
        'Rents sort residents by income: the wealthy can pay for the centre, the poorer cannot.',
        'If one group is richer on average, sorting by income partly amounts to sorting by group. The separation of groups is wanted by nobody: it is a side effect of sorting by price.',
      ],
      realite: 'In reality, incomes weigh heavily on social separation. But Clark and Fossett (2008) find that they explain only part of the separation between groups: it is one mechanism among others.',
    },
    gentrification: {
      question: 'What happens when a neighbourhood becomes highly sought after?',
      regles: [
        'Nobody has a group preference.',
        'The city centre is very attractive. Rents follow the appeal of the place and the neighbours’ incomes.',
        'If their rent exceeds their means, a resident must leave. Besides, 2% of residents leave the city each round, and newcomers replace them.',
      ],
      regarder: [
        '*Rents* view: the centre quickly becomes expensive (yellow).',
        '*Satisfaction* view, during the first rounds: yellow cells are residents being priced out by their rent.',
        '*Incomes* view: the centre fills with wealthy households. The *Income segregation* curve rises.',
      ],
      pourquoi: [
        'It is a loop. Wealthy households settle in the centre because it is attractive. The mean income of the neighbourhood rises, so rents rise. The poorer can no longer get in, and those who lived there must leave when their rent exceeds their means. The centre gets richer still, and rents rise further.',
        'Nobody evicts anybody: price does the sorting. In our simulations, more than one resident in three has to leave their home during the first 40 rounds.',
      ],
      realite: 'This is the basic mechanism of gentrification. The model simplifies it a great deal: it ignores housing construction, rent control and housing benefits.',
    },
    social: {
      question: 'Does social housing mix the city? And where should it go?',
      regles: [
        'The same city as in “Rich and poor”: rents, and a richer group 1.',
        '20% of homes are social housing: very low rent, reserved for the poorest 40%. When cells are large enough, an occupied social home carries a small dark dot in its centre.',
        'City A: social housing is scattered everywhere. City B: grouped in four large estates, on the outskirts.',
      ],
      regarder: [
        '*Incomes* view: on the left, poorer households (purple) live everywhere, even in the expensive centre. On the right, they stay on the outskirts.',
        'The *Income segregation* curves: city A’s is about half as high.',
      ],
      pourquoi: [
        'A social home escapes sorting by price: its rent stays low even if the neighbourhood becomes expensive. Scattered, social homes guarantee poorer households in every neighbourhood, centre included.',
        'Grouped on the outskirts, they are precisely where the poorer already lived: they change almost nothing on the map. In our simulations, city B is as divided as a city with no social housing at all.',
      ],
      realite: 'In France, the SRU law (2000) requires the municipalities concerned to have 20 or 25% social housing. INSEE notes that the cities most divided by income often have more social housing, and puts forward an explanation: its concentration in the large estates of the 1960s.',
    },
    discrimination: {
      question: 'Can a city become divided if nobody has any preference?',
      regles: [
        'Nobody cares about their neighbours: tolerance is 0.',
        'Each round, 5% of residents leave the city; newcomers take the homes freed up.',
        'City A: in some areas, landlords refuse group 2 (blue) when they let. City B: no refusal.',
      ],
      regarder: [
        'Set the speed to maximum: only departures make the city move.',
        'City A: some areas turn entirely orange, and the blues gather elsewhere. City B: nothing changes.',
        'The *Similar neighbours* curve: it rises slowly on the left, towards 85%, and stays at 50% on the right.',
      ],
      pourquoi: [
        'Nobody moves by choice. But every departure frees a home. In a closed area, a blue resident cannot take it: an orange one moves in.',
        'Departure after departure, the closed areas empty of their blues: after 50 rounds, almost none remain. The blues end up in the open areas, where they become the majority. The separation does not come from preferences, but from a rule of access to housing.',
      ],
      realite: 'In France, a field experiment (Le Gallo and colleagues, 2019) sent identical fictitious applications to 5,000 rental ads: applicants whose name suggests a North African or sub-Saharan African origin are penalised. In the United States, practices such as *redlining* long closed off entire neighbourhoods.',
    },
    amis: {
      question: 'Can friendship networks divide a city?',
      regles: [
        'A low tolerance: 20% similar neighbours is enough. On its own, it divides almost nothing.',
        'City A: everyone has 4 friends and prefers to live within 6 cells of them. Nine friends in ten are from their own group.',
        'City B: the same city, without friends.',
      ],
      regarder: [
        'City B: it freezes quickly, almost mixed.',
        'City A, at high speed: neighbourhoods gradually form, then grow.',
        'The *Similar neighbours* curves: about 94% on the left, 56% on the right.',
      ],
      pourquoi: [
        'Everyone moves closer to their friends. Since their friends are almost all from their group, moving closer to one’s friends amounts to moving closer to one’s group.',
        'Friends also move to get closer to one another: clusters form, attract each other and grow. Nobody looks for neighbours from their group, and yet the neighbourhoods separate.',
      ],
      realite: 'Sociologists call *homophily* the tendency to bond with people who resemble us. In reality, people often choose a home near their family and friends.',
    },
    attachement: {
      question: 'What difference does it make that moving is costly?',
      regles: [
        'Two cities with the same rule (a third alike) and a little randomness: even when satisfied, residents move now and then.',
        'City A: moving costs almost nothing.',
        'City B: the longer one has been settled (up to 10 rounds), the more moving costs.',
      ],
      regarder: [
        'The *Moves* curve: on the left, about 3 residents in 10 move each round, endlessly. On the right, nobody moves after a few rounds.',
        'The *Similar neighbours* curve: on the left it keeps rising towards 95%; on the right it freezes around 78%.',
      ],
      pourquoi: [
        'On the left, residents keep moving at random, and the city slowly coarsens: small neighbourhoods melt away in favour of large ones, as in the “Randomness” scenario.',
        'On the right, once settled, nobody moves for a small gain. The city freezes as it is, before neighbourhoods have had time to grow. Attachment slows the cascades down.',
      ],
      realite: 'In reality, moving is costly: money, a job, a school, habits. It is one of the reasons why neighbourhoods change slowly.',
    },
    arrivees: {
      question: 'What happens when the composition of the city changes?',
      regles: [
        'Everyone wants at least a third of similar neighbours.',
        'Each round, 3% of residents leave the city.',
        'Among newcomers, three in four belong to group 2 (blue).',
      ],
      regarder: [
        '*Groups* view, at high speed: orange neighbourhoods shrink, and some tip entirely.',
        'Group 1 goes from about half the city to about a quarter, and ends up in a few islands.',
      ],
      pourquoi: [
        'When an orange resident leaves an orange neighbourhood, they are most often replaced by a blue one. At first, the oranges who stay are still satisfied.',
        'But once enough blues have arrived, the remaining oranges fall below their one-third threshold: they leave in turn, and are replaced by blues. The neighbourhood tips all at once. This is the *tipping point* of Schelling’s bounded-neighbourhood model (Theory tab).',
      ],
      realite: 'Card, Mas and Rothstein (2008) found these tipping points in American neighbourhoods between 1970 and 2000: beyond a certain share of minorities, between 5 and 20% depending on the city, the white population clearly leaves.',
    },
    quatre: {
      question: 'What does a small minority go through in a city that splits?',
      regles: [
        'Three large groups (orange, blue, green) and a small minority in pink: one resident in ten.',
        'Everyone wants at least 30% similar neighbours, that is 3 out of 8.',
      ],
      regarder: [
        '*Satisfaction* view at the start: almost all members of the minority are dissatisfied.',
        '*Groups* view: the minority ends up in small, compact islands.',
      ],
      pourquoi: [
        'At random, a member of the minority has on average only one similar neighbour in ten: they almost never have 3 neighbours out of 8 from their group. At the start, only 4% of them are satisfied.',
        'To be satisfied, they must join other members of the minority. The only places that suit them are therefore the small groups already formed, which grow into islands. In the end, six neighbours in ten of a minority member are from their group.',
        'The large groups are satisfied far more easily: the constraint weighs mainly on the minority.',
      ],
      realite: 'Schelling had noticed it as early as 1971: when a group is a minority, its members cluster together, even when their demands are very modest.',
    },
  },

  figures: {
    ligne: {
      titre: 'The linear model: 70 people, 4 neighbours on each side, at least half alike',
      resume: (paquets, pct) => `A line of 70 people in ${paquets} clusters, ${pct} of relations between people alike.`,
      etat: (tours, mecontents, paquets, pct) => `${tours} pass${tours === 1 ? '' : 'es'} · ${mecontents} discontented (outlined) · ${paquets} clusters · ${pct} of relations between people alike`,
      unTour: 'One pass',
      bout: 'To the end',
      nouveau: 'New draw',
      note: 'One pass: each discontented person, from left to right, slips into the nearest satisfying place. The discontented are outlined in red.',
    },
    damier: {
      titre: 'A 40 × 40 checkerboard, two groups, 10% empty homes',
      resume: 'A live checkerboard of 40 × 40 cells, two groups of different colours.',
      tolerance: 'Tolerance',
      pause: 'Pause',
      lancer: 'Start',
      nouveau: 'New draw',
      vue: 'View',
      vues: { groupes: 'Groups', satisfaction: 'Satisfaction' },
      etat: (t, semb, sat) => `round ${t} · similar neighbours ${semb} · satisfied ${sat}`,
    },
    balayage: {
      titre: 'Similar neighbours and satisfied residents, once the city has stopped, by tolerance',
      semblables: 'Similar neighbours',
      satisfaits: 'Satisfied',
      tolerance: 'Tolerance',
      axeX: 'tolerance',
      axeY: 'share',
      resume: 'Similar neighbours stay around 50% up to a tolerance of 25%, jump to 74% at 30%, rise to 96% at 60%, then fall back towards 50% beyond 65%, where the city freezes and satisfaction collapses.',
      tableau: 'Show the data (100 rounds, mean of 3 draws)',
    },
    bascule: {
      titre: 'The bounded neighbourhood: 100 people in group 1, 50 or 100 in group 2',
      resume: (verdict) => `Bounded-neighbourhood diagram; the chosen trajectory ends in: ${verdict}.`,
      axeX: 'group 1 present',
      axeY: 'group 2 present',
      courbe1: 'Group 1 boundary: below it, group 1 moves in',
      courbe2: 'Group 2 boundary: to its left, group 2 moves in',
      rmax: 'The most tolerant accepts',
      taille2: 'People in group 2',
      etat: (w, b, verdict) => `Start: ${w} from group 1 and ${b} from group 2 → ${verdict}. Click in the diagram to change the start.`,
      verdicts: {
        groupe1: 'neighbourhood entirely group 1',
        groupe2: 'neighbourhood entirely group 2',
        mixte: (w, b) => `stable mix (${w} and ${b})`,
      },
      note: 'Ratio accepted by the most tolerant member of each group; it decreases linearly down to the least tolerant. Schelling: 2 to 1, then 5 to 1 in his more tolerant variant.',
    },
    potentiel: {
      titre: 'The block potential f(ρ) and its concave hull, at zero temperature',
      potentiel: 'f(ρ)',
      enveloppe: 'Concave hull',
      axeX: 'block density ρ',
      axeY: 'f',
      resume: (separee) => (separee ? 'The curve falls below its hull at ρ = 1/2: the city splits.' : 'The curve touches its hull at ρ = 1/2: the city stays homogeneous.'),
      alpha: 'Altruism α',
      m: 'Utility of a full block m',
      separee: (r1, r2) => `At mean density 1/2, f falls below its hull: the city splits into blocks of density ${r1} and ${r2}.`,
      mixte: 'At mean density 1/2, f touches its hull: all blocks stay half full.',
      seuil: (ac) => `Theoretical threshold: α_c = 1/(3 − 2m) = ${ac}.`,
    },
    temperature: {
      titre: 'Similar neighbours after 200 rounds, by noise T (tolerance 50%)',
      semblables: 'Similar neighbours',
      axeX: 'noise T',
      axeY: 'share',
      resume: 'Without noise, 87% similar neighbours; a little noise raises it to 97%; beyond T = 0.5, the share falls back to 56% at T = 3.',
      tableau: 'Show the data (mean of 2 draws)',
    },
    grossissement: {
      titre: 'Density of borders over the rounds, on log-log scales (tolerance 50%, 150 × 150)',
      froid: 'No noise',
      tiede: 'Noise T = 0.05',
      axeX: 'rounds',
      axeY: 'borders',
      tours: 'round',
      resume: 'Without noise, the density of borders freezes around 0.13. With a little noise, it decreases along a straight line of slope −0.47 on log-log scales, down to 0.014 after a thousand rounds.',
    },
    mesures: {
      titre: 'Five indices, five arrangements, four district sizes',
      arrangement: 'Arrangement',
      arrangements: { hasard: 'Random', echiquier: 'Checkerboard', bandes1: 'Stripes of 1', bandes3: 'Stripes of 3', moities: 'Two halves' },
      quartier: 'District size',
      quartiers: (k) => `${k} × ${k}`,
      resume: (arr, q) => `Arrangement “${arr}”, districts of ${q}.`,
      noms: {
        D: 'Dissimilarity D',
        H: 'Theil entropy H',
        iso: 'Isolation P* (blue)',
        semb: 'Similar neighbours',
        inter: 'Density of borders',
      },
      note: 'A 24 × 24 grid wrapped around, half orange, half blue. White lines show the districts. The last two measures do not depend on districts.',
    },
    cout: {
      titre: 'Mean duration of a round, 100 × 100 city (Node 22, one core)',
      scenario: 'Scenario',
      villeA: 'City A',
      villeB: 'City B',
      note: 'A recent browser gives comparable orders of magnitude. The differences come mostly from the number of residents looking for a home each round.',
    },
  },
}

addLayer("q", {
    name: "Quarks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        generators: [
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
            {
                amt: new Decimal(0),
                interval: new Decimal(1000),
                intensity: new Decimal(1),
                purchased: new Decimal(0),
                phases: new Decimal(0),
            },
        ],

        intervalMul: new Decimal(0.8),
        buy10Mul: new Decimal(2),
        intensityMul: new Decimal(1.5),
        until10: true,
        atoms: new Decimal(0),
        lastTick: 0,

        intervalCap: new Decimal(10),
        phaseIntensityMult: new Decimal(100)
    }},
    color: "#a8a8a8",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Max All Quark Generators", onPress(){
            for (const id of [11,
                100, 101, 102, 103, 104, 105, 106, 107,
                110, 111, 112, 113, 114, 115, 116, 117,
                120, 121, 122, 123, 124, 125, 126, 127
            ]) {
                buyMaxBuyable("q", id)
            }
        }},
    ],
    
    update(diff) {

        player.q.atomStrength = new Decimal(1)
        player.q.atomMul = new Decimal(0.9).pow(player.q.atomStrength)
        player.q.intervalMul = new Decimal(0.8).mul(Decimal.pow(player.q.atomMul, player.q.atoms))
        player.q.buy10Mul = new Decimal(2)
        player.q.combustorPower = new Decimal(0.05)
        player.q.intensityMul = new Decimal(1.50).plus(buyableEffect("q", 11))
        player.q.until10 = player.q.until10 ?? true

        player.q.generators[0].interval = buyableEffect("q", "100").max(player.q.intervalCap)
        player.q.generators[0].intensity = buyableEffect("q", "120").mul(player.q.phaseIntensityMult.pow(player.q.generators[0].phases))

        player.q.generators[1].interval = buyableEffect("q", "101").max(player.q.intervalCap)
        player.q.generators[1].intensity = buyableEffect("q", "121").mul(player.q.phaseIntensityMult.pow(player.q.generators[1].phases))

        player.q.generators[2].interval = buyableEffect("q", "102").max(player.q.intervalCap)
        player.q.generators[2].intensity = buyableEffect("q", "122").mul(player.q.phaseIntensityMult.pow(player.q.generators[2].phases))

        player.q.generators[3].interval = buyableEffect("q", "103").max(player.q.intervalCap)
        player.q.generators[3].intensity = buyableEffect("q", "123").mul(player.q.phaseIntensityMult.pow(player.q.generators[3].phases))

        player.q.generators[4].interval = buyableEffect("q", "104").max(player.q.intervalCap)
        player.q.generators[4].intensity = buyableEffect("q", "124").mul(player.q.phaseIntensityMult.pow(player.q.generators[4].phases))
        player.q.generators[4].unlocked = player.q.atoms.gte(1)

        player.q.generators[5].interval = buyableEffect("q", "105").max(player.q.intervalCap)
        player.q.generators[5].intensity = buyableEffect("q", "125").mul(player.q.phaseIntensityMult.pow(player.q.generators[5].phases))
        player.q.generators[5].unlocked = player.q.atoms.gte(2) 

        player.q.generators[6].interval = buyableEffect("q", "106").max(player.q.intervalCap)
        player.q.generators[6].intensity = buyableEffect("q", "126").mul(player.q.phaseIntensityMult.pow(player.q.generators[6].phases))
        player.q.generators[6].unlocked = player.q.atoms.gte(3) 

        player.q.generators[7].interval = buyableEffect("q", "107").max(player.q.intervalCap)
        player.q.generators[7].intensity = buyableEffect("q", "127").mul(player.q.phaseIntensityMult.pow(player.q.generators[7].phases))
        player.q.generators[7].unlocked = player.q.atoms.gte(4)

        for (const id of [0, 1, 2, 3, 4, 5, 6]) {
            let gen = player.q.generators
            setBuyableAmount("q", "11" + (id), 
                getBuyableAmount("q", "11" + id).plus(
                Decimal.div(1000, gen[id + 1].interval)
                .mul(gen[id + 1].intensity)
                .mul(buyableEffect("q", "11" + (id + 1)))
                .mul(diff))
            )
        }

        player.q.lastTick = diff
        player.points = player.points.plus(buyableEffect("q", 110).mul(Decimal.div(1000, player.q.generators[0].interval)).mul(player.q.generators[0].intensity).mul(diff))
    },

    
    buyables: (function() {
        let buyables = {}
        let costMults = [1, 100, 1e5, 1e15, 1e30, 1e60, 1e100, 1e150]
        let scale = [
            new Decimal(100),
            new Decimal(1000),
            new Decimal(1e6),
            new Decimal(1e8),
            new Decimal(1e10),
            new Decimal(1e13),
            new Decimal(1e16),
            new Decimal(1e20),
        ]
        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            buyables["10" + id] = {
                cost(x) {
                    let p = player.q.generators[id].phases
                    let base = p.plus(1).pow_base(100)
                    let u308 = new Decimal("1.8e308").div(100).div(new Decimal(costMults[id])).log(base).floor()
                    if (x.gte(u308)) x = x.sub(u308).pow(2).plus(u308)
                    // return new Decimal(100).pow(x).mul(new Decimal(costMults[id])).mul(100)
                    // x.sub(153).pow(2).plus(153).pow_base(100).mul(new Decimal(...)).mul(100)
                    return x.pow_base(base).mul(new Decimal(costMults[id])).mul(100)
                },
                purchasesLeft(z = new Decimal(0)) {
                    // z is expected to be the current interval
                    // x = (log10(A / z)) / log10(y)
                    if (z.eq(0)) z = player.q.generators[id].interval
                    let A = player.q.intervalCap
                    let y = player.q.intervalMul
                    
                    // Decimal.ceil(Decimal.log10(player.q.intervalCap.div(player.q.generators[7].interval)).div(player.q.intervalMul.log10()))
                    return Decimal.ceil(Decimal.log10(A.div(z)).div(y.log10()))
                },
                canPhase() {
                    return this.purchasesLeft().eq(0)
                },
                display() {
                    let p = player.q.generators[id].phases
                    let l = this.purchasesLeft()
                    return l.gt(0) ? `
                        <h3>Interval: ${formatSmall(player.q.generators[id].interval)}ms (Δ${formatWhole(p)})
                        <br>→ ${formatSmall(player.q.generators[id].interval.mul(player.q.intervalMul))}ms Costs: ${format(this.cost())} Quarks
                    ` : 
                    `<h3>Δ Phase Shift
                    <br><br>${format(player.q.generators[id].interval)}ms → ${format(player.q.generators[id].interval.mul(1000))}ms
                    Intensity ×100`
                },
                canAfford() {
                    return (player.points.gte(this.cost()) && this.purchasesLeft().gt(0)) || this.canPhase()
                },
                buy() {
                    if (this.canPhase()) {
                        player.q.generators[id].phases = player.q.generators[id].phases.plus(1)
                        player.q.generators[id].interval = new Decimal(10000)
                    } else {
                        player.points = player.points.sub(this.cost())
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
                    }
                },
                buyMax() {
                    let p = player.q.generators[id].phases
                    let base = p.plus(1).pow_base(100)

                    let x = getBuyableAmount(this.layer, this.id)
                    let u308 = new Decimal("1.8e308").div(100).div(new Decimal(costMults[id])).log(base).floor()
                    let preScale = player.points.div(100).div(new Decimal(costMults[id])).log(base).floor().plus(1).min(u308)
                    let postScale = player.points.div(100).div(new Decimal(costMults[id])).log(base).sub(u308).root(2).plus(u308).floor().sub(u308.sub(1))
                    let amt = preScale

                    if (preScale.eq(u308)) amt = preScale.plus(postScale)
                    if (!this.canPhase()) {
                        setBuyableAmount(this.layer, this.id, amt.min(getBuyableAmount(this.layer, this.id).plus(this.purchasesLeft()))) 
                    } else player.q.generators[id].phases = player.q.generators[id].phases.plus(1)
                    if (this.canAfford()) player.points = player.points.sub(this.cost(amt.min(this.purchasesLeft())))
                },
                effect() {
                    let x = getBuyableAmount(this.layer, this.id)
                    return player.q.intervalMul.pow(x).mul(1000).mul(player.q.generators[id].phases.pow_base(1000))
                },
            },
            buyables["11" + id] = {
                cost(x, override = new Decimal(0)) {
                    x = new Decimal(player.q.generators[id].purchased).div(10).floor()
                    if (override.gte(x)) x = override
                    let u308 = new Decimal("1.8e308").div(10).div(new Decimal(costMults[id])).log(scale[id]).floor()
                    if (x.gte(u308)) x = x.sub(u308).pow(2).plus(u308)
                    return x.pow_base(scale[id]).mul(new Decimal(costMults[id])).mul(10)
                    // let baseCost = x.div(10).floor().pow_base(scale[id]).mul(new Decimal(costMults[id])).mul(10)
                    // return player.points.div(baseCost).min(10 - amt).floor().mul(baseCost).max(baseCost)
                },
                display() {
                    let amt = 10 - (player.q.generators[id].purchased.toNumber() % 10)
                    let x = new Decimal(player.q.generators[id].purchased)
                    let baseCost = new Decimal(scale[id]).pow(x.div(10).floor()).mul(new Decimal(costMults[id])).mul(10)
                    let disp = player.points.div(baseCost).min(amt).floor()
                    return `
                        <h3>Buy ${player.q.until10 ? formatWhole(disp) : formatWhole(1)}
                        <br><br>Costs: ${player.q.until10 ? format(this.cost().mul(disp)) : format(this.cost())} Quarks
                    `
                },
                canAfford() {
                    return player.points.gte(this.cost())
                },
                buy() {
                    let amt = player.q.generators[id].purchased.toNumber() % 10
                    let x = new Decimal(player.q.generators[id].purchased).div(10).floor()
                    let baseCost = x.div(10).floor().pow_base(scale[id]).mul(new Decimal(costMults[id])).mul(10)
                    let am2 = player.points.div(baseCost).min(10 - amt).floor()

                    if (player.q.until10) {
                        player.points = player.points.sub(this.cost())
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(am2))
                        player.q.generators[id].purchased = new Decimal(player.q.generators[id].purchased).plus(am2)
                        return
                    }
                    player.points = player.points.sub(baseCost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
                    player.q.generators[id].purchased = new Decimal(player.q.generators[id].purchased).plus(1)
                },
                buyMax() {
                    let u308 = new Decimal("1.8e308").div(10).div(new Decimal(costMults[id])).log(scale[id]).floor()
                    let preScale = player.points.div(10).div(new Decimal(costMults[id])).log(scale[id]).floor().plus(1).min(u308)
                    let postScale = player.points.div(10).div(new Decimal(costMults[id])).log(scale[id]).sub(u308).root(2).plus(u308).floor().sub(u308.sub(1))
                    let amt = preScale
                    let x = player.q.generators[id].purchased
                    let _a = player.points.gte(this.cost(0, amt).mul(10)) ? 1 : 0

                    if (preScale.eq(u308)) amt = preScale.plus(postScale)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(amt.sub(1).plus(_a).mul(10)))
                    player.q.generators[id].purchased = amt.sub(1).plus(_a).mul(10)
                    if (this.canAfford() && player.points.gte(this.cost().mul(10))) player.points = player.points.sub(this.cost(0, amt.plus(_a)))
                },
                effect() {
                    let x10 = new Decimal(player.q.generators[id].purchased).max(1).div(10).floor().pow_base(player.q.buy10Mul)
                    let x = getBuyableAmount(this.layer, this.id)
                    return x.mul(x10)
                },
            },
            buyables["12" + id] = {
                cost(x) {
                    let u308 = new Decimal("1.8e308").div(10000).div(new Decimal(costMults[id])).log(20000).floor()
                    if (x.gte(u308)) x = x.sub(u308).pow(2).plus(u308)
                    return x.pow_base(20000).mul(new Decimal(costMults[id])).mul(10000)
                },
                display() {
                    return `
                        <h3>Intensity: ${format(player.q.generators[id].intensity)}
                        <br><br>→ ×${format(player.q.generators[id].intensity.mul(player.q.intensityMul))} Costs: ${format(this.cost())} Quarks
                    `
                },
                canAfford() {
                    return player.points.gte(this.cost())
                },
                buy() {
                    player.points = player.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
                },
                buyMax() {
                    let x = getBuyableAmount(this.layer, this.id)
                    let u308 = new Decimal("1.8e308").div(10000).div(new Decimal(costMults[id])).log(20000).floor()
                    let preScale = player.points.div(10000).div(new Decimal(costMults[id])).log(20000).floor().plus(1).min(u308)
                    let postScale = player.points.div(10000).div(new Decimal(costMults[id])).log(20000).sub(u308).root(2).plus(u308).floor().sub(u308.sub(1))
                    let amt = preScale
                    if (preScale.eq(u308)) amt = preScale.plus(postScale)
                    setBuyableAmount(this.layer, this.id, amt)
                    if (this.canAfford()) player.points = player.points.sub(this.cost(amt))
                },
                effect() {
                    let x = getBuyableAmount(this.layer, this.id)
                    return player.q.intensityMul.pow(x)
                },
            }
        }

        buyables["11"] = {
            cost(x) {
                let u308 = new Decimal("1.8e308").div(1000).log(100)
                if (x.gte(u308)) x = x.sub(u308).pow(2).plus(u308)
                return x.pow_base(100).mul(1000)
            },
            display() {
                return `
                    <h2>Combustors</h2>
                    Increase the power of Intensity upgrades:
                    → ${format(player.q.intensityMul.plus(player.q.combustorPower))} Costs: ${format(this.cost())}
                `
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            style: {
                "width":"300px",
                "height":"60px",
                "left":"50%"
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
            buyMax() {
                let u308 = new Decimal("1.8e308").div(1000).log(100)
                let preScale = player.points.div(1000).log(100).ceil().min(u308)
                let postScale = player.points.div(1000).log(100).plus(u308).root(2).ceil().max(0)
                let amt = preScale
                    if (preScale.eq(u308)) amt = preScale.plus(postScale)
                    setBuyableAmount(this.layer, this.id, amt)
                    if (this.canAfford()) player.points = player.points.sub(this.cost(amt))
            },
            effect() {
                return Decimal.mul(0.05, getBuyableAmount(this.layer, this.id))
            },
        }
        return buyables
    })(),

    clickables: (function() {
        let clickables = {}
        for (const id of [
            10, 11, 12, 13, 14, 15, 16, 17,
            20, 21, 22, 23, 24, 25, 26, 27,
            30, 31, 32, 33, 34, 35, 36, 37]) {
            clickables["2" + (id)] = {
                title() {
                    return `Max All`
                },
                unlocked() {
                    return true
                },
                canClick() {
                    return true
                },
                onClick() {
                    buyMaxBuyable("q", ("1" + id) - 10)
                },
                style: {
                    "width": "180px",
                    "height": "35px",
                    "min-width": "180px",
                    "min-height": "35px",
                }
            }
        }
        clickables["11"] = {
            title() {
                return player.q.until10 ? `<h4>Until 10` : `<h4>Singles`
            }, 
            unlocked() {
                return true
            },
            canClick() {
                return true
            },
            onClick() {
                player.q.until10 = !player.q.until10
            },
        }
        clickables["101"] = {
            title() {
                return `
                    <h3>Atoms (${formatWhole(player.q.atoms)})
                `
            },
            reqGen() {
                switch (player.q.atoms.toNumber()) {
                    case 0: return 3
                    case 1: return 4
                    case 2: return 5
                    case 3: return 6
                    case 4: return 7
                    default: return 7
                }
            },
            cost() {
                let x = player.q.atoms
                let base = new Decimal(20)
                if (x.lt(4)) return base
                return base.mul(x.sub(3))
            },
            display() {
                let phrase = ""
                return `
                    Unlock the next Generator and increase the power of Interval upgrades
                    <br><br>Requires: ${formatWhole(this.cost())} ${formatWhole(this.reqGen() + 1)}th Generators
                `
            },
            unlocked() {
                return true
            },
            canClick() {
                return player.q.generators[this.reqGen()].purchased.gte(this.cost())
            },
            onClick() {
                let atoms = player.q.atoms
                layerDataReset("q")
                player.points = new Decimal(10)
                player.q.atoms = atoms.plus(1)
            },
            style: {
                "width": "200px",
                "height": "120px",
                "min-width": "200px",
                "min-height": "120px",
            }
        }
        return clickables
    })(),

    layerShown(){return true},

    tabFormat: [
        ["display-text",
            function() { return `Time since last tick: ${format(player.q.lastTick)}`}
        ],
        ["buyable", [11]],
        ["clickable", [11], {
            "width": "80px",
            "height": "25px",
            "min-height": "0px",
            "border-radius": "5px",
        }],
        ["column",
            [
                ["display-text", 
                    function() { return `<h3>1st Quark Generator (${formatWhole(getBuyableAmount("q", 110))})`}
                ],
                ["display-text",
                    function() { return `<h5>×${format(player.q.generators[0].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[0].intensity))} | ${format(player.q.generators[0].purchased)}` }
                ],
                ["row", [["buyable", [100]], ["buyable", [110]], ["buyable", [120]]]],
                ["row", [["clickable", [210]], ["clickable", [220]], ["clickable", [230]]]],
            ]
        ],
        ["column",
            [
                ["display-text", 
                    function() { return `<h3>2nd Quark Generator (${formatWhole(getBuyableAmount("q", 111))})`}
                ],
                ["display-text",
                    function() { return `<h5>×${format(player.q.generators[1].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[1].intensity))} | ${format(player.q.generators[1].purchased)}` }
                ],
                ["row", [["buyable", [101]], ["buyable", [111]], ["buyable", [121]]]],
                ["row", [["clickable", [211]], ["clickable", [221]], ["clickable", [231]]]],
            ]
        ],
        ["column",
            [
                ["display-text", 
                    function() { return `<h3>3rd Quark Generator (${formatWhole(getBuyableAmount("q", 112))})`}
                ],
                ["display-text",
                    function() { return `<h5>×${format(player.q.generators[2].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[2].intensity))} | ${format(player.q.generators[2].purchased)}` }
                ],
                ["row", [["buyable", [102]], ["buyable", [112]], ["buyable", [122]]]],
                ["row", [["clickable", [212]], ["clickable", [222]], ["clickable", [232]]]],
            ]
        ],
        ["column",
            [
                ["display-text", 
                    function() { return `<h3>4th Quark Generator (${formatWhole(getBuyableAmount("q", 113))})`}
                ],
                ["display-text",
                    function() { return `<h5>×${format(player.q.generators[3].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[3].intensity))} | ${format(player.q.generators[3].purchased)}` }
                ],
                ["row", [["buyable", [103]], ["buyable", [113]], ["buyable", [123]]]],
                ["row", [["clickable", [213]], ["clickable", [223]], ["clickable", [233]]]],
            ]
        ],
        () => player.q.generators[4].unlocked ? ["column",
            [
                ["display-text", 
                    `<h3>5th Quark Generator (${formatWhole(getBuyableAmount("q", 114))})`
                ],
                ["display-text",
                    `<h5>×${format(player.q.generators[4].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[4].intensity))} | ${format(player.q.generators[4].purchased)}`
                ],
                ["row", [["buyable", [104]], ["buyable", [114]], ["buyable", [124]]]],
                ["row", [["clickable", [214]], ["clickable", [224]], ["clickable", [234]]]],
            ],
        ] : ["column", [["display-text", "<h3>5th Quark Generator (LOCKED)"]]],
        () => player.q.generators[5].unlocked ? ["column",
            [
                ["display-text", 
                    `<h3>6th Quark Generator (${formatWhole(getBuyableAmount("q", 115))})`
                ],
                ["display-text",
                    `<h5>×${format(player.q.generators[5].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[5].intensity))} | ${format(player.q.generators[5].purchased)}`
                ],
                ["row", [["buyable", [105]], ["buyable", [115]], ["buyable", [125]]]],
                ["row", [["clickable", [215]], ["clickable", [225]], ["clickable", [235]]]],
            ],
        ] : ["column", [["display-text", "<h3>6th Quark Generator (LOCKED)"]]],
        () => player.q.generators[6].unlocked ? ["column",
            [
                ["display-text", 
                    `<h3>7th Quark Generator (${formatWhole(getBuyableAmount("q", 116))})`
                ],
                ["display-text",
                    `<h5>×${format(player.q.generators[6].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[6].intensity))} | ${format(player.q.generators[6].purchased)}`
                ],
                ["row", [["buyable", [106]], ["buyable", [116]], ["buyable", [126]]]],
                ["row", [["clickable", [216]], ["clickable", [226]], ["clickable", [236]]]],
            ],
        ] : ["column", [["display-text", "<h3>7th Quark Generator (LOCKED)"]]],
        () => player.q.generators[7].unlocked ? ["column",
            [
                ["display-text", 
                    `<h3>8th Quark Generator (${formatWhole(getBuyableAmount("q", 117))})`
                ],
                ["display-text",
                    `<h5>×${format(player.q.generators[7].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[7].intensity))} | ${format(player.q.generators[7].purchased)}`
                ],
                ["row", [["buyable", [107]], ["buyable", [117]], ["buyable", [127]]]],
                ["row", [["clickable", [217]], ["clickable", [227]], ["clickable", [237]]]],
            ],
        ] : ["column", [["display-text", "<h3>8th Quark Generator (LOCKED)"]]],

        ["row",
            [["clickable", [101]]]
        ]
    ],

    componentStyles: {
        "buyable": {
            "width":"180px",
            "height":"80px",
            "border-radius":"5px",
            "margin": "10px",
        },
        "column": {
            "outline": "3px solid",
            "border-radius":"5px",
            "padding":"20px",
            "margin":"10px",
        },
        "clickable": {
            "width": "180px",
            "height":"35px",
            "border-radius":"5px",
            "margin":"10px",
            "left":"10px",
        },
    },
})

addLayer("q", {
    name: "Quarks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { 
        const data = {
            unlocked: true,
            points: new Decimal(0),
            generators: [],
            startingPoints: new Decimal(10),

            until10: true,
            atoms: new Decimal(0),

            best: new Decimal(10),
            latestPurchased: 0,
        }

        for (let i = 0; i < 8; i++) {
            data.generators[i] = {
              amount: new Decimal(0),
              purchased: new Decimal(0),
              phases: new Decimal(0),
            }
        }

        return data
    },

    inAnyChallenge() {

        for (const id in player.m.challenges) {
            if (inChallenge("m", id)) return true
        }

        return false
    },

    generators: [
        // QG1
        {
            unlocked() { return true },
            intensity() { return buyableEffect("q", "120").mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[0].phases))
                .mul(tmp.q.values.atomMult[0])
                .mul(challengeCompletions("m", 21) >= 1 ? challengeEffect("m", 21) : new Decimal(1) )
                .mul(achievementEffect(12))

                .pow(tmp.q.values.commonGeneratorPower)
                .pow((inChallenge("m", 31) && player.q.latestPurchased == "110") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "100").max(tmp.q.values.intervalCap) },
        },
        // QG2
        {
            unlocked() { return true },
            intensity() { return buyableEffect("q", "121").mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[1].phases))
                .mul(tmp.q.values.atomMult[1])
                .mul(achievementEffect(13))

                .pow(tmp.q.values.commonGeneratorPower)
                .pow((inChallenge("m", 31) && player.q.latestPurchased == "111") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "101").max(tmp.q.values.intervalCap) },
        },
        // QG3
        {
            unlocked() { return true },
            intensity() { return buyableEffect("q", "122").mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[2].phases)) 
                .mul(tmp.q.values.atomMult[2])
                .mul(achievementEffect(14))

                .pow(tmp.q.values.commonGeneratorPower)
                .pow((inChallenge("m", 31) && player.q.latestPurchased == "112") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "102").max(tmp.q.values.intervalCap) },
        },
        // QG4
        {
            unlocked() { return true },
            intensity() { 
                // Boost to the atom multiplier for the 4th Generator, inside MC1
                return buyableEffect("q", "123")
                    .mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[3].phases)) 
                    .mul(tmp.q.values.atomMult[3])
                    .mul(achievementEffect(15))

                    .pow(tmp.q.values.commonGeneratorPower)
                    .pow((inChallenge("m", 31) && player.q.latestPurchased == "113") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "103").max(tmp.q.values.intervalCap) },
        },
        // QG5
        {
            unlocked() { 
                if (inChallenge("m", 33)) return true
                return player.q.atoms.gte(1)
                && !inChallenge("m", 11)
            },
            intensity() { return buyableEffect("q", "124").mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[4].phases)) 
                .mul(tmp.q.values.atomMult[4])
                .mul(achievementEffect(16))

                .pow(tmp.q.values.commonGeneratorPower)
                .pow((inChallenge("m", 31) && player.q.latestPurchased == "114") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "104").max(tmp.q.values.intervalCap) },
        },
        // QG6
        {
            unlocked() { 
                if (inChallenge("m", 33)) return true
                return player.q.atoms.gte(2) 
                && !inChallenge("m", 11)
            },
            intensity() { return buyableEffect("q", "125").mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[5].phases)) 
                .mul(tmp.q.values.atomMult[5])
                .mul(achievementEffect(17))

                .pow(tmp.q.values.commonGeneratorPower)
                .pow((inChallenge("m", 31) && player.q.latestPurchased == "115") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "105").max(tmp.q.values.intervalCap) },
        },
        // QG7
        {
            unlocked() { return player.q.atoms.gte(3) 
                && !inChallenge("m", 11)
            },
            intensity() { return buyableEffect("q", "126").mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[6].phases)) 
                .mul(tmp.q.values.atomMult[6])
                .mul(achievementEffect(18))

                .pow(tmp.q.values.commonGeneratorPower)
                .pow((inChallenge("m", 31) && player.q.latestPurchased == "116") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "106").max(tmp.q.values.intervalCap) },
        },
        // QG8
        {
            unlocked() { return player.q.atoms.gte(4) 
                && !inChallenge("m", 11)
            },
            intensity() { return buyableEffect("q", "127").mul(tmp.q.values.phaseIntensityMult.pow(player.q.generators[7].phases)) 
                .mul(upgradeEffect("m", 31, false))
                .mul(tmp.q.values.atomMult[7])

                .pow(tmp.q.values.commonGeneratorPower)
                .pow((inChallenge("m", 31) && player.q.latestPurchased == "117") ? 1 : 0.75)
            },
            interval() { return buyableEffect("q", "107").max(tmp.q.values.intervalCap) },
        },
    ],

    values: {
        intervalMul() {return new Decimal(1).div(new Decimal(1.25)
            .plus(upgradeEffect("m", 24, true))
        )},
        buy10Mul() {
            let variableAdd = new Decimal(0)
            if (challengeCompletions("m", 12) >= 1) variableAdd = variableAdd.plus(challengeEffect("m", 12))
            
            return new Decimal(2).plus(upgradeEffect("m", 14, true))
                .plus(variableAdd)
        },
        combustorPower() {return new Decimal(1.1).plus(upgradeEffect("m", 21, true))},
        intensityMul() {
            if (inChallenge("m", 23)) return new Decimal(1)
            return new Decimal(1.50).plus(upgradeEffect("m", 13, true))
        },
        intervalCap() {return new Decimal(10)},
        phaseIntensityMult() {
            return new Decimal(100)
            .mul(challengeEffect("m", 22))
            .mul(buyableEffect("em", 12))
        },
        phaseIntervalMult() {return new Decimal(1000)},
        atomStrength() {
            let variableMult = new Decimal(1)
            if (challengeCompletions("m", 11) >= 1) {
                variableMult = variableMult.mul(challengeEffect("m", 11))
            }
            
            return new Decimal(5)
            .plus(upgradeEffect("m", 23))
            .mul(variableMult)
            .mul(new Decimal(1).plus(tmp.em.values.strangeMatterEffect.div(100)))
        },

        manifoldChal1_AtomPow() { return inChallenge("m", 11) ? new Decimal(4) : new Decimal(1) },
        manifoldChal2_PurchaseDivisor() { 
            let value = new Decimal(0)
            for (i = 0; i < 8; i++) {
                value = value.plus(player.q.generators[i].purchased.div(10).floor())
            }
            return inChallenge("m", 12) ? new Decimal(10).pow(value) : new Decimal(1)
        },
        manifoldChal8_ProductionPow() {
            return inChallenge("m", 32) ? 
            new Decimal(1).sub(new Decimal(0.6).pow(player.q.atoms.div(100).plus(1)))
            : new Decimal(1)
        },

        atomMult() { return [
/* 1 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(0)),
/* 2 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(1).max(0)),
/* 3 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(2).max(0)),
/* 4 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(3).max(0)).pow(this.manifoldChal1_AtomPow),
/* 5 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(4).max(0)),
/* 6 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(5).max(0)),
/* 7 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(6).max(0)),
/* 8 */     tmp.q.values.atomStrength.pow(player.q.atoms.sub(7).max(0)),
        ]},

        genScaleExp() {return new Decimal(2).sub(buyableEffect("m", 201))},
        accelScaleExp() {return new Decimal(2).sub(buyableEffect("m", 202))},
        accelMul() {
            let variableAdd = new Decimal(0)
            if (inChallenge("m", 22)) variableAdd = new Decimal(0.375)

            return new Decimal(1.1).plus(upgradeEffect("m", 21, true))
            .mul(upgradeEffect("m", 33, false))
            .plus(variableAdd)
        },

        commonGeneratorMultiplier() {
            let variableMult = new Decimal(1)

            if (challengeCompletions("m", 13) >= 1) {
                variableMult = variableMult.mul(challengeEffect("m", 13))
            }
            
            return new Decimal(1)
            .mul(buyableEffect("q", 11))
            .mul(player.m.manifoldPower.max(1).pow(player.m.manifoldConversionRate))
            .mul((upgradeEffect("m", 11, false)))
            .mul(variableMult)
            .div(tmp.q.values.manifoldChal2_PurchaseDivisor.clampMin(1))
            .div(player.m.manifoldChal4_productionDivisor.clampMin(1))
            .div(tmp.m.values.manifoldChal9_divisor)
        },

        commonGeneratorPower() {
            let variableMult = new Decimal(1)

            if (challengeCompletions("m", 31) >= 1) {
                variableMult = variableMult.plus(1.05)
            }

            return variableMult
        },

        purchaseLimit() {
            return inChallenge("m", 22) ? new Decimal(1) : new Decimal(Infinity)
        },

        atomReqGen() {
            if (inChallenge("m", 11)) { return 3 }

            switch (player.q.atoms.toNumber()) {
                case 0: return 3
                case 1: return 4
                case 2: return 5
                case 3: return 6
                case 4: return 7
                default: return 7
            }
        },

        atomScaleStart() {
            return new Decimal(50).plus(buyableEffect("em", 13))
        },
    },

    color: "#a8a8a8",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Quarks", // Name of prestige currency
    baseResource: "Quarks", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Max All Quark Generators", onPress(){
            for (const id of [11,
                110, 111, 112, 113, 114, 115, 116, 117,
                100, 101, 102, 103, 104, 105, 106, 107,
                120, 121, 122, 123, 124, 125, 126, 127
            ]) {
                buyMaxBuyable("q", id)
            }
        }},
        {key: "a", description: "A: Buy Atom", onPress() {
            clickClickable("q", "101")
        }},
        {key: "r", description: "R: Big Rip", onPress() {
            clickClickable("m", 101)
        }}

        // {key: "c", description: "C: Buy Combustors", onpress(){
        //     buyMaxBuyable("q", 11)
        // }},
        // {key: "a", description: "A: Reset for Atoms", onpress(){
        //     clickClickable("q", 101)
        // }},
    ],
    
    update(diff) {
        player.q.startingPoints = hasAchievement("ach", 21) ?  new Decimal(100) : new Decimal(10)

        player.q.until10 = player.q.until10 ?? true

        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            let gen = player.q.generators
            if (id != 7) setBuyableAmount("q", "11" + (id), 
                getBuyableAmount("q", "11" + id).plus(
                Decimal.div(1000, tmp.q.generators[id + 1].interval.clampMin(1))
                .mul(tmp.q.generators[id + 1].intensity)
                .mul(tmp.q.values.commonGeneratorMultiplier)
                .mul(buyableEffect("q", "11" + (id + 1)))
                .mul(diff))
            )
            tmp.q.generators[id].intensity = tmp.q.generators[id].intensity.mul(tmp.q.values.atomMult[id])
        }

        player.points = player.points.plus(buyableEffect("q", 110).mul(Decimal.div(1000, tmp.q.generators[0].interval.clampMin(1).max(player.q.intervalCap))).mul(tmp.q.generators[0].intensity).mul(tmp.q.values.commonGeneratorMultiplier).pow(player.m.manifoldChal3_productionPower).pow(tmp.q.values.manifoldChal8_ProductionPow).root(new Decimal(tmp.m.values.manifoldChal9_productionRoot).mul(tmp.m.values.manifoldChal9_rootModifier.recip()).clampMin(1)).mul(diff))

        // Safeguard in case of order of operations fucking you over
        if (player.points.lt(player.q.startingPoints) && player.q.generators[0].purchased.lte(0)) {player.points = player.q.startingPoints}

        if (!tmp.q.inAnyChallenge) player.q.atoms = player.q.atoms.clampMin(upgradeEffect("m", 12))

        if (player.q.best.lt(player.points)) player.q.best = player.points
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
        let intensityScale = [
            new Decimal(20000),
            new Decimal(40000),
            new Decimal(80000),
            new Decimal(160000),
            new Decimal(320000),
            new Decimal(640000),
            new Decimal(1280000),
            new Decimal(10240000),
        ]
        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            buyables["10" + id] = {
                cost(x) {
                    let p = player.q.generators[id].phases
                    let base = p.plus(1).pow_base(new Decimal(100).sub(upgradeEffect("m", 22, true)))
                    let u308 = new Decimal("1.8e308").root(0.95).div(100).div(new Decimal(costMults[id])).clampMin(1).log(base).floor()
                    let power = challengeCompletions("m", 31) == 2 ? 0.95 : 1

                    if (x.gte(u308)) x = x.sub(u308).pow(tmp.q.values.genScaleExp).plus(u308)
                    // return new Decimal(100).pow(x).mul(new Decimal(costMults[id])).mul(100)
                    // x.sub(153).pow(2).plus(153).pow_base(100).mul(new Decimal(...)).mul(100)
                    return x.pow_base(base).mul(new Decimal(costMults[id])).mul(100).pow(power)
                },
                purchasesLeft(z = new Decimal(0)) {
                    // z is expected to be the current interval
                    // x = (log10(A / z)) / log10(y)
                    if (z.eq(0)) z = tmp.q.generators[id].interval
                    let A = tmp.q.values.intervalCap
                    let y = tmp.q.values.intervalMul
                    
                    // Decimal.ceil(Decimal.log10(player.q.intervalCap.div(player.q.generators[7].interval)).div(player.q.intervalMul.log10()))
                    return Decimal.ceil(Decimal.log10(A.div(z)).div(y.log10()))
                },
                canPhase() {
                    return this.purchasesLeft().eq(0) && !inChallenge("m", 23)
                },
                display() {
                    let p = player.q.generators[id].phases
                    let l = this.purchasesLeft()
                    return l.gt(0) ? `
                        <h3>Interval: ${formatSmall(tmp.q.generators[id].interval)}ms (Δ${formatWhole(p)})
                        <br>→ ${formatSmall(tmp.q.generators[id].interval.mul(tmp.q.values.intervalMul))}ms Costs: ${format(this.cost())} Quarks
                    ` : 
                    `<h3>Δ Phase Shift
                    <br><br>${format(tmp.q.generators[id].interval)}ms → ${format(tmp.q.generators[id].interval.mul(tmp.q.values.phaseIntervalMult))}ms
                    Intensity ×${tmp.q.values.phaseIntensityMult}`
                },
                canAfford() {
                    return (player.points.gte(this.cost()) && this.purchasesLeft().gt(0) && tmp.q.generators[id].unlocked == true && getBuyableAmount(this.layer, this.id).lt(tmp.q.values.purchaseLimit)) || this.canPhase()
                },
                buy() {
                    if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}
                    if (this.canPhase() || tmp.q.generators[id].interval.lte(tmp.q.intervalCap)) {
                        player.q.generators[id].phases = player.q.generators[id].phases.plus(1)
                        tmp.q.generators[id].interval = new Decimal(10000)
                    } else {
                        player.points = player.points.sub(this.cost())
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
                    }
                },
                buyMax() {
                    if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}

                    let p = player.q.generators[id].phases
                    let base = p.plus(1).pow_base(new Decimal(100).sub(upgradeEffect("m", 22, true)))
                    let power = challengeCompletions("m", 31) == 2 ? 0.95 : 1

                    let x = getBuyableAmount(this.layer, this.id)
                    let u308 = new Decimal("1.8e308").root(power).div(100).div(new Decimal(costMults[id])).clampMin(1).log(base).floor()
                    let preScale = player.points.root(power).div(100).div(new Decimal(costMults[id])).clampMin(1).log(base).floor().plus(1).min(u308)
                    let postScale = player.points.root(power).div(100).div(new Decimal(costMults[id])).clampMin(1).log(base).sub(u308).clampMin(0).root(tmp.q.values.genScaleExp).plus(u308).floor().sub(u308.sub(1))
                    let amt = preScale

                    if (preScale.eq(u308)) amt = preScale.plus(postScale)
                    if (!this.canPhase() && tmp.q.generators[id].interval.gt(tmp.q.values.intervalCap)) {
                        setBuyableAmount(this.layer, this.id, amt.min(getBuyableAmount(this.layer, this.id).plus(this.purchasesLeft())).clampMax(tmp.q.values.purchaseLimit))
                    } else {
                        player.q.generators[id].phases = player.q.generators[id].phases.plus(1)
                        tmp.q.generators[id].interval = new Decimal(10000)
                    }
                    if (this.canAfford()) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer, this.id).sub(1)))
                },
                effect() {
                    let x = getBuyableAmount(this.layer, this.id)
                    return tmp.q.values.intervalMul.pow(x).mul(1000).mul(player.q.generators[id].phases.pow_base(tmp.q.values.phaseIntervalMult))
                },
                tooltip() {
                    return inChallenge("m", 22) ? "Purchases capped at 1 by Capital Tradeoff" : `${formatWhole(getBuyableAmount(this.layer, this.id))} Purchases`
                }
            },
            buyables["11" + id] = {
                cost(x, override = new Decimal(0)) {
                    x = new Decimal(player.q.generators[id].purchased).div(10).floor()
                    if (override.gte(x)) x = override
                    let u308 = new Decimal("1.8e308").div(10).div(new Decimal(costMults[id])).clampMin(1).log(scale[id]).floor()
                    if (x.gte(u308)) x = x.sub(u308).pow(tmp.q.values.genScaleExp).plus(u308)
                    let val = x.pow_base(scale[id]).mul(new Decimal(costMults[id])).mul(10)
                    if (player.q.until10) val = val.mul(10 - x.toNumber() % 10)
                    return x.pow_base(scale[id]).mul(new Decimal(costMults[id])).mul(10)
                    // let baseCost = x.div(10).floor().pow_base(scale[id]).mul(new Decimal(costMults[id])).mul(10)
                    // return player.points.div(baseCost).min(10 - amt).floor().mul(baseCost).max(baseCost)
                },
                display() {
                    let amt = 10 - (player.q.generators[id].purchased.toNumber() % 10)
                    let x = new Decimal(player.q.generators[id].purchased)
                    let baseCost = new Decimal(scale[id]).pow(x.div(10).floor()).mul(new Decimal(costMults[id])).mul(10)
                    let disp = player.points.div(baseCost.clampMin(1)).min(amt).floor()
                    return `
                        <h3>Buy ${player.q.until10 ? formatWhole(disp.max(1)) : formatWhole(1)}
                        <br><br>Costs: ${player.q.until10 ? format(this.cost().mul(disp.max(1))) : format(this.cost())} Quarks
                    `
                },
                canAfford() {
                    return player.points.gte(this.cost()) && tmp.q.generators[id].unlocked && player.q.generators[id].purchased.lt(tmp.q.values.purchaseLimit)
                },
                buy() {
                    player.q.latestPurchased = "11" + id
                    if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}

                    let x = new Decimal(player.q.generators[id].purchased).div(10).floor()
                    let baseCost = x.pow_base(scale[id]).mul(new Decimal(costMults[id])).mul(10)
                    let m = player.points.div(baseCost.clampMin(1)).floor().min(10 - x.mul(10).toNumber() % 10)
                    if (player.q.until10) baseCost = baseCost.mul(m)

                    if (player.q.until10) {
                        player.points = player.points.sub(this.cost())
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(m).clampMax(tmp.q.values.purchaseLimit))
                        player.q.generators[id].purchased = new Decimal(player.q.generators[id].purchased).plus(m)
                        return
                    }
                    player.points = player.points.sub(baseCost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
                    player.q.generators[id].purchased = new Decimal(player.q.generators[id].purchased).plus(1)
                },
                buyMax() {
                    player.q.latestPurchased = "11" + id
                    if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}

                    let u308 = new Decimal("1.8e308").div(10).div(new Decimal(costMults[id])).clampMin(1).log(scale[id]).floor()
                    let preScale = player.points.div(10).div(new Decimal(costMults[id])).clampMin(1).log(scale[id]).floor().plus(1).min(u308)
                    let postScale = player.points.div(10).div(new Decimal(costMults[id])).clampMin(1).log(scale[id]).sub(u308).max(0).root(tmp.q.values.genScaleExp).plus(u308).floor().sub(u308.sub(1))
                    let amt = preScale

                    if (preScale.eq(u308)) amt = preScale.plus(postScale.max(0))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(amt.mul(10)).clampMax(tmp.q.values.purchaseLimit))
                    player.q.generators[id].purchased = amt.mul(10).max(player.q.generators[id].purchased).clampMax(tmp.q.values.purchaseLimit)
                    if (this.canAfford() && player.points.gte(this.cost()) && player.q.generators[id].purchased.lt(amt.mul(10))) player.points = player.points.sub(this.cost(0, amt))
                },
                effect() {
                    let x10 = new Decimal(player.q.generators[id].purchased).max(1).div(10).floor().pow_base(tmp.q.values.buy10Mul)
                    let x = getBuyableAmount(this.layer, this.id)
                    return x.mul(x10)
                },
                tooltip() {
                    return inChallenge("m", 22) ? "Purchases capped at 1 by Capital Tradeoff" : `${formatWhole(getBuyableAmount(this.layer, this.id))} Purchases`
                }
            },
            buyables["12" + id] = {
                cost(x) {
                    let u308 = new Decimal("1.8e308").div(10000).div(new Decimal(costMults[id])).clampMin(1).log(intensityScale[id]).floor()
                    if (x.gte(u308)) x = x.sub(u308).pow(tmp.q.values.genScaleExp).plus(u308)
                    return x.pow_base(intensityScale[id]).mul(new Decimal(costMults[id])).mul(10000)
                },
                display() {
                    return `
                        <h3>Intensity: ${format(tmp.q.generators[id].intensity)}
                        <br>→ ×${format(tmp.q.generators[id].intensity.mul(tmp.q.values.intensityMul))} Output Costs: ${format(this.cost())} Quarks
                    `
                },
                canAfford() {
                    return player.points.gte(this.cost()) && tmp.q.generators[id].unlocked && player.q.generators[id].purchased.lt(tmp.q.values.purchaseLimit) == true
                },
                buy() {
                    if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}

                    player.points = player.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
                },
                buyMax() {
                    if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}

                    let x = getBuyableAmount(this.layer, this.id)
                    let u308 = new Decimal("1.8e308").div(10000).div(new Decimal(costMults[id])).clampMin(1).log(intensityScale[id]).floor()
                    let preScale = player.points.div(10000).div(new Decimal(costMults[id])).clampMin(1).log(intensityScale[id]).floor().plus(1).min(u308)
                    let postScale = player.points.div(10000).div(new Decimal(costMults[id])).clampMin(1).log(intensityScale[id]).max(u308).sub(u308).clampMin(0).root(tmp.q.values.genScaleExp).plus(u308).floor().sub(u308.sub(1))
                    let amt = preScale
                    if (preScale.eq(u308)) amt = preScale.plus(postScale)
                    setBuyableAmount(this.layer, this.id, amt.clampMax(tmp.q.values.purchaseLimit))
                    if (this.canAfford()) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer, this.id).sub(1)))
                },
                effect() {
                    let x = getBuyableAmount(this.layer, this.id)
                    return tmp.q.values.intensityMul.pow(x).mul(buyableEffect("q", 11))
                },
                tooltip() {
                    return inChallenge("m", 22) ? "Purchases capped at 1 by Capital Tradeoff" : `${formatWhole(getBuyableAmount(this.layer, this.id))} Purchases`
                }
            }
        }

        buyables["11"] = {
            cost(x) {
                let u308 = new Decimal("1.8e308").div(10000).clampMin(1).log(100)
                if (x.gte(u308)) x = x.sub(u308).pow(tmp.q.values.accelScaleExp).plus(u308)
                return x.pow_base(100).mul(10000)
            },
            display() {
                return `
                    <h2>Accelerators</h2>
                    Multiply all Generator Intensities by ×${format(tmp.q.values.accelMul, 3)}:
                    → ${format(buyableEffect("q", 11).mul(tmp.q.values.accelMul), 3)} Costs: ${format(this.cost())}
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
                player.m.ach24_req = false
                if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}
                
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
            buyMax() {
                player.m.ach24_req = false
                if (inChallenge("m", 13)) {player.m.manifoldChal3_productionPower = new Decimal(0)}

                let u308 = new Decimal("1.8e308").div(10000).clampMin(1).log(100).floor()
                let preScale = player.points.div(10000).clampMin(1).log(100).ceil().min(u308)
                let postScale = player.points.div(10000).clampMin(1).log(100).max(u308).sub(u308).max(1).root(tmp.q.values.accelScaleExp).ceil().max(0)
                let amt = preScale
                
                    if (preScale.eq(u308)) amt = preScale.plus(postScale)
                    setBuyableAmount(this.layer, this.id, amt)
                    if (this.canAfford()) player.points = player.points.sub(this.cost(amt))
            },
            effect() {
                return Decimal.pow(tmp.q.values.accelMul, getBuyableAmount(this.layer, this.id).plus(tmp.em.values.charmedMatterEffect))
            },
            tooltip() {
                return `${formatWhole(getBuyableAmount(this.layer, this.id))} Purchases + ${formatWhole(tmp.em.values.charmedMatterEffect)} Free`
            }
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
                let phrase = player.q.atoms.gte(tmp.q.values.atomScaleStart) ? "Decaying Atoms" : "Atoms"
                return `
                    <h3>${phrase} (${formatWhole(player.q.atoms)})
                `
            },
            reqGen() {
                if (inChallenge("m", 11)) { return 3 }

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
                let atoms = player.q.atoms
                let quadraticThreshold = new Decimal(tmp.q.values.atomScaleStart) // The threshold for quadratic scaling
                let base = new Decimal(20) // The base amount for the linear scaling
                let required = 4 // The amount before the costs begin increasing    

                if (inChallenge("m", 11)) required = 1
                if (atoms.lt(required)) {
                    return base
                } else if (atoms.lt(quadraticThreshold)) {
                    return atoms.sub(required - 1).mul(base)
                } else {
                    return atoms.pow(2).mul(2)
                        .plus(atoms.mul(base))
                        .sub(atoms.mul(quadraticThreshold).mul(4))
                        .plus(quadraticThreshold.pow(2).mul(2))
                        .sub(base.mul(required - 1))
                }
            },
            display() {
                let phrase = player.q.atoms.lt(4) ? `Unlock the next Generator;` : ``
                if (inChallenge("m", 33)) return `<br>Atoms have been destroyed by Desolate Desecration`
                return `
                    ${phrase} Multiply all Generators by ×${format(tmp.q.values.atomStrength)}
                    <br><br>Requires: ${formatWhole(this.cost())} ${formatWhole(this.reqGen() + 1)}th Generators
                `
            },
            resetGain() {
                let atoms = player.q.atoms
                let quadraticThreshold = new Decimal(tmp.q.values.atomScaleStart) // The threshold for quadratic scaling
                let base = new Decimal(20) // The base amount for the linear scaling
                let required = 4 // The amount before the costs begin increasing  
                
                const a = new Decimal(2)
                const b = base.sub(quadraticThreshold.mul(4));
                const c = quadraticThreshold.pow(2).mul(2).sub(base.mul(required - 1)).sub(player.q.generators[7].purchased);  

                const discriminant = b.pow(2).sub(a.mul(c).mul(4));
                if (discriminant.lt(0)) { }

                const sqrtD = discriminant.sqrt();

                const x1 = sqrtD.sub(b).div(a.mul(2));
                const x2 = sqrtD.neg().sub(b).div(a.mul(2));

                if (atoms.lt(required)) {
                    return new Decimal(1)
                } else if (atoms.lt(quadraticThreshold)) {
                    return player.q.generators[7].purchased.div(base).sub(required - 1).ceil().clampMin(0).clampMax(quadraticThreshold)
                }
                return Decimal.max(x1.ceil(), x2.ceil()); // x >= y
            },
            unlocked() {
                return true
            },
            canClick() {
                return !inChallenge("m", 33) && (player.q.generators[this.reqGen()].purchased.gte(this.cost()) || (this.resetGain().gt(player.q.atoms) && tmp.q.values.atomReqGuen == 7))
            },
            onClick() {
                let atoms = player.q.atoms
                let best = player.q.best
                let gain = this.resetGain()
                if (challengeCompletions("m", 23) < 2) { 
                    layerDataReset("q") 
                    player.points = player.q.startingPoints
                }
                if (challengeCompletions("m", 23) >= 1 && atoms.gte(4)) { 
                    player.q.atoms = gain; return 
                }
                player.q.atoms = atoms.plus(1)
                player.q.best = best
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

    tabFormat: {
        "Quark Generators": {
            content: [
                ["display-text",
                    function() { return `Buy 10 Multiplier: ×${format(tmp.q.values.buy10Mul)} | Interval Divisor: /${format(new Decimal(1).div(tmp.q.values.intervalMul))} | Intensity Multiplier: ×${format(tmp.q.values.intensityMul)}`}
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
                            function() { 
                                let mult = player.q.generators[0].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul)
                                    .mul(tmp.q.generators[0].intensity)
                                    .mul(tmp.q.values.commonGeneratorMultiplier)
                                return `<h5>×${format(mult)} | ${format(player.q.generators[0].purchased)}` 
                            }
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
                            function() { 
                                let mult = player.q.generators[1].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul)
                                    .mul(tmp.q.generators[1].intensity)
                                    .mul(tmp.q.values.commonGeneratorMultiplier)
                                return `<h5>×${format(mult)} | ${format(player.q.generators[1].purchased)}` 
                            }
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
                            function() { 
                                let mult = player.q.generators[2].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul)
                                    .mul(tmp.q.generators[2].intensity)
                                    .mul(tmp.q.values.commonGeneratorMultiplier)
                                return `<h5>×${format(mult)} | ${format(player.q.generators[2].purchased)}` 
                            }
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
                            function() { 
                                let mult = player.q.generators[3].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul)
                                    .mul(tmp.q.generators[3].intensity)
                                    .mul(tmp.q.values.commonGeneratorMultiplier)
                                return `<h5>×${format(mult)} | ${format(player.q.generators[3].purchased)}` 
                            }
                        ],
                        ["row", [["buyable", [103]], ["buyable", [113]], ["buyable", [123]]]],
                        ["row", [["clickable", [213]], ["clickable", [223]], ["clickable", [233]]]],
                    ]
                ],
                () => tmp.q.generators[4].unlocked ? ["column",
                    [
                        ["display-text", 
                            `<h3>5th Quark Generator (${formatWhole(getBuyableAmount("q", 114))})`
                        ],
                        // player.q.generators[4].purchased.div(10).floor().pow_base(player.q.buy10Mul).mul(player.q.generators[4].intensity).mul(player.q.commonGeneratorMultiplier)
                        ["display-text", `<h5>×${format(player.q.generators[4].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul).mul(tmp.q.generators[4].intensity).mul(tmp.q.values.commonGeneratorMultiplier))} | ${format(player.q.generators[4].purchased)}`],
                        ["row", [["buyable", [104]], ["buyable", [114]], ["buyable", [124]]]],
                        ["row", [["clickable", [214]], ["clickable", [224]], ["clickable", [234]]]],
                    ],
                ] : ["column", [["display-text", "<h3>5th Quark Generator (LOCKED)"]]],
                () => tmp.q.generators[5].unlocked ? ["column",
                    [
                        ["display-text", 
                            `<h3>6th Quark Generator (${formatWhole(getBuyableAmount("q", 115))})`
                        ],
                        ["display-text", `<h5>×${format(player.q.generators[5].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul).mul(tmp.q.generators[5].intensity).mul(tmp.q.values.commonGeneratorMultiplier))} | ${format(player.q.generators[5].purchased)}`],
                        ["row", [["buyable", [105]], ["buyable", [115]], ["buyable", [125]]]],
                        ["row", [["clickable", [215]], ["clickable", [225]], ["clickable", [235]]]],
                    ],
                ] : ["column", [["display-text", "<h3>6th Quark Generator (LOCKED)"]]],
                () => tmp.q.generators[6].unlocked ? ["column",
                    [
                        ["display-text", 
                            `<h3>7th Quark Generator (${formatWhole(getBuyableAmount("q", 116))})`
                        ],
                        ["display-text", `<h5>×${format(player.q.generators[6].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul).mul(tmp.q.generators[6].intensity).mul(tmp.q.values.commonGeneratorMultiplier))} | ${format(player.q.generators[6].purchased)}`],
                        ["row", [["buyable", [106]], ["buyable", [116]], ["buyable", [126]]]],
                        ["row", [["clickable", [216]], ["clickable", [226]], ["clickable", [236]]]],
                    ],
                ] : ["column", [["display-text", "<h3>7th Quark Generator (LOCKED)"]]],
                () => tmp.q.generators[7].unlocked ? ["column",
                    [
                        ["display-text", 
                            `<h3>8th Quark Generator (${formatWhole(getBuyableAmount("q", 117))})`
                        ],
                        ["display-text", `<h5>×${format(player.q.generators[7].purchased.div(10).floor().pow_base(tmp.q.values.buy10Mul).mul(tmp.q.generators[7].intensity).mul(tmp.q.values.commonGeneratorMultiplier))} | ${format(player.q.generators[7].purchased)}`],
                        ["row", [["buyable", [107]], ["buyable", [117]], ["buyable", [127]]]],
                        ["row", [["clickable", [217]], ["clickable", [227]], ["clickable", [237]]]],
                    ],
                ] : ["column", [["display-text", "<h3>8th Quark Generator (LOCKED)"]]],
        
                ["row",
                    [["clickable", [101]]]
                ]
            ],
            buttonStyle: {
                "margin-top":"15px",
            }
        },
        "Manifold Generators": {
            content: [
                ["layer-proxy", ["m", [
                    ["manifold-column", 
                        [
                            ["display-text", function() {
                                return `
                                You have <h2 style="color:#12a272;">${formatWhole(player.m.manifoldPower)}</h2> Manifold Power, which is
                                <br>translated <h2 style="color:#12a272;">^${format(player.m.manifoldConversionRate)}</h2> to a <h2 style="color:#12a272">×${format(player.m.manifoldPower.max(1).pow(player.m.manifoldConversionRate))}</h2> multiplier on all Quark Generators.
                                `
                            }],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">1st Manifold Generator (${formatWhole(player.m.generators[0].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[0].purchased)} ${pluralize("Purchase", player.m.generators[0].purchased)} | ×${format(tmp.m.generators[0].multiplier)}` }],
                                    ["buyable", [100]],
                                ]
                            ],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">2nd Manifold Generator (${formatWhole(player.m.generators[1].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[1].purchased)} ${pluralize("Purchase", player.m.generators[1].purchased)} | ×${format(tmp.m.generators[1].multiplier)}` }],
                                    ["buyable", [101]],
                                ]
                            ],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">3rd Manifold Generator (${formatWhole(player.m.generators[2].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[2].purchased)} ${pluralize("Purchase", player.m.generators[2].purchased)} | ×${format(tmp.m.generators[2].multiplier)}` }],
                                    ["buyable", [102]],
                                ]
                            ],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">4th Manifold Generator (${formatWhole(player.m.generators[3].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[3].purchased)} ${pluralize("Purchase", player.m.generators[3].purchased)} | ×${format(tmp.m.generators[3].multiplier)}` }],
                                    ["buyable", [103]],
                                ]
                            ],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">5th Manifold Generator (${formatWhole(player.m.generators[4].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[4].purchased)} ${pluralize("Purchase", player.m.generators[4].purchased)} | ×${format(tmp.m.generators[4].multiplier)}` }],
                                    ["buyable", [104]],
                                ]
                            ],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">6th Manifold Generator (${formatWhole(player.m.generators[5].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[5].purchased)} ${pluralize("Purchase", player.m.generators[5].purchased)} | ×${format(tmp.m.generators[5].multiplier)}` }],
                                    ["buyable", [105]],
                                ]
                            ],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">7th Manifold Generator (${formatWhole(player.m.generators[6].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[6].purchased)} ${pluralize("Purchase", player.m.generators[6].purchased)} | ×${format(tmp.m.generators[6].multiplier)}` }],
                                    ["buyable", [106]],
                                ]
                            ],
                            ["row", 
                                [
                                    ["display-text", function() { return `<h3 style="position:absolute; left:25%;">8th Manifold Generator (${formatWhole(player.m.generators[7].amount)})</h3>
                                                                        <br><h4 style="position:absolute; left:25%;">${formatWhole(player.m.generators[7].purchased)} ${pluralize("Purchase", player.m.generators[7].purchased)} | ×${format(tmp.m.generators[7].multiplier)}` }],
                                    ["buyable", [107]],
                                ]
                            ],
                        ]
                    ]
                ]]
            ]],
            buttonStyle: {
                "margin-top":"15px",
            },
            unlocked() {
                return player.m.resets.gte(1)
            }
        }
    },

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

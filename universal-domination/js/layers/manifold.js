addLayer("m", {
    name: "Big Rip",
    symbol: "ɵ",
    position: 1,
    startData() { 
        const data = {
            unlocked: true,
            points: new Decimal(0),

            // manifoldMultiplier: new Decimal(1),
            // commonMGMultiplier: new Decimal(1),
            // ach22_req: false,
            // MGPurchaseMultiplier: new Decimal(10),
            generators: [],
            manifoldPower: new Decimal(0),
            manifoldConversionRate: new Decimal(0.5),
            resets: new Decimal(0),

            manifoldChal3_productionPower: new Decimal(0),
            manifoldChal4_productionDivisor: new Decimal(1),

            // Achievement 24: big rip without ever purchasing any accelerators
            ach24_req: false,
            ach24_done: false,
        }

        for (let i = 0; i < 8; i++) {
            data.generators[i] = {
              amount: new Decimal(0),
              purchased: new Decimal(0)
            }
        }

        return data
    },
    // layer data shit
    generators: [
        {
            unlocked() { return true },
            multiplier() { 
                return player.m.generators[0].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)
                .mul(upgradeEffect("m", 32, false))
            },
        },
        {
            unlocked() {return true},
            multiplier() { return player.m.generators[1].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)},
        },
        {
            unlocked() {return true},
            multiplier() {return player.m.generators[2].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)},
        },
        {
            unlocked() {return true},
            multiplier() {return player.m.generators[3].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)},
        },
        {
            unlocked() {return true},
            multiplier() {return player.m.generators[4].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)},
        },
        {
            unlocked() {return true},
            multiplier() {return player.m.generators[5].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)},
        },
        {
            unlocked() {return true},
            multiplier() {return player.m.generators[6].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)},
        },
        {
            unlocked() {return true},
            multiplier() {return player.m.generators[7].purchased.pow_base(tmp.m.values.MGPurchaseMultiplier).mul(tmp.m.values.commonMGMultiplier)},
        },
    ],

    //shifting values that don't belong in startData()
    values: {
        manifoldMultiplier() {return new Decimal(1).mul(buyableEffect("m", 203))
            .mul(upgradeEffect("m", 34, false))
        },

        commonMGMultiplier() {return new inChallenge("m", 32) ? new Decimal(1).mul(buyableEffect("m", 204))
            : new Decimal(0)
        },

        MGPurchaseMultiplier() {return new Decimal(10)},

        manifoldChal9_productionRoot() {
            for (const id of [5, 4, 3, 2, 1, 0]) {
                if (player.q.generators[id].purchased.gte(0)) return (id + 2)
            }
            return 1
        },
    },
    
    color: "#12a272",
    requires: new Decimal("1.8e308"),
    resource: "Manifold",
    baseResource: "Quarks",
    baseAmount() { return player.points },
    type: "custom",
    row: 1,
    hotkeys: [],
    update(diff) {
        let gen = player.m.generators
        for (const id of [0, 1, 2, 3, 4, 5, 6]) {
            gen[id].amount = gen[id].amount.plus(gen[id + 1].amount.mul(tmp.m.generators[id + 1].multiplier).mul(diff))
        }

        player.m.manifoldPower = player.m.manifoldPower.plus(gen[0].amount.mul(tmp.m.generators[0].multiplier).mul(diff))

        if (player.m.best.lt(player.m.points)) player.m.best = player.m.points

        if (!inChallenge("m", 13)) { player.m.manifoldChal3_productionPower = new Decimal(1) } else {
            player.m.manifoldChal3_productionPower = player.m.manifoldChal3_productionPower.plus(new Decimal(1 / 180).mul(diff)).clampMax(1)
        }

        if (!inChallenge("m", 21)) { player.m.manifoldChal4_productionDivisor = new Decimal(1) } else {
            player.m.manifoldChal4_productionDivisor = new Decimal(player.m.resetTime).pow_base(1000)
        }

        // Achievement requirements
        
    },

    buyables: (function() {
        let buyables = {}
        let baseCosts = [1, 10, 100, 1000, 1e100, 1e150, 1e200, 1e250]
        let costMults = [
            new Decimal(3),
            new Decimal(3),
            new Decimal(30),
            new Decimal(300),

            // The final four Manifold Generators will be unlocked at the end of Big Rip, so their values
            // Don't particularly matter right now
            new Decimal(10000),
            new Decimal(10000),
            new Decimal(10000),
            new Decimal(10000),
        ]
        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            buyables["10" + id] = {
                cost(x) {
                    // Worry about cost scaling later.
                    // I have no idea when/how it should be implemented, so I'll
                    // Burn that bridge when I get to it
                    x = player.m.generators[id].purchased
                    let base = baseCosts[id]
                    let mult = costMults[id]
                    return new Decimal(x).pow_base(mult).mul(base)
                },
                display() {
                    return `Cost: ${formatWhole(this.cost())} ${pluralize("Manifold", this.cost())}`
                },
                canAfford() {
                    return player.m.points.gte(this.cost())
                },
                buy() {
                    player.m.points = player.m.points.sub(this.cost())
                    player.m.generators[id].purchased = player.m.generators[id].purchased.plus(1)
                    player.m.generators[id].amount = player.m.generators[id].amount.plus(1)
                },
                effect() {
                    return new Decimal(0)
                },
                style: {
                    "position": "absolute",
                    "right": "25%",
                    "width": "200px",
                    "height": "60px",
                    "min-height": "60px",
                },
            }
        }
        buyables[201] = {
            amt() { return getBuyableAmount(this.layer, this.id) },
            isCapped() { return this.amt().lt(8) },
            cost(x) { 
                return x.pow_base(10)
            },
            display() {
                return this.amt().lt(8) ? `<h3 style="margin-top: -5px;">
                Reduce Quark Generator cost scaling exponent by -0.1
                Currently: -${format(this.effect(), 1)}
                Costs: ${format(this.cost())} ${pluralize("Manifold", this.cost())}
                ` : `<h3 style="margin-top: -5px;">
                Reduce Quark Generator cost scaling exponent by -0.1
                CAPPED: -${format(this.effect(), 1)}
                `
            },
            effect() {
                return Decimal.mul(0.1, getBuyableAmount(this.layer, this.id))
            },
            style() { return {
                "width": "180px",
                "height": "100px",
                "background-color": !this.isCapped() ? "#12a272 !important" : "",
                "cursor": !this.isCapped() ? "auto" : ""
            }},
            canAfford() {
                return player.m.points.gte(this.cost()) && this.amt().lt(8)
            },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        }
        buyables[202] = {
            amt() { return getBuyableAmount(this.layer, this.id) },
            isCapped() { return this.amt().lt(8) },
            cost(x) { 
                return x.pow_base(5)
            },
            display() {
                return this.amt().lt(8) ? `<h3 style="margin-top: -5px;">
                Reduce Accelerator cost scaling exponent by -0.1
                Currently: -${format(this.effect(), 1)}
                Costs: ${format(this.cost())} ${pluralize("Manifold", this.cost())}
                ` : `<h3 style="margin-top: -5px;">
                Reduce Accelerator cost scaling exponent by -0.1
                CAPPED: -${format(this.effect(), 1)}
                `
            },
            effect() {
                return Decimal.mul(0.1, getBuyableAmount(this.layer, this.id))
            },
            style() { return {
                "width": "180px",
                "height": "100px",
                "background-color": !this.isCapped() ? "#12a272 !important" : "",
                "cursor": !this.isCapped() ? "auto" : ""
            }},
            canAfford() {
                return player.m.points.gte(this.cost()) && this.amt().lt(8)
            },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        }
        buyables[203] = {
            cost(x) {
                return x.pow_base(10)
            },
            display() {
                return `<h3>Double Manifold gain
                Currently: ×${format(this.effect())}
                <br>Costs: ${format(this.cost())} Manifolds
                `
            },
            effect() {
                return Decimal.pow(2, getBuyableAmount(this.layer, this.id))
            },
            style() { return {
                "width": "180px",
                "height": "100px",
            }},
            canAfford() {
                return player.m.points.gte(this.cost())
            },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        }
        buyables[204] = {
            cost(x) {
                //10^((x(x+1))/2+1)
                return x.mul(x.plus(1)).div(2).plus(1).pow_base(10)
            },
            display() {
                return `<h3>Multiply Manifold Generators by 2
                Currently: ×${format(this.effect())}
                <br>Costs: ${format(this.cost())} Manifolds
                `
            },
            effect() {
                return Decimal.pow(2, getBuyableAmount(this.layer, this.id))
            },
            style() { return {
                "width": "180px",
                "height": "100px",
            }},
            canAfford() {
                return player.m.points.gte(this.cost())
            },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        }
        return buyables
    })(),

    upgrades: {
        11: {
            cost: new Decimal(1),
            fullDisplay() {
                return `<h3>Quark Generators gain a multiplier based on your Big Rips
                <br>Currently: ×${formatWhole(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifold`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                let x = player.m.resets.max(1)
                return new Decimal(4).pow(Decimal.log(x, 3)).pow(1.25)
            },
            onPurchase() {
                player.m.points = player.m.points.sub(this.cost)
            }
        },
        12: {
            cost: new Decimal(1),
            fullDisplay() {
                return `<h3>Based on your Big Rips, start each non-Challenge reset with x Atoms.
                <br><br>Currently: ${formatWhole(this.effect())} ${this.effect().gte(4) ? "(Capped)" : ""}
                <br>Costs: ${formatWhole(this.cost)} Manifold`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return player.m.resets.log10().floor().clampMax(4)
            }
        },
        13: {
            cost: new Decimal(1),
            fullDisplay() {
                return `<h3>The Intensity Multiplier is improved based on your total Phase Shifts
                <br>Currently: +${format(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifold`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                let x = new Decimal(0)
                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    x = x.plus(player.q.generators[id].phases)
                }
                return x.div(100).max(0)
            }
        },
        14: {
            cost: new Decimal(2),
            fullDisplay() {
                return `<h3>The Buy 10 multiplier is improved based on 8th Generators Purchased
                <br>Currently: +${format(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return player.q.generators[7].purchased.clampMin(0).div(100).pow(0.5)
            }
        },
        21: {
            cost: new Decimal(10),
            fullDisplay() {
                return `<h3>The Accelerator multiplier becomes ×1.125
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return new Decimal(0.025)
            }
        },
        22: {
            cost: new Decimal(10),
            fullDisplay() {
                return `<h3>Phase Shifting affects the Interval cost scaling less
                <br>100^(x+1) → 50^(x+1)
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return new Decimal(50)
            }
        },
        23: {
            cost: new Decimal(10),
            fullDisplay() {
                return `<h3>The Atom multiplier becomes ×10
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return new Decimal(8)
            }
        },
        24: {
            cost: new Decimal(50),
            fullDisplay() {
                return `<h3>The Interval divisor is improved based on purchased Accelerators
                <br>Currently: +${format(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return getBuyableAmount("q", 11).pow(0.15).div(10)
            }
        },
        31: {
            cost: new Decimal(200),
            fullDisplay() {
                return `<h3>8th Quark Generator gains a multiplier based on 1st Quark Generators
                <br>Currently: ×${format(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return getBuyableAmount("q", 110).clampMin(1).log10().pow(4)
            }
        },
        32: {
            cost: new Decimal(200),
            fullDisplay() {
                return `<h3>1st Manifold Generator gains a multiplier based on current Quarks
                <br>Currently: ×${format(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return player.points.clampMin(1).log10().pow(2).clampMin(1)
            }
        },
        33: {
            cost: new Decimal(200),
            fullDisplay() {
                return `<h3>Atoms provide a small boost to Accelerators
                <br>Currently: ×${format(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return new Decimal(1.0005).pow(player.q.atoms)
            },
            tooltip: "1.0005^x"
        },
        34: {
            cost: new Decimal(1000),
            fullDisplay() {
                return `<h3>Gain more Manifolds based on purchased Accelerators
                <br>Currently: ×${format(this.effect())}
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return buyableEffect("q", 11).max(1).log10().pow(0.5).max(1)
            }
        },
    },

    challenges: {
        11: {
            name() { return `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Respecialized Advancements ` + `${challengeCompletions("m", 32) >= 1 ? `(${formatWhole(this.completions())} / 2)` : ``}` },
            tier2_Reward() { return (challengeCompletions(this.layer, 32) >= 1 && challengeCompletions(this.layer, this.id) < 2) ? 
                `→ ×${format(this.rewardEffect().pow(2))}` : ``
            },
            goal() { return challengeCompletions(this.layer, 32) >= 1 ?
                new Decimal("1e5000") : new Decimal("1e500")
            },
            fullDisplay() { return `<h5 style="font-size:11px">Atoms no longer unlock new Generators, instead providing a large multiplier to the 4th Quark Generator.
                <br>Goal: Reach ${format(new Decimal("1e500"))} Quarks
                <br>Reward: Atoms are more powerful based on your Big Rips
                <br>Currently: ×${format(this.rewardEffect())} ${this.tier2_Reward()}` 
            },
            completions() { return challengeCompletions(this.layer, this.id) },
            canComplete() { return player.points.gte(this.goal()) },
            rewardEffect() {
                let tier2 = new Decimal(this.completions()).clampMin(1)
                return player.m.resets.log10().clampMin(1).pow(tier2)
            },
            completionLimit() {
                return challengeCompletions("m", 32) >= 1 ? 2 : 1
            }
        },
        12: {
            name() { return `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Impaired Itemization ` + `${challengeCompletions("m", 32) >= 1 ? `(${formatWhole(this.completions())} / 2)` : ``}` },
            tier2_Reward() { return (challengeCompletions(this.layer, 32) >= 1 && challengeCompletions(this.layer, this.id) < 2) ? 
                `→ +${format(this.rewardEffect().mul(2))}` : ``
            },
            goal() { return challengeCompletions(this.layer, 32) >= 1 ?
                new Decimal("1e12000") : new Decimal("1e1200")
            },
            fullDisplay() { return `<h5 style="font-size:11px">Every 10 Generator purchases divides all Generator output by ${formatWhole(10)}.
                <br><br>Goal: Reach ${format(new Decimal("1e1200"))} Quarks
                <br>Reward: The Buy 10 Multiplier is increased based on all Generator purchases
                <br>Currently: +${format(this.rewardEffect())} ${this.tier2_Reward()}` },
            canComplete() { return player.points.gte(this.goal()) },
            completions() { return challengeCompletions(this.layer, this.id) },
            rewardEffect() {
                let tier2 = new Decimal(this.completions()).clampMin(1)
                let value = new Decimal(0)
                for (i = 0; i < 7; i++) {
                    value = value.plus(player.q.generators[i].purchased)
                }

                return value.clampMin(1).log10().mul(tier2)
            },
            completionLimit() {
                return challengeCompletions("m", 32) >= 1 ? 2 : 1
            }
        },
        13: {
            name() { return `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Destructive Returns ` + `${challengeCompletions("m", 32) >= 1 ? `(${formatWhole(this.completions())} / 2)` : ``}` },
            tier2_Reward() { return (challengeCompletions(this.layer, 32) >= 1 && challengeCompletions(this.layer, this.id) < 2) ? 
                ` → +${format(this.rewardEffect(2))}` : ``
            },
            goal() { return challengeCompletions(this.layer, 32) >= 1 ?
                new Decimal("1e25000") : new Decimal("1e1000")
            },
            fullDisplay() { return `<h5 style="font-size:11px">Purchasing anything raises your Quark output ^0, gradually coming back over the next 3 minutes. Atoms are excluded from this rule.
                <br>Goal: Reach ${format(this.goal())} Quarks
                <br>Reward: All Quark Generator Multiplier based on your best Manifolds
                <br>Currently: ×${this.rewardEffect().lt("1e2000") ? format(this.rewardEffect()) + `${this.tier2_Reward()}` : format(this.rewardEffect()) + `${this.tier2_Reward()} (CAPPED)`}` },
            canComplete() { return player.points.gte(this.goal()) },
            completions() { return challengeCompletions(this.layer, this.id) },
            rewardEffect(completions) {
                completions = new Decimal(completions).clampMin(this.completions())
                multiplier = new Decimal(1).plus(completions.div(20))

                // Credit to TaeronQ for this formula
                let x = player.m.best 
                let convergeLimit = new Decimal(1.797e308)
                let convergeEff = new Decimal('e2000')

                return Decimal.sub(1, x.add(1).log(convergeLimit).add(1).mul(multiplier).recip()).pow_base(convergeEff)
            },
            completionLimit() {
                return challengeCompletions("m", 32) >= 1 ? 2 : 1
            }
        },
        21: {
            name() { return `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Temporal Altercation ` + `${challengeCompletions("m", 32) >= 1 ? `(${formatWhole(this.completions())} / 2)` : ``}` },
            tier2_Reward() { return (challengeCompletions(this.layer, 32) >= 1 && challengeCompletions(this.layer, this.id) < 2) ? 
                ` → ×${formatWhole(this.rewardEffect().pow(10))}` : ``
            },
            goal() { return challengeCompletions(this.layer, 32) >= 1 ?
                new Decimal("1e25000") : new Decimal("1e6350")
            },
            fullDisplay() { return `<h5 style="font-size:11px">Quark Generator Multipliers decrease based on time spent in this Big Rip.
                <br><br>Goal: Reach ${format(this.goal())} Quarks
                <br>Reward: Additional 1st Quark Generator multiplier based on your Big Rips
                <br>Currently: ×${format(this.rewardEffect())} ${this.tier2_Reward()}` },
            canComplete() { return player.points.gte(this.goal())},
            completions() { return challengeCompletions(this.layer, this.id) },
            rewardEffect() {
                let power = this.completions() > 1 ? 5 : 1
                return player.m.resets.pow_base(2).root(20).pow(power)
            },
            completionLimit() {
                return challengeCompletions("m", 32) >= 1 ? 2 : 1
            }
        },
        22: {
            name() { return `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Capital Tradeoff ` + `${challengeCompletions("m", 32) >= 1 ? `(${formatWhole(this.completions())} / 2)` : ``}` },
            tier2_Reward() { return (challengeCompletions(this.layer, 32) >= 1 && challengeCompletions(this.layer, this.id) < 2) ? 
                `×${formatWhole(this.rewardEffect().mul(100))} → ×${formatWhole(this.rewardEffect().mul(400))}` : `×${formatWhole(100)} → ×${formatWhole(500)}`
            },
            goal() { return challengeCompletions(this.layer, 32) >= 1 ?
                new Decimal("1e4500") : new Decimal("1e1500")
            },
            fullDisplay() { return `<h5 style="font-size:11px">All Quark Generator purchases are limited to ${formatWhole(1)}. Accelerators provide a significantly higher multiplier.
                <br><br>Goal: Reach ${format(this.goal())} Quarks
                <br>Reward: Phase Shifting provides a larger multiplier to Intensity (${this.tier2_Reward()})` },
            canComplete() { return player.points.gte(this.goal()) },
            completions() { return challengeCompletions(this.layer, this.id) },
            rewardEffect() {
                let tier2 = new Decimal(challengeCompletions(this.layer, this.id)).clampMin(1)

                return challengeCompletions("m", 22) >= 1 ? new Decimal(5).mul(tier2.pow(2)) : new Decimal(1)
            },
            completionLimit() {
                return challengeCompletions("m", 32) >= 1 ? 2 : 1
            }
        },
        23: {
            name() { return `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Vacuum Deceleration ` + `${challengeCompletions("m", 32) >= 1 ? `(${formatWhole(this.completions())} / 2)` : ``}` },
            tier2_Reward() { return (challengeCompletions(this.layer, 32) >= 1) ? 
                `, <i>and Atoms no longer reset anything` : ``
            },
            goal() { return challengeCompletions(this.layer, 32) >= 1 ?
                new Decimal("1e22222") : new Decimal("1e2000")
            },
            fullDisplay() { return `<h5 style="font-size:11px">Phase Shifting is disabled. The Intensity Multiplier becomes ×${formatWhole(1)}.
                <br><br>Goal: Reach ${format(this.goal())} Quarks
                <br>Reward: You can now buy max Atoms${this.tier2_Reward()}` },
            canComplete() { return player.points.gte(this.goal()) },
            completions() { return challengeCompletions(this.layer, this.id) },
            completionLimit() {
                return challengeCompletions("m", 32) >= 1 ? 2 : 1
            },
        },
        31: {
            name() { return `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Residual Annihilation ` + `${challengeCompletions("m", 32) >= 1 ? `(${formatWhole(this.completions())} / 2)` : ``}` },
            tier2_Reward() { return (challengeCompletions(this.layer, 32) >= 1) ? 
                `, <i>and all Interval costs become x^0.95` : ``
            },
            goal() { return challengeCompletions(this.layer, 32) >= 1 ?
                new Decimal("1e50000") : new Decimal("1e10000")
            },
            fullDisplay() { return `<h5 style="font-size:11px">Only the latest purchased Generator produces normally. All other generator production is raised ^0.75. Neither Intensity nor Interval upgrades affect this.
                <br><br>Goal: Reach ${format(this.goal())} Quarks
                <br>Reward: All Quark Generator Intensities become x^1.05${this.tier2_Reward()}` },
            canComplete() { return player.points.gte(this.goal()) },
            completions() { return challengeCompletions(this.layer, this.id) },
            completionLimit() {
                return challengeCompletions("m", 32) >= 1 ? 2 : 1
            }
        },
        32: {
            name: `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Vapid Continuum`,
            fullDisplay() { return `<h5 style="font-size:11px">Quark Generation is raised ^0.4; Purchasing Atoms reduces this penalty.
                <br>Goal: Reach ${format(new Decimal("1e6300"))} Quarks
                <br>Reward: All previous challenges can be completed a second time. Doing so requires a greater amount of Quarks, but improves the reward.` },
            canComplete() { return player.points.gte(new Decimal("1e6300")) }
        },
        33: {
            name: `<h3 style="position: absolute; top: 0px; left: 0px; width: 400px; text-align: center !important;">
            Desolate Desecration`,
            unlocked() { return hasAchievement("ach", 17) },
            fullDisplay() { return `<h5 style="font-size:11px">Atoms are disabled. By default, the first ${formatWhole(6)} Generators are unlocked. Quark generation is severely reduced based on the highest purchased Generator. Phase shifts reduce this nerf, but Intensity upgrades weaken all Generators.
                <br><br>Goal: Reach ${format(new Decimal("1.8e308"))} Quarks
                <br>Reward: Unlock Strange and Charmed matter` },
            canComplete() { return false }
        },
    },

    clickables: {
        101: {
            display() {
                return `
                    <h3>Big rip for ${formatWhole(getResetGain("m"))} ${pluralize("Manifold", getResetGain("m"))}</h3>
                    <br><br><h4>Next At: ${format(getNextAt("m"))} Quarks
                `
            },
            unlocked() { return true },
            canClick() { return player.points.gte("1.8e308") },
            style: {
                "width": "200px",
                "height": "120px",
                "min-width": "200px",
                "min-height": "120px",
            },
            onClick() {
                player.m.points = player.m.points.plus(getResetGain(this.layer))
                if (player.q.atoms.lte(0)) {
                    player.m.ach22_req = true
                }
                if (player.m.ach24_req) player.m.ach24_done = true

                doReset("m", true)
                player.m.ach24_req = true
                player.points = player.q.startingPoints
                player.m.resets = player.m.resets.plus(1)
                player.m.manifoldPower = new Decimal(0)

                for (i = 0; i < 7; i++) {
                    player.m.generators[i].amount = new Decimal(0).clampMin(player.m.generators[i].purchased)
                }
            },
        }
    },
    layerShown() {return true},

    getResetGain() {
        let q = player.q.best
        let mult = tmp.m.values.manifoldMultiplier

        return q.log10().sub(308).div(308).pow_base(2).mul(mult).floor()
    },

    getNextAt() {
        let q = player.q.best
        let mult = tmp.m.values.manifoldMultiplier.clampMin(1)

        return getResetGain("m").plus(1).div(mult).log(2).mul(308).plus(308).pow10().ceil()
    },

    tabFormat: {
        "Upgrades": {
            content: [
                "blank",
                ["clickable", [101]],
                "blank",
                ["buyables", [20]],
                "upgrades",
            ],
            buttonStyle: {
                "margin-top":"15px",
            }
        },
        "Challenges": {
            content: [
                "blank",
                "challenges"
            ],
            buttonStyle: {
                "margin-top":"15px"
            },
        },
    },

    componentStyles: {
        "buyable": {
            "width":"180px",
            "height":"80px",
            "border-radius":"5px",
            "margin-left": "-2px",
            "margin-right": "-2px",
            "margin-bottom": "4px",
        },
        "upgrade": {
            "width": "180px",
            "height": "100px",
            "min-height": "100px",
            "border-radius": "5px",
            "margin": "5px"
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
        "challenge": {
            "width": "400px",
            "height": "180px",
            "border-radius": "5px",
            "padding": "0px",
            "margin": "10px",
        },
    },
})
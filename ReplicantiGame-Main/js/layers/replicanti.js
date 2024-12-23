addLayer("r", {
    name: "replicanti", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1),
        chance: new Decimal(0.01),
        interval: new Decimal(100),
        intervalFactor: new Decimal(1),

        slowdownStrength: new Decimal(1),
        slowdownBase: new Decimal(100),
        factor: new Decimal(2),

        upg1ScaleStart: new Decimal(99),
        upg2ScaleStart: new Decimal(150),

        chanceUpgCostBase: new Decimal(15),

        formatalpha: 0,
        dir: "plus",

        superscaleStart: new Decimal("1e100000")
    }},
    color: "#13b1f0",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Replicanti", // Name of prestige currency
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        let replicanti = player.r.points
        let c = player.r.chance
        player.r.slowdownStrength = new Decimal(1).mul(buyableEffect(this.layer, 22))
        if (inChallenge("challenges", 12)) {
            player.r.superscaleStart = new Decimal("1.8e308")
        } else {
            player.r.superscaleStart = new Decimal("1e100000")
        }

        if (inChallenge("challenges", 12)) {
            player.r.chanceUpgCostBase = new Decimal(1.2)
        } else {
            player.r.chanceUpgCostBase = new Decimal(15)
        }

        if (inChallenge("challenges", 11)) {
            player.r.upg1ScaleStart = new Decimal(1)
            player.r.upg2ScaleStart = new Decimal(1)
        } else if (inChallenge("challenges", 12)) {
            player.r.upg1ScaleStart = new Decimal("eee100")
            player.r.upg2ScaleStart = new Decimal(150)
        } else {
            player.r.upg1ScaleStart = new Decimal(99)
            player.r.upg2ScaleStart = new Decimal(150)
        }

        player.r.slowdownBase = new Decimal(100)

        player.r.factor = new Decimal(2)

        player.r.points = replicanti.plus(replicanti.mul(
            c
            .mul(Decimal.div(1000, player.r.interval))
            .mul(diff)
        ))

        player.r.chance = (new Decimal(0.01) //base
            .mul(getBuyableAmount(this.layer, 11).plus(1))
        )

        player.r.interval = (new Decimal(100) //base
            .mul(Decimal.div(1, player.s.multiplier))
            .mul(Decimal.div(1, player.s.meterEff3))
            .mul(Decimal.div(1, upgradeEffect("t", 12)).min(1))
            .mul(Decimal.div(1, upgradeEffect("t", 21)).min(1))
            .mul(Decimal.div(1, upgradeEffect("t", 33)).min(1))
            .mul(Decimal.div(1, buyableEffect("t", 13)).min(1))
            .mul(Decimal.div(1, player.t.tetracantiMult))

            .mul(Decimal.pow(player.r.intervalFactor,
                    getBuyableAmount(this.layer, 12)
                )
            )
        )

        if (!hasUpgrade("t", 24)) {
            player.r.interval = player.r.interval
                .mul(Decimal.max(Decimal.log10(replicanti).mul(player.r.slowdownStrength), 1)) //pre-infinity slowdown
        } else {
            if (player.r.points.gte("1.8e308")) {
                player.r.interval = player.r.interval
                    .mul(Decimal.max(Decimal.log10(replicanti.div("1.8e308")).mul(player.r.slowdownStrength), 1))
                // pre-infinity slowdown, but after infinity (pushed to e308 with tesseract upgrade 24)
            }
        }

        if (!inChallenge("challenges", 12)) {
            player.r.factor = new Decimal(2).plus(
                Decimal.log10(replicanti).sub(player.r.superscaleStart.log10()).div(1000)
            ).max(2)
        } else {
            player.r.factor = new Decimal(2).pow_base(
                Decimal.log10(replicanti).sub(player.r.superscaleStart.log10()).div(10)
            ).max(2)
        }
        

        if (player.r.points.gte("1.8e308")) {
            player.r.interval = player.r.interval.mul(100).mul(Decimal.pow(player.r.factor, Decimal.log10(replicanti).div(100)))
            //post infinity slowdown (*100 and then *2 per e308)

        }

        player.r.intervalFactor = new Decimal(0.9)
        if (hasUpgrade("t", 14)) player.r.intervalFactor = player.r.intervalFactor.sub(0.05)
        
        player.r.intervalFactor = player.r.intervalFactor.mul(player.t.galaxyEffect)

        if (player.r.points.gte(player.r.best)) player.r.best = player.r.points

        if (player.r.formatalpha <= 0) player.r.dir = "plus"
        if (player.r.formatalpha >= 1) player.r.dir = "minus"
        if (player.r.dir == "plus") player.r.formatalpha += 0.05
        if (player.r.dir == "minus") player.r.formatalpha -= 0.02
        
    },
    buyables: {
        11: {
            cost(x) {
                s = player.r.upg1ScaleStart
                if (x.gte(s)) x = x.sub(s).pow(1.25).plus(s)
                return new Decimal(100).mul(x.pow_base(player.r.chanceUpgCostBase))
            },
            display() { 
                return `<h3>Replicanti Chance: ${formatWhole(player.r.chance.mul(100))}%
                \n+1% Costs: ${formatWhole(this.cost())} Replicanti</h3>`
            },
            canAfford() { return (player.r.points.gte(this.cost()) && !inChallenge("challenges", 13)) },
            buy() {
                if (!hasChallenge("challenges", 11)) player.r.points = player.r.points.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
            purchaseLimit() { return hasUpgrade("t", 42) ? new Decimal("1e1000000") : new Decimal(99) },
            buyMax() {
                player.r.upg1ScaleStart
                x = player.r.points
                if (!inChallenge("challenges", 12)) {
                    amt1 = Decimal.ln(x.div(100)).div(Decimal.ln(player.r.chanceUpgCostBase)).min(s).ceil()
                    amt2 = (Decimal.ln(x.div(100)).div(Decimal.ln(player.r.chanceUpgCostBase)).sub(s)).root(1.25).ceil()
                } else {
                    amt1 = Decimal.ln(x.div(100)).div(Decimal.ln(player.r.chanceUpgCostBase)).ceil()
                    amt2 = new Decimal(0)
                }
                setBuyableAmount(this.layer, this.id, amt1.plus(amt2))
            },
            style: {
                "margin-bottom": "10px"
            },
        },
        12: {
            cost(x) {
                s = player.r.upg2ScaleStart
                if (x.gt(s)) x = x.sub(s).pow(2).plus(s)
                return new Decimal(100).mul(Decimal.pow(10, x))
            },
            display() { 
                return `<h3>Replicanti Interval: ${formatTime(player.r.interval)}
                \n→ ${formatTime(player.r.interval.mul(player.r.intervalFactor))} Costs: ${formatWhole(this.cost())} Replicanti</h3>`
            },
            canAfford() { return (player.r.points.gte(this.cost()) && !inChallenge("challenges", 13))},
            buy() {
                if (!hasChallenge("challenges", 11)) player.r.points = player.r.points.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
            buyMax() {
                s = player.r.upg2ScaleStart
                x = player.r.points
                amt1 = Decimal.ln(x.div(100)).div(Decimal.ln(10)).min(s).ceil()
                amt2 = (Decimal.ln(x.div(100)).div(Decimal.ln(10)).sub(s)).root(2).ceil()
                setBuyableAmount(this.layer, this.id, amt1.plus(amt2))
            },
            style: {
                "margin-bottom": "10px"
            },
        },
        13: {
            cost() {return new Decimal("1.78e308")},
            display() {
                if (inChallenge("challenges", 11)) {
                    return `<h3>Replicanti Shards
                    \nLocked (Predicate Diminution)`
                }
                return `<h3>Replicanti Shards
                \nReset Replicanti and Upgrades to gain <b>${format(getResetGain("s"))}</b> Shards
                Next at: ${format(getNextAt("s"))}
                `
            },
            canAfford() { return canReset("s") },
            buy() {
                let upg = [
                    getBuyableAmount("r", 11),
                    getBuyableAmount("r", 12)
                ]
                doReset("s")
                if (hasUpgrade("t", 32)) {
                    setBuyableAmount("r", 11, upg[0])
                    setBuyableAmount("r", 12, upg[1])
                }
            },
            style: {
                "margin-bottom": "10px"
            },
        },

        21: {
            cost(x) { 
                x = player.s.shardUpg1
                return Decimal.pow(5, x)
            },
            display() {
                let purchaseCap = new Decimal(5)
                if (hasUpgrade("t", 34)) purchaseCap = new Decimal(50)
                upg = player.s.shardUpg1
                if (upg.lt(purchaseCap)) {
                    return `Increase the exponent to Replicanti Shard gain
                    \n${format(player.s.gainExponent)} → ${format(player.s.gainExponent.plus(0.05))} Costs: ${formatWhole(this.cost())} Replicanti ${pluralize(this.cost(), "Shard")}`
                } else return `Increase the exponent to Replicanti Shard gain
                \nCAPPED: ×${format(player.s.gainExponent)}`
            },
            style: {
                "border-color": "#5739c4",
                "width": "200px",
                "height": "100px",
            },
            effect() {
                return player.s.shardUpg1.mul(0.05)
            },
            canAfford() {
                let purchaseCap = new Decimal(5)
                if (hasUpgrade("t", 34)) purchaseCap = new Decimal(50)
                return (player.s.points.gte(this.cost()) && player.s.shardUpg1.lt(purchaseCap)) && !inChallenge("challenges", 13)
            },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                player.s.shardUpg1 = player.s.shardUpg1.plus(1)
            },
        },
        22: {
            cost(x) { 
                x = player.s.shardUpg2
                return Decimal.pow(5, x)
            },
            display() {
                upg = player.s.shardUpg2
                if (player.s.shardUpg2.lte(3)) {
                    return `Reduce the Replicanti slowdown effect
                    \n×${format(player.r.slowdownStrength)} → ×${format(player.r.slowdownStrength.mul(0.6))} Costs: ${formatWhole(this.cost())} Replicanti ${pluralize(this.cost(), "Shard")}`
                } else if (player.s.shardUpg2.eq(4)) {
                    return `Reduce the Replicanti slowdown effect
                    \n×${format(player.r.slowdownStrength)} → ${format(new Decimal(0.1))} Costs: ${formatWhole(this.cost())} Replicanti ${pluralize(this.cost()), "Shard"}`
                } else {
                    return `Reduce the Replicanti slowdown effect
                    \nCAPPED: ×${format(new Decimal(0.1))}`
                }
            },
            style: {
                "border-color": "#5739c4",
                "width": "200px",
                "height": "100px",
            },
            effect() {
                if (player.s.shardUpg2.lte(4)) { return Decimal.pow(0.6, player.s.shardUpg2) }
                else { return new Decimal(0.1) }
            },
            canAfford() {
                return (player.s.points.gte(this.cost()) && player.s.shardUpg2.lt(5)) && !inChallenge("challenges", 13)
            },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                player.s.shardUpg2 = player.s.shardUpg2.plus(1)
            },
        },

        /* TETRACANTI BUYABLES */

        101: {
            cost(x) {
                x = player.t.tetrUpg1
                return Decimal.pow(10, x).mul(10000000)
            },
            display() {
                let upg = player.t.tetrUpg1
                return `<h3>Tetracanti Factor: ×${format(player.t.tetracantiBase)}
                <br>→ ×${format(player.t.tetracantiBase.mul(1.2))} Costs: ${format(this.cost())} Tesseracts`
            },
            style: {
                "border-color": "#fdff78",
            },
            effect() {
                return Decimal.pow(1.2, player.t.tetrUpg1)
            },
            canAfford() {
                return player.t.points.gte(this.cost())
            },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                player.t.tetrUpg1 = player.t.tetrUpg1.plus(1)
            }
        },
        102: {
            cost(x) {
                x = player.t.tetrUpg2
                return Decimal.pow(10, x).mul(1000000)
            },
            display() {
                let upg = player.t.tetrUpg2
                return `<h3>Tetracanti Interval: ${formatTime(player.t.tetracantiInterval)}
                <br>→ ${formatTime(player.t.tetracantiInterval.mul(0.9))} Costs: ${format(this.cost())} Tesseracts`
            },
            style: {
                "border-color": "#fdff78",
            },
            effect() {
                Decimal.pow(1.2, player.t.tetrUpg1)
            },
            canAfford() {
                return player.t.points.gte(this.cost())
            },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                player.t.tetrUpg2 = player.t.tetrUpg2.plus(1)
            }
        },
        103: {
            cost(x) {
                x = player.t.tetrUpg3
                return Decimal.pow(Decimal.pow(2, x), x).mul(1000000)
            },
            display() {
                let upg = player.t.tetrUpg3
                return `<h3>Max Tetracanti Power: ^${format(player.t.tetracantiPower)}
                <br>→ ^${format(Decimal.mul(0.025, player.t.tetrUpg3.plus(1).pow(2).plus(player.t.tetrUpg3.plus(1))).plus(0.5))} Costs: ${format(this.cost())} Tesseracts`
            },
            style: {
                "border-color": "#fdff78",
            },
            effect() {
                return Decimal.mul(0.025, player.t.tetrUpg3.pow(2).plus(player.t.tetrUpg3))
            },
            canAfford() {
                return player.t.points.gte(this.cost())
            },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                player.t.tetrUpg3 = player.t.tetrUpg3.plus(1)
            }
        },
        104: {
            cost(x) {
                x = player.t.tetrUpg4
                return Decimal.pow(1.5, x.pow(2).plus(x)).mul(10000000)
            },
            display() {
                let upg = player.t.tetrUpg4
                return `<h3>Max Tetracanti Galaxies: ${formatWhole(player.t.tetraGalCap)}
                <br> +1 Costs: ${format(this.cost())} Tesseracts`
            },
            style: {
                "border-color": "#fdff78",
            },
            effect() {
                Decimal.pow(1.2, player.t.tetrUpg1)
            },
            canAfford() {
                return player.t.points.gte(this.cost())
            },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                player.t.tetrUpg4 = player.t.tetrUpg4.plus(1)
            }
        },
    },
    bars: {
        shardMilestone: {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return Decimal.div(player.s.shardMeter.max(1).log10(), Decimal.log10(player.s.shardMeterCap)) },
            display() { return `<h4 style="font-size:20px; text-shadow:2px 2px #000000">${format(this.progress().mul(100))}%</h4>`},
            fillStyle: {
                "background-color": "#5739c4"
            },
        }
    },
    clickables: {
        11: {
            display() { return player.s.isFillingShards ? `<h2>Filling...</h2>` : `<h2>Drain</h2>` },
            canClick() { return true },
            onClick() { player.s.isFillingShards = !player.s.isFillingShards },
            style: {
                "background": "#0f0f0f",
                "border-color": "#5739c4",
                "color": "#FFFFFF",
                "margin": "20px 0px 20px 0px",
                "border-radius": "5px",
                "height": "30px",
                "width": "100px"
            }
        },
        101: {
            display() {
                if (player.t.tetracanti.gte("1.8e308") && player.t.tetraGalaxy.lt(player.t.tetraGalCap)) {
                    return `<h2>Reset your Tetracanti for a Tetracanti Galaxy
                    <br>Currently: ${formatWhole(player.t.tetraGalaxy)}`
                } else if (player.t.tetraGalaxy.eq(player.t.tetraGalCap)) {
                    return `<h2>Maximum Tetracanti Galaxies reached
                    <br>Currently: ${formatWhole(player.t.tetraGalaxy)}`
                } else {
                    return `<h2>Reach ${formatWhole(new Decimal("1.80e308"))} Replicanti to gain a Tetracanti Galaxy
                    <br>Currently: ${formatWhole(player.t.tetraGalaxy)}`
                }
            },
            canClick() {
                return (player.t.tetracanti.gte("1.8e308") && player.t.tetraGalaxy.lt(player.t.tetraGalCap))
            },
            onClick() {
                player.t.tetracanti = new Decimal(1)
                player.t.tetraGalaxy = player.t.tetraGalaxy.plus(1)
            },
            style: {
                "border-color": "#fdff78 !important",
                "height": "75px !important",
                "width": "300px !important",
                "background": "#0f0f0f",
                "color": "#FFFFFF",
                "margin": "20px 0px 20px 0px",
                "border-radius": "5px",
            },
        },
        201: {
            display() {
                return `Buy Max`
            },
            canClick() {
                return hasChallenge("challenges", 11)
            },
            onClick() {
                buyMaxBuyable("r", 11)
            },
            unlocked() {
                return hasChallenge("challenges", 11)
            },
            style: {
                "border-color": "#FEFEFE !important",
                "height": "30px !important",
                "width": "240px !important",
                "background": "#0f0f0f",
                "color": "#FFFFFF",
                "margin": "0px 0px 0px 0px",
                "border-radius": "5px",
            },
        },
        202: {
            display() {
                return `Buy Max`
            },
            canClick() {
                return hasChallenge("challenges", 11)
            },
            onClick() {
                buyMaxBuyable("r", 12)
            },
            unlocked() {
                return hasChallenge("challenges", 11)
            },
            style: {
                "border-color": "#FEFEFE !important",
                "height": "30px !important",
                "width": "240px !important",
                "background": "#0f0f0f",
                "color": "#FFFFFF",
                "margin": "0px 255px 0px 0px",
                "border-radius": "5px",
            },
        },
    },
    tabFormat: {
        "Replicanti": {
            content: [
                ["blank", "100px"],
                ["display-text", "Replicanti upgrades, unlike other upgrades, divide your Replicanti amount instead of subtracting from it."],
                ["display-text", "Replication speed is decreased the more Replicanti you have. The slowdown is increased beyond 1.8e308, and becomes super-exponential beyond 1e100,000."],
                ["buyables", [1]],
                ["clickables", [20]],
                ["blank", "100px"],
                ["display-text",
                    function() {
                        let amt = new Decimal(1)
                        let phrase = ""
                        let punct = ""
                        hasUpgrade("t", 11) ? amt = player.s.total : amt = player.s.best
                        hasUpgrade("t", 11) ? phrase = "total" : phrase = "best"
                        hasUpgrade("t", 31) ? punct = "," : punct = "."
                        return `Your ${phrase} Replicanti Shard amount is <h1 style="color:#5739c4; font-size:30px">${formatWhole(amt)}</h1>, which is translated to a <h1 style="color:#5739c4; font-size:30px">×${format(player.s.multiplier)}</h1> multiplier to Replication speed${punct}`
                    }
                ],
                ["display-text",
                    function() {
                        return hasUpgrade("t", 31) ? `and a <h1 style="color:#5739c4; font-size:30px">×${format(player.s.rsMultiplier)}</h1> multiplier to Replicanti Shard gain.` : null
                    }
                ],
                ["blank", "50px"],
                ["buyables", [2]],
                ["shard-column",
                    [
                        "blank",
                        ["display-text",
                            "<h2>Replicanti Interstice</h2>"
                        ],
                        ["display-text",
                            function() { return `<h5>Drain your Replicanti Shards to fill.</h5>` }
                        ],
                        "blank",
                        ["bar", ["shardMilestone"]],
                        ["clickable", [11]],
                        ["display-text",
                            function() { return `Total filled: ${formatWhole(Decimal.min(player.s.shardMeter, player.s.shardMeterCap))} / ${formatWhole(player.s.shardMeterCap)}
                            <br><br>×${format(player.s.meterEff1)} Replicanti Shards<br>×${format(player.s.meterEff2)} Fill speed` }
                        ],
                        ["display-text",
                            function() { return hasUpgrade("t", 13) ? `×${format(player.s.meterEff3)} Replicanti Speed` : null }
                        ],
                        ["display-text",
                            function() { return (hasUpgrade("t", 41) && player.s.shardMeter.gte(50000)) ? `^${format(player.s.meterEff4)} RS Boost` : null }
                        ],
                        "blank",
                    ],
                ],
            ],
            buttonStyle: {
                "border-color": "#FFFFFF",
                "color": "#FFFFFF",
                "margin-top": "20px"
            },
        },
        "Tetracanti": {
            content: [
                ["blank", "50px"],
                ["display-text",
                    function() {
                        return `You have <h1 style="color:#fdff78; text-shadow:rgba(253, 255, 120, ${player.r.formatalpha}) 1px 0 10px; font-size:45px">${formatWhole(player.t.tetracanti)}</h1> Tetracanti,<br>
                        translated log10(x)<h2 style="color:#fdff78; text-shadow:rgba(253, 255, 120, ${player.r.formatalpha}) 1px 0 10px; font-size:20px">^${format(player.t.tetracantiPower)}</h2> to a <h2 style="color:#fdff78; text-shadow:rgba(253, 255, 120, ${player.r.formatalpha}) 1px 0 10px; font-size:20px">×${format(player.t.tetracantiMult)}</h2> boost to Replicanti Speed.`
                    }
                ],
                ["blank", "50px"],
                ["display-text",
                    function() {
                        return `Tetracanti do not slow down the more you have. However, they are capped at 1.8e308.<br>
                        You can gain a Tetracanti Galaxy at 1.8e308 Tetracanti, which boosts the power of the Replicanti Interval upgrade.`
                    }
                ],
                ["blank", "20px"],
                ["buyables", [10]],
                ["blank", "20px"],
                ["clickables", [10]],
            ],
            buttonStyle: {
                "border-color": "#FFFFFF",
                "color": "#FFFFFF",
                "margin-top": "20px"
            },
            unlocked() {
                return hasUpgrade("t", 44)
            },
        }
    },
    componentStyles: {
        "buyable"() {return {
            "background": "#0f0f0f",
            "border-color": "#1bbb36",
            "color": "#FFFFFF",
            "margin": "20px 0px 20px 0px",
            "border-radius": "5px",
            "height": "75px",
            "width": "240px"
        }},
        "shard-column"() {return {
            "border": "solid",
            "border-radius": "5px",
            "width": "700px",
        }},
    }
})

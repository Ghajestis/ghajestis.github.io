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
            .mul(Decimal.div(1, upgradeEffect("t", 12)).max(1))
            .mul(Decimal.div(1, upgradeEffect("t", 21)).max(1))
            .mul(Decimal.div(1, upgradeEffect("t", 33)).max(1))

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

        if (player.r.points.gte("1.8e308")) {
            player.r.interval = player.r.interval.mul(100).mul(Decimal.pow(player.r.factor, Decimal.log10(replicanti).div(100)))
            //post infinity slowdown (*100 and then *2 per e308)

        }

        player.r.intervalFactor = new Decimal(0.9)
        if (hasUpgrade("t", 14)) player.r.intervalFactor = player.r.intervalFactor.sub(0.05)
    },
    buyables: {
        11: {
            cost(x) {
                if (x.gte(99)) x = x.sub(99).pow(1.25).plus(99)
                return new Decimal(100).mul(Decimal.pow(15, x))
            },
            display() { 
                return `<h3>Replicanti Chance: ${formatWhole(player.r.chance.mul(100))}%
                \n+1% Costs: ${formatWhole(this.cost())} Replicanti</h3>`
            },
            canAfford() { return player.r.points.gte(this.cost())},
            buy() {
                player.r.points = player.r.points.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
            purchaseLimit() { return hasUpgrade("t", 42) ? new Decimal("1e1000000") : new Decimal(99) }
        },
        12: {
            cost(x) {
                if (x.gt(150)) x = x.sub(150).pow(2).plus(150)
                return new Decimal(100).mul(Decimal.pow(10, x))
            },
            display() { 
                return `<h3>Replicanti Interval: ${formatTime(player.r.interval)}
                \n→ ${formatTime(player.r.interval.mul(player.r.intervalFactor))} Costs: ${formatWhole(this.cost())} Replicanti</h3>`
            },
            canAfford() { return player.r.points.gte(this.cost())},
            buy() {
                player.r.points = player.r.points.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        13: {
            cost() {return new Decimal("1.78e308")},
            display() {
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
                \nCAPPED: ×${format(new Decimal(this.effect()))}`
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
                return (player.s.points.gte(this.cost()) && player.s.shardUpg1.lt(purchaseCap))
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
                return (player.s.points.gte(this.cost()) && player.s.shardUpg2.lt(5))
            },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                player.s.shardUpg2 = player.s.shardUpg2.plus(1)
            },
        }
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
        }
    },
    tabFormat: [
        ["blank", "100px"],
        ["display-text", "Replicanti upgrades, unlike other upgrades, divide your Replicanti amount instead of subtracting from it."],
        ["display-text", "Replication speed is decreased the more Replicanti you have. The slowdown is increased beyond 1.8e308, and becomes super-exponential beyond 1e100,000.<br>Note to self to write an info tab at some point"],
        ["buyables", [1]],
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
                "clickables",
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
            ]
        ]
    ],
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
        "clickable"() { return {
            "background": "#0f0f0f",
            "border-color": "#5739c4",
            "color": "#FFFFFF",
            "margin": "20px 0px 20px 0px",
            "border-radius": "5px",
            "height": "30px",
            "width": "100px"
        }}
    }
})

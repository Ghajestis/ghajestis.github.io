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

        player.r.chance = (new Decimal(0.01) //base
            .mul(getBuyableAmount(this.layer, 11).plus(1))
        )

        player.r.interval = (new Decimal(100) //base
            .mul(Decimal.div(1, player.s.multiplier))
            .mul(Decimal.div(1, player.s.meterEff3))
            .mul(Decimal.div(1, upgradeEffect("t", 12)).min(1))
            .mul(Decimal.div(1, upgradeEffect("t", 13)).min(1))
            .mul(Decimal.div(1, upgradeEffect("t", 21)).min(1))
            .mul(Decimal.div(1, upgradeEffect("t", 33)).min(1))

            .mul(Decimal.pow(player.r.intervalFactor,
                    getBuyableAmount(this.layer, 12)
                )
            )
        )

        if (player.s.amplifier.timeLeft > 0) player.r.interval = player.r.interval.div(player.s.amplifier.mult)

        if (player.r.points.gte("1.8e308")) {
            player.r.interval = player.r.interval.mul(100).mul(Decimal.pow(player.r.factor, Decimal.log10(replicanti).div(308)))
            //post infinity slowdown (*100 and then *2 per e308)

        } else {
            player.r.interval = player.r.interval.div(upgradeEffect("t", 24))
        }

        player.r.intervalFactor = new Decimal(0.9)
        if (hasUpgrade("t", 14)) player.r.intervalFactor = player.r.intervalFactor.sub(0.05)

        let interval = player.r.interval

        player.r.points = replicanti.plus(
            replicanti.mul(Decimal.div(1000, interval).mul(c)).mul(diff)
        )
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
                if (x.gt(100)) x = x.sub(100).pow(2).plus(100)
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
                player.s.amplifier.timeLeft = player.s.amplifier.duration
            },
        },

        21: {
            cost(x) { 
                x = player.s.shardUpg1
                return Decimal.pow(2, x).mul(10)
            },
            display() {
                let purchaseCap = new Decimal(100)
                if (hasUpgrade("t", 34)) purchaseCap = new Decimal(5000)
                upg = player.s.shardUpg1
                if (upg.lt(purchaseCap)) {
                    return `Increase the strength of the Replicanti Amplifier
                    \n${format(player.s.amplifier.mult)} → ${format(player.s.amplifier.mult.mul(1.5))} Costs: ${formatWhole(this.cost())} Replicanti ${pluralize(this.cost(), "Shard")}`
                } else return `Increase the strength of the Replicanti Amplifier
                \nCAPPED: ×${format(new Decimal(this.effect()))}`
            },
            style: {
                "border-color": "#5739c4",
                "width": "200px",
                "height": "100px",
            },
            effect() {
                return Decimal.pow(1.5, player.s.shardUpg1)
            },
            canAfford() {
                let purchaseCap = new Decimal(100)
                if (hasUpgrade("t", 34)) purchaseCap = new Decimal(5000)
                return (player.s.points.gte(this.cost()) && player.s.shardUpg1.lt(purchaseCap))
            },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                player.s.shardUpg1 = player.s.shardUpg1.plus(1)
            },
        },
        22: {
            cost(x, _c) { 
                x = player.s.shardUpg2
                if (_c) x = _c
                return Decimal.pow(2, x).mul(10)
            },
            effectAt(x) {
                return Decimal.pow(1.35, x)
            },
            display() {
                upg = player.s.shardUpg2
                return upg.lt(5)
                ? `The Replicanti Amplifier runs 35% longer
                \n${format(player.s.amplifier.duration)} → ${format((player.s._durationWithoutBonuses * 1.35) + player.s._additiveBonuses)} Costs: ${formatWhole(this.cost())} Replicanti ${pluralize(this.cost(), "Shard")}` :
                `The Replicanti Amplifier runs 35% longer
                \nCAPPED: ${format(player.s.amplifier.duration)}`
            },
            style: {
                "border-color": "#5739c4",
                "width": "200px",
                "height": "100px",
            },
            effect() {
                return Decimal.pow(1.35, player.s.shardUpg2)
            },
            canAfford() {
                return (player.s.points.gte(this.cost()) && player.s.shardUpg2.lt(5))
            },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                player.s.shardUpg2 = player.s.shardUpg2.plus(1)
            },
        },
        23: {
            cost(x) {
                x = player.s.shardUpg3
                return Decimal.pow(1.5, x).mul(10).floor()
            },
            display() {
                logval = new Decimal(10).sub(upgradeEffect("t", 11))
                upg = player.s.shardUpg3
                return `Improve the Replicanti Shard Multiplier formula
                log${format(logval)}(x^${format(player.s.mulFormulaPow)}) → log${format(logval)}(x^${format(player.s.mulFormulaPow.plus(new Decimal(1).plus(upgradeEffect("t", 22))))}) Costs: ${formatWhole(this.cost())} Replicanti Shards`
            },
            style: {
                "border-color": "#5739c4",
                "width": "200px",
                "height": "100px",
            },
            effect() {
                return Decimal.mul(new Decimal(1).plus(upgradeEffect("t", 22)), player.s.shardUpg3)
            },
            canAfford() {
                return (player.s.points.gte(this.cost()))
            },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                player.s.shardUpg3 = player.s.shardUpg3.plus(1)
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
        },
        amplifierDuration: {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return player.s.amplifier.timeLeft / player.s.amplifier.duration }, 
            display() { return `<h4 style="font-size:20px; text-shadow:2px 2px #000000"> Time Remaining: ${formatTime(new Decimal(player.s.amplifier.timeLeft * 1000))}</h4>` }
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
        ["display-text", "Replicanti Shards are gained based on the exponent of your Replicanti. They are a limited resource, meaning your current RS amount is subtracted from your gain."],
        ["display-text", "Replication speed is decreased above 1.8e308, based on your Replicanti amount. Check Info tab for more details."],
        ["buyables", [1]],
        ["blank", "100px"],
        ["display-text",
            function() {
                let amt = new Decimal(1)
                let phrase = "best"
                let punct = ""
                hasUpgrade("t", 11) ? amt = player.s.max : amt = player.s.max
                hasUpgrade("t", 31) ? punct = "," : punct = "."
                return `Your ${phrase} Replicanti Shard amount is <h1 style="color:#5739c4; font-size:30px">${formatWhole(amt)}</h1>, which is translated to a <h1 style="color:#5739c4; font-size:30px">×${format(player.s.multiplier)}</h1> multiplier to Replication speed${punct}`
            }
        ],
        ["display-text",
            function() {
                let txt = ``
                hasUpgrade("t", 31) 
                ? txt = `and a <h1 style="color:#5739c4; font-size:30px">×${format(player.s.rsMultiplier)}</h1> multiplier to Replicanti Shard gain.` : txt = ``
                return `${txt}`
            }
        ],
        ["blank", "50px"],
        ["shard-column",
            [
                "blank",
                ["display-text",
                    "<h2>Replicanti Amplifier</h2>"
                ],
                ["display-text",
                    function() { return `<h5>Replicanti is Amplified for a short duration after a Shard reset.</h5>` }
                ],
                "blank",
                ["bar", ["amplifierDuration"]],
                "blank",
                ["display-text",
                    function() { return `<h5>The Replicanti Amplifier will run for ${formatTime(new Decimal(player.s.amplifier.duration * 1000))} upon activation.</h5>
                    <h5>During this time, Replication speed will be multiplied by ×${format(player.s.amplifier.mult)}.</h5>`}
                ],
                "blank",
                ["buyables", [2]],
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

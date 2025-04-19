addLayer("t", {
    name: "tesseracts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        tesseractMult: new Decimal(1),
        bestTime: 1000000000000000000000000000000,
        resets: new Decimal(0)
    }},
    color: "#daa625",
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "Tesseract", // Name of prestige currency
    row: 2, // Row the layer is in on the tree (0 is the first row)
    baseAmount() {
        return player.r.points
    },
    type: "custom",
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        player.t.bestTime = player.t.bestTime
        player.t.tesseractMult = new Decimal(1)
            .mul(buyableEffect("t", 11))
    },
    buyables: {
        11: {
            cost(x) {
                return new Decimal(10).pow(x).mul(10)
            },
            display() {
                return `Double Tesseract gain
                \nCurrently: ×${format(this.effect())}
                Costs: ${format(this.cost())} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(this.cost())
            },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        12: {
            cost(x) {
                return new Decimal(5).pow(x).mul(10)
            },
            display() {
                return `Double Replicanti Shard gain
                \nCurrently: ×${format(this.effect())}
                Costs: ${format(this.cost())} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(this.cost())
            },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            },
        },
    },
    clickables: {
        101: {
            display() {
                if (this.canClick()) {
                    return `<h2>Condense your Replicanti into ${formatWhole(getResetGain("t"))} ${pluralize(getResetGain("t"), "Tesseract")}<h2>
                    \nNext at: ${format(getNextAt("t"))}`
                } else {
                    return `<h2>Reach ${formatWhole(new Decimal("1e2000"))} Replicanti to gain Tesseracts</h2>`
                }
            },
            canClick() {
                return canReset("t")
            },
            onClick() {
                if (player.t.resetTime < player.t.bestTime ) player.t.bestTime = player.t.resetTime
                player.t.resets = player.t.resets.plus(1)
                doReset("t")
                layerDataReset("s")
            },
            style: {
                "height":"100px !important",
                "width":"240px !important",
                "horizontal-align":"center",
            },
        }
    },

    upgrades: {
        11: {
            fullDisplay() {
                return `Replicanti Shard boost is improved based on Tesseract resets
                <br>Currently: log10 → log${format(new Decimal(10).sub(this.effect()))}
                <br><br>Costs: 1 Tesseract`
            },
            canAfford() {
                return player.t.points.gte(1)
            },
            pay() {
                player.t.points = player.t.points.sub(1)
            },
            effect() {
                return player.t.resets.plus(1).log10()
            },
        },
        12: {
            fullDisplay() {
                return `Replicanti Speed is faster based on their amount
                <br>Currently: ×${format(this.effect())}
                <br><br>Costs: 1 Tesseract`
            },
            canAfford() {
                return player.t.points.gte(1)
            },
            pay() {
                player.t.points = player.t.points.sub(1)
            },
            effect() {
                return player.r.points.log10().div(10).pow(0.35).max(1.2)
            },
        },
        13: {
            fullDisplay() {
                return `Replicanti Speed is increased based on time spent in this Tesseract
                <br>Currently: ×${format(this.effect())}
                <br><br>Costs: 2 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(2)
            },
            pay() {
                player.t.points = player.t.points.sub(2)
            },
            effect() {
                let base = Math.max((player.t.resetTime / 60) ** 0.5, 1)
                return new Decimal(base).mul(upgradeEffect("t", 33))
            },
        },
        14: {
            fullDisplay() {
                return `The Replicanti Interval upgrade is stronger (×0.9 → ×0.85)
                <br><br>Costs: 5 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(5)
            },
            pay() {
                player.t.points = player.t.points.sub(5)
            },
            effect() {

            },
        },

        21: {
            fullDisplay() {
                return `Replicanti Speed is faster based on your unspent Tesseracts
                <br>Currently: ×${format(this.effect())}
                <br><br>Costs: 15 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(15)
            },
            pay() {
                player.t.points = player.t.points.sub(15)
            },
            effect() {
                return Decimal.log10(player.t.points.plus(1).pow(5)).max(1)
            },
        },
        22: {
            fullDisplay() {
                return `The Replicanti Shard Formula upgrade is more effective based on Replicanti Chance
                <br>Currently: +${format(this.effect())}
                <br><br>Costs: 15 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(15)
            },
            pay() {
                player.t.points = player.t.points.sub(15)
            },
            effect() {
                return player.r.chance.div(2)
            },
        },
        23: {
            fullDisplay() {
                return `The Replicanti Amplifier runs longer based on your unspent Tesseracts
                <br>Currently: +${formatWhole(this.effect())} seconds
                <br><br>Costs: 30 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(30)
            },
            pay() {
                player.t.points = player.t.points.sub(30)
            },
            effect() {
                return player.t.points.max(1).log10().plus(1).pow_base(2).floor()
            },
        },
        24: {
            fullDisplay() {
                return `Replicanti are ×5 faster below 1.8e308
                <br><br>Costs: 75 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(75)
            },
            pay() {
                player.t.points = player.t.points.sub(75)
            },
            effect() {
                return new Decimal(5)
            },
        },

        31: {
            fullDisplay() {
                return `The RS boost also increases your Replicanti Shard gain
                <br><br>Costs: 250 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(250)
            },
            pay() {
                player.t.points = player.t.points.sub(250)
            },
            effect() {

            },
        },
        32: {
            fullDisplay() {
                return `Shard resets no longer reset your Replicanti Upgrades
                <br><br>Costs: 250 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(250)
            },
            pay() {
                player.t.points = player.t.points.sub(250)
            },
            effect() {

            },
        },
        33: {
            fullDisplay() {
                return `Upgrade 13 is stronger based on unspent Tesseracts and Tesseract Resets
                <br>Currently: ×${format(this.effect())}
                <br><br>Costs: 500 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(500)
            },
            pay() {
                player.t.points = player.t.points.sub(500)
            },
            effect() {
                let resets = player.t.resets.max(1)
                let t = player.t.points.max(1)
                return Decimal.log10(t.pow(resets.pow(0.5))).max(1)
                //oddly specific power? why not!
            },
        },
        34: {
            fullDisplay() {
                return `The Replicanti Amplifier is stronger depending on how much time is left.
                <br>Currently: ×${format(this.effect())}
                <br><br>Costs: 1250 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(1250)
            },
            pay() {
                player.t.points = player.t.points.sub(1250)
            },
            effect() {
                return new Decimal(player.s.amplifier.timeLeft / 2).max(1)
            },
        },

        41: {
            fullDisplay() {
                return `The Replicanti Interstice gains a new effect at 50,000 filled
                <br><br>Costs: ${formatWhole(2000)} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(2000)
            },
            pay() {
                player.t.points = player.t.points.sub(2000)
            },
            effect() {

            },
        },
        42: {
            fullDisplay() {
                return `Replicanti Chance can go above 100%, but the cost scales faster beyond that point
                <br><br>Costs: ${formatWhole(2000)} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(2000)
            },
            pay() {
                player.t.points = player.t.points.sub(2000)
            },
            effect() {

            },
        },
        43: {
            fullDisplay() {
                return `Replicanti Speed is faster based on your fastest Tesseract run
                <br>Currently: ×${format(this.effect())}
                <br><br>Costs: ${formatWhole(4000)} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(4000)
            },
            pay() {
                player.t.points = player.t.points.sub(4000)
            },
            effect() {
                let x = player.t.bestTime
                return new Decimal(((120 / x) ** 0.25) * 2).max(1)
            },
        },
        44: {
            fullDisplay() {
                return `Unlock Tetracanti <br>(Requires all other upgrades purchased)
                <br>(NYI)
                <br><br>Costs: ${formatWhole(10000)}`
            },
            canAfford() {
                return false
                //return player.t.points.gte(500000)
            },
            pay() {
                player.t.points = player.t.points.sub(10000)
            },
        },
    },

    getResetGain() {
        let mult = new Decimal(1) //global multipliers, condensed into a variable 
            //nothing here yet
        //old formula below
        //return Decimal.max(player.r.points.div(1.78e307), 1).log10().pow(0.25).mul(player.t.tesseractMult).floor()
        return player.r.points.log10().div(2000).max(1).pow_base(3).pow(0.5).mul(player.t.tesseractMult).floor()
    },

    getNextAt() {
        return getResetGain("t").plus(1).ceil().div(player.t.tesseractMult).root(0.5).log(3).mul(2000).pow10()
    },

    canReset() {
        return (getResetGain("t").gte(1) && player.r.points.gte("1e2000"))
    },

    tabFormat: [
        ["blank", "20px"],
        ["clickables", [10]],
        ["blank", "75px"],
        ["h-line", "500px"],
        "blank",
        ["buyables", [1]],
        "upgrades"
    ],
    componentStyles: {
        "buyable"() {return {
            "background": "#0f0f0f",
            "border-color": "#daa625",
            "color": "#FFFFFF",
            "margin": "20px 0px 20px 0px",
            "border-radius": "5px",
            "height": "100px",
            "width": "200px"
        }},
        "upgrade"() {return {
            "background": "#0f0f0f",
            "border-color": "#daa625",
            "color": "#FFFFFF",
            "margin": "0px 7px 20px 7px",
            "border-radius": "5px",
            "height": "100px",
            "width": "200px"
        }},
        "clickable"() {return {
            "background": "#0f0f0f",
            "border-color": "#daa625",
            "color": "#FFFFFF",
            "margin": "20px 0px 20px 0px",
            "border-radius": "5px",
            "height": "100px",
            "width": "240px"
        }},
    }
})

addLayer("t", {
    name: "tesseracts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        tesseractMult: new Decimal(1),
        bestTime: 1000000000000000000000000000000,

        tetracanti: new Decimal(1),
        tetracantiPower: new Decimal(0.5),
        tetracantiInterval: new Decimal(1000),
        tetracantiBase: new Decimal(1.2),
        tetracantiMult: new Decimal(1),

        tetrUpg1: new Decimal(0),
        tetrUpg2: new Decimal(0),
        tetrUpg3: new Decimal(0),
        tetrUpg4: new Decimal(0),

        tetraGalCap: new Decimal(0),
        tetraGalaxy: new Decimal(0),
        tetraGalaxyStrength: new Decimal(1),
        galaxyEffect: new Decimal(1),

        unlockedChalls: [
            false,
        ],
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

        /*
            // TETRACANTI
        */
        player.t.tetracantiPower = new Decimal(0.5).plus(buyableEffect("r", 103))
        player.t.tetracantiMult = player.t.tetracanti.log10().plus(1).pow(player.t.tetracantiPower)
        player.t.tetraGalCap = player.t.tetrUpg4

        player.t.tetracantiBase = new Decimal(1.2).pow(player.t.tetrUpg1.plus(1))
        player.t.tetracantiInterval = new Decimal(1000).mul(player.t.tetrUpg2.pow_base(0.9))
        if (player.t.tetracanti.lt("1.8e308") && !inChallenge("challenges", 11) && !inChallenge("challenges", 13)) {
            player.t.tetracanti = player.t.tetracanti.plus(
                player.t.tetracanti.mul(player.t.tetracantiBase).mul(Decimal.div(1000, player.t.tetracantiInterval)).mul(diff)
            )
        }
        if (player.t.tetracanti.gte("1.8e308")) {
            player.t.tetracanti = new Decimal("1.8e308")
        }

        player.t.tetraGalaxyStrength = new Decimal(1)
        if (hasChallenge("challenges", 12)) player.t.tetraGalaxyStrength = player.t.tetraGalaxyStrength.mul(2)
        player.t.galaxyEffect = Decimal.pow(0.9, player.t.tetraGalaxy.mul(player.t.tetraGalaxyStrength))

        if (player.r.best.gte("1e70000") || inChallenge("challenges", 11) || hasChallenge("challenges", 11)) { player.t.unlockedChalls[0] = true } else player.t.unlockedChalls[0] = false
        if (player.r.best.gte("1e100000") || inChallenge("challenges", 12) || hasChallenge("challenges", 12)) { player.t.unlockedChalls[1] = true } else player.t.unlockedChalls[1] = false
        if (player.r.best.gte("1e110000") || inChallenge("challenges", 13) || hasChallenge("challenges", 13)) { player.t.unlockedChalls[2] = true } else player.t.unlockedChalls[2] = false
        if (player.r.best.gte("1e150000") || inChallenge("challenges", 14) || hasChallenge("challenges", 14)) { player.t.unlockedChalls[3] = true } else player.t.unlockedChalls[3] = false
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
        13: {
            cost(x) {
                return new Decimal(100).pow(x).mul(100)
            },
            display() {
                return `Double Replicanti Speed
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
                    return `<h2>Reach ${formatWhole(new Decimal("1.78e308"))} Replicanti to gain Tesseracts</h2>`
                }
            },
            canClick() {
                return canReset("t")
            },
            onClick() {
                if (player.t.resetTime < player.t.bestTime ) player.t.bestTime = player.t.resetTime
                player.t.tetracanti = new Decimal(1)
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
                return `Replicanti Shard boost is now based off of total RS
                <br><br>Costs: 1 Tesseract`
            },
            canAfford() {
                return player.t.points.gte(1)
            },
            pay() {
                player.t.points = player.t.points.sub(1)
            },
        },
        12: {
            fullDisplay() {
                return `Replicanti Speed is faster based on your Replicanti
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
                return player.r.points.log10().div(10).pow(0.5).max(1.2)
            },
        },
        13: {
            fullDisplay() {
                return `The Replicanti Interstice now also affects Replicanti Speed
                <br><br>Costs: 2 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(2)
            },
            pay() {
                player.t.points = player.t.points.sub(2)
            },
            effect() {
                //nothing lol
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
                return `The RS boost is stronger based on your unspent Tesseracts
                <br>Currently: (log10(x^1.00) → log10(x^${format(this.effect())})
                <br><br>Costs: 15 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(15)
            },
            pay() {
                player.t.points = player.t.points.sub(15)
            },
            effect() {
                return Decimal.log10(player.t.points.pow(5).plus(1)).pow(0.5).max(1).mul(upgradeEffect("t", 33))
            },
        },
        23: {
            fullDisplay() {
                return `Massively increase the Replicanti Interstice fill cap and improve fill speed
                <br><br>Costs: 30 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(30)
            },
            pay() {
                player.t.points = player.t.points.sub(30)
            },
            effect() {

            },
        },
        24: {
            fullDisplay() {
                return `Replicanti no longer slow down before 1.8e308
                <br><br>Costs: 75 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(75)
            },
            pay() {
                player.t.points = player.t.points.sub(75)
            },
            effect() {

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
                return `Upgrade 22 is stronger based on your unspent Tesseracts
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
                return Decimal.log10(player.t.points.pow(1.5)).pow(0.621577847956727384)
                //oddly specific power? why not!
            },
        },
        34: {
            fullDisplay() {
                return `Increase the purchase cap for the first Replicanti Shard upgrade<br>(5 → 50)
                <br><br>Costs: 1250 Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(1250)
            },
            pay() {
                player.t.points = player.t.points.sub(1250)
            },
            effect() {

            },
        },

        41: {
            fullDisplay() {
                return `The Replicanti Interstice gains a new effect at 50,000 filled
                <br><br>Costs: ${formatWhole(100000)} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(100000)
            },
            pay() {
                player.t.points = player.t.points.sub(100000)
            },
            effect() {

            },
        },
        42: {
            fullDisplay() {
                return `Replicanti Chance can go above 100%, but the cost scales faster beyond that point
                <br><br>Costs: ${formatWhole(100000)} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(100000)
            },
            pay() {
                player.t.points = player.t.points.sub(100000)
            },
            effect() {

            },
        },
        43: {
            fullDisplay() {
                return `Replicanti Speed is faster based on your fastest Tesseract run
                <br>Currently: ×${format(this.effect())}
                <br><br>Costs: ${formatWhole(200000)} Tesseracts`
            },
            canAfford() {
                return player.t.points.gte(200000)
            },
            pay() {
                player.t.points = player.t.points.sub(200000)
            },
            effect() {
                let x = player.t.bestTime
                return new Decimal(((120 / x) ** 0.25) * 2).max(1)
            },
        },
        44: {
            fullDisplay() {
                return `Unlock Tetracanti <br>(Requires all other upgrades purchased)
                <br>
                <br><br>Costs: ${formatWhole(500000)}`
            },
            canAfford() {
                let upg = false
                for (const id of [
                    11, 12, 13, 14,
                    21, 22, 23, 24,
                    31, 32, 33, 34,
                    41, 42, 43
                ]) {
                    if (hasUpgrade("t", id)) {
                        upg = true
                    } else return false
                } return (upg == true && player.t.points.gte(500000))
            },
            pay() {
                player.t.points = player.t.points.sub(500000)
            },
        },
    },

    getResetGain() {
        let mult = new Decimal(1) //global multipliers, condensed into a variable 
            //nothing here yet
        //old formula below
        //return Decimal.max(player.r.points.div(1.78e307), 1).log10().pow(0.25).mul(player.t.tesseractMult).floor()
        return player.r.points.log10().div(308).max(1).pow_base(3).pow(0.5).mul(player.t.tesseractMult).floor()
    },

    getNextAt() {
        return getResetGain("t").plus(1).ceil().div(player.t.tesseractMult).root(0.5).log(3).mul(308).pow10()
    },

    canReset() {
        return (getResetGain("t").gte(1) && player.r.points.gte("1.8e308"))
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

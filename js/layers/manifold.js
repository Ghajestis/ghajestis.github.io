addLayer("m", {
    name: "Big Rip",
    symbol: "ɵ",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),

        manifoldMultiplier: new Decimal(1),

        generators: [
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
            {
                amt: new Decimal(0),
                unlocked: true,
                purchased: new Decimal(0),
                multiplier: new Decimal(1),
            },
        ],
        manifoldPower: new Decimal(0),
        manifoldConversionRate: new Decimal(0.5),
    }},
    color: "#12a272",
    requires: new Decimal("1.8e308"),
    resource: "Manifold",
    baseResource: "Quarks",
    baseAmount() { return player.points },
    type: "custom",
    row: 1,
    hotkeys: [],
    update(diff) {
        
    },

    buyables: (function() {
        let buyables = {}
        let baseCosts = [1, 100, 1e10, 1e20, 1e40, 1e80, 1e120, 1e200]
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
                    let base = baseCosts[id]
                    let mult = costMults[id]
                    return new Decimal(x).pow_base(mult).mul(base)
                },
                display() {
                    let gen = player.m.generators
                    let mp = player.m.points
                    let amt = gen[id].amt
                    let p = gen[id].purchased

                    return `Cost: ${formatWhole(this.cost())} ${pluralize("Manifold", this.cost())}`
                },
                canAfford() {
                    return player.m.points.gte(this.cost())
                },
                buy() {
                    player.m.points = player.m.points.sub(this.cost())
                    player.m.generators[id].purchased = player.m.generators[id].purchased.plus(1)
                    player.m.generators[id].amt = player.m.generators[id].amt.plus(1)
                },
                effect() {
                    return new Decimal(0)
                },
            }
        }
        return buyables
    })(),
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
                doReset("m", true)
            },
        }
    },
    layerShown() {return true},

    getResetGain() {
        let q = player.points
        let mult = player.m.manifoldMultiplier

        return q.log10().div(308).pow_base(2).mul(mult).floor()
    },

    getNextAt() {
        let q = player.points
        let mult = player.m.manifoldMultiplier

        return getResetGain("m").plus(1).div(mult).log(2).mul(308).pow10().ceil()
    },

    tabFormat: {
        "Upgrades": {
            content: [
                "blank",
                ["clickable", [101]],
            ],
            buttonStyle: {
                "margin-top":"15px",
            }
        },
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
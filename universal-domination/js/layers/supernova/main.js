addLayer("s", {
    startData() {
        let data = {
            stellarRemnants: new Decimal(0),
            resets: new Decimal(0),
        }

        return data
    },

    getResetGain() {
        let manifolds = player.m.points
        let multipliers = new Decimal(1)

        return manifolds.log10().sub(308).div(308).clampMin(0).pow_base(5).mul(multipliers).floor()
    },

    getNextAt() {
        let gain = this.getResetGain().plus(1)
        let multipliers = new Decimal(1)

        return gain.div(multipliers).log(5).mul(308).plus(308).pow10().ceil()
    },

    clickables: {
        101: {
            display() {
                return `<h3>Go Supernova for ${formatWhole(getResetGain(this.layer))} ${pluralize("Stellar Remnant", getResetGain(this.layer))}
                <br><h3>Next At: ${formatWhole(getNextAt(this.layer))} Manifolds`
            },
            style: {
                "width": "200px",
                "height": "100px",
                "min-width": "200px",
                "max-width": "200px",
                "min-height": "100px",
            },
            canClick() {
                return player.m.points.gte("1.8e308")
            },
            onClick() {
                let gain = getResetGain(this.layer)
                // Space Generators
                player.spaceGenerators.cosmicEnergy = new Decimal(0)

                for (let i = 0; i < 8; i++) {
                    player.spaceGenerators[0].amount = player.spaceGenerators[0].purchased
                }

                // Big Rip
                layerDataReset("m")
                layerDataReset("em")
                layerDataReset("q")

                player.q.best = new Decimal(1)
                player.m.best = new Decimal(1)
                player.m.resets = new Decimal(1)
                player.s.stellarRemnants = player.s.stellarRemnants.plus(gain)
            },
        }
    },

    tabFormat: {
        "Milestones": {
            embedLayer: "supernovaMilestones",
        },
        "Constellation": {
            embedLayer: "constellation",
        }
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
            "margin": "5px",
        },
        "column": {
            "outline": "3px solid",
            "border-radius":"5px",
            "padding":"20px",
            "margin":"10px",
            "background-color":"transparent",
        },
        "upgRow": {
            "background-color":"transparent",
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
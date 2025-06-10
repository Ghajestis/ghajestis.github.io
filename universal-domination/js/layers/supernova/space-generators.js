addLayer("spaceGenerators", {
    startData() {
        let data = {}

        // I know shifting values like multipliers aren't supposed to go in player data,
        // But this is just the most convenient option
        // I will try to minimize the amount of times I do this though, haha
        for (let i = 0; i < 8; i++) {
            data[i] = {
                purchased: new Decimal(0),
                amount: new Decimal(0),
                multiplier: new Decimal(1),
            }
        }

        data.cosmicEnergy = new Decimal(0)

        return data
    },

    values: {
        spaceGeneratorPerPurchaseMult() {
            return new Decimal(4)
        },
        cosmicEnergyEffectBase() {
            return new Decimal(1.5)
        },
        cosmicEnergyEffect() {
            return player.spaceGenerators.cosmicEnergy.clampMin(1).log(this.cosmicEnergyEffectBase()).clampMin(0).floor()
        },
        cosmicEnergyNextAt() {
            return this.cosmicEnergyEffect().plus(1).pow_base(this.cosmicEnergyEffectBase())
        },
    },

    update(diff) {
        for (let i = 0; i < 8; i++) {
            player.spaceGenerators[i].multiplier = new Decimal(1)
                .mul(tmp.spaceGenerators.commonMultiplier)
                .mul(player.spaceGenerators[i].purchased.pow_base(tmp.spaceGenerators.values.spaceGeneratorPerPurchaseMult))
            
            if (i != 7) player.spaceGenerators[i].amount = player.spaceGenerators[i].amount.plus(
                player.spaceGenerators[i + 1].amount.mul(player.spaceGenerators[i + 1].multiplier).mul(diff)
            )
        }

        player.spaceGenerators.cosmicEnergy = player.spaceGenerators.cosmicEnergy.plus(player.spaceGenerators[0].amount.mul(player.spaceGenerators[0].multiplier).mul(diff))
    },

    commonMultiplier() {
        return new Decimal(1) // No SG multipliers yet
    },

    buyables: (function() {
        let buyables = {}

        let baseCosts = [
            new Decimal(10),
            new Decimal(100),
            new Decimal(1000),
            new Decimal(100000),
            new Decimal(100000000),
            new Decimal(1000000000000),
            new Decimal(100000000000000000),
            new Decimal(100000000000000000000000),
        ]

        let costMults = [
            new Decimal(10),
            new Decimal(100),
            new Decimal(1000),
            new Decimal(10000),
            new Decimal(100000),
            new Decimal(1000000),
            new Decimal(10000000),
            new Decimal(100000000),
        ]

        for (let i = 0; i < 8; i++) {
            buyables["1" + i] = {
                cost(x) {
                    x = player.spaceGenerators[i].purchased
                    return baseCosts[i].mul(costMults[i].pow(x))
                },
                display() {
                    return `Cost: ${formatWhole(this.cost())} Stellar Remnants`
                },
                canAfford() {
                    return player.s.stellarRemnants.gte(this.cost())
                },
                buy() {
                    player.s.stellarRemnants = player.s.stellarRemnants.sub(this.cost())
                    player.spaceGenerators[i].amount = player.spaceGenerators[i].amount.plus(1)
                    player.spaceGenerators[i].purchased = player.spaceGenerators[i].purchased.plus(1)
                },
            }
        }

        return buyables
    })(),

    tabFormat: [
        ["display-text", function() {
            let txtStyle = `"background:linear-gradient(rgb(68, 26, 182), rgb(62, 156, 243)); background-clip: text; color: transparent; filter: drop-shadow(0 0 3px rgb(71, 59, 87))"`
            return `<h3>You have <h2 style=${txtStyle}>${format(player.spaceGenerators.cosmicEnergy)}</h2><h3> Cosmic Energy, which is
            <br><h3>providing a <h2 style=${txtStyle}>+${format(tmp.spaceGenerators.values.cosmicEnergyEffect)}</h2><h3> bonus to the Buy 10 multiplier, with the next increment requiring <h2 style=${txtStyle}>${format(tmp.spaceGenerators.values.cosmicEnergyNextAt)}</h2> Cosmic Energy.
            <br><h3>The amount each bonus requires is increasing by <h2 style=${txtStyle}>×${format(tmp.spaceGenerators.values.cosmicEnergyEffectBase)}</h2><h3> for each increment.`
        }],
        ["blank", "25px"],
        ["column", [
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">1st Space Generator (${formatWhole(player.spaceGenerators[0].amount)})
                    <br>×${format(player.spaceGenerators[0].multiplier)} | ${formatWhole(player.spaceGenerators[0].purchased)} Purchases`
                }],
                ["buyable", [10]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">2nd Space Generator (${formatWhole(player.spaceGenerators[1].amount)})
                    <br>×${format(player.spaceGenerators[1].multiplier)} | ${formatWhole(player.spaceGenerators[1].purchased)} Purchases`
                }],
                ["buyable", [11]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">3rd Space Generator (${formatWhole(player.spaceGenerators[2].amount)})
                    <br>×${format(player.spaceGenerators[2].multiplier)} | ${formatWhole(player.spaceGenerators[2].purchased)} Purchases`
                }],
                ["buyable", [12]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">4th Space Generator (${formatWhole(player.spaceGenerators[3].amount)})
                    <br>×${format(player.spaceGenerators[3].multiplier)} | ${formatWhole(player.spaceGenerators[3].purchased)} Purchases`
                }],
                ["buyable", [13]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">5th Space Generator (${formatWhole(player.spaceGenerators[4].amount)})
                    <br>×${format(player.spaceGenerators[4].multiplier)} | ${formatWhole(player.spaceGenerators[4].purchased)} Purchases`
                }],
                ["buyable", [14]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">6th Space Generator (${formatWhole(player.spaceGenerators[5].amount)})
                    <br>×${format(player.spaceGenerators[5].multiplier)} | ${formatWhole(player.spaceGenerators[5].purchased)} Purchases`
                }],
                ["buyable", [15]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">7th Space Generator (${formatWhole(player.spaceGenerators[6].amount)})
                    <br>×${format(player.spaceGenerators[6].multiplier)} | ${formatWhole(player.spaceGenerators[6].purchased)} Purchases`
                }],
                ["buyable", [16]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],
            ["row", [
                ["display-text", function() {
                    return `<h4 style="text-align:left !important; position:relative; left:0px; width: 500px">8th Space Generator (${formatWhole(player.spaceGenerators[7].amount)})
                    <br>×${format(player.spaceGenerators[7].multiplier)} | ${formatWhole(player.spaceGenerators[7].purchased)} Purchases`
                }],
                ["buyable", [17]]
            ], {"align-self":"left !important","min-width":"800px", "display":"inherit"}
            ],

        ]
        ]
    ],

    componentStyles: {
        "buyable": {
            "width":"200px",
            "height":"60px",
            "border-radius":"5px",
            "margin-left": "-2px",
            "margin-right": "-2px",
            "margin-bottom": "8px",
            "position": "relative",
            "right": "0px"
        }
    }
})
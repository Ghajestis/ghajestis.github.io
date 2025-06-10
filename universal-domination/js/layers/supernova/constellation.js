addLayer("constellation", {
    startData() { return {
        stardust: new Decimal(0)
    }},

    clickables: {
        10: {
            style: {
                "border-color": "var(--background)",
                "background-color": "var(--background) !important",
                "cursor": "default",
            }
        },
        11: {
            type: "Buyable", // Can either be Buyable, Milestone, or Challenge, functionality for this will be added later down the line I think
            // The Cost, in stardust (name TBD)
            cost() {
                return new Decimal(1)
            },
            // The maximum amount of times this upgrade can be purchased. Some constellation upgrades will be multi-purchaseable
            maxPurchases: 1,
            amount: 0,
            effect() {
                return getBuyableAmount("q", 11).pow_base(tmp.q.values.accelMul).pow(0.05)
            },
            display() {
                return treeDisplay(`Accelerators affect MGs with reduced effect`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                    //    && constellationAmount(11) >= 1   
                    )
            },
            branches: [21, 22]
        },

        // Row 2
        21: {
            type: "Buyable",
            cost() {
                return new Decimal(1)
            },
            maxPurchases: 1,
            amount: 0,
            effect() {
                return player.q.atoms
            },
            display() {
                return treeDisplay(`Big Rips are multiplied by your Atoms`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(11) >= 1   
                    )
            },
            branches: [31]
        },
        22: {
            type: "Buyable",
            cost() {
                return new Decimal(2)
            },
            maxPurchases: 1,
            amount: 0,
            effect() {
                return
            },
            display() {
                return treeDisplay(`Improve the Strange Matter Effect formula (NYI)`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount)
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(11) >= 1   
                    )
            },
            branches: [31]
        },

        // Row 3
        31: {
            type: "Buyable",
            cost() {
                return new Decimal(2)
            },
            maxPurchases: 1,
            amount: 0,
            effect() {
                return
            },
            display() {
                return treeDisplay(`Strange and Charmed Matter increase twice as fast`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount)
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && (constellationAmount(22) >= 1 || constellationAmount(21) >= 1)   
                    )
            },
            branches: [32, 41, 42]
        },
        32: {
            type: "Buyable",
            cost() {
                return new Decimal(3)
            },
            maxPurchases: Infinity,
            amount: 0,
            effect() {
                return new Decimal(this.amount).pow_base(5)
            },
            display() {
                return treeDisplay(`Gain ×5 more Stellar Remnants`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(31) >= 1   
                    )
            },
        },
        
        // Row 4
        41: {
            type: "Buyable",
            cost() {
                return new Decimal(3)
            },
            maxPurchases: 1,
            amount: 0,
            effect() {
                return player.q.atoms.pow_base(1.0005).sub(1).div(2).plus(1)
            },
            display() {
                return treeDisplay(`Accelerators gain another boost based on your Atoms`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(31) >= 1   
                    )
            },
            branches: [51, 52]
        },
        42: {
            type: "Buyable",
            cost() {
                return new Decimal(3)
            },
            maxPurchases: 1,
            amount: 0,
            effect() {
                return 
            },
            display() {
                return treeDisplay(`Atoms scale by 5 less 8th Generators`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(31) >= 1   
                    )
            },
            branches: [53]
        },

        // Row 5
        51: {
            type: "Buyable",
            cost() {
                return new Decimal(5)
            },
            maxPurchases: 5,
            amount: 0,
            effect() {
                return new Decimal(1e100).pow(this.amount)
            },
            display() {
                return treeDisplay(`The Strange and Charmed Matter softcaps are increased by ×${format(1e100)}`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(41) >= 1   
                    )
            },
        },
        52: {
            type: "Buyable",
            cost() {
                return new Decimal(3)
            },
            maxPurchases: 1,
            amount: 0,
            effect() {
                return player.s.resets.pow(0.5)
            },
            display() {
                return treeDisplay(`Perfect Matter gain is increased based on your Supernovae`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(41) >= 1   
                    )
            },
            branches: [61]
        },
        53: {
            type: "Buyable",
            cost() {
                return new Decimal(3)
            },
            maxPurchases: 1,
            amount: 0,
            effect() {
                return player.m.generators[7].purchased.pow(0.1)
            },
            display() {
                return treeDisplay(`Perfect Matter gain is increased based on your 8th MGs`, 
                    this.id, this.cost(), this.effect(), this.maxPurchases, this.amount,
                    "multiplicative"
                )
            },
            canClick() { 
                return (this.amount < this.maxPurchases && player.constellation.stardust.gte(this.cost())
                        && constellationAmount(42) >= 1   
                    )
            },
            branches: [61]
        },

        // Row 6
        61: {
            type: "Milestone",
            // Milestone constellations return an array for the cost, of the requirement and which resource
            cost() {
                return [new  Decimal("1e2000000"), "Quarks"]
            },
            display() {
                return treeDisplay(`You start with ${format(1e100)} Quarks`,
            this.id, this.cost(), 0, 0, 0, this.type)
            }
        }
    },

    tabFormat: [
                                                        ["clickable", [11]],
    ["row",[                                ["clickable", [21]],    ["clickable", [22]]]],
    ["row",[                    ["clickable", [10]],    ["clickable", [31]],    ["clickable", [32]]]],
    ["row",[                                ["clickable", [41]],    ["clickable", [42]]]],
    ["row",[        ["clickable", [51]],    ["clickable", [52]],    ["clickable", [53]],    ["clickable", [10]]]],
                                                        ["clickable", [61]],
    ],

    componentStyles: {
        "clickable": {
            "width": "180px",
            "height": "110px",
            "min-height": "110px",
            "margin-bottom": "50px",
            "margin-left": "15px",
            "margin-right": "15px",
        }
    }
})
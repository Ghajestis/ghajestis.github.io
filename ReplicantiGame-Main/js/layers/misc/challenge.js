addLayer("challenges", {
    tabFormat: {
        "Replicanti": {
            content: [
                ["display-text",
                    function() { 
                        let amt = new Decimal(1)
                        if (tmp.challenges.challenges[11].unlocked) { amt = "1e100000" }
                        if (tmp.challenges.challenges[12].unlocked) { amt = "1e110000" }
                        if (tmp.challenges.challenges[13].unlocked) { amt = "1e150000" }
                        return `Reach ${format(amt)} Replicanti to unlock the next Challenge.` 
                    }
                ],
                ["blank", "20px"],
                ["row", 
                    [
                        ["challenge", [11]],
                        ["challenge", [12]],
                        ["challenge", [13]],
                    ]
                ],
            ],
            buttonStyle: {
                "border-color": "#FFFFFF",
                "color": "#FFFFFF",
                "margin-top": "20px"
            },
        }
    },

    challenges: {
        11: {
            name() {
                return `<h3 style="position: absolute; top: -30px; text-align: left; left: 10px">Predicate Diminution (C1)</h3>`
            },
            fullDisplay() {
                return `
                <h5>Replicanti Upgrade costs begin scaling immediately. You cannot gain Replicanti Shards, and Tetracanti are disabled.
                <br><br>Goal: ${format("1e3500")} Replicanti
                <br>Reward: Replicanti Upgrades no longer spend your Replicanti, and you can buy max Replicanti Upgrades</h5>
                `
            },
            unlocked() {
                return player.t.unlockedChalls[0]
            },
            onEnter() {
                player.t.tetracanti = new Decimal(1)
                player.t.tetraGalaxy = new Decimal(0)
                doReset("t", true)
                layerDataReset("s")
            },
            onExit() {
                player.t.tetracanti = new Decimal(1)
                player.t.tetraGalaxy = new Decimal(0)
                doReset("t", true)
                layerDataReset("s")
            },
            canComplete() {
                return player.r.points.gte("1e3500")
            }
        },
        12: {
            name() {
                return `<h3 style="position: absolute; top: -30px; text-align: left; left: 10px">Exacerbated Annihilation (C2)`
            },
            fullDisplay() {
                return `
                <h5>The post-1.00e100,000 Replicanti Scaling begins at 1.8e308 instead, and is far more powerful. The Chance upgrade no longer scales, and is far cheaper.
                <br><br>Goal: ${format("1e6000")} Replicanti
                <br>Reward: Tetracanti Galaxies are twice as powerful
                `
            },
            unlocked() {
                return player.t.unlockedChalls[1]
            },
            onEnter() {
                player.t.tetracanti = new Decimal(1)
                doReset("t", true)
                layerDataReset("s")
            },
            onExit() {
                player.t.tetracanti = new Decimal(1)
                doReset("t", true)
                layerDataReset("s")
            },
            canComplete() {
                return player.r.points.gte("1e6000")
            }
        },
        13: {
            name() {
                return `<h3 style="position: absolute; top: -30px; text-align: left; left: 10px">Monolithic Command (C3)</h3>`
            },
            fullDisplay() {
                return `
                <h5>You can no longer buy Replicanti Upgrades or Shard Upgrades, and Tetracanti are disabled. The formula for the Replicanti Shard boost is far more powerful.
                <br><br>Goal: ${format("1e100000")}(?) Replicanti
                <br>Reward: The Replicanti Interstice fill cap is vastly increased, and gains additional effects at certain fill values
                `
            },
            unlocked() {
                return player.t.unlockedChalls[2]
            },
            onEnter() {
                player.t.tetracanti = new Decimal(1)
                player.t.tetraGalaxy = new Decimal(0)
                doReset("t", true)
                layerDataReset("s")
            },
            onExit() {
                player.t.tetracanti = new Decimal(1)
                doReset("t", true)
                layerDataReset("s")
            },
            canComplete() {
                return player.r.points.gte("1e1000000000000000000000000000000")
            }
        },
    },

    componentStyles: {
        "challenge": {
            "background-color": "#0f0f0f",
            "color": "#FFFFFF",
            "border-color": "#13b1f0",
            "border-width": "3px",
            "border-radius": "5px",
            "padding": "20px",
            "width": "400px",
            "height": "180px",
            "margin": "10px",
        }
    }
})
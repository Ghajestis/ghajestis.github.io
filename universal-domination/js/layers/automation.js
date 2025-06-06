addLayer("automation", {
    name: "automation", 
    symbol: "P", 
    position: 1, 
    startData() { 
        const data = {
            unlocked: true,
		    points: new Decimal(0),

            qgAutobuyersInterval: [],
            qgAutobuyersAmount: [],
            qgAutobuyersIntensity: [],

            atomAutobuyer: 0,
            atomAutobuyerUnl: false,
            atomAutobuyerBuyUntil: 0,
            acceleratorAutobuyer: 0,

            bigRipAutobuyer: 0,
            bigRipAutobuyerMode: "Big Rip at x",
            bigRipAutobuyerValue: "",
        }  
        
        for (i = 0; i < 8; i++) {
            data.qgAutobuyersInterval[i] = 0
            data.qgAutobuyersAmount[i] = 0
            data.qgAutobuyersIntensity[i] = 0
        }

        return data 
    },

    //autobuyer unlocked states

    color: "#FFFFFF",
    type: "none", 
    row: 1, 
    hotkeys: [
    ],
    layerShown(){return player.m.resets.gte(1)},

    clickables: (function() {
        let clickables = {}
        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            clickables["101" + id] = {
                title() {
                    let value = player.automation.qgAutobuyersInterval[id]
                    if (value == 1) {
                        return "Buys Singles"
                    } else if (value == 2) {
                        return "Buys Max"
                    } else {
                        return "Disabled"
                    }
                },
                canClick: true,
                onClick() {
                    if (player.automation.qgAutobuyersInterval[id] < 2) {
                        player.automation.qgAutobuyersInterval[id] += 1
                    } else {
                        player.automation.qgAutobuyersInterval[id] = 0
                    }
                },
                style: {
                    "font-size": "8px",
                    "width": "70px",
                    "min-height": "0px",
                    "height": "40px",
                    "border-radius": "5px",
                    "margin": "5px",
                }
            }
            clickables["102" + id] = {
                title() {
                    let value = player.automation.qgAutobuyersAmount[id]
                    if (value == 1) {
                        return "Buys Singles"
                    } else if (value == 2) {
                        return "Buys Max"
                    } else {
                        return "Disabled"
                    }
                },
                canClick: true,
                onClick() {
                    if (player.automation.qgAutobuyersAmount[id] < 2) {
                        player.automation.qgAutobuyersAmount[id] += 1
                    } else {
                        player.automation.qgAutobuyersAmount[id] = 0
                    }
                },
                style: {
                    "font-size": "8px",
                    "width": "70px",
                    "min-height": "0px",
                    "height": "40px",
                    "border-radius": "5px",
                    "margin": "5px",
                }
            }
            clickables["103" + id] = {
                title() {
                    let value = player.automation.qgAutobuyersIntensity[id]
                    if (value == 1) {
                        return "Buys Singles"
                    } else if (value == 2) {
                        return "Buys Max"
                    } else {
                        return "Disabled"
                    }
                },
                canClick: true,
                onClick() {
                    if (player.automation.qgAutobuyersIntensity[id] < 2) {
                        player.automation.qgAutobuyersIntensity[id] += 1
                    } else {
                        player.automation.qgAutobuyersIntensity[id] = 0
                    }
                },
                style: {
                    "font-size": "8px",
                    "width": "70px",
                    "min-height": "0px",
                    "height": "40px",
                    "border-radius": "5px",
                    "margin": "5px",
                }
            }
        }
        clickables["1018"] = {
            title() {
                let value = 0
                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (player.automation.qgAutobuyersInterval[id] != 0) value = 1
                }
                if (value == 0) {
                    return "All On"
                } else {
                    return "All Off"
                }
            },
            canClick: true,
            onClick() {
                let value = 0
                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (player.automation.qgAutobuyersInterval[id] != 0) value = 1
                }

                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (value == 1) {
                        player.automation.qgAutobuyersInterval[id] = 0
                    } else { 
                        player.automation.qgAutobuyersInterval[id] = 2
                    }
                }
            },
            style: {
                "font-size": "8px",
                "width": "40px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin": "5px",
            }
        }
        clickables["1028"] = {
            title() {
                let value = 0
                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (player.automation.qgAutobuyersAmount[id] != 0) value = 1
                }
                if (value == 0) {
                    return "All On"
                } else {
                    return "All Off"
                }
            },
            canClick: true,
            onClick() {
                let value = 0
                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (player.automation.qgAutobuyersAmount[id] != 0) value = 1
                }

                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (value == 1) {
                        player.automation.qgAutobuyersAmount[id] = 0
                    } else { 
                        player.automation.qgAutobuyersAmount[id] = 2
                    }
                }
            },
            style: {
                "font-size": "8px",
                "width": "40px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin": "5px",
            }
        }
        clickables["1038"] = {
            title() {
                let value = 0
                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (player.automation.qgAutobuyersIntensity[id] != 0) value = 1
                }
                if (value == 0) {
                    return "All On"
                } else {
                    return "All Off"
                }
            },
            canClick: true,
            onClick() {
                let value = 0
                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (player.automation.qgAutobuyersIntensity[id] != 0) value = 1
                }

                for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
                    if (value == 1) {
                        player.automation.qgAutobuyersIntensity[id] = 0
                    } else { 
                        player.automation.qgAutobuyersIntensity[id] = 2
                    }
                }
            },
            style: {
                "font-size": "8px",
                "width": "40px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin": "5px",
            }
        }

        clickables["1100"] = {
            title() {
                if (player.automation.acceleratorAutobuyer == 1) { return "Buys Singles" }
                else if (player.automation.acceleratorAutobuyer == 2) { return "Buys Max" }
                else return "Disabled"
            },
            canClick: true,
            onClick() {
                if (player.automation.acceleratorAutobuyer < 2) {
                    player.automation.acceleratorAutobuyer += 1
                } else {
                    player.automation.acceleratorAutobuyer = 0
                }
            },
            style: {
                "font-size": "10px",
                "width": "150px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin": "5px",
            }
        }

        clickables["1101"] = {
            title() {
                if (player.automation.atomAutobuyer == 1) { return "Enabled" }
                else return "Disabled"
            },
            canClick: true,
            onClick() {
                if (player.automation.atomAutobuyer < 1) {
                    player.automation.atomAutobuyer += 1
                } else {
                    player.automation.atomAutobuyer = 0
                }
            },
            style: {
                "font-size": "10px",
                "width": "150px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin": "5px",
            }
        }

        clickables["1102"] = {
            cost: new Decimal(10),
            title() {
                return `<h3>Unlock Atom autobuyer
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canClick() { return player.m.points.gte(this.cost)},
            onClick() { 
                player.m.points = player.m.points.sub(this.cost) 
                player.m.atomAutobuyerUnl = true
            },
            style: {
                "font-size": "10px",
                "width": "150px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin": "5px",
            }
        }

        clickables["1103"] = {
            title() {
                if (player.automation.bigRipAutobuyer == 0) {
                    return "Disabled"
                } else { return "Enabled" }
            },
            canClick: true,
            onClick() {
                if (player.automation.bigRipAutobuyer < 1) {
                    player.automation.bigRipAutobuyer += 1
                } else {
                    player.automation.bigRipAutobuyer = 0
                }
            },
            style: {
                "font-size": "10px",
                "width": "150px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin-left": "100px",
            }
        }

        return clickables
    })(),

    upgrades: {
        101: {
            cost: new Decimal(10),
            fullDisplay() {
                return `<h3>Unlock Atom autobuyer
                <br>Costs: ${formatWhole(this.cost)} Manifolds`
            },
            canAfford() {
                return player.m.points.gte(this.cost)
            },
            effect() {
                return new Decimal(1)
            },
            currencyLayer: "m",
            style: {
                "font-size": "10px",
                "width": "150px",
                "min-height": "0px",
                "height": "40px",
                "border-radius": "5px",
                "margin": "5px",
            }
        },
    },

    tabFormat: {
        "Autobuyers": {
            content: [
                ["column", [
                        [
                            "display-text", function() { return `Quark Generator Autobuyers<br>From top to bottom: Interval, Amount, Intensity`}
                        ],
                        "blank",
                        ["row", [
                            ["clickable", 1010], ["clickable", 1011], ["clickable", 1012], ["clickable", 1013],
                            ["clickable", 1014], ["clickable", 1015], ["clickable", 1016], ["clickable", 1017],
                            ["clickable", 1018]
                        ]],
                        ["row", [
                            ["clickable", 1020], ["clickable", 1021], ["clickable", 1022], ["clickable", 1023],
                            ["clickable", 1024], ["clickable", 1025], ["clickable", 1026], ["clickable", 1027],
                            ["clickable", 1028]
                        ]],
                        ["row", [
                            ["clickable", 1030], ["clickable", 1031], ["clickable", 1032], ["clickable", 1033],
                            ["clickable", 1034], ["clickable", 1035], ["clickable", 1036], ["clickable", 1037],
                            ["clickable", 1038]
                        ]],
                    ],
                    {
                        "min-width":"750px"
                    }
                ],
                ["row", [
                    ["column", [
                        ["display-text", "Accelerator Autobuyer"],
                        ["clickable", [1100]]
                    ], {"min-width":"375px", "max-height":"80px", "min-height": "80px"}],
                    () => player.m.atomAutobuyerUnl ? ["column", [
                        ["display-text", "Atom Autobuyer"],
                        ["row", [
                            ["clickable", [1101]],
                            ["column", [
                                ["display-text", `<h5 style="margin-bottom:4px">Only buy until x Atoms:`],
                                ["text-input", "atomAutobuyerBuyUntil"]
                            ], {"outline": "solid 0px"}]
                        ]]
                    ], {"min-width":"375px", "max-height":"80px"}] : 
                    ["column", [
                        ["display-text", "Atom Autobuyer"],
                        ["clickable", [1102]]
                    ], {"min-width":"375px", "max-height":"80px"}],
                ]],
                ["column", [
                    ["display-text", `<h4 style="margin-bottom: 20px">Big Rip Autobuyer`],
                    ["row", [
                        ["drop-down", ["bigRipAutobuyerMode", ["Big Rip at x", "Time", "x times highest"]]],
                        ["text-input", "bigRipAutobuyerValue"],
                        ["clickable", ["1103"]]
                    ]]
                ]]
            ]
        }
    },
    componentStyles: {
        "column": {
            "outline": "3px solid",
            "border-radius":"5px",
            "padding":"20px",
            "margin":"10px",
        },
    },
    automate() {
        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            if (player.automation.qgAutobuyersAmount[id] == 0) {
                // Nothing happens cuz it's disabled lol
            } else if (player.automation.qgAutobuyersAmount[id] == 1) {
                buyBuyable("q", "11" + id)
            } else {
                buyMaxBuyable("q", "11" + id)
            }
        }
        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            if (player.automation.qgAutobuyersInterval[id] == 0) {
                // Nothing happens cuz it's disabled lol
            } else if (player.automation.qgAutobuyersInterval[id] == 1) {
                buyBuyable("q", "10" + id)
            } else {
                buyMaxBuyable("q", "10" + id)
            }
        }
        for (const id of [0, 1, 2, 3, 4, 5, 6, 7]) {
            if (player.automation.qgAutobuyersIntensity[id] == 0) {
                // Nothing happens cuz it's disabled lol
            } else if (player.automation.qgAutobuyersIntensity[id] == 1) {
                buyBuyable("q", "12" + id)
            } else {
                buyMaxBuyable("q", "12" + id)
            }
        }

        if (player.automation.acceleratorAutobuyer == 0) {

        } else if (player.automation.acceleratorAutobuyer == 1) {
            buyBuyable("q", "11")
        } else {
            buyMaxBuyable("q", "11")
        }

        if (player.automation.atomAutobuyerBuyUntil < 0) player.automation.atomAutobuyerBuyUntil = 0

        if (player.automation.atomAutobuyer == 1 && 
            (player.q.atoms.lt(player.automation.atomAutobuyerBuyUntil))) {
                clickClickable("q", 101)
        }

        if (player.automation.bigRipAutobuyerMode == "Big Rip at x" && player.automation.bigRipAutobuyer == 1 ) {
            let value = new Decimal(player.automation.bigRipAutobuyerValue)
            if (value.mag == NaN ) {
                player.automation.bigRipAutobuyerValue = "0"
                value = new Decimal(0)
            }
            if (getResetGain("m").gte(value)) clickClickable("m", 101)
        } else if (player.automation.bigRipAutobuyerMode == "Time" && player.automation.bigRipAutobuyer == 1 ) {
            let value = new Decimal(player.automation.bigRipAutobuyerValue)
            if (value.mag == NaN ) {
                player.automation.bigRipAutobuyerValue = "0"
                value = new Decimal(0)
            }
            if (new Decimal(player.m.resetTime).gte(value)) clickClickable("m", 101)
        } else if (player.automation.bigRipAutobuyerMode == "x times highest" && player.automation.bigRipAutobuyer == 1 ) {
            let value = new Decimal(player.automation.bigRipAutobuyerValue)
            if (value.mag == NaN ) {
                player.automation.bigRipAutobuyerValue = "0"
                value = new Decimal(0)
            }
            if (getResetGain("m").gte(player.m.best.mul(value))) clickClickable("m", 101)
        }
    },
})
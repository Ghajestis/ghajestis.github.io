addLayer("0", {
    name: "main", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    layerShown(){return true},
    tabFormat: [
            ["display-text",
                function() { 
                    let string = `You have <h1 style="color:#a8a8a8; font-size:30px">${formatWhole(player.points)}</h1> Quarks.`
                    if (player.m.resets.gte(1)) string = string + `<br>You have <h3 style="color:#12a272;">${formatWhole(player.m.points)}</h3> ${pluralize("Manifold", player.m.points)}.<br>`

                    if (inChallenge("m", 13)) string = string + `<br>Destructive Returns - Production ^${format(player.m.manifoldChal3_productionPower, 3)}`
                    if (inChallenge("m", 21)) string = string + `<br>Temporal Altercation - Production / ${format(player.m.manifoldChal4_productionDivisor, 3)}`
                    if (inChallenge("m", 32)) string = string + `<br>Vapid Continuum - Production ^${format(tmp.q.values.manifoldChal8_ProductionPow, 3)}`
                    if (inChallenge("m", 33)) string = string + `<br>Desolate Desecration has applied the following effects:
                    <br>Quark Generation ^${format(new Decimal(tmp.m.values.manifoldChal9_productionRoot).recip().mul(tmp.m.values.manifoldChal9_rootModifier).clampMax(1))}
                    <br>All Generator Intensities /${formatWhole(tmp.m.values.manifoldChal9_divisor)}
                    <br> Quark Generation Power ×${format(tmp.m.values.manifoldChal9_rootModifier)} from Phase Shifts
                    `
                    return string
                }
            ],
            "blank",
            ["microtabs", "main"],
        ],
    microtabs: {
        main: {
            "Generators": {
                embedLayer: "q"
            },
            "Achievements": {
                embedLayer: "ach"
            },
            "Automation": {
                embedLayer: "automation",
                unlocked() { return player.m.resets.gte(1) }
            },
            "Big Rip": {
                embedLayer: "m",
                buttonStyle: {
                    "color":"#12a272",
                    "border-color":"#12a272"
                },
                unlocked() { return player.q.best.gte("1.8e308") || player.m.resets.gte(1)}
            },
            "Options": {

            },
        }
    },
    automate() {
        options.forceOneTab = true
    },
    componentStyles: {
        "microtabs": {
            "border": "0px solid"
        }
    }
})
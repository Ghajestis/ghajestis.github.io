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
            function() { return `You have <h1 style="color:#a8a8a8; font-size:30px">${formatWhole(player.points)}</h1> Quarks.<br>
                You have <h3 style="color:#12a272;">${formatWhole(player.m.points)}</h3> ${pluralize("Manifold", player.m.points)}.<br>
            `}
        ],
        "blank",
        ["microtabs", "main"],
    ],
    microtabs: {
        main: {
            "Generators": {
                embedLayer: "q"
            },
            "Big Rip": {
                embedLayer: "m",
                buttonStyle: {
                    "color":"#12a272",
                    "border-color":"#12a272"
                }
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
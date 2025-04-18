addLayer("m", {
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
                let text = ' '
                if (player.t.points.gte(1)) text = `You have <h1 style="color:#13b1f0; font-size:30px">${formatWhole(player.r.points)}</h1> Replicanti.<br>
            You have <h3 style="color:#5739c4;">${formatWhole(player.s.points)}</h3> Replicanti ${pluralize(player.s.points, "Shard")}.<br>
            You have <h3 style="color:#daa625;">${formatWhole(player.t.points)}</h3> ${pluralize(player.t.points, "Tesseract")}.`

                else text = `You have <h1 style="color:#13b1f0; font-size:30px">${formatWhole(player.r.points)}</h1> Replicanti.<br>
            You have <h3 style="color:#5739c4;">${formatWhole(player.s.points)}</h3> Replicanti ${pluralize(player.s.points, "Shard")}.`
            return text
            },
        ],
        ["microtabs", "main"],
    ],
    microtabs: {
        main: {
            "Options": {

            },
            "Achievements": {

            },
            "Replicanti": {
                embedLayer: "r"
            },
            "Challenges": {
                embedLayer: "challenges"
            },
            "Tesseract": {
                embedLayer: "t",
                buttonStyle: {
                    "color":"#daa625",
                    "border-color":"#daa625"
                },
                unlocked() {
                    return (player.r.best.gte("1.8e308") || player.t.total.gte(1))
                },
            },
            "Info": {
                embedLayer: "info"
            },
        }
    },
    automate() {
        options.forceOneTab = true
    }
})

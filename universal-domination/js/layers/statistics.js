addLayer("statistics", {
    startData() { return {
        bestEverQuarks: new Decimal(0),
        timeSinceBestQuarks: 0,
    }},
    update(diff) {
        if (player.points.gte(player.statistics.bestEverQuarks)) {
            player.statistics.bestEverQuarks = player.points
            player.statistics.timeSinceBestQuarks = 0
        }
        player.statistics.timeSinceBestQuarks += diff
    },
    tabFormat: [
        ["blank", "100px"],
        ["display-text", function() {
            let str = `Your best ever Quarks is ${format(player.statistics.bestEverQuarks)}.`
            if (player.statistics.timeSinceBestQuarks > 5) str = str + `<br>You reached this value ${formatTime(player.statistics.timeSinceBestQuarks)} ago.`
            if (player.statistics.timeSinceBestQuarks < 5) str = str + `<br>This value is currently updating.`

            if (player.points.gte("8.8e40") && player.points.lt("1e10000")) {
                str = str + `<br><br>Assuming Quarks have a ${formatSmall("1e-18")} meter radius, you could fill a space
                <br>${format(player.points.div(8.8e40))} times the radius of the Observable Universe.`
            }
            if (player.points.gte("1e10000")) {
                str = str + `<br><br>If you counted 3 digits per second, it would take you ${formatTime(player.points.log10().div(3))} to write out your Quark count.`
            }

            let bigRipStr = ``
            if (player.m.resets.gte(1)) {
                bigRipStr = bigRipStr + `<br><br><br><h2 style="color: var(--manifold)">Big Rip</h3>
                <br>You have Big Ripped ${formatWhole(player.m.resets)} ${pluralize("time", player.m.resets)}.
                <br>Your best Manifolds${player.m.points.gte("1.8e308") ? ` this Supernova` : ``} is ${format(player.m.best)}.
                <br>You have spent ${formatTime(player.m.resetTime)} in this Big Rip.
                <br>You will gain ${formatWhole(new Decimal(5).pow(player.m.points.log10().div(308)))} Stellar Remnants on Supernova, which is not implemented yet.`
            }

            str = str + bigRipStr

            return str
        }]
    ]
})
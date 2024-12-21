addLayer("s", {
    name: "shards", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        
        //effect from shards
        multiplier: new Decimal(1), //multiplier to replicanti speed
        rsMultiplier: new Decimal(1), //multiplier to replicanti shards

        //power on shards for the multiplier formula
        mulFormulaPow: new Decimal(1),

        best: new Decimal(0),
        total: new Decimal(0),
        gainExponent: new Decimal(0.25),

        upgrades: {
            11: new Decimal(0),
            12: new Decimal(0),
            13: new Decimal(0),
        },
        
        shardUpg1: new Decimal(0),
        shardUpg2: new Decimal(0),

        shardMeter: new Decimal(0),
        shardMeterCap: new Decimal(150),
        isFillingShards: false,
        drainRate: new Decimal(1),
        meterEff1: new Decimal(1),
        meterEff2: new Decimal(1),
        meterEff3: new Decimal(1),
        meterEff4: new Decimal(1),

        shardGainMultiplier: new Decimal(1),
    }},
    color: "#5739c4",
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "Replicanti Shards", // Name of prestige currency
    row: 1, // Row the layer is in on the tree (0 is the first row)
    baseAmount() {
        return player.r.points
    },
    type: "custom",
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        milestones = player.s.milestones

        player.s.drainRate = new Decimal(1)
        if (hasUpgrade("t", 23)) player.s.drainRate = player.s.drainRate.mul(2.5)

        //power effect to the RS effect
        player.s.mulFormulaPow = new Decimal(1)
            .mul(upgradeEffect("t", 22))

        //shard multiplier on replicanti speed
        player.s.multiplier = Decimal.log10(player.s.best.plus(1).pow(player.s.mulFormulaPow).pow(player.s.meterEff4)).plus(1)
        if (hasUpgrade("t", 11)) player.s.multiplier = Decimal.log10(player.s.total.plus(1).pow(player.s.mulFormulaPow)).plus(1).pow(player.s.meterEff4)
        player.s.gainExponent = new Decimal(0.4)
            .plus(buyableEffect("r", 21))
        player.s.rsMultiplier = player.s.multiplier.pow(0.5)
        
        // meter effects
        player.s.meterEff1 = (player.s.shardMeter.max(1).div(2)).pow(0.3).plus(1)
        player.s.meterEff2 = (Decimal.div(player.s.shardMeter, 150).mul(10)).pow(0.85).plus(1)
        if (hasUpgrade("t", 13)) {
            player.s.meterEff3 = (player.s.shardMeter.max(1).div(3)).pow(0.25).plus(1)
        } else { player.s.meterEff3 = new Decimal(1) }
        if (hasUpgrade("t", 41) && player.s.shardMeter.gte(50000)) {
            player.s.meterEff4 = (player.s.shardMeter.sub(50000).max(1).log10()).pow(0.25)
        } else { player.s.meterEff4 = new Decimal(1) }
        
        // meter filling logic
        if (player.s.isFillingShards) {
            let drained = player.s.drainRate.mul(player.s.meterEff2).mul(diff).min(player.s.points)
            if (player.s.shardMeter.plus(drained).gte(player.s.shardMeterCap)) drained = drained.sub(drained.plus(player.s.shardMeter).sub(player.s.shardMeterCap))
            player.s.points = player.s.points.sub(drained)
            player.s.shardMeter = player.s.shardMeter.plus(drained)
        }

        player.s.shardMeterCap = hasUpgrade("t", 23) ? new Decimal(1500000) : new Decimal(150)

        player.s.shardGainMultiplier = new Decimal(1) //global multipliers, condensed into a variable to make equations easier
            .mul(player.s.meterEff1)
            .mul(buyableEffect("t", 12))
        
        if (hasUpgrade("t", 31)) player.s.shardGainMultiplier = player.s.shardGainMultiplier.mul(player.s.rsMultiplier)
            
    },
    buyables: {
    },

    getResetGain() {
        let mult = new Decimal(1) //global multipliers, condensed into a variable 
            .mul(player.s.meterEff1)
        return Decimal.max(player.r.points.div(1e15), 1).log10().pow(player.s.gainExponent).mul(player.s.shardGainMultiplier).floor()
    },

    getNextAt() {
        return getResetGain("s").plus(1).ceil().div(player.s.shardGainMultiplier).root(player.s.gainExponent).pow10().mul(1e15)
    },

    canReset() {
        return getResetGain("s").gte(1)
    },

    doReset() {
        shardUpg1 = new Decimal(0)
        shardUpg2 = new Decimal(0)

        shardMeter = new Decimal(0)
        shardMeterCap = new Decimal(150)
        isFillingShards = false
        drainRate = new Decimal(1)
        meterEff1 = new Decimal(1)
        meterEff2 = new Decimal(1)
        meterEff3 = new Decimal(1)
        meterEff4 = new Decimal(1)

        shardGainMultiplier = new Decimal(1)
    },

    tabFormat: [
        ["blank", "100px"],
        ["display-text", "Replicanti upgrades, unlike other upgrades, divide your Replicanti amount instead of subtracting from it."],
        ["display-text", "Replication speed is decreased the more Replicanti you have. The slowdown is increased beyond 1.8e308, and even more so beyond TBD."],
        "buyables",
    ],
    componentStyles: {
        "buyable"() {return {
            "background": "#0f0f0f",
            "border-color": "#1bbb36",
            "color": "#FFFFFF",
            "margin": "20px 0px 20px 0px",
            "border-radius": "5px",
            "height": "75px",
            "width": "240px"
        }},
    }
})

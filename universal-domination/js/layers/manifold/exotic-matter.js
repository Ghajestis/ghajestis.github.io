addLayer("em", {
    startData() {
        const data = {
            unlocked: true,
            strange: new Decimal(1),
            charmed: new Decimal(1),
            perfect: new Decimal(0),

            strangeVisualEffect1_Offset: 0,
            strangeVisualEffect2_Value: 255,

            charmedVisualEffect_Value: 0,
            charmedVisualEffect_Direction: true,

            strangeMatter_Paused: true,
            charmedMatter_Paused: true,
        }

        return data
    },

    color: "rgb(47, 231, 255)",

    values: {
        strangeMatterEffect() {
            return player.em.strange.clampMin(1).log10().pow(new Decimal(2).plus(buyableEffect("em", 23)))
        },

        strangeMatterFactor() {
            return player.points.clampMin(1).log(tmp.em.values.exoticMatterFormulaeScaling).clampMin(1).log(tmp.em.values.exoticMatterFormulaeScaling).div(2).clampMin(1)
            .root(player.em.strange.log10().div(1000).clampMin(1))
        },

        charmedMatterFactor() {
            return player.q.atoms.clampMin(1).log(tmp.em.values.exoticMatterFormulaeScaling).clampMin(1)
            .root(player.em.charmed.log10().div(1000).clampMin(1))
        },

        charmedMatterEffect() {
            let effect = new Decimal(1.5).sub(buyableEffect("em", 22).clampMin(0))
            return player.em.charmed.clampMin(1).log(effect).floor()
        },

        exoticMatterFormulaeScaling() {
            return buyableEffect("em", 21)
        },
    },

    update(diff) {
        player.em.strangeVisualEffect1_Offset += 0.15
        player.em.strangeVisualEffect2_Value = 1 - player.em.strangeVisualEffect1_Offset / 15

        if (player.em.charmedVisualEffect_Direction == false) {
            player.em.charmedVisualEffect_Value += 0.1
        } else {
            player.em.charmedVisualEffect_Value -= 0.1
        }

        if(player.em.charmedVisualEffect_Value >= 6) player.em.charmedVisualEffect_Direction = true
        if (player.em.charmedVisualEffect_Value <= 0) player.em.charmedVisualEffect_Direction = false

        if (player.em.strangeVisualEffect1_Offset > 15) player.em.strangeVisualEffect1_Offset = 0

        if (!player.em.charmedMatter_Paused) {
            player.em.charmed = player.em.charmed.mul(tmp.em.values.charmedMatterFactor.pow(diff))
        }

        if (!player.em.strangeMatter_Paused) {
            player.em.strange = player.em.strange.mul(tmp.em.values.strangeMatterFactor.pow(diff))
        }
    },

    buyables: {
        11: {
            cost(x) {
                return new Decimal(5).pow(x)
            },
            display() {
                return `Increase the Manifold Power Conversion Rate by +${format(0.1)}
                <br>Currently: +${format(this.effect())}
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).div(10)
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        12: {
            cost(x) {
                return new Decimal(5).pow(x).mul(2)
            },
            display() {
                return `Multiply Phase Shift strength by ×${format(1.5)}
                <br>Currently: ×${format(this.effect())}
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).pow_base(1.5)
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        13: {
            cost(x) {
                return new Decimal(5).pow(x).mul(5)
            },
            display() {
                return `Decaying Atoms start +${formatWhole(5)} later
                <br>Currently: +${formatWhole(this.effect())}
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).mul(5)
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        14: {
            cost(x) {
                return new Decimal(10).pow(x).mul(10)
            },
            display() {
                return `Double Perfect Matter gain
                <br>Currently: ×${formatWhole(this.effect())}
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).pow_base(2)
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        21: {
            cost(x) {
                return new Decimal(10).pow(x).mul(100)
            },
            display() {
                return `The Strange and Charmed Matter Factor formulae scale better
                (log${format(this.effect())} → log${format(this.effect().mul(0.8))})
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).pow_base(0.8).mul(10)
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        22: {
            cost(x) {
                return new Decimal(10).pow(x).mul(100)
            },
            display() {
                return `The Charmed Matter effect is better
                (log${format(new Decimal(1.5).sub(this.effect()))}(x) → log${new Decimal(1.5).sub(this.effect().plus(0.05))}(x))
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).div(20)
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        23: {
            cost(x) {
                return new Decimal(50).pow(x).mul(100)
            },
            display() {
                return `The Strange Matter effect is better
                (log10(x)^${format(this.effect())} → log10(x)^${format(this.effect().plus(0.1))})
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return new Decimal(2).plus(getBuyableAmount(this.layer, this.id).div(10))
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        24: {
            cost(x) {
                return new Decimal(50).pow(x).mul(250)
            },
            display() {
                return `Perfect Matter boosts Manifold Generators
                (x^${format(this.effect())} → x^${format(this.effect().plus(2))})
                Currently: ×${formatWhole(player.em.perfect.pow(this.effect()))}
                Costs: ${formatWhole(this.cost())} Perfect Matter`
            },
            effect() {
                return new Decimal(0).plus(getBuyableAmount(this.layer, this.id).mul(2))
            },
            canAfford() {
                return player.em.perfect.gte(this.cost())
            },
            buy() {
                player.em.perfect = player.em.perfect.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
    },

    clickables: {
        101: {
            title() {
                return `${!player.em.charmedMatter_Paused ? `<h5 style="display:table-cell;vertical-align:middle;">Pause your Charmed Matter` : `<h5 style="display:table-cell;vertical-align:middle;">Unpause your Charmed Matter`}`
            },
            unlocked() { return true },
            canClick() {
                return true
            },
            onClick() {
                player.em.charmedMatter_Paused = !player.em.charmedMatter_Paused
            },
            style: {
                "width":"120px",
                "height":"80px",
                "min-width":"0px",
                "min-height":"0px",
                "border-radius":"5px",
                "background-color":"rgb(234, 73, 248)",
            },
        },
        102: {
            title() {
                return `${!player.em.strangeMatter_Paused ? `<h5 style="display:table-cell;vertical-align:middle;">Pause your Strange Matter` : `<h5 style="display:table-cell;vertical-align:middle;">Unpause your Strange Matter`}`
            },
            canClick() {
                return true
            },
            onClick() {
                player.em.strangeMatter_Paused = !player.em.strangeMatter_Paused
            },
            style: {
                "width":"120px",
                "height":"80px",
                "min-width":"0px",
                "min-height":"0px",
                "border-radius":"5px",
                "background-color":"#85e933",
            },
        },
        103: {
            display() {
                return `<h3>Annihilate your Strange and Charmed Matter for ${formatWhole(this.gain())} Perfect Matter`
            },
            gain() {
                let sm = player.em.strange.log10().sub(30).clampMin(0)
                let cm = player.em.charmed.log10().sub(30).clampMin(0)
                let difference = sm.sub(cm).abs().clampMin("1e-308").recip().pow(0.33)

                return sm.plus(cm).div(100).mul(difference).mul(buyableEffect("em", 14)).floor()
            },
            canClick() {
                return this.gain().gte(1)
            },
            onClick() {
                player.em.perfect = player.em.perfect.plus(this.gain())
                player.em.charmed = new Decimal(1)
                player.em.strange = new Decimal(1)
            },
            style: {
                    "width":"200px",
                    "height":"100px",
                    "min-width":"0px",
                    "min-height":"0px",
                    "border-radius":"5px",
            }
        },
    },

    tabFormat: [
        ["row", [
            ["column", [
                ["display-text", function() {
                    return `<h3>You have 
                    <h2 style="color:rgb(234, 73, 248); text-shadow: 0 0 ${player.em.charmedVisualEffect_Value}px rgb(234, 73, 248);">${formatWhole(player.em.charmed)}</h2> 
                    <h3>Charmed Matter, which is
                    <br>creating 
                    <h2 style="color:rgb(234, 73, 248); text-shadow: 0 0 ${6 - player.em.charmedVisualEffect_Value}px rgb(234, 73, 248, 0.5)">${formatWhole(tmp.em.values.charmedMatterEffect)}</h2>
                    <h3>free Accelerator upgrades.
                    
                    <br><br><h3>Your Charmed Matter increases by a factor of 
                    <h2 style="color:rgb(234, 73, 248); text-shadow: 0 0 5px rgb(234, 73, 248)">×${format(tmp.em.values.charmedMatterFactor)}</h2>
                    <h3>each second,<br> based on your Atoms.`
                }],
                "blank",
                ["clickable", [101]]
            ]],
            ["column", [
                ["display-text", function() {
                    return `<h3>You have 
                    <h2 style="color:#85e933; text-shadow: ${player.em.strangeVisualEffect1_Offset}px ${-player.em.strangeVisualEffect1_Offset * 0.66}px ${player.em.strangeVisualEffect1_Offset / 2}px rgb(133, 233, 51, ${player.em.strangeVisualEffect2_Value}), ${-player.em.strangeVisualEffect1_Offset}px ${player.em.strangeVisualEffect1_Offset * 0.66}px ${player.em.strangeVisualEffect1_Offset / 2}px rgb(133, 233, 51, ${player.em.strangeVisualEffect2_Value});">${formatWhole(player.em.strange)}</h2> 
                    <h3>Strange Matter, which is
                    <br>increasing the strength of Atoms by
                    <h2 style="color:#85e933; text-shadow: 0 0 5px #85e933">${format(tmp.em.values.strangeMatterEffect)}%</h2><h3>.
                    
                    <br><br><h3>Your Strange Matter increases by a factor of 
                    <h2 style="color:#85e933; text-shadow: 0 0 5px #85e933">×${format(tmp.em.values.strangeMatterFactor)}</h2>
                    <h3>each second,<br> based on your Quarks.`
                }],
                "blank",
                ["clickable", [102]]
            ]],
        ]],
        ["blank", "100px"],
        ["column", [
            ["clickable", [103]],
            ["blank", "25px"],
            ["display-text", function() {
                return `<h3>You have
                <h2 style="color:rgb(47, 231, 255)">${formatWhole(player.em.perfect)}</h2>
                <h3>Perfect Matter.`
            }],
            ["blank", "50px"],
            "buyables",
        ]]
    ],

    componentStyles: {
        "column": {
            "min-width": "800px"
        },
        "buyable": {
            "width": "180px",
            "height": "100px",
            "border-radius": "5px",
            "margin-bottom": "10px",
            "font-size":"12px",
        }
    }
})
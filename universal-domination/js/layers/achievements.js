addLayer("ach", {
    name: "Achievements",
    symbol: "A",
    position: 0,
    startData() { return {
        points: new Decimal(0)
    }},
    color: "#f7e945",
    type: "none",
    row: "side",
    hotkeys: [],
    requires: new Decimal("1.8e308"),
    resource: "Achievement",

    achievements: {
        11: {
            // "is this x" meme format with AD icon
            name: "Is this antimatter?",
            done() { return player.q.generators[0].purchased.gte(1) },
            tooltip: "Buy a 1st Quark Generator.<br><i>Reward: First Quark Generator is 10 times cheaper",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        12: {
            // "screenshot of the first generator with the buy 10 button having another generator inside it"
            name: "Generating Generation",
            done() { return player.q.generators[1].purchased.gte(1) },
            tooltip: "Buy a 2nd Quark Generator.<br><i>Reward: First Quark Generator produces 10 times faster",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        13: {
            name: "Third time's the charm",
            done() { return player.q.generators[2].purchased.gte(1) },
            tooltip: "Buy a 3rd Quark Generator.<br><i>Reward: Second Quark Generator produces 10 times faster",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        14: {
            name: "???",
            done() { return player.q.generators[3].purchased.gte(1) },
            tooltip: "Buy a 4th Quark Generator.<br><i>Reward: Third Quark Generator produces 10 times faster",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        15: {
            name: "???",
            done() { return player.q.generators[4].purchased.gte(1) },
            tooltip: "Buy a 5th Quark Generator.<br><i>Reward: Fourth Quark Generator produces 10 times faster",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        16: {
            name: "???",
            done() { return player.q.generators[5].purchased.gte(1) },
            tooltip: "Buy a 6th Quark Generator.<br><i>Reward: Fifth Quark Generator produces 10 times faster",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        17: {
            // Image idea: literally just an image of uranus
            name: "Lucky number 7",
            done() { return player.q.generators[6].purchased.gte(1) },
            tooltip: "Buy a 7th Quark Generator.<br><i>Reward: Sixth Quark Generator produces 10 times faster",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        18: {
            name: "I'm not gonna say it",
            done() { return player.q.generators[7].purchased.gte(1) },
            tooltip: "Buy an 8th Quark Generator.<br><i>Reward: Seventh Quark Generator produces 10 times faster",
            unlocked() { return true },
            effect() { return hasAchievement(this.layer, this.id) ? new Decimal(10) : new Decimal(1) }
        },
        21: {
            // evil crunchy cat (image of crunchy cat with colors inverted)
            // rippy cat
            name: "RIPPED",
            done() { return player.m.resets.gte(1)},
            tooltip: "Big Rip. <br><i>Reward: Start every reset with 100 Quarks, and unlock Automation",
            unlocked() {return true}
        },
        22: {
            name: "Didn't need it anyway",
            done() { return player.m.ach22_req },
            tooltip: "Big Rip without any Atoms."
        },
        23: {
            // Image idea: reviewbrah in that famous video
            name: "My disappointment is immeasurable",
            done() { return player.m.generators[3].purchased.gt(0) },
            tooltip: "Purchase a 4th Manifold Generator."
        },
        24: {
            name: "Decelerator",
            done() { return player.m.ach24_done },
            tooltip: "Big Rip without ever purchasing any Accelerators."
        },
        25: {
            name: "Master of Manifolds",
            done() {
                for (const id of [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34]) {
                    if (!hasUpgrade("m", id)) return false
                }
                return true
            },
            tooltip: "Have every Manifold Upgrade.<br><i>Reward: Unlock Manifold Challenges"
        },
        26: {
            name: "Antimatter Dimensions reference #2147483647",
            done() { 
                for (const id of [11, 12, 13, 21, 22, 23, 31, 32, 33]) {
                    if (challengeCompletions("m", id) >= 1) {
                        return true
                    }
                }
                return false
            },
            tooltip: "Complete one Manifold Challenge."
        },
        27: {
            // image of all the buzz light-years on a shelf
            name: "It's all the same",
            done() {
                for (const id of [11, 12, 13, 21, 22, 23, 31]) {
                    if (challengeCompletions("m", id) < 2) return false
                }
                return true
            },
            tooltip: "Complete Manifold Challenges 1-7 twice. <br><i>Reward: You can now complete Manifold Challenge 9"
        },
        28: {
            // No image
            name: "THIS ACHIEVEMENT DOESN'T EXIST",
            done() { return player.points.gte("9.99e99999") },
            tooltip() {
                return `Have ${format(new Decimal("9.99e99999"))} Quarks.<br><i>Reward: For every power of ${format("9.99e999")} Quarks you have, increase the Interval Divisor by +0.00009<br>Currently: +${format(this.effect(), 4)}`
            },
            effect() {
                return player.points.log("9.99e999").mul(0.00009)
            }
        },
        31: {
            // krillin
            name: "I can taste that",
            done() { return player.m.manifoldConversionRate.gte(1) },
            tooltip: "Have the Manifold Power conversion rate be greater than 1."
        },
        32: {
            // some strange image of grillmaster: 76
            name: "Love the smell of particle annihilation in the morning",
            done() { return false },
            tooltip: `Annihilate your Strange and Charmed matter.<br><i>Reward: Strange and Charmed Matter Factors ×2 under ${format(1e30)}`
        },
        33: {
            // thanos
            name: "Perfectly balanced, as all things should be",
            done() { return false },
            tooltip: `Have ~${format("1.00e6969")} Strange and Charmed Matter.<br><i>Reward: The Factor softcap for Strange and Charmed Matter is slightly weaker`
        },
        34: {
            // dragon ball goku lying on the ground after being shot through the chest by piccolo meme
            name: "Do you enjoy pain?",
            done() { return false },
            tooltip: `Big rip with ${format("2.22e22222")} Quarks while inside Vapid Continuum, with no Interval or Intensity upgrades, and no Atoms.`
        },
        35: {
            // some 2000s meme, probably relating to leetspeak
            name: "Can I Haz m4n1f0ldz?",
            done() { return player.m.points.gte("1e1337")},
            tooltip: `Have ${format("1.00e1337")} Manifolds. <br><i>Reward: The Manifold formula is slightly improved (x/308 → x/300)`
        },
        38: {
            name: "From the ashes...",
            done() { return false },
            tooltip: `Go Supernova.<br><i>Reward: Manifold gain is multiplied by ${formatWhole(4)}`
        },
    },

    tabFormat: [
        "achievements"
    ],

    componentStyles: {
        "achievement": {
            "width": "120px",
            "height": "120px",
            "visibility": "visible",
            "border-radius": "5px",
            "margin": "10px",
        }
    }
})
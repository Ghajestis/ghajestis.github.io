addLayer("supernovaMilestones", {
    startData() { return {} },
    milestones: {
        11: {
            requirement() { return new Decimal(1) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Unlock Autobuyers for the repeatable Manifold Upgrades`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        12: {
            requirement() { return new Decimal(2) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Vacuum Deceleration Tier 1's effect is always active`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        13: {
            requirement() { return new Decimal(3) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Gain Big Rips each second equal to your Supernovae`
            },
            done() { return player.s.resets.gte(this.requirement()) },
            effect() { return player.s.resets },
            tooltip() { return `Currently: ${formatWhole(this.effect())} per second`}
        },
        14: {
            requirement() { return new Decimal(5) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Unlock Autobuyers for Manifold Generators`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        15: {
            requirement() { return new Decimal(6) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Manifold Upgrade 12 is always maxed`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        16: {
            requirement() { return new Decimal(7) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Manifold Generator amounts and Manifold Power no longer reset on Big Rip`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        17: {
            requirement() { return new Decimal(8) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Automatically purchase the one-time Manifold Upgrades as soon as they are affordable`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        18: {
            requirement() { return new Decimal(10) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">You keep Manifold Challenge completions on Supernova`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        19: {
            requirement() { return new Decimal(15) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Quark Generator Intervals are no longer capped at 10ms; Costs scale as if you had attained a Phase Shift`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        20: {
            requirement() { return new Decimal(20) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">The first two repeatable Manifold Upgrades no longer reset on Supernova`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        21: {
            requirement() { return new Decimal(25) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Manifold Upgrades no longer spend your Manifolds`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        22: {
            requirement() { return new Decimal(30) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Manifold Generator purchases no longer spend your Manifolds`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        23: {
            requirement() { return new Decimal(40) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">The Strange and Charmed Matter Factors are now always equal; Any boosts to one also affect the other. Auto pause is moved to the Automation menu`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        24: {
            requirement() { return new Decimal(50) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Annihilating for Perfect Matter now only reduces Strange and Charmed matter to ^0.1 of their value`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        25: {
            requirement() { return new Decimal(70) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Unlock Autobuyers for the Perfect Matter upgrades`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
        26: {
            requirement() { return new Decimal(100) },
            requirementDescription() {
                return `<h3 style="position:relative; left:0; top:-32px; text-align:left !important; color: var(--color_dim); width: 300px; display: inline-block; font-weight: lighter;">
                ${formatWhole(this.requirement())} ${pluralize("Supernova", this.requirement())}`
            },
            effectDescription() {
                return `<h5 style="position:relative">Passively gain Supernovae based on your fastest Supernova`
            },
            done() { return player.s.resets.gte(this.requirement()) }
        },
    },

    tabFormat: [
        ["row", [
            ["milestone", [11]], ["milestone", [12]], ["milestone", [13]]
        ]],
        ["row", [
            ["milestone", [14]], ["milestone", [15]], ["milestone", [16]],
        ]],
        ["row", [
            ["milestone", [17]], ["milestone", [18]], ["milestone", [19]]
        ]],
        ["row", [
            ["milestone", [20]], ["milestone", [21]], ["milestone", [22]]
        ]],
        ["row", [
            ["milestone", [23]], ["milestone", [24]], ["milestone", [25]]
        ]],
        ["row", [
            ["milestone", [26]]
        ]],
    ],

    componentStyles: {
        "milestone": {
            "width": "300px",
            "height": "80px",
            "margin": "10px",
            "margin-top": "20px",
            "display": "inherit",
        }
    }
})
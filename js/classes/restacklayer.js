class ReStackLayer
{
    constructor()
    {
        this.layerCoins = new Decimal(0);
        this.timeSpent = 0;
        this.timesReset = 0;
        this.permUpgrades = {
            prestigeGains: new RestackLayerUpgrade("All Prestige gains are higher",
                level => this.getPermUpgradeCost(),
                level => Decimal.pow(128, level), {
                    maxLevel: 2
                }),
            layerExponentialBoostFactorTime: new RestackLayerUpgrade("The Layer Exponential Factor increases over time",
                level => this.getPermUpgradeCost(),
                level => Math.min(1, this.timeSpent / 28800) * 3 * level.toNumber(), {
                    maxLevel: 2,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(4, "+")
                }),
            upgradeEffects: new RestackLayerUpgrade("All Upgrade Effects are stronger (including Tree Upgrades)",
                level => this.getPermUpgradeCost(),
                level => new Decimal(1).add(level.mul(2)), {
                    maxLevel: 2,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            powerGenerators: new RestackLayerUpgrade("All Power Generators are stronger",
                level => this.getPermUpgradeCost(),
                level => new Decimal(1).add(level.mul(0.15)), {
                    maxLevel: 2,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            aleph: new RestackLayerUpgrade("\"Increase your Aleph gain\" Upgrade scales better",
                level => this.getPermUpgradeCost(),
                level => 0.005 * level.toNumber(), {
                    maxLevel: 2,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(3, "+")
                }),
            layerExponentialBoostFactor: new RestackLayerUpgrade("The Layer Exponential Factor is higher",
                level => this.getPermUpgradeCost(),
                level => level.toNumber(), {
                    maxLevel: 2,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(0, "+")
                })
        };
        this.metaUpgrade = new RestackLayerUpgrade("All your Layer Resources are multiplied each second",
            level => new Decimal(1e10).mul(Decimal.pow(8, level)).mul(Decimal.pow(1.25, level.pow(1.25))),
            level => Decimal.pow(Decimal.add(1, Decimal.mul(level, 0.1)), level.add(1).log(2).add(1)).mul(level.add(1)),
            {getEffectDisplay: effectDisplayTemplates.numberStandard(2, "x")})
        this.upgradeTree = [
            [
                new RestackLayerUpgrade("Increase the Resource Multiplier",
                    level => new Decimal(1e20).pow(Decimal.pow(4, level)),
                    level => Decimal.pow(2.5, level.pow(0.6)),{
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "^")
                    })
            ],
            [
                new RestackLayerUpgrade("Resource Multipliers are stronger",
                    level => new Decimal(1e40).pow(Decimal.pow(5, level)),
                    level => Decimal.pow(5, level.pow(0.6)),{
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "^")
                    }),
                new RestackLayerUpgrade("Resource Multiplier Upgrades are stronger based on time spent this ReStack",
                level => new Decimal(1e40).pow(Decimal.pow(5, level)),
                level => new Decimal(1).add(Decimal.pow(2.5, level.pow(0.6)).sub(1).mul(this.timeSpent / 256)),{
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "^")
                    })
            ],
            [
                new RestackLayerUpgrade("Unlock Resource Powerers",
                    level => new Decimal(1e125),
                    level => level.gt(0), {
                        maxLevel: 1,
                        getEffectDisplay: function()
                        {
                            return this.level.gt(0) ? "Unlocked" : "Locked";
                        }
                    })
            ],
            [
                new RestackLayerUpgrade("Resource Powerers are stronger",
                    level => new Decimal("1e1800").pow(Decimal.pow(16, level)),
                    level => new Decimal(1).add(level.pow(0.5).mul(0.03)), {
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "^")
                    }),
                new RestackLayerUpgrade("Resource Multipliers are stronger",
                    level => new Decimal("1e1350").pow(Decimal.pow(16, level)),
                    level => new Decimal(1).add(level.pow(0.5).mul(3)), {
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "^")
                    })
            ],
            [
                new RestackLayerUpgrade("Your Layer gets substracted instead of reset when buying Upgrades",
                    level => new Decimal("1e7500"),
                    level => level.gt(0), {
                        maxLevel: 1,
                        getEffectDisplay: function()
                        {
                            return this.level.gt(0) ? "Unlocked" : "Locked";
                        }
                    })
            ],
            [
                new RestackLayerUpgrade("Resource Powerers are stronger",
                    level => new Decimal("1ee10").pow(Decimal.pow(1024, level)),
                    level => new Decimal(1).add(level.pow(0.4)), {
                        maxLevel: 5
                    }),
                new RestackLayerUpgrade("Resource Multipliers scale better to their level",
                    level => new Decimal("1ee10").pow(Decimal.pow(1024, level)),
                    level => new Decimal(1).add(level.pow(0.4).mul(0.02)), {
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "^")
                    }),
            ],
            [
                new RestackLayerUpgrade("Time since ReStack no longer resets",
                    level => new Decimal("1ee80"),
                    level => level.gt(0), {
                        maxLevel: 1,
                        getEffectDisplay: function()
                        {
                            return this.level.gt(0) ? "Doesn't reset" : "Resets";
                        }
                    }),
            ],
            [
                new RestackLayerUpgrade("Resource Powerers are stronger based on Layer coins",
                    level => new Decimal("1ee308").pow(Decimal.pow(1e20, level).mul(Decimal.pow(1e5, level.pow(1.25)))),
                    level => new Decimal (1).add(Decimal.mul(game.restackLayer.layerCoins.add(1).log(10).add(1).log(10).add(1).log(10).div(60), Decimal.max(0, level).pow(0.6))), {
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "x")
                    }),
                new RestackLayerUpgrade("Resource Multipliers are stronger based on Layer coins",
                    level => new Decimal("1ee308").pow(Decimal.pow(1e20, level).mul(Decimal.pow(1e5, level.pow(1.25)))),
                    level => new Decimal (1).add(Decimal.mul(game.restackLayer.layerCoins.add(1).log(10).add(1).log(10).add(1).log(10).div(80), Decimal.max(0, level).pow(0.6))), {
                        maxLevel: 5,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(3, "^")
                    }),
            ],
            [
                new RestackLayerUpgrade("Coming Soon...",
                    level => new Decimal("1ee1000"),
                    level => level.gt(0), {
                        maxLevel: 1,
                        getEffectDisplay: function()
                        {
                            return this.level.gt(0) ? "Doesn't reset" : "Resets";
                        }
                    }),
            ]
        ];
        this.upgradeTree[1][0].setRequirements([this.upgradeTree[0][0]], [this.upgradeTree[1][1]]);
        this.upgradeTree[1][1].setRequirements([this.upgradeTree[0][0]], [this.upgradeTree[1][0]]);
        this.upgradeTree[2][0].setRequirements([this.upgradeTree[1][0], this.upgradeTree[1][1]], []);
        this.upgradeTree[3][0].setRequirements([this.upgradeTree[2][0]], [this.upgradeTree[3][1]]);
        this.upgradeTree[3][1].setRequirements([this.upgradeTree[2][0]], [this.upgradeTree[3][0]]);
        this.upgradeTree[4][0].setRequirements([this.upgradeTree[3][0], this.upgradeTree[3][1]], []);
        this.upgradeTree[5][0].setRequirements([this.upgradeTree[4][0]], [this.upgradeTree[5][1]]);
        this.upgradeTree[5][1].setRequirements([this.upgradeTree[4][0]], [this.upgradeTree[5][0]]);
        this.upgradeTree[6][0].setRequirements([this.upgradeTree[5][0], this.upgradeTree[5][1]], []);
        this.upgradeTree[7][0].setRequirements([this.upgradeTree[6][0]], [this.upgradeTree[7][1]]);
        this.upgradeTree[7][1].setRequirements([this.upgradeTree[6][0]], [this.upgradeTree[7][0]]);
        this.upgradeTree[8][0].setRequirements([this.upgradeTree[7][0], this.upgradeTree[7][1]], []);
        this.upgradeTreeNames = {
            resourceMultiplier: this.upgradeTree[0][0],
            resourceMultiplierUpgrades: this.upgradeTree[1][0],
            resourceMultiplierUpgradesTime: this.upgradeTree[1][1],
            unlockResourcePowerers: this.upgradeTree[2][0],
            resourceMultiplierUpgrades2: this.upgradeTree[3][1],
            resourcePowerersUpgrades: this.upgradeTree[3][0],
            substractLayers: this.upgradeTree[4][0],
            resourcePowerersStrength: this.upgradeTree[5][0],
            resourceMultipliersLevelScaling: this.upgradeTree[5][1],
            noReset: this.upgradeTree[6][0],
            resourcePowerersStrength2: this.upgradeTree[7][0],
            resourceMultiplierUpgrades3: this.upgradeTree[7][1],
            FunctionUnlock: this.upgradeTree[8][0]
        };
    }

    isUnlocked()
    {
        return game.highestLayer >= 9;
    }

    getPermUpgradeCost()
    {
        return Decimal.pow(5, Object.values(this.permUpgrades).filter(u => u.level.gt(0)).length + Object.values(this.permUpgrades).filter(u => u.level.gt(1)).length);
    }

    getRestackGain()
    {
        const l = game.metaLayer.active ? game.metaLayer.layer : new Decimal(game.layers.length - 1);
        let gain = l >= 9 ? Decimal.pow(10, l.sub(9).floor()) : new Decimal(0);
        if (!game.metaLayer.active) {
            for (const layer of game.layers) {
                if (layer.hasChallenges() && layer.layer >= 9) {
                    for(const c of layer.challenges.filter(ch => ch.rewardType === CHALLENGE_REWARD_RESTACK))
                    {
                        gain = gain.mul(c.applyReward());
                    }
                }
            }
        }
        gain = gain.pow(this.LayerCoinsBonus())
        return gain
    }

    LayerCoinsBonus()
    {
        return new Decimal(1)
        .mul(game.functionsLayer.upgrades.MoreLayerCoins.apply());
    }

    allPermUpgradesBought()
    {
        return Object.values(this.permUpgrades).filter(u => u.level.eq(0)).length === 0;
    }

    respecPermUpgrades()
    {
        if(game.settings.confirmations && (!confirm("Are you sure you want to respec?") || this.allPermUpgradesBought()))
        {
            return;
        }
        this.restack(false);
        for(const k of Object.keys(this.permUpgrades))
        {
            if(this.permUpgrades[k].level.gt(0))
            {
                this.permUpgrades[k].level = new Decimal(0);
                this.layerCoins = this.layerCoins.add(this.getPermUpgradeCost());
            }
        }
    }

    respecUpgradeTree()
    {
        if(game.settings.confirmations && !confirm("Are you sure you want to respec? This will do a ReStack without reward and you won't get any Layer Coins back."))
        {
            return;
        }
        this.restack(false);
        for(const row of this.upgradeTree)
        {
            for(const upg of row)
            {
                upg.level = new Decimal(0);
            }
        }
    }

    restack(reward = true)
    {
        if(reward && game.settings.confirmations && !confirm("Are you sure you want to ReStack? You will lose all progress in exchange for Layer Coins."))
        {
            return;
        }
        if(reward)
        {
            this.layerCoins = this.layerCoins.add(this.getRestackGain());
            this.timesReset++;
        }
        game.currentChallenge = null;
        game.layers = [];
        functions.generateLayer(0);
        game.currentLayer = game.layers[0];
        if(this.upgradeTreeNames.noReset.level == 0) {
            this.timeSpent = 0;
        }
        if(game.metaLayer.active)
        {
            game.metaLayer.layer = new Decimal(0);
            game.metaLayer.resource = new Decimal(1);
        }
        game.highestUpdatedLayer = new Decimal(0);
        game.alephLayer = new AlephLayer();
        for(const k of Object.keys(game.automators))
        {
            game.automators[k].upgrade.level = new Decimal(0);
        }
        for(const k of Object.keys(game.volatility))
        {
            game.volatility[k].level = new Decimal(0);
        }
    }

    canMeta()
    {
        return game.highestLayer >= 47 && this.metaUpgrade.level.gt(0);
    }

    goMeta()
    {
        this.restack(false);
        game.metaLayer.active = true;
        functions.createNotification(new Notification(NOTIFICATION_SPECIAL, "Meta has given you infinite power, its time to make more layers!"));
    }

    tick(dt)
    {
        this.timeSpent += dt;
    }

    load(obj)
    {
        this.layerCoins = obj.layerCoins;
        this.timeSpent = obj.timeSpent;
        for(const k of Object.keys(obj.permUpgrades))
        {
            this.permUpgrades[k].level = obj.permUpgrades[k].level;
        }
        this.metaUpgrade.level = obj.metaUpgrade.level;
        if(obj.upgradeTree)
        {
            for(let r = 0; r < obj.upgradeTree.length; r++)
            {
                for(let c = 0; c < obj.upgradeTree[r].length; c++)
                {
                    this.upgradeTree[r][c].level = obj.upgradeTree[r][c].level;
                }
            }
        }
    }
}

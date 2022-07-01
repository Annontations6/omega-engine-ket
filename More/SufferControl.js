import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "suffer_control";
var name = "Suffer Control";
var description = "An implementation of... what? everything you buy will only works while offline";
var authors = "Annontations6, Throngjwk";
var version = 1;

var currency;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }

    // a2
    {
        let getDesc = (level) => "a_2=" + getA1(level).toString(0);
        a2 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(100, Math.log2(3))));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }

    // a3
    {
        let getDesc = (level) => "a_2=\\sqrt{" + (level + 1) + "}";
        a3 = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(1e4, Math.log2(1.75))));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getDesc(a3.level), getDesc(a3.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e14);
    theory.createBuyAllUpgrade(1, currency, 1e25);
    theory.createAutoBuyerUpgrade(2, currency, 1e60);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(15, 30));

    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "You Played!", "wowoowo", () => true);
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getA1(a1.level) *
                                   getA2(a2.level) *
                                   getA3(a3.level);
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = a_1";

    result += "a_2"

    result += "a_3"

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getA3 = (level) => BigNumber.from(1 + level).sqrt()

init();
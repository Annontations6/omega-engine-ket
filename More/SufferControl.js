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
        let getDesc = (level) => "a_3=\\sqrt{" + (level + 1) + "}";
        a3 = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(1e4, Math.log2(1.75))));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getDesc(a3.level), getDesc(a3.level + amount));
    }

    // c1
    {
        let getDesc = (level) => "c_1=\\sqrt{2^{" + level + "}}";
        c1 = theory.createUpgrade(3, currency, new FirstFreeCost(new ExponentialCost(1e4, Math.log2(5))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(4, currency, new FirstFreeCost(new ExponentialCost(1e6, Math.log2(2))));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getDesc(c2.level), getDesc(c2.level + amount));
    }

    // c3
    {
        let getDesc = (level) => "c_3=\\sqrt{2^{" + level + "}}";
        c3 = theory.createUpgrade(5, currency, new FirstFreeCost(new ExponentialCost(1e10, Math.log2(5))));
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level));
        c3.getInfo = (amount) => Utils.getMathTo(getDesc(c3.level), getDesc(c3.level + amount));
    }

    // a4
    {
        let getDesc = (level) => "a_4=\\sqrt{2^{" + level + "}}";
        a4 = theory.createUpgrade(6, currency, new FirstFreeCost(new ExponentialCost(1e10, Math.log2(5))));
        a4.getDescription = (_) => Utils.getMath(getDesc(a4.level));
        a4.getInfo = (amount) => Utils.getMathTo(getDesc(a4.level), getDesc(a4.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e14);
    theory.createBuyAllUpgrade(1, currency, 1e25);
    theory.createAutoBuyerUpgrade(2, currency, 1e60);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(15, 20));

    {
        a2Exp = theory.createMilestoneUpgrade(0, 2);
        a2Exp.description = Localization.getUpgradeIncCustomExpDesc("a_2", "0.075");
        a2Exp.info = Localization.getUpgradeIncCustomExpInfo("a_2", "0.075");
        a2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c1Exp = theory.createMilestoneUpgrade(1, 5);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.1");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.1");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c3Exp = theory.createMilestoneUpgrade(2, 2);
        c3Exp.description = Localization.getUpgradeIncCustomExpDesc("c_3", "0.2");
        c3Exp.info = Localization.getUpgradeIncCustomExpInfo("c_3", "0.2");
        c3Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        a1Exp = theory.createMilestoneUpgrade(3, 3);
        a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.1");
        a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.1");
        a1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        a4Exp = theory.createMilestoneUpgrade(4, 5);
        a4Exp.description = Localization.getUpgradeIncCustomExpDesc("a_4", "0.05");
        a4Exp.info = Localization.getUpgradeIncCustomExpInfo("a_4", "0.05");
        a4Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "You Played!", "wowoowo", () => true);

    updateAvailability();
}

var updateAvailability = () => {
    c1Exp.isAvailable = a2Exp.level > 0;
    c3Exp.isAvailable = a2Exp.level > 0;
    a1Exp.isAvailable = a2Exp.level > 0;
    a4Exp.isAvailable = a1Exp.level > 0;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getA1(a1.level).pow(getA1Exponent(a1Exp.level)) *
                                   getA2(a2.level).pow(getA2Exponent(a2Exp.level)) *
                                   getA3(a3.level) *
                                   getC1(c1.level).pow(getC1Exponent(c1Exp.level)) *
                                   getC2(c2.level) *
                                   getC3(c3.level).pow(getC3Exponent(c3Exp.level));
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = a_1";

    if (a1Exp.level == 1) result += "^{1.1}";
    if (a1Exp.level == 2) result += "^{1.2}";
    if (a1Exp.level == 3) result += "^{1.3}";

    result += "a_2"

    if (a2Exp.level == 1) result += "^{1.075}";
    if (a2Exp.level == 2) result += "^{1.15}";

    result += "a_3"

    result += "c_1"

    if (c1Exp.level == 1) result += "^{1.1}";
    if (c1Exp.level == 2) result += "^{1.2}";
    if (c1Exp.level == 3) result += "^{1.3}";
    if (c1Exp.level == 4) result += "^{1.4}";
    if (c1Exp.level == 5) result += "^{1.5}";

    result += "c_2"

    result += "c_3"

    if (c3Exp.level == 1) result += "^{1.2}";
    if (c3Exp.level == 2) result += "^{1.4}";

    result += "a_4"

    if (a4Exp.level == 1) result += "^{1.05}";
    if (a4Exp.level == 2) result += "^{1.1}";
    if (a4Exp.level == 3) result += "^{1.15}";
    if (a4Exp.level == 4) result += "^{1.2}";
    if (a4Exp.level == 5) result += "^{1.25}";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.1) / BigNumber.TWO;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.1}}{2}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getA3 = (level) => BigNumber.from(1 + level).sqrt();
var getC1 = (level) => BigNumber.TWO.pow(level).sqrt();
var getC2 = (level) => Utils.getStepwisePowerSum(level, 2, 7, 0);
var getC3 = (level) => BigNumber.TWO.pow(level).sqrt();
var getA2Exponent = (level) => BigNumber.from(1 + 0.075 * level);
var getC1Exponent = (level) => BigNumber.from(1 + 0.1 * level);
var getC3Exponent = (level) => BigNumber.from(1 + 0.2 * level);
var getA1Exponent = (level) => BigNumber.from(1 + 0.1 * level);

init();
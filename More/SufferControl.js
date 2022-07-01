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
        let getDesc = (level) => "a_1=" + getC1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }

    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "You Played!", "wowoowo", () => true);
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = a_1";
    
    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);

init();
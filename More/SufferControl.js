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

    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "You Played!", "wowoowo", () => true);
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

init();

//Game Values
var SETTINGS = {
    webgl: false,
};

var GENERAL = {
    version: "0.1"
};

var UNIVERSE = {
    size: 512,
};

var UPGRDATA = {
    bubbleValue: {
        cost: function(level) {
            return 25 * Math.pow(4, level-1);
        },
        value: function(level) {
            return Math.floor((level * (level-1))/2 + 1);
        }
    },
    maxBubbleValue: {
        cost: function(level) {
            return Math.floor((level * level * 50 + (25 * Math.pow(4, level-1))) /2);
        },
        value: function(level) {
            return level * (level) * 10 + 50;
        }
    },
    maxBubbleNumber: {
        cost: function(level) {
            return 25 * Math.pow(2, level);
        },
        value: function(level) {
            return 10 + (level-1)*2;
        },
    },
    autoSpawnRate: {
        cost: function(level) {
            return 500 * Math.pow(2, level);
        },
        value: function(level) {
            return level * (100/level);
        }
    },
    attractionRadius: {
        cost: function(level) {
            return 250 * Math.pow(2, level);
        },
        value: function(level) {
            return 5 + level*2;
        }
    },
    autoCollectorRate: {
        cost: function(level) {
            return 1000 * Math.pow(2, level);
        },
        value: function(level) {
            return level * (100/level);
        }
    },
    bubblesPerClick: {
        cost: function(level) {
            return 1000 * Math.pow(4, level)-2000;
        },
        value: function(level) {
            return level;
        }
    },
    mergeBonus: {
        cost: function(level) {
            return 10000 * Math.pow(2, level);
        },
        value: function(level) {
            return (level-1) * Math.pow(2, level-1);
        }
    },
    mergeGrowth: {
        cost: function(level) {
            return 500 * Math.pow(2, level);
        },
        value: function(level) {
            return level-1;
        }
    }
};

var MODIFIERS = {
    universe: {
        factor_size: 2.5, //Values: [1:4]
    },
    physic: {
        factor_generalSpeed: 1.5,
        factor_attractionRadius: 1,
        base_attractionRadius: 110,
        mergeBonus: UPGRDATA.mergeBonus.value(1),
        mergeGrowth: 0.05,
    },
    bubble: {
        startingValue: UPGRDATA.bubbleValue.value(1),
        maxValue: UPGRDATA.maxBubbleValue.value(1),
        maxBubbleNumber: UPGRDATA.maxBubbleNumber.value(1),
        bubblesPerClick: UPGRDATA.bubblesPerClick.value(1),
    },
    autospawner: {
        enabled: false,
        time: 1000,
    },
    autocollector: {
        enabled: false,
        time: 2000,
    }
};

var AUTOSPAWNER = {
    timer: 0,
};

var AUTOCOLLECTOR = {
    timer: 0,
};

// SAVED VALUES

var VALUES;
var STATISTICS;
var ACHIEVEMENTS;

function INIT() { // This is called to initialize values when no save file is there or when the save file is cleared
    VALUES = {
        currency: 0,
        spawner: {
            level: 1,
            spawnPerClick: 1,
        },
        upgradeLevel: {
            bubbleValue: 1,
            maxBubbleValue: 1,
            maxBubbleNumber: 1,
            autoSpawnRate: 1,
            attractionRadius: 1,
            autoCollectorRate: 1,
            bubblesPerClick: 1,
            mergeBonus: 1,
            mergeGrowth: 1,
        },
        prestigeLevel: 0,
        globalMultiplier: 1.0,
    };
    STATISTICS = {
        total: {
            collectedBubbles: 0,
            collectedValue: 0,
        }
    };
    ACHIEVEMENTS = {
        //Collector achievements
        beginnerCollector: false,
        advancedCollector: false,
        professionalCollector: false,
        masterCollector: false,
        godCollector: false,
        //Value achievements
        tinyValue: false,
        smallValue: false,
        mediumValue: false,
        bigValue: false,
        hugeValue: false,
        incredibleValue: false,
    };
    MODIFIERS.autocollector.enabled = false;
    MODIFIERS.autospawner.enabled = false;
}

function loadFromCookie() {
    INIT();
    if(localStorage.getItem('VALUES') !== null) {
        VALUES = {...VALUES, ...JSON.parse(localStorage.getItem('VALUES'))};
        STATISTICS = {...STATISTICS, ...JSON.parse(localStorage.getItem('STATISTICS'))};
        ACHIEVEMENTS = {...ACHIEVEMENTS, ...JSON.parse(localStorage.getItem('ACHIEVEMENTS'))};
    }
    if(!VALUES.upgradeLevel.mergeBonus) {
        VALUES.upgradeLevel.mergeBonus = 1;
    }
    if(!VALUES.upgradeLevel.mergeGrowth) {
        VALUES.upgradeLevel.mergeGrowth = 1;
    }
    if(VALUES.currency == NaN) {
        VALUES.currency = 0;
    }
    calculateTempValues();
    setInterval(saveToCookie, 10000);
}

function saveToCookie() {
    localStorage.setItem('VALUES', JSON.stringify(VALUES));
    localStorage.setItem('STATISTICS', JSON.stringify(VALUES));
    localStorage.setItem('ACHIEVEMENTS', JSON.stringify(VALUES));
    $("#stat_currency").notify("Autosaved.", "success");
}

function calculateTempValues() { //Calculate all values except those of VALUES and MODIFIERS (they are saved in cookies)
    MODIFIERS.bubble.startingValue = UPGRDATA.bubbleValue.value(VALUES.upgradeLevel.bubbleValue);
    MODIFIERS.bubble.maxValue = UPGRDATA.maxBubbleValue.value(VALUES.upgradeLevel.maxBubbleValue);
    MODIFIERS.bubble.maxBubbleNumber = UPGRDATA.maxBubbleNumber.value(VALUES.upgradeLevel.maxBubbleNumber);
    MODIFIERS.autospawner.time = 1000 - UPGRDATA.autoSpawnRate.value(VALUES.upgradeLevel.autoSpawnRate);
    MODIFIERS.autocollector.time = 2000 - UPGRDATA.autoCollectorRate.value(VALUES.upgradeLevel.autoCollectorRate);
    MODIFIERS.bubble.bubblesPerClick = UPGRDATA.bubblesPerClick.value(VALUES.upgradeLevel.bubblesPerClick);
    MODIFIERS.physic.mergeBonus = UPGRDATA.mergeBonus.value(VALUES.upgradeLevel.mergeBonus);
    MODIFIERS.physic.mergeGrowth = 0.05 + UPGRDATA.mergeGrowth.value(VALUES.upgradeLevel.mergeGrowth) * 0.05;
    VALUES.globalMultiplier = Math.pow(2,VALUES.prestigeLevel);
}

function updateAchievements() {
    if(STATISTICS.total.collectedBubbles >= 50 && !ACHIEVEMENTS.beginnerCollector) {
        ACHIEVEMENTS.beginnerCollector = true;
        $("#achievementsbtn").notify("Achievement Unlocked!", "info");
    }
    if(STATISTICS.total.collectedBubbles >= 200 && !ACHIEVEMENTS.advancedCollector) {
        ACHIEVEMENTS.advancedCollector = true;
        $("#achievementsbtn").notify("Achievement Unlocked!", "info");
    }
    if(STATISTICS.total.collectedBubbles >= 500 && !ACHIEVEMENTS.professionalCollector) {
        ACHIEVEMENTS.professionalCollector = true;
        $("#achievementsbtn").notify("Achievement Unlocked!", "info");
    }
    if(STATISTICS.total.collectedBubbles >= 1000 && !ACHIEVEMENTS.masterCollector) {
        ACHIEVEMENTS.masterCollector = true;
        $("#achievementsbtn").notify("Achievement Unlocked!", "info");
    }
}

//
function updateDeltaTimes() {
    //AUTOSPAWNER
    if(MODIFIERS.autospawner.enabled) {
        AUTOSPAWNER.timer += deltaTime;
        if(AUTOSPAWNER.timer > MODIFIERS.autospawner.time) {
            AUTOSPAWNER.timer = 0;
            spawnRandomBubble();
        }
    }

    if(MODIFIERS.autocollector.enabled) {
        AUTOCOLLECTOR.timer += deltaTime;
        //console.log(AUTOCOLLECTOR.timer);
        if(AUTOCOLLECTOR.timer > MODIFIERS.autocollector.time) {
            AUTOCOLLECTOR.timer = 0;
            collectRandomBubble();
        }
    }

    //
}

function clearCookieSave() {
    localStorage.removeItem('VALUES');
    localStorage.removeItem('STATISTICS');
    localStorage.removeItem('ACHIEVEMENTS');
    INIT();
    calculateTempValues();
    saveToCookie();
}

function prestigeReset() {
    localStorage.removeItem('VALUES');
    INIT();
    saveToCookie();
}
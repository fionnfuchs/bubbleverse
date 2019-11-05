
//Game Values
var SETTINGS = {
    webgl: false,
};

var GENERAL = {
    version: "0.02"
};

var UNIVERSE = {
    size: 512,
};

var UPGRDATA = {
    bubbleValue: {
        cost: function(level) {
            return 50 * Math.pow(3, level-1);
        },
        value: function(level) {
            return level;
        }
    },
    maxBubbleValue: {
        cost: function(level) {
            return 50 * Math.pow(2, level);
        },
        value: function(level) {
            return level * level * 50;
        }
    },
    maxBubbleNumber: {
        cost: function(level) {
            return 25 * Math.pow(2, level);
        },
        value: function(level) {
            return 10 + level;
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
    }
};

var MODIFIERS = {
    universe: {
        factor_size: 2, //Values: [1:4]
    },
    physic: {
        factor_generalSpeed: 1.5,
        factor_attractionRadius: 1,
        base_attractionRadius: 120,
    },
    bubble: {
        startingValue: UPGRDATA.bubbleValue.value(1),
        maxValue: UPGRDATA.maxBubbleValue.value(1),
        maxBubbleNumber: UPGRDATA.maxBubbleNumber.value(1),
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
}

function loadFromCookie() {
    INIT();
    if($.cookie("VALUES") != null) {   
        VALUES = {...VALUES, ...JSON.parse($.cookie("VALUES"))};
        STATISTICS = {...STATISTICS, ...JSON.parse($.cookie("STATISTICS"))};
        ACHIEVEMENTS = {...ACHIEVEMENTS, ...JSON.parse($.cookie("ACHIEVEMENTS"))};
    }
    
    setInterval(saveToCookie, 10000);
}

function saveToCookie() {
    $.cookie("VALUES", JSON.stringify(VALUES));
    $.cookie("STATISTICS", JSON.stringify(STATISTICS));
    $.cookie("ACHIEVEMENTS", JSON.stringify(ACHIEVEMENTS));
    $("#stat_currency").notify("Autosaved.", "success");
}

function calculateTempValues() { //Calculate all values except those of VALUES and MODIFIERS (they are saved in cookies)
    MODIFIERS.bubble.startingValue = UPGRDATA.bubbleValue.value(VALUES.upgradeLevel.bubbleValue);
    MODIFIERS.bubble.maxValue = UPGRDATA.maxBubbleValue.value(VALUES.upgradeLevel.maxBubbleValue);
    MODIFIERS.bubble.maxBubbleNumber = UPGRDATA.maxBubbleNumber.value(VALUES.upgradeLevel.maxBubbleNumber);
    MODIFIERS.autospawner.time = 1000 - UPGRDATA.autoSpawnRate.value(VALUES.upgradeLevel.autoSpawnRate);
    MODIFIERS.autocollector.time = 2000 - UPGRDATA.autoCollectorRate.value(VALUES.upgradeLevel.autoCollectorRate);
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
    $.cookie("VALUES", null);
    $.cookie("STATISTICS", null);
    $.cookie("ACHIEVEMENTS", null);
    INIT();
    calculateTempValues();
    saveToCookie();
}

function prestigeReset() {
    $.cookie("VALUES", null);
    INIT();
    calculateTempValues();
    saveToCookie();
}
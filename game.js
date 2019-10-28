
//Game Values
var SETTINGS = {
    webgl: false,
}

var UNIVERSE = {
    size: 512,
}

var UPGRDATA = {
    bubbleValue: {
        cost: [50,200,300,400,500], // The cost of index 0 is for the upgrade to index 1
        value: [1,2,3,4,5,6],
    },
    maxBubbleValue: {
        cost: [100,300,600,1000,1500], // The cost of index 0 is for the upgrade to index 1
        value: [50,100,200,300,500,800], 
    },
    maxBubbleNumber: {
        cost: [25,100,150,200,250], // The cost of index 0 is for the upgrade to index 1
        value: [10,12,14,16,18,20], 
    },
    autoSpawnRate: {
        cost: [1000,2000,3000,4000,5000], // The cost of index 0 is for the upgrade to index 1
        value: [0,100,200,300,400,500,600],
    },
}

var MODIFIERS = {
    universe: {
        factor_size: 1.5, //Values: [1:4]
    },
    physic: {
        factor_generalSpeed: 2,
        factor_attractionRadius: 1,
        base_attractionRadius: 100,
    },
    bubble: {
        startingValue: UPGRDATA.bubbleValue.value[0],
        maxValue: UPGRDATA.maxBubbleValue.value[0],
        maxBubbleNumber: UPGRDATA.maxBubbleNumber.value[0],
    },
    autospawner: {
        enabled: true,
        time: 1000,
    },
    autocollector: {
        
    }
}

var AUTOSPAWNER = {
    timer: 0,
}

// SAVED VALUES

var VALUES;
var STATISTICS;

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
        }
    };
    STATISTICS = {
        total: {
            collectedBubbles: 0,
            collectedValue: 0,
        }
    };
}

function loadFromCookie() {
    if($.cookie("VALUES") != null) {   
        VALUES = JSON.parse($.cookie("VALUES"));
        STATISTICS = JSON.parse($.cookie("STATISTICS"));
    }
    
    setInterval(saveToCookie, 10000);
}

function saveToCookie() {
    $.cookie("VALUES", JSON.stringify(VALUES));
    $.cookie("STATISTICS", JSON.stringify(STATISTICS));
}

function calculateTempValues() { //Calculate all values except those of VALUES and MODIFIERS (they are saved in cookies)
    MODIFIERS.bubble.startingValue = UPGRDATA.bubbleValue.value[VALUES.upgradeLevel.bubbleValue-1];
    MODIFIERS.bubble.maxValue = UPGRDATA.maxBubbleValue.value[VALUES.upgradeLevel.maxBubbleValue-1];
    MODIFIERS.bubble.maxBubbleNumber = UPGRDATA.maxBubbleNumber.value[VALUES.upgradeLevel.maxBubbleNumber-1];
    MODIFIERS.autospawner.time = 1000 - UPGRDATA.autoSpawnRate.value[VALUES.upgradeLevel.autoSpawnRate-1];
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

    //
}

function clearCookieSave() {
    $.cookie("VALUES", null);
    $.cookie("STATISTICS", null);
    INIT();
    calculateTempValues();
    saveToCookie();
}
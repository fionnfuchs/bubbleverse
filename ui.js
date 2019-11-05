var UISTATE = {
    mainMenuState: 0,
    sidebarMenuState: 0,
}

$( document ).ready(function() {
    $.notify.defaults( {
        autoHideDelay: 1000,
    });
    hideThings();
    initializeButtons();

    setInterval(updateUI, 100);
});

function hideThings() {
    $('#menu_container').hide();
    UISTATE.mainMenuState = 0;
}

function initializeButtons () {
    $('#spawnbtn').click(function () {
        spawnRandomBubble();
    });
    $('#achievementsbtn').click(function () {
        if(UISTATE.mainMenuState != 1) {
            $('#p5_canvas_container').hide();    
            $('#menu_prestige').hide(); 
            $('#menu_container').show();
            $('#menu_achievements').show();
            UISTATE.mainMenuState = 1;   
        } else {
            $('#p5_canvas_container').show();  
            $('#menu_prestige').hide();  
            $('#menu_container').hide(); 
            $('#menu_achievements').hide();
            UISTATE.mainMenuState = 0;   
        }
    });
    $('#prestigebtn').click(function () {
        if(UISTATE.mainMenuState != 2) {
            $('#p5_canvas_container').hide();    
            $('#menu_container').show(); 
            $('#menu_prestige').show(); 
            $('#menu_achievements').hide(); 
            UISTATE.mainMenuState = 2;   
        } else {
            $('#p5_canvas_container').show();    
            $('#menu_container').hide(); 
            $('#menu_prestige').hide(); 
            $('#menu_achievements').hide(); 
            UISTATE.mainMenuState = 0;   
        }
    });
    $('#buy_upgr_mbv').click(function () {
        if(VALUES.currency >= UPGRDATA.maxBubbleValue.cost(VALUES.upgradeLevel.maxBubbleValue)) {
            VALUES.currency -= UPGRDATA.maxBubbleValue.cost(VALUES.upgradeLevel.maxBubbleValue);
            VALUES.upgradeLevel.maxBubbleValue++;
            $('#buy_upgr_mbv').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#buy_upgr_bv').click(function () {
        if(VALUES.currency >= UPGRDATA.bubbleValue.cost(VALUES.upgradeLevel.bubbleValue)) {
            VALUES.currency -= UPGRDATA.bubbleValue.cost(VALUES.upgradeLevel.bubbleValue);
            VALUES.upgradeLevel.bubbleValue++;
            $('#buy_upgr_bv').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#buy_upgr_mbnr').click(function () {
        if(VALUES.currency >= UPGRDATA.maxBubbleNumber.cost(VALUES.upgradeLevel.maxBubbleNumber)) {
            VALUES.currency -= UPGRDATA.maxBubbleNumber.cost(VALUES.upgradeLevel.maxBubbleNumber);
            VALUES.upgradeLevel.maxBubbleNumber++;
            $('#buy_upgr_mbnr').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#buy_upgr_asr').click(function () {
        if(VALUES.currency >= UPGRDATA.autoSpawnRate.cost(VALUES.upgradeLevel.autoSpawnRate)) {
            VALUES.currency -= UPGRDATA.autoSpawnRate.cost(VALUES.upgradeLevel.autoSpawnRate);
            VALUES.upgradeLevel.autoSpawnRate++;
            $('#buy_upgr_asr').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#buy_upgr_ar').click(function () {
        if(VALUES.currency >= UPGRDATA.attractionRadius.cost(VALUES.upgradeLevel.attractionRadius)) {
            VALUES.currency -= UPGRDATA.attractionRadius.cost(VALUES.upgradeLevel.attractionRadius);
            VALUES.upgradeLevel.attractionRadius++;
            $('#buy_upgr_ar').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#buy_upgr_acr').click(function () {
        if(VALUES.currency >= UPGRDATA.autoCollectorRate.cost(VALUES.upgradeLevel.autoCollectorRate)) {
            VALUES.currency -= UPGRDATA.autoCollectorRate.cost(VALUES.upgradeLevel.autoCollectorRate);
            VALUES.upgradeLevel.autoCollectorRate++;
            $('#buy_upgr_acr').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#resetbtn').click(function() {
        clearCookieSave();
        location.reload();
    });

    // AUTO ON OFF BUTTONS
    $("#upgr_acr_onoff").click(function() {
        MODIFIERS.autocollector.enabled = !MODIFIERS.autocollector.enabled;
    });

    $("#upgr_asr_onoff").click(function() {
        MODIFIERS.autospawner.enabled = !MODIFIERS.autospawner.enabled;
    });

    // SIDEBAR
    $("#sidebar_category_bubble_btn").click(function () {
        UISTATE.sidebarMenuState = 0;
        $("#sidebar_auto_upgrades").hide();
        $("#sidebar_physics_upgrades").hide();
        $("#sidebar_bubble_upgrades").show();
    });
    $("#sidebar_category_auto_btn").click(function () {
        UISTATE.sidebarMenuState = 1;
        $("#sidebar_auto_upgrades").show();
        $("#sidebar_physics_upgrades").hide();
        $("#sidebar_bubble_upgrades").hide();
    });
    $("#sidebar_category_physics_btn").click(function () {
        UISTATE.sidebarMenuState = 2;
        $("#sidebar_auto_upgrades").hide();
        $("#sidebar_physics_upgrades").show();
        $("#sidebar_bubble_upgrades").hide();
    });

    // PRESTIGE
    $("#btn_prestige_buy").click(function() {
        if(VALUES.currency > 20000) {
            prestigeReset();
            VALUES.globalMultiplier = 1.5;
            VALUES.prestigeLevel = 1;
        }
    });
}

function updateUI() {
    $('#stat_currency').html("<b>" + VALUES.currency + " $</b>");
    $('#stat_multiplier').html("Multiplier: <a style='color:#ED6A5A;'>" + Math.round(VALUES.globalMultiplier * 100) / 100 + "x</a>");

    // UPGRADE STATS
    $('#stat_upgr_bv_level').html("(" + VALUES.upgradeLevel.bubbleValue + ")");
    $('#stat_upgr_mbv_level').html("(" + VALUES.upgradeLevel.maxBubbleValue + ")");
    $('#stat_upgr_mbnr_level').html("(" + VALUES.upgradeLevel.maxBubbleNumber + ")");
    $('#stat_upgr_asr_level').html("(" + VALUES.upgradeLevel.autoSpawnRate + ")");
    $('#stat_upgr_ar_level').html("(" + VALUES.upgradeLevel.attractionRadius + ")");
    $('#stat_upgr_acr_level').html("(" + VALUES.upgradeLevel.autoCollectorRate + ")");

    $('#stat_next_bv').html(Math.round(UPGRDATA.bubbleValue.value(VALUES.upgradeLevel.bubbleValue+1)*VALUES.globalMultiplier));
    $('#stat_next_mbv').html(UPGRDATA.maxBubbleValue.value(VALUES.upgradeLevel.maxBubbleValue+1));
    $('#stat_next_mbnr').html(UPGRDATA.maxBubbleNumber.value(VALUES.upgradeLevel.maxBubbleNumber+1));
    $('#stat_next_asr').html(UPGRDATA.autoSpawnRate.value(VALUES.upgradeLevel.autoSpawnRate+1));
    $('#stat_next_ar').html(UPGRDATA.attractionRadius.value(VALUES.upgradeLevel.attractionRadius+1));
    $('#stat_next_acr').html(UPGRDATA.autoCollectorRate.value(VALUES.upgradeLevel.autoCollectorRate+1));

    $('#stat_upgr_bv_cost').html(UPGRDATA.bubbleValue.cost(VALUES.upgradeLevel.bubbleValue) + "$");
    $('#stat_upgr_mbv_cost').html(UPGRDATA.maxBubbleValue.cost(VALUES.upgradeLevel.maxBubbleValue) + "$");
    $('#stat_upgr_mbnr_cost').html(UPGRDATA.maxBubbleNumber.cost(VALUES.upgradeLevel.maxBubbleNumber) + "$");
    $('#stat_upgr_asr_cost').html(UPGRDATA.autoSpawnRate.cost(VALUES.upgradeLevel.autoSpawnRate) + "$");
    $('#stat_upgr_ar_cost').html(UPGRDATA.attractionRadius.cost(VALUES.upgradeLevel.attractionRadius) + "$");
    $('#stat_upgr_acr_cost').html(UPGRDATA.autoCollectorRate.cost(VALUES.upgradeLevel.autoCollectorRate) + "$");

    //$('#spawnbtn').html("<b>Spawn</b><a class='t12'>(" + (MODIFIERS.bubble.maxBubbleNumber - bubbles.length) + ")</a>");
    if(ACHIEVEMENTS.beginnerCollector)$("#ach_beginnerCollector").show();
    if(ACHIEVEMENTS.advancedCollector)$("#ach_advancedCollector").show();

    if(VALUES.prestigeLevel > 0) {
        $("#prestige_controls").hide();
        $("#sidebar_category_physics_btn").show();
    }

    if(VALUES.upgradeLevel.autoSpawnRate > 1) {
        $("#upgr_spawn_text").html("Bubbles spawn faster");
        $("#upgr_asr_onoff").show();
    } else {
        $("#upgr_spawn_text").html("Spawn bubbles automatically");
        $("#upgr_asr_onoff").hide();
    }

    if(VALUES.upgradeLevel.autoCollectorRate > 1) {
        $("#upgr_collect_text").html("Bubbles are collected faster");
        $("#upgr_acr_onoff").show();
    } else {
        $("#upgr_collect_text").html("Collect bubbles automatically");
        $("#upgr_acr_onoff").hide();
    }

    if(MODIFIERS.autocollector.enabled) {
        $("#upgr_acr_onoff").html("ON");
    } else {
        $("#upgr_acr_onoff").html("OFF");
    }

    if(MODIFIERS.autospawner.enabled) {
        $("#upgr_asr_onoff").html("ON");
    } else {
        $("#upgr_asr_onoff").html("OFF");
    }
}
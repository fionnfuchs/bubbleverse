var UISTATE = {
    mainMenuState: 0,
}

$( document ).ready(function() {
    $.notify.defaults( {
        autoHideDelay: 500,
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
    $('#menubtn').click(function () {
        if(UISTATE.mainMenuState == 0) {
            $('#p5_canvas_container').hide();    
            $('#menu_container').show(); 
            UISTATE.mainMenuState = 1;   
        } else {
            $('#p5_canvas_container').show();    
            $('#menu_container').hide(); 
            UISTATE.mainMenuState = 0;   
        }
    });
    $('#buy_upgr_mbv').click(function () {
        if(VALUES.currency >= UPGRDATA.maxBubbleValue.cost[VALUES.upgradeLevel.maxBubbleValue-1]) {
            VALUES.currency -= UPGRDATA.maxBubbleValue.cost[VALUES.upgradeLevel.maxBubbleValue-1];
            VALUES.upgradeLevel.maxBubbleValue++;
            $('#buy_upgr_mbv').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#buy_upgr_bv').click(function () {
        if(VALUES.currency >= UPGRDATA.bubbleValue.cost[VALUES.upgradeLevel.bubbleValue-1]) {
            VALUES.currency -= UPGRDATA.bubbleValue.cost[VALUES.upgradeLevel.bubbleValue-1];
            VALUES.upgradeLevel.bubbleValue++;
            $('#buy_upgr_bv').notify("Bought!", "success");
            calculateTempValues();
        }
    });
    $('#buy_upgr_mbnr').click(function () {
        if(VALUES.currency >= UPGRDATA.maxBubbleNumber.cost[VALUES.upgradeLevel.maxBubbleNumber-1]) {
            VALUES.currency -= UPGRDATA.maxBubbleNumber.cost[VALUES.upgradeLevel.maxBubbleNumber-1];
            VALUES.upgradeLevel.maxBubbleNumber++;
            $('#buy_upgr_mbnr').notify("Bought!", "success");
            calculateTempValues();
        }
    });
}

function updateUI() {
    $('#stat_currency').html("<b>" + VALUES.currency + " $</b>");
    $('#stat_currencyPerSecond').html("Multipliers: [WIP]");

    // UPGRADE STATS
    $('#stat_upgr_bv_level').html("(" + VALUES.upgradeLevel.bubbleValue + ")");
    $('#stat_upgr_mbv_level').html("(" + VALUES.upgradeLevel.maxBubbleValue + ")");
    $('#stat_upgr_mbnr_level').html("(" + VALUES.upgradeLevel.maxBubbleNumber + ")");

    $('#stat_next_bv').html(UPGRDATA.bubbleValue.value[VALUES.upgradeLevel.bubbleValue]);
    $('#stat_next_mbv').html(UPGRDATA.maxBubbleValue.value[VALUES.upgradeLevel.maxBubbleValue]);
    $('#stat_next_mbnr').html(UPGRDATA.maxBubbleNumber.value[VALUES.upgradeLevel.maxBubbleNumber]);

    $('#stat_upgr_bv_cost').html(UPGRDATA.bubbleValue.cost[VALUES.upgradeLevel.bubbleValue-1] + "$");
    $('#stat_upgr_mbv_cost').html(UPGRDATA.maxBubbleValue.cost[VALUES.upgradeLevel.maxBubbleValue-1] + "$");
    $('#stat_upgr_mbnr_cost').html(UPGRDATA.maxBubbleNumber.cost[VALUES.upgradeLevel.maxBubbleNumber-1] + "$");

    //$('#spawnbtn').html("<b>Spawn</b><a class='t12'>(" + (MODIFIERS.bubble.maxBubbleNumber - bubbles.length) + ")</a>");
}
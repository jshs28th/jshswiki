$("#editContainer").hide();

$("#editBtn").on('click', function(){

    $("#documentContainer").hide();
    $("#editContainer").slideToggle(500);
})

$("#exitBtn").on('click', function(){

    $("#editContainer").hide();
    $("#documentContainer").slideToggle(500);
})
$("#editBtn").click(function () {
    location.href = "../e/" + $(".documentTitle").text().replace(/ /gi, "%20");
});

$("#historyTxt").hide();


$("#historyBtn").click(function () {

    $("#historyTxt").load($(".documentTitle").text().replace(/ /gi, "%20") + ".txt");
    $(".inAndOut").slideToggle(200);
    $("#historyTxt").slideToggle(200);

});


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBo1n7N-LhS5DmtCSRqAIHcDeo6oT-heeA",
    authDomain: "jshswiki.firebaseapp.com",
    databaseURL: "https://jshswiki.firebaseio.com",
    projectId: "jshswiki",
    storageBucket: "jshswiki.appspot.com",
    messagingSenderId: "100649838292",
    appId: "1:100649838292:web:3b24692bb098faedff3d41",
    measurementId: "G-445Q0P6WKK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
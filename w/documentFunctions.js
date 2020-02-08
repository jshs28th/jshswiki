$("#editBtn").click(function () {
    location.href = "../e/" + $(".documentTitle").text().replace(/ /gi, "%20");
});

$("#historyTxt").hide();


$("#historyBtn").click(function () {

   $("#historyTxt").load($(".documentTitle").text().replace(/ /gi, "%20") + ".txt");
        $(".inAndOut").slideToggle(200);
        $("#historyTxt").slideToggle(200);

});

var firebaseConfig = {
    apiKey: "AIzaSyAU9GCIYpjhmHReymw8SU3ltCHiLO0tYx4",
    authDomain: "jshswiki-ac7c6.firebaseapp.com",
    databaseURL: "https://jshswiki-ac7c6.firebaseio.com",
    projectId: "jshswiki-ac7c6",
    storageBucket: "jshswiki-ac7c6.appspot.com",
    messagingSenderId: "924522495153",
    appId: "1:924522495153:web:9e5928457557b11361b690",
    measurementId: "G-BVSZGD97VR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
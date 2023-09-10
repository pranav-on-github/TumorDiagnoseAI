$(document).ready(function () {
  // Init
  $(".image-section").hide();
  $(".loader").hide();
  $("#result").hide();

  // Upload Preview
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").css(
          "background-image",
          "url(" + e.target.result + ")"
        );
        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#imageUpload").change(function () {
    $(".image-section").show();
    $("#btn-predict").show();
    $("#result").text("");
    $("#result").hide();
    readURL(this);
  });

  // Predict
  $("#btn-predict").click(function () {
    var form_data = new FormData($("#upload-file")[0]);

    // Show loading animation
    $(this).hide();
    $(".loader").show();

    // Make prediction by calling api /predict
    $.ajax({
      type: "POST",
      url: "/predict",
      data: form_data,
      contentType: false,
      cache: false,
      processData: false,
      async: true,
      success: function (y) {
        // Get and display the result
        obj = JSON.parse(y);
        labels = ["Glioma", "Meningioma", "No Tumor", "Pituitary"];
        ind = 0;
        for (let i = 0; i < labels.length; i++) {
          if (labels[i] === obj["pred"]) {
            ind = i;
            break;
          }
        }
        links = [obj["glink"], obj["mlink"], obj["nlink"], obj["plink"]];
        $(".loader").hide();
        $("#result").fadeIn(600);
        $("#result").text(" Result:  " + obj["pred"]);
        $("#glioma").text(obj["glioma"] + "%");
        $("#meningioma").text(obj["meningioma"] + "%");
        $("#notumor").text(obj["notumor"] + "%");
        $("#pituitary").text(obj["pituitary"] + "%");
        var ele = document.getElementById("linktoknow");
        ele.href = links[ind];
        var dia = document.getElementById("diag");
        if (ind === 2) {
          dia.innerHTML = `<span>
              "Hurray you are not diagnosed with Any tumor... But still click on
              the link below to be aware of Brain Tumors";
            </span>1`;
        }
        console.log("Success!");
      },
    });
  });
});

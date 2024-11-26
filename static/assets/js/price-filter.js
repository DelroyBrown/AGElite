// Trigger
$(function () {
  var params = new URLSearchParams(window.location.search);
  var $range = $(".js-range-slider"),
  $inputFrom = $(".js-input-from"),
  $inputTo = $(".js-input-to"),
  instance,
  min = Number(document.getElementById('filter-price-range').getAttribute('min')) || 0,
  max = Number(document.getElementById('filter-price-range').getAttribute('max')) || 0,
  prefix = document.getElementById('filter-price-range').getAttribute('prefix')
  from = 0,
  to = 0;
  var PriceArray = params.get('price')?params.get('price').split(','):[min,max];
  
  $range.ionRangeSlider({
    type: "double",
    min: min,
    max: max,   
    from: PriceArray[0],
    to: PriceArray[1],
    prefix: prefix,
    // prefix: "$ ",
    onStart: updateInputs,
    onChange: updateInputs,
    step: 100,
    prettify_enabled: true,
    prettify_separator: ".",
    values_separator: " - ",
    force_edges: true,
  });

  instance = $range.data("ionRangeSlider");

  function updateInputs(data) {
    from = "$" + data.from;
    to = "$" + data.to;

    $inputFrom.prop("value", from);
    $inputTo.prop("value", to);
  }

  $inputFrom.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < min) {
      val = min;
    } else if (val > to) {
      val = to;
    }

    instance.update({
      from: val,
    });
  });

  $inputTo.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < from) {
      val = from;
    } else if (val > max) {
      val = max;
    }

    instance.update({
      to: val,
    });
  });
});


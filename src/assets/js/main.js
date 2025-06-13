$(document).ready(function () {
  $(".ct_menu_bar").click(function () {
    $("main").addClass("ct_show");
  });
  $(".ct_close_sidebar").click(function () {
    $("main").removeClass("ct_show");
  });
});

// Dashbaord graph S
const options = {
  chart: {
    type: "line",
    height: 300,
    toolbar: { show: false },
  },
  series: [
    {
      name: "Reports",
      data: [
        20, 22, 23, 40, 50, 35, 52, 25, 45, 48, 47, 49, 90, 44, 53, 51, 48, 55,
        49, 56, 50, 47, 59, 60, 20, 21, 23, 57, 46, 45, 60, 58, 55, 53, 52, 51,
        49, 40, 45, 47, 50, 52, 48, 51,
      ],
    },
  ],
  xaxis: {
    categories: Array.from({ length: 44 }, (_, i) => i + 1),
    labels: {
      show: true,
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val + "%";
      },
    },
    max: 100,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " Reports";
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
};

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
// Dashbaord graph E

// Monthly Expence Graph S
var options2 = {
  chart: {
    type: "donut",
    height: 320,
  },
  series: [70, 5, 4, 3, 3, 2, 2, 2, 2, 2], // example values
  labels: [
    "Food",
    "Travel",
    "Clothing",
    "Insurance",
    "Gym",
    "Vehicle",
    "Tax",
    "Daycare",
    "Mobile",
  ],
  colors: [
    "#5e9eff",
    "#44d07e",
    "#ffb62e",
    "#ff4d4f",
    "#7d4fff",
    "#94bfff",
    "#25d366",
    "#ff9933",
    "#ff3366",
  ],
  legend: {
    position: "bottom",
    fontSize: "14px",
    markers: {
      width: 12,
      height: 12,
    },
  },
  dataLabels: {
    enabled: false,
  },
  plot2: {
    pie: {
      donut: {
        size: "65%",
      },
    },
  },
};

var chart2 = new ApexCharts(
  document.querySelector("#ct__monthly_expence"),
  options2
);
chart2.render();

// Monthly Expence Graph E

// Bugget Summary Graph S
var options3 = {
  chart: {
    type: "bar",
    height: 300,
  },
  series: [
    {
      name: "surplus",
      data: [46000, 49000, 52000, 55000, 58000, 60000],
    },
  ],
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  colors: ["#5e9eff"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: "45%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: "bottom",
    fontSize: "14px",
    markers: {
      width: 12,
      height: 12,
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return Math.round(val);
      },
    },
  },
};

var chart3 = new ApexCharts(
  document.querySelector("#ct_bugget_summary"),
  options3
);
chart3.render();
// Bugget Summary Graph E

var options4 = {
  chart: {
    type: "bar",
    height: 200,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "60%",
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#3B82F6", "#93C5FD", "#DBEAFE"], // Blue shades
  series: [
    {
      data: [2, 1.4, 1],
    },
  ],
  xaxis: {
    categories: ["Mortgage", "No Property", "HELOC"],
    labels: {
      style: {
        fontSize: "14px",
        colors: "#6B7280",
      },
    },
  },
  grid: {
    borderColor: "#e5e7eb",
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "14px",
        colors: "#6B7280",
      },
    },
  },
};

var chart4 = new ApexCharts(
  document.querySelector("#ct_property_chart"),
  options4
);
chart4.render();

$(document).ready(function () {
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  var current = 1;
  var steps = $("fieldset").length;

  setProgressBar(current);

  $(".ct_form_next").click(function () {
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //Add Class Active
    $("#ct_form_progressbar li")
      .eq($("fieldset").index(next_fs))
      .addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 500,
      }
    );
    setProgressBar(++current);
  });

  $(".previous").click(function () {
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //Remove class active
    $("#ct_form_progressbar li")
      .eq($("fieldset").index(current_fs))
      .removeClass("active");

    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 500,
      }
    );
    setProgressBar(--current);
  });

  function setProgressBar(curStep) {
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar").css("width", percent + "%");
  }

  $(".submit").click(function () {
    return false;
  });
});

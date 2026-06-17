document.addEventListener("DOMContentLoaded", function () {
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 後日設定する情報（電話番号・営業時間・定休日・古物商許可番号・Googleフォームなど）を反映
  var config = window.SITE_CONFIG || {};

  document.querySelectorAll("[data-config]").forEach(function (el) {
    var key = el.getAttribute("data-config");
    var value = config[key];

    if (value) {
      el.textContent = value;

      if (el.tagName === "A" && el.hasAttribute("data-config-href")) {
        el.setAttribute("href", value);
      }
    }
  });

  // Googleフォームへのリンク（href）をまとめて設定
  if (config.googleFormUrl) {
    document.querySelectorAll("[data-google-form]").forEach(function (el) {
      el.setAttribute("href", config.googleFormUrl);
    });
  }
});

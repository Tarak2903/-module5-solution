$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {
  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/{{short_name}}.json";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    return string.replace(new RegExp(propToReplace, "g"), propValue);
  };

  document.addEventListener("DOMContentLoaded", function () {
    showLoading("#main-content");

    $ajaxUtils.sendGetRequest(allCategoriesUrl, function (categories) {
      var randomIndex = Math.floor(Math.random() * categories.length);
      var randomCategoryShortName = categories[randomIndex].short_name;

      $ajaxUtils.sendGetRequest(homeHtml, function (homeHtmlResponse) {
        var updatedHome = insertProperty(homeHtmlResponse, "randomCategoryShortName", "'" + randomCategoryShortName + "'");
        insertHtml("#main-content", updatedHome);
      }, false);
    });
  });

  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(menuItemsUrl.replace("{{short_name}}", categoryShort),
      buildAndShowMenuItemsHTML);
  };

  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    $ajaxUtils.sendGetRequest(menuItemsTitleHtml, function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(menuItemHtml, function (menuItemHtml) {
        var finalHtml = menuItemsTitleHtml + "<section class='row'>";

        for (var i = 0; i < categoryMenuItems.menu_items.length; i++) {
          var item = categoryMenuItems.menu_items[i];
          var html = menuItemHtml;
          html = insertProperty(html, "name", item.name);
          html = insertProperty(html, "description", item.description);
          finalHtml += html;
        }

        finalHtml += "</section>";
        insertHtml("#main-content", finalHtml);
      }, false);
    }, false);
  }

  global.$dc = dc;
})(window);

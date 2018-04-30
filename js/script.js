var burgerBtn = document.querySelector(".main-nav__burger");
var mainMenu = document.querySelector(".main-nav");

(function () { // IE NodeList Polyfill //
  if ( typeof NodeList.prototype.forEach === "function" ) return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

burgerBtn.addEventListener("click", function(evt) {
  evt.preventDefault();
  mainMenu.classList.toggle("main-nav--open");
  burgerBtn.classList.toggle("burger--open");
});

//Justified-Gallery
if ($(".gallery__list").length > 0){
    $(".gallery__list").justifiedGallery({
    lastRow : "nojustify",
    rowHeight : 140,
    rel : 'gallery1',
    margins : 2
}).on("jg.complete", function () {
    $(this).find("a").colorbox({
        maxWidth : "80%",
        maxHeight : "80%",
        opacity : 0.8,
        transition : "elastic",
        current : ""
    });
});
}

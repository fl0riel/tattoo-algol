var burgerBtn = document.querySelector(".main-nav__burger");
var mainMenu = document.querySelector(".main-nav");

(function () { // IE NodeList Polyfill //
  if ( typeof NodeList.prototype.forEach === "function" ) return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

// mainNavs.forEach(function(mainNav){
//   mainNav.classList.add("main-nav__block--close");
// });

burgerBtn.addEventListener("click", function(evt) {
  evt.preventDefault();
  mainMenu.classList.toggle("main-nav--open");
  burgerBtn.classList.toggle("burger--open");
});

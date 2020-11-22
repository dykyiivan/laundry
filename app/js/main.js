

$(function(){
  $(".slider__images").slick({
    dots: false,
    arrows: true,
    prevArrow:
      '<button type="button" class="slick-prev"><img src="images/dest/left-arrow.svg">/button>',
    nextArrow:
      '<button type="button" class="slick-next"><img src="images/dest/right-arrow.svg">/button>',
    responsive: [
      {
        breakpoint: 670,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  });

  $(".header__menu-mobile").on("click", function(){
    $(".header__menu").toggleClass("active");
  });
});
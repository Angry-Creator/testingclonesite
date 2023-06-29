jQuery('.testimonials__container').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
	arrows: true,
	responsive: [
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 2,
      }
    },
	{
      breakpoint: 700,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
});
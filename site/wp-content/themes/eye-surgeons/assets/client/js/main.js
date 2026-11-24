jQuery(document).ready(function($) {

    let isTreatmentStickyCounterVisible = true;
    let surgeonsFilters = {
        'search_term': '',
        'treatments': [],
        'locations': []
    };

    let treatmentsFilters = {
        'search_term': '',
        'treatments': []
    };

    let contactUsFormData = {
        'first_name': '',
        'last_name': '',
        'email': '',
        'phone_number': '',
        'treatments': '',
        'locations': '',
        'message': '',
    };

    var heroSwiper = new Swiper(".mySwiper", {
        grabCursor: false,
        effect: "creative",
        creativeEffect: {
            prev: {
                shadow: true,
                translate: [0, 0, -600],
                opacity: 0
            },
            next: {
                shadow: true,
                translate: [0, 0, -600],
                opacity: 1
            },
        },
        loop: true,
        pagination: {
            el: ".home-hero-swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"><span class="swiper-pagination-bullet-progress"></span></span>';
            },
        },
        speed: 700,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        on: {
            init: function() {
                setupHeroNavigationButtons(this);
            },
            autoplayTimeLeft: function(swiper, timeLeft, percentage) {
                updateProgressBar(swiper, percentage);
            }
        }
    });


    var heroMobileSwiper = new Swiper(".hero-mobile-swiper", {
        grabCursor: true,
        loop: true,
        slidesPerView: 1.3,
        spaceBetween: 16,
        centeredSlides: true,
        pagination: {
            el: ".home-mobile-hero-swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"><span class="swiper-pagination-bullet-progress"></span></span>';
            },
        },
        speed: 700,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        on: {
            init: function() {
                setupHeroNavigationButtons(this);
            },
            autoplayTimeLeft: function(swiper, timeLeft, percentage) {
                updateProgressBar(swiper, percentage);
            }
        }
    });

    var awardsMobileSwiper = new Swiper(".awards-mobile-swiper", {
        grabCursor: true,
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 16,
        centeredSlides: true,
        pagination: {
            el: ".home-mobile-awards-swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"><span class="swiper-pagination-bullet-progress"></span></span>';
            },
        },
        speed: 700,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        on: {
            autoplayTimeLeft: function(swiper, timeLeft, percentage) {
                updateProgressBar(swiper, percentage);
            }
        }
    });

    var comprehensiveMobileSwiper = new Swiper(".comprehensive-mobile-swiper", {
        grabCursor: true,
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 16,
        slidesOffsetBefore: 16,
        pagination: {
            el: ".home-mobile-comprehensive-swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"><span class="swiper-pagination-bullet-progress"></span></span>';
            },
        },
        speed: 700,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        on: {
            init: function() {
                setupHeroNavigationButtons(this);
            },
            autoplayTimeLeft: function(swiper, timeLeft, percentage) {
                updateProgressBar(swiper, percentage);
            }
        }
    });

    // Awards Slider
    var awardsSwiper = new Swiper(".awards-slider", {
        grabCursor: false,
        slidesPerView: 'auto',
        // spaceBetween: 24,
        loop: true,
        effect: "creative",
        creativeEffect: {
            limitProgress: 8,
            prev: {
                translate: [-150, 0, -820],
            },
            next: {
                translate: ["calc(100% + 10px)", 0, 0],
            },
        },
        navigation: {
            nextEl: ".awards-slider-swiper-button-next",
            prevEl: ".awards-slider-swiper-button-prev",
        },
        pagination: {
            el: ".awards-slider-swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"><span class="swiper-pagination-bullet-progress"></span></span>';
            },
        },
        speed: 700,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        on: {
            init: function() {
                this.slides.forEach(function(slide) {
                    slide.style.display = 'block';
                });
                scrollAwardsPaginationToActive(this);
            },
            slideChange: function() {
                this.slides.forEach(slide => slide.style.opacity = '0.5');
                this.slides[this.activeIndex].style.opacity = '1';
                scrollAwardsPaginationToActive(this);
            },
            autoplayTimeLeft: function(swiper, timeLeft, percentage) {
                updateProgressBar(swiper, percentage);
            }
        }
    });

    // Slider Functions
    function setupHeroNavigationButtons(swiperInstance) {
        var nextButton = document.querySelector('.home-hero-swiper-button-next');
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                swiperInstance.slideNext();
            });
        }

        var prevButton = document.querySelector('.home-hero-swiper-button-prev');
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                swiperInstance.slidePrev();
            });
        }
    }

    function updateProgressBar(swiperInstance, percentage) {
        let bullets = swiperInstance.pagination.bullets;
        let progressPercent = (1 - percentage) * 100;

        for (let i = 0; i < bullets.length; i++) {
            let bar = bullets[i].querySelector('.swiper-pagination-bullet-progress');
            if (bar) {
                bar.style.width = '0%';
            }
        }

        let activeBullet = null;
        for (let j = 0; j < bullets.length; j++) {
            if (bullets[j].classList.contains('swiper-pagination-bullet-active')) {
                activeBullet = bullets[j];
                break;
            }
        }

        if (activeBullet) {
            let activeProgressBar = activeBullet.querySelector('.swiper-pagination-bullet-progress');
            if (activeProgressBar) {
                activeProgressBar.style.width = progressPercent + '%';
            }
        }
    }

    var awardsPaginationScrollFrame = null;

    function scrollAwardsPaginationToActive(swiperInstance) {
        var paginationEl = document.querySelector('.awards-slider-swiper-pagination');
        if (!paginationEl) {
            return;
        }

        var activeBullet = null;
        if (swiperInstance && swiperInstance.pagination && swiperInstance.pagination.bullets) {
            var bullets = swiperInstance.pagination.bullets;
            for (var i = 0; i < bullets.length; i++) {
                if (bullets[i].classList.contains('swiper-pagination-bullet-active')) {
                    activeBullet = bullets[i];
                    break;
                }
            }
        }

        if (!activeBullet) {
            activeBullet = paginationEl.querySelector('.swiper-pagination-bullet-active');
        }

        if (!activeBullet) {
            return;
        }

        // Match CSS: inactive 0.416vw, active 2.5vw, transition 300ms
        var finalActiveWidth = window.innerWidth * 0.025;
        var currentWidth = activeBullet.offsetWidth;
        var widthDelta = Math.max(0, finalActiveWidth - currentWidth);
        var containerWidth = paginationEl.clientWidth;
        var bulletLeft = activeBullet.offsetLeft;
        var targetScrollLeft = bulletLeft - (containerWidth / 2) + (finalActiveWidth / 2);
        var maxScrollLeft = Math.max(0, paginationEl.scrollWidth + widthDelta - containerWidth);

        if (targetScrollLeft < 0) {
            targetScrollLeft = 0;
        } else if (targetScrollLeft > maxScrollLeft) {
            targetScrollLeft = maxScrollLeft;
        }

        if (awardsPaginationScrollFrame) {
            window.cancelAnimationFrame(awardsPaginationScrollFrame);
            awardsPaginationScrollFrame = null;
        }

        var startScrollLeft = paginationEl.scrollLeft;
        var distance = targetScrollLeft - startScrollLeft;

        if (Math.abs(distance) < 1) {
            paginationEl.scrollLeft = targetScrollLeft;
            return;
        }

        var duration = 300;
        var startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }

            var progress = Math.min((timestamp - startTime) / duration, 1);
            paginationEl.scrollLeft = startScrollLeft + (distance * easeInOutCubic(progress));

            if (progress < 1) {
                awardsPaginationScrollFrame = window.requestAnimationFrame(step);
            } else {
                awardsPaginationScrollFrame = null;
            }
        }

        awardsPaginationScrollFrame = window.requestAnimationFrame(step);
    }


    $('[data-counter]').each(function() {
        var $el = $(this);
        var counter = parseInt($el.attr('data-counter'), 10);
        var symbol = $el.attr('data-symbol') || '';
        var duration = 10000; // duration in milliseconds

        $({ countNum: 0 }).animate({ countNum: counter }, {
            duration: duration,
            easing: 'swing',
            step: function(now) {
                // Format number with commas as thousands separators
                var formatted = Math.floor(now).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $el.text(formatted + symbol);
            },
            complete: function() {
                var formatted = counter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $el.text(formatted + symbol); // ensure exact final value
            }
        });
    });

    // Initialize Lenis smooth scroll
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Integrate Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);

    // Horizontal Scroll for Comprehensive Section
    const comprehensiveSection = document.querySelector('.comprehensive-section');
    if (comprehensiveSection) {
        const gsapItems = comprehensiveSection.querySelector('#gsap-items > div');
        const cards = comprehensiveSection.querySelectorAll('card, .card');

        if (gsapItems && cards.length > 0) {
            // Enable GPU acceleration
            gsap.set(gsapItems, { force3D: true, willChange: 'transform' });

            // Calculate total scroll width (cached)
            let cachedScrollAmount = 0;

            const getScrollAmount = () => {
                if (cachedScrollAmount !== 0) return cachedScrollAmount;

                let cardsWidth = 0;
                cards.forEach(card => {
                    cardsWidth += card.offsetWidth + 24; // 24px is gap-6 (1.5rem)
                });

                // Calculate the scroll distance
                // Total width minus viewport + extra padding to ensure last cards are visible
                const viewportWidth = window.innerWidth;
                const containerPadding = 2000; // Extra padding to show last cards
                cachedScrollAmount = -(cardsWidth - viewportWidth + containerPadding);

                return cachedScrollAmount;
            };

            // Create horizontal scroll animation
            const horizontalScroll = gsap.to(gsapItems, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: comprehensiveSection,
                    start: "center center",
                    end: () => `+=${Math.abs(getScrollAmount())}`,
                    pin: true,
                    scrub: 0.5, // Reduced for smoother response
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    onRefresh: () => {
                        cachedScrollAmount = 0; // Reset cache on refresh
                    }
                }
            });

            // Debounced resize handler
            let resizeTimer;
            const handleResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    cachedScrollAmount = 0; // Reset cache
                    ScrollTrigger.refresh();
                }, 250);
            };

            window.addEventListener('resize', handleResize, { passive: true });
        }
    }

    // Personalised Care Section Animations with GSAP
    const personalisedSection = document.querySelector('.personalised-care');
    if (personalisedSection) {
        const personalisedVideo = personalisedSection.querySelector('.personalised-video');
        const personalisedTitle = personalisedSection.querySelector('.personalised-title');
        const personalisedSubtitle = personalisedSection.querySelector('.personalised-subtitle');
        const personalisedCta = personalisedSection.querySelector('.personalised-cta');

        // Create a timeline for all animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: personalisedSection,
                start: "center center",
                end: "+=2000",
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // Set initial states
        if (personalisedVideo) {
            gsap.set(personalisedVideo, {
                scale: 0.2,
                opacity: 0.2
            });
        }

        if (personalisedTitle) {
            gsap.set(personalisedTitle, {
                y: 60,
                opacity: 0
            });
        }

        if (personalisedSubtitle) {
            gsap.set(personalisedSubtitle, {
                y: 60,
                opacity: 0
            });
        }

        if (personalisedCta) {
            gsap.set(personalisedCta, {
                y: 60,
                opacity: 0
            });
        }

        // Add animations to timeline with specific positions
        if (personalisedVideo) {
            tl.to(personalisedVideo, {
                scale: 1,
                opacity: 1,
                duration: 2,
                ease: "power2.out"
            }, 0);
        }

        if (personalisedTitle) {
            tl.to(personalisedTitle, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, 0.3);
        }

        if (personalisedSubtitle) {
            tl.to(personalisedSubtitle, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, 0.6);
        }

        if (personalisedCta) {
            tl.to(personalisedCta, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, 0.9);
        }
    }

    AOS.init({
        once: true,
    });

    $('button.cta').hover(function () {
        const $svg = $(this).find('svg');
        let toggle = true;
        const intervalId = setInterval(() => {
            if (toggle) {
                $svg.removeClass('fade-in-left').addClass('fade-out-right');
            } else {
                $svg.removeClass('fade-out-right').addClass('fade-in-left');
            }
            toggle = !toggle;
        }, 400);

        $(this).data('animationInterval', intervalId);
    }, function () {
        clearInterval($(this).data('animationInterval'));
        $(this).removeData('animationInterval');
        const $svg = $(this).find('svg');
        $svg.removeClass('fade-in-left fade-out-right').css({opacity: '', transform: ''});
    });

    $('.search-input input').focus(function() {
        const searchInput = $(this).closest('.search-input');
        searchInput.removeClass('border-[#EDEDF0]').addClass('border-black');
    });

    $('.search-input input').blur(function() {
        const searchInput = $(this).closest('.search-input');
        searchInput.addClass('border-[#EDEDF0]').removeClass('border-black');
    });

    $('.search-input input').keyup(function() {
        const searchInput = $(this).closest('.search-input');

        if ($(this).val().length > 0) {
            searchInput.find('.clear-input').removeClass('scale-0');
        } else {
            searchInput.find('.clear-input').addClass('scale-0');
        }
    });

    $('.search-input .clear-input').click(function() {
        const searchInput = $(this).closest('.search-input');
        const input = searchInput.find('input');

        input.val('');
        $(this).addClass('scale-0');
        input.focus();

        surgeonsFilters.search_term = '';
        getSurgeonsData();
    });

    // Close all dropdowns when clicking outside dropdown-container
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.dropdown-container').length) {
            $('.dropdown-container').each(function() {
                $(this).find('.dropdown-list').addClass('-translate-y-5 scale-0');
                $(this).find('.dropdown-select-arrow svg').removeClass('rotate-180');
                $(this).find('.dropdown-select').data('is-focused', 'false');
            });
            $('.dropdown-list').data('is-focused', 'false');
            updateDesktopFilterStates();
        }
    });

    // Toggle dropdown on button click
    $('.dropdown-select').on('click', function(event) {
        event.stopPropagation();

        const $container = $(this).closest('.dropdown-container');
        const isFocused = $(this).data('is-focused') === 'true';

        // Close ALL OTHER dropdowns
        $('.dropdown-container').not($container).each(function() {
            $(this).find('.dropdown-list').addClass('-translate-y-5 scale-0');
            $(this).find('.dropdown-select-arrow svg').removeClass('rotate-180');
            $(this).find('.dropdown-select').data('is-focused', 'false');
        });

        // Toggle CURRENT dropdown
        $container.find('.dropdown-list').toggleClass('-translate-y-5 scale-0');
        $container.find('.dropdown-select-arrow svg').toggleClass('rotate-180');
        $(this).data('is-focused', !isFocused);

        updateDesktopFilterStates();
    });

    $('.dropdown-list .dropdown-list-item').click(function() {
        const source = $(this).data('source');
        const filter = $(this).data('filter');
        const filterValue = $(this).data('filter-value');

        appendNewSurgeonsFilter(filter, filterValue, source);
    });

    function appendNewSurgeonsFilter(filter, value, source) {
        if (source === 'surgeons') {
            const index = surgeonsFilters[filter].indexOf(value);
            if (index === -1) {
                surgeonsFilters[filter].push(value);
            } else {
                surgeonsFilters[filter].splice(index, 1);
            }

            updateSurgeonsFilters('surgeons');
            updateFilterDropdownLabels('surgeons');
            getSurgeonsData();
        } else if (source === 'treatments') {
            const index = treatmentsFilters[filter].indexOf(value);
            if (index === -1) {
                treatmentsFilters[filter].push(value);
            } else {
                treatmentsFilters[filter].splice(index, 1);
            }

            updateSurgeonsFilters('treatments');
            updateFilterDropdownLabels('treatments');
            getTreatmentsData();
        }
    }

    function updateSurgeonsFilters(source) {
        $('.dropdown-list-item[data-filter="treatments"], .dropdown-list-item[data-filter="locations"]')
            .find('.dropdown-list-item-toggle').removeClass('bg-black border-black')
            .find('svg').addClass('scale-0');

        if (source === 'surgeons') {
            surgeonsFilters.treatments.forEach(function(element, index, array) {
                const filterItem = $('.dropdown-list-item[data-filter="treatments"][data-filter-value="' + element + '"]');
                filterItem.find('.dropdown-list-item-toggle').addClass('bg-black border-black');
                filterItem.find('svg').removeClass('scale-0');
            });
            surgeonsFilters.locations.forEach(function(element, index, array) {
                const filterItem = $('.dropdown-list-item[data-filter="locations"][data-filter-value="' + element + '"]');
                filterItem.find('.dropdown-list-item-toggle').addClass('bg-black border-black');
                filterItem.find('svg').removeClass('scale-0');
            });
        } else if (source === 'treatments') {
            treatmentsFilters.treatments.forEach(function(element, index, array) {
                const filterItem = $('.dropdown-list-item[data-filter="treatments"][data-filter-value="' + element + '"]');
                filterItem.find('.dropdown-list-item-toggle').addClass('bg-black border-black');
                filterItem.find('svg').removeClass('scale-0');
            });
        }
    }

    function updateDesktopFilterStates() {
        $('.dropdown-select').each(function(index, item) {
            if ($(item).data('is-focused') == true) {
                $(item).addClass('border-black');
            } else {
                $(item).removeClass('border-black');
            }
        });
    }

    function updateFilterDropdownLabels(source) {
        $('.dropdown-select').each(function(index, item) {
            const $dropdown = $(item);
            const filter = $dropdown.data('filter');
            let selectedItems = null;
            if (source === 'surgeons') {
                selectedItems = surgeonsFilters[filter] || [];
            } else if (source === 'treatments') {
                selectedItems = treatmentsFilters[filter] || [];
            }
            const selectedCount = selectedItems.length;

            let $label = $dropdown.find('.dropdown-select-label');
            if ($label.length === 0) {
                $label = $dropdown.find('div').filter(function() {
                    return !$(this).hasClass('dropdown-select-arrow') &&
                        !$(this).find('svg').length &&
                        $(this).text().trim().length > 0;
                }).first();
            }
            const labelElement = $label.length > 0 ? $label : $dropdown.find('div').eq(1);

            if (!$dropdown.data('base-label')) {
                const baseLabel = labelElement.text().trim();
                $dropdown.data('base-label', baseLabel);
            }

            const baseLabel = $dropdown.data('base-label');
            let newLabel = '';

            if (selectedCount === 0) {
                newLabel = baseLabel;
            } else if (selectedCount === 1) {
                const selectedValue = selectedItems[0];
                const $selectedItem = $('.dropdown-list-item[data-filter="' + filter + '"][data-filter-value="' + selectedValue + '"]');

                if ($selectedItem.length > 0) {
                    const itemName = $selectedItem.find('span').last().text().trim();
                    newLabel = itemName || baseLabel;
                } else {
                    newLabel = baseLabel;
                }
            } else {
                newLabel = selectedCount + ' items selected';
            }

            labelElement.text(newLabel);
        });
    }

    // Initialize dropdown labels on page load
    updateFilterDropdownLabels('surgeons');

    $(document).on('click', 'card button[data-tab]', function() {
        const card = $(this).closest('card');
        card.find('button[data-tab]').removeClass('bg-[#EDEDF0]');
        $(this).addClass('bg-[#EDEDF0]');
        const tab = $(this).data('tab');
        card.find('[data-tab-content]').addClass('hidden');
        card.find('[data-tab-content="' + tab + '"]').removeClass('hidden');
    });

    const cardsCounter = $('.surgeons-counter');

    $(window).scroll(function() {
        const $section = $(document).find('.surgeons-cards-mobile-container');
        if (!$section.length) return;

        const scrollTop = $(window).scrollTop();
        const sectionTop = $section.offset().top;
        const sectionBottom = sectionTop + $section.outerHeight();

        // Hide if user scrolls above the section or past the last card
        if ((scrollTop + 40) < sectionTop || scrollTop > sectionBottom) {
            cardsCounter
                .addClass('h-0')
                .removeClass('h-[18.933vw] pt-[8.533vw]');
            return;
        }

        // Otherwise, show the counter
        cardsCounter
            .removeClass('h-0')
            .addClass('h-[18.933vw] pt-[8.533vw]');

        // Card count logic
        let currentCard = 1;
        const $cards = $section.find('card');

        $cards.each(function(index) {
            const $card = $(this);
            const rect = $card[0].getBoundingClientRect();
            const viewportHeight = $(window).height();

            // Detect "first mostly visible card"
            if (rect.top < viewportHeight * 0.75 && rect.bottom > viewportHeight * 0.25) {
                currentCard = index + 1;
                return false;
            }
        });

        cardsCounter.find('.counter').html(currentCard + ' of ' + $cards.length);
    });

    function resetSurgeonsFilter() {
        surgeonsFilters.treatments = [];
        surgeonsFilters.locations = [];
        surgeonsFilters.search_term = '';

        updateSurgeonsFilters();
        updateFilterDropdownLabels('surgeons');
        getSurgeonsData();
    }

    $(document).on('click', '.reset-surgeons-filter', function() {
        resetSurgeonsFilter();
    });



    let typingTimer;
    const doneTypingInterval = 1000;

    $('.search-input input').on('keyup', function() {
        clearTimeout(typingTimer);
        const searchTerm = $(this).val();

        typingTimer = setTimeout(function() {
            surgeonsFilters.search_term = searchTerm;
            getSurgeonsData();
        }, doneTypingInterval);
    });

    $('.search-input input').on('keydown', function() {
        clearTimeout(typingTimer);
    });

    function getSurgeonsData() {
        const cardsContainer = $('.surgeons-cards-container');

        $.ajax({
            url: ajaxData.ajax_url,
            type: 'POST',
            data: {
                action: 'get_surgeons',
                filters: surgeonsFilters,
                security: ajaxData.nonce
            },
            beforeSend: function() {
                cardsContainer.css('opacity', '0.5');
            },
            success: function(response) {
                if (response.success) {
                    cardsContainer.html(response.data.desktop_html);
                    $('.surgeons-cards-mobile-container').html(response.data.mobile_html);

                    if (response.data.total_items) {
                        $('.surgeons-total-counter').html('1 of ' + response.data.total_items);
                        $('.surgeons-total-counter-wrapper').show();
                    } else {
                        $('.surgeons-total-counter-wrapper').hide();
                    }
                } else {
                    console.log(response.data.message);
                }
                cardsContainer.css('opacity', '1');
            },
            error: function(err) {
                console.error('AJAX error', err);
                cardsContainer.css('opacity', '1');
            }
        });
    }

    $('.open-surgeons-mobile-filters').click(function() {
        $('.surgeons-mobile-filters').fadeIn();
    });

    $('.apply-surgeons-filter, .close-surgeons-mobile-filters').click(function() {
        $('.surgeons-mobile-filters').fadeOut();
    });

    function updateMobileFiltersCount() {
        $('.surgeons-filters-count').html();
    }

    $(document).on('mouseenter', 'card.treatment a', function() {
        $(this).find('span:first-child').addClass('scale-110');
    });

    $(document).on('mouseleave', 'card.treatment a', function() {
        $(this).find('span:first-child').removeClass('scale-110');
    });

    //Treatments counter
    const treatmentsCounter = $('.treatments-counter');

    $(window).scroll(function() {
        const sectionContainer = $(document).find('.treatment-category-container');
        if (!sectionContainer.length) return;

        const scrollTop = $(window).scrollTop();
        const sectionTop = sectionContainer.offset().top;
        const sectionBottom = sectionTop + sectionContainer.outerHeight();

        // Hide if user scrolls above the section or past the last card
        if ((scrollTop + 40) < sectionTop || scrollTop > sectionBottom) {
            treatmentsMobileCounter
                .addClass('h-0')
                .removeClass('h-[18.933vw] pt-[8.533vw]');
            return;
        }

        // Otherwise, show the counter
        treatmentsMobileCounter
            .removeClass('h-0')
            .addClass('h-[18.933vw] pt-[8.533vw]');

        // Card count logic
        let currentSection = 1;
        const sections = sectionContainer.find('section.treatment-category');

        sections.each(function(index) {
            const $card = $(this);
            const rect = $card[0].getBoundingClientRect();
            const viewportHeight = $(window).height();

            // Detect "first mostly visible card"
            if (rect.top < viewportHeight * 0.75 && rect.bottom > viewportHeight * 0.25) {
                currentSection = index + 1;
                return false;
            }
        });

        treatmentsCounter.html(currentSection + ' of ' + sections.length);
    });

    //Treatments mobile counter
    const treatmentsMobileCounter = $('.treatments-mobile-counter');

    $(window).scroll(function() {
        if (!isTreatmentStickyCounterVisible) return;
        const sectionContainer = $(document).find('.treatment-category-mobile-container');
        if (!sectionContainer.length) return;

        const scrollTop = $(window).scrollTop();
        const sectionTop = sectionContainer.offset().top;
        const sectionBottom = sectionTop + sectionContainer.outerHeight();

        // Hide if user scrolls above the section or past the last card
        if ((scrollTop + 40) < sectionTop || scrollTop > sectionBottom) {
            treatmentsMobileCounter
                .addClass('h-0')
                .removeClass('h-[18.933vw] pt-[8.533vw]');
            return;
        }

        // Otherwise, show the counter
        treatmentsMobileCounter
            .removeClass('h-0')
            .addClass('h-[18.933vw] pt-[8.533vw]');

        let currentSection = 1;
        const sections = sectionContainer.find('section.treatment-category');

        sections.each(function(index) {
            const $card = $(this);
            const rect = $card[0].getBoundingClientRect();
            const viewportHeight = $(window).height();

            // Detect "first mostly visible card"
            if (rect.top < viewportHeight * 0.75 && rect.bottom > viewportHeight * 0.25) {
                currentSection = index + 1;
                return false;
            }
        });

        treatmentsMobileCounter.find('.counter').html(currentSection + ' of ' + sections.length);
    });

    //Pricing counter
    const pricingCounter = $('.pricing-counter');

    $(window).scroll(function() {
        const sectionContainer = $(document).find('.pricing-category-container');
        if (!sectionContainer.length) return;

        const scrollTop = $(window).scrollTop();
        const sectionTop = sectionContainer.offset().top;
        const sectionBottom = sectionTop + sectionContainer.outerHeight();

        // Hide if user scrolls above the section or past the last card
        if ((scrollTop + 40) < sectionTop || scrollTop > sectionBottom) {
            treatmentsMobileCounter
                .addClass('h-0')
                .removeClass('h-[18.933vw] pt-[8.533vw]');
            return;
        }

        // Otherwise, show the counter
        treatmentsMobileCounter
            .removeClass('h-0')
            .addClass('h-[18.933vw] pt-[8.533vw]');

        // Card count logic
        let currentSection = 1;
        const sections = sectionContainer.find('section.pricing-category');

        sections.each(function(index) {
            const $card = $(this);
            const rect = $card[0].getBoundingClientRect();
            const viewportHeight = $(window).height();

            // Detect "first mostly visible card"
            if (rect.top < viewportHeight * 0.75 && rect.bottom > viewportHeight * 0.25) {
                currentSection = index + 1;
                return false;
            }
        });

        pricingCounter.html(currentSection + ' of ' + sections.length);
    });

    //Pricing mobile counter
    const pricingMobileCounter = $('.pricing-mobile-counter');

    $(window).scroll(function() {
        const sectionContainer = $(document).find('.pricing-category-mobile-container');
        if (!sectionContainer.length) return;

        const scrollTop = $(window).scrollTop();
        const sectionTop = sectionContainer.offset().top;
        const sectionBottom = sectionTop + sectionContainer.outerHeight();

        // Hide if user scrolls above the section or past the last card
        if ((scrollTop + 40) < sectionTop || scrollTop > sectionBottom) {
            pricingMobileCounter
                .addClass('h-0')
                .removeClass('h-[18.933vw] pt-[8.533vw]');
            return;
        }

        // Otherwise, show the counter
        pricingMobileCounter
            .removeClass('h-0')
            .addClass('h-[18.933vw] pt-[8.533vw]');

        let currentSection = 1;
        const sections = sectionContainer.find('section.pricing-category');

        sections.each(function(index) {
            const $card = $(this);
            const rect = $card[0].getBoundingClientRect();
            const viewportHeight = $(window).height();

            // Detect "first mostly visible card"
            if (rect.top < viewportHeight * 0.75 && rect.bottom > viewportHeight * 0.25) {
                currentSection = index + 1;
                return false;
            }
        });

        pricingMobileCounter.find('.counter').html(currentSection + ' of ' + sections.length);
    });





    //Treatments search input
    $('.treatments-search-input input').focus(function() {
        const searchInput = $(this).closest('.treatments-search-input');
        searchInput.removeClass('border-[#EDEDF0]').addClass('border-black');
    });

    $('.treatments-search-input input').blur(function() {
        const searchInput = $(this).closest('.treatments-search-input');
        searchInput.addClass('border-[#EDEDF0]').removeClass('border-black');
    });

    $('.treatments-search-input input').keyup(function() {
        const searchInput = $(this).closest('.treatments-search-input');

        if ($(this).val().length > 0) {
            searchInput.find('.clear-input').removeClass('scale-0');
        } else {
            searchInput.find('.clear-input').addClass('scale-0');
        }
    });

    $('.treatments-search-input .clear-input').click(function() {
        const searchInput = $(this).closest('.treatments-search-input');
        const input = searchInput.find('input');

        input.val('');
        $(this).addClass('scale-0');
        input.focus();

        treatmentsFilters.search_term = '';
        getTreatmentsData();
    });

    let typingTimer2;
    const doneTypingInterval2 = 1000;

    $('.treatments-search-input input').on('keyup', function() {
        clearTimeout(typingTimer2);
        const searchTerm = $(this).val();

        typingTimer2 = setTimeout(function() {
            treatmentsFilters.search_term = searchTerm;
            getTreatmentsData();
        }, doneTypingInterval2);
    });

    $('.treatments-search-input input').on('keydown', function() {
        clearTimeout(typingTimer2);
    });

    function getTreatmentsData() {
        const defaultTreatments = $('.default-treatments-categories');
        const defaultTreatmentsMobile = $('.treatment-category-mobile-container');
        const treatmentsSearchResult = $('.treatments-categories-search-result');
        const treatmentsSearchResultMobile = $('.treatments-search-result');

        if (treatmentsFilters.search_term) {
            $('.treatments-search-term-display').html('Search Result For <span class="text-black">“' + treatmentsFilters.search_term + '”</span>');
        } else {
            $('.treatments-search-term-display').html('Search Result');
        }

        $.ajax({
            url: ajaxData.ajax_url,
            type: 'POST',
            data: {
                action: 'get_treatments',
                filters: treatmentsFilters,
                security: ajaxData.nonce
            },
            beforeSend: function() {
                treatmentsSearchResult.css('opacity', '0.5');
            },
            success: function(response) {
                if (response.success) {
                    if (response.data.show_default) {
                        $('.treatments-search-result-wrapper').html('');
                        $('.treatments-search-result-items').html('');
                        defaultTreatments.removeClass('hidden');
                        defaultTreatmentsMobile.removeClass('hidden');
                        treatmentsSearchResult.addClass('hidden');
                        treatmentsSearchResultMobile.addClass('hidden');
                        $('.treatments-mobile-default-counter').removeClass('hidden');
                        isTreatmentStickyCounterVisible = true;
                    } else {
                        $('.treatments-search-result-wrapper').html(response.data.html_desktop);
                        $('.treatments-search-result-items').html(response.data.html_mobile);
                        defaultTreatments.addClass('hidden');
                        defaultTreatmentsMobile.addClass('hidden');
                        treatmentsSearchResult.removeClass('hidden');
                        treatmentsSearchResultMobile.removeClass('hidden');
                        $('.treatments-mobile-default-counter').addClass('hidden');
                        isTreatmentStickyCounterVisible = false;
                    }
                } else {
                    console.log(response.data.message);
                    defaultTreatments.removeClass('hidden');
                    defaultTreatmentsMobile.removeClass('hidden');
                    treatmentsSearchResult.addClass('hidden');
                    treatmentsSearchResultMobile.addClass('hidden');
                }
                treatmentsSearchResult.css('opacity', '1');
                treatmentsSearchResultMobile.css('opacity', '1');
            },
            error: function(err) {
                console.error('AJAX error', err);
                treatmentsSearchResult.css('opacity', '1');
                treatmentsSearchResultMobile.css('opacity', '1');
            }
        });
    }

    if ($('.splide').length) {
        const splide = new Splide('.splide', {
            type   : 'loop',
            focus  : 'center',
            perPage: 1,
            drag: true,
            arrows: false,
            autoWidth: true,
            gap: '1.25vw',
            pagination: false,
            autoScroll: {
                speed: 1,
            },
        });
        splide.mount(window.splide.Extensions);
    }








    $(document).on('click', 'card.location', function() {
        const $clickedCard = $(this);
        const isAlreadyOpen = $clickedCard.hasClass('bg-white');
        const cardId = $(this).data('id');

        // If clicking the same card that's already open, do nothing
        if (isAlreadyOpen) return;

        const $otherCards = $('card.location').not($clickedCard);

        // Set faster transition time for closing cards
        $otherCards.css('--transition-time', '900ms');
        // Apply closing changes
        $otherCards.removeClass('bg-white rounded-[2.083vw]').addClass('opacity-50');
        $otherCards.find('.title-container').addClass('pl-[0.833vw] max-h-[3.4375vw]').removeClass('max-h-[4.6875vw]');
        $otherCards.find('.title-container > div').removeClass('pl-[1.875vw]');
        $otherCards.find('.title-container .get-directions').addClass('scale-0 opacity-0');
        $otherCards.find('.title-container .sub-title').removeClass('scale-0 h-0 opacity-0');
        $otherCards.find('.content-container').addClass('max-h-[0px] opacity-0').removeClass('max-h-[210px]');
        $otherCards.find('.content-container > div').removeClass('px-[1.666vw]');

        // Set slower transition time for opening card
        $clickedCard.css('--transition-time', '900ms');
        // Apply opening changes
        $clickedCard.addClass('bg-white rounded-[2.083vw]').removeClass('opacity-50');
        $clickedCard.find('.title-container').addClass('max-h-[4.6875vw]').removeClass('max-h-[3.4375vw] pl-[0.833vw]');
        $clickedCard.find('.title-container > div').addClass('pl-[1.875vw]');
        $clickedCard.find('.title-container .get-directions').removeClass('scale-0 opacity-0');
        $clickedCard.find('.title-container .sub-title').addClass('scale-0 h-0 opacity-0');
        $clickedCard.find('.content-container').removeClass('max-h-[0px] opacity-0').addClass('max-h-[210px]');
        $clickedCard.find('.content-container > div').addClass('px-[1.666vw]');

        updateContactUsLocationImages(cardId);
    });

    let currentContactUsLocationsImage = 0;

    function updateContactUsLocationImages(cardId) {
        $('.location-images img').each(function(index, item) {
            if (cardId >= index) {
                $(item).removeClass('translate-y-full');
            } else {
                $(item).addClass('translate-y-full');
            }
        });
        currentContactUsLocationsImage = cardId;
    }

    $('.location-tab').click(function() {
        const $this = $(this);
        const source = $this.data('source');
        const $container = $this.closest('.location-tabs-container');

        $container.find('.location-tab').removeClass('bg-[#EDEDF0]');

        $this.addClass('bg-[#EDEDF0]');

        $container.find('.map').toggleClass('hidden', source !== 'map');
        $container.find('img.clinic-view').toggleClass('hidden', source === 'map');
    });

    $(document).on('click', '.faq-item-question', function() {
        const $faqItem = $(this).closest('.faq-item');
        const $answer = $faqItem.find('.faq-item-answer');
        const isOpen = $answer.hasClass('grid-rows-[1fr]');

        $answer
            .toggleClass('grid-rows-[1fr]', !isOpen)
            .toggleClass('grid-rows-[0fr]', isOpen);
        $faqItem.find('.faq-item-icon svg').toggleClass('hidden');
        $faqItem.find('.faq-item-icon').toggleClass('rotate-180');
    });

    $('.input-item .input-wrapper').hover(
        function () {
            const inputWrapper = $(this);
            if (!inputWrapper.hasClass('border-[#FF4D4F]')) {
                inputWrapper.removeClass('border-transparent').addClass('border-black');
            }
        },
        function () {
            const inputWrapper = $(this);
            if (!inputWrapper.hasClass('border-[#FF4D4F]') && !inputWrapper.find('input, textarea').is(':focus')) {
                inputWrapper.addClass('border-transparent').removeClass('border-black');
            }
        }
    );

    $('.input-item').on('focus', 'input, textarea', function () {
        const inputWrapper = $(this).closest('.input-wrapper');
        if (!inputWrapper.hasClass('border-[#FF4D4F]')) {
            inputWrapper
                .addClass('is-focused')
                .removeClass('border-transparent')
                .addClass('border-black');
        }
    });

    $('.input-item').on('blur', 'input, textarea', function () {
        const inputWrapper = $(this).closest('.input-wrapper');
        if (!inputWrapper.hasClass('border-[#FF4D4F]')) {
            inputWrapper
                .removeClass('is-focused')
                .addClass('border-transparent')
                .removeClass('border-black');
        }
    });


    $('.input-item').on('keyup', 'input, textarea', function () {
        const value = $(this).val();
        const inputName = $(this).attr('name');

        contactUsFormData[inputName] = value;
    });

    $('.input-wrapper.dropdown-wrapper').on('click', function (e) {
        e.stopPropagation();

        const wrapper = $(this);

        $('.input-wrapper.dropdown-wrapper .dropdown-list')
            .addClass('-translate-y-5 scale-0');

        wrapper.find('.dropdown-list')
            .removeClass('-translate-y-5 scale-0');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.input-wrapper.dropdown-wrapper').length) {
            $('.input-wrapper.dropdown-wrapper .dropdown-list')
                .addClass('-translate-y-5 scale-0');
        }
    });


    const placeholderText = 'Select a treatment';

    $('.input-wrapper.dropdown-wrapper .dropdown-list-item').on('click', function (e) {
        e.stopPropagation();

        const item      = $(this);
        const inputName = item.data('input');
        const value     = String(item.data('value'));

        if (!Array.isArray(contactUsFormData[inputName])) {
            contactUsFormData[inputName] = [];
        }

        const values = contactUsFormData[inputName];
        const index  = values.indexOf(value);

        if (index === -1) {
            values.push(value);
        } else {
            values.splice(index, 1);
        }

        contactUsFormData[inputName] = values;

        updateDropdownsFromState(contactUsFormData);
    });

    function updateDropdownsFromState(contactUsFormData) {
        // For each dropdown wrapper
        $('.input-wrapper.dropdown-wrapper').each(function () {
            const $wrapper   = $(this);
            const inputName  = $wrapper.find('.dropdown-list-item').first().data('input');
            const labelSpan  = $wrapper.children('span.font-gilroy').first();

            if (!inputName) return;

            const values = Array.isArray(contactUsFormData[inputName])
                ? contactUsFormData[inputName].map(String)
                : [];

            // Update each item UI based on state
            $wrapper.find('.dropdown-list-item').each(function () {
                const $item  = $(this);
                const value  = String($item.data('value'));
                const active = values.includes(value);

                const $toggle = $item.find('.dropdown-list-item-toggle');
                const $icon   = $toggle.find('svg');

                if (active) {
                    $toggle
                        .addClass('bg-black border-black')
                        .removeClass('border-[#C3C3C7]');
                    $icon.removeClass('scale-0');
                } else {
                    $toggle
                        .removeClass('bg-black border-black')
                        .addClass('border-[#C3C3C7]');
                    $icon.addClass('scale-0');
                }
            });

            // Update label
            const selectedLabels = $wrapper.find('.dropdown-list-item').filter(function () {
                return values.includes(String($(this).data('value')));
            }).map(function () {
                return $(this).find('span.text-black').text();
            }).get();

            if (!selectedLabels.length) {
                labelSpan
                    .text(placeholderText)
                    .addClass('text-[#98989C]');
            } else if (selectedLabels.length === 1) {
                labelSpan
                    .text(selectedLabels[0])
                    .removeClass('text-[#98989C]');
            } else {
                labelSpan
                    .text(selectedLabels.length + ' items selected')
                    .removeClass('text-[#98989C]');
            }
        });
    }


    $('.submit-new-form').click(function () {
        const form = $(this).closest('form');
        const responseCover = $('.form-response-cover');

        form.find('input, textarea').val('');

        contactUsFormData = {};

        responseCover.addClass('hidden');
    });

    $('.mobile-list-item').click(function () {
        const value     = $(this).data('value');
        const inputName = $(this).data('input');

        if (!Array.isArray(contactUsFormData[inputName])) {
            contactUsFormData[inputName] = [];
        }

        const arr   = contactUsFormData[inputName];
        const index = arr.indexOf(value);

        if (index === -1) {
            arr.push(value);
        } else {
            arr.splice(index, 1);
        }

        updateContactUsSelects();
    });

    function updateContactUsSelects() {
        $('.mobile-list-item .mobile-list-item-mark')
            .addClass('border-[#C3C3C7]')
            .removeClass('border-black bg-black')
            .find('svg')
            .addClass('hidden');

        const locations = contactUsFormData.locations || [];
        const treatments = contactUsFormData.treatments || [];

        locations.forEach(function (value) {
            $('.mobile-list-item[data-input="locations"][data-value="' + value + '"] .mobile-list-item-mark')
                .removeClass('border-[#C3C3C7]')
                .addClass('border-black bg-black')
                .find('svg')
                .removeClass('hidden');
        });

        treatments.forEach(function (value) {
            $('.mobile-list-item[data-input="treatments"][data-value="' + value + '"] .mobile-list-item-mark')
                .removeClass('border-[#C3C3C7]')
                .addClass('border-black bg-black')
                .find('svg')
                .removeClass('hidden');
        });

        $('.contact-us-mobile-select').each(function () {
            const select = $(this);
            const selectType = select.data('select');
            const selectedItems = contactUsFormData[selectType] || [];
            const label = select.find('.contact-us-mobile-select-label');

            if (selectedItems.length === 0) {
                label.text('Select ' + selectType);
            } else if (selectedItems.length === 1) {
                label.text(selectedItems[0]);
            } else {
                label.text(selectedItems.length + ' items selected');
            }
        });
    }

    $('.contact-us-select-popup .close').click(function() {
        $(this).closest('.contact-us-select-popup').fadeOut();
    });

    $('.contact-us-mobile-select').click(function() {
        const selectName = $(this).data('select');
        $('.contact-us-select-popup[data-name="' + selectName + '"]').fadeIn();
    });

    $('.send-contact-us').click(function() {
        const $button = $(this);
        if ($button.data('loading')) {
            return;
        }
        const formWrapper = $button.closest('.contact-us-wrapper');
        sendContactUsData(formWrapper, $button);
    });

    function sendContactUsData(formWrapper, $submitButton) {
        const inputNames = [
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'message'
        ];
        let isValid = true;
        const $button = $submitButton && $submitButton.length
            ? $submitButton
            : $(formWrapper).find('.send-contact-us');

        inputNames.forEach(function (name) {
            const input = $(formWrapper).find('[name="' + name + '"]');
            const errorWrapper = input.closest('.input-item').find('.error-wrapper');
            const inputWrapper = input.closest('.input-wrapper');
            const value = contactUsFormData[name];

            errorWrapper.addClass('hidden').text('');
            inputWrapper.removeClass('border-[#FF4D4F] bg-[#FF4D4F]/5').addClass('border-transparent');

            if (!value) {
                errorWrapper.removeClass('hidden').text(name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' is required.');
                inputWrapper.addClass('border-[#FF4D4F] bg-[#FF4D4F]/5').removeClass('border-transparent');
                isValid = false;
            } else if (name === 'email') {
                // Validate email structure
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorWrapper.removeClass('hidden').text('Please enter a valid email address.');
                    inputWrapper.addClass('border-[#FF4D4F] bg-[#FF4D4F]/5').removeClass('border-transparent');
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            return;
        }

        const formData = new FormData();
        formData.append('action', 'submit_contact_form');
        formData.append('nonce', ajaxData.nonce);
        formData.append('first_name', contactUsFormData.first_name || '');
        formData.append('last_name', contactUsFormData.last_name || '');
        formData.append('email', contactUsFormData.email || '');
        formData.append('phone_number', contactUsFormData.phone_number || '');
        formData.append('message', contactUsFormData.message || '');
        formData.append('treatments', contactUsFormData.treatments ? contactUsFormData.treatments.join(',') : '');
        formData.append('locations', contactUsFormData.locations ? contactUsFormData.locations.join(',') : '');

        $button.data('loading', true).prop('disabled', true).css({
            opacity: '0.7',
            pointerEvents: 'none',
            cursor: 'not-allowed'
        });

        $.ajax({
            url: ajaxData.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    if ($(window).width() < 960) {
                        $('.mobile-contact-form-response').removeClass('hidden');
                        setTimeout(function() {
                            $('.mobile-contact-form-response').addClass('hidden');
                        }, 3000);
                    } else {
                        $('.form-response-cover').removeClass('hidden');
                    }
                    // $('.contact-us-modal').addClass('hidden');
                    $('.contact-us-success-modal').removeClass('hidden');
                    $('input, textarea').val('');
                    contactUsFormData = {};
                    updateDropdownsFromState(contactUsFormData);
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function(xhr) {
                let message = 'Unable to submit the form.';
                if (xhr.responseJSON && xhr.responseJSON.data) {
                    message = xhr.responseJSON.data;
                }
                alert('Error: ' + message);
            },
            complete: function() {
                $button.data('loading', false).prop('disabled', false).css({
                    opacity: '',
                    pointerEvents: '',
                    cursor: ''
                });
            }
        });
    }


    (function () {
        const sizeClasses = ['scroll-size-1', 'scroll-size-2', 'scroll-size-3', 'scroll-size-4'];

        const frames = [
            [3, 2, 1, 0],
            [2, 3, 2, 1],
            [1, 2, 3, 2],
            [0, 1, 2, 3],
        ];

        const loaders = Array.from(document.querySelectorAll('.scroll-down-loader'))
            .map(loader => Array.from(loader.querySelectorAll('.scroll-dot')));

        if (!loaders.length) return;

        function applyFrame(frameIndex) {
            const frame = frames[frameIndex];

            loaders.forEach(dots => {
                dots.forEach((dot, i) => {
                    sizeClasses.forEach(c => dot.classList.remove(c));
                    dot.classList.add(sizeClasses[frame[i]]);
                });
            });
        }

        let currentFrame = 0;
        applyFrame(currentFrame);

        setInterval(() => {
            currentFrame = (currentFrame + 1) % frames.length;
            applyFrame(currentFrame);
        }, 520);
    })();

    $('.load-more-team-members').on('click', function(e) {
        e.preventDefault();

        const $btn = $(this);
        $btn.prop('disabled', true);

        $.ajax({
            url: ajaxData.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'get_all_members'
            },
            success: function(response) {
                if (response && response.success && response.data) {
                    if (response.data.desktop_html) {
                        $('.team-members-wrapper').html(response.data.desktop_html);
                    }

                    if (response.data.mobile_html) {
                        $('.team-members-mobile-wrapper').html(response.data.mobile_html);
                    }

                    $('.team-member-fade').remove();
                    $('.team-members-load-more-wrapper').remove();
                    $('.load-more-team-members').remove();
                } else {
                    $btn.prop('disabled', false);
                }
            },
            error: function() {
                $btn.prop('disabled', false);
            }
        });
    });

    $('.surgeon-treatment').hover(
        function () {
            const itemsWrapper = $(this).closest('.surgeon-treatments');
            itemsWrapper.find('.surgeon-treatment > span').removeClass('text-black').addClass('text-[#98989C]');
            $(this).addClass('px-[0.625vw]');
            $(this).find('span, svg').addClass('text-black').removeClass('text-[#98989C]');
        },
        function () {
            const itemsWrapper = $(this).closest('.surgeon-treatments');
            itemsWrapper.find('.surgeon-treatment > span').addClass('text-black').removeClass('text-[#98989C]');
            itemsWrapper.find('.surgeon-treatment > svg').removeClass('text-black').addClass('text-[#98989C]');
            $(this).removeClass('px-[0.625vw]');
        }
    );

    function openContactUsModal() {
        const $modal = $('.contact-us-modal');
        $modal.removeClass('hidden');
        void $modal[0].offsetWidth;
        $modal.addClass('is-open');
    }

    function closeContactUsModal($modal) {
        $modal = $modal && $modal.length ? $modal : $('.contact-us-modal');
        $modal.removeClass('is-open');
        $('.contact-us-select-popup').fadeOut();
        setTimeout(function() {
            $modal.addClass('hidden');
        }, 300);
    }

    $(document).on('click', '.close-contact-us-modal', function() {
        closeContactUsModal($(this).closest('.contact-us-modal'));
    });

    $(document).on('click', '.open-contact-us-modal', function() {
        openContactUsModal();
    });

    $(document).on('click', '.contact-us-overlay', function() {
        closeContactUsModal($(this).closest('.contact-us-modal'));
    });

    $('.close-contact-us-success-modal').click(function() {
        $('.contact-us-success-modal').fadeOut();
        closeContactUsModal();
    });

    function openPrescriptionRequestModal() {
        const $modal = $('.prescription-request-modal');
        $modal.removeClass('hidden');
        void $modal[0].offsetWidth;
        $modal.addClass('is-open');
    }

    function closePrescriptionRequestModal($modal) {
        $modal = $modal && $modal.length ? $modal : $('.prescription-request-modal');
        $modal.removeClass('is-open');
        $('.prescription-request-select-popup').fadeOut();
        setTimeout(function() {
            $modal.addClass('hidden');
            resetPrescriptionForm($modal.find('.prescription-request-wrapper'));
        }, 300);
    }

    $(document).on('click', '.open-prescription-request-modal', function() {
        openPrescriptionRequestModal();
    });

    $(document).on('click', '.close-prescription-request-modal', function() {
        closePrescriptionRequestModal($(this).closest('.prescription-request-modal'));
    });

    $(document).on('click', '.prescription-request-overlay', function() {
        closePrescriptionRequestModal($(this).closest('.prescription-request-modal'));
    });

    $(document).on('click', '.prescription-urgency-dropdown', function(e) {
        e.stopPropagation();
        const $dropdown = $(this);
        const $list = $dropdown.find('.dropdown-list');
        const isOpen = !$list.hasClass('scale-0');

        $('.prescription-urgency-dropdown .dropdown-list').addClass('-translate-y-5 scale-0');
        $('.input-wrapper.dropdown-wrapper .dropdown-list').addClass('-translate-y-5 scale-0');

        if (!isOpen) {
            $list.removeClass('-translate-y-5 scale-0');
        }
    });

    $(document).on('click', '.prescription-urgency-item', function(e) {
        e.stopPropagation();

        const $item = $(this);
        const value = String($item.data('value') || '');
        const label = String($item.data('label') || '');
        const $dropdown = $item.closest('.prescription-urgency-dropdown');

        $dropdown.find('input[name="prescription_urgency"]').val(value);
        $dropdown.find('.prescription-urgency-label')
            .text(label)
            .removeClass('text-[#98989C]')
            .addClass('text-black');

        $dropdown.find('.prescription-urgency-item').removeClass('is-selected');
        $item.addClass('is-selected');

        clearPrescriptionFieldError($dropdown);
        $dropdown.find('.dropdown-list').addClass('-translate-y-5 scale-0');
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.prescription-urgency-dropdown').length) {
            $('.prescription-urgency-dropdown .dropdown-list').addClass('-translate-y-5 scale-0');
        }
    });

    $(document).on('click', '.prescription-request-mobile-select', function() {
        const selectName = $(this).data('select');
        $('.prescription-request-select-popup[data-name="' + selectName + '"]').fadeIn().removeClass('hidden');
    });

    $(document).on('click', '.prescription-request-select-popup .close', function() {
        $(this).closest('.prescription-request-select-popup').fadeOut();
    });

    $(document).on('click', '.prescription-urgency-mobile-item', function() {
        const $item = $(this);
        const value = String($item.data('value') || '');
        const label = String($item.data('label') || '');
        const $modal = $('.prescription-request-modal');

        $modal.find('input[name="prescription_urgency"]').val(value);
        $modal.find('.prescription-request-mobile-select-label')
            .text(label)
            .removeClass('text-[#98989C]')
            .addClass('text-black');

        $('.prescription-urgency-mobile-item').removeClass('is-selected');
        $item.addClass('is-selected');
        clearPrescriptionFieldError($modal.find('.prescription-request-mobile-select'));
    });

    function formatPrescriptionDateDisplay(isoDate) {
        if (!isoDate) {
            return '';
        }

        const parts = String(isoDate).split('-');
        if (parts.length !== 3) {
            return isoDate;
        }

        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    function openPrescriptionDatePicker($nativeInput) {
        if (!$nativeInput || !$nativeInput.length) {
            return;
        }

        const input = $nativeInput.get(0);

        try {
            if (typeof input.showPicker === 'function') {
                input.showPicker();
                return;
            }
        } catch (e) {
            // Fallback below for browsers that block showPicker.
        }

        $nativeInput.trigger('focus').trigger('click');
    }

    $(document).on('click', '.open-date-of-birth', function(e) {
        e.preventDefault();
        const $nativeInput = $(this).find('.prescription-date-of-birth-native');
        openPrescriptionDatePicker($nativeInput);
    });

    $(document).on('change input', '.prescription-date-of-birth-native', function() {
        const $nativeInput = $(this);
        const value = String($nativeInput.val() || '');
        const $item = $nativeInput.closest('.input-item');

        $item.find('.prescription-date-of-birth-display').val(formatPrescriptionDateDisplay(value));
        clearPrescriptionFieldError($nativeInput);
    });

    function resetPrescriptionForm($wrapper) {
        $wrapper = $wrapper && $wrapper.length ? $wrapper : $('.prescription-request-wrapper');

        $wrapper.find('input[type="text"], input[type="date"], input[type="hidden"]').val('');
        $wrapper.find('.error-wrapper').addClass('hidden').text('');
        $wrapper.find('.input-wrapper').removeClass('border-[#FF4D4F] bg-[#FF4D4F]/5').addClass('border-transparent');
        $wrapper.find('.prescription-urgency-label, .prescription-request-mobile-select-label')
            .text('Select urgency')
            .removeClass('text-black')
            .addClass('text-[#98989C]');
        $wrapper.find('.prescription-urgency-item, .prescription-urgency-mobile-item').removeClass('is-selected');
        $('.prescription-urgency-mobile-item').removeClass('is-selected');
        $wrapper.find('.prescription-form-response-cover').addClass('hidden');
    }

    function setPrescriptionFieldError($inputOrWrapper, message) {
        const $item = $inputOrWrapper.closest('.input-item');
        const $inputWrapper = $item.find('.input-wrapper').first();
        const $errorWrapper = $item.find('.error-wrapper');

        $errorWrapper.removeClass('hidden').text(message);
        $inputWrapper.addClass('border-[#FF4D4F] bg-[#FF4D4F]/5').removeClass('border-transparent');
    }

    function clearPrescriptionFieldError($inputOrWrapper) {
        const $item = $inputOrWrapper.closest('.input-item');
        const $inputWrapper = $item.find('.input-wrapper').first();
        const $errorWrapper = $item.find('.error-wrapper');

        $errorWrapper.addClass('hidden').text('');
        $inputWrapper.removeClass('border-[#FF4D4F] bg-[#FF4D4F]/5').addClass('border-transparent');
    }

    function sendPrescriptionRequestData($wrapper) {
        const fieldMap = {
            first_name: 'prescription_first_name',
            last_name: 'prescription_last_name',
            date_of_birth: 'prescription_date_of_birth',
            medication_name: 'prescription_medication_name',
            pharmacy: 'prescription_pharmacy',
            urgency: 'prescription_urgency'
        };

        const labels = {
            first_name: 'First Name',
            last_name: 'Last Name',
            date_of_birth: 'Date of Birth',
            medication_name: 'Medication Name',
            pharmacy: 'Pharmacy',
            urgency: 'Urgency'
        };

        let isValid = true;
        const values = {};

        Object.keys(fieldMap).forEach(function(key) {
            const $field = $wrapper.find('[name="' + fieldMap[key] + '"]').first();
            const value = String($field.val() || '').trim();
            values[key] = value;
            clearPrescriptionFieldError($field);

            if (!value) {
                setPrescriptionFieldError($field, labels[key] + ' is required.');
                isValid = false;
            }
        });

        if (values.date_of_birth) {
            const dob = new Date(values.date_of_birth + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (Number.isNaN(dob.getTime())) {
                setPrescriptionFieldError($wrapper.find('[name="prescription_date_of_birth"]'), 'Please enter a valid date of birth.');
                isValid = false;
            } else if (dob > today) {
                setPrescriptionFieldError($wrapper.find('[name="prescription_date_of_birth"]'), 'Date of birth cannot be in the future.');
                isValid = false;
            }
        }

        if (!isValid) {
            return;
        }

        const $submit = $wrapper.find('.send-prescription-request');
        if ($submit.data('loading')) {
            return;
        }

        $submit.data('loading', true).prop('disabled', true).css({
            opacity: '0.7',
            pointerEvents: 'none',
            cursor: 'not-allowed'
        });

        const formData = new FormData();
        formData.append('action', 'submit_prescription_form');
        formData.append('nonce', ajaxData.nonce);
        Object.keys(values).forEach(function(key) {
            formData.append(key, values[key]);
        });

        $.ajax({
            url: ajaxData.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    $wrapper.find('.prescription-form-response-cover').removeClass('hidden');
                } else {
                    alert('Error: ' + (response.data || 'Something went wrong.'));
                }
            },
            error: function(xhr) {
                let message = 'Unable to submit prescription request.';
                if (xhr.responseJSON && xhr.responseJSON.data) {
                    message = xhr.responseJSON.data;
                }
                alert('Error: ' + message);
            },
            complete: function() {
                $submit.data('loading', false).prop('disabled', false).css({
                    opacity: '',
                    pointerEvents: '',
                    cursor: ''
                });
            }
        });
    }

    $(document).on('click', '.send-prescription-request', function() {
        const $button = $(this);
        if ($button.data('loading')) {
            return;
        }
        const $wrapper = $button.closest('.prescription-request-wrapper');
        sendPrescriptionRequestData($wrapper);
    });

    $(document).on('click', '.close-prescription-success', function() {
        const $modal = $(this).closest('.prescription-request-modal');
        resetPrescriptionForm($modal.find('.prescription-request-wrapper'));
        closePrescriptionRequestModal($modal);
    });

    function scrollToHashWithLenis() {
        const hash = window.location.hash
        if (!hash) return

        const id = hash.slice(1)
        const target = document.getElementById(id)
        if (!target) return

        setTimeout(() => {
            lenis.scrollTo(target, {
                duration: 1.2,
                offset: -80, // if you have fixed header
            })
        }, 0)
    }

    window.addEventListener('load', scrollToHashWithLenis);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault()
            const hash = anchor.getAttribute('href')
            if (!hash || hash === '#') return

            const target = document.querySelector(hash)
            if (!target) return

            lenis.scrollTo(target, {
                duration: 1.2,
            })

            history.pushState(null, '', hash)
        })
    });

    document.querySelectorAll('button[target]').forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            const targetId = button.getAttribute('target');
            if (!targetId) return

            const target = document.querySelector(`${targetId}`);
            if (!target) return

            lenis.scrollTo(target, {
                duration: 1.2,
            });
        })
    });


    let isDesktopMenuVisible = false;

    $('.desktop-menu-toggle').click(function() {
        const button = $(this);

        if (isDesktopMenuVisible) {
            //Hide

            $('.main-overlay').fadeOut();
            $('.header').removeClass('z-100');
            $('.desktop-popup-menu').addClass('scale-0 origin-top opacity-0 h-0');

            button.find('.icon-wrapper').html(`<svg class="w-[1.25vw] h-[1.25vw]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 17.25C5.9665 17.25 6.75 18.0335 6.75 19C6.75 19.9665 5.9665 20.75 5 20.75C4.0335 20.75 3.25 19.9665 3.25 19C3.25 18.0335 4.0335 17.25 5 17.25Z" fill="black"/>
                <path d="M12 17.25C12.9665 17.25 13.75 18.0335 13.75 19C13.75 19.9665 12.9665 20.75 12 20.75C11.0335 20.75 10.25 19.9665 10.25 19C10.25 18.0335 11.0335 17.25 12 17.25Z" fill="black"/>
                <path d="M19 17.25C19.9665 17.25 20.75 18.0335 20.75 19C20.75 19.9665 19.9665 20.75 19 20.75C18.0335 20.75 17.25 19.9665 17.25 19C17.25 18.0335 18.0335 17.25 19 17.25Z" fill="black"/>
                <path d="M5 10.25C5.9665 10.25 6.75 11.0335 6.75 12C6.75 12.9665 5.9665 13.75 5 13.75C4.0335 13.75 3.25 12.9665 3.25 12C3.25 11.0335 4.0335 10.25 5 10.25Z" fill="black"/>
                <path d="M12 10.25C12.9665 10.25 13.75 11.0335 13.75 12C13.75 12.9665 12.9665 13.75 12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25Z" fill="black"/>
                <path d="M19 10.25C19.9665 10.25 20.75 11.0335 20.75 12C20.75 12.9665 19.9665 13.75 19 13.75C18.0335 13.75 17.25 12.9665 17.25 12C17.25 11.0335 18.0335 10.25 19 10.25Z" fill="black"/>
                <path d="M5 3.25C5.9665 3.25 6.75 4.0335 6.75 5C6.75 5.9665 5.9665 6.75 5 6.75C4.0335 6.75 3.25 5.9665 3.25 5C3.25 4.0335 4.0335 3.25 5 3.25Z" fill="black"/>
                <path d="M12 3.25C12.9665 3.25 13.75 4.0335 13.75 5C13.75 5.9665 12.9665 6.75 12 6.75C11.0335 6.75 10.25 5.9665 10.25 5C10.25 4.0335 11.0335 3.25 12 3.25Z" fill="black"/>
                <path d="M19 3.25C19.9665 3.25 20.75 4.0335 20.75 5C20.75 5.9665 19.9665 6.75 19 6.75C18.0335 6.75 17.25 5.9665 17.25 5C17.25 4.0335 18.0335 3.25 19 3.25Z" fill="black"/>
            </svg>`);

            isDesktopMenuVisible = false;
        } else {
            //Show

            $('.main-overlay').fadeIn();
            $('.header').addClass('z-100');
            $('.desktop-popup-menu').removeClass('scale-0 origin-top opacity-0 h-0');

            button.find('.icon-wrapper').html(`<svg class="w-[1.25vw] h-[1.25vw]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.29289 5.29295C5.68342 4.90243 6.31643 4.90243 6.70696 5.29295L18.707 17.293C19.0975 17.6835 19.0975 18.3165 18.707 18.707C18.3164 19.0975 17.6834 19.0975 17.2929 18.707L5.29289 6.70702C4.90237 6.31649 4.90237 5.68348 5.29289 5.29295Z" fill="black"/>
                <path d="M17.2929 5.29295C17.6834 4.90243 18.3164 4.90243 18.707 5.29295C19.0975 5.68348 19.0975 6.31649 18.707 6.70702L6.70696 18.707C6.31643 19.0975 5.68342 19.0975 5.29289 18.707C4.90237 18.3165 4.90237 17.6835 5.29289 17.293L17.2929 5.29295Z" fill="black"/>
            </svg>`);

            isDesktopMenuVisible = true;
        }

    });

    $('.mobile-menu-dropdown-toggle').click(function() {
        const dropdown = $(this).closest('.mobile-menu-dropdown');
        dropdown.find('.mobile-menu-dropdown-content').toggleClass('max-h-[280vw] max-h-0');
        dropdown.find('svg').toggleClass('-scale-y-100');
    });

    $('.close-mobile-popup-menu').click(function() {
        $('.mobile-popup-menu').fadeOut();
    });

    $('.open-mobile-popup-menu').click(function() {
        $('.mobile-popup-menu').fadeIn();
    });

    $(".my-video-class").each(function () {
        const video = this;

        if (!video.muted) video.muted = true;
        video.playsinline = true;

        const play = function () {
            const p = video.play();
            if (p) p.catch(function (err) { console.warn("Play blocked:", err.message); });
        };

        if (!("IntersectionObserver" in window)) {
            play();
            return;
        }

        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    if (video.preload === "none") {
                        video.preload = "auto";
                        video.load();
                        video.addEventListener("loadeddata", play, { once: true });
                    } else {
                        play();
                    }
                    io.unobserve(video);
                }
            });
        }, { rootMargin: "300px 0px" });
        io.observe(video);
    });

});

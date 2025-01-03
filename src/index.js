// import './styles.css';

import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import ClassNames from 'embla-carousel-class-names'


import {
    addThumbBtnsClickHandlers,
    addToggleThumbBtnsActive
} from './thumbs'


(() => {
    const sliders = document.querySelectorAll('.embla');
    if (!sliders.length) return;
    sliders.forEach(rootNode => {

        const viewportNode = rootNode.querySelector('.embla__viewport')
        const isLoop = rootNode.dataset.loop;
        const isAutoPlay = rootNode.dataset.autoplay;
        const isContainScroll = rootNode.dataset.containScroll;
        const isClassNames = rootNode.dataset.classnames;
        const isClickable = rootNode.dataset.clickable

        const options = {
            loop: !!isLoop, // Converts truthy/falsy to boolean
            containScroll: isContainScroll === 'keepSnaps' ? 'keepSnaps' : !!isContainScroll,

        }

        const plugins = []

        if (isAutoPlay) plugins.push(Autoplay());
        if (isClassNames) plugins.push(ClassNames());
        const emblaApiMain = EmblaCarousel(viewportNode, options, plugins)

        if (!!isClickable) {
            const slides = emblaApiMain.slideNodes()

            const scrollToIndex = slides.map(
                (_, index) => () => emblaApiMain.scrollTo(index)
            )

            slides.forEach((slideNode, index) => {
                slideNode.addEventListener('click', scrollToIndex[index], false)
            })
        }

        // Set up next & prev buttons
        if (rootNode.querySelector('.embla__arrows')) {
            // Grab button nodes
            const prevButtonNode = rootNode.querySelector('.embla__prev')
            const nextButtonNode = rootNode.querySelector('.embla__next')
            // Add click listeners
            prevButtonNode.addEventListener('click', emblaApiMain.scrollPrev, false)
            nextButtonNode.addEventListener('click', emblaApiMain.scrollNext, false)
        }

        // Set up thumbs
        if (rootNode.querySelector('.embla-thumbs')) {

            const OPTIONS_THUMBS = {
                containScroll: 'keepSnaps',
                dragFree: true
            }

            const viewportNodeThumbCarousel = document.querySelector(
                '.embla-thumbs__viewport'
            )
            const emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS);
            const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(
                emblaApiMain,
                emblaApiThumb
            )
            const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(
                emblaApiMain,
                emblaApiThumb
            )

            emblaApiMain
                .on('destroy', removeThumbBtnsClickHandlers)
                .on('destroy', removeToggleThumbBtnsActive)

            emblaApiThumb
                .on('destroy', removeThumbBtnsClickHandlers)
                .on('destroy', removeToggleThumbBtnsActive)

        }
    })
})();

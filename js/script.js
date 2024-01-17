"use strict"

// Preloader
document.addEventListener("DOMContentLoaded", function () {
  var preloader = document.getElementById("preloader")
  setTimeout(function () {
    preloader.style.opacity = "0"
  }, 500)
  preloader.addEventListener("transitionend", function () {
    preloader.style.display = "none"
  })
})

// ------------- hamburger menu -------------
const iconMenu = document.querySelector(".icon-menu")
const menuBody = document.querySelector(".menu__body")
const menuLinks = document.querySelectorAll(".menu__link")

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    toggleMenu()
  })

  //event handlers for menu items
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (iconMenu.classList.contains("_active")) {
        toggleMenu()
      }
    })
  })

  // toggle menu function
  function toggleMenu() {
    document.body.classList.toggle("body--lock")
    iconMenu.classList.toggle("_active")
    menuBody.classList.toggle("_active")
  }
  // close hamburger menu on device rotating
  window.addEventListener("orientationchange", function () {
    if (document.body.classList.contains("body--lock")) {
      document.body.classList.remove("body--lock")
    }
    if (iconMenu.classList.contains("_active")) {
      iconMenu.classList.remove("_active")
    }
    if (menuBody.classList.contains("_active")) {
      menuBody.classList.remove("_active")
    }
  })
}
// ------------- CLOSE hamburger menu on device rotating -------------
window.addEventListener("orientationchange", function () {
  if (document.body.classList.contains("body--lock")) {
    document.body.classList.remove("body--lock")
  }
  if (iconMenu.classList.contains("_active")) {
    iconMenu.classList.remove("_active")
  }
  if (menuBody.classList.contains("_active")) {
    menuBody.classList.remove("_active")
  }
})
// ------------- END OF hamburger menu -------------

window.addEventListener("load", windowLoad)

function windowLoad() {
  // ------------- Slider SWIPER -------------
  if (document.querySelector(".reviews__slider")) {
    const swiper = new Swiper(".reviews__slider", {
      speed: 500,
      // loop: true,

      // If we need pagination
      pagination: {
        el: ".reviews__pagination",
      },

      // Navigation arrows
      navigation: {
        nextEl: ".reviews__arrow-next",
        prevEl: ".reviews__arrow-prev",
      },
    })
  }

  document.addEventListener("click", documentActions)

  document.body.classList.add("loaded")

  // ----- animation --------------
  const items = document.querySelectorAll(
    "[data-animate-to-left-top], [data-animate-slide-to-right]"
  )

  const appearThreshold = 0.3

  const appearOptions = {
    threshold: appearThreshold,
  }

  const appearCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= appearThreshold) {
        entry.target.classList.add("active")
      } else {
        entry.target.classList.remove("active")
      }
    })
  }

  const appearObserver = new IntersectionObserver(appearCallback, appearOptions)

  items.forEach((item) => {
    appearObserver.observe(item)
  })

  const animateOnScroll = () => {
    items.forEach((item) => {
      const itemTop = item.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (itemTop - windowHeight <= 0) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })
  }

  window.addEventListener("scroll", animateOnScroll)
}

// ------------- Scroll-to function -------------
function documentActions(e) {
  const targetElement = e.target
  // scroll
  if (targetElement.hasAttribute("data-goto")) {
    const gotoElement = document.querySelector(`${targetElement.dataset.goto}`)
    const header = document.querySelector(".header")
    const headerHeight = header ? header.offsetHeight : 0

    if (gotoElement) {
      window.scrollTo({
        top: gotoElement.offsetTop - headerHeight,
        behavior: "smooth",
      })
    }

    e.preventDefault()
  }
}
// ------------- END OF Scroll-to function -------------

// ------------- Moving Elements -------------
// Function to move elements based on attributes data-original-container, data-target-container, and data-max-width
function moveElements() {
  const elementsToMove = document.querySelectorAll("[data-original-container]")

  elementsToMove.forEach((element) => {
    const originalContainerName = element.getAttribute(
      "data-original-container"
    )
    const targetContainerName = element.getAttribute("data-target-container")
    const originalContainer = document.querySelector(
      `.${originalContainerName}`
    )

    // Checking for a value in an attribute data-target-container
    if (targetContainerName) {
      const targetContainer = document.querySelector(`.${targetContainerName}`)
      const maxWidthAttr = element.getAttribute("data-max-width")

      if (originalContainer && targetContainer && maxWidthAttr) {
        const maxWidth = parseFloat(maxWidthAttr)

        if (window.innerWidth <= maxWidth) {
          // Move element to target container if width is less than or equal to data-max-width
          targetContainer.appendChild(element)
        } else {
          // Return the element to its place if the width is greater than data-max-width
          originalContainer.appendChild(element)
        }
      }
    } else {
      // If the data-target-container attribute is not specified, leave the element in its place
      console.warn(
        `Warning: data-target-container attribute is missing for the element with data-original-container="${originalContainerName}".`
      )
    }
  })
}

// Call the function on DOMContentLoaded and window resize
document.addEventListener("DOMContentLoaded", moveElements)
window.addEventListener("resize", moveElements)
// ------------- END OF Moving Elements -------------

// ------------- Spoilers -------------
const spoilersArray = document.querySelectorAll("[data-spoilers]")
if (spoilersArray.length > 0) {
  const spoilersRegular = Array.from(spoilersArray).filter(function (
    item,
    index,
    self
  ) {
    return !item.dataset.spoilers.split(",")[0]
  })

  if (spoilersRegular.length > 0) {
    initSpoilers(spoilersRegular)
  }

  const spoilersMedia = Array.from(spoilersArray).filter(function (
    item,
    index,
    self
  ) {
    return item.dataset.spoilers.split(",")[0]
  })

  if (spoilersMedia.length > 0) {
    const breakpointsArray = []
    spoilersMedia.forEach((item) => {
      const params = item.dataset.spoilers
      const breakpoint = {}
      const paramsArray = params.split(",")
      breakpoint.value = paramsArray[0]
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"
      breakpoint.item = item
      breakpointsArray.push(breakpoint)
    })

    let mediaQueries = breakpointsArray.map(function (item) {
      return (
        "(" +
        item.type +
        "-width: " +
        item.value +
        "px)," +
        item.value +
        "," +
        item.type
      )
    })
    mediaQueries = mediaQueries.filter(function (item, index, self) {
      return self.indexOf(item) === index
    })

    mediaQueries.forEach((breakpoint) => {
      const paramsArray = breakpoint.split(",")
      const mediaBreakpoint = paramsArray[1]
      const mediaType = paramsArray[2]
      const matchMedia = window.matchMedia(paramsArray[0])

      const spoilersArray = breakpointsArray.filter(function (item) {
        if (item.value === mediaBreakpoint && item.type === mediaType) {
          return true
        }
      })

      matchMedia.addListener(function () {
        initSpoilers(spoilersArray, matchMedia)
      })
      initSpoilers(spoilersArray, matchMedia)
    })
  }

  function initSpoilers(spoilersArray, matchMedia = false) {
    spoilersArray.forEach((spoilersBlock) => {
      spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock
      if (matchMedia.matches || !matchMedia) {
        spoilersBlock.classList.add("_init")
        initSpoilerBody(spoilersBlock)
        spoilersBlock.addEventListener("click", setSpoilerAction)
      } else {
        spoilersBlock.classList.remove("_init")
        initSpoilerBody(spoilersBlock, false)
        spoilersBlock.removeEventListener("click", setSpoilerAction)
      }
    })
  }

  function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
    const spoilerTitles = spoilersBlock.querySelectorAll("[data-spoiler]")
    if (spoilerTitles.length > 0) {
      spoilerTitles.forEach((spoilerTitle) => {
        if (hideSpoilerBody) {
          spoilerTitle.removeAttribute("tabindex")
          if (!spoilerTitle.classList.contains("_active")) {
            spoilerTitle.nextElementSibling.hidden = true
          }
        } else {
          spoilerTitle.setAttribute("tabindex", "-1")
          spoilerTitle.nextElementSibling.hidden = false
        }
      })
    }
  }
  function setSpoilerAction(e) {
    const el = e.target
    if (el.hasAttribute("data-spoiler") || el.closest("[data-spoiler]")) {
      const spoilerTitle = el.hasAttribute("data-spoiler")
        ? el
        : el.closest("[data-spoiler]")
      const spoilersBlock = spoilerTitle.closest("[data-spoilers]")
      const oneSpoiler = spoilersBlock.hasAttribute("data-one-spoiler")
        ? true
        : false
      if (!spoilersBlock.querySelectorAll("._slide").length) {
        if (oneSpoiler && !spoilerTitle.classList.contains("_active")) {
          hideSpoilersBody(spoilersBlock)
        }
        spoilerTitle.classList.toggle("_active")
        _slideToggle(spoilerTitle.nextElementSibling, 300)
      }
      e.preventDefault()
    }
  }
  function hideSpoilersBody(spoilersBlock) {
    const spoilerActiveTitle = spoilersBlock.querySelector(
      "[data-spoiler]._active"
    )
    if (spoilerActiveTitle) {
      spoilerActiveTitle.classList.remove("_active")
      _slideUp(spoilerActiveTitle.nextElementSibling, 300)
    }
  }
}

//SlideToggle
let _slideUp = (target, duration = 300) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    target.style.transitionProperty = "height, margin, padding"
    target.style.transitionDuration = duration + "ms"
    target.style.height = target.offsetHeight + "px"
    target.offsetHeight
    target.style.overflow = "hidden"
    target.style.height = 0
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    window.setTimeout(() => {
      target.hidden = true
      target.style.removeProperty("height")
      target.style.removeProperty("padding-top")
      target.style.removeProperty("padding-bottom")
      target.style.removeProperty("margin-top")
      target.style.removeProperty("margin-bottom")
      target.style.removeProperty("overflow")
      target.style.removeProperty("transition-duration")
      target.style.removeProperty("transition-property")
      target.classList.remove("_slide")
    }, duration)
  }
}
let _slideDown = (target, duration = 300) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    if (target.hidden) {
      target.hidden = false
    }
    let height = target.offsetHeight
    target.style.overflow = "hidden"
    target.style.height = 0
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    target.offsetHeight
    target.style.transitionProperty = "height, margin, padding"
    target.style.transitionDuration = duration + "ms"
    target.style.height = height + "px"
    target.style.removeProperty("padding-top")
    target.style.removeProperty("padding-bottom")
    target.style.removeProperty("margin-top")
    target.style.removeProperty("margin-bottom")
    window.setTimeout(() => {
      target.style.removeProperty("height")
      target.style.removeProperty("overflow")
      target.style.removeProperty("transition-duration")
      target.style.removeProperty("transition-property")
      target.classList.remove("_slide")
    }, duration)
  }
}
let _slideToggle = (target, duration = 300) => {
  if (target.hidden) {
    return _slideDown(target, duration)
  } else {
    return _slideUp(target, duration)
  }
}

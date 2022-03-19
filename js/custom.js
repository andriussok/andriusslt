// Vanilla JS

// --- Navigation styling variables
const mainNav = document.querySelector('#main-nav');
const mainNavLinks = document.querySelectorAll("#navbar-main .nav-link");
const wLogo = document.querySelector(".white-logo");
const bLogo = document.querySelector(".black-logo");
const line = document.querySelector(".line-selected");
const sidenote = document.querySelector(".side-styled-element");
let lastScrollTop = 0;


// --- Toggle Mobile Menu on item click;
[...mainNavLinks].map(link => { 
  link.addEventListener('click', function(){
    if(window.innerWidth < 992) {
      document.querySelector(".navbar-toggler").click();
    };
  })
});


// --- Animate elastic line
const animateLineSelected = (link) => {
  let offsetleft = link.parentElement.offsetLeft;
  let offsetright = window.innerWidth - link.parentElement.offsetLeft - link.parentElement.offsetWidth;
  document.querySelector(".line-selected").style.left = offsetleft + "px";
  document.querySelector(".line-selected").style.right = offsetright + "px";
}


// --- Aminate on scroll
function animateOnScroll() {

  let fromTop = window.scrollY || document.documentElement.scrollTop;
  let viewportHeight = document.documentElement.clientHeight || window.innerHeight;

  // --- Determine scroll up-down
  if (fromTop > lastScrollTop){
    line.classList.add("right"); line.classList.remove("left");
  } else {
    line.classList.add("left"); line.classList.remove("right");
  }
  lastScrollTop = fromTop <= 0 ? 0 : fromTop;


  // --- Hero Paralax fx
  let image = document.querySelector("#home img");
  if(fromTop < image.offsetHeight) {
    image.style.transform = `translate3d(-50%, -${(fromTop/100)}%, 0) scale(${(100 + fromTop/5)/100})`;
  };
  
  
  // --- Navigation styling fn
  if ( fromTop >= 100 ) {
    mainNav.classList.add("bg-light","navbar-light");
    mainNav.classList.remove("bg-transparent", "navbar-dark");
    wLogo.style.display = "none"; bLogo.style.display = "block";
  } else {
    mainNav.classList.add("bg-transparent", "navbar-dark");
    mainNav.classList.remove("bg-light", "navbar-light");
    wLogo.style.display = "block"; bLogo.style.display = "none"; 
  }
  sidenote.style.opacity = ( fromTop >= viewportHeight ) ? "100%" : `${fromTop - viewportHeight/2}%`;


  // --- Add active class for current anchor
  mainNavLinks.forEach(link => {
    let section = document.querySelector(link.hash);
    if (
      section.offsetTop <= fromTop + 55 &&
      section.offsetTop + section.offsetHeight > fromTop + 55
    ) {
      link.classList.add("active");      
      animateLineSelected(link); 
    } else {
      link.classList.remove("active");
    }

  });
};

window.addEventListener("scroll", (event) => animateOnScroll());
window.addEventListener('DOMContentLoaded', (event) => animateOnScroll());
window.removeEventListener('DOMContentLoaded', (event) => animateOnScroll());



// --- Smooth scroll
function anchorLinkHandler(e) {
  e.preventDefault();
  
  // Apply only for a.href and existing anchors
  if (e.target.hash || e.target.parentElement.hash) {

    const targetID = e.target.hash || e.target.parentElement.hash;
    const el = document.querySelector(targetID);
    const originalTop = el.getBoundingClientRect().top;

    window.scrollBy({
      top: originalTop,
      behavior: "smooth"
    });

    const checkIfDone = setInterval(function() {
      
      let currentTop = el.getBoundingClientRect().top;
      if (Math.floor(currentTop) == 0) {
        el.tabIndex = "-1";
        clearInterval(checkIfDone);
      }
    }, 100);
  }
}
const linksToAnchors = document.querySelectorAll('a[href^="#"]');
linksToAnchors.forEach(each => (each.onclick = anchorLinkHandler));



// --- Expand Minify Services
document.querySelector("#expandMinify").addEventListener('click', function() {
  document.querySelectorAll(".expand-minify").forEach(e => e.classList.toggle('d-none'));
})

// --- Update Date
document.getElementById("cYear").innerHTML = new Date().getFullYear();

// --- Console msg
(function () {
  const t = navigator.userAgent.toLowerCase();

  if (/(chrome|firefox|safari)/.test(t.toLowerCase())) {
      let e = ["padding: 20px 5px 16px", "background-color: #171718", "color: #bc994e"].join(";");
      t.indexOf("chrome") > -1 && ((e += ";"), (e += [
        "padding: 20px 5px 16px 60px","background-image: url("+location.origin+"/img/as-logo-w.png)",
        "background-position: 10px 9px", "background-repeat: no-repeat", "background-size: auto 30px"
      ].join(";")));
      let i = ["padding: 20px 5px 16px", "background-color: #bc994e", "color: #ffffff"].join(";"),
          n = ["background-color: transparent"].join(";");
      console.log("\n\n %c Crafted by ANDRIUSS %c andriuss.lt %c \n\n\n", e, i, n);
  } else window.console && console.log("Crafted by ANDRIUSS - andriuss.lt");
})();


// --- Init SWIPER
const swiper = new Swiper('.skills-swiper', {
  // Optional parameters
  loop: true,
  speed: 500,
  autoplay: {
    delay: 2000,
  },
  effect: "cube",
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: false,
    },
});



// --- Works functionality

// Data from db
const localData = PROJEKTAI;
const projectsContainer = document.getElementById("projects-component");

const work = localData.projects.map(el => workComponent(el)).join("");
projectsContainer.insertAdjacentHTML('afterbegin', work);

function workComponent(project) { return `
  <div
    data-project="${project.name.toLowerCase().split(" ").join("-")}"
    class="project col-12 col-md-6 col-lg-4 g-2 ${(project.type).join(" ")}">
  
    <a href="#" onclick="event.preventDefault();" data-bs-toggle="modal" data-bs-target="#projectModal" >
      <!-- Card -->
      <div class="card shadow overflow-hidden tilt" style="max-height:10em; min-height: 10em">

        <!--Card content-->
        <div class="view d-flex flex-direction-column">
          <img class="card-img-top" src="${project.featured}"
            alt="${project.name}"
            width="100%" height="100%">

          <div class="overlay mask rgba-blue-strong">
              <div class="text-white p-3">
                <!--Title-->
                <h4 class="card-title">${project.name}</h4>
                <p>${(project.hashtags).join(", ")}</p>
              </div>
          </div>            
        </div>

      </div>
      <!-- Card -->

    </a>
  </div>
  `;
};


function onModalCall() {

  // filtering elements
  [...document.querySelector("#projects-component").querySelectorAll(".project")]
  .map(btn => btn.addEventListener("click", modalObject => {

    // Get clicked project name
    let clickedProject = modalObject.target.closest(".project").getAttribute("data-project");

    // Get data for clicked project
    localData.projects.map((e, i, arr) => {
      
      if ((e.name).toLowerCase().split(" ").join("-") == clickedProject) {
        document.getElementById("modalBodyHolder").innerHTML = modalBody(e);

        // Pass current project to modalControls
        modalControls(i, arr);
      }

    });
  }))
} onModalCall();


function modalBody(project) {
  
  // Update project Title
  document.getElementById("modalLongTitle").innerHTML = project.name;

  // Update project Body
  let logoBg;
  if(project.logo){ logoBg = (!project.logo[1]) ? "#000000" : project.logo[1]};
  
  // Visit project button
  let projectButton = '';
  if(project.url) {
    projectButton = `<a href="${project.url}" target="_blank" rel="noreferrer">
    <button type="button" class="btn btn-outline-dark mt-3">Visit Project <i class="fas fa-external-link-alt ms-3"></i></button>
    </a>`
  }

  return `
  <!-- Modal Body -->
    <div class="row h-max-content w-100 mx-auto">
      <div class="mt-md-5 mb-5 col-12 col-md-6 px-lg-5 align-self-start sticky-md-top" style="top: 0">
        <p>${project.description}</p>
        <p class="small">${project.hashtags.join(", ")}</p>
        <!-- Visit project button -->
        ${projectButton}
      </div>
      <div class="col-12 col-md-6 px-lg-5 text-center">
        
        ${(project.logo) ?
          '<div class="w-100 rounded mb-1" style="background-color:'+ logoBg +'"><img class="artwork my-5" src="'+ project.logo[0] + '" style="max-height: 300px; max-width: 300px;"></div>'
          :""}
        
        ${(project.featured) ?
          '<img class="shadow-lg rounded" src="' + project.featured + '" width="100%" height="auto" alt="'+ project.name.toLowerCase() +'" />'
        :""}
      </div>
    </div>
  `;
};

// --- Modal project looping
function modalControls(index, arr) {
  
  let i = index;
  let nextProject, last, animatefxLR;
  let modalEl = document.querySelector('.modal-header');
  modalEl.classList.add("animatefx", "position-relative");

  document.addEventListener("click", function(e){

    if(e.target.hasAttribute("data-slider")) {
      let link = e.target.getAttribute("data-slider");

      if(link == 'next') {
        last = (arr[i] == arr[arr.length-1]) ? true : false;
        i = (!last) ? ++i : i = 0;

      } else if (link == 'prev') {
          animatefxLR = "animatefx-right"
          last = (arr[i] == arr[0]) ? true : false;
          i = (!last) ? --i : arr.length-1;
      }
      // add content to modalBody
      nextProject = arr[i];
      document.querySelector("#modalBodyHolder").innerHTML = modalBody(nextProject);

    }
  });
};

// --- Keyboard functionality on modal
function keyPress() {
  window.addEventListener("keydown", function (event) {

    if(document.querySelector("#projectModal").classList.contains("show")) {

      if(event.key == "ArrowRight") {
      document.getElementById("projectModal").querySelector('[data-slider="next"]').click();
      }
      if(event.key == "ArrowLeft") {
        document.getElementById("projectModal").querySelector('[data-slider="prev"]').click();
      }
      // Make upDown scroll smoother
      function posNeg(num) { return event.key == "ArrowUp" ? -num : num };
      if(event.key == "ArrowUp" || event.key == "ArrowDown") {
        
        let t = 0;
        let timer = setInterval(() => {
          if ( t == posNeg(100)) {clearInterval(timer) }
          else {
            document.getElementById("modalBodyHolder").scrollBy(0, posNeg(5) );
            t += posNeg(5);
          };
        }, 20)
      }
    }
        
  })
}keyPress();

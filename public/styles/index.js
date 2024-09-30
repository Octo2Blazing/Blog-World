const ham = document.querySelector(".hamberger");
const navbarItems = document.querySelector(".navbar-items");
const hero = document.querySelector(".hero");
const navbar = document.querySelector(".navbar");
const navbarLinks = document.querySelectorAll(".navbar-link");


// hovered effect when click on menu in nav from different end point.
const pathname = window.location.pathname;
switch(pathname){
    case '/blog':
        navbarLinks[2].classList.add('hovered');
        break;
    case '/blog/titile':
        navbarLinks[2].classList.add('hovered');
        break;
    case '/blog-post':
        navbarLinks[2].classList.add('hovered');
        break;
    case '/submit':
        navbarLinks[2].classList.add('hovered');
        break;
    default: 
        navbarLinks[0].classList.add('hovered');
}
navbarItems.addEventListener('click',(e)=>{
    // e.preventDefault();
    navbarLinks.forEach((link)=>{
        if(e.target.innerText === link.innerText){
            link.classList.add("hovered");
        }else link.classList.remove("hovered");
    })
})

var display = false;

window.addEventListener("resize",()=>{
    if(window.innerWidth>920){
        navbarItems.style.display = "flex"
        display = true;
    }else {
        navbarItems.style.display = "none"
        display = false;
    }
})
ham.addEventListener("click", ()=>{ 
    showOrHideElement(navbarItems)
    console.log(navbarItems)
});

hero.addEventListener("click", ()=>{
    if(screen.width<=920){
        navbarItems.style.display = 'none';
        display = false;
    }
})
function showOrHideElement(element){
    display = !display;
    if(display)element.style.display = 'flex';
    else element.style.display = 'none';
}
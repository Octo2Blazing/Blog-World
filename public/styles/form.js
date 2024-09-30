const form = document.querySelector("form");
const title = document.querySelector(".title");
const input_head = document.querySelector('.input-head');
const input_type_panel = document.querySelector(".input-type-panel");
const paragraph_div = document.querySelector("div.paragraph");
const heading_div = document.querySelector("div.heading");
const list_div = document.querySelector("div.list");
const image_div = document.querySelector("div.image");

const up = document.querySelector(".arrow-up");
const down = document.querySelector(".arrow-down");

form.addEventListener('submit', ()=>{

    const inputs = [...form.querySelectorAll("input,textarea")];
    let hiddenIpn = form.querySelector("input[type='hidden']");
    if(!hiddenIpn){
        hiddenIpn = document.createElement("input");
        hiddenIpn.type = "hidden";
        hiddenIpn.name = "hidden_input";
        hiddenIpn.value = inputs.filter(inp =>inp.name!=="hidden_input").map(inp=>inp.name);
        form.appendChild(hiddenIpn);
    }else{
        hiddenIpn.value = inputs.filter(inp =>inp.name!=="hidden_input").map(inp=>inp.name);
    }
    hiddenIpn.style.display = "none";
    hiddenIpn.style.visibility = "hidden";
})

form.addEventListener('change', (e)=>{
    const imgInps = [...form.querySelectorAll("input[type='file']")];
    const curImgInp = imgInps.find(inp => inp.contains(e.target));
    if(curImgInp && curImgInp.files[0]){
        let img = curImgInp.parentElement.querySelector(".image-display");
        if(!img ){
            img = document.createElement("img");
            img.classList.add("image-display");
            curImgInp.parentElement.append(img);
        }
        const reader = new FileReader();
        reader.readAsDataURL(curImgInp.files[0]);
        reader.onload = (event) =>{
            img.src = reader.result;
        }
        img.style.height = curImgInp.parentElement.offsetHeight-2 + "px";    
        curImgInp.parentElement.style.textAlign="right";
    }
})

up.addEventListener("click",(e)=>{
    if(up.dataset.disabled==="true"){
        e.preventDefault();
    }else{
        const inputs = [...document.querySelectorAll("._inp")];
        const curInput = inputs.find(inp=>inp.contains(input_type_panel.previousSibling));
        const prevInput = inputs.find(inp=>inp.contains(input_head.previousSibling));
        moveUp(curInput, prevInput, input_head, input_type_panel)
    }
})
down.addEventListener("click",(e)=>{
    if(down.dataset.disabled==="true"){
        e.preventDefault();
    }else{
        const inputs = [...document.querySelectorAll("._inp")];
        const curInput = inputs.find(inp=>inp.contains(input_type_panel.previousSibling));
        const nextInput = inputs.find(inp=>inp.contains(input_type_panel.nextSibling));
        moveDown(curInput, nextInput, input_head, input_type_panel);
    }
})

input_head.remove();
title.after(input_type_panel);
title.classList.add("_inp");

document.addEventListener("click", (e)=>{
    const inputs = [...document.querySelectorAll("._inp")]
    const curInput = inputs.find(inp => inp.contains(e.target));
    if(!input_type_panel.contains(e.target) && !input_head.contains(e.target)){ // click on input space and anywhere else but head and panel.
        if(curInput){
            inputs
            .filter(inp => inp !== curInput)
            .forEach(inp=> inp.classList.remove("input-style","title-style"));

            if(curInput.classList.contains("title")){
                curInput.classList.add("title-style");
                input_head.remove();
                curInput.after(input_type_panel);
            }else{
                curInput.classList.add("input-style");
                curInput.before(input_head);
                curInput.after(input_type_panel);
                disableMove()

            }
        }else{
            inputs.forEach(inp=> inp.classList.remove("input-style","title-style"));
            input_head.remove();
            input_type_panel.remove();
        }


    }else{ // any where but head & panel .
        if(paragraph_div.contains(e.target) || heading_div.contains(e.target) || image_div.contains(e.target)){
            inputs.forEach(input=>{
                if(!input.classList.contains("new")) input.classList.remove("title-style", "input-style");
                input.classList.remove("new");
            })
        }
    }
})



paragraph_div.addEventListener("click", (e)=>{
    let parent = document.createElement('div');
    let inp = document.createElement("textarea");
    inp.rows = 1;
    inp.autofocus = true;
    inp.name = "paragraph";
    inp.placeholder = "Type";
   
    parent.classList.add("text-area-parent","input-style", "new",  "_inp");
    parent.appendChild(inp);
    
    const inputs = [...document.querySelectorAll("._inp")]; // turn nodelist(array like object) to arrray
    const prevInput = inputs.find(input=> {return input.contains(input_type_panel.previousSibling)});
    prevInput.after(parent);
    parent.before(input_head);
    parent.after(input_type_panel);

    inp.oninput = (e)=>{
        e.target.parentNode.dataset.copyValue = e.target.value;
    }

    disableMove();

})

heading_div.addEventListener("click", (e)=>{
    let inp = document.createElement("input");
    inp.autofocus = true;
    inp.name = "heading";
    inp.placeholder = "Heading";
    inp.classList.add("input-style", "new",  "_inp", "heading");

    const inputs = [...document.querySelectorAll("._inp")];
    const prevInp = inputs.find(inp=>inp.contains(input_type_panel.previousSibling));
    prevInp.after(inp);
    inp.before(input_head);
    inp.after(input_type_panel);

    disableMove();
})


// list_div.addEventListener("click", (e)=>{
//     let inp = document.createElement("input");
//     inp.autofocus = true;
//     inp.name = "heading";
//     inp.placeholder = "Heading";
//     inp.classList.add("input-style", "new",  "_inp", "heading");

//     const inputs = document.querySelectorAll("._inp");
//     inputs.forEach(input=> {
//         if(input.contains(input_type_panel.previousSibling)){
//             input.after(inp);
//             inp.before(input_head);
//             inp.after(input_type_panel);
//             return;
//         }
//     })
// })

//handle image input
image_div.addEventListener("click", (e)=>{
    let div = document.createElement("div");
    let inp = document.createElement("input");
    let p = document.createElement("p");
    let span = document.createElement("span");

     div.classList.add("input-style", "new",  "_inp", "image-input-wraper", "image-input");

    inp.type = "file";
    inp.accept = "image/*";
    inp.name = "image";
    inp.classList.add("image-input");

    div.appendChild(inp);

    p.innerText = "Drag & Drop your file or ";
    span.innerText = "Browse";
    span.style.color = "#018201";
    p.appendChild(span);
    div.appendChild(p);

    const inputs = [...document.querySelectorAll("._inp")];
    const prevInp = inputs.find(inp=>inp.contains(input_type_panel.previousSibling));
    prevInp.after(div);
    div.before(input_head);
    div.after(input_type_panel);

    disableMove();

})


function moveUp(currentInp, prevInp, top, bottom){
    prevInp.before(currentInp);
    currentInp.before(top);
    currentInp.after(bottom);
    disableMove();

}
function moveDown(currentInp, nextInp, top, bottom){
    nextInp.after(currentInp);
    currentInp.before(top);
    currentInp.after(bottom);
    disableMove();

}

function disableMove(){
    const btn = document.querySelector('.btn-submit');
    up.dataset.disabled= false;
    down.dataset.disabled= false;  
    if(input_head && input_head.previousSibling.contains(title)) up.dataset.disabled = true;
    if(input_type_panel.nextElementSibling.contains(btn)) down.dataset.disabled = true;
}
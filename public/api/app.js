function deletePost(title){
   const xhr = new XMLHttpRequest();
   xhr.open("DELETE", "/post/delete/"+title);
   xhr.onload = () =>{
      if(xhr.status===200){
         location.reload();

      }
   }
   xhr.send();
   

   // function updateUi(data){
   //    let template = document.getElementById("template").innerHTML;
   //    const compiledTemplate = ejs.compile(template);
   //    const renderedHtml = compiledTemplate({formData: data});
   //    // document.getElementById("newTemplate").innerHTML = "hi";

   // }
}

function updatePost(title){
   fetch('PUT', "/post/update/"+title)
   .then(res=>{
      console.log(res)
   })
}
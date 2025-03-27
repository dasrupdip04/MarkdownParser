const textarea = document.querySelector(".text-area"); 
const preview = document.querySelector(".markdown-area");
const clear = document.querySelector(".clear-btn");
const copy = document.querySelector("#copy");
const download = document.querySelector(".download-btn");

textarea.addEventListener("input", () => {
    const inp = textarea.value;
    let lines = inp.split("\n");

    
    preview.innerHTML = "";

    lines.forEach(line => { 

        let c = 0;
        line = line.trim();

    
        for (let i = 0; i < line.length; i++) {
            if (line[i] === "#") {
                c++;
            } else {
                break;
            }
        }

        const d = document.createElement("p");
        let ul = document.createElement('ul');
        if(line[0]=="-")
            {
                preview.appendChild(ul);
                let li = document.createElement('li')
                li.textContent=line.slice(1);
                ul.appendChild(li);

            }
            else if(line[0]==" "&&line[1]==" "&& line[2]=="-")
            {
                d.innerHTML='  ◦${line.slice(3)}'
            }

            if (!isNaN(Number(line[0])) && line[1]==".") {
                d.textContent=line;
            }

        if (c === 0) {
            d.textContent = line;
            let ul = document.createElement('ul');

             if(line[0]=="*"&&line[line.length-1]=="*"&&line[1]=="*"&&line[line.length-2]=="*")
                {
                    d.textContent=line.slice(2,-2);
                    d.style.fontWeight="bold";
                }
            else if(line[0]=="*"&&line[line.length-1]=="*")
            {
                d.textContent=line.slice(1,-1);
                d.style.fontStyle = "italic";
            }

            
            
        } else {
            d.textContent = line.slice(c).trim(); 
            d.style.fontWeight = "bold";

            
            if (c === 1) d.style.fontSize = "24px"; 
            else if (c === 2) d.style.fontSize = "20px"; 
            else if (c === 3) d.style.fontSize = "18px"; 
            else if(c==4) d.style.fontSize = "16px"; 
            else if (c==5)d.style.fontSize = "14px"; 
            else if (c==6)d.style.fontSize = "12px"; 
            

        }

        preview.appendChild(d);
    });
});

copy.addEventListener('click',()=>{
    text = preview.textContent;
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log("Copied to clipboard!");
            alert("Copied to clipboard!")
        })
        .catch(err => {
            console.error("Failed to copy:", err);
        });

})

clear.addEventListener('click',()=>{
    preview.textContent="";
    textarea.value="";
})

download.addEventListener("click",()=>{
    let filename = "markdown.txt";
    let text = preview.textContent;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})



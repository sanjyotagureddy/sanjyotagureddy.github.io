
//  document.onload = getAllrepos()

async function getAllrepos(){
    const repoList = ['aspnetrun-microservices','dotnetcore-payloadlogging','dotnetcore-data-ef-cqrs','dotnetcore-data-ado-generic','dotnetcore-data-ef','dotnetcore-data-ef-uow'];
    repoList.reverse().forEach(async (repo) => {
         await fetchAspnetrunRepo(repo)
    });
    // await fetchAspnetrunRepo('aspnetrun-microservices')
}

async function fetchAspnetrunRepo(repo){
    var data = await fetchRepo(repo);
    var udate = document.getElementById('aspnetrun-span');
    console.log(data);
    udate.textContent = `Last updated on - ${getDate(data.pushed_at)}`;

    const article = document.createElement('article');
    const head = document.createElement('header');
    const h2 = document.createElement('h3');
    h2.textContent = repo;
    head.append(h2);
    article.append(head);

    // add description
    const p = document.createElement('p');
    p.textContent = data.description;
    p.style='height:105px'
    article.append(p);

    // add description
    // const labelsList = document.createElement('ul');
    // labelsList.classList.add('actions','special');

    // const l1 = document.createElement('li');
    // const label = document.createElement('a');
    // label.classList.add('button','small')
    // label.textContent = 'C#23';
    // l1.append(label);

    // const l2 = document.createElement('li');
    // const label1 = document.createElement('a');
    // label1.classList.add('button','small')
    // label1.textContent = 'C#11';
    // l2.append(label1);

    // labelsList.append(l1)
    // labelsList.append(l2)
    // article.append(labelsList);

    const tags = data.topics;

    if(tags !== null){
        if(tags.length <=4){
            const tagsItems = getTags(tags);
            article.append(tagsItems);
        } else {
            const chunkedTags = chunkArray(tags, 4);
            console.log(chunkedTags)
            chunkedTags.forEach(ctags=>{
                const tagsItems = getTags(ctags);
                article.append(tagsItems);
            });
        }
    }

    // add last updated date
    const span = document.createElement('span')
    span.classList.add('date');
    span.textContent = `Last updated on - ${getDate(data.pushed_at)}`;
    span.style='font-size:0.8rem;'
    article.append(span)
    

    const buttonList = document.createElement('ul');
    buttonList.classList.add('actions','special');

    
    //git url button
    const githubBtn = document.createElement('li');
    buttonList.append(githubBtn);
    const giturl = document.createElement('a');
    giturl.classList.add('button');
    giturl.href = data.svn_url;
    giturl.textContent = 'Git Url';
    githubBtn.append(giturl);
    article.append(buttonList);

    //git clone button
    const cloneBtn = document.createElement('li');
    buttonList.append(cloneBtn);
    const cloneurl = document.createElement('a');
    cloneurl.classList.add('button');
    cloneurl.href = data.clone_url;
    cloneurl.textContent = 'Clone';
    cloneBtn.append(cloneurl);
    article.append(buttonList);

    //apeend to project section
    const section = document.getElementById('project-sections')
    section.prepend(article);
}

function getTags(tags){

    const tagsList = document.createElement('ul');
    tagsList.classList.add('actions','special');
    tags.forEach(tag =>{

        const l2 = document.createElement('li');
        const label1 = document.createElement('a');
        label1.classList.add('button','small')
        label1.textContent = tag;
        l2.append(label1);
        tagsList.append(l2);
    })
    return tagsList;
}

async function fetchRepo(repoName){    
    const url = `https://api.github.com/repos/sanjyotagureddy/${repoName}`
    const response = await fetch(url) 
    const repo = response.json();
    return repo;    
}




function getDate(date){
    var d = new Date(date);
    var date = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth();
    var monthArr = ["January", "February","March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    month = monthArr[month];
    return month+" "+date+", "+year;
}

function chunkArray(array, size) {
    let result = []
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size)
      result.push(chunk)
    }
    return result
  }
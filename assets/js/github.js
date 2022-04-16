const cacheTime = 100000;
const cache = {}
let cacheTimer = 0

async function getAllRepos() {

    const repoList = {
        "aspnetrun-microservices": "sanjyotagureddy", 
        "dotnetcore-payloadlogging": "sanjyotagureddy", 
        "dotnetcore-data-ef-cqrs": "sanjyotagureddy", 
        "dotnetcore-data-ado-generic": "sanjyotagureddy", 
        "dotnetcore-data-ef": "sanjyotagureddy", 
        "sanjyotagureddy.github.io": "sanjyotagureddy", 
        "dotnetcore-data-ef-uow": "sanjyotagureddy",
        "exo-tools": "aggarwalsushant"
    }
    for (const [repoName, author] of Object.entries(repoList).reverse()){
        await fetchAndCreateRepo(repoName, author)
    }
}

async function fetchAndCreateRepo(repo, author) {
    var data = await fetchWithCache(repo, author, cacheTime);

    const article = document.createElement('article');
    article.id = 'article-id';
    const head = document.createElement('header');
    const h2 = document.createElement('h3');
    h2.style="text-transform: lowercase"
    h2.textContent = repo;
    head.append(h2);
    article.append(head);

    // add description
    const p = document.createElement('p');
    p.textContent = data.description;
    p.style = 'height:105px'
    article.append(p);

    const tags = data.topics;

    if (tags !== null) {

        const chunkedTags = chunkArray(tags, 4);
        chunkedTags.forEach(ctags => {
            const tagsItems = getTags(ctags);
            article.append(tagsItems);
        });
    }

    // add last updated date
    const span = document.createElement('span')
    span.classList.add('date');
    span.textContent = `Last updated on - ${getDate(data.pushed_at)}`;
    span.style = 'font-size:0.8rem;'
    article.append(span)


    const buttons = getButtons(data)
    article.append(buttons);


    //apeend to project section
    const section = document.getElementById('project-sections')
    section.prepend(article);
}

function getButtons(data) {

    const dict = {
        "Git Url": data.svn_url,
        "Clone": data.clone_url
    }
    const buttonList = document.createElement('ul');
    buttonList.classList.add('actions', 'special');

    for (const [key, value] of Object.entries(dict)) {
        //console.log(key, value);

        //git url button
        const githubBtn = document.createElement('li');
        buttonList.append(githubBtn);
        const giturl = document.createElement('a');
        giturl.classList.add('button');
        giturl.href = value;
        giturl.textContent = key;
        githubBtn.append(giturl);
    }
    return buttonList;
}

function getTags(tags) {

    const tagsList = document.createElement('ul');
    tagsList.classList.add('actions', 'special');
    tags.forEach(tag => {

        const l2 = document.createElement('li');
        const label1 = document.createElement('a');
        label1.classList.add('button', 'small')
        label1.textContent = tag;
        label1.style="font-weight:100"
        l2.append(label1);
        tagsList.append(l2);
    })
    return tagsList;
}

async function fetchRepo(repoName, author = 'sanjyotagureddy') {
    const url = `https://api.github.com/repos/${author}/${repoName}`
    const response = await fetch(url)
    const repo = response.json();
    return repo;
}

const getCacheTimer = time => {
    const now = new Date().getTime()
    if (cacheTimer < now + time) {
        cacheTimer = now + time
    }

    return cacheTimer;
}

const fetchWithCache = async (repo, author, time) => {
    const now = new Date().getTime()
    if (!cache[repo] || cache[repo].cacheTimer < now) {
        cache[repo] = await fetchRepo(repo, author)
        cache[repo].cacheTimer = getCacheTimer(time);
    }
    console.log(cache);
    return cache[repo];
}

function clearRepos(){
    let child
    while (child !== null) {
        child = document.getElementById("article-id");
        if (child !== null) {
            child.parentNode.removeChild(child);
        }
    }
    const button = document.getElementById("project-button");
    button.textContent = 'Click here to load projects'
}


function getDate(date) {
    var d = new Date(date);
    var date = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth();
    var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    month = monthArr[month];
    return month + " " + date + ", " + year;
}

function chunkArray(array, size) {
    let result = []
    for (let i = 0; i < array.length; i += size) {
        let chunk = array.slice(i, i + size)
        result.push(chunk)
    }
    return result
}


//  document.onload = getAllrepos()

async function getAllrepos() {
    const repoList = ['aspnetrun-microservices', 'dotnetcore-payloadlogging', 'dotnetcore-data-ef-cqrs', 'dotnetcore-data-ado-generic', 'dotnetcore-data-ef', 'sanjyotagureddy.github.io', 'dotnetcore-data-ef-uow'];
    repoList.reverse().forEach(async (repo) => {
        await fetchAndCreateRepo(repo)
    });
    await fetchAndCreateRepo('exo-tools', 'aggarwalsushant')

    const info = document.createElement('p');
    info.textContent = 'List of projects that I have created.'
    const section = document.getElementById('header-section')
    section.append(info);
}

async function fetchAndCreateRepo(repo, author) {
    var data = await fetchRepo(repo, author);

    const article = document.createElement('article');
    const head = document.createElement('header');
    const h2 = document.createElement('h3');
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
        console.log(chunkedTags)
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
        console.log(key, value);

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

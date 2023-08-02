
export class GithubUser{
    static search(userName){
       const endPoint = `https://api.github.com/users/${userName}`
    
        return fetch(endPoint)
        .then((data) => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers,
        }))
    }   
}
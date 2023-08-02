
import { GithubUser } from "./Githubuser.js"

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()      
        }

        load(){
            this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        }

        save(){
            localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
        }

    //async mostra que o que será recebido será código assíncrono, por exemplo de promisses
    async add(username){
        try{
        const userExist = this.entries.find(entry => {
            const entryLowerCase = String(entry.login).toLowerCase()
            const usernameLowerCase = String(username).toLowerCase()

            return entryLowerCase === usernameLowerCase
        }
        )

        if(userExist){
            throw new Error("Usuário já existente!")
        }

        const user = await GithubUser.search(username)

        if(user.login === undefined){
            throw new Error('Usuário não encontrado!')
        }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()

        }
        catch(error){
            alert(error.message)
        }
        
    }    

    delete(user){
        const userFiltered = this.entries.filter((entry) =>{
            return entry.login !== user.login
        })
        
        this.entries = userFiltered
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }    

    onadd(){
        const addButton = this.root.querySelector('.github-search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('#input-search')
            
            //pela função ser async, devemos usar o THEN caso desejamos fazer algo a mais
            this.add(value)
        }
    }


    update(){
        this.removeAllTr()

        this.entries.forEach((user) =>{
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a p').textContent = user.name
            row.querySelector('.user a span').textContent = user.login

            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const deleteIsTrue = confirm('Quer realmente DELETAR essa linhda?')
                if(deleteIsTrue){
                    this.delete(user)
                }
                
            }

            this.tbody.append(row)
        })
    }

    createRow(){
        const tr = document.createElement('tr') //aqui nós criamos uma tag TR no html

        tr.innerHTML = 
            `
            <td class="user">
                    <img src="https://github.com/AllefMoreira.png" alt="">
                    <a href="https://github.com/AllefMoreira" target="_blank">
                        <p>Allef Moreira</p>
                        <span>AllefMoreira</span>
                    </a>
                    
                </td>
                <td class="repositories">
                    15
                </td>
                <td class="followers">
                    2
                </td>
            <td> <button class="remove">&times;</button> </td>
            ` //Criamos o conteúdo para a tag acima e colocamos o conteúdo dentro da tag

        
        return tr
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) =>{
            tr.remove()
        })
    }
    
}
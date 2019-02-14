const moment = require('moment')
const shortid = require('shortid')

const stor = {
    getBoards() {
        /*
        const keys = Object.keys(localStorage)
        for (var i in keys) {
            if (keys[i].startsWith('mypass-')) {
                const item = localStorage.getItem(keys[i])
                if (isJson(item)) storages.push(JSON.parse(item))
            }
        }
        */
        return getJsonFromStorage('boards')
    },
    getLists() {
        return getJsonFromStorage('lists')
    },
    getCards() {
        return getJsonFromStorage('cards')
    },
    getBoard(boardId) {
        let boardArrays = stor.getBoards()
        let board = boardArrays.find(el => el.id == boardId)
        board.lists = stor.getLists().filter(list => list.boardId == boardId).sort((a,b) => a.pos - b.pos)
        board.lists.forEach(list => {
            list.cards = stor.getCards().filter(card => card.listId == list.id).sort((a,b) => a.pos - b.pos)
        })
        return board
    },
    getList(listId) {
        let listArrays = stor.getLists()
        return listArrays.find(list => list.id == listId)
    },
    getCard(cardId) {
        let cardArrays = stor.getCards()
        return cardArrays.find(card => card.id == cardId)
    },
    addBoard(payload) {
        let boardArrays = stor.getBoards()
        boardArrays.push(payload)
        setJsonToStorage('boards', boardArrays)
        return payload
    },
    updateBoard(boardId, payload) {
        let boardArrays = stor.getBoards()
        const idx = boardArrays.findIndex(board => board.id == boardId)
        if (payload.title) boardArrays[idx].title = payload.title
        if (payload.bgColor) boardArrays[idx].bgColor = payload.bgColor

        setJsonToStorage('boards', boardArrays)
        return boardArrays[idx]
    },
    deleteBoard(boardId) {
        const boardArrays = stor.getBoards()
        const deletedBoardArrays = boardArrays.filter(board => board.id != boardId)
        setJsonToStorage('boards', deletedBoardArrays)
    },
    addList(payload) {
        let listArrays = stor.getLists()
        listArrays.push(payload)
        setJsonToStorage('lists', listArrays)
        return payload
    },
    updateList(listId, payload) {
        let listArrays = stor.getLists()
        const idx = listArrays.findIndex(list => list.id == listId)
        if (payload.title) listArrays[idx].title = payload.title
        if (payload.pos) listArrays[idx].pos = payload.pos

        setJsonToStorage('lists', listArrays)
        return listArrays[idx]
    },
    deleteList(listId) {
        const listArrays = stor.getLists()
        const deletedListArrays = listArrays.filter(list => list.id != listId)
        setJsonToStorage('lists', deletedListArrays)

        const cardArrays = stor.getCards()
        const deletedCardArrays = cardArrays.filter(card => card.listId != listId)
        setJsonToStorage('cards', deletedCardArrays)
    },
    addCard(payload) {
        let cardArrays = stor.getCards()
        cardArrays.push(payload)
        setJsonToStorage('cards', cardArrays)
        return payload
    },
    updateCard(cardId, payload) {
        console.log(payload)
        let cardArrays = stor.getCards()
        const idx = cardArrays.findIndex(card => card.id == cardId)
        if (payload.title) cardArrays[idx].title = payload.title
        if (payload.description) cardArrays[idx].description = payload.description
        if (payload.pos) cardArrays[idx].pos = payload.pos
        if (payload.listId) cardArrays[idx].listId = payload.listId

        setJsonToStorage('cards', cardArrays)
        return cardArrays[idx]
    },
    deleteCard(cardId) {
        const cardArrays = stor.getCards()
        const deletedCardArrays = cardArrays.filter(card => card.id != cardId)
        setJsonToStorage('cards', deletedCardArrays)
    }

}

const isJson = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const getJsonFromStorage = function(key) {
    let storage = localStorage.getItem(key)
    if (!storage) return []
    if (!isJson(storage)) return []
    return JSON.parse(storage)
}

const setJsonToStorage = function(key, json) {
    localStorage.setItem(key, JSON.stringify(json))
    return getJsonFromStorage(key)
}


// init models
class Board {
    constructor({id, title, bgColor}) {
        this.id = id ? id : stor.getBoards().length+1
        this.title = title ? title : ''
        this.bgColor = bgColor ? bgColor : 'rgb(0, 121, 191)'
    }
}
class List {
    constructor({id, title, pos, boardId}) {
        this.id = id ? id : stor.getLists().length+1
        this.title = title ? title : ''
        this.pos = pos ? pos : 65535
        this.boardId = boardId ? boardId : 1
    }
}
class Card {
    constructor({id, title, description, pos, listId}) {
        this.id = id ? id : stor.getCards().length+1
        this.title = title ? title : '',
        this.description = description ? description : '',
        this.pos = pos ? pos : 65535
        this.listId = listId ? listId : 1
    }
}

// init sample board
const sampleBoard = new Board({title:'Sample Board'})
let boards = []
boards.push(sampleBoard)
if (stor.getBoards().length == 0) {
    localStorage.setItem('boards', JSON.stringify(boards))
}




module.exports = {
    stor,
    Board,
    List,
    Card
}
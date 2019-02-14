import dragula from 'dragula'
import 'dragula/dist/dragula.css'

const dragger = {
    init(container, options) {
        return dragula([...container], options)
    },
    // 현재 위치를 기준으로 이전객체 와 다음객체를 리턴
    // candidate : 배열을 돌 수 있는 후보군
    // 
    /**
     * 
     * @param elem          target card(list)
     * @param wrapper       wrapper
     * @param candidate     배열을 돌 수 있는 후보군
     * @param type          type = {'card':cardType, 'list':listType}
     */
    siblings({elem, wrapper, candidates, type}) {

        // cardId || listId
        const curId = elem.dataset[type + 'Id']     // target card(list)'s id
        let prev = null
        let next = null

        candidates.forEach((elem, idx, arr) => {
            const id = elem.dataset[type+'Id']
            if (id === curId) {      // 이동하려는 id가 일치하면..
                // previous card(list) 셋팅
                if (idx > 0) {
                    prev = {
                        id: parseInt(arr[idx -1].dataset[type+'Id']),
                        pos: parseInt(arr[idx -1].dataset[type+'Pos'])
                    }
                } else {        // 1번째면 이전 card(list)는 null
                    prev = null
                }
                // next card(list) 셋팅
                if (idx < arr.length -1) {
                    next = {
                        id: parseInt(arr[idx +1].dataset[type+'Id']),
                        pos: parseInt(arr[idx +1].dataset[type+'Pos'])
                    }
                } else {        // 마지막이면 다음 card(list)는 null
                    next = null
                }
            }
        })

        return { prev, next }
    }
}

export default dragger
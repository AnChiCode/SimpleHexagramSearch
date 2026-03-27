/**
 * @typedef {{
 *  name: string
 *  explain: string
 *  tuan: string
 *  xiang: string
 *  single: string[]
 *  website: {
 *      wiki: string
 *      ctext: string
 *  }
 * }} HexagramData
 */


/* script:

var filterOut = (v, i) => v !== "" && ![5, 8, 11, 14, 17, 20].includes(i)
var text = [...document.querySelectorAll("#content3 .ctext:not(.opt)")].map(e=>e.outerText).filter(filterOut)
var website = window.location.href
var [title, explain] = text[0].split("：")

var data = `

    { //  ${title}
        name: "${title}",
        explain: "${explain}",
        tuan: "${text[1]}",
        xiang: "${text[2]}",
        single: [
            "${text[3]}",
            "${text[4]}",
            "${text[5]}",
            "${text[6]}",
            "${text[7]}",
            "${text[8]}",
        ],
        website: {
            ctext: "${website}",
        }
    },`

console.log(data)

*/


let CURRENT_HEXAGRAM = 0b111111


class HTMLBuilder {
    /**
     * @param {string[]} list 
     * @returns {string}
     */
    static getSingleList(list) {
        return list.reduce((res, cur, idx) => {
            const [count, context] = cur.split("：")
            return res + `<li class="explain-list"><span class="small-title">${count}：</span>${context}</li>`
        }, `<ul class="list-block">`) + "</ul>"
    }

    /**
     * @param {HexagramData} data
     * @returns {string}
     */
    static getExplainHTML(data) {
        return `
<h1 id="hexagram-name">${data.name}</h1>
<p>${data.explain}</p>
<p><span class="small-title">彖傳：</span>${data.tuan}</p>
<p><span class="small-title">象傳：</span>${data.xiang}</p>
${HTMLBuilder.getSingleList(data.single)}
`
    }

    /**
     * @param {HexagramData} data
     * @returns {string}
     */
    static getWebsiteHTML(data) {
        let res = `
<ul class="list-block">
    <li class="explain-list">
        <a href="https://zh.wikipedia.org/wiki/${data.name}卦" target="_blank" class="website-link">維基百科：${data.name}卦</a>
    </li>
`

        if (data.website.ctext !== "") res += `
<li class="explain-list">
    <a href="${data.website.ctext}" target="_blank" class="website-link">中國哲學書電子化計畫：${data.name}卦</a>
</li>
`

        return res + "</ul>"
    }
}


class DataManager {

    /**
     * @param {string} id 
     * @returns 
     */
    static updateCurrentTarget(id) {
        switch (id) {
            case "1":
                CURRENT_HEXAGRAM ^= 0b1
                return
            case "2":
                CURRENT_HEXAGRAM ^= 0b10
                return
            case "3":
                CURRENT_HEXAGRAM ^= 0b100
                return
            case "4":
                CURRENT_HEXAGRAM ^= 0b1000
                return
            case "5":
                CURRENT_HEXAGRAM ^= 0b10000
                return
            case "6":
                CURRENT_HEXAGRAM ^= 0b100000
                return
            default: return
        }
    }

    static updateContext() {
        const data = HEXAGRAM_LIST[CURRENT_HEXAGRAM]
        if (!data) return

        const explain = HTMLBuilder.getExplainHTML(data)
        const website = HTMLBuilder.getWebsiteHTML(data)

        document.getElementById("explain").innerHTML = explain
        document.getElementById("website").innerHTML = website
    }
}


class HtmlEvents {
    static onPageLoad() {
        document
            .querySelectorAll(".hexagram")
            .forEach(el => el.addEventListener("click", HtmlEvents.onHexagramClick))
    }

    /**
     * @param {PointerEvent} ev 
     */
    static onHexagramClick(ev) {
        const el = ev.target
        if (!el) return

        el.toggleAttribute("data-negtive")
        DataManager.updateCurrentTarget(el.id.split("-")[1])
        DataManager.updateContext()
    }
}

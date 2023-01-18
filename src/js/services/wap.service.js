import { getWap1Template } from '../wap-templates/wap-template-1/wap-1-template'
import { getWap2Template } from '../wap-templates/wap-template-2/wap-2-template'
import { getWap3Template } from '../wap-templates/wap-template-3/wap-template-3'
import { storageService } from './async-storage.service'
import { makeId, utilService } from './util.service'
import { wap1Hero } from '../wap-templates/wap-template-1/wap-1-hero'
import wap2Hero from '../wap-templates/wap-template-2/wap-2-hero.json'

export const wapService = {
    getCmpById,
    query,
    get,
    remove,
    save,
    getEditedWap,
    getCategoryFractions,
    updateCmp,
    // saveCmp,
}
let gCmpsMap
const STORAGE_KEY = 'wapDB'
const EDITED_WAP_STORAGE_KEY = 'editedWap'

function getCmpById(activeModule, cmpId) {
    return gCmpsMap[activeModule].find(cmp => cmp.id === cmpId)
}

function _createMap() {
    const allFractions = [...getWap1Template(), ...getWap2Template(), ...getWap3Template()]
    gCmpsMap = allFractions.reduce((acc, fraction) => {
        if (acc[fraction.category]) {
            acc[fraction.category].push(fraction)
        } else {
            acc[fraction.category] = [fraction]
        }
        return acc
    }, {})
}

function updateCmp(cmp, parentCmp) {
    let foundCmp = parentCmp?.cmps?.find(c => c.id === cmp.id)
    if (foundCmp) {
        foundCmp = cmp
    } else {
        return parentCmp?.cmps?.forEach(c => updateCmp(cmp, c))
    }
}

function getCategoryFractions(category) {
    return gCmpsMap[category]
}
_createWaps()

function query() {
    return storageService.query(STORAGE_KEY)
}

_createMap()
async function get(wapId) {
    const template = await storageService.get(STORAGE_KEY, wapId)
    return template
}
function remove(wapId) {
    return storageService.remove(STORAGE_KEY, wapId)
}

// async function save(wap) {
//     return utilService.saveToStorage(EDITED_WAP_STORAGE_KEY, wap)
// }
async function save(wap) {
    var savedWap
    if (wap._id) {
        savedWap = await storageService.put(STORAGE_KEY, wap)
        // savedCar = await httpService.put(`car/${car._id}`, car)
    } else {
        // Later, owner is set by the backend
        // car.owner = userService.getLoggedinUser()
        savedWap = await storageService.post(STORAGE_KEY, wap)
        // savedCar = await httpService.post('car', car)
    }
    return savedWap
}

function getEditedWap() {
    return utilService.loadFromStorage(EDITED_WAP_STORAGE_KEY)
}

function _createWaps() {
    let waps = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!waps || !waps.length) {
        waps = [
            {
                _id: makeId(),
                name: 'wap-1-template',
                owner: 'admin',
                cmps: getWap1Template(),
                thumbnail:
                    'https://res.cloudinary.com/dotasvsuv/image/upload/v1674060298/wap-1-index-thumbnail_ygzwg7.jpg',
                title: 'WeDu',
            },
            {
                _id: makeId(),
                name: 'wap-2-template',
                owner: 'admin',
                cmps: getWap2Template(),
                thumbnail:
                    'https://res.cloudinary.com/dotasvsuv/image/upload/v1674060311/wap-2-index-thumbnail_ausxyt.jpg',
                title: 'Gigaplay',
            },
            {
                _id: makeId(),
                name: 'wap-3-template',
                owner: 'admin',
                cmps: getWap3Template(),
                thumbnail:
                    'https://res.cloudinary.com/dotasvsuv/image/upload/v1674060492/wap-3-index-thumbnail_dheye8.jpg',
                title: 'Finclvr',
            },
        ]

        localStorage.setItem(STORAGE_KEY, JSON.stringify(waps))
    }
}

// function saveCmp(cmp, index, parentCmp) {
//     parentCmp[index] = cmp
// }

// function updateCmp(cmp, parentCmp, cb) {
//     const isFoundCmpIndex = parentCmp?.cmps?.findIndex(c => c.id === cmp.id)
//     if (isFoundCmpIndex > -1) {
//         saveCmp(cmp, isFoundCmpIndex, parentCmp)
//     } else {
//         return parentCmp?.cmps?.forEach(c => updateCmp(cmp, c, cb))
//     }
// }

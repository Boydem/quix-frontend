import { useEffect, useRef, useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { uploadService } from '../../../../services/upload.service'
import { saveCmp } from '../../../../store/wap/wap.action'

export function EditDivOpened({ clickedCmp, elClickedNode }) {
    const [currImage, setCurrImage] = useState(
        window.getComputedStyle(elClickedNode).getPropertyValue('background').split(`"`)[1]
    )
    useEffect(() => {
        setCurrImage(window.getComputedStyle(elClickedNode).getPropertyValue('background').split(`"`)[1])
    }, [elClickedNode])

    const expandedRef = useRef()

    async function onImgInput(event) {
        try {
            const image = await uploadService.uploadImg(event)
            console.log('image', image)
            clickedCmp.style = {
                ...clickedCmp.style,
                background: `url(${image.url}) no-repeat center center/cover`,
            }
            setCurrImage(image.url)
            saveCmp(clickedCmp)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='adjust inside-accordion'>
            <div className='expanded-content edit-div' ref={expandedRef}>
                <div className='wrapper'>
                    <label>
                        Upload
                        <input type='file' hidden onChange={onImgInput} />
                    </label>
                    <img src={currImage} alt='' />
                </div>
            </div>
        </div>
    )
}
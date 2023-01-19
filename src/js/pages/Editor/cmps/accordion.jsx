import React, { useEffect, useState } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import classNames from 'classnames'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useSelector } from 'react-redux'
import { saveCmp } from '../../../store/wap/wap.action'
import SelectUnit from './ui-cmps/select'
import { BlockPicker } from 'react-color'
import * as Slider from '@radix-ui/react-slider'
import { OurAccordion } from './our-accordion'

const AccordionEdit = () => {
    const [isTextPaletteOpen, setIsTextPaletteOpen] = useState(false)
    const [isBorderPaletteOpen, setIsBorderPaletteOpen] = useState(false)
    const [isBgPaletteOpen, setIsBgPaletteOpen] = useState(false)
    const lastClickedCmp = useSelector(storeState => storeState.wapModule.clickedCmp)
    const elClickedNode = useSelector(storeState => storeState.wapModule.elClickedNode)

    const sizeOptions = [
        { name: 'width', title: 'width', unit: 'px', value: 0 },
        { name: 'height', title: 'height', unit: 'px', value: 0 },
        { name: 'minWidth', title: 'min-W', unit: 'px', value: 0 },
        { name: 'minHeight', title: 'min-h', unit: 'px', value: 0 },
        { name: 'maxWidth', title: 'max-w', unit: 'px', value: 0 },
        { name: 'maxHeight', title: 'max-h', unit: 'px', value: 0 },
    ]
    const [propToEdit, setPropToEdit] = useState(sizeOptions)

    const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
        <Accordion.Header className='AccordionHeader'>
            <Accordion.Trigger className={classNames('AccordionTrigger', className)} {...props} ref={forwardedRef}>
                {children}
                <ChevronDownIcon className='AccordionChevron' aria-hidden />
            </Accordion.Trigger>
        </Accordion.Header>
    ))

    const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
        <Accordion.Content className={classNames('AccordionContent', className)} {...props} ref={forwardedRef}>
            <div className='AccordionContentText'>{children}</div>
        </Accordion.Content>
    ))

    function handleChange(ev, idx) {
        ev.preventDefault()
        // if (!lastClickedCmp) return
        const { name, value } = ev.target
        const newPropsToEdit = [...propToEdit]
        newPropsToEdit[idx] = { ...newPropsToEdit[idx], value: value }
        setPropToEdit(newPropsToEdit)
        const unit = ev.target.getAttribute('info')
        if (lastClickedCmp.style) {
            lastClickedCmp.style = { ...lastClickedCmp.style, [name]: `${value + unit}` }
        } else {
            lastClickedCmp.style = { [name]: `${value + unit}` }
        }
        saveCmp(lastClickedCmp)
    }

    function getClickedCmpStyle(styleProp) {
        if (!lastClickedCmp || !lastClickedCmp?.style || !lastClickedCmp.style[styleProp]) return 0
        if (lastClickedCmp?.style[styleProp]) {
            const val = lastClickedCmp.style[styleProp].replace('px', '')
            return val
        }
    }

    function openTextColorPalette() {
        setIsBorderPaletteOpen(false)
        setIsBgPaletteOpen(false)
        setIsTextPaletteOpen(prev => !prev)
    }
    function openBorderColorPalette() {
        setIsTextPaletteOpen(false)
        setIsBgPaletteOpen(false)
        setIsBorderPaletteOpen(prev => !prev)
    }
    function openBgColorPalette() {
        setIsTextPaletteOpen(false)
        setIsBorderPaletteOpen(false)
        setIsBgPaletteOpen(prev => !prev)
    }

    function handleColorChange(color, event) {
        const hex = color.hex
        if (isTextPaletteOpen) {
            lastClickedCmp.style = { ...lastClickedCmp.style, color: hex }
            elClickedNode.style.color = hex
        } else if (isBorderPaletteOpen) {
            lastClickedCmp.style = { ...lastClickedCmp.style, borderColor: hex }
            elClickedNode.style.borderColor = hex
        } else if (isBgPaletteOpen) {
            lastClickedCmp.style = { ...lastClickedCmp.style, backgroundColor: hex }
            elClickedNode.style.backgroundColor = hex
        }
        saveCmp(lastClickedCmp)
    }

    // const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
    //     <Accordion.Content className={classNames('AccordionContent', className)} {...props} ref={forwardedRef}>
    //         <div className='AccordionContentText'>{children}</div>
    //     </Accordion.Content>
    // ))

    function handleTextStyleChange(changeBy) {
        console.log(lastClickedCmp)
        switch (changeBy) {
            case 'bold':
                lastClickedCmp.style = { ...lastClickedCmp.style, fontWeight: 'bold' }
                break
            case 'italic':
                lastClickedCmp.style = { ...lastClickedCmp.style, fontStyle: 'italic' }
                break
            case 'underline':
                lastClickedCmp.style = { ...lastClickedCmp.style, textDecoration: 'underline' }
                break
            case 'align-left':
                lastClickedCmp.style = { ...lastClickedCmp.style, textAlign: 'left' }
                break
            case 'align-center':
                lastClickedCmp.style = { ...lastClickedCmp.style, textAlign: 'center' }
                break
            case 'align-right':
                lastClickedCmp.style = { ...lastClickedCmp.style, textAlign: 'right' }
                break
        }
        return saveCmp(lastClickedCmp)
    }

    function handleFontSliderChange(ev) {
        lastClickedCmp.style = { ...lastClickedCmp.style, fontSize: ev[0] }
        saveCmp(lastClickedCmp)
    }
    function handleBorderSliderChange(ev) {
        lastClickedCmp.style = { ...lastClickedCmp.style, borderRadius: ev[0] }
        saveCmp(lastClickedCmp)
    }

    return (
        <>
            <Accordion.Root className='AccordionRoot' type='single' defaultValue='item-1' collapsible>
                <Accordion.Item className='AccordionItem' value='item-1'>
                    <AccordionTrigger>Size</AccordionTrigger>
                    <AccordionContent>
                        <div className='option-body'>
                            {propToEdit.map((option, idx) => (
                                <div key={idx} className='param-box'>
                                    <label htmlFor={option.name}>{option.title}</label>
                                    <div className='input-wrapper'>
                                        <input
                                            info={option.unit}
                                            type='number'
                                            name={option.name}
                                            id={option.name}
                                            value={option.value}
                                            onChange={ev => handleChange(ev, idx)}
                                        />
                                        <div className='unit'>
                                            <SelectUnit />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </Accordion.Item>

                <Accordion.Item className='AccordionItem' value='item-2'>
                    <AccordionTrigger>Position</AccordionTrigger>
                    <AccordionContent>
                        <SelectUnit />
                    </AccordionContent>
                </Accordion.Item>

                <Accordion.Item className='AccordionItem' value='item-3'>
                    <AccordionTrigger>Adjust</AccordionTrigger>
                    <Accordion.Content className='AccordionContent'>
                        <div className='AccordionContentText'>
                            <div className='color-pick'>
                                <button className='color-pick-label' onClick={openTextColorPalette}>
                                    Text Color
                                </button>
                                {isTextPaletteOpen && (
                                    <BlockPicker
                                        className='palette'
                                        onChange={handleColorChange}
                                        triangle={'hide'}
                                        color={elClickedNode?.style.color}
                                    />
                                )}
                            </div>
                            <div className='color-pick'>
                                <button className='color-pick-label' onClick={openBgColorPalette}>
                                    Background Color
                                </button>
                                {isBgPaletteOpen && (
                                    <BlockPicker
                                        className='palette'
                                        onChange={handleColorChange}
                                        triangle={'hide'}
                                        color={elClickedNode?.style.backgroundColor}
                                    />
                                )}
                            </div>
                            <div className='color-pick'>
                                <button className='color-pick-label' onClick={openBorderColorPalette}>
                                    Border Color
                                </button>
                                {isBorderPaletteOpen && (
                                    <BlockPicker
                                        className='palette'
                                        onChange={handleColorChange}
                                        triangle={'hide'}
                                        color={elClickedNode?.style.borderColor}
                                    />
                                )}
                            </div>

                            <div className='text-decoration'>
                                <button
                                    title='Bold'
                                    onClick={() => handleTextStyleChange('bold')}
                                    className='btn bold-btn'
                                >
                                    <i className='fa-solid fa-bold'></i>
                                </button>
                                <button
                                    title='Italic'
                                    onClick={() => handleTextStyleChange('italic')}
                                    className='btn italic-btn'
                                >
                                    <i className='fa-solid fa-italic'></i>
                                </button>
                                <button
                                    title='Underline'
                                    onClick={() => handleTextStyleChange('underline')}
                                    className='btn underline-btn'
                                >
                                    <i className='fa-solid fa-underline'></i>
                                </button>
                                <button
                                    title='Align-Left'
                                    onClick={() => handleTextStyleChange('align-left')}
                                    className='btn align-left-btn'
                                >
                                    <i className='fa-solid fa-align-left'></i>
                                </button>
                                <button
                                    title='Align-Center'
                                    onClick={() => handleTextStyleChange('align-center')}
                                    className='btn align-center-btn'
                                >
                                    <i className='fa-solid fa-align-center'></i>
                                </button>
                                <button
                                    title='Align-Right'
                                    onClick={() => handleTextStyleChange('align-right')}
                                    className='btn align-right-btn'
                                >
                                    <i className='fa-solid fa-align-right'></i>
                                </button>
                            </div>

                            <form className='slider-form'>
                                <label htmlFor=''>Font Size</label>
                                <Slider.Root
                                    className='SliderRoot'
                                    defaultValue={[1]}
                                    max={100}
                                    step={1}
                                    aria-label='Volume'
                                    onValueChange={handleFontSliderChange}
                                >
                                    <Slider.Track className='SliderTrack'>
                                        <Slider.Range className='SliderRange' />
                                    </Slider.Track>
                                    <Slider.Thumb className='SliderThumb' />
                                </Slider.Root>
                            </form>
                            <form className='slider-form'>
                                <label htmlFor=''>Border Radius</label>
                                <Slider.Root
                                    className='SliderRoot'
                                    defaultValue={[1]}
                                    max={50}
                                    step={1}
                                    aria-label='Volume'
                                    onValueChange={handleBorderSliderChange}
                                >
                                    <Slider.Track className='SliderTrack'>
                                        <Slider.Range className='SliderRange' />
                                    </Slider.Track>
                                    <Slider.Thumb className='SliderThumb' />
                                </Slider.Root>
                            </form>
                            <div className='font-select'></div>
                            <div className='font-shadow-select'></div>
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </>
    )
}

export default AccordionEdit

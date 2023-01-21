import { AiOutlineTeam } from 'react-icons/ai'
import { AiOutlineLink } from 'react-icons/ai'
import { AiOutlineMore } from 'react-icons/ai'
import { AiOutlineBars } from 'react-icons/ai'
import { AiOutlineBold } from 'react-icons/ai'
import { AiOutlinePlus } from 'react-icons/ai'
import { GoDeviceDesktop } from 'react-icons/go'
import { BiMobileAlt } from 'react-icons/bi'
import { FiTrash } from 'react-icons/fi'
import { AiOutlineMobile } from 'react-icons/ai'
import { AiOutlineTablet } from 'react-icons/ai'
import { GrUndo } from 'react-icons/gr'
import { GrRedo } from 'react-icons/gr'
import { FiLayers } from 'react-icons/fi'
import { BiBell } from 'react-icons/bi'
import { FiMessageSquare } from 'react-icons/fi'
import { CgColorPicker } from 'react-icons/cg'
import { IoColorFilterOutline } from 'react-icons/io5'
import { useState } from 'react'
import { removeCmp } from '../../../store/wap/wap.action'
import { useSelector } from 'react-redux'
import { TiBrush } from 'react-icons/ti'

export function ToolsBar({ leftSidebarState, rightSidebarState, handleSidebarsChanges }) {
    const clickedCmp = useSelector(storeState => storeState.wapModule.clickedCmp)

    const tools = [
        { side: 'left', module: 'add' },
        { side: 'left', module: 'layers' },
        { side: 'left', module: 'themes' },
    ]
    function onToolClick(side, stateChanges) {
        if (stateChanges.currModule === leftSidebarState.currModule) {
            handleSidebarsChanges(side, {
                isOpen: false,

                currModule: null,
                isSubMenuOpen: !leftSidebarState.isSubMenuOpen,
            })
            return
        } else {
            handleSidebarsChanges(side, { ...stateChanges })
        }
    }

    function onRemoveCmp() {
        if (clickedCmp) {
            removeCmp(clickedCmp)
        }
    }
    function setMediaQuery() {
        console.log('Hello:')
    }
    return (
        <section className='tools-bar full'>
            <div className='left-side'>
                <div className='tools tools-cmps'>
                    {tools.map((tool, idx) => (
                        <button
                            data-tooltip={`${tool.module}`}
                            data-tooltip-dir='bottom'
                            key={idx}
                            onClick={() =>
                                onToolClick(tool.side, {
                                    isOpen: true,
                                    currModule: tool.module,
                                    activeMenuItem: null,
                                    isSubMenuOpen: !tool.module ? true : false,
                                })
                            }
                            className={`${leftSidebarState.currModule === tool.module ? 'active' : ''} tool`}
                        >
                            {/* {tool.module === 'add' && <AiOutlinePlus />} */}
                            {tool.module === 'add' && <AiOutlinePlus />}
                            {tool.module === 'layers' && <FiLayers />}
                            {tool.module === 'themes' && <IoColorFilterOutline />}
                        </button>
                    ))}
                </div>
            </div>
            <div className='center'>
                <div className='tools responsive tools-views flex align-center'>
                    <div className='responsive-btns flex align-center interactives'>
                        <button
                            onClick={setMediaQuery}
                            data-tooltip='Desktop'
                            data-tooltip-dir='bottom'
                            className='tool'
                        >
                            <GoDeviceDesktop />
                        </button>
                        <button
                            onClick={setMediaQuery}
                            data-tooltip='Tablet'
                            data-tooltip-dir='bottom'
                            className='tool'
                        >
                            <AiOutlineTablet />
                        </button>
                        <button
                            onClick={setMediaQuery}
                            data-tooltip='Mobile'
                            data-tooltip-dir='bottom'
                            className='tool'
                        >
                            <AiOutlineMobile />
                        </button>
                    </div>
                    <div className='responsive-btns interactives curr-width'>
                        <input type='number' name='currMediaQuery' value={1920} />
                    </div>
                </div>
            </div>

            <div className='tools tools-views'>
                <div className='responsive-btns flex align-center'>
                    <div className='interactives'>
                        <button className='tool' onClick={onRemoveCmp} data-tooltip='Trash' data-tooltip-dir='bottom'>
                            <FiTrash />
                        </button>
                    </div>
                    <div className='btns-undo-redo flex align-center'>
                        <button className='tool' data-tooltip='Undo' data-tooltip-dir='bottom'>
                            <GrUndo />
                        </button>
                        <button className='tool' data-tooltip='Redo' data-tooltip-dir='bottom'>
                            <GrRedo />
                        </button>
                    </div>
                    <div className='flex align-center interactives'>
                        <button className='tool' data-tooltip='Notifications' data-tooltip-dir='bottom'>
                            <BiBell />
                        </button>
                        <button className='tool' data-tooltip='Chat' data-tooltip-dir='bottom'>
                            <FiMessageSquare />
                        </button>
                    </div>
                    <div className='flex align-center'>
                        <button
                            data-tooltip='Edit'
                            data-tooltip-dir='bottom'
                            onClick={() =>
                                onToolClick('right', {
                                    isOpen: !rightSidebarState.isOpen,
                                    currModule: 'Edit',
                                    isSubMenuOpen: true,
                                })
                            }
                            className={`${rightSidebarState.isOpen ? 'active' : ''} tool`}
                        >
                            <TiBrush />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

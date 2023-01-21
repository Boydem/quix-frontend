import { DynamicModule } from './dynamic-module'
import { AiOutlineClose } from 'react-icons/ai'
import { saveCmp } from '../../../store/wap/wap.action'
import { useEffect, useState } from 'react'
import { wapService } from '../../../services/wap.service'
import { AiOutlinePlus } from 'react-icons/ai'
export function LeftSidebar({ leftSidebarState, handleSidebarsChanges, wap, editLayoutRef }) {
    const [theme, setTheme] = useState('')
    const addMenuItems = [
        ['Quick add', 'Assets'],
        ['Header', 'Hero', 'Section', 'Card', 'Form', 'Footer', 'Decorative', 'Contact & Forms', 'Embed & Social'],
        ['Cards', 'Galleries', 'Members'],
    ]

    function handleSidebar(sidebarChanges) {
        handleSidebarsChanges('left', sidebarChanges)
    }
    useEffect(() => {
        setThemeClass()
    }, [])

    function setThemeClass() {
        editLayoutRef.current.classList.add(wap.themeClass)
    }

    function handleThemeChange(selectedTheme) {
        const root = document.getElementById('root')
        if (theme) root.classList.remove(theme)
        root.classList.add(selectedTheme)
        setTheme(selectedTheme)
        wap.themeClass = selectedTheme
        wapService.save(wap)
    }

    return (
        <div className={`left-sidebar ${leftSidebarState.isOpen ? 'open' : ''} ${leftSidebarState.currModule}`}>
            {
                <div className={`${leftSidebarState.currModule} module-menu`}>
                    <div
                        onClick={() =>
                            handleSidebar({
                                isOpen: !leftSidebarState.isOpen,
                                isSubMenuOpen: false,
                                activeMenuItem: 'Quick add',
                                currModule: leftSidebarState.currModule !== 'add' ? 'add' : null,
                            })
                        }
                        className='indicator'
                    >
                        <AiOutlinePlus />
                    </div>
                    {addMenuItems.map((menuItems, idx) => (
                        <ul key={idx} className='menu-items'>
                            {menuItems.map(menuItem => (
                                <li
                                    className={leftSidebarState.activeMenuItem === menuItem ? 'active' : ''}
                                    onClick={() => {
                                        handleSidebar({
                                            isOpen: true,
                                            isSubMenuOpen: true,
                                            activeMenuItem: menuItem,
                                        })
                                    }}
                                    key={menuItem}
                                >
                                    {menuItem}
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            }
            <div
                className={`${leftSidebarState.isOpen && leftSidebarState.isSubMenuOpen ? 'open' : ''} module-content`}
            >
                <div className='module-header'>
                    <span className='module-name'>
                        {leftSidebarState.currModule === 'add'
                            ? leftSidebarState.activeMenuItem
                            : leftSidebarState.currModule}
                    </span>
                    <div className='actions'>
                        <span
                            onClick={() => {
                                handleSidebar({ isSubMenuOpen: false })
                            }}
                            className='btn'
                        >
                            <AiOutlineClose />
                        </span>
                    </div>
                </div>
                {leftSidebarState.isOpen && (
                    <div className='module-options'>
                        {leftSidebarState.currModule === 'add' && (
                            <DynamicModule
                                activeMenuItem={leftSidebarState.activeMenuItem}
                                addMenuItems={addMenuItems}
                            />
                        )}
                        {leftSidebarState.currModule === 'themes' && (
                            <div>
                                <button onClick={() => handleThemeChange('theme-1')}>Retro</button>
                                <button onClick={() => handleThemeChange('theme-2')}>Calming</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

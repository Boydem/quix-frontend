import { AppHeader } from '../../cmps/app-header'
import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { wapService } from '../../services/wap.service'
import { saveWap } from '../../store/wap/wap.action'
import { userService } from '../../services/user.service'
import { LineChart } from './cmps/line-chart'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

import { IoAnalyticsOutline } from 'react-icons/io5'
import { GrAnalytics } from 'react-icons/gr'

import { DashboardMain } from './views/dashboard-main'
import { Forms } from './views/forms'
import { Messages } from './views/messages'
import { setCurrSite, setUser } from '../../store/user/user.actions'

export function Dashboard() {
    const activeMenu = useRef('Dashboard')
    const [currView, setCurrView] = useState('dashboard')
    const user = useSelector(storeState => storeState.userModule.user)
    const currSite = useSelector(storeState => storeState.userModule.currSite)
    const menuItems = ['Dashboard', 'Messages', 'Forms']
    const navigate = useNavigate()
    const { userId } = useParams()
    console.log('currSite:', currSite)
    useLayoutEffect(() => {
        if (!userId) navigate('/auth')
        loadUser()
    }, [])

    async function onSiteChange(siteId) {
        try {
            let currSite = user?.sites.find(site => site._id === siteId)
            await setCurrSite(currSite)
            showSuccessMsg(`Currently viewing site: ${currSite.title}`)
        } catch (err) {
            showErrorMsg('Failed selecting site')
        }
    }

    async function onEditSite(currSite) {
        if (!currSite?._id) {
            showErrorMsg('Failed Editing site, try again later ')
            return
        }
        navigate(`edit/${currSite._id}`)
    }

    function onChangeView(view) {
        if (view.toLowerCase() === currView) return
        activeMenu.current = view.toLowerCase()
        setCurrView(view.toLowerCase())
    }
    async function loadUser() {
        if (!userId) return
        try {
            const user = await setUser(userId)
            // await setCurrSite(user.sites[0])
            showSuccessMsg(`Welcome back, ${user.fullname}`)
        } catch (err) {
            showErrorMsg(`Couldn't load user`)
        }
    }
    console.log('user:', user)
    if (!user) return <div>Loading...</div>
    return (
        <>
            <div className='dashboard full'>
                <AppHeader location={'dashboard'} onSiteChange={onSiteChange} />
                <aside className='dashboard-sidebar side-start'>
                    <nav className='dashboard-nav'>
                        <ul className='menu-items'>
                            {menuItems.map(menuItem => (
                                <li
                                    className={`menu-item ${activeMenu.current === menuItem ? 'active' : ''}`}
                                    onClick={() => onChangeView(menuItem)}
                                    key={menuItem}
                                >
                                    <span>{menuItem}</span>
                                    <span>
                                        {menuItem === 'Dashboard' && <IoAnalyticsOutline size={'1.4rem'} />}
                                        {menuItem === 'Messages' && <GrAnalytics size={'1.4rem'} />}
                                        {menuItem === 'Forms' && <GrAnalytics size={'1.4rem'} />}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                <main className='dashboard-main'>
                    {currView === 'dashboard' && <DashboardMain onEditSite={onEditSite} user={user} />}
                    {currView === 'forms' && <Forms user={user} />}
                    {currView === 'messages' && <Messages user={user} />}
                </main>
            </div>
        </>
    )
}

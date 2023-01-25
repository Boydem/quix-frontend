import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { BsFillMoonStarsFill } from 'react-icons/bs'
import { saveWap } from '../store/wap/wap.action'
import { logout } from '../store/user/user.actions'
import { FaBars } from 'react-icons/fa'
import noamImg from '../../assets/imgs/dashboard-assets/noam-tn.jpg'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { BiBell } from 'react-icons/bi'
import { FiMessageSquare } from 'react-icons/fi'
import { SiteSelect } from './site-select'
import { InteractiveChat } from '../pages/Editor/cmps/ui-cmps/interactive-chat'

export function AppHeader({ location = 'editor', theme = '', layout = 'full', onSiteChange }) {
    const [isMenuOpen, setIsMenuOpen] = useState()
    const { wapId } = useParams()
    const wap = useSelector(storeState => storeState.wapModule.wap)
    const [wapUrlToEdit, setWapUrlToEdit] = useState({ publishUrl: '' })
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.user)
    const currSite = useSelector(storeState => storeState.userModule.currSite)
    useEffect(() => {
        if (wap?.url) setWapUrlToEdit({ publishUrl: wap.url })
    }, [])

    function handleChange(ev) {
        const value = ev.target.value
        const field = ev.target.name
        setWapUrlToEdit(prev => ({ ...prev, [field]: value }))
    }

    async function onLogout() {
        try {
            await logout()
            showSuccessMsg('Logged out')
        } catch (err) {
            showErrorMsg('Logout failed')
        }
    }

    async function publishWap() {
        if (!user) {
            showErrorMsg('You must login first')
            return
        }
        try {
            wap.owner = user._id
            wap.url = wapUrlToEdit.publishUrl
            // --- choose title if first time publish
            // --- choose to nav to preview or dashboard -- CTA dashboard
            await saveWap(wap)
            navigate(`/${wapUrlToEdit.publishUrl}`)
            showSuccessMsg('Your site has been published!')
        } catch (err) {
            showErrorMsg(`Couldn't Publish, try again later.`)
        }
    }
    function getShortenName() {
        if (!user) return
        const matches = user?.fullname.match(/\b(\w)/g)
        const shortName = matches.join('')
        return shortName
    }
    function onEditDomain() {
        if (!wap.url) return
        wap.url = wapUrlToEdit.publishUrl
        showSuccessMsg('Your site URL has been updated!')
    }
    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header
            data-location={location}
            className={`${theme} app-header full ${layout} ${location === 'auth' ? 'auth' : ''}`}
        >
            <div className='layout-wrapper'>
                <div className='logo-container'>
                    <Link to='/' className='logo'>
                        Webix.
                    </Link>
                </div>
                {location === 'dashboard' && (
                    <>
                        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                            <ul className='flex align-center'>
                                <li>
                                    <SiteSelect sites={user?.sites} onSiteChange={onSiteChange} currSite={currSite} />
                                </li>
                            </ul>
                        </nav>
                        <ul className='icons-group'>
                            <li className='icon-container'>
                                <InteractiveChat />
                            </li>
                            <li className='icon-container'>
                                <button
                                    data-tooltip='Notifications'
                                    data-tooltip-dir='bottom'
                                    className='btn-icon notifications'
                                >
                                    <BiBell />
                                </button>
                            </li>
                        </ul>
                    </>
                )}
                {location === 'editor' && (
                    <>
                        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                            <ul className='user-area'>
                                {user && <div className='avatar'>{getShortenName()}</div>}
                                <div className='user-info'>
                                    {user && <div className='user-fullname'>{user.fullname}</div>}
                                    <div className='user-links'>
                                        {user ? (
                                            <>
                                                <Link className='btn-dashboard' to={`/dashboard/${user._id}`}>
                                                    Dashboard
                                                </Link>
                                                <span className='btn-logout' onClick={onLogout}>
                                                    Logout
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Link className='nav-link link-underline sign-in' to='/auth/login'>
                                                    <span>Login</span>
                                                </Link>

                                                <Link className='nav-link link-underline sign-up' to='/auth/login'>
                                                    <span>Sign up</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </ul>
                        </nav>
                        <div className='site-link'>
                            <label className='publish-url-prefix' htmlFor='publishUrl'>
                                webix.co.il/
                                <input
                                    onChange={handleChange}
                                    value={wapUrlToEdit.publishUrl}
                                    type='text'
                                    name='publishUrl'
                                    id='publishUrl'
                                    placeholder='MySite'
                                />
                                <button onClick={onEditDomain} className='btn-publish'>
                                    {wap.url && 'Edit your domain.'}
                                </button>
                            </label>
                        </div>
                        <nav className={`nav-actions ${isMenuOpen ? 'open' : ''}`}>
                            <ul className='flex align-center'>
                                <li>
                                    <Link className='nav-link' to='/edit'>
                                        <span>Invite</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className='nav-link preview' to={`/preview/${wapId}`}>
                                        <span>Preview</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className='nav-link publish' onClick={publishWap}>
                                        <span>Publish</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </>
                )}
            </div>
        </header>
    )
}

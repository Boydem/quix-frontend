import { useEffect, useState } from 'react'
import { BsFillMoonStarsFill } from 'react-icons/bs'
import { FaBars } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import noamImg from '../../assets/imgs/dashboard-assets/noam-tn.jpg'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { wapService } from '../services/wap.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { BiBell } from 'react-icons/bi'
import { FiMessageSquare } from 'react-icons/fi'
import { saveWap } from '../store/wap/wap.action'
export function AppHeader({ location = 'editor', theme = '', layout = 'full' }) {
    const [isMenuOpen, setIsMenuOpen] = useState()
    const { wapId } = useParams()
    const wap = useSelector(storeState => storeState.wapModule.wap)
    const [wapUrlToEdit, setWapUrlToEdit] = useState({ publishUrl: '' })
    const navigate = useNavigate()

    useEffect(() => {
        if (wap?.url) setWapUrlToEdit({ publishUrl: wap.url })
    }, [])

    function handleChange(ev) {
        const value = ev.target.value
        const field = ev.target.name
        setWapUrlToEdit(prev => ({ ...prev, [field]: value }))
    }

    async function publishWap() {
        try {
            wap.url = wapUrlToEdit.publishUrl
            await saveWap(wap)
            navigate(`/${wapUrlToEdit.publishUrl}`)
            showSuccessMsg('Your site has been published!')
        } catch (err) {
            showErrorMsg(`Couldn't Publish, try again later.`)
        }
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
        <header className={`${theme} app-header full ${layout} ${location === 'auth' ? 'auth' : ''}`}>
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
                                    <a className='nav-link link-underline' href='#'>
                                        <span>My Sites</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <div className='interactives'>
                            <button data-tooltip='Chat' data-tooltip-dir='bottom' className='tool inbox'>
                                <FiMessageSquare />
                            </button>
                            <button
                                data-tooltip='Notifications'
                                data-tooltip-dir='bottom'
                                className='tool notifications'
                            >
                                <BiBell />
                            </button>
                        </div>
                    </>
                )}
                {location === 'editor' && (
                    <>
                        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                            <ul className='user-area'>
                                <div className='avatar'>
                                    ND
                                    {/* <img src={noamImg} alt="userAvatar" /> */}
                                </div>
                                <div className='user-info'>
                                    <div className='user-fullname'>Noam dahan</div>
                                    <div className='dashboard-link'>Dashboard</div>
                                </div>
                            </ul>
                        </nav>
                        <div className='publish-link'>
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

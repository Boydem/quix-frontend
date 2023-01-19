import DynamicCmp from '../dynamic-cmp'

export function VideoCmp({ cmp, handleClick, onHover }) {
    let classes = cmp.name + ' '
    if (cmp.class) {
        classes += cmp.class?.join(' ')
    }

    return (
        <div
            className={classes}
            style={cmp.style}
            onClick={e => handleClick(e, cmp)}
            onMouseOver={onHover}
            onMouseOut={ev => ev.currentTarget.classList.remove('hover')}
        >
            {/* <iframe src={cmp.content.url} frameborder="0" ></iframe> */}
            <iframe
                src='https://www.youtube.com/embed/LlU4FuIJT2k'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
                style={{ width: '100%', height: '100%' }}
            ></iframe>
        </div>
    )
}
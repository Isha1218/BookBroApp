const BottomBar = ({ position, showBar }) => {
    return (
        <div
          style={{
            opacity: showBar ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <p style={{
            color: '#ababab',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
          }}>{position}</p>
        </div>
    )
}

export default BottomBar;
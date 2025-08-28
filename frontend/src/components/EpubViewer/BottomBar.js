import { FaArrowLeft } from "react-icons/fa6";
import { CgMenuGridO } from "react-icons/cg";

const BottomBarIconContainer = ({ icon }) => {
    return (
        <div style={{
            backgroundColor: '#D8DBE4',
            borderRadius: '10px',
            padding: '10px',
        }}>
            {icon}
        </div>
    );
}

const BottomBar = ({ position }) => {
    return (
        <div
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            right: '0px',
            zIndex: '1000',
            padding: '16px 32px 32px 32px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <BottomBarIconContainer icon={<FaArrowLeft size={'18px'}/>}/>
          <p style={{
            color: 'gray',
            fontSize: '18px'
          }}>{position}</p>
          <BottomBarIconContainer icon={<CgMenuGridO size={'24px'}/>}/>
        </div>
    )
}

export default BottomBar;
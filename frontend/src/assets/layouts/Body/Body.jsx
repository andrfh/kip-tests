import styles from '../Body/Body.module.css'
import LeftPanel from '../../components/LeftPanel/LeftPanel'
import Content from '../../components/Content/Content';


const Body = ({children}) => {
    return ( 
        <div className={styles['body']}>
            {children}
        </div>
     );
}
 
export default Body;
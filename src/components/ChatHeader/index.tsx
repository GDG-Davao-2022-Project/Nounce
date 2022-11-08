import styles from './ChatHeader.module.scss'
import Grogu from "../../assets/img/Grogu.webp"
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";

function ChatHeader({chatMate}:any) {
    const navigate = useNavigate();
    return ( 
        <div id={styles.chatHeader}>
            <div className={styles.chatInfo}>
                <img src={Grogu} /> 
                <p>{chatMate}</p>
            <button onClick={() => navigate("/")}>
                <FontAwesomeIcon icon={faChevronLeft} color="white"/>
            </button>
            </div>
        </div>
    );
}

export default ChatHeader;
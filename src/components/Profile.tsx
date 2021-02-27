import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css'

export function Profile(){
    const {level} = useContext(ChallengesContext)
    return(
        <div className={styles.profileContainer}>
            <img src="https://avatars.githubusercontent.com/u/72896088?s=460&u=dfa321b325c407f8101a92c90dbc7087d2674c34&v=4://mhttps://avatars.githubusercontent.com/u/72896088?s=400&u=dfa321b325c407f8101a92c90dbc7087d2674c34&v=4edia.licdn.com/media/AAYQAQSOAAgAAQAAAAAAAB-zrMZEDXI2T62PSuT6kpB6qg.png" alt="Foto de Thales Santana"/>
            <div>
                <strong>Thales Santana </strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    {level}
                </p>
            </div>
        </div>
    );
}
import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import styles from '../styles/components/CompletedChallenges.module.css'

export function CompletedChalenges(){
    const {challengesCompleted} = useContext(ChallengesContext)
    return(
        <div className={styles.completedChalengesContainer}>
            <span>Desafios Completos</span>
            <span>{challengesCompleted}</span>
        </div>
    )
}
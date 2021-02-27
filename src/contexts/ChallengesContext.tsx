import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';



interface Challenge{
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextsData{
    level: number;
    currentExperience: number; 
    experienceToNextLevel: number; 
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completedChallenge: () => void;
    CloseLevelUpModal:() => void;
}

interface ChallengesProviderProps{
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextsData);

export function ChallengesProvider({
    children, 
    ...rest
}: ChallengesProviderProps){

    const [level, setLevel] = useState(rest.level );
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted);

    const [activeChallenge, setActiveChallenge] =useState(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] =useState(false)

    const experienceToNextLevel = Math.pow((level + 1)* 4,2)

    useEffect(()=> {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level',String(level));
        Cookies.set('currentExperience',String(currentExperience));
        Cookies.set('challengesCompleted',String(challengesCompleted))
    }, [level,currentExperience, challengesCompleted])
    
    function levelUp(){
        setLevel(level + 1);
        setIsLevelUpModalOpen(true)
    }
    
    function CloseLevelUpModal(){
        setIsLevelUpModalOpen(false)
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio 🥳 ',{
                body: `Valendo ${challenge.amount}xp!`
            })
        }
        new Audio('/notification.mp3').play()

        setActiveChallenge(challenge);
    }

    function resetChallenge(){
        setActiveChallenge(null)
    }

    function completedChallenge(){
        if(!activeChallenge){
            return;
        }
        const{ amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if( finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp()
        }
        setCurrentExperience(finalExperience);
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted +1);
    }

    return(
        <ChallengesContext.Provider 
        value={{ 
                level, 
                levelUp,
                CloseLevelUpModal, 
                currentExperience,
                experienceToNextLevel, 
                challengesCompleted,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                completedChallenge 
                }}
            >
            {children}
        { isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    ); 
}
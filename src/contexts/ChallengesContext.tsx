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
    minutes:number;
    seconds:number;
    hasFinished: boolean;
    isActive: boolean;
    level: number;
    currentExperience: number; 
    experienceToNextLevel: number; 
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completedChallenge: () => void;
    startCountdown:() => void;
    resetCountdown:() => void;
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
    // COUNTDOWN CONTEXT //
    
    let countdownTimeout: NodeJS.Timeout;

    const[time, setTime] = useState(0.1* 60);
    const[isActive,setIsActive] = useState(false);
    const[hasFinished, setHasFinished] = useState(false)

    const minutes =  Math.floor(time / 60);
    const seconds = time % 60;

    

    function startCountdown(){
       setIsActive(true);
    }
    
    function resetCountdown(){
        clearTimeout(countdownTimeout);
        setIsActive(false)
        setTime(0.1 * 60)
    }

    useEffect(() => {
        if(isActive && time > 0){
        countdownTimeout=setTimeout(() =>{
                setTime(time - 1);
            },1000)
        }else if(isActive && time == 0){
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    },[isActive,time])

    // CHALLENGE CONTEXT //
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
        resetCountdown();
        setHasFinished(false);
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
        resetCountdown();
        setHasFinished(false);
    }

    return(
        <ChallengesContext.Provider 
        value={{ 
                minutes,
                seconds,
                hasFinished,
                isActive,
                resetCountdown,
                startCountdown,
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
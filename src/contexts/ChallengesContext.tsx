import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json'

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
}

interface ChallegensProviderProps{
    children: ReactNode
}

export const ChallengesContext = createContext({} as ChallengesContextsData);

export function ChallengesProvider({children}: ChallegensProviderProps){
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] =useState(null)

    const experienceToNextLevel = Math.pow((level + 1)* 4,2)

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
    }
    
    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

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
        </ChallengesContext.Provider>
    ); 
}
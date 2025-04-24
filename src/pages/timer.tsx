import { useState, useRef, useEffect } from "react";
import '../styles/timer.css';

export default function Timer() {

    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [scramble, setScramble] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [averageFive, setAverageFive] = useState<string>("");
    const [averageTwelve, setAverageTwelve] = useState<string>("");
    const [averageHundred, setAverageHundred] = useState<string>("");
    const [sessionAvg, setSessionAvg] = useState<string>("");
    const [pb, setPB] = useState<string>("");
    const [plusTwo, setPlusTwo] = useState<boolean>(false);

    const timer = useRef(0);
    // const isRunningV2 = useRef(0);

    useEffect(() => {
        setScramble(createScramble());
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
          };
    }, []);

    useEffect(() => {
        setAverageFive(updateAO5());
        setAverageTwelve(updateAO12());
        setAverageHundred(updateAO100());
        setSessionAvg(updateSA());
        setPB(updatePB());
    }, [history]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
          };
    }, [isRunning]);

    // handles key press events in the input box
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key == ' ') {
            if (isRunning) {

                // stops timer
                clearInterval(timer.current);
                // adds current time to array
                let attempt = document.getElementById("stopwatch-time")?.innerHTML;
                if (attempt) {
                    setHistory((prev) => [...prev, attempt]);
                }
                // timer state is no longer running
                setIsRunning(false);
                setScramble(createScramble());
            } else {
                // reset time to start at 0 every attempt
                setTime(0);

                // timer
                timer.current = setInterval(() => {
                    setTime(pre => pre + .01);
                }, 10)

                setIsRunning(true);
            }
        }
    };

    // formats the timer
    const format = (time: any) => {
        let minutes = Math.floor(time / 60 % 60);
        let seconds = Math.floor(time % 60);
        let milliseconds = (time % 60 / 10).toFixed(3);
        
        const minutesStr: string = minutes < 10 ? "0" + minutes : "" + minutes;
        const secondsStr: string = seconds < 10 ? "0" + seconds : "" + seconds;
        milliseconds = "" + milliseconds;
        milliseconds = milliseconds.substring(3,5);
    
        return minutesStr + ":" + secondsStr + "." + milliseconds;
    }

    const addTwoSeconds = () => {
        if (!plusTwo) {
            if (history.length === 0) {
                return;
            }
            let latestSolveIndex: number = history.length - 1;
            let asInt: number = getTimeAsInt(latestSolveIndex);
            asInt += 2;
            let backToString = switchTimeToString(asInt);
            setHistory((prevHistory) => {
                const updatedHistory: string[] = [...prevHistory];
                updatedHistory[latestSolveIndex] = backToString;
                return updatedHistory;
            });
            setPlusTwo(!plusTwo);
        } else {
            if (history.length === 0) {
                return;
            }
            let latestSolveIndex: number = history.length - 1;
            let asInt: number = getTimeAsInt(latestSolveIndex);
            asInt -= 2;
            let backToString = switchTimeToString(asInt);
            setHistory((prevHistory) => {
                const updatedHistory: string[] = [...prevHistory];
                updatedHistory[latestSolveIndex] = backToString;
                return updatedHistory;
            });
            setPlusTwo(!plusTwo);
        }
    };

    const removeSingle = () => {
        if (history.length === 0) {
            return;
        }
        let latestSolveIndex = history.length - 1;
        setHistory((prevHistory) => {
            const updatedHistory: string[] = [...prevHistory];
            updatedHistory.splice(latestSolveIndex, 1);
            return updatedHistory;
        });
    }

    const clearAll = () => {
        if (history.length === 0) {
            return;
        }
        setHistory([]);
    }

    // calculates average of 5
    function updateAO5() {
        let min: number = getTimeAsInt(0);
        let max: number = getTimeAsInt(0);
        let sum:number = 0;
        for (let i = Math.max(0, history.length - 5); i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / 3;
        const truncate: string = sum.toFixed(3);

        if (history.length < 5) {
            return "-Less than 5 solves-";
        } else {
            return truncate;
        }
    }

    // calculates average of 12
    function updateAO12() {
        let min: number = getTimeAsInt(0);
        let max: number = getTimeAsInt(0);
        let sum: number = 0;
        for (let i = Math.max(0, history.length - 12); i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / 10;
        const truncate: string = sum.toFixed(3);

        if (history.length < 12) {
            return "-Less than 12 solves-";
        } else {
            return truncate;
        }
    }

    // calculates average of 100
    function updateAO100() {
        let min: number = getTimeAsInt(0);
        let max: number = getTimeAsInt(0);
        let sum: number = 0;
        for (let i = Math.max(0, history.length - 100); i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / 98;
        const truncate: string = sum.toFixed(3);

        if (history.length < 100) {
            return "-Less than 100 solves-";
        } else {
            return truncate;
        }
    }

    // calculates session average
    function updateSA() {
        let min: number = getTimeAsInt(0);
        let max: number = getTimeAsInt(0);
        let sum: number = 0;
        for (let i = 0; i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / (history.length - 2);
        const truncate: string = sum.toFixed(3);

        if (history.length < 3) {
            return "-Min. 3 Solves-";
        } else {
            return truncate;
        }
    }

    // calculates best time
    function updatePB() {
        let min: number = getTimeAsInt(0);
        for (let i: number = 0; i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
        }
        if (history.length < 1) {
            return "-No Solves-"
        }
        return "" + min;
    }

    //parses time to int given an index of the history array
    function getTimeAsInt(index: number): number {
        if (index < 0 || index >= history.length || !history[index]) {
            return 0;
        }

        const time: string = history[index];
        const minutesStr: string = time.substring(0, 2);
        const secondsStr: string = time.substring(3, 5);
        const msStr: string = time.substring(6);

        const minutes: number = parseInt(minutesStr);
        const seconds: number = parseInt(secondsStr);
        const ms: number = parseInt(msStr);

        const timeInSec: number = (minutes * 60) + seconds + (ms / 100);

        return timeInSec;
    }

    function switchTimeToString(time: number) {
        let useTime: number = time;
        let minutes: number = Math.floor(useTime / 60);
        useTime = useTime % 60;

        const minutesStr: string = minutes < 10 ? "0" + minutes : "" + minutes;

        return useTime < 10 ? minutesStr + ":0" + useTime.toFixed(2) : minutesStr + ":" + useTime.toFixed(2);
    }

    const timesTable = history.map((time, index) => {
        return (
            <tr className="border-b-1" key={index}>
                <td id="solve-number" className="bg-[#B47C32] text-center"> { index + 1} </td>
                <td id="solve-time" className="bg-[#B47C32] text-center"> { time } </td>
            </tr>
        )
    });
        

    return (
    <>
        <div id="container" className="grid bg-[#808080] grid-rows-[15vh_25vh_25vh_25vh_10vh] grid-cols-[22vw_22vw_22vw_22vw_12vw] h-full min-h-full w-full gap-0 m-0">
            {/* TITLE */}
            <div id="grid-item1" className="bg-[#add8e6] row-start-1 row-end-2 col-start-1 col-end-6 text-center">
                <h1>CC-Timer</h1>   
            </div>

            {/* DISPLAYS TIMES & STATS */}
            <div id="grid-item2" className="bg-[#008000] row-start-2 row-end-5 col-start-1 col-end-2 border-1 border-black">
                <div id="statistics" className="h-[40%]">
                    <p>Ao5: { averageFive }</p>
                    <p>Ao12: { averageTwelve }</p>
                    <p>Ao100: { averageHundred }</p>
                    <p>Session Avg: { sessionAvg }</p>
                    <p>Best Time: { pb }</p>
                </div>

                <div id="times-table" className="overflow-y-scroll h-[60%]">
                    <table id="times-table-list" className="overflow-y-scroll h-[27px] w-full">
                        <thead>
                            <tr>
                                <th className="border-b-1 text-center">#</th>
                                <th className="border-b-1 text-center">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            { timesTable }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* STOPWATCH & SCRAMBLE */}
            <div id="grid-item3" className="bg-[#FAEBD7] flex flex-col row-start-2 row-end-5 col-start-2 col-end-5">

                <div id="scramble" className="h-[25%] border-1 m-0 flex justify-center items-center text-md">
                    <h1 className="text-center">{scramble}</h1>
                </div>

                <div id="stopwatch" className="h-[75%] border-1 flex justify-center items-center">
                    <h1 id="stopwatch-time" className="text-xl">{format(time)}</h1>
                </div>

            </div>

            {/* SETTINGS */}
            <div id="grid-item4" className=" bg-[#FFA07A] row-start-2 row-end-5 col-start-5 col-end-6 overflow-hidden">
                <button className="w-[95%] h-[31%] rounded-[10px] my-1 mx-1 bg-blue-500" onClick={addTwoSeconds} onMouseUp={(e) => e.currentTarget.blur()} ><h1>+2</h1></button>
                <button className="w-[95%] h-[31%] rounded-[10px] my-1 mx-1" onClick={removeSingle} onMouseUp={(e) => e.currentTarget.blur()} ><h1>Delete Single</h1></button>
                <button className="w-[95%] h-[31%] rounded-[10px] my-1 mx-1" onClick={clearAll} onMouseUp={(e) => e.currentTarget.blur()} ><h1>Clear All</h1></button>
            </div>

            {/* FOOTER */}
            <div id="grid-item5" className="bg-[#DAC420] row-start-5 row-end-6 col-start-1 col-end-6">
                <p>Made using React.ts</p>
            </div>
        </div>
    </>
    );
}


// function that randomly generates a rubik's cube scramble of length 20 with no repeating same-orientation moves
function createScramble(): string {
    const possibleMoves = [ ["F", "F'", "F2"], ["B", "B'", "B2"], ["L", "L'", "L2"], ["R", "R'", "R2"], ["U", "U'", "U2"], ["D", "D'", "D2"] ];
    let scramble: string = "";
    let n: number = 0;
    let prevRowIndex: number = -1;

    while (n < 20) {
        let currRowIndex: number = Math.floor((Math.random() * 6));
        let currColIndex: number = Math.floor((Math.random() * 3));
        
        /*
            if currRowIndex is equal to prevRowIndex, move on like nothing happened so that no repeat orientation moves are possible
            if currRowIndex is NOT equal to prevRowIndex, then append to scramble
        */
        if (currRowIndex !== prevRowIndex) {
            scramble += "" + possibleMoves[currRowIndex][currColIndex] + " ";
            n++;
        }
        
        // always set the prevRowIndex
        prevRowIndex = currRowIndex;
    }

    return scramble;
}

